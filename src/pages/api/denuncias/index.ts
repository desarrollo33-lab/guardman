// ════════════════════════════════════════════════════════════════
// /api/denuncias — Canal de Denuncias v4.1
//   POST: crea una denuncia (público, sin auth — el canal es anónimo)
//   GET:  lista denuncias (admin — requiere ?admin_token=... o header)
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateDenuncia, generateTrackingId } from '../../../lib/denuncias-validation';
import { SITE } from '../../../lib/constants';

// Tipo minimal de D1Database (sin depender de @cloudflare/workers-types).
// Lo usamos en runtime; @astrojs/cloudflare expone el binding real en
// `Astro.locals.runtime.env.DB` con la misma forma.
interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export const prerender = false;

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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });

// Hash simple para ip + salt (defensa anti-spam; no identifica al usuario).
async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}|${salt}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const checkAdmin = (request: Request, url: URL): boolean => {
  const headerToken = request.headers.get('x-admin-token') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const queryToken = url.searchParams.get('admin_token');
  const token = headerToken ?? queryToken;
  // Default dev token; en prod configurar DENUNCIAS_ADMIN_TOKEN en wrangler secret.
  const expected = 'v41-denu-2026';
  return Boolean(token) && token === expected;
};

// ── POST: crear denuncia (público) ─────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400, origin);
  }

  const result = validateDenuncia(body);
  if (!result.ok || !result.sanitized) {
    return json({ ok: false, error: 'Validación fallida', errors: result.errors }, 400, origin);
  }

  // Anti-spam suave: máximo 5 denuncias por IP-hash en 24h.
  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0';
  const salt = 'guardman-v41-denu'; // en prod, leer de env.DENU_SALT
  const ip_hash = await hashIp(ip, salt);

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await db
    .prepare('SELECT COUNT(*) AS c FROM denuncias WHERE ip_hash = ? AND created_at >= ?')
    .bind(ip_hash, since24h)
    .first<{ c: number }>();
  if (recent && recent.c >= 5) {
    return json(
      { ok: false, error: 'Has alcanzado el límite diario de denuncias. Intenta mañana.' },
      429,
      origin,
    );
  }

  const id = generateTrackingId();
  const ua = request.headers.get('user-agent') ?? null;
  const referer = request.headers.get('referer') ?? null;

  const s = result.sanitized;
  try {
    await db
      .prepare(
        `INSERT INTO denuncias (
          id, categoria, categoria_otro, relacion,
          fecha_incidente, lugar, personas_involucradas,
          descripcion, tiene_evidencia,
          nombre, email, telefono,
          ip_hash, user_agent, referer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        s.categoria,
        s.categoria_otro ?? null,
        s.relacion ?? null,
        s.fecha_incidente ?? null,
        s.lugar ?? null,
        s.personas_involucradas ?? null,
        s.descripcion,
        s.tiene_evidencia ?? null,
        s.nombre ?? null,
        s.email ?? null,
        s.telefono ?? null,
        ip_hash,
        ua,
        referer,
      )
      .run();
  } catch (err) {
    return json(
      {
        ok: false,
        error: 'No pudimos registrar la denuncia. Intenta nuevamente.',
        detail: err instanceof Error ? err.message : String(err),
      },
      500,
      origin,
    );
  }

  return json(
    {
      ok: true,
      id,
      message:
        'Denuncia registrada. Guarda tu ID de seguimiento para consultar el estado.',
      contacto: { sitio: SITE.NAME, email: SITE.EMAIL_INFO },
    },
    201,
    origin,
  );
};

// ── GET: listar denuncias (admin) ──────────────────────────────
export const GET: APIRoute = async ({ request, url }) => {
  const origin = request.headers.get('Origin');
  if (!checkAdmin(request, url)) {
    return json({ ok: false, error: 'No autorizado' }, 401, origin);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200);
  const status = url.searchParams.get('status');

  let query = 'SELECT id, created_at, categoria, relacion, lugar, fecha_incidente, status, tiene_evidencia FROM denuncias';
  const params: unknown[] = [];
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const rows = await db.prepare(query).bind(...params).all();

  const total = await db
    .prepare('SELECT COUNT(*) AS c FROM denuncias')
    .first<{ c: number }>();

  return json(
    {
      ok: true,
      total: total?.c ?? 0,
      count: (rows.results ?? []).length,
      denuncias: rows.results ?? [],
    },
    200,
    origin,
  );
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
