// /api/health — healthcheck. CORS restrictivo: solo guardman.cl + dev.
// Verifica binding D1 con SELECT 1. Devuelve 503 si falla.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const ALLOWED_ORIGINS = new Set([
  'https://guardman.cl',
  'https://www.guardman.cl',
  'https://guardman-astro.oficinadesarrollo33.workers.dev',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

const corsHeaders = (origin: string | null): HeadersInit => {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://guardman.cl';
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}
interface D1Database { prepare(query: string): D1PreparedStatement; }

export const GET: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');
  const db = (env as { DB?: D1Database }).DB;

  let dbOk = false;
  let dbError: string | null = null;
  if (db) {
    try {
      const result = await db.prepare('SELECT 1 AS ok').first<{ ok: number }>();
      dbOk = result?.ok === 1;
    } catch (err) {
      dbError = err instanceof Error ? err.message : String(err);
    }
  } else {
    dbError = 'binding ausente';
  }

  const ok = dbOk;
  const body = {
    ok,
    service: 'guardman-astro',
    version: '5.3.0',
    hosting: 'cloudflare-workers',
    features: [
      'crm-only-admin',
      'lead-capture-optimized',
      'seo-geo-ready',
      'hreflang',
      'structured-data',
      'canal-denuncias-anonimo',
      'd1-bound',
      'ssr-auth-middleware',
    ],
    checks: {
      d1: dbOk ? 'ok' : `fail: ${dbError}`,
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: ok ? 200 : 503,
    headers: corsHeaders(origin),
  });
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
