// LeadDetail — Lead 360° conectado a /api/leads/[id] (D1).
// Carga real, mutaciones reales (status, priority, notes, assigned_to, value).
// Tasks y communications: placeholders para v1.1 (la API no las soporta aún).
import { useEffect, useState } from 'react';
import {
  STATUS_FLOW,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SOURCE_LABELS,
  formatCLP,
  formatDate,
  type Lead,
  type LeadStatus,
  type LeadPriority,
} from '../../lib/crm-data';

interface Props {
  leadId: string;
}

interface ApiLeadFull {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  location?: string | null;
  sector?: string | null;
  property_type?: string | null;
  guards_count?: string | null;
  message?: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  source: string;
  value: number;
  assigned_to?: string | null;
  owner_email?: string | null;
  admin_notes?: string | null;
  ip_hash?: string | null;
  user_agent?: string | null;
  referer?: string | null;
}

function apiToLead(a: ApiLeadFull): Lead {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    company: a.company ?? undefined,
    service: a.service,
    location: a.location ?? '',
    sector: a.sector ?? undefined,
    property_type: a.property_type ?? undefined,
    guards_count: a.guards_count ?? undefined,
    message: a.message ?? undefined,
    status: a.status,
    priority: a.priority,
    source: (a.source as Lead['source']) ?? 'web_contacto',
    value: a.value,
    created_at: a.created_at,
    updated_at: a.updated_at,
    owner_email: a.owner_email ?? undefined,
  };
}

type Tab = 'info' | 'notas';

export default function LeadDetail({ leadId }: Props) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('info');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `Error ${res.status}`);
      const full: ApiLeadFull = data.lead;
      setLead(apiToLead(full));
      setAdminNotes(full.admin_notes ?? '');
      setAssignedTo(full.assigned_to ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const patch = async (body: Record<string, unknown>, successMsg?: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `Error ${res.status}`);
      if (successMsg) alert(successMsg);
      await load();
    } catch (err) {
      alert('No se pudo guardar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="panel empty-panel"><p className="empty-state">Cargando lead…</p></div>;
  }

  if (error || !lead) {
    return (
      <div className="panel" style={{ background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: 'var(--color-error)' }}>
        <strong>Error cargando lead.</strong> {error}
        <div style={{ marginTop: 12 }}>
          <button className="admin-btn admin-btn-primary" onClick={load}>Reintentar</button>
          <a className="admin-btn admin-btn-secondary" href="/admin/leads" style={{ marginLeft: 8 }}>← Volver al listado</a>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-detail-layout">
      <div className="lead-detail-main">
        {/* Header */}
        <div className="panel lead-header-panel">
          <div className="lead-header-top">
            <div className="lead-header-id">
              <span className="lead-id">{lead.id}</span>
              <span className="lead-status-badge" style={{ background: STATUS_COLORS[lead.status], color: '#fff' }}>
                {STATUS_LABELS[lead.status]}
              </span>
              <span className="lead-priority-badge" style={{ background: PRIORITY_COLORS[lead.priority], color: '#fff' }}>
                {PRIORITY_LABELS[lead.priority]}
              </span>
            </div>
            <div className="lead-header-actions">
              <a className="admin-btn admin-btn-secondary" href={`tel:${lead.phone}`}>📞 Llamar</a>
              <a className="admin-btn admin-btn-secondary" href={`mailto:${lead.email}`}>✉️ Email</a>
              <a className="admin-btn admin-btn-secondary" href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener">💬 WhatsApp</a>
            </div>
          </div>
          <h1 className="lead-header-name">{lead.name}</h1>
          {lead.company && <div className="lead-header-company">{lead.company}</div>}
          <div className="lead-header-meta">
            <span>📥 {SOURCE_LABELS[lead.source] ?? lead.source}</span>
            <span>· Creado {formatDate(lead.created_at)}</span>
            {lead.owner_email && <span>· Asignado a {lead.owner_email}</span>}
          </div>
          {lead.message && (
            <div className="lead-header-message">
              <div className="message-label">Mensaje inicial</div>
              <p>{lead.message}</p>
            </div>
          )}

          {/* Cambio de estado rápido */}
          <div className="lead-status-switcher">
            {STATUS_FLOW.map((s) => (
              <button
                key={s}
                className={`status-pill ${lead.status === s ? 'active' : ''}`}
                disabled={saving}
                onClick={() => patch({ status: s })}
                style={lead.status === s ? { background: STATUS_COLORS[s], color: '#fff' } : { color: STATUS_COLORS[s], borderColor: STATUS_COLORS[s] }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
            📋 Información
          </button>
          <button className={`tab ${tab === 'notas' ? 'active' : ''}`} onClick={() => setTab('notas')}>
            📝 Notas internas
          </button>
        </div>

        {tab === 'info' && (
          <div className="panel">
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Email</span>
                <a href={`mailto:${lead.email}`} className="info-value">{lead.email}</a>
              </div>
              <div className="info-row">
                <span className="info-label">Teléfono</span>
                <a href={`tel:${lead.phone}`} className="info-value">{lead.phone}</a>
              </div>
              {lead.company && (
                <div className="info-row">
                  <span className="info-label">Empresa</span>
                  <span className="info-value">{lead.company}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Servicio</span>
                <span className="info-value">{lead.service.replace(/-/g, ' ')}</span>
              </div>
              {lead.location && (
                <div className="info-row">
                  <span className="info-label">Ubicación</span>
                  <span className="info-value">{lead.location.replace(/-/g, ' ')}</span>
                </div>
              )}
              {lead.property_type && (
                <div className="info-row">
                  <span className="info-label">Tipo propiedad</span>
                  <span className="info-value">{lead.property_type}</span>
                </div>
              )}
              {lead.guards_count && (
                <div className="info-row">
                  <span className="info-label">N° guardias</span>
                  <span className="info-value">{lead.guards_count}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Prioridad</span>
                <select
                  className="form-input"
                  value={lead.priority}
                  disabled={saving}
                  onChange={(e) => patch({ priority: e.target.value as LeadPriority })}
                  style={{ maxWidth: 200 }}
                >
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                    <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                  ))}
                </select>
              </div>
              <div className="info-row">
                <span className="info-label">Valor estimado (CLP)</span>
                <input
                  type="number"
                  className="form-input"
                  defaultValue={lead.value}
                  disabled={saving}
                  onBlur={(e) => {
                    const v = Math.max(0, Math.floor(Number(e.target.value) || 0));
                    if (v !== lead.value) patch({ value: v });
                  }}
                  style={{ maxWidth: 200 }}
                />
              </div>
              <div className="info-row">
                <span className="info-label">Asignado a</span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="email@admin.cl"
                  value={assignedTo}
                  disabled={saving}
                  onBlur={() => {
                    if (assignedTo !== (lead.owner_email ?? '')) {
                      patch({ assigned_to: assignedTo || null });
                    }
                  }}
                  style={{ maxWidth: 300 }}
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'notas' && (
          <div className="panel">
            <textarea
              className="form-input"
              placeholder="Notas internas (solo el equipo las ve)…"
              rows={10}
              value={adminNotes}
              disabled={saving}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className="admin-btn admin-btn-primary"
                disabled={saving}
                onClick={() => patch({ admin_notes: adminNotes }, 'Notas guardadas.')}
              >
                {saving ? 'Guardando…' : 'Guardar notas'}
              </button>
              <span style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
                Se guarda automáticamente como texto de hasta 4000 caracteres.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="lead-detail-side">
        <div className="panel">
          <div className="panel-header"><h3>Resumen</h3></div>
          <div className="value-block">
            <div className="value-row">
              <span className="info-label">ID</span>
              <strong>{lead.id}</strong>
            </div>
            <div className="value-row">
              <span className="info-label">Origen</span>
              <strong>{SOURCE_LABELS[lead.source] ?? lead.source}</strong>
            </div>
            <div className="value-row">
              <span className="info-label">Estado</span>
              <strong>{STATUS_LABELS[lead.status]}</strong>
            </div>
            <div className="value-row">
              <span className="info-label">Prioridad</span>
              <strong>{PRIORITY_LABELS[lead.priority]}</strong>
            </div>
            <div className="value-row">
              <span className="info-label">Valor</span>
              <strong>{formatCLP(lead.value)}</strong>
            </div>
            <div className="value-row">
              <span className="info-label">Actualizado</span>
              <strong>{formatDate(lead.updated_at)}</strong>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h3>Próximamente</h3></div>
          <p style={{ fontSize: 13, color: 'var(--fg-dim)', margin: 0 }}>
            Timeline, tareas programadas y registro de comunicaciones estarán disponibles en v1.1.
            Por ahora el estado se gestiona con los botones de estado, prioridad y notas internas.
          </p>
        </div>
        <a className="admin-btn admin-btn-secondary" href="/admin/leads" style={{ width: '100%', justifyContent: 'center' }}>← Volver al listado</a>
      </aside>
    </div>
  );
}
