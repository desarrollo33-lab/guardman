// ════════════════════════════════════════════════════════════════
// /api/leads/capture — endpoint PÚBLICO de captura de leads
//   Usado por los formularios de /contacto y /cotizacion.
//   Valida, sanitiza, persiste en D1 y devuelve 201 con id.
//
//   Sin auth: el formulario público es anónimo.
//   Anti-spam: rate limit por IP-hash (10/24h, igual que denuncias).
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateLead } from '../../../lib/validation';

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
  'https://guardman.oficinadesarrollo33.workers.dev',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

const corsHeaders = (origin: string | null): HeadersInit => {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://guardman.cl';
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });

// Genera ID de lead: L-YYYYMMDD-XXXX (alfabeto sin 0/O/1/I para evitar confusión)
function generateLeadId(): string {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32])
    .join('');
  return `L-${ymd}-${rand}`;
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}|${salt}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400, origin);
  }

  // Validación (mismas reglas que el cliente y que el endpoint admin)
  const result = validateLead(body);
  if (!result.ok || !result.sanitized) {
    return json({ ok: false, error: 'Validación fallida', errors: result.errors }, 400, origin);
  }

  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return json({ ok: false, error: 'DB no configurada' }, 500, origin);
  }

  // Anti-spam: 10 leads por IP-hash en 24h
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0';
  const salt = (env as { LEADS_SALT?: string }).LEADS_SALT;
  let ip_hash: string | null = null;
  if (salt) {
    ip_hash = await hashIp(ip, salt);
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recent = await db
      .prepare('SELECT COUNT(*) AS c FROM leads WHERE ip_hash = ? AND created_at >= ?')
      .bind(ip_hash, since24h)
      .first<{ c: number }>();
    if (recent && recent.c >= 10) {
      return json(
        { ok: false, error: 'Has alcanzado el límite diario de consultas. Intenta mañana.' },
        429,
        origin,
      );
    }
  }

  const id = generateLeadId();
  const ua = request.headers.get('user-agent') ?? null;
  const referer = request.headers.get('referer') ?? null;
  const s = result.sanitized;
  // Mapear source del form a enum del backend
  const source = s.source === 'cotizacion' ? 'web_cotizacion' : 'web_contacto';

  try {
    await db
      .prepare(
        `INSERT INTO leads (
          id, name, email, phone, company,
          service, location, sector, property_type, guards_count,
          message, source, status, priority, value,
          ip_hash, user_agent, referer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'medium', 0, ?, ?, ?)`,
      )
      .bind(
        id,
        s.name,
        s.email,
        s.phone,
        s.company ?? null,
        s.service,
        s.location ?? null,
        null,
        s.property_type ?? null,
        s.guards_count ?? null,
        s.message ?? null,
        source,
        ip_hash,
        ua,
        referer,
      )
      .run();
  } catch (err) {
    return json(
      {
        ok: false,
        error: 'No pudimos registrar tu consulta. Intenta nuevamente.',
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
      message: 'Consulta registrada. Te contactaremos en menos de 24 horas hábiles.',
    },
    201,
    origin,
  );
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
