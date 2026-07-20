// Pipeline — Kanban con drag&drop, filtros y export CSV.
import { useMemo, useState, useCallback } from 'react';
import {
  crmLeads,
  buildPipeline,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatCLP,
  type Lead,
  type LeadStatus,
  type PipelineColumn,
} from '../../lib/crm-data';

function exportCSV(leads: Lead[]) {
  const headers = ['id', 'name', 'email', 'phone', 'company', 'service', 'location', 'status', 'priority', 'source', 'value', 'created_at', 'expected_close', 'assigned_to', 'message'];
  const rows = leads.map((l) =>
    [
      l.id, l.name, l.email, l.phone, l.company ?? '', l.service, l.location,
      l.status, l.priority, l.source, String(l.value), l.created_at,
      l.expected_close ?? '', l.owner_email, (l.message ?? '').replace(/"/g, '""'),
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

interface Filters {
  assignee: string;
  service: string;
  priority: string;
  query: string;
}

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(crmLeads);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null);
  const [filters, setFilters] = useState<Filters>({ assignee: '', service: '', priority: '', query: '' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (filters.assignee && l.assigned_to !== filters.assignee) return false;
      if (filters.service && l.service !== filters.service) return false;
      if (filters.priority && l.priority !== filters.priority) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q) && !(l.company ?? '').toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [leads, filters]);

  const columns = useMemo<PipelineColumn[]>(
    () => buildPipeline(filteredLeads),
    [filteredLeads],
  );

  const moveLead = useCallback((leadId: string, toStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: toStatus, updated_at: new Date().toISOString().slice(0, 10) } : l)),
    );
  }, []);

  const totalValue = filteredLeads.reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <div className="pipeline-toolbar">
        <input
          className="form-input pipeline-search"
          placeholder="🔍 Buscar por nombre, email, empresa…"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        <button className="admin-btn admin-btn-secondary" onClick={() => setShowFilters(!showFilters)}>
          ⚙️ Filtros {showFilters ? '▲' : '▼'}
        </button>
        <button className="admin-btn admin-btn-secondary" onClick={() => exportCSV(filteredLeads)}>
          📤 Exportar CSV
        </button>
        <div className="pipeline-summary">
          <span><strong>{filteredLeads.length}</strong> leads</span>
          <span><strong>{formatCLP(totalValue)}</strong> total</span>
        </div>
      </div>

      {showFilters && (
        <div className="panel filter-panel">
          <div className="filter-grid">
            <div>
              <label className="filter-label">Asignado a</label>
              <select className="form-input" value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}>
                <option value="">Todos</option>
                <option value="U001">Administrador</option>
                <option value="U002">María Soto</option>
                <option value="U003">Carlos Díaz</option>
                <option value="U004">Patricia Rivas</option>
              </select>
            </div>
            <div>
              <label className="filter-label">Servicio</label>
              <select className="form-input" value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
                <option value="">Todos</option>
                <option value="guardias-de-seguridad">Guardias de Seguridad</option>
                <option value="cctv-videovigilancia">CCTV Videovigilancia</option>
                <option value="control-de-accesos">Control de Accesos</option>
                <option value="escoltas-privados">PPI (Protección de Personas Importantes)</option>
                <option value="monitoreo-24-7">Monitoreo 24/7</option>
                <option value="seguridad-eventos">Seguridad Eventos</option>
                <option value="seguridad-industrial">Seguridad Industrial</option>
                <option value="auditoria-seguridad">Auditoría de Seguridad</option>
                <option value="guard-pod">Guard Pod</option>
              </select>
            </div>
            <div>
              <label className="filter-label">Prioridad</label>
              <select className="form-input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                <option value="">Todas</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setFilters({ assignee: '', service: '', priority: '', query: '' })}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="kanban">
        {columns.map((col) => (
          <div
            key={col.status}
            className="kanban-col"
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.status); }}
            onDragLeave={() => setDragOverCol((c) => (c === col.status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId) moveLead(dragId, col.status);
              setDragId(null);
              setDragOverCol(null);
            }}
          >
            <div className="kanban-col-header" style={{ borderTopColor: col.color }}>
              <div className="kanban-col-title">
                <span className="kanban-dot" style={{ background: col.color }} />
                <span>{col.label}</span>
                <span className="pill pill-neutral">{col.leads.length}</span>
              </div>
              <span className="kanban-col-value">{formatCLP(col.total_value)}</span>
            </div>
            <div
              className={`kanban-col-body ${dragOverCol === col.status ? 'drag-over' : ''}`}
            >
              {col.leads.length === 0 ? (
                <div className="kanban-empty">Arrastra leads aquí</div>
              ) : (
                col.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => { setDragId(null); setDragOverCol(null); }}
                    onClick={() => (window.location.href = `/admin/leads/${lead.id}`)}
                    style={{ opacity: dragId === lead.id ? 0.4 : 1 }}
                  >
                    <div className="kanban-card-header">
                      <span className="kanban-card-priority" style={{ background: PRIORITY_COLORS[lead.priority] }} title={PRIORITY_LABELS[lead.priority]} />
                      <span className="kanban-card-name">{lead.name}</span>
                    </div>
                    {lead.company && <div className="kanban-card-company">{lead.company}</div>}
                    <div className="kanban-card-tags">
                      <span className="tag">{lead.service.replace(/-/g, ' ')}</span>
                      <span className="tag">{lead.location.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="kanban-card-footer">
                      <span className="kanban-card-value">{formatCLP(lead.value)}</span>
                      <span className="kanban-card-owner">{lead.owner_email.split('@')[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
