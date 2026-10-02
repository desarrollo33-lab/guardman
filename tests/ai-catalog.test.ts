// Valida el manifiesto ARD contra el esquema oficial. Sin esto, el manifiesto
// puede volver a quedar invalido sin que nadie se entere: los validadores
// externos (Cloudflare, registries) lo detectan tarde y en un panel aparte.
//
// Esquema vendorizado desde ards-project/ard-spec (spec/schemas/ai-catalog.schema.json).
// Para actualizarlo: curl -o tests/fixtures/ard-ai-catalog.schema.json \
//   https://raw.githubusercontent.com/ards-project/ard-spec/main/spec/schemas/ai-catalog.schema.json
import { describe, it, expect } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import { readFileSync } from 'node:fs';
import { buildArdManifest } from '../src/lib/ai-catalog';

const schema = JSON.parse(readFileSync('tests/fixtures/ard-ai-catalog.schema.json', 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

describe('manifiesto ARD / ai-catalog', () => {
  it('cumple el esquema oficial', () => {
    const manifest = buildArdManifest();
    const ok = validate(manifest);
    const detail = (validate.errors ?? [])
      .map((e) => `${e.instancePath || '(raiz)'} ${e.message}${e.params?.additionalProperty ? ` ("${e.params.additionalProperty}")` : ''}`)
      .join('\n    ');
    expect(detail ? `\n    ${detail}` : '').toBe(ok ? '' : `\n    ${detail}`);
    expect(ok).toBe(true);
  });

  it('cada entrada declara url XOR data, nunca ambos', () => {
    for (const entry of buildArdManifest().entries) {
      const hasUrl = typeof entry.url === 'string';
      const hasData = entry.data !== undefined;
      expect(
        hasUrl !== hasData,
        `${entry.identifier}: ${hasUrl && hasData ? 'declara url Y data' : 'no declara ni url ni data'}`,
      );
    }
  });

  it('los datos de contacto siguen accesibles sin rascar el HTML', () => {
    // Antes vivían en host.contactPoint, que el esquema no permite. Se movieron
    // a metadata de la entrada de llms.txt: si alguien las borra, un asistente
    // vuelve a tener que scrapearel HTML para-NEXTear el teléfono.
    const llms = buildArdManifest().entries.find((e) => e.identifier.endsWith(':llms-txt'));
    expect(llms?.metadata?.telefono).toMatch(/\+56/);
    expect(llms?.metadata?.horario).toBeTruthy();
  });
});
