// ════════════════════════════════════════════════════════════════
// /api/guardpod/progress — solo % progreso (chequeo ligero)
//   GET: devuelve { progress_pct, answered_count, total, last_activity, completed }
// Solo admin.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { isAdminRequest } from '../../../lib/auth-server';

export const prerender = false;

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const GET: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return json({ ok: false, error: 'DB no configurada' }, 500);

  const adminEmail = 'admin@guardman.cl';
  const session = await db
    .prepare('SELECT id, progress_pct, answered_count, total_questions, last_activity, completed_at FROM guardpod_sessions WHERE admin_email = ?')
    .bind(adminEmail)
    .first<{ id: string; progress_pct: number; answered_count: number; total_questions: number; last_activity: string; completed_at: string | null }>();

  if (!session) {
    return json({ ok: true, progress_pct: 0, answered_count: 0, total: 0, last_activity: null, completed: false });
  }

  return json({
    ok: true,
    progress_pct: session.progress_pct,
    answered_count: session.answered_count,
    total: session.total_questions,
    last_activity: session.last_activity,
    completed: session.completed_at !== null,
  });
};
