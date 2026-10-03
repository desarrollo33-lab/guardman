// /llms-cobertura.md — documento para agentes, derivado de las constantes del sitio.
//
// Las 16 comunas con cobertura, con enlace de detalle, y los sectores atendidos.
//
// Se sirve como 	ext/markdown, que es el media type que declara el manifiesto
// ARD para estas entradas. Servirlo como 	ext/plain seria decir una cosa y
// entregar otra: el media type es parte del contrato con el consumidor.
import { LLMS_DOCS } from '../lib/llms-docs';

export const prerender = false;

export const GET = () =>
  new Response(LLMS_DOCS['llms-cobertura.md'].body(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
