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

const STATUS_DOT_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  contacted: '#10B981',
  visit: '#F59E0B',
  proposal: '#8B5CF6',
  negotiation: '#8B5CF6',
  won: '#10B981',
  lost: '#EF4444',
};

const STATUS_HEADER_COLORS: Record<LeadStatus, string> = {
  new: 'var(--color-accent)',
  contacted: 'var(--color-success)',
  visit: 'var(--color-warning)',
  proposal: 'var(--color-accent)',
  negotiation: 'var(--color-accent)',
  won: 'var(--color-success)',
  lost: 'var(--color-error)',
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

  // Refresh auto 30s, pausa en tab oculta
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => { if (!id) id = setInterval(() => { if (!document.hidden) load(); }, 30000); };
    const stop = () => { if (id) { clearInterval(id); id = null; } };
    const onVis = () => { if (document.hidden) stop(); else { load(); start(); } };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
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

  const moveLead = useCallback(async (leadId: string, toStatus: LeadStatus, { skipConfirm = false } = {}) => {
    const doMove = async () => {
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
        (window as unknown as { gmToast?: (o: unknown) => void }).gmToast?.({
          type: 'success',
          title: 'Lead movido',
          msg: `Estado actualizado a ${toStatus}`,
        });
      } catch (err) {
        setLeads(prev);
        (window as unknown as { gmToast?: (o: unknown) => void }).gmToast?.({
          type: 'error',
          title: 'No se pudo mover',
          msg: err instanceof Error ? err.message : String(err),
        });
      }
    };

    if (!skipConfirm && toStatus === 'lost') {
      (window as unknown as { gmConfirm?: (o: unknown) => void }).gmConfirm?.({
        title: '¿Marcar como perdido?',
        msg: 'El lead se moverá a la columna "Perdidos". Se puede revertir manualmente.',
        danger: true,
        confirmLabel: 'Sí, marcar como perdido',
        onConfirm: doMove,
      });
      return;
    }
    await doMove();
  }, [leads]);

  // Touch/click handler: muestra menú para mover de columna.
  // Funciona en desktop (botón ⋮ o click derecho) y mobile (long-press o tap en ⋮).
  const openMoveMenu = (lead: Lead, e: { clientX: number; clientY: number }) => {
    const items: Array<{ id: LeadStatus; label: string; color: string }> = STATUSES
      .filter((s) => s !== lead.status)
      .map((s) => ({ id: s, label: STATUS_HEADERS[s], color: STATUS_DOT_COLORS[s] }));
    items.push({ id: lead.status, label: '— (actual) —', color: 'var(--fg-dim)' });
    // Reordenar: actual al final
    const reordered = items.filter((i) => i.id !== lead.status).concat(items.filter((i) => i.id === lead.status));
    (window as unknown as { gmMoveMenu?: (o: unknown) => void }).gmMoveMenu?.({
      x: e.clientX,
      y: e.clientY,
      items: reordered.map((it) => ({
        label: it.label,
        color: it.color,
        value: it.id,
        disabled: it.id === lead.status,
      })),
      onSelect: (item: { value: LeadStatus; disabled?: boolean }) => {
        if (item.disabled || item.value === lead.status) return;
        moveLead(lead.id, item.value);
      },
    });
  };

  // Adjuntar long-press a cada card después del render
  useEffect(() => {
    if (!loading && leads.length > 0) {
      const cards = document.querySelectorAll<HTMLElement>('[data-pipeline-card]');
      const leadMap = new Map<string, Lead>();
      leads.forEach((l) => leadMap.set(l.id, l));
      cards.forEach((card) => {
        const id = card.dataset.pipelineCard;
        if (!id) return;
        const lead = leadMap.get(id);
        if (!lead) return;
        (window as unknown as { gmLongPress?: (el: HTMLElement, h: (e: { clientX: number; clientY: number }) => void) => void }).gmLongPress?.(card, (e) => openMoveMenu(lead, e));
      });
    }
  }, [leads, loading]);

  const totalValue = filteredLeads.reduce((s, l) => s + l.value, 0);

  if (loading) {
    return (
      <div>
        <div className="pipeline-toolbar">
          <div className="skeleton" style={{ flex: 1, maxWidth: 360, height: 38 }} />
          <div className="skeleton" style={{ width: 120, height: 38 }} />
        </div>
        <div className="kanban">
          {STATUSES.map((s) => (
            <div key={s} className="kanban-col">
              <div className="kanban-col-header" style={{ borderTopColor: STATUS_HEADER_COLORS[s] }}>
                <div className="skeleton" style={{ width: 80, height: 14 }} />
                <div className="skeleton" style={{ width: 18, height: 14 }} />
              </div>
              <div className="kanban-col-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 70, opacity: 1 - i * 0.2 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
        <button className="admin-btn admin-btn-secondary" onClick={load} title="Refrescar" aria-label="Refrescar">↻</button>
        <span className="auto-refresh-hint muted-cell" style={{ fontSize: 11 }}>
          <span className="auto-refresh-dot" /> auto 30s
        </span>
        <div className="pipeline-summary">
          <span><strong>{filteredLeads.length}</strong> leads</span>
          <span><strong>{formatCLP(totalValue)}</strong> total</span>
        </div>
      </div>

      <div className="kanban">
        {STATUSES.map((s) => (
          <div
            key={s}
            className="kanban-col"
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
            <div className="kanban-col-header" style={{ borderTopColor: STATUS_HEADER_COLORS[s] }}>
              <div className="kanban-col-title">
                <span className="kanban-dot" style={{ background: STATUS_DOT_COLORS[s] }} />
                {STATUS_HEADERS[s]}
              </div>
              <span className="kanban-col-value">{columns[s].length}</span>
            </div>
            <div className={`kanban-col-body ${dragOverCol === s ? 'drag-over' : ''}`}>
              {columns[s].length === 0 ? (
                <div className="kanban-empty">Arrastra leads aquí</div>
              ) : (
                columns[s].map((l) => (
                  <article
                    key={l.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => { setDragId(null); setDragOverCol(null); }}
                    data-id={l.id}
                    data-pipeline-card={l.id}
                  >
                    <div className="kanban-card-header">
                      <span className="kanban-card-priority" style={{ background: PRIORITY_COLORS[l.priority] }} title={PRIORITY_LABELS[l.priority]} />
                      <span className="kanban-card-name">{l.name}</span>
                      <button
                        type="button"
                        className="kanban-card-menu-btn"
                        aria-label="Mover lead"
                        title="Mover a otra etapa"
                        onClick={(e) => { e.stopPropagation(); openMoveMenu(l, e); }}
                      >⋮</button>
                    </div>
                    <div className="kanban-card-company">{l.service.replace(/-/g, ' ')}{l.location ? ` · ${l.location.replace(/-/g, ' ')}` : ''}</div>
                    <div className="kanban-card-footer">
                      <span className="kanban-card-value">{l.value > 0 ? formatCLP(l.value) : '—'}</span>
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
