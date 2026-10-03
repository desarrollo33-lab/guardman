// scripts/validate-ai-catalog.mjs — valida el manifiesto contra los DOS esquemas
// oficiales de ARD. Sin argumentos valida el manifiesto ya publicado en
// producción, que es el caso que importa.
//
// Uso: node scripts/validate-ai-catalog.mjs [archivo.json]
import Ajv2020 from 'ajv/dist/2020.js';
import { readFileSync } from 'node:fs';

const DEFAULT_URL = 'https://guardman.cl/.well-known/ai-catalog.json';
const target = process.argv[2];

const manifest = target
  ? JSON.parse(readFileSync(target, 'utf8'))
  : await (await fetch(DEFAULT_URL)).json();

const where = target ?? DEFAULT_URL;
const ajv = new Ajv2020({ allErrors: true, strict: false });

const ardSchema = JSON.parse(readFileSync('tests/fixtures/ard-entry.schema.json', 'utf8'));
ajv.addSchema(ardSchema);
const validateManifest = ajv.getSchema(`${ardSchema.$id}#/$defs/ArdManifest`);
const validateEntry = ajv.getSchema(`${ardSchema.$id}#/$defs/ArdEntry`);
const validateCatalog = ajv.compile(JSON.parse(readFileSync('tests/fixtures/ard-ai-catalog.schema.json', 'utf8')));

const show = (v, label) => {
  const errors = v.errors ?? [];
  return errors.length ? `${label}\n${errors.map((e) => `    ${e.instancePath || '(raiz)'} ${e.message}`).join('\n')}` : null;
};

const failures = [
  show(validateManifest(manifest), 'ArdManifest (ard-entry.schema.json):'),
  show(validateCatalog(manifest), 'AICatalogManifest (ai-catalog.schema.json):'),
  ...manifest.entries.map((e) => show(validateEntry(e), `ArdEntry ${e.identifier}:`)),
].filter(Boolean);

console.log(`\n${where}`);
if (failures.length) {
  console.log('INVALIDO:');
  for (const f of failures) console.log(`  ${f}`);
  process.exitCode = 1;
} else {
  console.log(`VALIDO — ${manifest.entries.length} entradas, contra los dos esquemas y el §4.2/§D.2`);
  for (const e of manifest.entries) console.log(`  ${e.type.padEnd(38)} ${e.identifier}`);
}
