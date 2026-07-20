// scripts/process-equipo-firma.cjs
// Process equipo-guardman2 image: full-frame resize to 800x600 webp for
// the step-03 background in HowItWorks (final contract signing step).
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(
  __dirname,
  '..',
  'imagenes guardman',
  'extracted',
  'IMAGENES WEB GUARDMAN',
  'equipo guardman2.jpg',
);
const OUT = path.resolve(__dirname, '..', 'public', 'images', 'equipo', 'firma-contrato.webp');

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log(`Source: ${meta.width}x${meta.height}`);

  // The source is 4080x3060 (4:3). The three people + signing woman sit in
  // the middle-vertical band. Windows are in the top third (distracting,
  // will be hidden by overlay). Crop the vertical band with the action
  // and resize to 800x600.
  // Source: keep vertical 25%-95% (drop 5% top + 5% bottom margins).
  const cropTop = Math.round(meta.height * 0.22);
  const cropHeight = Math.round(meta.height * 0.72);

  await sharp(SRC)
    .extract({ left: 0, top: cropTop, width: meta.width, height: cropHeight })
    .resize(800, 600, { fit: 'cover' })
    .webp({ quality: 80, effort: 5 })
    .toFile(OUT);

  const stat = require('fs').statSync(OUT);
  console.log(`Output: ${OUT} (${(stat.size / 1024).toFixed(1)} KB)`);
})().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
