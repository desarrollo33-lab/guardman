// scripts/lighthouse-audit.mjs — quick programmatic Lighthouse audit
// against a few representative pages of the deployed site. Requires
// `lighthouse` (installed as devDep) and a working Chrome/Chromium.
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'https://guardman.cl';
const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'service', path: '/servicios/guardias-de-seguridad' },
  { name: 'location', path: '/ubicaciones/las-condes' },
];

mkdirSync('lighthouse-reports', { recursive: true });

const summary = [];
for (const p of PAGES) {
  const url = `${BASE}${p.path}`;
  console.log(`\n→ Auditing ${p.name}: ${url}`);
  const result = await lighthouse(url, {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: 0,
    output: 'html',
    logLevel: 'error',
  });
  if (!result) {
    console.log(`  ⚠️  lighthouse returned no result for ${url}`);
    continue;
  }
  const { lhr } = result;
  const scores = Object.fromEntries(
    Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]),
  );
  summary.push({ page: p.name, url, ...scores });
  writeFileSync(`lighthouse-reports/${p.name}.html`, result.report);
  console.log(`  perf=${scores.performance} a11y=${scores.accessibility} bp=${scores['best-practices']} seo=${scores.seo}`);
}

console.log('\n══════ Summary ══════');
console.table(summary);

const failing = summary.filter((s) => s.performance < 90 || s.accessibility < 90 || s.seo < 90);
if (failing.length > 0) {
  console.log(`\n⚠️  ${failing.length} page(s) under 90 on at least one category. See lighthouse-reports/`);
  process.exitCode = 0; // do not fail CI on Lighthouse — informational only
}
