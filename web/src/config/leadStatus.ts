/**
 * Centralized lead status configuration
 * Used across admin components and Convex backend
 */

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  new: { label: 'Nuevo', bgClass: 'bg-blue-100', textClass: 'text-blue-800' },
  contacted: {
    label: 'Contactado',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
  },
  qualified: {
    label: 'Calificado',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
  },
  converted: {
    label: 'Convertido',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
  },
  lost: { label: 'Perdido', bgClass: 'bg-red-100', textClass: 'text-red-800' },
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  converted: 'Convertido',
  lost: 'Perdido',
};
