// LeadsList v2.0 — tabla filtrable + búsqueda + bulk actions reales.
// Cambios v2.0:
//   • Bulk actions reales: Asignar, Cambiar estado, Exportar (DELETE quitado: API no lo soporta)
//   • Server-side filtering (?status=, ?q=) en lugar de client-side
//   • Loading skeleton (sin texto plano "Cargando...")
//   • Empty state consistente con Dashboard/Inbox
//   • Refresh automático 30s con pausa en tab oculta
//   • gmConfirm para acciones masivas
//   • Skeleton + empty state usan la misma estética que el resto del admin
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  STATUS_FLOW,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatCLP,
  relativeTime,
  type Lead,
  type LeadStatus,
} from '../../lib/crm-data';

type SortKey = 'created_at' | 'value' | 'updated_at' | 'name';

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
  };
}

function exportLeadsCSV(leads: Lead[], filename: string) {
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
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const TOAST = (msg: unknown) => (window as unknown as { gmToast?: (o: unknown) => void }).gmToast?.(msg);
const CONFIRM = (msg: unknown) => (window as unknown as { gmConfirm?: (o: unknown) => void }).gmConfirm?.(msg);

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAssignValue, setBulkAssignValue] = useState('');
  const [bulkStatusValue, setBulkStatusValue] = useState<LeadStatus | ''>('');
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const queryRef = useRef(query);
  const statusRef = useRef(statusFilter);

  // Server-side filtering: el backend ya soporta ?status= y ?q=
  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('limit', '200');
      if (statusRef.current) params.set('status', statusRef.current);
      if (queryRef.current) params.set('q', queryRef.current);
      const res = await fetch(`/api/leads?${params.toString()}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `Error ${res.status}`);
      const newLeads = (data.leads ?? []).map(apiToLead);
      setLeads(newLeads);
      setTotal(data.total ?? newLeads.length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queryRef.current = query; statusRef.current = statusFilter; }, [query, statusFilter]);
  useEffect(() => { load(); }, [load]);

  // Refresh auto: 30s, pausa en tab oculta
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => { if (!id) id = setInterval(() => { if (!document.hidden) load(); }, 30000); };
    const stop = () => { if (id) { clearInterval(id); id = null; } };
    const onVis = () => { if (document.hidden) stop(); else { load(); start(); } };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, [load]);

  // Sort en cliente (la API no ordena por columnas arbitrarias; OK para 200)
  const sorted = useMemo(() => {
    const r = [...leads];
    r.sort((a, b) => {
      const av = a[sortKey] as string | number | undefined;
      const bv = b[sortKey] as string | number | undefined;
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return r;
  }, [leads, sortKey, sortDir]);

  const counts = useMemo(
    () =>
      STATUS_FLOW.reduce<Record<string, number>>((acc, s) => {
        acc[s] = leads.filter((l) => l.status === s).length;
        return acc;
      }, {}),
    [leads],
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const toggleAll = () => {
    if (selected.size === sorted.length) setSelected(new Set());
    else setSelected(new Set(sorted.map((l) => l.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // ── Bulk: PATCH en paralelo (la API no expone bulk, pero PATCH individual es idempotente) ──
  const runBulkPatch = async (field: 'assigned_to' | 'status', value: string | null) => {
    if (selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    let ok = 0;
    let fail = 0;
    await Promise.all(ids.map(async (id) => {
      try {
        const body: Record<string, unknown> = {};
        if (field === 'assigned_to') body.assigned_to = value;
        else if (field === 'status') body.status = value;
        const res = await fetch(`/api/leads/${id}`, {
          method: 'PATCH', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        ok++;
      } catch { fail++; }
    }));
    setBusy(false);
    setSelected(new Set());
    if (fail === 0) {
      TOAST({ type: 'success', title: 'Acción masiva aplicada', msg: `${ok} lead${ok === 1 ? '' : 's'} actualizado${ok === 1 ? '' : 's'}` });
    } else {
      TOAST({ type: fail === ids.length ? 'error' : 'warning', title: 'Resultado parcial', msg: `${ok} OK · ${fail} con error` });
    }
    await load();
  };

  const onBulkAssign = () => {
    if (selected.size === 0) return;
    if (!bulkAssignOpen) {
      setBulkAssignOpen(true);
      return;
    }
    if (!bulkAssignValue.trim()) {
      TOAST({ type: 'warning', title: 'Email requerido', msg: 'Ingresa un email para asignar.' });
      return;
    }
    const email = bulkAssignValue.trim();
    runBulkPatch('assigned_to', email || null);
    setBulkAssignOpen(false);
    setBulkAssignValue('');
  };

  const onBulkStatus = () => {
    if (selected.size === 0 || !bulkStatusValue) return;
    const target = bulkStatusValue as LeadStatus;
    const isDestructive = target === 'lost';
    const exec = () => runBulkPatch('status', target);
    if (isDestructive) {
      CONFIRM({
        title: '¿Marcar como Perdidos?',
        msg: `${selected.size} lead(s) pasarán a estado "Perdido". Esta acción se puede revertir manualmente.`,
        danger: true, confirmLabel: 'Sí, marcar como perdidos',
        onConfirm: exec,
      });
    } else {
      exec();
    }
  };

  const onBulkExport = () => {
    if (selected.size === 0) return;
    const selectedLeads = leads.filter((l) => selected.has(l.id));
    exportLeadsCSV(selectedLeads, `leads-seleccionados-${new Date().toISOString().slice(0, 10)}.csv`);
    TOAST({ type: 'success', title: 'Exportado', msg: `${selectedLeads.length} leads → CSV` });
  };

  // ── Skeleton de carga ──
  if (loading) {
    return (
      <div className="panel">
        <div className="leads-toolbar" style={{ marginBottom: 16 }}>
          <div className="skeleton" style={{ height: 38, flex: 1, maxWidth: 360 }} />
          <div className="skeleton" style={{ height: 38, width: 220 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: 44, opacity: 1 - i * 0.12 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel" style={{ background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: 'var(--color-error)' }}>
        <strong>Error cargando leads.</strong> {error}
        <div style={{ marginTop: 12 }}>
          <button className="admin-btn admin-btn-primary" onClick={load}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="leads-toolbar">
        <input
          className="form-input leads-search"
          placeholder="🔍 Buscar por nombre, email, empresa, teléfono…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="form-input leads-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]} ({counts[s] ?? 0})</option>
          ))}
        </select>
        <button className="admin-btn admin-btn-secondary" onClick={load} title="Refrescar">↻</button>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span className="bulk-bar-count"><strong>{selected.size}</strong> seleccionados</span>
          {bulkAssignOpen ? (
            <div className="bulk-assign-form">
              <input
                type="email"
                className="form-input bulk-assign-input"
                placeholder="email@comercial.cl"
                value={bulkAssignValue}
                onChange={(e) => setBulkAssignValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onBulkAssign(); }}
                autoFocus
                aria-label="Email del comercial"
              />
              <button className="admin-btn admin-btn-primary" onClick={onBulkAssign} disabled={busy || !bulkAssignValue.trim()}>
                Asignar
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => { setBulkAssignOpen(false); setBulkAssignValue(''); }} disabled={busy}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="admin-btn admin-btn-secondary" onClick={onBulkAssign} disabled={busy} title="Asignar a un comercial">
              👤 Asignar
            </button>
          )}
          <select
            className="form-input bulk-status-select"
            value={bulkStatusValue}
            onChange={(e) => setBulkStatusValue(e.target.value as LeadStatus)}
            disabled={busy}
            aria-label="Estado a aplicar"
          >
            <option value="">Cambiar estado…</option>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button className="admin-btn admin-btn-primary" onClick={onBulkStatus} disabled={busy || !bulkStatusValue}>
            Aplicar
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={onBulkExport} disabled={busy}>
            📤 Exportar
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => setSelected(new Set())} disabled={busy}>
            Limpiar
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="panel empty-panel">
          <div className="empty-state-graphic">📭</div>
          <p className="empty-state-title">No se encontraron leads</p>
          <p className="empty-state-msg">
            {query || statusFilter
              ? 'Intenta ajustar los filtros o la búsqueda.'
              : 'Cuando lleguen leads desde los formularios de Contacto o Cotización, aparecerán aquí.'}
          </p>
          {(query || statusFilter) && (
            <button className="admin-btn admin-btn-secondary" onClick={() => { setQuery(''); setStatusFilter(''); }}>
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="panel">
          <table className="data-table leads-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <input type="checkbox" checked={selected.size === sorted.length && sorted.length > 0} onChange={toggleAll} aria-label="Seleccionar todos" />
                </th>
                <th onClick={() => toggleSort('name')} className="sortable">Lead {sortKey === 'name' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                <th>Contacto</th>
                <th>Servicio</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th onClick={() => toggleSort('value')} className="sortable num">Valor {sortKey === 'value' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => toggleSort('updated_at')} className="sortable">Actualizado {sortKey === 'updated_at' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l) => (
                <tr key={l.id} className={selected.has(l.id) ? 'row-selected' : ''}>
                  <td data-label=""><input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleOne(l.id)} aria-label={`Seleccionar ${l.name}`} /></td>
                  <td data-label="Lead">
                    <a href={`/admin/leads/${l.id}`} className="lead-link">
                      <div className="lead-cell">
                        <strong>{l.name}</strong>
                        {l.company && <span className="lead-cell-company">{l.company}</span>}
                      </div>
                    </a>
                  </td>
                  <td data-label="Contacto">
                    <div className="contact-cell">
                      <a href={`mailto:${l.email}`}>{l.email}</a>
                      <a href={`tel:${l.phone}`} className="contact-phone">{l.phone}</a>
                    </div>
                  </td>
                  <td data-label="Servicio"><span className="tag">{l.service.replace(/-/g, ' ')}</span></td>
                  <td data-label="Ubicación"><span className="tag">{(l.location ?? '').replace(/-/g, ' ')}</span></td>
                  <td data-label="Estado">
                    <span className="status-chip" style={{ background: STATUS_COLORS[l.status], color: '#fff' }}>
                      {STATUS_LABELS[l.status]}
                    </span>
                  </td>
                  <td data-label="Prioridad">
                    <span className="priority-chip" style={{ background: PRIORITY_COLORS[l.priority], color: '#fff' }}>
                      {PRIORITY_LABELS[l.priority]}
                    </span>
                  </td>
                  <td data-label="Valor" className="num value-cell">{formatCLP(l.value)}</td>
                  <td data-label="Actualizado" className="muted-cell">{relativeTime(l.updated_at)}</td>
                  <td data-label="">
                    <a href={`/admin/leads/${l.id}`} className="row-action" aria-label="Ver lead">→</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > sorted.length && (
        <p className="muted-cell" style={{ textAlign: 'center', marginTop: 12 }}>
          Mostrando {sorted.length} de {total} leads. Refina los filtros para ver menos.
        </p>
      )}
    </div>
  );
}
