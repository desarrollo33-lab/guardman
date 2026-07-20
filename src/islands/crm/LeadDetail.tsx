// LeadDetail — Lead 360°: info, timeline, tasks, notes, communications.
// Recibe lead_id via props (inyectado desde Astro page).
import { useState } from 'react';
import {
  crmLeads,
  leadTimeline,
  leadTasks,
  leadNotes,
  leadCommunications,
  STATUS_FLOW,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SOURCE_LABELS,
  TASK_TYPE_LABELS,
  ACTIVITY_LABELS,
  formatCLP,
  formatDate,
  formatDateTime,
  relativeTime,
  type Note,
  type Task,
} from '../../lib/crm-data';

interface Props {
  leadId: string;
}

type Tab = 'timeline' | 'tasks' | 'notes' | 'comms';

export default function LeadDetail({ leadId }: Props) {
  const lead = crmLeads.find((l) => l.id === leadId);
  const [tab, setTab] = useState<Tab>('timeline');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => leadNotes(leadId));
  const [tasks, setTasks] = useState<Task[]>(() => leadTasks(leadId));
  const [newTask, setNewTask] = useState({ title: '', type: 'call' as Task['type'], due_at: '' });

  if (!lead) {
    return (
      <div className="panel">
        <p className="empty-state">Lead no encontrado.</p>
      </div>
    );
  }

  const timeline = leadTimeline(leadId);
  const comms = leadCommunications(leadId);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: `N${Date.now()}`,
      lead_id: leadId,
      body: newNote.trim(),
      at: new Date().toISOString(),
      by: 'admin@guardman.cl',
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.due_at) return;
    const task: Task = {
      id: `T${Date.now()}`,
      lead_id: leadId,
      type: newTask.type,
      title: newTask.title.trim(),
      due_at: newTask.due_at,
      status: 'pending',
      assigned_to: lead.assigned_to,
      created_at: new Date().toISOString(),
    };
    setTasks([task, ...tasks]);
    setNewTask({ title: '', type: 'call', due_at: '' });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t,
      ),
    );
  };

  return (
    <div className="lead-detail-layout">
      {/* Columna principal */}
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
            <span>📥 {SOURCE_LABELS[lead.source]}</span>
            <span>· Creado {formatDate(lead.created_at)}</span>
            {lead.expected_close && <span>· Cierre esp. {formatDate(lead.expected_close)}</span>}
            <span>· Asignado a {lead.owner_email}</span>
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
                style={lead.status === s ? { background: STATUS_COLORS[s], color: '#fff' } : { color: STATUS_COLORS[s], borderColor: STATUS_COLORS[s] }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'timeline' ? 'active' : ''}`} onClick={() => setTab('timeline')}>
            📅 Timeline <span className="pill pill-neutral">{timeline.length}</span>
          </button>
          <button className={`tab ${tab === 'tasks' ? 'active' : ''}`} onClick={() => setTab('tasks')}>
            ✓ Tareas <span className="pill pill-neutral">{tasks.length}</span>
          </button>
          <button className={`tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>
            📝 Notas <span className="pill pill-neutral">{notes.length}</span>
          </button>
          <button className={`tab ${tab === 'comms' ? 'active' : ''}`} onClick={() => setTab('comms')}>
            💬 Comunicación <span className="pill pill-neutral">{comms.length}</span>
          </button>
        </div>

        {/* Tab content */}
        {tab === 'timeline' && (
          <div className="panel">
            <div className="timeline">
              {timeline.map((a) => (
                <div className="timeline-item" key={a.id}>
                  <div className="timeline-dot" style={{ background: STATUS_COLORS[lead.status] }} />
                  <div className="timeline-body">
                    <div className="timeline-title">{a.title}</div>
                    {a.description && <div className="timeline-desc">{a.description}</div>}
                    <div className="timeline-meta">
                      <span>{ACTIVITY_LABELS[a.type]}</span>
                      <span>· {formatDateTime(a.at)}</span>
                      <span>· {a.by}</span>
                    </div>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && <p className="empty-state">Sin actividad registrada.</p>}
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="panel">
            <div className="task-add">
              <input
                className="form-input"
                placeholder="Nueva tarea…"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <select
                className="form-input task-type-select"
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value as Task['type'] })}
              >
                <option value="call">📞 Llamar</option>
                <option value="email">✉️ Email</option>
                <option value="visit">📍 Visita</option>
                <option value="meeting">👥 Reunión</option>
                <option value="follow_up">🔄 Seguimiento</option>
                <option value="document">📄 Documento</option>
              </select>
              <input
                className="form-input task-due-input"
                type="datetime-local"
                value={newTask.due_at}
                onChange={(e) => setNewTask({ ...newTask, due_at: e.target.value })}
              />
              <button className="admin-btn admin-btn-primary" onClick={addTask}>+ Agregar</button>
            </div>
            <div className="task-list">
              {tasks.map((t) => (
                <div className={`task-item ${t.status === 'done' ? 'task-done' : ''}`} key={t.id}>
                  <input
                    type="checkbox"
                    checked={t.status === 'done'}
                    onChange={() => toggleTask(t.id)}
                  />
                  <div className="task-icon" data-type={t.type}>
                    {t.type === 'call' ? '📞' : t.type === 'visit' ? '📍' : t.type === 'meeting' ? '👥' : t.type === 'email' ? '✉️' : t.type === 'document' ? '📄' : '🔄'}
                  </div>
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta">
                      <span>{TASK_TYPE_LABELS[t.type]}</span>
                      <span>· Vence {formatDateTime(t.due_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="empty-state">Sin tareas. Agrega la primera.</p>}
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className="panel">
            <div className="note-add">
              <textarea
                className="form-input"
                placeholder="Escribe una nota interna… (visible solo para el equipo)"
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button className="admin-btn admin-btn-primary" onClick={addNote}>+ Guardar nota</button>
            </div>
            <div className="notes-list">
              {notes.map((n) => (
                <div className="note-item" key={n.id}>
                  <div className="note-meta">
                    <strong>{n.by.split('@')[0]}</strong>
                    <span>· {relativeTime(n.at)}</span>
                  </div>
                  <p className="note-body">{n.body}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="empty-state">Sin notas. Agrega la primera.</p>}
            </div>
          </div>
        )}

        {tab === 'comms' && (
          <div className="panel">
            <div className="comms-list">
              {comms.map((c) => (
                <div className={`comm-item comm-${c.direction}`} key={c.id}>
                  <div className="comm-icon">
                    {c.channel === 'call' ? '📞' : c.channel === 'email' ? '✉️' : c.channel === 'whatsapp' ? '💬' : c.channel === 'visit' ? '📍' : '👥'}
                  </div>
                  <div className="comm-body">
                    <div className="comm-header">
                      <strong>{c.subject}</strong>
                      <span className="comm-direction">{c.direction === 'inbound' ? '← Recibido' : '→ Enviado'}</span>
                    </div>
                    <p className="comm-summary">{c.summary}</p>
                    <div className="comm-meta">
                      <span>{formatDateTime(c.at)}</span>
                      <span>· {c.by.split('@')[0]}</span>
                      {c.duration_min && <span>· {c.duration_min} min</span>}
                    </div>
                  </div>
                </div>
              ))}
              {comms.length === 0 && <p className="empty-state">Sin comunicaciones registradas.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar info */}
      <aside className="lead-detail-side">
        <div className="panel">
          <div className="panel-header"><h3>Información</h3></div>
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
              <a href={`/admin/leads?service=${lead.service}`} className="info-value">{lead.service.replace(/-/g, ' ')}</a>
            </div>
            <div className="info-row">
              <span className="info-label">Ubicación</span>
              <a href={`/admin/leads?location=${lead.location}`} className="info-value">{lead.location.replace(/-/g, ' ')}</a>
            </div>
            {lead.sector && (
              <div className="info-row">
                <span className="info-label">Sector</span>
                <span className="info-value">{lead.sector}</span>
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
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h3>Valor</h3></div>
          <div className="value-block">
            <div className="value-row">
              <span>Valor estimado</span>
              <strong>{formatCLP(lead.value)}</strong>
            </div>
            {lead.monthly_value && (
              <div className="value-row">
                <span>Valor mensual</span>
                <strong>{formatCLP(lead.monthly_value)}</strong>
              </div>
            )}
            {lead.expected_close && (
              <div className="value-row">
                <span>Cierre esperado</span>
                <strong>{formatDate(lead.expected_close)}</strong>
              </div>
            )}
          </div>
        </div>

        {lead.tags && lead.tags.length > 0 && (
          <div className="panel">
            <div className="panel-header"><h3>Etiquetas</h3></div>
            <div className="tag-list">
              {lead.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
          </div>
        )}

        <div className="panel">
          <div className="panel-header"><h3>Acciones</h3></div>
          <div className="side-actions">
            <button className="admin-btn admin-btn-secondary">📅 Agendar visita</button>
            <button className="admin-btn admin-btn-secondary">📤 Asignar a…</button>
            <button className="admin-btn admin-btn-secondary">✉️ Enviar email</button>
            <button className="admin-btn admin-btn-danger">✕ Marcar perdido</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
