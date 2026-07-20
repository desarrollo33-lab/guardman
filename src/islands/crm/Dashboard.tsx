// Dashboard — KPIs + funnel + agenda + actividad + tareas + sources.
// Demo mode con crm-data. En producción llama a /api/crm/*.
import { useMemo } from 'react';
import {
  crmLeads,
  crmTasks,
  buildDashboard,
  formatCLP,
  formatDate,
  ACTIVITY_LABELS,
  TASK_TYPE_LABELS,
  type Dashboard as DashboardT,
} from '../../lib/crm-data';

export default function Dashboard() {
  const data = useMemo<DashboardT>(
    () => buildDashboard(crmLeads, crmTasks),
    [],
  );

  const kpis = [
    { label: 'Leads nuevos (7 días)', value: String(data.kpis.new_leads_7d), sub: `${data.kpis.new_leads_30d} en 30 días`, color: 'blue', icon: '📥' },
    { label: 'Valor pipeline', value: formatCLP(data.kpis.pipeline_value), sub: 'Abierto', color: 'amber', icon: '💰' },
    { label: 'Conversión', value: `${data.kpis.conversion_rate}%`, sub: `${data.kpis.won_this_month} ganados · ${data.kpis.lost_this_month} perdidos`, color: 'green', icon: '🎯' },
    { label: 'Ticket promedio', value: formatCLP(data.kpis.avg_deal_size), sub: 'Ganados', color: 'amber', icon: '📊' },
  ];

  const maxFunnelCount = Math.max(...data.funnel.map((f) => f.count), 1);

  return (
    <div className="crm-dashboard">
      {/* KPIs */}
      <div className="kpi-row">
        {kpis.map((kpi) => (
          <div className="kpi-card" key={kpi.label}>
            <div className="kpi-top">
              <span className="kpi-icon">{kpi.icon}</span>
            </div>
            <div className={`kpi-value ${kpi.color}`}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-sub">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Funnel */}
        <div className="panel">
          <div className="panel-header">
            <h3>Embudo de conversión</h3>
            <a href="/admin/pipeline" className="panel-link">Ver pipeline →</a>
          </div>
          <div className="funnel">
            {data.funnel.map((stage) => (
              <div className="funnel-row" key={stage.stage}>
                <div className="funnel-label">
                  <span className="funnel-dot" style={{ background: stage.color }} />
                  <span>{stage.label}</span>
                </div>
                <div className="funnel-bar-wrap">
                  <div
                    className="funnel-bar"
                    style={{
                      width: `${(stage.count / maxFunnelCount) * 100}%`,
                      background: stage.color,
                    }}
                  />
                </div>
                <div className="funnel-stats">
                  <span className="funnel-count">{stage.count}</span>
                  <span className="funnel-value">{formatCLP(stage.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda hoy */}
        <div className="panel">
          <div className="panel-header">
            <h3>📅 Mi día</h3>
            <a href="/admin/inbox" className="panel-link">Inbox →</a>
          </div>
          {data.today_agenda.length === 0 ? (
            <p className="empty-state">Sin actividades agendadas para hoy.</p>
          ) : (
            <div className="agenda">
              {data.today_agenda.map((item, i) => (
                <a className="agenda-item" key={i} href={item.lead_id ? `/admin/leads/${item.lead_id}` : '#'}>
                  <div className="agenda-time">{item.time}</div>
                  <div className="agenda-body">
                    <div className="agenda-title">{item.title}</div>
                    <span className={`pill pill-${item.type === 'visit' ? 'info' : item.type === 'call' ? 'warning' : 'success'}`}>
                      {item.type === 'visit' ? 'Visita' : item.type === 'call' ? 'Llamada' : item.type === 'meeting' ? 'Reunión' : 'Tarea'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Tareas próximas */}
        <div className="panel">
          <div className="panel-header">
            <h3>⏰ Tareas próximas</h3>
            <a href="/admin/inbox" className="panel-link">Ver todas →</a>
          </div>
          {data.upcoming_tasks.length === 0 ? (
            <p className="empty-state">Sin tareas pendientes.</p>
          ) : (
            <div className="task-list">
              {data.upcoming_tasks.map((t) => (
                <div className="task-item" key={t.id}>
                  <div className="task-icon" data-type={t.type}>
                    {t.type === 'call' ? '📞' : t.type === 'visit' ? '📍' : t.type === 'meeting' ? '👥' : t.type === 'email' ? '✉️' : t.type === 'document' ? '📄' : '🔄'}
                  </div>
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta">
                      <span>{t.lead_name}</span>
                      <span className="task-due">{TASK_TYPE_LABELS[t.type]} · {formatDate(t.due_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="panel">
          <div className="panel-header">
            <h3>🔄 Actividad reciente</h3>
          </div>
          <div className="activity-feed">
            {data.recent_activity.map((a) => (
              <div className="activity-item" key={a.id}>
                <div className="activity-dot" data-type={a.type} />
                <div className="activity-body">
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-meta">
                    <span>{ACTIVITY_LABELS[a.type]}</span>
                    <span>· {a.when}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top servicios */}
        <div className="panel">
          <div className="panel-header">
            <h3>🏆 Top servicios</h3>
          </div>
          <div className="ranked-list">
            {data.top_services.map((s, i) => (
              <div className="ranked-item" key={s.service}>
                <div className="ranked-pos">{i + 1}</div>
                <div className="ranked-body">
                  <div className="ranked-label">{s.service.replace(/-/g, ' ')}</div>
                  <div className="ranked-meta">{s.count} leads · {formatCLP(s.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top ubicaciones */}
        <div className="panel">
          <div className="panel-header">
            <h3>📍 Top comunas</h3>
          </div>
          <div className="ranked-list">
            {data.top_locations.map((l, i) => (
              <div className="ranked-item" key={l.location}>
                <div className="ranked-pos">{i + 1}</div>
                <div className="ranked-body">
                  <div className="ranked-label">{l.location.replace(/-/g, ' ')}</div>
                  <div className="ranked-meta">{l.count} leads · {formatCLP(l.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source breakdown */}
        <div className="panel panel-full">
          <div className="panel-header">
            <h3>📊 Leads por fuente</h3>
          </div>
          <div className="source-breakdown">
            {data.source_breakdown
              .slice()
              .sort((a, b) => b.count - a.count)
              .map((s) => {
                const max = Math.max(...data.source_breakdown.map((x) => x.count), 1);
                return (
                  <div className="source-row" key={s.source}>
                    <div className="source-label">{s.label}</div>
                    <div className="source-bar-wrap">
                      <div
                        className="source-bar"
                        style={{ width: `${(s.count / max) * 100}%` }}
                      />
                    </div>
                    <div className="source-stats">
                      <span>{s.count}</span>
                      <span className="source-value">{formatCLP(s.value)}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
