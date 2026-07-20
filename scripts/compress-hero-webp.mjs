// Comprime hero-home.webp con sharp. Procesa FUERA de OneDrive (C:\Temp)
// porque el original está lockeado por el sync de OneDrive. Recodifica con
// quality buscando ~65KB sin cambio visual. Mantiene 1920x1080. Backup en
// public/images/.backup-20260719/.
// Uso: node scripts/compress-hero-webp.mjs
import sharp from 'sharp';
import { mkdirSync, statSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'public/images/hero-home.webp');
const BAK = resolve(ROOT, 'public/images/.backup-20260719');
const SCRATCH = 'C:/Temp/guardman-compress';
mkdirSync(BAK, { recursive: true });
mkdirSync(SCRATCH, { recursive: true });

// Backup del original (si no existe)
const bakFile = resolve(BAK, 'hero-home.webp.bak');
if (!statSync(bakFile, { throwIfNoEntry: false })) {
  copyFileSync(SRC, bakFile);
}

const before = statSync(SRC).size;

// Copia a scratch (fuera de OneDrive) porque el original está lockeado por sync.
const scratchSrc = resolve(SCRATCH, 'hero-in.webp');
copyFileSync(SRC, scratchSrc);

const QUALITY = 65;  // sweet spot: ~75KB, visualmente OK para hero con texto
const buf = await sharp(scratchSrc, { failOn: 'none' })
  .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
  .toBuffer();
const scratchOut = resolve(SCRATCH, 'hero-out.webp');
writeFileSync(scratchOut, buf);
copyFileSync(scratchOut, SRC);

const after = statSync(SRC).size;
const pct = ((1 - after / before) * 100).toFixed(1);
console.log(`hero-home.webp  ${before} -> ${after} bytes  (-${pct}%)  quality=${QUALITY}`);
