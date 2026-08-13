// Dashboard — KPIs calculados en cliente desde /api/leads (D1).
import { useEffect, useMemo, useState } from 'react';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SOURCE_LABELS,
  formatCLP,
  relativeTime,
  type Lead,
  type LeadStatus,
} from '../../lib/crm-data';

interface ApiLead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location?: string | null;
  status: LeadStatus;
  priority: Lead['priority'];
  source: string;
  value: number;
}

function apiToLead(a: ApiLead): Lead {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    service: a.service,
    location: a.location ?? '',
    status: a.status,
    priority: a.priority,
    source: (a.source as Lead['source']) ?? 'web_contacto',
    value: a.value,
    created_at: a.created_at,
  };
}

const STATUS_FUNNEL: LeadStatus[] = ['new', 'contacted', 'visit', 'proposal', 'negotiation', 'won'];
const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  contacted: '#10B981',
  visit: '#F59E0B',
  proposal: '#8B5CF6',
  negotiation: '#8B5CF6',
  won: '#10B981',
  lost: '#EF4444',
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const kpis = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const last7 = leads.filter((l) => now - new Date(l.created_at).getTime() <= 7 * day);
    const last30 = leads.filter((l) => now - new Date(l.created_at).getTime() <= 30 * day);
    const won = leads.filter((l) => l.status === 'won');
    const lost = leads.filter((l) => l.status === 'lost');
    const closed = won.length + lost.length;
    const pipelineValue = leads
      .filter((l) => l.status !== 'won' && l.status !== 'lost')
      .reduce((s, l) => s + l.value, 0);
    const avgDeal = won.length > 0 ? Math.round(won.reduce((s, l) => s + l.value, 0) / won.length) : 0;
    const conversion = closed > 0 ? Math.round((won.length / closed) * 100) : 0;
    return {
      new_leads_7d: last7.length,
      new_leads_30d: last30.length,
      pipeline_value: pipelineValue,
      won_this_month: won.filter((l) => now - new Date(l.created_at).getTime() <= 30 * day).length,
      lost_this_month: lost.filter((l) => now - new Date(l.created_at).getTime() <= 30 * day).length,
      avg_deal_size: avgDeal,
      conversion_rate: conversion,
    };
  }, [leads]);

  const funnel = useMemo(() => {
    return STATUS_FUNNEL.map((s) => ({
      stage: s,
      label: STATUS_LABELS[s],
      count: leads.filter((l) => l.status === s).length,
      value: leads.filter((l) => l.status === s).reduce((sum, l) => sum + l.value, 0),
      color: STATUS_COLORS[s],
    }));
  }, [leads]);

  const topServices = useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    for (const l of leads) {
      const cur = map.get(l.service) ?? { count: 0, value: 0 };
      cur.count += 1;
      cur.value += l.value;
      map.set(l.service, cur);
    }
    return [...map.entries()]
      .map(([service, v]) => ({ service, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [leads]);

  const topLocations = useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    for (const l of leads) {
      if (!l.location) continue;
      const cur = map.get(l.location) ?? { count: 0, value: 0 };
      cur.count += 1;
      cur.value += l.value;
      map.set(l.location, cur);
    }
    return [...map.entries()]
      .map(([location, v]) => ({ location, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [leads]);

  const sourceBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    for (const l of leads) {
      const cur = map.get(l.source) ?? { count: 0, value: 0 };
      cur.count += 1;
      cur.value += l.value;
      map.set(l.source, cur);
    }
    return [...map.entries()]
      .map(([source, v]) => ({ source, label: SOURCE_LABELS[source as keyof typeof SOURCE_LABELS] ?? source, ...v }));
  }, [leads]);

  const recentLeads = useMemo(
    () => [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    [leads],
  );

  if (loading) {
    return <div className="panel empty-panel"><p className="empty-state">Cargando dashboard…</p></div>;
  }

  if (error) {
    return (
      <div className="panel" style={{ background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: 'var(--color-error)' }}>
        <strong>Error cargando dashboard.</strong> {error}
        <div style={{ marginTop: 12 }}>
          <button className="admin-btn admin-btn-primary" onClick={load}>Reintentar</button>
        </div>
      </div>
    );
  }

  const maxFunnelCount = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div className="crm-dashboard">
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-icon">📥</span></div>
          <div className="kpi-value blue">{kpis.new_leads_7d}</div>
          <div className="kpi-label">Leads nuevos (7 días)</div>
          <div className="kpi-sub">{kpis.new_leads_30d} en 30 días</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-icon">💰</span></div>
          <div className="kpi-value amber">{formatCLP(kpis.pipeline_value)}</div>
          <div className="kpi-label">Valor pipeline</div>
          <div className="kpi-sub">Abierto</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-icon">🎯</span></div>
          <div className="kpi-value green">{kpis.conversion_rate}%</div>
          <div className="kpi-label">Conversión</div>
          <div className="kpi-sub">{kpis.won_this_month} ganados · {kpis.lost_this_month} perdidos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-icon">📊</span></div>
          <div className="kpi-value amber">{formatCLP(kpis.avg_deal_size)}</div>
          <div className="kpi-label">Ticket promedio</div>
          <div className="kpi-sub">Ganados</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Embudo de conversión</h3>
            <a href="/admin/pipeline" className="panel-link">Ver pipeline →</a>
          </div>
          <div className="funnel">
            {funnel.map((stage) => (
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

        <div className="panel">
          <div className="panel-header">
            <h3>📥 Últimos leads</h3>
            <a href="/admin/inbox" className="panel-link">Inbox →</a>
          </div>
          {recentLeads.length === 0 ? (
            <p className="empty-state">Aún no hay leads capturados.</p>
          ) : (
            <div className="recent-leads">
              {recentLeads.map((l) => (
                <a key={l.id} className="recent-lead" href={`/admin/leads/${l.id}`}>
                  <span
                    className="inbox-avatar"
                    style={{ background: PRIORITY_COLORS[l.priority] }}
                  >
                    {l.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="recent-lead-body">
                    <div className="recent-lead-name">{l.name}</div>
                    <div className="recent-lead-meta">
                      {l.service.replace(/-/g, ' ')} · {relativeTime(l.created_at)}
                    </div>
                  </div>
                  <span className="pill">{STATUS_LABELS[l.status]}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header"><h3>🏆 Top servicios</h3></div>
          {topServices.length === 0 ? (
            <p className="empty-state">Sin datos aún.</p>
          ) : (
            <div className="ranked-list">
              {topServices.map((s, i) => (
                <div className="ranked-item" key={s.service}>
                  <div className="ranked-pos">{i + 1}</div>
                  <div className="ranked-body">
                    <div className="ranked-label">{s.service.replace(/-/g, ' ')}</div>
                    <div className="ranked-meta">{s.count} leads · {formatCLP(s.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header"><h3>📍 Top comunas</h3></div>
          {topLocations.length === 0 ? (
            <p className="empty-state">Sin datos aún.</p>
          ) : (
            <div className="ranked-list">
              {topLocations.map((l, i) => (
                <div className="ranked-item" key={l.location}>
                  <div className="ranked-pos">{i + 1}</div>
                  <div className="ranked-body">
                    <div className="ranked-label">{l.location.replace(/-/g, ' ')}</div>
                    <div className="ranked-meta">{l.count} leads · {formatCLP(l.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel panel-full">
          <div className="panel-header"><h3>📊 Leads por fuente</h3></div>
          {sourceBreakdown.length === 0 ? (
            <p className="empty-state">Sin datos aún.</p>
          ) : (
            <div className="source-breakdown">
              {sourceBreakdown
                .slice()
                .sort((a, b) => b.count - a.count)
                .map((s) => {
                  const max = Math.max(...sourceBreakdown.map((x) => x.count), 1);
                  return (
                    <div className="source-row" key={s.source}>
                      <div className="source-label">{s.label}</div>
                      <div className="source-bar-wrap">
                        <div className="source-bar" style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                      <div className="source-stats">
                        <span>{s.count}</span>
                        <span className="source-value">{formatCLP(s.value)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
