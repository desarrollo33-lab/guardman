// Descompone el 52% repetido: qué bloques concretos se replican entre communes
// del mismo servicio, y cuánto de ese repetido es "andamiaje del template"
// (que no debería existir) vs "copy real duplicado" (que sí es un problema).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'dist/client/servicios';

const visible = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const svc = 'guardias-de-seguridad';
const dir = join(RAIZ, svc);
const paginas = readdirSync(dir)
  .map((n) => join(dir, n, 'index.html'))
  .filter((f) => existsSync(f) && statSync(f).isFile())
  .map((f) => ({ nombre: f.replace(/\\/g, '/').split('/').slice(-2)[0], texto: visible(readFileSync(f, 'utf8')) }));

console.log(`${svc}: ${paginas.length} paginas\n`);

// Oraciones que aparecen en MAS DE LA MITAD de las paginas del servicio:
// ese es el bloque que no depende de la comuna.
const conteo = new Map();
for (const p of paginas) {
  const frases = new Set(p.texto.split(/(?<=[.!?:])\s+/).map((s) => s.trim()).filter((s) => s.length > 45));
  for (const f of frases) conteo.set(f, (conteo.get(f) || 0) + 1);
}
const umbral = Math.ceil(paginas.length / 2);
const compartidas = [...conteo.entries()].filter(([, c]) => c >= umbral).sort((a, b) => b[1] - a[1]);

console.log(`Frases en ${umbral}+ de ${paginas.length} paginas: ${compartidas.length}`);
let palabras = 0;
for (const [f, c] of compartidas) {
  const n = f.split(' ').length;
  palabras += n;
  console.log(`  [${c}x ${n}pal] ${f.slice(0, 150)}`);
}
console.log(`\nPalabras en frases compartidas: ${palabras}`);

// Ahora, el contraste: qué SÍ es unico de cada comuna.
console.log('\n--- Lo que sí cambia por comuna (muestra de 2) ---');
for (const p of [paginas[0], paginas[1]]) {
  const suyas = new Set(p.texto.split(/(?<=[.!?:])\s+/).map((s) => s.trim()).filter((s) => s.length > 45));
  const unicas = [...suyas].filter((f) => (conteo.get(f) || 0) === 1);
  console.log(`\n[${p.nombre}] frases unicas: ${unicas.length}`);
  for (const f of unicas.slice(0, 5)) console.log(`  - ${f.slice(0, 160)}`);
}
