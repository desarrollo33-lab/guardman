// Verificación de linking interno sobre el HTML construido.
//
// Complementa a `tests/internal-links.test.ts`: ese test valida el mapa y el
// código fuente; este valida lo que realmente sale a producción. La diferencia
// importa — un mapeo correcto puede no llegar al HTML si la plantilla pide el
// puente con una variable equivocada. Ya pasó: `SERVICE_BRIDGE[svc.slug]` en
// /servicios/[slug], donde `svc` es el contenido y el slug se llama `slug`, y
// el bloque salía vacío en las 11 páginas de servicio sin que nada fallara.
//
// Uso:  node scripts/verify-internal-links.mjs
// Sale con código 1 si algo no cuadra, para poder encadenarlo tras cada build.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist/client';
const FAILURES = [];
const fail = (msg) => FAILURES.push(msg);

if (!existsSync(DIST)) {
  console.error('No existe dist/client. Ejecuta `npm run build` primero.');
  process.exit(1);
}

/** Rutas prerenderizadas a un archivo HTML. */
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return name.endsWith('.html') ? [full] : [];
  });
}

const files = walk(DIST);
const pages = new Map(); // ruta -> html
for (const f of files) {
  let rel = relative(DIST, f).replace(/\\/g, '/').replace(/\/index\.html$/, '').replace(/\.html$/, '');
  rel = rel || '';
  // `relative()` no devuelve slash inicial; las claves siempre empiezan con "/".
  pages.set('/' + rel.replace(/^\/+/, ''), readFileSync(f, 'utf8'));
}

// Rutas que se renderizan en el worker y no llegan a dist/client. Para
// verificarlas hace falta un servidor: `node scripts/verify-internal-links.mjs
// --url=http://localhost:8788` las trae por HTTP.
const SSR_ROUTES = new Set([
  '/', '/ajax-systems', '/canal-de-denuncias', '/contacto', '/cotizacion',
  '/gracias', '/guard-pod', '/nosotros', '/privacidad', '/terminos',
  '/servicios', '/sectores', '/ubicaciones',
]);
const BASE = (process.argv.find((a) => a.startsWith('--url=')) ?? '').slice(6) || null;
async function fetchSsr(route) {
  if (!BASE) return null;
  try {
    const r = await fetch(BASE + route, { headers: { 'user-agent': 'verify-internal-links' } });
    return r.ok ? await r.text() : null;
  } catch {
    return null;
  }
}

const getPage = async (route) => pages.get(route) ?? (await fetchSsr(route));

const anchorsOf = (h) =>
  [...h.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({
    href: m[1],
    text: m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
  }));

const norm = (h) => {
  const p = h.split('#')[0].split('?')[0].replace(/\/+$/, '');
  return p || '/';
};

// ── 1. Integridad: ningún href interno apunta a una ruta que no existe ───────
const inSitemap = new Set(pages.keys());
// Rutas SSR: no prerenderizan, pero existen.
const known = (p) => inSitemap.has(p) || SSR_ROUTES.has(p);

// Cuando hay servidor, las rutas SSR también entran al chequeo de integridad.
if (BASE) {
  for (const r of SSR_ROUTES) {
    const h = await fetchSsr(r);
    if (h && !pages.has(r)) pages.set(r, h);
  }
}

for (const [route, h] of pages) {
  for (const a of anchorsOf(h)) {
    if (!a.href.startsWith('/')) continue;
    if (/\.(svg|png|jpe?g|webp|gif|ico|css|js|xml|txt|json|webm|mp4|pdf|woff2?)$/i.test(a.href)) continue;
    const p = norm(a.href);
    if (!known(p)) fail(`404  ${route} → "${a.href}" (texto: "${a.text}")`);
  }
}

// ── 2. Puentes presentes: cada familia editorial y comercial enlaza al otro lado
// El widget canónico es RelatedLinks, identificado por su `odId`. Se cuenta el
// bloque completo en vez de una clase de enlace, para que el check no dependa
// del markup interno del widget.
const bridgeCount = (h) => {
  const m = h.match(/<section[^>]*data-od-id="block-bridge"[\s\S]*?<\/section>/);
  if (!m) return 0;
  return (m[0].match(/<a\b[^>]*href=/g) ?? []).length;
};

const editorial = [
  ...pages.keys().filter((p) => p.startsWith('/guias/') && p !== '/guias'),
  ...pages.keys().filter((p) => p.startsWith('/seguridad-privada/') && p !== '/seguridad-privada'),
  ...pages.keys().filter((p) => p.startsWith('/soluciones/') && p !== '/soluciones'),
];
const comercial = [
  ...pages.keys().filter((p) => p.startsWith('/servicios/') && p !== '/servicios'),
  ...pages.keys().filter((p) => p.startsWith('/sectores/') && p !== '/sectores'),
];

for (const p of editorial) {
  if (bridgeCount(pages.get(p)) === 0) fail(`editorial sin puente: ${p}`);
}
for (const p of comercial) {
  if (bridgeCount(pages.get(p)) === 0) fail(`comercial sin puente: ${p}`);
}

// ── 3. La home enlaza a la capa editorial ───────────────────────────────────
const homeHtml = pages.get('/');
const homeEditorial = homeHtml ? anchorsOf(homeHtml).filter((a) =>
  /^\/(guias\/|seguridad-privada|soluciones)/.test(norm(a.href)),
) : null;
if (homeEditorial && homeEditorial.length === 0) fail('la home no enlaza a ninguna página editorial');

// ── 4. Los hubs son alcanzables desde el menú, no solo desde el footer ──────
for (const hub of ['/servicios', '/ubicaciones', '/sectores']) {
  const hubHtml = pages.get(hub);
  if (!hubHtml) continue;
  const navHit = new RegExp(`<nav[^>]*>[\\s\\S]*?href="${hub}"[\\s\\S]*?</nav>`).test(hubHtml);
  if (!navHit) fail(`el hub ${hub} no aparece dentro del <nav>`);
}

// ── 5. Anchors: los hubs no deben depender de una sola variante de texto ───
for (const hub of ['/servicios', '/ubicaciones', '/sectores', '/guias', '/soluciones', '/seguridad-privada']) {
  const variants = new Set();
  for (const h of pages.values()) {
    for (const a of anchorsOf(h)) if (norm(a.href) === hub) variants.add(a.text);
  }
  if (variants.size <= 1) fail(`${hub} recibe un solo anchor ("${[...variants][0] ?? ''}")`);
}

// ── Informe ────────────────────────────────────────────────────────────────
console.log(`Páginas construidas revisadas: ${pages.size}`);
console.log(`  editoriales con puente: ${editorial.filter((p) => bridgeCount(pages.get(p)) > 0).length}/${editorial.length}`);
console.log(`  comerciales con puente: ${comercial.filter((p) => bridgeCount(pages.get(p)) > 0).length}/${comercial.length}`);
console.log(
  homeEditorial === null
    ? '  enlaces editoriales desde la home: no verificado (la home es SSR; usa --url)'
    : `  enlaces editoriales desde la home: ${homeEditorial.length}`,
);

if (FAILURES.length) {
  console.error(`\n${FAILURES.length} problema(s):`);
  for (const f of FAILURES.slice(0, 40)) console.error('  - ' + f);
  if (FAILURES.length > 40) console.error(`  … y ${FAILURES.length - 40} más`);
  process.exit(1);
}
console.log('\nOK: linking interno consistente.');
