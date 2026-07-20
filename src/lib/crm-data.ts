// ════════════════════════════════════════════════════════════════
// GuardMan CRM — Data layer v4.0
// Solo gestión de leads: Inbox, Pipeline, Lead 360° (timeline,
// tasks, notes, communications). Sin clients, quotes ni team.
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

export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'note'
  | 'call'
  | 'email'
  | 'visit'
  | 'meeting'
  | 'quote_sent'
  | 'quote_accepted'
  | 'quote_rejected'
  | 'task_done'
  | 'task_scheduled'
  | 'assigned';

export type TaskType = 'call' | 'email' | 'visit' | 'meeting' | 'follow_up' | 'document';

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';

export interface Activity {
  id: string;
  lead_id: string;
  type: ActivityType;
  title: string;
  description?: string;
  at: string;
  by: string;
  metadata?: Record<string, unknown>;
}

export interface Task {
  id: string;
  lead_id: string;
  type: TaskType;
  title: string;
  description?: string;
  due_at: string;
  status: TaskStatus;
  assigned_to: string;
  created_at: string;
}

export interface Note {
  id: string;
  lead_id: string;
  body: string;
  at: string;
  by: string;
}

export interface Communication {
  id: string;
  lead_id: string;
  channel: 'call' | 'email' | 'whatsapp' | 'visit' | 'meeting';
  direction: 'inbound' | 'outbound';
  subject: string;
  summary: string;
  at: string;
  by: string;
  duration_min?: number;
}

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

export interface Dashboard {
  kpis: {
    new_leads_30d: number;
    new_leads_7d: number;
    pipeline_value: number;
    won_this_month: number;
    lost_this_month: number;
    conversion_rate: number;
    avg_deal_size: number;
    avg_close_days: number;
  };
  funnel: Array<{ stage: LeadStatus; label: string; count: number; value: number; color: string }>;
  today_agenda: Array<{ time: string; title: string; type: 'visit' | 'call' | 'meeting' | 'task'; lead_id?: string }>;
  recent_activity: Array<{ id: string; text: string; when: string; type: ActivityType }>;
  upcoming_tasks: Array<{ id: string; title: string; due_at: string; lead_name: string; type: TaskType }>;
  source_breakdown: Array<{ source: LeadSource; label: string; count: number; value: number }>;
  top_locations: Array<{ location: string; count: number; value: number }>;
  top_services: Array<{ service: string; count: number; value: number }>;
  weekly_chart: Array<{ day: string; leads: number; won: number }>;
}

export interface PipelineColumn {
  status: LeadStatus;
  label: string;
  color: string;
  leads: Lead[];
  total_value: number;
}

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

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  created: 'Lead creado',
  status_changed: 'Cambio de estado',
  note: 'Nota',
  call: 'Llamada',
  email: 'Email',
  visit: 'Visita',
  meeting: 'Reunión',
  quote_sent: 'Cotización enviada',
  quote_accepted: 'Cotización aceptada',
  quote_rejected: 'Cotización rechazada',
  task_done: 'Tarea completada',
  task_scheduled: 'Tarea agendada',
  assigned: 'Asignación',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  call: 'Llamar',
  email: 'Email',
  visit: 'Visita',
  meeting: 'Reunión',
  follow_up: 'Seguimiento',
  document: 'Documento',
};

// ────────────────────────────────────────────────────────────────
// MOCK DATA — Demo mode. En producción viene del Worker API.
// ────────────────────────────────────────────────────────────────

const baseDate = '2026-07-';

export const crmLeads: Lead[] = [
  {
    id: 'L001',
    name: 'María González',
    email: 'maria@condominiovertientes.cl',
    phone: '+56930000010',
    company: 'Condominio Las Vertientes',
    service: 'guardias-de-seguridad',
    location: 'las-condes',
    sector: 'residencial',
    status: 'new',
    priority: 'high',
    source: 'web_cotizacion',
    value: 850_000,
    monthly_value: 850_000,
    created_at: `${baseDate}10`,
    updated_at: `${baseDate}10`,
    expected_close: `${baseDate}28`,
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Necesitamos 4 guardias para turno nocturno en condominio de 80 departamentos.',
    property_type: 'Condominio residencial',
    guards_count: '4',
    tags: ['condominio', 'nocturno'],
  },
  {
    id: 'L002',
    name: 'Carlos Pérez',
    email: 'cperez@grupodelta.cl',
    phone: '+56930000011',
    company: 'Grupo Delta',
    service: 'cctv-videovigilancia',
    location: 'huechuraba',
    sector: 'comercial',
    status: 'contacted',
    priority: 'medium',
    source: 'web_contacto',
    value: 1_200_000,
    monthly_value: 0,
    created_at: `${baseDate}08`,
    updated_at: `${baseDate}12`,
    expected_close: `${baseDate}30`,
    assigned_to: 'U003',
    owner_email: 'carlos.diaz@guardman.cl',
    message: 'Solicito cotización para 16 cámaras IP en edificio corporativo de 12 pisos.',
    property_type: 'Edificio corporativo',
    tags: ['cctv', 'corporativo'],
  },
  {
    id: 'L003',
    name: 'Inmobiliaria Andes',
    email: 'contacto@iandes.cl',
    phone: '+56930000012',
    company: 'Inmobiliaria Andes',
    service: 'control-de-accesos',
    location: 'santiago-centro',
    sector: 'comercial',
    status: 'visit',
    priority: 'high',
    source: 'referral',
    value: 2_400_000,
    monthly_value: 200_000,
    created_at: `${baseDate}05`,
    updated_at: `${baseDate}11`,
    expected_close: `${baseDate}25`,
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Torre de 18 pisos, requiere control biométrico + torniquetes.',
    property_type: 'Edificio de oficinas',
    tags: ['biometrico', 'torre'],
  },
  {
    id: 'L004',
    name: 'Hotel Plaza',
    email: 'gerencia@hotelplaza.cl',
    phone: '+56930000013',
    company: 'Hotel Plaza',
    service: 'seguridad-eventos',
    location: 'vitacura',
    sector: 'hoteleria',
    status: 'proposal',
    priority: 'urgent',
    source: 'phone',
    value: 3_500_000,
    monthly_value: 0,
    created_at: `${baseDate}03`,
    updated_at: `${baseDate}11`,
    expected_close: `${baseDate}20`,
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Evento corporativo 400 personas, requiere 8 guardias + control de accesos.',
    property_type: 'Hotel + eventos',
    tags: ['evento', 'corporativo'],
  },
  {
    id: 'L005',
    name: 'Clínica San Borja',
    email: 'seguridad@clinicasanborja.cl',
    phone: '+56930000014',
    company: 'Clínica San Borja',
    service: 'guardias-de-seguridad',
    location: 'santiago-centro',
    sector: 'salud',
    status: 'negotiation',
    priority: 'urgent',
    source: 'referral',
    value: 4_800_000,
    monthly_value: 400_000,
    created_at: '2026-06-28',
    updated_at: `${baseDate}12`,
    expected_close: `${baseDate}22`,
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Reemplazo de proveedor actual. 12 guardias 24/7 en clínica.',
    property_type: 'Clínica',
    guards_count: '12',
    tags: ['salud', '24/7', 'urgente'],
  },
  {
    id: 'L006',
    name: 'Mall Premium',
    email: 'ops@mallpremium.cl',
    phone: '+56930000015',
    company: 'Mall Premium',
    service: 'monitoreo-24-7',
    location: 'las-condes',
    sector: 'comercial',
    status: 'won',
    priority: 'high',
    source: 'organic',
    value: 5_200_000,
    monthly_value: 5_200_000,
    created_at: '2026-06-15',
    updated_at: `${baseDate}05`,
    expected_close: `${baseDate}05`,
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Monitoreo 24/7 de 60 cámaras + respuesta armada.',
    tags: ['mall', 'monitoreo'],
  },
  {
    id: 'L007',
    name: 'Constructora Norte',
    email: 'ssconstr@cnorte.cl',
    phone: '+56930000016',
    company: 'Constructora Norte',
    service: 'seguridad-industrial',
    location: 'lampa',
    sector: 'construccion',
    status: 'new',
    priority: 'medium',
    source: 'web_cotizacion',
    value: 1_800_000,
    monthly_value: 0,
    created_at: `${baseDate}12`,
    updated_at: `${baseDate}12`,
    expected_close: '2026-08-15',
    assigned_to: 'U003',
    owner_email: 'carlos.diaz@guardman.cl',
    message: 'Obra de 12.000 m², requiere vigilancia perimetral + control de accesos.',
    property_type: 'Obra en construcción',
    tags: ['obra', 'perimetral'],
  },
  {
    id: 'L008',
    name: 'Colegio San Patricio',
    email: 'rector@sanpatricio.cl',
    phone: '+56930000017',
    company: 'Colegio San Patricio',
    service: 'guardias-de-seguridad',
    location: 'la-reina',
    sector: 'educacion',
    status: 'lost',
    priority: 'low',
    source: 'web_contacto',
    value: 900_000,
    monthly_value: 0,
    created_at: '2026-06-20',
    updated_at: `${baseDate}02`,
    expected_close: '2026-07-10',
    assigned_to: 'U004',
    owner_email: 'patricia.rivas@guardman.cl',
    message: 'Seleccionaron otra empresa por precio.',
    tags: ['educacion', 'perdido'],
  },
  {
    id: 'L009',
    name: 'Banco Regional',
    email: 'compras@bancoregional.cl',
    phone: '+56930000020',
    company: 'Banco Regional',
    service: 'control-de-accesos',
    location: 'santiago-centro',
    sector: 'comercial',
    status: 'contacted',
    priority: 'high',
    source: 'ads',
    value: 3_200_000,
    monthly_value: 0,
    created_at: `${baseDate}09`,
    updated_at: `${baseDate}11`,
    expected_close: '2026-08-05',
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: '12 sucursales, requiere estandarizar control de accesos.',
    tags: ['banco', 'multi-site'],
  },
  {
    id: 'L010',
    name: 'Aeropuerto del Norte',
    email: 'seguridad@adn.cl',
    phone: '+56930000021',
    company: 'Aeropuertos del Norte',
    service: 'monitoreo-24-7',
    location: 'pudahuel',
    sector: 'industrial',
    status: 'visit',
    priority: 'urgent',
    source: 'phone',
    value: 6_500_000,
    monthly_value: 0,
    created_at: `${baseDate}06`,
    updated_at: `${baseDate}11`,
    expected_close: `${baseDate}28`,
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Retrofit sistema de monitoreo existente, 120 cámaras.',
    tags: ['aeropuerto', 'retrofit'],
  },
  {
    id: 'L011',
    name: 'Julio Martinez',
    email: 'julio.martinez@gmail.com',
    phone: '+56930000022',
    service: 'escoltas-privados',
    location: 'las-condes',
    sector: 'residencial',
    status: 'new',
    priority: 'medium',
    source: 'web_contacto',
    value: 1_500_000,
    monthly_value: 0,
    created_at: `${baseDate}13`,
    updated_at: `${baseDate}13`,
    expected_close: '2026-08-20',
    assigned_to: 'U003',
    owner_email: 'carlos.diaz@guardman.cl',
    message: 'Escolta personal para ejecutivo 5 días/semana.',
    tags: ['escolta', 'ejecutivo'],
  },
  {
    id: 'L012',
    name: 'Club Deportivo Atlas',
    email: 'gerencia@clubatlas.cl',
    phone: '+56930000025',
    company: 'Club Deportivo Atlas',
    service: 'seguridad-eventos',
    location: 'las-condes',
    sector: 'deportivo',
    status: 'new',
    priority: 'high',
    source: 'web_cotizacion',
    value: 2_800_000,
    monthly_value: 0,
    created_at: `${baseDate}13`,
    updated_at: `${baseDate}13`,
    expected_close: '2026-08-10',
    assigned_to: 'U002',
    owner_email: 'maria.soto@guardman.cl',
    message: 'Partido profesional, 3000 espectadores estimados. Requiere 20 guardias + control de accesos + vallas perimetrales.',
    property_type: 'Estadio / Recinto deportivo',
    tags: ['deportivo', 'evento-masivo'],
  },
  {
    id: 'L013',
    name: 'Edificio Corporativo Parque Arauco',
    email: 'facilities@edifparque.cl',
    phone: '+56930000026',
    company: 'Inmobiliaria Parque Arauco',
    service: 'aseo',
    location: 'las-condes',
    sector: 'comercial',
    status: 'new',
    priority: 'medium',
    source: 'web_cotizacion',
    value: 1_650_000,
    monthly_value: 1_650_000,
    created_at: `${baseDate}13`,
    updated_at: `${baseDate}13`,
    expected_close: '2026-08-15',
    assigned_to: 'U003',
    owner_email: 'carlos.diaz@guardman.cl',
    message: 'Buscamos servicio de aseo diario nocturno para torre corporativa de 15 pisos (~12000 m²). Incluye baños, áreas comunes, hall, ascensores.',
    property_type: 'Edificio corporativo',
    tags: ['aseo', 'nocturno', 'corporativo'],
  },
];

export const crmActivities: Activity[] = [
  { id: 'A001', lead_id: 'L001', type: 'created', title: 'Lead creado desde formulario de cotización', at: `${baseDate}10T09:15:00`, by: 'system' },
  { id: 'A002', lead_id: 'L001', type: 'assigned', title: 'Asignado a María Soto', at: `${baseDate}10T09:20:00`, by: 'admin@guardman.cl' },
  { id: 'A003', lead_id: 'L002', type: 'call', title: 'Llamada inicial — 12 min', description: 'Contacté a Carlos, necesita cotización detallada para 16 cámaras.', at: `${baseDate}12T11:00:00`, by: 'carlos.diaz@guardman.cl' },
  { id: 'A004', lead_id: 'L002', type: 'status_changed', title: 'Nuevo → Contactado', at: `${baseDate}12T11:05:00`, by: 'carlos.diaz@guardman.cl' },
  { id: 'A005', lead_id: 'L003', type: 'visit', title: 'Visita técnica realizada — Torre Andes', description: 'Edificio de 18 pisos. Recomendación: 4 torniquetes + biométricos en lobby.', at: `${baseDate}11T15:30:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A006', lead_id: 'L003', type: 'note', title: 'Cliente compara 3 proveedores. Tiene presupuesto aprobado.', at: `${baseDate}11T16:00:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A007', lead_id: 'L004', type: 'quote_sent', title: 'Cotización #COT-2026-014 enviada', description: '8 guardias evento corporativo + control accesos. Total $3.500.000.', at: `${baseDate}11T17:30:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A008', lead_id: 'L005', type: 'meeting', title: 'Reunión con Gerencia de Operaciones', description: 'Negociando precio y condiciones. Piden 5% descuento por contrato anual.', at: `${baseDate}12T10:00:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A009', lead_id: 'L006', type: 'quote_accepted', title: 'Cotización aceptada ✓', description: 'Firma de contrato mensual $5.200.000.', at: `${baseDate}05T14:00:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A010', lead_id: 'L006', type: 'status_changed', title: 'Negociación → Ganado', at: `${baseDate}05T14:05:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A011', lead_id: 'L008', type: 'status_changed', title: 'Negociación → Perdido', description: 'Seleccionaron otra empresa por precio.', at: `${baseDate}02T11:00:00`, by: 'patricia.rivas@guardman.cl' },
  { id: 'A012', lead_id: 'L010', type: 'visit', title: 'Visita técnica — Aeropuerto del Norte', description: 'Evaluación de 120 cámaras existentes. Tiempo estimado retrofit: 6 semanas.', at: `${baseDate}11T09:00:00`, by: 'maria.soto@guardman.cl' },
  { id: 'A013', lead_id: 'L012', type: 'created', title: 'Lead creado desde formulario de cotización', at: `${baseDate}13T08:45:00`, by: 'system' },
  { id: 'A014', lead_id: 'L013', type: 'created', title: 'Lead creado desde formulario de cotización', at: `${baseDate}13T10:20:00`, by: 'system' },
];

export const crmTasks: Task[] = [
  { id: 'T001', lead_id: 'L001', type: 'call', title: 'Llamar a María González para confirmar requerimientos', due_at: `${baseDate}13T15:00:00`, status: 'pending', assigned_to: 'U002', created_at: `${baseDate}10T09:20:00` },
  { id: 'T002', lead_id: 'L001', type: 'visit', title: 'Agendar visita técnica al condominio', due_at: `${baseDate}15T10:00:00`, status: 'pending', assigned_to: 'U002', created_at: `${baseDate}10T09:20:00` },
  { id: 'T003', lead_id: 'L002', type: 'follow_up', title: 'Enviar catálogo de cámaras IP recomendadas', due_at: `${baseDate}13T17:00:00`, status: 'in_progress', assigned_to: 'U003', created_at: `${baseDate}12T11:10:00` },
  { id: 'T004', lead_id: 'L004', type: 'follow_up', title: 'Confirmar aceptación de cotización con gerencia', due_at: `${baseDate}18T12:00:00`, status: 'pending', assigned_to: 'U002', created_at: `${baseDate}11T17:35:00` },
  { id: 'T005', lead_id: 'L005', type: 'meeting', title: 'Reunión final con director médico', due_at: `${baseDate}20T11:00:00`, status: 'pending', assigned_to: 'U002', created_at: `${baseDate}12T10:30:00` },
  { id: 'T006', lead_id: 'L010', type: 'document', title: 'Preparar propuesta técnica retrofit 120 cámaras', due_at: `${baseDate}17T18:00:00`, status: 'in_progress', assigned_to: 'U002', created_at: `${baseDate}11T12:00:00` },
  { id: 'T007', lead_id: 'L011', type: 'call', title: 'Contactar a Julio Martinez — escolta ejecutivo', due_at: `${baseDate}14T10:00:00`, status: 'pending', assigned_to: 'U003', created_at: `${baseDate}13T09:00:00` },
  { id: 'T008', lead_id: 'L012', type: 'call', title: 'Contactar al Club Deportivo Atlas — urgente', due_at: `${baseDate}14T09:30:00`, status: 'pending', assigned_to: 'U002', created_at: `${baseDate}13T08:50:00` },
  { id: 'T009', lead_id: 'L013', type: 'visit', title: 'Agendar visita a Edificio Parque Arauco para evaluación', due_at: `${baseDate}16T11:00:00`, status: 'pending', assigned_to: 'U003', created_at: `${baseDate}13T10:30:00` },
];

export const crmNotes: Note[] = [
  { id: 'N001', lead_id: 'L003', body: 'Cliente tiene presupuesto aprobado de $2.5M. Comparando 3 proveedores. Nuestra ventaja: certificación OS-10 + centro de monitoreo propio.', at: `${baseDate}11T16:00:00`, by: 'maria.soto@guardman.cl' },
  { id: 'N002', lead_id: 'L005', body: 'Clínica quiere reemplazar proveedor actual por problemas de respuesta. Piden 12 guardias 24/7 + botón de pánico. Negociando 5% descuento por contrato anual.', at: `${baseDate}12T10:30:00`, by: 'maria.soto@guardman.cl' },
  { id: 'N003', lead_id: 'L002', body: 'Edificio corporativo de 12 pisos en Huechuraba. 16 cámaras IP + NVR 30 días. Competencia cotizó $980k, necesitamos bajar precio o agregar valor.', at: `${baseDate}12T11:15:00`, by: 'carlos.diaz@guardman.cl' },
  { id: 'N004', lead_id: 'L010', body: 'Retrofit complejo: 120 cámaras analógicas existentes a reemplazar por IP. Tiempo estimado 6 semanas. Coordinar con ops para handover.', at: `${baseDate}11T11:00:00`, by: 'maria.soto@guardman.cl' },
  { id: 'N005', lead_id: 'L012', body: 'Club Atlas tiene partido el 20/08 contra Colo-Colo. Necesitan cotización urgente. Competencia: Prosegur. Nuestra ventaja: precio + flexibilidad.', at: `${baseDate}13T08:55:00`, by: 'system' },
];

export const crmCommunications: Communication[] = [
  { id: 'C001', lead_id: 'L002', channel: 'call', direction: 'outbound', subject: 'Llamada inicial', summary: 'Confirmé requerimientos: 16 cámaras IP, NVR 30 días, monitoreo remoto.', at: `${baseDate}12T11:00:00`, by: 'carlos.diaz@guardman.cl', duration_min: 12 },
  { id: 'C002', lead_id: 'L003', channel: 'visit', direction: 'outbound', subject: 'Visita técnica — Torre Andes', summary: 'Evalué edificio de 18 pisos. Recomendé 4 torniquetes + biométricos + cámaras en lobby.', at: `${baseDate}11T15:30:00`, by: 'maria.soto@guardman.cl', duration_min: 90 },
  { id: 'C003', lead_id: 'L005', channel: 'meeting', direction: 'inbound', subject: 'Reunión con Gerencia de Operaciones', summary: 'Negociación de precio y condiciones. Piden 5% descuento por contrato anual. Aceptamos.', at: `${baseDate}12T10:00:00`, by: 'maria.soto@guardman.cl', duration_min: 60 },
  { id: 'C004', lead_id: 'L004', channel: 'email', direction: 'outbound', subject: 'Cotización #COT-2026-014', summary: 'Envié cotización formal con 8 guardias + control de accesos para evento.', at: `${baseDate}11T17:30:00`, by: 'maria.soto@guardman.cl' },
  { id: 'C005', lead_id: 'L010', channel: 'visit', direction: 'outbound', subject: 'Visita técnica — Aeropuerto del Norte', summary: 'Evaluación completa de 120 cámaras analógicas. Propuesta de retrofit a IP.', at: `${baseDate}11T09:00:00`, by: 'maria.soto@guardman.cl', duration_min: 180 },
  { id: 'C006', lead_id: 'L006', channel: 'email', direction: 'inbound', subject: 'Aceptación de cotización', summary: 'Mall Premium acepta cotización y solicita contrato mensual.', at: `${baseDate}05T13:30:00`, by: 'maria.soto@guardman.cl' },
];

// ────────────────────────────────────────────────────────────────
// DERIVED DATA
// ────────────────────────────────────────────────────────────────

export function buildPipeline(leads: Lead[]): PipelineColumn[] {
  return STATUS_FLOW.map((status) => {
    const colLeads = leads.filter((l) => l.status === status);
    return {
      status,
      label: STATUS_LABELS[status],
      color: STATUS_COLORS[status],
      leads: colLeads,
      total_value: colLeads.reduce((sum, l) => sum + l.value, 0),
    };
  });
}

export function buildDashboard(leads: Lead[], tasks: Task[]): Dashboard {
  const last30 = leads.filter((l) => l.created_at >= '2026-06-13');
  const last7 = leads.filter((l) => l.created_at >= `${baseDate}06`);
  const won = leads.filter((l) => l.status === 'won');
  const lost = leads.filter((l) => l.status === 'lost');
  const open = leads.filter((l) => !['won', 'lost'].includes(l.status));

  return {
    kpis: {
      new_leads_30d: last30.length,
      new_leads_7d: last7.length,
      pipeline_value: open.reduce((sum, l) => sum + l.value, 0),
      won_this_month: won.length,
      lost_this_month: lost.length,
      conversion_rate: won.length + lost.length > 0
        ? Math.round((won.length / (won.length + lost.length)) * 100)
        : 0,
      avg_deal_size: won.length > 0
        ? Math.round(won.reduce((s, l) => s + l.value, 0) / won.length)
        : 0,
      avg_close_days: 18,
    },
    funnel: STATUS_FLOW.map((status) => ({
      stage: status,
      label: STATUS_LABELS[status],
      count: leads.filter((l) => l.status === status).length,
      value: leads.filter((l) => l.status === status).reduce((s, l) => s + l.value, 0),
      color: STATUS_COLORS[status],
    })),
    today_agenda: [
      { time: '09:30', title: 'Visita técnica — Condominio Las Vertientes', type: 'visit', lead_id: 'L001' },
      { time: '11:00', title: 'Llamada seguimiento — Grupo Delta', type: 'call', lead_id: 'L002' },
      { time: '15:00', title: 'Reunión cotización — Inmobiliaria Andes', type: 'meeting', lead_id: 'L003' },
    ],
    recent_activity: [
      { id: '1', text: 'Lead convertido: Mall Premium — $5.2M/mes', when: 'hace 2h', type: 'quote_accepted' },
      { id: '2', text: 'Cotización enviada: Hotel Plaza', when: 'hace 4h', type: 'quote_sent' },
      { id: '3', text: 'Visita técnica agendada: Aeropuerto del Norte', when: 'ayer', type: 'visit' },
      { id: '4', text: 'Nuevo lead web: Club Deportivo Atlas (urgente)', when: 'hace 3h', type: 'created' },
      { id: '5', text: 'Nuevo lead web: Edificio Parque Arauco (aseo)', when: 'hace 1h', type: 'created' },
    ],
    upcoming_tasks: tasks
      .filter((t) => t.status === 'pending' || t.status === 'in_progress')
      .slice(0, 5)
      .map((t) => {
        const lead = leads.find((l) => l.id === t.lead_id);
        return {
          id: t.id,
          title: t.title,
          due_at: t.due_at,
          lead_name: lead?.name ?? 'Sin lead',
          type: t.type,
        };
      }),
    source_breakdown: Object.entries(
      leads.reduce<Record<string, { count: number; value: number }>>((acc, l) => {
        if (!acc[l.source]) acc[l.source] = { count: 0, value: 0 };
        acc[l.source].count++;
        acc[l.source].value += l.value;
        return acc;
      }, {}),
    ).map(([source, data]) => ({
      source: source as LeadSource,
      label: SOURCE_LABELS[source as LeadSource],
      count: data.count,
      value: data.value,
    })),
    top_locations: Object.entries(
      leads.reduce<Record<string, { count: number; value: number }>>((acc, l) => {
        if (!acc[l.location]) acc[l.location] = { count: 0, value: 0 };
        acc[l.location].count++;
        acc[l.location].value += l.value;
        return acc;
      }, {}),
    )
      .map(([location, data]) => ({ location, count: data.count, value: data.value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5),
    top_services: Object.entries(
      leads.reduce<Record<string, { count: number; value: number }>>((acc, l) => {
        if (!acc[l.service]) acc[l.service] = { count: 0, value: 0 };
        acc[l.service].count++;
        acc[l.service].value += l.value;
        return acc;
      }, {}),
    )
      .map(([service, data]) => ({ service, count: data.count, value: data.value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5),
    weekly_chart: [
      { day: 'Lun', leads: 4, won: 1 },
      { day: 'Mar', leads: 6, won: 2 },
      { day: 'Mié', leads: 3, won: 0 },
      { day: 'Jue', leads: 8, won: 3 },
      { day: 'Vie', leads: 5, won: 1 },
      { day: 'Sáb', leads: 2, won: 0 },
      { day: 'Dom', leads: 1, won: 0 },
    ],
  };
}

export function leadTimeline(lead_id: string): Activity[] {
  return crmActivities
    .filter((a) => a.lead_id === lead_id)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function leadTasks(lead_id: string): Task[] {
  return crmTasks.filter((t) => t.lead_id === lead_id);
}

export function leadNotes(lead_id: string): Note[] {
  return crmNotes.filter((n) => n.lead_id === lead_id);
}

export function leadCommunications(lead_id: string): Communication[] {
  return crmCommunications.filter((c) => c.lead_id === lead_id);
}

export function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function relativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'ahora';
    if (min < 60) return `hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `hace ${h}h`;
    const d = Math.floor(h / 24);
    if (d < 30) return `hace ${d}d`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}
