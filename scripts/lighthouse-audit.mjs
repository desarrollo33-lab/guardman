// scripts/lighthouse-audit.mjs — auditoría Lighthouse programática contra
// producción (o contra BASE_URL para medir un build local).
//
// El script anterior pasaba `port: 0` a Lighthouse, que no puede conectarse:
// moría con `EADDRNOTAVAIL 127.0.0.1` en la primera página. Nunca corrió, y por
// eso no había señal de performance en el repo. Ahora levanta un Chromium real
// con puerto de debugging y lo cierra al terminar.
//
//   node scripts/lighthouse-audit.mjs
//   BASE_URL=http://127.0.0.1:8788 node scripts/lighthouse-audit.mjs
import lighthouse from 'lighthouse';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const BASE = process.env.BASE_URL ?? 'https://guardman.cl';
const PORT = Number(process.env.LH_PORT ?? 9333);
const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'service', path: '/servicios/guardias-de-seguridad/' },
  { name: 'service+comuna', path: '/servicios/guardias-de-seguridad/las-condes/' },
  { name: 'hub', path: '/servicios/' },
];

/** Chromium de la cache de Playwright, o el Chrome del sistema. */
function findChrome() {
  const cache = join(process.env.USERPROFILE ?? '', 'AppData', 'Local', 'ms-playwright');
  if (existsSync(cache)) {
    const dir = readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop();
    if (dir) {
      for (const sub of ['chrome-win64', 'chrome-win']) {
        const p = join(cache, dir, sub, 'chrome.exe');
        if (existsSync(p)) return p;
      }
    }
  }
  for (const p of [
    join(process.env.ProgramFiles ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(process.env['ProgramFiles(x86)'] ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ]) if (existsSync(p)) return p;
  throw new Error('No hay Chromium ni Chrome. Instalá Playwright o Chrome.');
}

const exe = findChrome();
console.log(`navegador: ${exe}`);

const chrome = spawn(exe, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  `--user-data-dir=${join(tmpdir(), 'gm-lh-profile')}`,
], { stdio: 'ignore' });

const stop = () => { try { chrome.kill(); } catch {} };
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(1); });

for (let i = 0; i < 40; i++) {
  try { if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) break; } catch {}
  if (i === 39) { stop(); throw new Error('Chromium no levantó el puerto de debugging'); }
  await new Promise((r) => setTimeout(r, 500));
}

mkdirSync('lighthouse-reports', { recursive: true });
const summary = [];
for (const p of PAGES) {
  const url = `${BASE}${p.path}`;
  console.log(`\n→ ${p.name}: ${url}`);
  const result = await lighthouse(url, {
    port: PORT,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    output: 'html',
    logLevel: 'error',
  });
  if (!result) { console.log(`  ⚠️  lighthouse devolvió nada para ${url}`); continue; }

  const { lhr } = result;
  const scores = Object.fromEntries(
    Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]),
  );
  const a = lhr.audits;
  const row = {
    page: p.name,
    perf: scores.performance,
    a11y: scores.accessibility,
    bp: scores['best-practices'],
    seo: scores.seo,
    LCP: a['largest-contentful-paint']?.displayValue,
    CLS: a['cumulative-layout-shift']?.displayValue,
    TBT: a['total-blocking-time']?.displayValue,
  };
  summary.push(row);
  writeFileSync(join('lighthouse-reports', `${p.name}.html`), result.report);
  console.log(`  perf=${row.perf} seo=${row.seo} a11y=${row.a11y} bp=${row.bp} LCP=${row.LCP} CLS=${row.CLS} TBT=${row.TBT}`);

  // Los umbrales que importan para rankear, no el score agregado.
  const lcp = a['largest-contentful-paint']?.numericValue ?? 0;
  if (lcp > 2500) console.log(`  ⚠️  LCP ${(lcp / 1000).toFixed(1)}s sobre el umbral bueno de 2.5s`);
  if ((a['cumulative-layout-shift']?.numericValue ?? 0) > 0.1) console.log(`  ⚠️  CLS sobre 0.1`);
}

console.log('\n══════ Summary ══════');
console.table(summary);
console.log(`\nHTML en lighthouse-reports/ (gitignored)`);
stop();
