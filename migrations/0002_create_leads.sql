-- ════════════════════════════════════════════════════════════════
-- GuardMan Chile — Migración 0002: Tabla leads (CRM)
-- v5.3.0 — D1 guardman-v2-db
--
-- Tabla leads: leads capturados desde formularios públicos
-- (contacto, cotización) y gestionados desde el panel admin.
--
-- Diseño:
--   - id: identificador interno (L-YYYYMMDD-XXXX) — el cliente no ve esto
--   - name/email/phone: contacto principal (requeridos)
--   - service/location: clasificación del lead
--   - status: workflow del CRM
--     'new'         → capturado, sin contacto
--     'contacted'   → primer contacto realizado
--     'visit'       → visita técnica agendada
--     'proposal'    → cotización enviada
--     'negotiation' → en negociación
--     'won'         → ganado (cliente)
--     'lost'        → perdido/descartado
--   - priority: 'low' | 'medium' | 'high' | 'urgent'
--   - source: de dónde vino (web_contacto, web_cotizacion, etc.)
--   - value: valor estimado en CLP
--   - admin_notes: notas internas del admin
--   - ip_hash: SHA-256(ip + salt) para anti-spam
--   - timestamps en UTC ISO 8601
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id                   TEXT PRIMARY KEY,
  created_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  -- Contacto
  name                 TEXT NOT NULL,
  email                TEXT NOT NULL,
  phone                TEXT NOT NULL,
  company              TEXT,

  -- Clasificación
  service              TEXT NOT NULL,
  location             TEXT,
  sector               TEXT,
  property_type        TEXT,
  guards_count         TEXT,

  -- Mensaje
  message              TEXT,

  -- Workflow
  status               TEXT NOT NULL DEFAULT 'new',
  priority             TEXT NOT NULL DEFAULT 'medium',
  source               TEXT NOT NULL DEFAULT 'web_contacto',
  value                INTEGER DEFAULT 0,    -- CLP estimado

  -- Asignación y notas
  assigned_to          TEXT,
  owner_email          TEXT,
  admin_notes          TEXT,

  -- Auditoría
  ip_hash              TEXT,
  user_agent           TEXT,
  referer              TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_status     ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority   ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_source     ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created    ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email      ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_assigned   ON leads(assigned_to);

-- Tabla de actividades (timeline) — para v1.1
-- CREATE TABLE IF NOT EXISTS lead_activities (
--   id           TEXT PRIMARY KEY,
--   lead_id      TEXT NOT NULL,
--   type         TEXT NOT NULL,
--   title        TEXT NOT NULL,
--   description  TEXT,
--   at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
--   by_email     TEXT,
--   FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
-- );
