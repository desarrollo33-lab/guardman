// scripts/reencode-images.mjs — re-encoda los assets que Lighthouse报告会 por
// peso/compresión. Idempotente: la primera corrida guarda el original en
// .reenc-src/ y siempre encodea desde ahí, así re-correr no recomprime dos veces.
//
// Los quality no son gusto: son el punto donde el"Heurística de compresión" de
// Lighthouse deja de pedir más compresión (medido con sonda, ver el reporte).
//   q50 fotos de tarjeta/decorativas  · q55 hero full-bleed (y es el LCP)
//   q45 poster sobre fondo casi negro y firma detrás de overlay
import sharp from 'sharp';
import { mkdirSync, copyFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const SRC_DIR = '.reenc-src';

const TARGETS = [
  // Sectores: todos a 400x225 (16:9). Deportivo venía en 1280x720/68 KB,
  // eventos en 294x175 — misma caja, tres tamaños distintos.
  ...readdirSync('public/images')
    .filter((f) => /^sector-.*\.webp$/.test(f))
    .map((f) => ({ file: `public/images/${f}`, width: 400, height: 225, quality: 50 })),
  // Servicios que quedaron en 294x175 y se ven blandos en la caja de 362x180.
  ...['guardias-de-seguridad', 'seguridad-industrial', 'auditoria-seguridad', 'seguridad-eventos', 'escoltas-privados', 'monitoreo-24-7']
    .map((s) => ({ file: `public/images/service-${s}.webp`, width: 400, height: 225, quality: 50 })),
  // Hero = elemento LCP y full-bleed, pero va con opacity:.3 detrás de un
  // gradiente: no necesita más calidad que q55.
  { file: 'public/images/hero-480.webp', quality: 55 },
  { file: 'public/images/hero-824.webp', quality: 55 },
  { file: 'public/images/hero-1280.webp', quality: 55 },
  { file: 'public/images/hero-1920.webp', quality: 55 },
  { file: 'public/images/nosotros_seccion.webp', quality: 50 },
  // Paso extra para DPR 1 (mobile y desktop caben en ~552 px de caja).
  { file: 'public/images/nosotros_seccion-560.webp', from: 'public/images/nosotros_seccion.webp', width: 560, quality: 50 },
  { file: 'public/images/flota/portada-residencial-560.webp', quality: 50 },
  { file: 'public/images/flota/portada-residencial-800.webp', quality: 50 },
  { file: 'public/images/equipo/firma-contrato.webp', quality: 45 },
  // Poster: se muestra en una caja de 364x489 CSS. A DPR 1.75 el tamaño
  // eficiente es 637x855, así que 824x1106 es sobredimensionado: 700x940
  // sigue sharpness a DPR 2 y deja de ser "más grande de lo necesario".
  { file: 'public/videos/guardpod-home-poster.webp', width: 700, height: 940, quality: 45 },
];

const pristine = (file) => {
  const keep = resolve(SRC_DIR, file);
  if (!existsSync(keep)) {
    mkdirSync(dirname(keep), { recursive: true });
    copyFileSync(file, keep);
  }
  return keep;
};

let before = 0;
let after = 0;
console.log('archivo'.padEnd(46) + 'antes'.padStart(9) + 'después'.padStart(10) + '   ahorro');
for (const t of TARGETS) {
  const src = t.from ?? t.file;
  const input = pristine(src);
  const b = statSync(input).size / 1024;
  let pipeline = sharp(input);
  if (t.width) pipeline = pipeline.resize(t.width, t.height ?? undefined, { fit: 'cover' });
  await pipeline.webp({ quality: t.quality, effort: 6, smartSubsample: true }).toFile(t.file);
  const a = statSync(t.file).size / 1024;
  before += b;
  after += a;
  const meta = await sharp(t.file).metadata();
  console.log(
    `${t.file.replace('public/', '').padEnd(46)}${(b.toFixed(1) + ' KB').padStart(9)}${(a.toFixed(1) + ' KB').padStart(10)}   ${(b - a).toFixed(1)} KB  ${meta.width}x${meta.height} q${t.quality}`,
  );
}
console.log(`${'TOTAL'.padEnd(46)}${(before.toFixed(1) + ' KB').padStart(9)}${(after.toFixed(1) + ' KB').padStart(10)}   ${(before - after).toFixed(1)} KB`);
