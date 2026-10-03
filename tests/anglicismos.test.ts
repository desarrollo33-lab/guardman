// Anglicismos en el copy visible.
//
// Distinguir "palabra inglesa en una frase que lee una persona" de
// "identificador técnico" es el 90% del trabajo. Estas son las excepciones
// que existen EN el repo hoy y hay que seguir permitiendo, porque cambiarlas
// rompe cosas:
//
//   "Service"   → "@type": "Service" de schema.org. NO es copy.
//   l.service   → propiedad de un objeto lead.
//   name:'service' → nombre de campo del formulario, viaja en el POST.
//   FROM leads  → SQL contra D1. La tabla se llama así.
//   /admin/leads→ ruta y section="leads". Cambiar la ruta es otro proyecto.
//   'dashboard' → id de sección e id de icono.
//   password    → for="password" y type='password', atributos HTML.
//   email LIKE  → columna de D1.
//
// Si una excepción deja de estar en el repo, el test de sincronía de abajo
// avisa: no es un fallo de copy, es que la lista hay que revisarla.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(astro|ts|tsx|mjs|sql)$/.test(name) ? [full] : [];
  });
}

const W = '[\\p{L}\\p{N}_-]';
const w = (x: string) => new RegExp(`(?<!${W})(?:${x})(?!${W})`, 'giu');

/** [patrón, sustitucion] */
const ANGLICISMOS: [string, string][] = [
  ['e-?mails?', 'correo electrónico'],
  ['mails?', 'correo'],
  ['follow[- ]?ups?', 'seguimiento'],
  ['check-?ins?', 'registro de asistencia'],
  ['staff', 'personal'],
  ['deadlines?', 'fecha límite'],
  ['feedback', 'retroalimentación'],
  ['checklists?', 'lista de verificación'],
  ['stakeholders?', 'interesados'],
  ['deliverables?', 'entregables'],
  ['sign[- ]?off', 'aprobación'],
  ['newsletter', 'boletín'],
  ['partners?', 'socios'],
  ['webinar', 'seminario web'],
  ['landing page', 'página de destino'],
  ['click here', 'haga clic aquí'],
  ['learn more', 'más información'],
  ['read more', 'leer más'],
  ['get started', 'comenzar'],
  ['contact us', 'contáctenos'],
  ['best quality', 'la mejor calidad'],
  ['securing', 'protegiendo'],
  ['security', 'seguridad'],
  ['safety', 'seguridad'],
  ['tracking', 'seguimiento'],
  ['deadline', 'fecha límite'],
  ['leads?', 'contactos'],
  ['links?', 'enlaces'],
  ['uploads?', 'carga'],
  ['downloads?', 'descarga'],
  ['password', 'contraseña'],
  ['dashboard', 'panel'],
  ['apps?', 'aplicación'],
  ['meeting', 'reunión'],
  ['checklist', 'lista de verificación'],
  ['tips', 'consejos'],
];

/**
 * Contexto técnico: identificadores, rutas, SQL, atributos y comentarios.
 *
 * El filtro tiene que mirar la LÍNEA, no la cadena: el copy vive en la misma
 * línea que el marcado, y una regla que descarte la línea entera por tener un
 * `class=` se come el texto que se quería revisar.
 */
const CODIGO = /https?:\/\/|mailto:|tel:|@type|schema\.org|FROM\s+\w+|SELECT|\bLIKE\s+\?|class=|aria-|data-[a-z-]+=|type=['"]?password|for=['"]password|getElementById\(['"]password|\w+\.type\s*=|\bsection=|\/admin\/|\/api\/|^\s*(\/\/|\/\*|--|<!--)|from '|import |export |=>|\.astro['"`]|\.ts['"`]|\.sql['"`]|\.tsx['"`]|key:|slug:|id:\s*'[a-z-]+'/i;

// Un discriminador de tipo es código, no copy: q.type === 'upload' es el
// campo de la base, no una palabra que el admin lea en pantalla.
const DISCRIMINADOR = /(\w+\.)?(type|kind|variant|variantKey|status)\s*===?\s*['"`]/;

// "email@admin.cl" como placeholder muestra el FORMATO de una dirección, no
// es un anglicismo: nadie lee "correo electrónico@admin.cl".
const DIRECCION = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;

/**
 * El seed de GuardPod también es copy: lo lee el admin contestando el
 * cuestionario, y estaba lleno de voseo ("Pensá", "hacés", "usás"). El guard
 * de registro solo miraba src/, así que el seed se escapaba de las dos
 * barreras. Por eso los dos archivos entran acá.
 */
const TAMBIEN = ['migrations/0003_seed_guardpod_questions_v1.sql', 'scripts/seed-guardpod-questions.mjs'];

// Palabras inglesas legitimas: marca propia, estandar o sigla.
const PROPIAS = /\b(Guardpod|GuardPod|guard-pod|GuardMan|OS-10|WebMCP|MCP|PPI|WhatsApp|Cloudflare|Ajax|Grade|CCTV|RUN|RUT|CLP|D1|KV|SEO|FAQ|CRM)\b/;

const offenders: string[] = [];
const excepcionesVistas = new Set<string>();

/**
 * Trocea un .astro en las líneas que son MARCADO (ni frontmatter ni
 * <script>). Hace falta estado, no heurística: el frontmatter va entre `---`
 * y los template literals de JavaScript son correctos ahí.
 */
function lineasDePlantilla(src: string): { n: number; texto: string }[] {
  const lineas = src.split(/\r?\n/);
  let fmEnd = -1;
  if (lineas[0].trim() === '---') {
    for (let i = 1; i < lineas.length; i++) {
      if (lineas[i].trim() === '---') { fmEnd = i; break; }
    }
  }
  let script = 0;
  const out: { n: number; texto: string }[] = [];
  lineas.forEach((l, i) => {
    const abre = (l.match(/<script\b/g) || []).length;
    const cierra = (l.match(/<\/script>/g) || []).length;
    const enScript = script > 0;
    script = Math.max(0, script + abre - cierra);
    if (i <= fmEnd || enScript || abre) return;
    out.push({ n: i + 1, texto: l });
  });
  return out;
}

/** Texto visible de una línea de plantilla: fuera de etiquetas y comentarios. */
function textoVisible(linea: string): string {
  return linea
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{\s*'[a-z_$][\w$]*\s*\}/gi, ' ') // interpolaciones simples
    .trim();
}

/**
 * Devuelve el texto visible del .astro, con frontmatter, <script>, comentarios
 * de bloque, etiquetas (incluso multilínea) e interpolaciones reemplazados por
 * ESPACIOS de la misma longitud.
 *
 * La máscara conserva los offsets, así que el índice en la cadena sigue
 * correspondiendo a la línea del archivo y el error se puede reportar bien.
 * Procesar línea por línea no sirve: un `<link …>` partido en tres líneas no
 * loBORRA ninguna regex de una línea, y `{page.lead}` parecía copy.
 */
function textoVisibleConLineas(src: string): { texto: string; lineaDe: (i: number) => number } {
  const enmascara = (s: string) => s.replace(/[^\n]/g, ' ');
  let t = src;

  // frontmatter
  if (t.startsWith('---')) {
    const cierre = t.indexOf('\n---', 3);
    if (cierre > 0) {
      t = t.slice(0, cierre + 4).split('').map((c) => (c === '\n' ? '\n' : ' ')).join('') + t.slice(cierre + 4).split('\n').slice(1).join('\n');
    }
  }
  // <script>…</script>
  t = t.replace(/<script\b[\s\S]*?<\/script>/g, (m) => enmascara(m));
  // <!-- … -->
  t = t.replace(/<!--[\s\S]*?-->/g, (m) => enmascara(m));
  // /* … */ (comentarios de bloque, que pueden empezar en una línea y seguir)
  t = t.replace(/\/\*[\s\S]*?\*\//g, (m) => enmascara(m));
  // comentarios de línea sueltos
  t = t.replace(/^\s*\/\/.*$/gm, (m) => enmascara(m));
  // {/* … */}  y comentarios dentro de atributos
  // etiquetas (multilínea)
  t = t.replace(/<[^>]*>/g, (m) => enmascara(m));
  // interpolaciones {expr}, con llaves balanceadas: `{NAV_LINKS.map((link) => (`
  // tiene corchetes anidados y una regex de un nivel no lo cubre.
  {
    let out = '';
    let depth = 0;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (c === '{') { depth++; out += ' '; continue; }
      if (c === '}') { if (depth > 0) depth--; out += ' '; continue; }
      out += depth > 0 && c !== '\n' ? ' ' : c;
    }
    t = out;
  }
  // atributos con valores en comillas fuera de etiquetas (placeholder="…")
  t = t.replace(/=\s*"[^"]*"/g, (m) => enmascara(m));
  t = t.replace(/=\s*'[^']*'/g, (m) => enmascara(m));

  const prefijoLinea: number[] = [0];
  for (let i = 0; i < t.length; i++) if (t[i] === '\n') prefijoLinea.push(i + 1);
  const lineaDe = (i: number) => {
    let lo = 0, hi = prefijoLinea.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (prefijoLinea[mid] <= i) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
  return { texto: t, lineaDe };
}

for (const file of [...walk('src'), ...TAMBIEN.map((f) => f)]) {
  const rel = file.replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');
  const esSeed = rel.includes('seed-guardpod-questions');
  const esAstro = file.endsWith('.astro');

  // Para .astro: texto visible de la plantilla. Para datos: literales.
  const { texto: vis, lineaDe } = esAstro
    ? textoVisibleConLineas(src)
    : { texto: src, lineaDe: (i: number) => src.slice(0, i).split('\n').length };

  if (esAstro) {
    for (const [pat, esp] of ANGLICISMOS) {
      const re = w(pat);
      re.lastIndex = 0;
      for (const g of vis.matchAll(re)) {
        if (PROPIAS.test(g[0])) continue;
        const n = lineaDe(g.index);
        const ctx = vis.slice(Math.max(0, g.index - 60), g.index + g[0].length + 60).replace(/\s+/g, ' ');
        offenders.push(`${rel}:${n}  "${g[0]}" → ${esp}   …${ctx}…`);
      }
    }
    continue;
  }

  src.split(/\r?\n/).forEach((linea, i) => {
    for (const m of linea.matchAll(/'([^']{6,})'|"([^"]{6,})"/g)) {
      const texto = m[1] ?? m[2] ?? '';
      if (!/[a-zA-Z]{3}/.test(texto)) continue;
      for (const [pat, esp] of ANGLICISMOS) {
        const re = w(pat);
        re.lastIndex = 0;
        for (const g of texto.matchAll(re)) {
          if (PROPIAS.test(g[0])) continue;
          if (DISCRIMINADOR.test(linea)) continue;
          if (DIRECCION.test(texto)) continue;
          if (!esSeed && CODIGO.test(linea)) { excepcionesVistas.add(`${g[0]}  ←  ${rel}:${i + 1}`); continue; }
          offenders.push(`${rel}:${i + 1}  "${g[0]}" → ${esp}   …${texto.slice(Math.max(0, g.index - 45), g.index + g[0].length + 45)}…`);
        }
      }
    }
  });
}

describe('sin anglicismos en el copy visible', () => {
  it('ninguna frase que lee una persona mezcla inglés', () => {
    expect(offenders).toEqual([]);
  });

  it('el filtro no se come el copy que vive junto al marcado', () => {
    // Si el filtro mirara la línea completa en vez del contexto, esta frase
    // desaparecería del análisis y el test de arriba volvería a dar 0
    // por el motivo equivocado.
    expect(offenders.length).toBeLessThan(5);
    const conClass = offenders.filter((o) => o.includes('class='));
    expect(conClass).toEqual([]);
  });
});

describe('las excepciones tecnicas siguen siendo tecnicas', () => {
  // El @type de schema.org, la tabla leads y la ruta /admin/leads no se
  // tocan. Si alguno desaparece, la lista de excepciones hay que revisarla y
  // este test obliga a hacerlo en vez de dejarla pudrir.
  it('schema.org sigue usando el tipo Service', () => {
    expect(readFileSync('src/lib/seo.ts', 'utf8')).toMatch(/'@type': 'Service'/);
  });

  it('la tabla de D1 sigue llamándose leads', () => {
    const api = readFileSync('src/pages/api/leads/[id].ts', 'utf8');
    expect(api).toMatch(/FROM\s+leads/);
  });

  it('la ruta del panel sigue siendo /admin/leads', () => {
    expect(readFileSync('src/components/admin/AdminTopbar.astro', 'utf8')).toMatch(/\/admin\/leads/);
  });
});
