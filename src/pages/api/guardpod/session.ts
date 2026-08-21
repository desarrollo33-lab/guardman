// ════════════════════════════════════════════════════════════════
// /api/guardpod/session — gestión de sesión del cuestionario
//   GET: lee o crea la sesión del admin actual, devuelve questions + answers
//   POST: actualiza notes internas
// Solo admin (cookie gm_session).
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { isAdminRequest } from '../../../lib/auth-server';

export const prerender = false;

interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: { last_row_id?: number } }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

const VERSION = 'v1';

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

function genSessionId(): string {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GP-${ymd}-${rand}`;
}

export const GET: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return json({ ok: false, error: 'DB no configurada' }, 500);

  // Admin actual: usamos un email fijo por ahora (single-admin).
  // TODO: cuando haya multi-admin, leer de la cookie/session el email real.
  const adminEmail = 'admin@guardman.cl';

  // 1. Obtener o crear sesión
  let session = (await db
    .prepare('SELECT * FROM guardpod_sessions WHERE admin_email = ?')
    .bind(adminEmail)
    .first<{ id: string; admin_email: string; active_version: string; progress_pct: number; total_questions: number; answered_count: number; last_activity: string; started_at: string; completed_at: string | null; notes: string | null }>());

  if (!session) {
    const id = genSessionId();
    await db
      .prepare('INSERT INTO guardpod_sessions (id, admin_email, active_version) VALUES (?, ?, ?)')
      .bind(id, adminEmail, VERSION)
      .run();
    session = (await db
      .prepare('SELECT * FROM guardpod_sessions WHERE id = ?')
      .bind(id)
      .first()) as typeof session;
  }

  // 2. Cargar todas las preguntas de la versión activa
  const questionsRes = await db
    .prepare(
      `SELECT id, question_key, section, section_order, question_order, question_type,
              label, help_text, real_world_prompt, real_world_required, required,
              options_json, seo_relevance
         FROM guardpod_questions
        WHERE version = ?
        ORDER BY section_order, question_order`
    )
    .bind(session!.active_version)
    .all<{
      id: number; question_key: string; section: string; section_order: number;
      question_order: number; question_type: string; label: string;
      help_text: string | null; real_world_prompt: string | null;
      real_world_required: number; required: number; options_json: string | null;
      seo_relevance: number;
    }>();

  // 3. Cargar respuestas existentes
  const answersRes = await db
    .prepare('SELECT question_key, answer_text, answer_type, file_url, updated_at FROM guardpod_answers WHERE session_id = ?')
    .bind(session!.id)
    .all<{ question_key: string; answer_text: string | null; answer_type: string; file_url: string | null; updated_at: string }>();

  const answers: Record<string, { value: string; type: string; file_url: string | null; updated_at: string }> = {};
  for (const a of answersRes.results ?? []) {
    answers[a.question_key] = {
      value: a.answer_text ?? '',
      type: a.answer_type,
      file_url: a.file_url,
      updated_at: a.updated_at,
    };
  }

  // 4. Parsear options_json y agrupar por sección
  const sectionsMap = new Map<string, { name: string; order: number; questions: unknown[] }>();
  for (const q of questionsRes.results ?? []) {
    let options: unknown = null;
    if (q.options_json) {
      try { options = JSON.parse(q.options_json); } catch { options = null; }
    }
    const question = {
      key: q.question_key,
      section: q.section,
      order: q.question_order,
      type: q.question_type,
      label: q.label,
      help_text: q.help_text,
      real_world_prompt: q.real_world_prompt,
      real_world_required: q.real_world_required === 1,
      required: q.required === 1,
      options,
    };
    if (!sectionsMap.has(q.section)) {
      sectionsMap.set(q.section, { name: q.section, order: q.section_order, questions: [] });
    }
    sectionsMap.get(q.section)!.questions.push(question);
  }
  const sections = Array.from(sectionsMap.values()).sort((a, b) => a.order - b.order);

  return json({
    ok: true,
    session: {
      id: session!.id,
      admin_email: session!.admin_email,
      active_version: session!.active_version,
      progress_pct: session!.progress_pct,
      answered_count: session!.answered_count,
      total_questions: session!.total_questions,
      last_activity: session!.last_activity,
      started_at: session!.started_at,
      completed_at: session!.completed_at,
    },
    sections,
    answers,
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return json({ ok: false, error: 'DB no configurada' }, 500);

  let body: { session_id?: string; notes?: string };
  try {
    body = (await request.json()) as { session_id?: string; notes?: string };
  } catch {
    return json({ ok: false, error: 'JSON inválido' }, 400);
  }
  if (!body.session_id) {
    return json({ ok: false, error: 'session_id requerido' }, 400);
  }

  await db
    .prepare('UPDATE guardpod_sessions SET notes = ?, last_activity = ? WHERE id = ?')
    .bind(body.notes ?? null, new Date().toISOString(), body.session_id)
    .run();

  return json({ ok: true });
};
