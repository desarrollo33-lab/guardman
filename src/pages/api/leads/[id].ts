// ════════════════════════════════════════════════════════════════
// /api/leads/[id] — gestión individual de un lead
//   GET   : lee el detalle (admin)
//   PATCH : actualiza status/priority/notes/assigned_to/value (admin)
//   Auth: cookie gm_session o DENUNCIAS_ADMIN_TOKEN
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
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });

function isAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const sessionMatch = /(?:^|;\s*)gm_session=([^;]+)/.exec(cookieHeader);
  if (sessionMatch && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(sessionMatch[1])) {
    return true;
  }
  const adminToken = (env as { DENUNCIAS_ADMIN_TOKEN?: string }).DENUNCIAS_ADMIN_TOKEN;
  const headerToken = request.headers.get('x-admin-token');
  if (adminToken && headerToken === adminToken) return true;
  return false;
}

const ID_RE = /^L-\d{8}-[A-HJ-NP-Z2-9]{4}$/;

const VALID_STATUSES = ['new', 'contacted', 'visit', 'proposal', 'negotiation', 'won', 'lost'] as const;
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export const GET: APIRoute = async ({ params, request }) => {
  const origin = request.headers.get('Origin');
  if (!isAdmin(request)) {
    return json({ ok: false, error: 'No autorizado' }, 401, origin);
  }

  const id = String(params.id ?? '').toUpperCase();
  if (!ID_RE.test(id)) {
    return json({ ok: false, error: 'ID inválido.' }, 400, origin);
  }

  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  const row = await db
    .prepare('SELECT * FROM leads WHERE id = ?')
    .bind(id)
    .first<Record<string, unknown>>();

  if (!row) {
    return json({ ok: false, error: 'Lead no encontrado.' }, 404, origin);
  }

  return json({ ok: true, lead: row }, 200, origin);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const origin = request.headers.get('Origin');
  if (!isAdmin(request)) {
    return json({ ok: false, error: 'No autorizado' }, 401, origin);
  }

  const id = String(params.id ?? '').toUpperCase();
  if (!ID_RE.test(id)) {
    return json({ ok: false, error: 'ID inválido.' }, 400, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400, origin);
  }

  const status = body.status !== undefined ? String(body.status) : undefined;
  if (status !== undefined && !(VALID_STATUSES as readonly string[]).includes(status)) {
    return json(
      { ok: false, error: `status inválido. Valores: ${VALID_STATUSES.join(', ')}` },
      400,
      origin,
    );
  }

  const priority = body.priority !== undefined ? String(body.priority) : undefined;
  if (priority !== undefined && !(VALID_PRIORITIES as readonly string[]).includes(priority)) {
    return json(
      { ok: false, error: `priority inválido. Valores: ${VALID_PRIORITIES.join(', ')}` },
      400,
      origin,
    );
  }

  const admin_notes = body.admin_notes !== undefined ? String(body.admin_notes).slice(0, 4000) : undefined;
  const assigned_to = body.assigned_to !== undefined ? String(body.assigned_to).slice(0, 200) : undefined;
  const value = body.value !== undefined ? Math.max(0, Math.floor(Number(body.value))) : undefined;

  if (
    status === undefined &&
    priority === undefined &&
    admin_notes === undefined &&
    assigned_to === undefined &&
    value === undefined
  ) {
    return json({ ok: false, error: 'Debes enviar al menos un campo a actualizar.' }, 400, origin);
  }

  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  const exists = await db
    .prepare('SELECT id FROM leads WHERE id = ?')
    .bind(id)
    .first<{ id: string }>();
  if (!exists) {
    return json({ ok: false, error: 'Lead no encontrado.' }, 404, origin);
  }

  const sets: string[] = ["updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"];
  const args: unknown[] = [];
  if (status !== undefined) { sets.push('status = ?'); args.push(status); }
  if (priority !== undefined) { sets.push('priority = ?'); args.push(priority); }
  if (admin_notes !== undefined) { sets.push('admin_notes = ?'); args.push(admin_notes); }
  if (assigned_to !== undefined) { sets.push('assigned_to = ?'); args.push(assigned_to); }
  if (value !== undefined) { sets.push('value = ?'); args.push(value); }
  args.push(id);

  try {
    await db
      .prepare(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...args)
      .run();
  } catch (err) {
    return json(
      {
        ok: false,
        error: 'No se pudo actualizar el lead.',
        detail: err instanceof Error ? err.message : String(err),
      },
      500,
      origin,
    );
  }

  return json({ ok: true, id, updated: { status, priority, admin_notes, assigned_to, value } }, 200, origin);
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
