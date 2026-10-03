// /llms-marco-legal.md — documento para agentes, derivado de las constantes del sitio.
//
// Ley 21.659, su reglamento y las guías sobre OS-10 y facultades de un guardia, con fuentes oficiales.
//
// Se sirve como 	ext/markdown, que es el media type que declara el manifiesto
// ARD para estas entradas. Servirlo como 	ext/plain seria decir una cosa y
// entregar otra: el media type es parte del contrato con el consumidor.
import { LLMS_DOCS } from '../lib/llms-docs';
import { ARD_MARKDOWN_TYPE } from '../lib/constants';

export const prerender = false;

export const GET = () =>
  new Response(LLMS_DOCS['llms-marco-legal.md'].body(), {
    headers: {
      'Content-Type': `${ARD_MARKDOWN_TYPE}; charset=utf-8`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
