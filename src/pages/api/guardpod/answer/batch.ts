// ════════════════════════════════════════════════════════════════
// /api/guardpod/answer/batch — guarda varias respuestas en un solo POST
//   POST body: { session_id, answers: [{ question_key, value, answer_type }, ...] }
//   Útil para flush al cerrar pestaña.
// Solo admin.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { isAdminRequest } from '../../../../lib/auth-server';

export const prerender = false;

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: { last_row_id?: number; changes?: number } }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const VALID_TYPES = new Set(['text', 'textarea', 'number', 'select', 'multiselect', 'boolean', 'slider', 'upload', 'url', 'date']);

interface AnswerInput {
  question_key: string;
  value: unknown;
  answer_type: string;
  file_url?: string;
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return json({ ok: false, error: 'DB no configurada' }, 500);

  let body: { session_id?: string; answers?: AnswerInput[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'JSON inválido' }, 400);
  }
  if (!body.session_id || !Array.isArray(body.answers)) {
    return json({ ok: false, error: 'session_id y answers[] requeridos' }, 400);
  }
  if (body.answers.length > 200) {
    return json({ ok: false, error: 'Máximo 200 respuestas por batch' }, 400);
  }

  const session = await db
    .prepare('SELECT id, active_version FROM guardpod_sessions WHERE id = ?')
    .bind(body.session_id)
    .first<{ id: string; active_version: string }>();
  if (!session) {
    return json({ ok: false, error: 'Sesión no encontrada' }, 404);
  }

  const now = new Date().toISOString();
  let saved = 0;
  let skipped = 0;

  for (const a of body.answers) {
    if (!a.question_key || !a.answer_type || !VALID_TYPES.has(a.answer_type)) {
      skipped++;
      continue;
    }
    const valueText = a.value === null || a.value === undefined
      ? null
      : (typeof a.value === 'string' ? a.value : JSON.stringify(a.value));
    const isEmpty = valueText === null || valueText === '' || valueText === 'null';

    if (isEmpty) {
      await db
        .prepare('DELETE FROM guardpod_answers WHERE session_id = ? AND question_key = ?')
        .bind(body.session_id, a.question_key)
        .run();
    } else {
      // leer anterior
      const previous = await db
        .prepare('SELECT answer_text FROM guardpod_answers WHERE session_id = ? AND question_key = ?')
        .bind(body.session_id, a.question_key)
        .first<{ answer_text: string | null }>();
      const oldVal = previous?.answer_text ?? null;

      await db
        .prepare(
          `INSERT INTO guardpod_answers (session_id, question_key, answer_text, answer_type, file_url, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT (session_id, question_key) DO UPDATE SET
             answer_text = excluded.answer_text,
             answer_type = excluded.answer_type,
             file_url = excluded.file_url,
             updated_at = excluded.updated_at`
        )
        .bind(body.session_id, a.question_key, valueText, a.answer_type, a.file_url ?? null, now)
        .run();

      if (oldVal !== valueText) {
        await db
          .prepare(
            `INSERT INTO guardpod_answer_history (session_id, question_key, old_value, new_value, changed_at, changed_by)
             VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(body.session_id, a.question_key, oldVal, valueText, now, 'admin@guardman.cl')
          .run();
      }
      saved++;
    }
  }

  // Recalcular progreso
  const totalRes = await db
    .prepare('SELECT COUNT(*) AS total FROM guardpod_questions WHERE version = ?')
    .bind(session.active_version)
    .first<{ total: number }>();
  const answeredRes = await db
    .prepare('SELECT COUNT(*) AS answered FROM guardpod_answers WHERE session_id = ? AND answer_text IS NOT NULL AND answer_text <> ""')
    .bind(body.session_id)
    .first<{ answered: number }>();
  const total = totalRes?.total ?? 0;
  const answered = answeredRes?.answered ?? 0;
  const pct = total > 0 ? Math.round((answered / total) * 1000) / 10 : 0;

  await db
    .prepare('UPDATE guardpod_sessions SET progress_pct = ?, answered_count = ?, total_questions = ?, last_activity = ? WHERE id = ?')
    .bind(pct, answered, total, now, body.session_id)
    .run();

  return json({ ok: true, saved, skipped, saved_at: now, progress_pct: pct, answered_count: answered, total_questions: total });
};
