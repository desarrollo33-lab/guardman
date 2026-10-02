// /.well-known/ai-catalog.json — ruta predecesora del manifiesto ARD.
//
// Mismo documento que `/.well-known/ard.json`. ARD v0.91 la define como
// cortesía: consultar esta ruta es opcional para el consumidor, y un
// publicador que se quede solo aquí puede no ser encontrado por un cliente
// conforme con el spec actual. Se mantiene porque los escáneres de
// descubrimiento de agentes (p. ej. isitagentready.com) revisan
// específicamente este path.
import { buildArdManifest } from '../../lib/ai-catalog';

export const prerender = false;

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600',
};

export const GET = () => new Response(JSON.stringify(buildArdManifest(), null, 2), { headers });
