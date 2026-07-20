-- ════════════════════════════════════════════════════════════════
-- GuardMan Chile — Migración 0001: Canal de Denuncias
-- v4.1.0 — D1 guardman-v2-db
--
-- Tabla denuncias: denuncias anónimas de infracciones al código
-- de conducta o potenciales delitos, según Ley 20.393 (responsabilidad
-- penal de personas jurídicas en Chile).
--
-- Diseño:
--   - id: tracking público de 12 chars (formato D-YYYYMMDD-XXXX)
--   - todos los campos personales son NULL por default (anonimato)
--   - ip_hash: SHA-256(ip + secret_salt) para auditoría anti-spam
--   - status: workflow interno del admin
--   - timestamps en UTC ISO 8601
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS denuncias (
  id                   TEXT PRIMARY KEY,
  created_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  -- Categoría y tipo
  categoria            TEXT NOT NULL,           -- 'codigo_conducta' | 'delito' | 'fraude' | 'acoso' | 'robo' | 'seguridad' | 'otro'
  categoria_otro       TEXT,                    -- descripción libre si categoria='otro'
  relacion             TEXT,                    -- 'trabajador' | 'cliente' | 'proveedor' | 'externo'

  -- Sobre el incidente
  fecha_incidente      TEXT,                    -- ISO date 'YYYY-MM-DD' (opcional)
  lugar                TEXT,                    -- comuna / dirección / instalación
  personas_involucradas TEXT,                  -- texto libre (opcional)

  -- Descripción del hecho
  descripcion          TEXT NOT NULL,           -- 30..5000 chars
  tiene_evidencia      TEXT,                    -- 'si' | 'no' | 'desconocido'

  -- Contacto (todos opcionales — denuncia anónima por default)
  nombre               TEXT,                    -- null = anónimo
  email                TEXT,                    -- null = anónimo
  telefono             TEXT,                    -- null = anónimo

  -- Auditoría técnica
  ip_hash              TEXT,                    -- SHA-256(ip + salt) — para anti-spam, no identificable
  user_agent           TEXT,
  referer              TEXT,

  -- Workflow interno
  status               TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'reviewing' | 'investigating' | 'resolved' | 'archived'
  assigned_to          TEXT,                    -- email del admin asignado
  admin_notes          TEXT,                    -- notas internas (no se exponen al denunciante)
  updated_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_denuncias_status     ON denuncias(status);
CREATE INDEX IF NOT EXISTS idx_denuncias_categoria  ON denuncias(categoria);
CREATE INDEX IF NOT EXISTS idx_denuncias_created    ON denuncias(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_denuncias_ip_hash    ON denuncias(ip_hash);
