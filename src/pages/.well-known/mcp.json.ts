// /.well-known/mcp.json — MCP server card de los servicios que el sitio ya
// expone por WebMCP.
//
// Es la entrada que hace que GuardMan sea una capacidad invocable y no sólo un
// sitio con un catálogo. El manifiesto ARD la referencia con
// `type: application/mcp-server-card+json`, que es un tipo estándar de
// descubrimiento.
//
// Lo que hay acá ya existe en el sitio: son los mismos formularios de
// /cotizacion y /contacto, con los mismos nombres de herramienta. La tarjeta se
// genera desde `src/lib/mcp-card.ts`, que es la misma fuente que usan los
// formularios, así que no pueden divergir.
import { SITE } from '../../lib/constants';
import { buildMcpCard } from '../../lib/mcp-card';

export const prerender = false;

const headers = {
  'Content-Type': 'application/mcp-server-card+json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600',
};

export const GET = () => new Response(JSON.stringify(buildMcpCard(SITE.URL), null, 2), { headers });
