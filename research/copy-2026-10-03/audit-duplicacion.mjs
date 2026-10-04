// Mide la duplicación real de las páginas combo (servicio × comuna).
//
// No estima: mide. Compara el texto visible de cada página contra el de sus
// hermanas y separa el bloque que ES del servicio del bloque que VARÍA por
// comuna. El número que interesa para decidir entre "escribir 176 variantes" y
// "dejar de indexarlas" es el porcentaje que no cambia entre dos communes del
// mismo servicio.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'dist/client/servicios';

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const f = join(d, n);
    return statSync(f).isDirectory() ? walk(f) : n === 'index.html' ? [f] : [];
  });

const visible = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const palabras = (t) => t.split(' ').filter(Boolean);

/** Jaccard sobre shingles de 5 palabras: más estable que palabras sueltas. */
function shingles(t, n = 5) {
  const w = palabras(t);
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
  return s;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Fracciones que se repiten entre las dos páginas, en el orden en que aparecen. */
function bloqueComun(a, b) {
  const pa = a.split(/(?<=\.)\s+/);
  const pb = new Set(b.split(/(?<=\.)\s+/));
  return pa.filter((f) => pb.has(f) && f.length > 40);
}

const porServicio = {};

for (const dir of readdirSync(RAIZ)) {
  const full = join(RAIZ, dir);
  if (!statSync(full).isDirectory()) continue;
  const paginas = walk(full).map((f) => ({
    ruta: f.replace(/\\/g, '/'),
    texto: visible(readFileSync(f, 'utf8')),
  }));
  if (paginas.length < 2) continue;

  const sh = paginas.map((p) => shingles(p.texto));

  // Cada pagina contra el promedio de sus hermanas.
  const sims = [];
  for (let i = 0; i < paginas.length; i++) {
    const otros = sh.filter((_, k) => k !== i);
    const union = new Set();
    for (const o of otros) for (const x of o) union.add(x);
    let inter = 0;
    for (const x of sh[i]) if (union.has(x)) inter++;
    const sim = union.size ? inter / (sh[i].size + union.size - inter) : 0;
    sims.push({ ...paginas[i], sim });
  }

  // Par de referencia: la primera contra la segunda.
  const comun = bloqueComun(paginas[0].texto, paginas[1].texto);
  const palabrasComunes = comun.join(' ').split(' ').filter(Boolean).length;

  porServicio[dir] = {
    paginas: paginas.length,
    palabrasPromedio: Math.round(paginas.reduce((a, p) => a + palabras(p.texto).length, 0) / paginas.length),
    similitudContraHermanas: {
      min: Math.round(Math.min(...sims.map((s) => s.sim)) * 100),
      promedio: Math.round((sims.reduce((a, s) => a + s.sim, 0) / sims.length) * 100),
      max: Math.round(Math.max(...sims.map((s) => s.sim)) * 100),
    },
    palabrasRepetidasContraHermana: palabrasComunes,
    ejemploComun: comun.slice(0, 2),
  };
}

// Resumen global.
let totalPag = 0, totalPalabras = 0, totalRepetidas = 0;
const filas = [];
for (const [svc, d] of Object.entries(porServicio)) {
  totalPag += d.paginas;
  totalPalabras += d.paginas * d.palabrasPromedio;
  totalRepetidas += d.paginas * d.palabrasRepetidasContraHermana;
  filas.push([svc, d.paginas, d.palabrasPromedio, d.similitudContraHermanas.promedio, d.palabrasRepetidasContraHermana]);
}
filas.sort((a, b) => b[4] - a[4]);

console.log('servicio'.padEnd(24), 'pags', 'palabras', 'similitud', 'repetidas');
for (const [svc, p, pal, sim, rep] of filas) {
  console.log(svc.padEnd(24), String(p).padStart(4), String(pal).padStart(8), String(sim + '%').padStart(10), String(rep).padStart(10));
}
console.log('');
console.log('TOTAL paginas:', totalPag);
console.log('palabras visibles totales:', totalPalabras);
console.log('palabras repetidas vs la hermana:', totalRepetidas, `(${(totalRepetidas / totalPalabras * 100).toFixed(1)}%)`);

writeFileSync('research/copy-2026-10-03/AUDIT-DUPLICACION.json', JSON.stringify(porServicio, null, 2));
