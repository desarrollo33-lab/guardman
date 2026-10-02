// /.well-known/ard.json — ruta canónica de descubrimiento ARD (v0.91).
//
// `application/ai-catalog+json` es el media type que ARD prefiere. El mismo
// documento se sirve también en `/.well-known/ai-catalog.json` con
// `application/json`, que es la ruta que revisan los escáneres de la versión
// previa del data model.
import { buildArdManifest, ARD_JSON_TYPE } from '../../lib/ai-catalog';

export const prerender = false;

const headers = {
  'Content-Type': `${ARD_JSON_TYPE}; charset=utf-8`,
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600',
};

export const GET = () => new Response(JSON.stringify(buildArdManifest(), null, 2), { headers });
