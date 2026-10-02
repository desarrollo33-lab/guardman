// ════════════════════════════════════════════════════════════════
// GuardMan — Manifiesto de descubrimiento ARD / AI Catalog
//
// Un solo documento, servido en dos rutas:
//
//   /.well-known/ard.json           → ruta canónica (ARD v0.91)
//   /.well-known/ai-catalog.json    → ruta predecesora (cortesía)
//
// Por qué las dos: ARD v0.91 (agenticresourcediscovery.org, ago 2026)
// renombró la ruta canónica a `ard.json` y dejó `ai-catalog.json` como
// cortesía opcional — "consultar esa ruta es cortesía, no conformidad", y
// un publicador que se quede solo en la ruta vieja "puede no ser
// encontrado". Servir ambas con el mismo documento es lo que hace
// descubrible el sitio a un consumidor conforme con el spec actual y a uno
// que sólo implemente la versión previa.
//
// Deriva de `constants.ts`, igual que `llms.txt` y el JSON-LD. Si el sitio
// cambia cobertura, servicios u horario, el manifiesto cambia con él. No
// editar a mano: ya pasó antes que una capa de descubrimiento quedara
// diciendo cosas que el sitio no mostraba (ver el comentario de
// `src/pages/llms.txt.ts`).
//
// `specVersion: "1.0"` es la versión del **data model de AI Catalog**, no la
// del spec ARD. ARD lee el campo como definido por transporte y lo ignora.
//
// CONFORMIDAD: este manifiesto se valida contra el esquema oficial
// (tests/fixtures/ard-ai-catalog.schema.json, descargado de
// ards-project/ard-spec) en `tests/ai-catalog.test.ts`. Dos reglas del esquema
// que ya rompimos una vez y hay que respetar al agregar entradas:
//   1. `host` es additionalProperties:false — sólo displayName, identifier,
//      documentationUrl, logoUrl y trustManifest.
//   2. Cada entrada lleva `url` XOR `data` (Strict Value-or-Reference), nunca
//      ambos y nunca ninguno.
// Para revalidar contra producción: `node scripts/validate-ai-catalog.mjs`.
// ════════════════════════════════════════════════════════════════

import {
  SITE,
  SERVICE_NAMES,
  SERVICE_DESCRIPTIONS,
  SECTOR_NAMES,
  COVERAGE_RM,
  COVERAGE_VS,
  COVERAGE_TOTAL,
  OPENING_HOURS_TEXT,
  TIMEZONE_LABEL,
} from './constants';
import { AUTHORITY_PAGES } from './authority';
import { GUIDES } from './guias';

export const PUBLISHER_DOMAIN = 'guardman.cl';

export interface ArdEntry {
  identifier: string;
  displayName: string;
  type: string;
  description: string;
  /** Exactamente uno de `url` o `data` — nunca ambos, nunca ninguno. */
  url?: string;
  data?: unknown;
  representativeQueries: string[];
  /** Extensiones propias. El esquema sólo admite string/number/boolean/null. */
  metadata?: Record<string, string | number | boolean | null>;
}

const serviceEntries = Object.keys(SERVICE_NAMES).map((slug) => ({
  slug,
  nombre: SERVICE_NAMES[slug],
  descripcion: SERVICE_DESCRIPTIONS[slug] ?? '',
  url: `${SITE.URL}/servicios/${slug}/`,
}));

const coverageData = {
  total: COVERAGE_TOTAL,
  regionMetropolitana: COVERAGE_RM.map((l) => ({ nombre: l.name, url: `${SITE.URL}/ubicaciones/${l.slug}/` })),
  valparaiso: COVERAGE_VS.map((l) => ({ nombre: l.name, url: `${SITE.URL}/ubicaciones/${l.slug}/` })),
  sectores: Object.keys(SECTOR_NAMES),
};

export function buildArdManifest() {
  return {
    specVersion: '1.0',
    host: {
      displayName: SITE.NAME,
      // Requisito duro de conformidad: sin `host.identifier` el manifiesto
      // no valida. `did:web` anclado al dominio, sin esquema ni path.
      identifier: `did:web:${PUBLISHER_DOMAIN}`,
      // `host` es `additionalProperties: false` en el esquema: solo admite
      // displayName, identifier, documentationUrl, logoUrl y trustManifest.
      // Los datos que antes vivían acá —teléfono, horario, dirección, redes—
      // NO se pierden: están en `metadata` de la entrada de llms.txt, que el
      // esquema sí permite, y en /llms.txt y en el JSON-LD ContactPoint.
      documentationUrl: `${SITE.URL}/llms.txt`,
      logoUrl: `${SITE.URL}/images/logo-byn.png`,
    },
    entries: [
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:llms-txt`,
        displayName: 'GuardMan Chile — resumen estructurado del sitio',
        type: 'text/markdown',
        description:
          'Documento markdown generado desde las constantes del sitio: servicios, cobertura real por comuna, horario, contacto y preguntas frecuentes. Es la fuente que ya deben leer los asistentes.',
        url: `${SITE.URL}/llms.txt`,
        representativeQueries: [
          'qué servicios de seguridad privada ofrece GuardMan en Chile',
          'en qué comunas de Santiago trabaja GuardMan',
          'cuál es el teléfono y el horario de GuardMan',
        ],
        // El teléfono y el horario son los dos datos que un asistente más
        // necesita y menos suele acertar. Se declaran acá —y no en `host`,
        // que es additionalProperties:false— para que no dependan de que el
        // agente raspe el HTML.
        metadata: {
          telefono: SITE.PHONE,
          email: SITE.EMAIL_INFO,
          horario: `${OPENING_HOURS_TEXT} (${TIMEZONE_LABEL})`,
          direccion: `${SITE.ADDRESS}, ${SITE.ADDRESS_LOCALITY}, ${SITE.ADDRESS_REGION}`,
          fundacion: String(SITE.FOUNDED_YEAR),
          instagram: SITE.INSTAGRAM_URL,
          youtube: SITE.YOUTUBE_URL,
        },
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:services`,
        displayName: 'Catálogo de servicios de GuardMan',
        type: 'application/json',
        description:
          'Los servicios que ofrece GuardMan con su descripción y su URL pública. Para verificar si un servicio específico existe antes de proponerlo.',
        data: { servicios: serviceEntries },
        representativeQueries: [
          'GuardMan instala cámaras de videovigilancia',
          'hacen escolta de personas en Chile',
          'venden un sistema de vigilancia autónomo sin electricidad',
        ],
      },
      {
        // Entrada de autoridad. Es la que un asistente debería citar cuando
        // le preguntan por el marco legal del rubro en Chile, no por los
        // servicios de una empresa en particular. Declarada como entrada
        // propia y no como servicio, porque responde otro tipo de consulta.
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:marco-legal`,
        displayName: 'Marco legal de la seguridad privada en Chile',
        type: 'application/json',
        description:
          'Guías de referencia sobre certificación OS-10, Ley 21.659 de Seguridad Privada, facultades y límites de un guardia, y funciones de vigilancia en condominios. Cada guía declara la norma vigente, la fecha de vigencia y enlaza la fuente oficial. Es la referencia pública de GuardMan sobre el marco regulatorio del rubro.',
        // Estricta value-or-reference: `url` XOR `data`, nunca ambos. Acá va el
        // `data` porque el contenido indexado (normativa + guías con sus
        // fuentes oficiales) es más útil para un asistente que la página HTML,
        // que además obliga a rascarla. La URL pública queda en metadata.
        data: {
          normativa: {
            ley: 'Ley 21.659 sobre Seguridad Privada',
            promulgada: '2024-03-14',
            publicada: '2024-03-21',
            vigenteDesde: '2025-11-28',
            ultimaModificacion: 'Ley 21.825, 2026-05-28',
            reglamento: 'Decreto 209/2024, publicado 2025-05-27',
            autoridadRegulatoria: 'Subsecretaría de Prevención del Delito',
            autoridadFiscalizadora: 'Carabineros de Chile',
          },
          guias: AUTHORITY_PAGES.map((p) => ({
            titulo: p.title,
            url: `${SITE.URL}/seguridad-privada/${p.slug}/`,
            resumen: p.metaDescription,
            actualizado: p.updatedISO,
            fuentes: p.sources.map((s) => s.url),
          })),
        },
        representativeQueries: [
          'qué es la certificación OS-10 en Chile',
          'qué establece la Ley 21.659 de seguridad privada',
          'qué puede hacer un guardia de seguridad en Chile',
          'diferencia entre guardia de seguridad y vigilante privado',
          'qué funciones tiene un guardia en un condominio',
        ],
        metadata: { paginaPublica: `${SITE.URL}/seguridad-privada/` },
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:guias-dotacion`,
        displayName: 'Guías de dotación y contratación de seguridad',
        type: 'application/json',
        description:
          'Método de dimensionamiento de puestos de seguridad (acceso, riesgo y horario) y puntos a verificar antes de contratar. GuardMan publica el método y no los ratios de dotación.',
        // `data` y no `url`: el índice de guías es lo que consume el agente.
        data: {
          guias: GUIDES.map((g) => ({
            titulo: g.title,
            url: `${SITE.URL}/guias/${g.slug}/`,
            resumen: g.metaDescription,
            actualizado: g.updatedISO,
          })),
        },
        representativeQueries: [
          'cuántos guardias necesita un condominio',
          'cómo elegir una empresa de seguridad privada en Chile',
          'turnos y cobertura 24/7 en seguridad',
        ],
        metadata: { paginaPublica: `${SITE.URL}/guias/` },
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:coverage`,
        displayName: 'Cobertura geográfica de GuardMan',
        type: 'application/json',
        description: `Las ${COVERAGE_TOTAL} comunas donde GuardMan opera, con su URL de detalle, más los sectores atendidos.`,
        data: coverageData,
        representativeQueries: [
          'GuardMan cubre Vitacura',
          'tienen cobertura en la Región de Valparaíso',
          'en qué sectores trabajan: residencial, industrial, salud',
        ],
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:contact:quote`,
        displayName: 'Solicitud de cotización de GuardMan',
        type: 'text/html',
        description:
          'Formulario público de cotización. Un agente puede completar nombre, correo, teléfono y servicio; la respuesta comercial es humana y en menos de 24 horas hábiles.',
        url: `${SITE.URL}/cotizacion/`,
        representativeQueries: [
          'quiero cotizar vigilancia para un condominio',
          'necesito precio de guardias de seguridad',
          'presupuesto para instalar CCTV',
        ],
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:compliance:denuncias`,
        displayName: 'Canal de denuncias de GuardMan',
        type: 'text/html',
        description:
          'Canal anónimo de denuncias y reporte de conflictos de interés: infracción al código de conducta, potencial delito, acoso laboral o sexual, y falla de seguridad o protocolo. No es un canal de urgencias, y no debe completarse de forma automatizada: exige una persona detrás.',
        url: `${SITE.URL}/canal-de-denuncias/`,
        representativeQueries: [
          'cómo hago una denuncia en GuardMan',
          'dónde reportar acoso laboral',
          'canal de denuncias anónimo GuardMan',
        ],
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:site:home`,
        displayName: 'GuardMan Chile — sitio web',
        type: 'text/html',
        description: `${SITE.TAGLINE}. Seguridad privada con certificación OS-10.`,
        url: `${SITE.URL}/`,
        representativeQueries: [
          'GuardMan Chile seguridad privada OS-10',
          'empresa de guardias de seguridad con certificación OS-10',
        ],
      },
    ] satisfies ArdEntry[],
  };
}

export const ARD_JSON_TYPE = 'application/ai-catalog+json';
