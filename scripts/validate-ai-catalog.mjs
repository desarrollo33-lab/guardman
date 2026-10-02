// scripts/validate-ai-catalog.mjs — valida el manifiesto contra el esquema oficial ARD.
// Uso: node scripts/validate-ai-catalog.mjs   (verifica el manifiesto ya construido)
import Ajv2020 from 'ajv/dist/2020.js';
import { readFileSync } from 'node:fs';

const schema = JSON.parse(readFileSync('tests/fixtures/ard-ai-catalog.schema.json', 'utf8'));
const manifest = JSON.parse(readFileSync(process.argv[2] ?? 'lighthouse-reports/ai-catalog.json', 'utf8'));

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const ok = validate(manifest);

console.log(`${ok ? 'VALIDO' : 'INVALIDO'} — ${process.argv[2] ?? 'lighthouse-reports/ai-catalog.json'}`);
if (!ok) {
  for (const e of validate.errors ?? []) {
    const extra = e.params?.additionalProperty ? ` ("${e.params.additionalProperty}")` : '';
    console.log(`  ${e.instancePath || '(raiz)'} ${e.message}${extra}`);
  }
  process.exitCode = 1;
}
