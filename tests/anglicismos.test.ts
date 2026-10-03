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

for (const file of [...walk('src'), ...TAMBIEN.map((f) => f)]) {
  const rel = file.replace(/\\/g, '/');
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((linea, i) => {
    // El seed es copy casi entero: sus "comentarios" son notas para el admin
    // y el CODIGO los dejaría pasar.
    const esSeed = rel.includes('seed-guardpod-questions');
    for (const m of linea.matchAll(/'([^']{6,})'|"([^"]{6,})"/g)) {
      const texto = m[1] ?? m[2] ?? '';
      if (!/[a-zA-Z]/.test(texto)) continue;
      for (const [pat, esp] of ANGLICISMOS) {
        const re = w(pat);
        re.lastIndex = 0;
        for (const g of texto.matchAll(re)) {
          if (PROPIAS.test(g[0])) continue;
          if (DISCRIMINADOR.test(linea)) continue;
          if (DIRECCION.test(texto)) continue;
          if (!esSeed && CODIGO.test(linea)) { excepcionesVistas.add(`${g[0]}  ←  ${rel}:${i + 1}`); continue; }
          offenders.push(`${rel}:${i + 1}  "${g[0]}" → ${esp}   …${texto.slice(Math.max(0, g.index - 40), g.index + g[0].length + 40)}…`);
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
