// ════════════════════════════════════════════════════════════════
// GuardMan — Manifiesto de descubrimiento ARD
//
// Un solo documento, servido en dos rutas:
//
//   /.well-known/ard.json           → ruta canónica (ARD v0.91)
//   /.well-known/ai-catalog.json    → ruta predecesora (cortesía)
//
// Por qué las dos: ARD v0.91 (agenticresourcediscovery.org, ago 2026)
// renombró la ruta canónica a `ard.json` y dejó `ai-catalog.json` como
// cortesía opcional — "consultar esa ruta es cortesía, no conformidad", y un
// publicador que se quede solo en la ruta vieja "puede no ser encontrado".
// Servir ambas con el mismo documento es lo que hace descubrible el sitio a un
// consumidor conforme con el spec actual y a uno que sólo implemente la versión
// previa.
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
// ── Qué describe este manifiesto, y qué no ────────────────────────
//
// Describe lo que el sitio REALMENTE ofrece a un agente autónomo:
// documentación para leer, dos herramientas invocables, y referencia técnica
// con fuente oficial. Eso son 6 entradas.
//
// Lo que NO describe, y es deliberado:
//
// · Las páginas públicas (home, formulario de cotización y canal de denuncias).
//   No son recursos agentic: son superficies humanas. Un manifiesto que las
//   lista hace que un dominio con 10 años de trayectoria parezca un publicador
//   de agentes. Su contenido sigue disponible donde un agente lo busca de
//   verdad: /llms.txt, el JSON-LD de cada página y el pie de sitio. La
//   cotización, además, queda mejor cubierta por la herramienta MCP que por
//   una entrada de formulario.
//
// · El canal de denuncias, además, por la decisión del 2026-10-02: una denuncia
//   exige una persona identificable detrás. Quedó fuera de WebMCP y queda fuera
//   acá, por la misma razón.
//
// ── Conformidad ──────────────────────────────────────────────────
//
// El manifiesto se valida en `tests/ai-catalog.test.ts` contra LOS DOS
// esquemas oficiales, vendorizados en `tests/fixtures/`: `ard.json` contra
// `ard-entry.schema.json` (el autoritativo de ARD v0.91) y `ai-catalog.json`
// contra `ai-catalog.schema.json` (el data model predecesor). También se
// comprueban las restricciones de descubrimiento del §D.2.
//
// Reglas que ya rompimos y hay que respetar al agregar entradas:
//   1. `host` en el esquema predecesor es additionalProperties:false — sólo
//      displayName, identifier, documentationUrl, logoUrl y trustManifest.
//   2. Cada entrada lleva `url` XOR `data` (Strict Value-or-Reference).
//   3. El media type dice lo que el artefacto ES. `text/markdown` para
//      documentos, `application/mcp-server-card+json` para la tarjeta MCP.
//      Etiquetar un payload propio como `application/ai-catalog+json` haría que
//      un consumidor conforme intente parsearlo como manifiesto y falle: por eso
//      los catálogos se publican como markdown y no inline.
//   4. `trustManifest.identity` debe alinear con el dominio del URN (§4.5.1).
//
// Para revalidar contra producción: `node scripts/validate-ai-catalog.mjs`.
// ════════════════════════════════════════════════════════════════

import {
  SITE,
  COVERAGE_TOTAL,
  OPENING_HOURS_TEXT,
  TIMEZONE_LABEL,
} from './constants';
import { MCP_TOOLS } from './mcp-card';

export const PUBLISHER_DOMAIN = 'guardman.cl';
const PUBLISHER_DID = `did:web:${PUBLISHER_DOMAIN}`;

export interface ArdEntry {
  identifier: string;
  displayName: string;
  type: string;
  description: string;
  /** Exactamente uno de `url` o `data` — nunca ambos, nunca ninguno. */
  url?: string;
  data?: unknown;
  /** Tokens de filtrado estructurado. Un registry los usa para encontrar la
   *  entrada sin descargar el artefacto (§4.2, §5.3.1). */
  capabilities?: string[];
  representativeQueries: string[];
  trustManifest?: { identity: string; identityType: 'did' };
  metadata?: Record<string, string | number | boolean | null>;
}

/** Identidad del publicador. §4.5.1 exige que el dominio del trustManifest
 *  alinee con el del URN de la entrada; ambos son guardman.cl. */
const trust: ArdEntry['trustManifest'] = { identity: PUBLISHER_DID, identityType: 'did' };

const md = (file: string) => `${SITE.URL}/${file}`;

export function buildArdManifest() {
  return {
    specVersion: '1.0',
    host: {
      displayName: SITE.NAME,
      identifier: PUBLISHER_DID,
      // `host` es `additionalProperties: false` en el esquema predecesor: sólo
      // admite displayName, identifier, documentationUrl, logoUrl y
      // trustManifest. Los datos que antes vivían acá —teléfono, horario,
      // dirección, redes— están en `metadata` de la entrada de llms.txt, que
      // ambos esquemas sí permiten, y en /llms.txt y en el JSON-LD.
      documentationUrl: `${SITE.URL}/llms.txt`,
      logoUrl: `${SITE.URL}/images/logo-byn.png`,
    },
    entries: [
      {
        // Herramientas invocables. Es la entrada que hace que GuardMan sea una
        // capacidad y no sólo un sitio: describe herramientas que ya existen
        // (los formularios de /cotizacion y /contacto por WebMCP).
        identifier: `urn:air:${PUBLISHER_DOMAIN}:mcp:guardman-privada`,
        displayName: `${SITE.NAME} — cotización y consultas`,
        type: 'application/mcp-server-card+json',
        description:
          'Servidor MCP de GuardMan Chile con dos herramientas: registrar una solicitud de cotización de seguridad privada y enviar una consulta. La respuesta es humana y llega en menos de 24 horas hábiles; ninguna herramienta devuelve precio.',
        url: `${SITE.URL}/.well-known/mcp.json`,
        capabilities: ['LeadCapture', 'CustomerContact', 'SecurityServices', 'Cotizacion'],
        representativeQueries: [
          'quiero cotizar vigilancia para un condominio en Santiago',
          'necesito un precio para instalar cámaras de seguridad',
          'tienen cobertura de seguridad en Las Condes',
          'cómo elijo una empresa de seguridad privada en Chile',
        ],
        trustManifest: trust,
        metadata: {
          canal: `${SITE.URL}/cotizacion/`,
          telefono: SITE.PHONE,
          horario: `${OPENING_HOURS_TEXT} (${TIMEZONE_LABEL})`,
        },
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:llms-txt`,
        displayName: 'GuardMan Chile — resumen estructurado del sitio',
        type: 'text/markdown',
        description:
          'Documento markdown generado desde las constantes del sitio: servicios, cobertura real por comuna, horario, contacto y preguntas frecuentes. Es la fuente que ya deben leer los asistentes.',
        url: `${SITE.URL}/llms.txt`,
        capabilities: ['SiteOverview', 'SecurityServices', 'Contact'],
        representativeQueries: [
          'qué servicios de seguridad privada ofrece GuardMan en Chile',
          'en qué comunas de Santiago trabaja GuardMan',
          'cuál es el teléfono y el horario de GuardMan',
        ],
        trustManifest: trust,
        // El teléfono y el horario son los dos datos que un asistente más
        // necesita y menos suele acertar. Se declaran acá —y no en `host`— para
        // que no dependan de que el agente raspe el HTML.
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
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:servicios`,
        displayName: 'Catálogo de servicios de GuardMan',
        type: 'text/markdown',
        description:
          'Los servicios que ofrece GuardMan con su descripción y su URL pública, más el producto físico Guardpod. Para verificar si un servicio específico existe antes de proponerlo.',
        url: md('llms-servicios.md'),
        capabilities: ['SecurityServices', 'Guardias', 'CCTV', 'ControlDeAccesos', 'Monitoreo24x7', 'Guardpod'],
        representativeQueries: [
          'GuardMan instala cámaras de videovigilancia',
          'hacen escolta de personas en Chile',
          'venden un sistema de vigilancia autónomo sin electricidad',
        ],
        trustManifest: trust,
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:marco-legal`,
        displayName: 'Marco legal de la seguridad privada en Chile',
        type: 'text/markdown',
        description:
          'Ley 21.659, su reglamento y las guías sobre certificación OS-10, facultades y límites de un guardia, y funciones de vigilancia en condominios. Cada guía declara la norma vigente, su fecha de actualización y enlaza la fuente oficial. Es la referencia pública de GuardMan sobre el marco regulatorio del rubro.',
        url: md('llms-marco-legal.md'),
        capabilities: ['Normativa', 'Ley21659', 'OS10', 'Reglamento'],
        representativeQueries: [
          'qué es la certificación OS-10 en Chile',
          'qué establece la Ley 21.659 de seguridad privada',
          'qué puede hacer un guardia de seguridad en Chile',
          'diferencia entre guardia de seguridad y vigilante privado',
        ],
        trustManifest: trust,
        metadata: { paginaPublica: `${SITE.URL}/seguridad-privada/` },
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:guias-dotacion`,
        displayName: 'Guías de dotación y contratación de seguridad',
        type: 'text/markdown',
        description:
          'Método de dimensionamiento de puestos de seguridad (acceso, riesgo y horario) y puntos a verificar antes de contratar. GuardMan publica el método y no los ratios de dotación.',
        url: md('llms-guias.md'),
        capabilities: ['Dotacion', 'Contratacion', 'Metodo'],
        representativeQueries: [
          'cuántos guardias necesita un condominio',
          'cómo elegir una empresa de seguridad privada en Chile',
          'turnos y cobertura 24/7 en seguridad',
        ],
        trustManifest: trust,
        metadata: { paginaPublica: `${SITE.URL}/guias/` },
      },
      {
        identifier: `urn:air:${PUBLISHER_DOMAIN}:content:coverage`,
        displayName: 'Cobertura geográfica de GuardMan',
        type: 'text/markdown',
        description: `Las ${COVERAGE_TOTAL} comunas donde GuardMan opera, con su URL de detalle, más los sectores atendidos y dónde NO hay cobertura.`,
        url: md('llms-cobertura.md'),
        capabilities: ['Cobertura', 'RegionMetropolitana', 'Valparaiso'],
        representativeQueries: [
          'GuardMan cubre Vitacura',
          'tienen cobertura en la Región de Valparaíso',
          'en qué sectores trabajan: residencial, industrial, salud',
        ],
        trustManifest: trust,
      },
    ] satisfies ArdEntry[],
  };
}

export const ARD_JSON_TYPE = 'application/ai-catalog+json';

/** Las herramientas que el manifiesto declara, para verificar que la tarjeta
 *  MCP y los formularios no puedan divergir. */
export const manifestToolCount = MCP_TOOLS.length;
