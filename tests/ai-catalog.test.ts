// Valida el manifiesto ARD contra LOS DOS esquemas oficiales. Sin esto, el
// manifiesto puede volver a quedar invalido sin que nadie se entere: los
// validadores externos (Cloudflare, el conformance tester de la spec) lo
// detectan tarde y en un panel aparte.
//
// Son dos esquemas y no uno, porque ARD v0.91 (Appendix D.1) define el
// `ard-entry.schema.json` como autoritativo para `ard.json` y dice que "no
// deriva de ningún esquema de catálogo; los dos evolucionan de forma
// independiente". El `ai-catalog.schema.json` sigue siendo el que corresponde a
// la ruta predecesora, y es cerrado (`additionalProperties: false` en `host`).
// Servimos el mismo documento en las dos rutas, así que tiene que pasar ambos.
//
// Para actualizar los esquemas:
//   curl -o tests/fixtures/ard-entry.schema.json \
//     https://raw.githubusercontent.com/ards-project/ard-spec/main/spec/schemas/ard-entry.schema.json
//   curl -o tests/fixtures/ard-ai-catalog.schema.json \
//     https://raw.githubusercontent.com/ards-project/ard-spec/main/spec/schemas/ai-catalog.schema.json
import { describe, it, expect } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import { readFileSync } from 'node:fs';
import { buildArdManifest, PUBLISHER_DOMAIN } from '../src/lib/ai-catalog';
import { MCP_TOOLS, buildMcpCard } from '../src/lib/mcp-card';
import { LLMS_DOCS } from '../src/lib/llms-docs';

const load = (f: string) => JSON.parse(readFileSync(`tests/fixtures/${f}`, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });

// El schema de ARD define DOS cosas: `ArdManifest` es el documento de
// /.well-known/ard.json y `ArdEntry` es cada entrada. Validar el manifiesto
// contra el root del schema las trata como si fueran la misma cosa y falla.
const ardEntrySchema = load('ard-entry.schema.json');
ajv.addSchema(ardEntrySchema);
const ardManifestValidate = ajv.getSchema(`${ardEntrySchema.$id}#/$defs/ArdManifest`)!;
const ardEntryValidate = ajv.getSchema(`${ardEntrySchema.$id}#/$defs/ArdEntry`)!;
const catalogValidate = ajv.compile(load('ard-ai-catalog.schema.json'));

const manifest = buildArdManifest();
const describeErrors = (v: { errors?: readonly { instancePath?: string; message?: string; params?: unknown }[] | null }) =>
  (v.errors ?? [])
    .map((e) => `${e.instancePath || '(raiz)'} ${e.message}${(e.params as { additionalProperty?: string })?.additionalProperty ? ` ("${(e.params as { additionalProperty?: string }).additionalProperty}")` : ''}`)
    .join('\n    ');

describe('manifiesto ARD — esquemas oficiales', () => {
  it('ard.json cumple ArdManifest (autoritativo de ARD v0.91)', () => {
    const ok = ardManifestValidate(manifest);
    expect(ok, describeErrors(ardManifestValidate)).toBe(true);
  });

  it('cada entrada cumple ArdEntry', () => {
    for (const entry of manifest.entries) {
      const ok = ardEntryValidate(entry);
      expect(ok, `${entry.identifier}: ${describeErrors(ardEntryValidate)}`).toBe(true);
    }
  });

  it('ai-catalog.json cumple ai-catalog.schema.json (data model predecesor)', () => {
    const ok = catalogValidate(manifest);
    expect(ok, describeErrors(catalogValidate)).toBe(true);
  });
});

describe('manifiesto ARD — restricciones de descubrimiento (§D.2)', () => {
  it('cada entrada declara url XOR data, nunca ambos', () => {
    for (const entry of manifest.entries) {
      const hasUrl = typeof entry.url === 'string';
      const hasData = entry.data !== undefined;
      expect(
        hasUrl !== hasData,
        `${entry.identifier}: ${hasUrl && hasData ? 'declara url Y data' : 'no declara ni url ni data'}`,
      );
    }
  });

  it('cada entrada lleva entre 2 y 5 representativeQueries', () => {
    for (const entry of manifest.entries) {
      const n = entry.representativeQueries?.length ?? 0;
      expect(n, `${entry.identifier} tiene ${n} representativeQueries`).toBeGreaterThanOrEqual(2);
      expect(n, `${entry.identifier} tiene ${n} representativeQueries`).toBeLessThanOrEqual(5);
    }
  });

  it('el trustManifest alinea con el dominio del URN (§4.5.1)', () => {
    for (const entry of manifest.entries) {
      const idDomain = entry.identifier.split(':')[2];
      expect(idDomain, `${entry.identifier} no trae dominio`).toBe(PUBLISHER_DOMAIN);
      expect(entry.trustManifest?.identity, `${entry.identifier} sin trustManifest`).toBe(`did:web:${PUBLISHER_DOMAIN}`);
    }
  });

  it('cada entrada trae capabilities para el filtrado estructurado', () => {
    for (const entry of manifest.entries) {
      expect(entry.capabilities?.length, `${entry.identifier} sin capabilities`).toBeGreaterThan(0);
    }
  });
});

describe('lo que el manifiesto declara existe de verdad', () => {
  it('la tarjeta MCP expone las herramientas que el sitio ofrece por WebMCP', () => {
    // La tarjeta y los formularios salen de la misma constante (MCP_TOOLS), así
    // que este test falla si alguien publica un nombre de herramienta que no
    // corresponde a un formulario real del sitio.
    const card = buildMcpCard('https://guardman.cl');
    expect(card.tools).toHaveLength(MCP_TOOLS.length);
    for (const tool of card.tools) {
      expect(MCP_TOOLS.map((t) => t.webmcp.name)).toContain(tool.name);
      // Toda herramienta declara el límite de lo que NO hace, para que el
      // agente no prometa un precio que la herramienta no devuelve.
      expect(tool.meta.limite, `${tool.name} sin límite declarado`).toBeTruthy();
      expect(tool.meta.pagina, `${tool.name} sin página pública`).toMatch(/^https:\/\/guardman\.cl\//);
    }
  });

  it('el canal de denuncias no se publica como herramienta ni como entrada', () => {
    // Decisión del 2026-10-02, igual que en WebMCP: una denuncia exige una
    // persona identificable detrás.
    const card = JSON.stringify(buildMcpCard('https://guardman.cl')).toLowerCase();
    expect(card).not.toContain('denuncia');
    const manifestJson = JSON.stringify(manifest).toLowerCase();
    expect(manifestJson).not.toContain('denuncia');
  });

  it('cada entrada markdown apunta a un documento que el sitio genera', () => {
    let generated = 0;
    for (const entry of manifest.entries) {
      if (entry.type !== 'text/markdown') continue;
      const file = entry.url!.split('/').pop()!;
      // /llms.txt lo genera su propio endpoint, no el registro de llms-docs.
      if (file === 'llms.txt') {
        expect(entry.url).toBe('https://guardman.cl/llms.txt');
        continue;
      }
      expect(LLMS_DOCS[file], `${entry.identifier} apunta a /${file}, que no existe`).toBeTruthy();
      generated++;
    }
    // Los 4 documentos nuevos tienen que estar referenciados, no sólo existir.
    expect(generated).toBe(Object.keys(LLMS_DOCS).length);
  });

  it('no anuncia las páginas HTML como si fueran recursos agentic', () => {
    const types = manifest.entries.map((e) => e.type);
    expect(types).not.toContain('text/html');
    expect(types).not.toContain('application/json');
    expect(types).toContain('application/mcp-server-card+json');
  });

  it('los datos de contacto siguen accesibles sin rascar el HTML', () => {
    // Antes vivían en host.contactPoint, que el esquema no permite.
    const llms = manifest.entries.find((e) => e.identifier.endsWith(':llms-txt'));
    expect(llms?.metadata?.telefono).toMatch(/\+56/);
    expect(llms?.metadata?.horario).toBeTruthy();
  });
});
