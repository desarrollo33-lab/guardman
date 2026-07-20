// scripts/process-flota-portada.cjs
// Process Portada Guardman for the cert-split layout in TrustSignals.
// Source 1600x1200 (4:3). Keep the two Saveiros + residential context.
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(
  __dirname,
  '..',
  'imagenes guardman',
  'extracted',
  'IMAGENES WEB GUARDMAN',
  'Portada Guardman.jpg',
);
const OUT = path.resolve(__dirname, '..', 'public', 'images', 'flota', 'portada-residencial.webp');

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log(`Source: ${meta.width}x${meta.height}`);

  // Keep full frame (4:3) — both vehicles + people + houses — and resize to
  // 1200x900 for a 2x retina render in the 50% split column.
  await sharp(SRC)
    .resize(1200, 900, { fit: 'cover' })
    .webp({ quality: 80, effort: 5 })
    .toFile(OUT);

  const stat = require('fs').statSync(OUT);
  console.log(`Output: ${OUT} (${(stat.size / 1024).toFixed(1)} KB)`);
})().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
