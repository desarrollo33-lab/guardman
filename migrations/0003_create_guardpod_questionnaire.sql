-- ════════════════════════════════════════════════════════════════
-- GuardMan Chile — Migración 0003: Cuestionario GuardPod
-- v5.5.0 — D1 guardman-v2-db
--
-- Sistema de cuestionario profundo sobre el producto GuardPod.
-- Almacena respuestas con autoguardado por pregunta individual.
-- Base de conocimiento para construir guardpod.cl y dominar
-- la categoría "vigilancia autónoma" en Chile.
--
-- Diseño:
--   - Cuestionario versionado (definitions inmutables + active_version).
--   - Una sesión por admin (admin_email), sin expiración.
--   - Una fila por respuesta (NO JSON blob) → queries SQL limpias.
--   - question_key estable (no autoincrement) → cambios de orden
--     no rompen integraciones.
--   - help_text: tooltip "qué queremos conocer de GuardPod" (sin SEO,
--     sin tecnicismos, lenguaje directo).
--   - real_world_prompt: placeholder que fuerza respuesta basada en
--     experiencia real (no marketing).
--   - real_world_required: si 1, la pregunta no acepta "no sé / saltar".
-- ════════════════════════════════════════════════════════════════

-- ── Definición de preguntas (cuestionario versionado) ──
CREATE TABLE IF NOT EXISTS guardpod_questions (
  id                   INTEGER PRIMARY KEY,
  version              TEXT NOT NULL,
  question_key         TEXT NOT NULL,
  section              TEXT NOT NULL,
  section_order        INTEGER NOT NULL,
  question_order       INTEGER NOT NULL,
  question_type        TEXT NOT NULL,
  label                TEXT NOT NULL,
  help_text            TEXT,
  real_world_prompt    TEXT,
  real_world_required  INTEGER NOT NULL DEFAULT 0,
  required             INTEGER NOT NULL DEFAULT 0,
  options_json         TEXT,
  seo_relevance        INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(version, question_key)
);

CREATE INDEX IF NOT EXISTS idx_gp_q_version  ON guardpod_questions(version);
CREATE INDEX IF NOT EXISTS idx_gp_q_section  ON guardpod_questions(version, section, question_order);

-- ── Sesiones del cuestionario ──
CREATE TABLE IF NOT EXISTS guardpod_sessions (
  id              TEXT PRIMARY KEY,
  admin_email     TEXT NOT NULL,
  active_version  TEXT NOT NULL,
  progress_pct    REAL NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answered_count  INTEGER NOT NULL DEFAULT 0,
  last_activity   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  started_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  completed_at    TEXT,
  notes           TEXT,
  UNIQUE(admin_email)
);

CREATE INDEX IF NOT EXISTS idx_gp_sessions_email    ON guardpod_sessions(admin_email);
CREATE INDEX IF NOT EXISTS idx_gp_sessions_activity ON guardpod_sessions(last_activity DESC);

-- ── Respuestas individuales ──
CREATE TABLE IF NOT EXISTS guardpod_answers (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id   TEXT NOT NULL,
  question_key TEXT NOT NULL,
  answer_text  TEXT,
  answer_type  TEXT NOT NULL,
  file_url     TEXT,
  confidence   INTEGER,
  updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_by   TEXT,
  UNIQUE(session_id, question_key),
  FOREIGN KEY (session_id) REFERENCES guardpod_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gp_answers_session  ON guardpod_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_gp_answers_question ON guardpod_answers(question_key);
CREATE INDEX IF NOT EXISTS idx_gp_answers_updated  ON guardpod_answers(updated_at DESC);

-- ── Historial de cambios ──
CREATE TABLE IF NOT EXISTS guardpod_answer_history (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id   TEXT NOT NULL,
  question_key TEXT NOT NULL,
  old_value    TEXT,
  new_value    TEXT,
  changed_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  changed_by   TEXT
);

CREATE INDEX IF NOT EXISTS idx_gp_history_session ON guardpod_answer_history(session_id, changed_at DESC);
