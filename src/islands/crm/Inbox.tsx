// Inbox — leads capturados desde web (contacto/cotizacion), pendientes de contacto inicial.
// Conectado a /api/leads (D1). Permite asignar, contactar, mover a pipeline, descartar.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const filterRef = useRef(filter);
  const queryRef = useRef(query);

  const load = useCallback(async () => {
    try {
      const cur = filterRef.current;
      const q = queryRef.current;
      const params = new URLSearchParams();
      params.set('limit', '200');
      if (cur !== 'all') params.set('status', cur);
      if (q) params.set('q', q);
      const res = await fetch(`/api/leads?${params.toString()}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      let list: Lead[] = (data.leads ?? []).map(apiToLead);
      // Si "all", filtrar localmente a los status del inbox
      if (cur === 'all') list = list.filter((l) => INBOX_STATUSES.includes(l.status));
      setLeads(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { filterRef.current = filter; queryRef.current = query; load(); }, [filter, query, load]);

  // Refresh auto 30s, pausa en tab oculta
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => { if (!id) id = setInterval(() => { if (!document.hidden) load(); }, 30000); };
    const stop = () => { if (id) { clearInterval(id); id = null; } };
    const onVis = () => { if (document.hidden) stop(); else { load(); start(); } };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, [load]);

  // Los datos ya vienen filtrados por la API. Solo ordenamos por fecha.
  const filtered = useMemo(
    () => [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [leads],
  );

  const counts = useMemo(
    () => ({
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      total: leads.length,
    }),
    [leads],
  );

  const move = async (id: string, newStatus: LeadStatus, { skipConfirm = false } = {}) => {
    const doMove = async () => {
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
        if (!INBOX_STATUSES.includes(newStatus)) {
          setLeads((cur) => cur.filter((l) => l.id !== id));
          setSelected(null);
          (window as unknown as { gmToast?: (o: unknown) => void }).gmToast?.({
            type: 'success',
            title: 'Lead movido',
            msg: `Estado actualizado a ${newStatus}`,
          });
        }
      } catch (err) {
        setLeads(prev);
        (window as unknown as { gmToast?: (o: unknown) => void }).gmToast?.({
          type: 'error',
          title: 'No se pudo mover',
          msg: err instanceof Error ? err.message : String(err),
        });
      }
    };

    // Confirmación para estados destructivos
    if (!skipConfirm && newStatus === 'lost') {
      (window as unknown as { gmConfirm?: (o: unknown) => void }).gmConfirm?.({
        title: '¿Marcar como perdido?',
        msg: 'El lead saldrá de la bandeja. Se puede revertir manualmente.',
        danger: true,
        confirmLabel: 'Sí, marcar como perdido',
        onConfirm: doMove,
      });
      return;
    }
    await doMove();
  };

  // En mobile, abrir el detalle como bottom sheet (toggle clase .is-open)
  const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const openDetail = (lead: Lead) => {
    setSelected(lead);
    if (isMobile()) {
      requestAnimationFrame(() => {
        document.querySelector('.inbox-detail')?.classList.add('is-open');
      });
    }
  };
  const closeDetailSheet = () => {
    document.querySelector('.inbox-detail')?.classList.remove('is-open');
  };

  if (loading) {
    return (
      <div>
        <div className="inbox-toolbar">
          <div className="filter-tabs">
            <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: 120, height: 32, borderRadius: 8 }} />
          </div>
          <div className="skeleton" style={{ flex: 1, maxWidth: 320, height: 38 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="panel" style={{ padding: 14 }}>
              <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '50%' }} />
            </div>
          ))}
        </div>
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
        <button className="admin-btn admin-btn-secondary" onClick={load} title="Refrescar" aria-label="Refrescar">↻</button>
        <span className="auto-refresh-hint muted-cell" style={{ fontSize: 11 }}>
          <span className="auto-refresh-dot" /> auto 30s
        </span>
      </div>

      <div className="inbox-layout">
        <div className="inbox-list">
          {filtered.length === 0 ? (
            <div className="panel empty-panel">
              <div className="empty-state-graphic">🎉</div>
              <p className="empty-state-title">Bandeja vacía</p>
              <p className="empty-state-msg">
                {query
                  ? 'No hay leads que coincidan con tu búsqueda.'
                  : 'Todos los leads han sido procesados. ¡Buen trabajo!'}
              </p>
              {query && (
                <button className="admin-btn admin-btn-secondary" onClick={() => setQuery('')}>
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            filtered.map((lead) => (
              <button
                key={lead.id}
                className={`inbox-card ${selected?.id === lead.id ? 'active' : ''}`}
                onClick={() => openDetail(lead)}
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
              <div className="empty-state-graphic">👈</div>
              <p className="empty-state-title">Selecciona un lead</p>
              <p className="empty-state-msg">Toca una tarjeta para ver el detalle completo, llamar o cambiar estado.</p>
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
      <button
        type="button"
        className="inbox-detail-back"
        onClick={() => document.querySelector('.inbox-detail')?.classList.remove('is-open')}
        aria-label="Volver al listado"
      >
        ← Volver al listado
      </button>
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
