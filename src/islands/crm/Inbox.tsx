// Inbox — leads capturados desde web (contacto/cotizacion), pendientes de contacto inicial.
// Conectado a /api/leads (D1). Permite asignar, contactar, mover a pipeline, descartar.
import { useEffect, useMemo, useState } from 'react';
import {
  STATUS_LABELS,
  SOURCE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatCLP,
  formatDate,
  relativeTime,
  type Lead,
  type LeadStatus,
  type LeadPriority,
} from '../../lib/crm-data';

const INBOX_STATUSES: LeadStatus[] = ['new', 'contacted'];

interface ApiLead {
  id: string;
  created_at: string;
  updated_at?: string;
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
}

function apiToLead(a: ApiLead): Lead {
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
    owner_email: a.owner_email ?? undefined,
  };
}

export default function Inbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted'>('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leads?limit=200', { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      const all: Lead[] = (data.leads ?? []).map(apiToLead);
      // Inbox solo muestra status new/contacted
      setLeads(all.filter((l) => INBOX_STATUSES.includes(l.status)));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let r = leads;
    if (filter !== 'all') r = r.filter((l) => l.status === filter);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.company ?? '').toLowerCase().includes(q),
      );
    }
    return r.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [leads, filter, query]);

  const counts = useMemo(
    () => ({
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      total: leads.length,
    }),
    [leads],
  );

  const move = async (id: string, newStatus: LeadStatus) => {
    const prev = leads;
    setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    setSelected((cur) => (cur && cur.id === id ? { ...cur, status: newStatus } : cur));
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      // Si sale de inbox (status != new/contacted), refrescar lista
      if (!INBOX_STATUSES.includes(newStatus)) {
        setLeads((cur) => cur.filter((l) => l.id !== id));
        setSelected(null);
      }
    } catch (err) {
      // Revertir
      setLeads(prev);
      alert('No se pudo mover el lead: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  if (loading) {
    return (
      <div className="panel empty-panel">
        <p className="empty-state">Cargando bandeja…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel" style={{ background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: 'var(--color-error)' }}>
        <strong>Error cargando bandeja.</strong> {error}
        <div style={{ marginTop: 12 }}>
          <button className="admin-btn admin-btn-primary" onClick={load}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="inbox-toolbar">
        <div className="filter-tabs">
          <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Todos <span className="pill pill-neutral">{counts.total}</span>
          </button>
          <button className={`tab ${filter === 'new' ? 'active' : ''}`} onClick={() => setFilter('new')}>
            Nuevos <span className="pill pill-info">{counts.new}</span>
          </button>
          <button className={`tab ${filter === 'contacted' ? 'active' : ''}`} onClick={() => setFilter('contacted')}>
            Contactados <span className="pill pill-success">{counts.contacted}</span>
          </button>
        </div>
        <input
          className="form-input inbox-search"
          placeholder="🔍 Buscar lead…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="admin-btn admin-btn-secondary" onClick={load} title="Refrescar">↻</button>
      </div>

      <div className="inbox-layout">
        <div className="inbox-list">
          {filtered.length === 0 ? (
            <div className="panel empty-panel">
              <p className="empty-state">🎉 Bandeja vacía. Todos los leads han sido procesados.</p>
            </div>
          ) : (
            filtered.map((lead) => (
              <button
                key={lead.id}
                className={`inbox-card ${selected?.id === lead.id ? 'active' : ''}`}
                onClick={() => setSelected(lead)}
              >
                <div className="inbox-card-header">
                  <div className="inbox-avatar" style={{ background: PRIORITY_COLORS[lead.priority] }}>
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="inbox-card-info">
                    <div className="inbox-card-name">{lead.name}</div>
                    <div className="inbox-card-meta">
                      {lead.company && <span>{lead.company}</span>}
                      <span>· {SOURCE_LABELS[lead.source] ?? lead.source}</span>
                    </div>
                  </div>
                  <span className="pill" style={{ background: 'rgba(59,130,246,.15)', color: 'var(--color-accent)' }}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
                <div className="inbox-card-body">
                  {lead.message && <p className="inbox-card-msg">{lead.message}</p>}
                  <div className="inbox-card-tags">
                    <span className="tag">{lead.service.replace(/-/g, ' ')}</span>
                    {lead.location && <span className="tag">{lead.location.replace(/-/g, ' ')}</span>}
                    {lead.value > 0 && <span className="tag tag-value">{formatCLP(lead.value)}</span>}
                  </div>
                </div>
                <div className="inbox-card-footer">
                  <span>📥 {relativeTime(lead.created_at)}</span>
                  <span className={`priority priority-${lead.priority}`}>
                    {PRIORITY_LABELS[lead.priority]}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="inbox-detail">
          {selected ? (
            <LeadInboxDetail lead={selected} onMove={move} />
          ) : (
            <div className="panel empty-panel">
              <p className="empty-state">Selecciona un lead para ver detalle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadInboxDetail({
  lead,
  onMove,
}: {
  lead: Lead;
  onMove: (id: string, status: LeadStatus) => void;
}) {
  return (
    <div className="panel">
      <div className="lead-detail-header">
        <div className="inbox-avatar lg" style={{ background: PRIORITY_COLORS[lead.priority] }}>
          {lead.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="lead-name">{lead.name}</h2>
          {lead.company && <div className="lead-company">{lead.company}</div>}
          <div className="lead-meta">
            <span>📥 {SOURCE_LABELS[lead.source] ?? lead.source}</span>
            <span>· {formatDate(lead.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="lead-info-grid">
        <div className="info-row">
          <span className="info-label">Email</span>
          <a href={`mailto:${lead.email}`} className="info-value">{lead.email}</a>
        </div>
        <div className="info-row">
          <span className="info-label">Teléfono</span>
          <a href={`tel:${lead.phone}`} className="info-value">{lead.phone}</a>
        </div>
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
        {lead.value > 0 && (
          <div className="info-row">
            <span className="info-label">Valor estimado</span>
            <span className="info-value">{formatCLP(lead.value)}</span>
          </div>
        )}
        {lead.owner_email && (
          <div className="info-row">
            <span className="info-label">Asignado a</span>
            <span className="info-value">{lead.owner_email}</span>
          </div>
        )}
      </div>

      {lead.message && (
        <div className="lead-message">
          <div className="message-label">Mensaje del lead</div>
          <p>{lead.message}</p>
        </div>
      )}

      <div className="lead-actions">
        <a className="admin-btn admin-btn-secondary" href={`tel:${lead.phone}`}>📞 Llamar</a>
        <a className="admin-btn admin-btn-secondary" href={`mailto:${lead.email}`}>✉️ Email</a>
        <a className="admin-btn admin-btn-secondary" href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener">💬 WhatsApp</a>
        <a className="admin-btn admin-btn-primary" href={`/admin/leads/${lead.id}`}>Ver ficha 360° →</a>
      </div>

      <div className="lead-quick-move">
        <span className="quick-move-label">Mover a:</span>
        <button className="admin-btn admin-btn-secondary" onClick={() => onMove(lead.id, 'contacted')}>✓ Contactado</button>
        <button className="admin-btn admin-btn-secondary" onClick={() => onMove(lead.id, 'visit')}>📍 Agendar visita</button>
        <button className="admin-btn admin-btn-secondary" onClick={() => onMove(lead.id, 'lost')}>✕ Descartar</button>
      </div>
    </div>
  );
}
