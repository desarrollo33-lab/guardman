// Pipeline — Kanban con drag&drop conectado a /api/leads (D1).
// Permite mover leads entre columnas con persistencia real.
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatCLP,
  type Lead,
  type LeadStatus,
} from '../../lib/crm-data';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'visit', 'proposal', 'negotiation', 'won', 'lost'];

const STATUS_HEADERS: Record<LeadStatus, string> = {
  new: 'Nuevos',
  contacted: 'Contactados',
  visit: 'Visita',
  proposal: 'Cotización',
  negotiation: 'Negociación',
  won: 'Ganados',
  lost: 'Perdidos',
};

const STATUS_COL_KINDS: Record<LeadStatus, string> = {
  new: 'info',
  contacted: 'success',
  visit: 'warning',
  proposal: 'accent',
  negotiation: 'accent',
  won: 'success',
  lost: 'error',
};

function exportCSV(leads: Lead[]) {
  const headers = ['id', 'name', 'email', 'phone', 'company', 'service', 'location', 'status', 'priority', 'source', 'value', 'created_at', 'updated_at', 'assigned_to', 'message'];
  const rows = leads.map((l) =>
    [
      l.id, l.name, l.email, l.phone, l.company ?? '', l.service, l.location ?? '',
      l.status, l.priority, l.source, String(l.value), l.created_at, l.updated_at ?? '',
      l.owner_email ?? '', (l.message ?? '').replace(/"/g, '""'),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface ApiLead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  location?: string | null;
  status: LeadStatus;
  priority: Lead['priority'];
  source: string;
  value: number;
  owner_email?: string | null;
  message?: string | null;
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
    status: a.status,
    priority: a.priority,
    source: (a.source as Lead['source']) ?? 'web_contacto',
    value: a.value,
    created_at: a.created_at,
    updated_at: a.updated_at,
    owner_email: a.owner_email ?? undefined,
    message: a.message ?? undefined,
  };
}

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leads?limit=200', { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setLeads((data.leads ?? []).map(apiToLead));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredLeads = useMemo(() => {
    if (!query) return leads;
    const q = query.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company ?? '').toLowerCase().includes(q),
    );
  }, [leads, query]);

  const columns = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      new: [], contacted: [], visit: [], proposal: [], negotiation: [], won: [], lost: [],
    };
    for (const l of filteredLeads) {
      if (map[l.status]) map[l.status].push(l);
    }
    for (const s of STATUSES) {
      map[s].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return map;
  }, [filteredLeads]);

  const moveLead = useCallback(async (leadId: string, toStatus: LeadStatus) => {
    const prev = leads;
    setLeads((cur) => cur.map((l) => (l.id === leadId ? { ...l, status: toStatus, updated_at: new Date().toISOString() } : l)));
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ status: toStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `Error ${res.status}`);
    } catch (err) {
      setLeads(prev);
      alert('No se pudo mover: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [leads]);

  const totalValue = filteredLeads.reduce((s, l) => s + l.value, 0);

  if (loading) {
    return <div className="panel empty-panel"><p className="empty-state">Cargando pipeline…</p></div>;
  }

  if (error) {
    return (
      <div className="panel" style={{ background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: 'var(--color-error)' }}>
        <strong>Error cargando pipeline.</strong> {error}
        <div style={{ marginTop: 12 }}>
          <button className="admin-btn admin-btn-primary" onClick={load}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pipeline-toolbar">
        <input
          className="form-input pipeline-search"
          placeholder="🔍 Buscar por nombre, email, empresa…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="admin-btn admin-btn-secondary" onClick={() => exportCSV(filteredLeads)}>
          📤 Exportar CSV
        </button>
        <button className="admin-btn admin-btn-secondary" onClick={load} title="Refrescar">↻</button>
        <div className="pipeline-summary">
          <span><strong>{filteredLeads.length}</strong> leads</span>
          <span><strong>{formatCLP(totalValue)}</strong> total</span>
        </div>
      </div>

      <div className="pipeline-kanban">
        {STATUSES.map((s) => (
          <div
            key={s}
            className={`pipeline-col ${dragOverCol === s ? 'drag-over' : ''}`}
            data-status={s}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(s); }}
            onDragLeave={() => setDragOverCol((cur) => (cur === s ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverCol(null);
              if (dragId) {
                moveLead(dragId, s);
                setDragId(null);
              }
            }}
          >
            <div className={`pipeline-col-header pipeline-col-${STATUS_COL_KINDS[s]}`}>
              <h4>{STATUS_HEADERS[s]}</h4>
              <span className="pipeline-col-count">{columns[s].length}</span>
            </div>
            <div className="pipeline-col-body">
              {columns[s].length === 0 ? (
                <div className="pipeline-empty">Arrastra leads aquí</div>
              ) : (
                columns[s].map((l) => (
                  <article
                    key={l.id}
                    className="pipeline-card"
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => { setDragId(null); setDragOverCol(null); }}
                    data-id={l.id}
                  >
                    <div className="pipeline-card-head">
                      <span className="pipeline-card-name">{l.name}</span>
                      <span
                        className="pipeline-card-priority"
                        style={{ background: PRIORITY_COLORS[l.priority] }}
                        title={PRIORITY_LABELS[l.priority]}
                      />
                    </div>
                    <div className="pipeline-card-service">{l.service.replace(/-/g, ' ')}</div>
                    {l.location && <div className="pipeline-card-location">📍 {l.location.replace(/-/g, ' ')}</div>}
                    <div className="pipeline-card-footer">
                      <span>{l.value > 0 ? formatCLP(l.value) : '—'}</span>
                      <a href={`/admin/leads/${l.id}`} className="row-action" onClick={(e) => e.stopPropagation()}>→</a>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
