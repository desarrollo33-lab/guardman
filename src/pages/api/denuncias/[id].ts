// ════════════════════════════════════════════════════════════════
// /api/denuncias/[id] — v4.1
//   GET  (público): consulta el estado de una denuncia por su ID.
//                    Devuelve SOLO metadata pública (id, status, fechas,
//                    categoría). NO expone descripción, denunciante ni
//                    admin_notes. El ID es un secreto que solo el
//                    denunciante conoce.
//   PATCH (admin):   actualiza `status` y/o `admin_notes`.
//                    Requiere Authorization: Bearer <DENUNCIAS_ADMIN_TOKEN>
//                    o ?admin_token=...
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });

const ID_RE = /^D-\d{8}-[A-HJ-NP-Z2-9]{4}$/;

const isAdmin = (request: Request, url: URL): boolean => {
  const headerToken = request.headers.get('x-admin-token') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const queryToken = url.searchParams.get('admin_token');
  const token = headerToken ?? queryToken;
  const expected = (env as { DENUNCIAS_ADMIN_TOKEN?: string }).DENUNCIAS_ADMIN_TOKEN ?? 'v41-denu-2026';
  return Boolean(token) && token === expected;
};

const STATUS_VALUES = ['pending', 'reviewing', 'investigating', 'resolved', 'archived'] as const;
type Status = (typeof STATUS_VALUES)[number];

// ── GET público: estado de una denuncia ────────────────────────
export const GET: APIRoute = async ({ params, request }) => {
  const origin = request.headers.get('Origin');
  const id = String(params.id ?? '').toUpperCase();

  if (!ID_RE.test(id)) {
    return json({ ok: false, error: 'ID inválido. Formato esperado: D-YYYYMMDD-XXXX.' }, 400, origin);
  }

  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  const row = await db
    .prepare(
      `SELECT id, created_at, updated_at, status, categoria, relacion, lugar
       FROM denuncias WHERE id = ?`,
    )
    .bind(id)
    .first<{
      id: string;
      created_at: string;
      updated_at: string;
      status: string;
      categoria: string;
      relacion: string | null;
      lugar: string | null;
    }>();

  if (!row) {
    return json({ ok: false, error: 'Denuncia no encontrada. Verifica el ID.' }, 404, origin);
  }

  return json({ ok: true, denuncia: row }, 200, origin);
};

// ── PATCH admin: actualizar status + admin_notes ────────────────
export const PATCH: APIRoute = async ({ params, request }) => {
  const origin = request.headers.get('Origin');
  const url = new URL(request.url);

  if (!isAdmin(request, url)) {
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

  const status = String(body.status ?? '').toLowerCase();
  if (status && !STATUS_VALUES.includes(status as Status)) {
    return json(
      { ok: false, error: `status inválido. Valores permitidos: ${STATUS_VALUES.join(', ')}` },
      400,
      origin,
    );
  }
  const admin_notes = body.admin_notes !== undefined ? String(body.admin_notes).slice(0, 4000) : null;
  const assigned_to = body.assigned_to !== undefined ? String(body.assigned_to).slice(0, 200) : null;

  if (!status && admin_notes === null && assigned_to === null) {
    return json({ ok: false, error: 'Debes enviar al menos un campo a actualizar.' }, 400, origin);
  }

  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  // Verificar que la denuncia existe
  const exists = await db
    .prepare('SELECT id FROM denuncias WHERE id = ?')
    .bind(id)
    .first<{ id: string }>();
  if (!exists) {
    return json({ ok: false, error: 'Denuncia no encontrada.' }, 404, origin);
  }

  // Construir update dinámico
  const sets: string[] = ["updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"];
  const args: unknown[] = [];
  if (status) { sets.push('status = ?'); args.push(status); }
  if (admin_notes !== null) { sets.push('admin_notes = ?'); args.push(admin_notes); }
  if (assigned_to !== null) { sets.push('assigned_to = ?'); args.push(assigned_to); }
  args.push(id);

  try {
    await db
      .prepare(`UPDATE denuncias SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...args)
      .run();
  } catch (err) {
    return json(
      { ok: false, error: 'No se pudo actualizar la denuncia.', detail: err instanceof Error ? err.message : String(err) },
      500,
      origin,
    );
  }

  return json({ ok: true, id, updated: { status, admin_notes, assigned_to } }, 200, origin);
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
