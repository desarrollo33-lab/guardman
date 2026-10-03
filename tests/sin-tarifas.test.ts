import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Prohibido publicar tarifas.
 *
 * La regla está escrita en `authority.ts:12`, entre las tres reglas editoriales
 * del sitio, y dice textual: "Prohibido publicar ratios de dotación, tarifas
 * ni operativas sensibles. Se explica el MÉTODO (acceso-riesgo-horario), nunca
 * el número. Decisión del CEO, 2026-10-02."
 *
 * Ese "nunca el número" es lo que fallaba. Publicado había:
 *   - guard-pod.astro: "$3.000.000 mensuales" (dotación de referencia)
 *   - seo.ts: minPrice 350000 / maxPrice 6800000 (JSON-LD de cada Service)
 *   - content.ts: "Una auditoría básica puede partir desde $150.000"
 *
 * Los tres se quitaron por decisión del cliente el 2026-10-03.
 *
 * El de seo.ts era el peor: además de contradecir la regla, publicaba un
 * `priceSpecification` que no aparecía en el HTML. La guía de datos
 * estructurados de Google exige que el marcado describa contenido visible, y
 * un precio invisible es la forma más común de disparar una revisión manual
 * por price mismatch. Por eso se sacó el `hasOfferCatalog` COMPLETO y no solo
 * los números: un `Offer` sin precio no es mejor.
 *
 * Este test mira el CÓDIGO FUENTE, no el HTML generado, porque un schema se
 * puede construir en un .astro o en un helper: revisar el build obligaría a
 * compilar para correr un test de texto.
 */

const SOURCE_DIRS = ['src/pages', 'src/components', 'src/lib'];
const EXTS = ['.astro', '.ts', '.tsx'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTS.some((e) => name.endsWith(e)) ? [full] : [];
  });
}

const files = SOURCE_DIRS.flatMap((d) => walk(d));

/** Líneas de comentario: el test vigila copy publicable, no historia del código. */
const esComentario = (linea: string) => /^\s*(\/\/|\/\*|\*|<!--)/.test(linea);

describe('sin tarifas publicadas', () => {
  it('no hay montos en pesos en el copy público', () => {
    const offenders: string[] = [];
    // $ seguido de dígitos, con separadores de miles Chilanos. Se exige el
    // signo para no capturar "$" suelto ni variables de template.
    const re = /\$\s?\d{1,3}(?:\.\d{3}){1,3}/;
    for (const file of files) {
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .forEach((linea, i) => {
          if (esComentario(linea)) return;
          if (linea.includes('priceCurrency') || linea.includes('formatCLP')) return;
          if (re.test(linea)) offenders.push(`${file}:${i + 1}  ${linea.trim().slice(0, 120)}`);
        });
    }
    expect(
      offenders.join('\n'),
      `Montos publicados:\n${offenders.join('\n')}\n\nLa regla de authority.ts:12 lo prohíbe. Explicá el método, no el número.`,
    ).toBe('');
  });

  it('el JSON-LD no declara precios', () => {
    const offenders: string[] = [];
    // Cualquier propiedad de precio en schema.org. Se busca la clave, no el
    // valor, para que también salte un `minPrice` que alguien agregue después.
    const claves = /['"]?(minPrice|maxPrice|priceSpecification|priceRange|lowPrice|highPrice|priceCurrency)['"]?\s*:/;
    for (const file of files) {
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .forEach((linea, i) => {
          if (esComentario(linea)) return;
          // `priceRange: '$$'` en el schema de la organización es un símbolo de
          //.schema.org, no un monto. Se permite explícitamente.
          if (/priceRange\s*:\s*['"]\$\$['"]/.test(linea)) return;
          if (claves.test(linea)) offenders.push(`${file}:${i + 1}  ${linea.trim().slice(0, 120)}`);
        });
    }
    expect(
      offenders.join('\n'),
      `Precios en datos estructurados:\n${offenders.join('\n')}\n\nUn precio que no está visible en la página viola la guía de Google y puede disparar una acción manual.`,
    ).toBe('');
  });

  it('no hay ratios de dotación publicados', () => {
    // "1 guardia cada 4 unidades" es el formato del ratio. No se permite en
    // copy público: la regla pide describir el método (acceso, riesgo, horario)
    // y que sea el proveedor el que dimensione.
    const offenders: string[] = [];
    const re = /(\d+)\s*(?:guardias?|vigilantes?)\s*(?:por|para|cada)\s*\d+/i;
    for (const file of files) {
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .forEach((linea, i) => {
          if (esComentario(linea)) return;
          if (re.test(linea)) offenders.push(`${file}:${i + 1}  ${linea.trim().slice(0, 120)}`);
        });
    }
    expect(offenders.join('\n'), `Ratios de dotación publicados:\n${offenders.join('\n')}`).toBe('');
  });
});
