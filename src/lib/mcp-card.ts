// Definición de las herramientas que ${SITE.NAME} expone a agentes, en un solo
// lugar. La consumen dos superficies que hoy podían divergir sin que nadie lo
// notara:
//
//   1. Los formularios (`/cotizacion`, `/contacto`), que emiten los atributos
//      `toolname` / `tooldescription` de WebMCP.
//   2. El MCP server card en `/.well-known/mcp.json`, que es lo que declara el
//      manifiesto ARD con `type: application/mcp-server-card+json`.
//
// La tarjeta describe herramientas que YA existen en el sitio. No promete nada
// que no se pueda invocar: un agente que la lea puede completar el formulario
// de verdad por la vía de WebMCP, y la respuesta es humana.
//
// Lo que NO entra acá, por decisión del 2026-10-02: el canal de denuncias. Una
// denuncia exige una persona identificable detrás, igual que quedó fuera de
// WebMCP.

export interface McpTool {
  name: string;
  description: string;
  /** Herramienta asociada en la superficie de WebMCP. */
  webmcp: { name: string; description: string };
  /** Párrafo que la herramienta NO hace, para que el agente no prometa de más. */
  limit: string;
  path: string;
}

export const MCP_TOOLS: McpTool[] = [
  {
    name: 'solicitar_cotizacion',
    description:
      'Registra una solicitud de cotización de seguridad privada para GuardMan Chile. Recibe los datos de la propiedad (comuna, tipo de propiedad, servicio requerido) y los datos de contacto de quien solicita. La respuesta comercial es humana y llega en menos de 24 horas hábiles.',
    webmcp: {
      name: 'guardman_solicitar_cotizacion',
      description:
        'Registra una solicitud de cotización de seguridad privada para GuardMan Chile. La respuesta comercial es humana y llega en menos de 24 horas hábiles; no devuelve precio. Use esta herramienta cuando la persona pida cotizar vigilancia, guardias, CCTV o control de accesos.',
    },
    limit:
      'No devuelve precio ni tiempo de instalación. Si la persona pregunta cuánto cuesta, la respuesta correcta es que se cotiza según el caso.',
    path: '/cotizacion/',
  },
  {
    name: 'enviar_mensaje',
    description:
      'Envía un mensaje o consulta a GuardMan Chile por seguridad privada. Acepta preguntas sobre servicios, cobertura, marco legal o cualquier otra consulta.',
    webmcp: {
      name: 'guardman_enviar_mensaje',
      description:
        'Envía un mensaje o consulta a GuardMan Chile por seguridad privada. La respuesta es humana y llega en menos de 24 horas hábiles. Para una cotización con datos de propiedad use guardman_solicitar_cotizacion en /cotizacion.',
    },
    limit:
      'La respuesta es humana y puede tardar un día hábil. No es un canal de urgencias: una emergencia se atiende por teléfono.',
    path: '/contacto/',
  },
];

/** Construye el documento MCP server card. */
export function buildMcpCard(siteUrl: string) {
  return {
    name: 'guardman-privada',
    version: '1.0.0',
    description:
      'Seguridad privada OS-10 en Chile. Expone el registro de solicitudes de cotización y el envío de consultas. Las respuestas son humanas.',
    websiteUrl: siteUrl,
    capabilities: ['lead-capture', 'customer-contact'],
    tools: MCP_TOOLS.map((t) => ({
      name: t.webmcp.name,
      description: t.webmcp.description,
      annotations: { readOnlyHint: false, destructiveHint: false },
      // Límite declarado en la propia herramienta: el agente no debe prometer
      // precio ni inmediatez si la herramienta no puede darlas.
      meta: { limite: t.limit, pagina: `${siteUrl}${t.path}` },
    })),
  };
}
