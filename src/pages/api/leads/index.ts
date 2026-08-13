// ════════════════════════════════════════════════════════════════
// /api/leads — gestión admin de leads
//   GET   : lista leads (paginado, filtrable por status/priority/source)
//   Requiere cookie gm_session válida (mismo patrón que denuncias).
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}
interface D1Database { prepare(query: string): D1PreparedStatement; }

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
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });

// Auth: cookie gm_session válida (mismo patrón que denuncias)
function isAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const sessionMatch = /(?:^|;\s*)gm_session=([^;]+)/.exec(cookieHeader);
  if (sessionMatch && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(sessionMatch[1])) {
    return true;
  }
  // Fallback: header X-Admin-Token (para integraciones externas / scripts)
  const adminToken = (env as { DENUNCIAS_ADMIN_TOKEN?: string }).DENUNCIAS_ADMIN_TOKEN;
  const headerToken = request.headers.get('x-admin-token');
  if (adminToken && headerToken === adminToken) return true;
  return false;
}

const VALID_STATUSES = ['new', 'contacted', 'visit', 'proposal', 'negotiation', 'won', 'lost'] as const;
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export const GET: APIRoute = async ({ request, url }) => {
  const origin = request.headers.get('Origin');
  if (!isAdmin(request)) {
    return json({ ok: false, error: 'No autorizado' }, 401, origin);
  }

  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200);
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0);
  const status = url.searchParams.get('status');
  const priority = url.searchParams.get('priority');
  const source = url.searchParams.get('source');
  const search = url.searchParams.get('q');

  const where: string[] = [];
  const params: unknown[] = [];
  if (status && (VALID_STATUSES as readonly string[]).includes(status)) {
    where.push('status = ?');
    params.push(status);
  }
  if (priority && (VALID_PRIORITIES as readonly string[]).includes(priority)) {
    where.push('priority = ?');
    params.push(priority);
  }
  if (source) {
    where.push('source = ?');
    params.push(source);
  }
  if (search) {
    where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Total count
  const totalRow = await db
    .prepare(`SELECT COUNT(*) AS c FROM leads ${whereClause}`)
    .bind(...params)
    .first<{ c: number }>();

  // Listado
  const listParams = [...params, limit, offset];
  const rows = await db
    .prepare(
      `SELECT id, created_at, updated_at, name, email, phone, company,
              service, location, sector, property_type, guards_count,
              message, status, priority, source, value,
              assigned_to, owner_email
         FROM leads
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
    )
    .bind(...listParams)
    .all<Record<string, unknown>>();

  return json(
    {
      ok: true,
      total: totalRow?.c ?? 0,
      count: (rows.results ?? []).length,
      limit,
      offset,
      leads: rows.results ?? [],
    },
    200,
    origin,
  );
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
