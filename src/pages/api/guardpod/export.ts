// ════════════════════════════════════════════════════════════════
// /api/guardpod/export — descarga JSON con todas las respuestas
//   GET: devuelve { session, questions, answers_by_section, flat_answers }
//   Útil para construir guardpod.cl y para auditoría.
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
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="guardpod-answers.json"',
    },
  });

export const GET: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return json({ ok: false, error: 'DB no configurada' }, 500);

  const adminEmail = 'admin@guardman.cl';
  const session = await db
    .prepare('SELECT * FROM guardpod_sessions WHERE admin_email = ?')
    .bind(adminEmail)
    .first<{ id: string; admin_email: string; active_version: string; progress_pct: number; answered_count: number; total_questions: number; last_activity: string; started_at: string; completed_at: string | null; notes: string | null }>();
  if (!session) {
    return json({ ok: false, error: 'No hay sesión activa' }, 404);
  }

  const questionsRes = await db
    .prepare(
      `SELECT question_key, section, section_order, question_order, question_type, label,
              help_text, real_world_prompt, real_world_required, required, options_json
         FROM guardpod_questions
        WHERE version = ?
        ORDER BY section_order, question_order`
    )
    .bind(session.active_version)
    .all<{
      question_key: string; section: string; section_order: number; question_order: number;
      question_type: string; label: string; help_text: string | null;
      real_world_prompt: string | null; real_world_required: number; required: number;
      options_json: string | null;
    }>();

  const answersRes = await db
    .prepare('SELECT question_key, answer_text, answer_type, file_url, updated_at FROM guardpod_answers WHERE session_id = ?')
    .bind(session.id)
    .all<{ question_key: string; answer_text: string | null; answer_type: string; file_url: string | null; updated_at: string }>();

  const answersByKey: Record<string, { value: string | null; type: string; file_url: string | null; updated_at: string }> = {};
  for (const a of answersRes.results ?? []) {
    answersByKey[a.question_key] = { value: a.answer_text, type: a.answer_type, file_url: a.file_url, updated_at: a.updated_at };
  }

  // Agrupar por sección
  const sectionsMap = new Map<string, { name: string; order: number; questions: unknown[] }>();
  for (const q of questionsRes.results ?? []) {
    const ans = answersByKey[q.question_key];
    const value = ans?.value ?? null;
    let parsed: unknown = value;
    if (value !== null && (q.question_type === 'multiselect' || q.question_type === 'boolean' || q.question_type === 'number' || q.question_type === 'slider')) {
      try { parsed = JSON.parse(value); } catch { parsed = value; }
    }
    const options = q.options_json ? (() => { try { return JSON.parse(q.options_json); } catch { return null; } })() : null;

    const item = {
      key: q.question_key,
      order: q.question_order,
      type: q.question_type,
      label: q.label,
      help_text: q.help_text,
      real_world_prompt: q.real_world_prompt,
      real_world_required: q.real_world_required === 1,
      required: q.required === 1,
      options,
      value: parsed,
      raw_value: value,
      answered: value !== null && value !== '',
      updated_at: ans?.updated_at ?? null,
    };
    if (!sectionsMap.has(q.section)) {
      sectionsMap.set(q.section, { name: q.section, order: q.section_order, questions: [] });
    }
    sectionsMap.get(q.section)!.questions.push(item);
  }
  const sections = Array.from(sectionsMap.values()).sort((a, b) => a.order - b.order);

  const flat_answers: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(answersByKey)) {
    let val: unknown = v.value;
    if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{') || val === 'true' || val === 'false' || /^-?\d+(\.\d+)?$/.test(val))) {
      try { val = JSON.parse(val as string); } catch { /* keep string */ }
    }
    flat_answers[k] = val;
  }

  return json({
    ok: true,
    exported_at: new Date().toISOString(),
    session: {
      id: session.id,
      admin_email: session.admin_email,
      active_version: session.active_version,
      progress_pct: session.progress_pct,
      answered_count: session.answered_count,
      total_questions: session.total_questions,
      last_activity: session.last_activity,
      started_at: session.started_at,
      completed_at: session.completed_at,
      notes: session.notes,
    },
    sections,
    flat_answers,
  });
};
