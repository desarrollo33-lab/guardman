// Inbox — leads capturados desde web (contacto/cotizacion), pendientes de contacto inicial.
// Permite asignar, contactar, mover a pipeline, descartar.
import { useMemo, useState } from 'react';
import {
  crmLeads,
  STATUS_LABELS,
  SOURCE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatCLP,
  formatDate,
  relativeTime,
  type Lead,
} from '../../lib/crm-data';

const INBOX_STATUSES: Lead['status'][] = ['new', 'contacted'];

export default function Inbox() {
  const [leads, setLeads] = useState<Lead[]>(() =>
    crmLeads.filter((l) => INBOX_STATUSES.includes(l.status)),
  );
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted'>('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [query, setQuery] = useState('');

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

  const move = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
  };

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
                      <span>· {SOURCE_LABELS[lead.source]}</span>
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
                    <span className="tag">{lead.location.replace(/-/g, ' ')}</span>
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
  onMove: (id: string, status: Lead['status']) => void;
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
            <span>📥 {SOURCE_LABELS[lead.source]}</span>
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
        <div className="info-row">
          <span className="info-label">Ubicación</span>
          <span className="info-value">{lead.location.replace(/-/g, ' ')}</span>
        </div>
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
        <div className="info-row">
          <span className="info-label">Asignado a</span>
          <span className="info-value">{lead.owner_email}</span>
        </div>
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
