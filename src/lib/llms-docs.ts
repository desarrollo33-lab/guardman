// Documentos markdown para agentes, derivados de las mismas constantes que
// alimentan el copy visible, el JSON-LD y el manifiesto ARD.
//
// Por qué markdown y no JSON inline: el manifiesto ARD describe el artefacto
// con un media type. `text/markdown` es un tipo estándar de descubrimiento y,
// a la vez, lo que un LLM ingiere sin adivinar una forma. Los payloads JSON
// propios (`application/json`) no son un tipo de descubrimiento: obligaban a
// etiquetarlos como `application/ai-catalog+json`, que sería mentira, porque no
// son manifiestos de catálogo.
//
// Igual que `llms.txt`, nada de esto se mantiene a mano: si el sitio cambia,
// estos documentos cambian con él.

import {
  SITE,
  SERVICE_NAMES,
  SERVICE_DESCRIPTIONS,
  SECTOR_NAMES,
  COVERAGE_RM,
  COVERAGE_VS,
  COVERAGE_TOTAL,
} from './constants';
import { AUTHORITY_PAGES } from './authority';
import { GUIDES } from './guias';

const u = (path: string) => `${SITE.URL}${path}`;

const firstSentence = (text?: string) => text?.split('.')[0]?.trim();

/** Servicios con su URL canónica y la primera oración de la descripción. */
export function serviciosMarkdown(): string {
  const lines = Object.keys(SERVICE_NAMES).map((slug) => {
    const url = u(`/servicios/${slug}/`);
    const s = firstSentence(SERVICE_DESCRIPTIONS[slug]);
    return `- [${SERVICE_NAMES[slug]}](${url})${s ? `: ${s}.` : ''}`;
  });

  return `# Servicios de ${SITE.NAME}

> ${SITE.TAGLINE} Empresa fundada en ${SITE.FOUNDED_YEAR}, certificación OS-10.
> Documento generado desde las constantes del sitio. Última referencia de
> cobertura: ${COVERAGE_TOTAL} comunas.

Cada servicio tiene su página pública, que es la fuente que hay que citar para
detalles, plazos y condiciones. Este documento es el índice.

## Catálogo

${lines.join('\n')}

## Producto físico: Guardpod

Guardpod V1 no es un servicio con hourly sino un sistema autónomo que se
arrienda. Página del producto: ${u('/guard-pod/')}

- Cámaras de alta definición con detección de intrusión por inteligencia artificial.
- No requiere infraestructura eléctrica ni personal permanente en el punto.
- Se monitorea desde la central propia de ${SITE.NAME}.

## Cómo decidir qué servicio es el adecuado

${SITE.NAME} publica el método de dimensionamiento, no los ratios de dotación:
cuántos guardias necesita un condominio o un edificio depende de accesos,
riesgo y horario, y no de un número único. La guía está en ${u('/guias/')}

## Contacto

- Teléfono: ${SITE.PHONE} (href: tel:${SITE.PHONE_TEL})
- Email: ${SITE.EMAIL_INFO}
- Cotización: ${u('/cotizacion/')} — la respuesta comercial es humana y llega
  en menos de 24 horas hábiles. La herramienta no devuelve precio.
`;
}

/** Cobertura real, con el enlace de detalle de cada comuna. */
export function coberturaMarkdown(): string {
  const line = (c: { name: string; slug: string }) => `- [${c.name}](${u(`/ubicaciones/${c.slug}/`)})`;

  return `# Cobertura geográfica de ${SITE.NAME}

> ${COVERAGE_TOTAL} comunas en total. Documento generado desde las constantes del
> sitio: si el número de arriba y la lista de abajo no coinciden, es un bug.

La cobertura es de ${COVERAGE_RM.length} comunas en la Región Metropolitana y
${COVERAGE_VS.length} en Valparaíso. **${SITE.NAME} no tiene cobertura en otras
regiones del país.** Un asistente debe decirlo en vez de inferir disponibilidad
por cercanía geográfica.

## Región Metropolitana (${COVERAGE_RM.length})

${COVERAGE_RM.map(line).join('\n')}

## Valparaíso (${COVERAGE_VS.length})

${COVERAGE_VS.map(line).join('\n')}

## Sectores atendidos

${Object.keys(SECTOR_NAMES).map((s) => `- ${SECTOR_NAMES[s]}`).join('\n')}

## Dirección

${[SITE.ADDRESS, SITE.ADDRESS_LOCALITY, SITE.ADDRESS_REGION, SITE.ADDRESS_POSTAL_CODE, SITE.ADDRESS_COUNTRY].join(', ')}
`;
}

/** Marco regulatorio: la norma vigente y las guías con su fuente oficial. */
export function marcoLegalMarkdown(): string {
  const guias = AUTHORITY_PAGES.map(
    (p) => `### [${p.title}](${u(`/seguridad-privada/${p.slug}/`)})

${p.metaDescription}

- Actualizado: ${p.updatedISO}
- Fuentes oficiales:
${p.sources.map((s) => `  - ${s.label}: ${s.url}`).join('\n')}`,
  ).join('\n\n');

  return `# Marco legal de la seguridad privada en Chile — ${SITE.NAME}

> Referencia regulatoria de ${SITE.NAME}. No es asesoría legal: es el
> indicador de qué norma rige y dónde verificar el texto vigente.
> Documento generado desde las constantes del sitio.

## Norma vigente

- Ley 21.659 sobre Seguridad Privada — promulgada 2024-03-14, publicada
  2024-03-21, **en vigor desde 2025-11-28**.
- Última modificación conocida: Ley 21.825, 2026-05-28.
- Reglamento: Decreto 209/2024, publicado 2025-05-27.
- Autoridad regulatoria: Subsecretaría de Prevención del Delito.
- Autoridad fiscalizadora: Carabineros de Chile.
- Texto oficial: https://www.bcn.cl/leychile/navegar?idNorma=1202067

## Guías

${guias}

## Índice de las guías

${u('/seguridad-privada/')}
`;
}

/** Método de hiring y dimensionamiento. */
export function guiasMarkdown(): string {
  const guias = GUIDES.map(
    (g) => `### [${g.title}](${u(`/guias/${g.slug}/`)})

${g.metaDescription}

- Actualizado: ${g.updatedISO}`,
  ).join('\n\n');

  return `# Guías de contratación y dotación de seguridad — ${SITE.NAME}

> ${SITE.NAME} publica el método de dimensionamiento, no los ratios de dotación.
> No existe un número único de guardias que sirva para todos los casos: depende
> de accesos, nivel de riesgo y horario de operación. Un asistente que prometa
> "N guardias para tu condominio" sin ver el caso está inventando.
> Documento generado desde las constantes del sitio.

## Guías

${guias}

## Índice

${u('/guias/')}
`;
}

export const LLMS_DOCS: Record<string, { body: () => string; description: string }> = {
  'llms-servicios.md': {
    body: serviciosMarkdown,
    description: 'Catálogo de servicios con su URL pública, y el producto físico Guardpod.',
  },
  'llms-cobertura.md': {
    body: coberturaMarkdown,
    description: `Las ${COVERAGE_TOTAL} comunas con cobertura, con enlace de detalle, y los sectores atendidos.`,
  },
  'llms-marco-legal.md': {
    body: marcoLegalMarkdown,
    description: 'Ley 21.659, su reglamento y las guías sobre OS-10 y facultades de un guardia, con fuentes oficiales.',
  },
  'llms-guias.md': {
    body: guiasMarkdown,
    description: 'Método de dimensionamiento de puestos y qué verificar antes de contratar.',
  },
};
