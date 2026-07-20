// LeadsList — tabla filtrable + búsqueda + bulk actions.
import { useMemo, useState } from 'react';
import {
  crmLeads,
  STATUS_FLOW,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatCLP,
  relativeTime,
} from '../../lib/crm-data';

type SortKey = 'created_at' | 'value' | 'updated_at' | 'name';

export default function LeadsList() {
  const leads = crmLeads;
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let r = leads;
    if (statusFilter) r = r.filter((l) => l.status === statusFilter);
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
    r = [...r].sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      av = Number(av); bv = Number(bv);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return r;
  }, [leads, query, statusFilter, sortKey, sortDir]);

  const counts = useMemo(
    () => STATUS_FLOW.reduce<Record<string, number>>((acc, s) => {
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
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

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
            <option key={s} value={s}>{STATUS_LABELS[s]} ({counts[s]})</option>
          ))}
        </select>
        <button className="admin-btn admin-btn-primary">+ Nuevo lead</button>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span>{selected.size} seleccionados</span>
          <button className="admin-btn admin-btn-secondary">Asignar a…</button>
          <button className="admin-btn admin-btn-secondary">Cambiar estado</button>
          <button className="admin-btn admin-btn-secondary">Exportar</button>
          <button className="admin-btn admin-btn-danger">Eliminar</button>
          <button className="admin-btn admin-btn-secondary" onClick={() => setSelected(new Set())}>Limpiar</button>
        </div>
      )}

      <div className="panel">
        <table className="data-table leads-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}>
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} aria-label="Seleccionar todos" />
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
            {filtered.map((l) => (
              <tr key={l.id} className={selected.has(l.id) ? 'row-selected' : ''}>
                <td><input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleOne(l.id)} aria-label={`Seleccionar ${l.name}`} /></td>
                <td>
                  <a href={`/admin/leads/${l.id}`} className="lead-link">
                    <div className="lead-cell">
                      <strong>{l.name}</strong>
                      {l.company && <span className="lead-cell-company">{l.company}</span>}
                    </div>
                  </a>
                </td>
                <td>
                  <div className="contact-cell">
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                    <a href={`tel:${l.phone}`} className="contact-phone">{l.phone}</a>
                  </div>
                </td>
                <td><span className="tag">{l.service.replace(/-/g, ' ')}</span></td>
                <td><span className="tag">{l.location.replace(/-/g, ' ')}</span></td>
                <td>
                  <span className="status-chip" style={{ background: STATUS_COLORS[l.status], color: '#fff' }}>
                    {STATUS_LABELS[l.status]}
                  </span>
                </td>
                <td>
                  <span className="priority-chip" style={{ background: PRIORITY_COLORS[l.priority], color: '#fff' }}>
                    {PRIORITY_LABELS[l.priority]}
                  </span>
                </td>
                <td className="num value-cell">{formatCLP(l.value)}</td>
                <td className="muted-cell">{relativeTime(l.updated_at)}</td>
                <td>
                  <a href={`/admin/leads/${l.id}`} className="row-action">→</a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--fg-dim)' }}>
                  No se encontraron leads con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
