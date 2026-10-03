// Mide el grafo de enlaces del HTML construido: inlinks contextuales por página
// y páginas débiles. Complementa al verificador, que solo valida umbrales duros.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist/client';
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const f = join(d, n);
    return statSync(f).isDirectory() ? walk(f) : n.endsWith('.html') ? [f] : [];
  });

const pages = new Map();
for (const f of walk(DIST)) {
  const r = relative(DIST, f).replace(/\\/g, '/').replace(/\/index\.html$/, '').replace(/\.html$/, '');
  pages.set('/' + (r || '').replace(/^\/+/, ''), readFileSync(f, 'utf8'));
}

const norm = (h) => {
  const p = h.split('#')[0].split('?')[0].replace(/\/+$/, '');
  return p || '/';
};
const clean = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');

const inb = new Map([...pages.keys()].map((k) => [k, new Set()]));
for (const [route, h] of pages) {
  for (const m of clean(h).matchAll(/<a\b[^>]*href\s*=\s*["'](\/[^"'#?]*)["']/gi)) {
    const t = norm(m[1]);
    if (pages.has(t) && t !== route) inb.get(t).add(route);
  }
}

const fam = (p) =>
  p.startsWith('/servicios/') && p.split('/').filter(Boolean).length === 3 ? 'svc-loc' :
  p.startsWith('/servicios/') ? 'svc' : p.startsWith('/sectores/') ? 'sect' :
  p.startsWith('/guias/') ? 'guia' : p.startsWith('/seguridad-privada/') ? 'sp' :
  p.startsWith('/soluciones/') ? 'sol' : p.startsWith('/ubicaciones/') ? 'ubi' : 'util';

const weak = [...pages.keys()].filter((p) => p !== '/' && inb.get(p).size <= 2);
const orphan = [...pages.keys()].filter((p) => p !== '/' && inb.get(p).size === 0);

console.log(`Páginas en dist: ${pages.size}`);
console.log(`Con 0 inlinks contextuales (huérfanas): ${orphan.length}`, orphan);
console.log(`Con <=2 inlinks contextuales: ${weak.length}`);
const g = {};
weak.forEach((p) => (g[fam(p)] = (g[fam(p)] || 0) + 1));
console.log('  por familia:', g);

// Reparto de inlinks: una media alta con una cola larga es normal; lo que
// importa es si la cola existe.
const counts = [...pages.keys()].filter((p) => p !== '/').map((p) => inb.get(p).size);
counts.sort((a, b) => a - b);
console.log(`  mediana: ${counts[Math.floor(counts.length / 2)]}, p10: ${counts[Math.floor(counts.length * 0.1)]}, max: ${counts[counts.length - 1]}`);
if (weak.length) console.log('\n  ejemplos:\n    ' + weak.slice(0, 15).join('\n    '));
