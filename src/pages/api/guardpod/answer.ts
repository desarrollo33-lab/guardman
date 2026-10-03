// ════════════════════════════════════════════════════════════════
// /api/guardpod/answer — guarda una respuesta individual
//   POST body: { session_id, question_key, value, answer_type, file_url? }
//   Idempotente: UPSERT. Registra cambio en history si old != new.
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

export const POST: APIRoute = async ({ request }) => {
  if (!(await isAdminRequest(request))) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return json({ ok: false, error: 'DB no configurada' }, 500);

  let body: { session_id?: string; question_key?: string; value?: unknown; answer_type?: string; file_url?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'JSON inválido' }, 400);
  }
  if (!body.session_id || !body.question_key || !body.answer_type) {
    return json({ ok: false, error: 'session_id, question_key, answer_type son requeridos' }, 400);
  }
  if (!VALID_TYPES.has(body.answer_type)) {
    return json({ ok: false, error: `answer_type inválido: ${body.answer_type}` }, 400);
  }

  const valueText = body.value === null || body.value === undefined
    ? null
    : (typeof body.value === 'string' ? body.value : JSON.stringify(body.value));

  // Verificar que la sesión existe
  const session = await db
    .prepare('SELECT id FROM guardpod_sessions WHERE id = ?')
    .bind(body.session_id)
    .first<{ id: string }>();
  if (!session) {
    return json({ ok: false, error: 'Sesión no encontrada' }, 404);
  }

  // Leer valor anterior para history
  const previous = await db
    .prepare('SELECT answer_text FROM guardpod_answers WHERE session_id = ? AND question_key = ?')
    .bind(body.session_id, body.question_key)
    .first<{ answer_text: string | null }>();

  const now = new Date().toISOString();
  // "[]" es lo que produce un multiselect marcado y luego desmarcado. Sin
  // este caso se guardaba, contaba como respondida en el progreso y el export
  // la reportaba como `answered: true` con nada seleccionado.
  const isEmpty =
    valueText === null ||
    valueText === '' ||
    valueText === 'null' ||
    valueText === '[]' ||
    valueText === '{}';

  // UPSERT respuesta
  if (isEmpty) {
    // Si el value está vacío, eliminar la respuesta (no contar para progreso)
    await db
      .prepare('DELETE FROM guardpod_answers WHERE session_id = ? AND question_key = ?')
      .bind(body.session_id, body.question_key)
      .run();
  } else {
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
      .bind(body.session_id, body.question_key, valueText, body.answer_type, body.file_url ?? null, now)
      .run();
  }

  // History solo si hay cambio real
  const oldVal = previous?.answer_text ?? null;
  if (oldVal !== valueText) {
    await db
      .prepare(
        `INSERT INTO guardpod_answer_history (session_id, question_key, old_value, new_value, changed_at, changed_by)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(body.session_id, body.question_key, oldVal, valueText, now, 'admin@guardman.cl')
      .run();
  }

  // Recalcular progreso
  const session2 = await db
    .prepare('SELECT active_version FROM guardpod_sessions WHERE id = ?')
    .bind(body.session_id)
    .first<{ active_version: string }>();
  if (!session2) {
    return json({ ok: false, error: 'Sesión desapareció durante el guardado' }, 500);
  }
  const totalRes = await db
    .prepare('SELECT COUNT(*) AS total FROM guardpod_questions WHERE version = ?')
    .bind(session2.active_version)
    .first<{ total: number }>();
  // El JOIN importa: re-seedear el question set deja respuestas de keys que
  // ya no existen, y sin filtrar por la versión activa `answered` no baja
  // mientras `total` sí — el progreso terminaba en 130%.
  const answeredRes = await db
    .prepare(
      `SELECT COUNT(*) AS answered
         FROM guardpod_answers a
         JOIN guardpod_questions q
           ON q.question_key = a.question_key
          AND q.version = ?
        WHERE a.session_id = ?
          AND a.answer_text IS NOT NULL
          AND TRIM(a.answer_text) <> ''
          AND a.answer_text <> '[]'
          AND a.answer_text <> '{}'`,
    )
    .bind(session2.active_version, body.session_id)
    .first<{ answered: number }>();
  const total = totalRes?.total ?? 0;
  const answered = answeredRes?.answered ?? 0;
  const pct = total > 0 ? Math.round((answered / total) * 1000) / 10 : 0;

  // `completed_at` no lo escribía nadie: aparecía en el DDL y en los SELECT,
  // así que el export reportaba siempre `completed_at: null` por más que el
  // cuestionario estuviera al 100%. Se sella la primera vez que se llega.
  await db
    .prepare(
      `UPDATE guardpod_sessions
          SET progress_pct = ?, answered_count = ?, total_questions = ?, last_activity = ?,
              completed_at = CASE
                WHEN ? >= 100 AND completed_at IS NULL
                  THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
                ELSE completed_at
              END
        WHERE id = ?`,
    )
    .bind(pct, answered, total, now, pct, body.session_id)
    .run();

  return json({ ok: true, saved_at: now, progress_pct: pct, answered_count: answered, total_questions: total });
};
