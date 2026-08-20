// ════════════════════════════════════════════════════════════════
// GuardMan CRM — Data layer v5.0
// CRM-only (leads + status + priority + source). Sin clients, quotes,
// team, tasks, notes, communications (removidos en v4.0 "CRM-only").
// Solo lo que se usa: tipos, labels, colores, helpers de formato.
// ════════════════════════════════════════════════════════════════

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'visit'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export type LeadSource =
  | 'web_contacto'
  | 'web_cotizacion'
  | 'phone'
  | 'referral'
  | 'organic'
  | 'ads'
  | 'social'
  | 'email';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  location: string;
  sector?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  value: number;
  monthly_value?: number;
  created_at: string;
  updated_at: string;
  expected_close?: string;
  assigned_to: string;
  owner_email: string;
  notes?: string;
  property_type?: string;
  guards_count?: string;
  message?: string;
  tags?: string[];
}

// ── Flow canónico del lead (mismo orden que usa el Pipeline) ──
export const STATUS_FLOW: LeadStatus[] = [
  'new',
  'contacted',
  'visit',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  visit: 'Visita',
  proposal: 'Cotización',
  negotiation: 'Negociación',
  won: 'Ganado',
  lost: 'Perdido',
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3B82F6',
  contacted: '#8B5CF6',
  visit: '#F59E0B',
  proposal: '#06B6D4',
  negotiation: '#EC4899',
  won: '#10B981',
  lost: '#EF4444',
};

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};

export const PRIORITY_COLORS: Record<LeadPriority, string> = {
  low: '#5a6880',
  medium: '#3B82F6',
  high: '#F59E0B',
  urgent: '#EF4444',
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  web_contacto: 'Web · Contacto',
  web_cotizacion: 'Web · Cotización',
  phone: 'Teléfono',
  referral: 'Referido',
  organic: 'Orgánico',
  ads: 'Ads',
  social: 'Redes sociales',
  email: 'Email',
};

// ── Helpers de formato ──────────────────────────────────────

export function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      timeZone: 'America/Santiago',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function relativeTime(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diffMs = now - then;
    const sec = Math.round(diffMs / 1000);
    if (sec < 60) return 'hace un momento';
    const min = Math.round(sec / 60);
    if (min < 60) return `hace ${min} min`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `hace ${hr} h`;
    const day = Math.round(hr / 24);
    if (day < 30) return `hace ${day} d`;
    const mon = Math.round(day / 30);
    if (mon < 12) return `hace ${mon} mes${mon === 1 ? '' : 'es'}`;
    const yr = Math.round(mon / 12);
    return `hace ${yr} año${yr === 1 ? '' : 's'}`;
  } catch {
    return iso;
  }
}
