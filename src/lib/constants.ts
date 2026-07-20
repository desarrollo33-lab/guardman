// ════════════════════════════════════════════════════════════════
// GuardMan - Constantes unificadas del sitio y el admin.
// Reemplaza a `src/types/index.ts` y `src/ssr/site-data.ts`.
// Una sola fuente de verdad.
// ════════════════════════════════════════════════════════════════

export const SITE = {
  NAME: 'GuardMan Chile',
  LEGAL_NAME: 'GuardMan Chile',
  TAGLINE: 'Seguridad Privada OS-10 - 10+ años protegiendo empresas y residencias',
  DESCRIPTION:
    'GuardMan Chile - Seguridad privada con certificación OS-10. Guardias, CCTV, control de accesos, PPI (Protección de Personas Importantes), monitoreo 24/7, Guardpod y Ajax Systems. Cobertura en 14 comunas de la Región Metropolitana y zona de Valparaíso.',
  URL: import.meta.env.PUBLIC_SITE_URL ?? 'https://guardman.cl',
  API_URL: import.meta.env.PUBLIC_API_URL ?? 'https://guardman.oficinadesarrollo33.workers.dev',
  PHONE: '+56 9 300 000 10',
  PHONE_TEL: '+56930000010',
  EMAIL_INFO: 'info@guardman.cl',
  EMAIL_VENTAS: 'ventas@guardman.cl',
  ADDRESS: 'Av. Américo Vespucio Norte 1980, Providencia, Santiago, Chile',
  RUT: '77.123.456-7',
  FOUNDED_YEAR: 2014,
  INSTAGRAM_URL: 'https://www.instagram.com/grupo_guardman',
  YOUTUBE_URL: 'https://youtu.be/mqpLsKrwjAI',
  CERTIFICATIONS: [
    'Certificación OS-10 vigente verificada por Carabineros de Chile',
    'Capacitación continua en protocolos de seguridad y emergencias',
    'Centro de monitoreo propio 24/7 con operadores especializados',
    '10+ años de experiencia protegiendo empresas y residencias',
  ],
} as const;

export const STATS = {
  GUARDIAS: '200+',
  COMUNAS: '14',
  ANOS: '10+',
} as const;

export const SERVICE_NAMES: Record<string, string> = {
  'guardias-de-seguridad': 'Guardias de Seguridad',
  'cctv-videovigilancia': 'CCTV Videovigilancia',
  'control-de-accesos': 'Control de Accesos',
  'escoltas-privados': 'PPI (Protección de Personas Importantes)',
  'monitoreo-24-7': 'Monitoreo 24/7',
  'seguridad-eventos': 'Seguridad Eventos',
  'seguridad-deportiva': 'Seguridad Deportiva',
  'seguridad-industrial': 'Seguridad Industrial',
  'auditoria-seguridad': 'Auditoría de Seguridad',
  'guard-pod': 'Guardpod',
  aseo: 'Aseo',
};

export const SERVICE_SLUGS = Object.keys(SERVICE_NAMES);

export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'guardias-de-seguridad': 'Guardias certificados OS-10 con verificación de antecedentes, rondas preventivas y supervisión nocturna para empresas y condominios en 14 comunas.',
  'cctv-videovigilancia': 'Cámaras IP HD/4K con visión nocturna, grabación NVR y monitoreo remoto desde nuestro centro de control propio.',
  'control-de-accesos': 'Lectores biométricos, códigos QR y torniquetes con registro digital de visitantes para edificios corporativos.',
  'escoltas-privados': 'PPI (Protección de Personas Importantes) con escoltas certificados OS-10, evaluación previa de riesgos y vehículos equipados para protección ejecutiva y traslado de valores.',
  'monitoreo-24-7': 'Central de vigilancia propia con redundancia de sistemas, análisis en tiempo real y coordinación directa con Carabineros.',
  'seguridad-eventos': 'Planificación de seguridad personalizada para eventos corporativos, sociales y masivos con control de accesos y aforo.',
  'seguridad-deportiva': 'Cobertura de seguridad OS-10 para recintos y eventos deportivos: control de acceso por tribuna, vigilancia perimetral, manejo de hinchadas y coordinación con Carabineros.',
  'seguridad-industrial': 'Vigilancia perimetral con rondas programadas y control de carga para plantas, bodegas y centros de distribución.',
  'auditoria-seguridad': 'Inspección en terreno de perímetros, CCTV, alarmas e iluminación con informe ejecutivo y plan de acción priorizado.',
  'guard-pod': 'Sistema autónomo de vigilancia con cámaras PTZ 360°, detección de intrusos por IA y monitoreo 24/7 sin infraestructura eléctrica.',
  aseo: 'Servicio de aseo con personal uniformado, productos certificados y planes diurnos, nocturnos o de fin de semana.',
};

export const SECTOR_NAMES: Record<string, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  industrial: 'Industrial',
  construccion: 'Construcción',
  educacion: 'Educación',
  eventos: 'Eventos',
  hoteleria: 'Hotelería',
  salud: 'Salud',
  automotriz: 'Automotriz',
  deportivo: 'Deportivo',
};

export const SECTOR_DESCRIPTIONS: Record<string, string> = {
  residencial: 'Protección 24/7 para condominios, edificios y comunidades con guardias OS-10 y control de accesos.',
  comercial: 'Seguridad para tiendas, locales y centros comerciales con prevención de hurto y control de aforo.',
  industrial: 'Vigilancia perimetral y control de carga para plantas manufactureras, bodegas y centros logísticos.',
  construccion: 'Resguardo de faenas, herramientas y materiales con rondas preventivas y unidades GuardPod.',
  educacion: 'Seguridad para colegios, universidades y centros de formación con protocolos de emergencia escolar.',
  eventos: 'Cobertura de seguridad para eventos corporativos, sociales y masivos con gestión de accesos y aforo.',
  hoteleria: 'Protección discreta para hoteles y resorts con control de acceso a zonas de huéspedes y áreas comunes.',
  salud: 'Seguridad para clínicas, hospitales y laboratorios con control de acceso en áreas críticas y urgencias.',
  automotriz: 'Vigilancia para concesionarios, talleres y plantas automotrices con control de llaves y unidades.',
  deportivo: 'Seguridad para recintos deportivos, clubes y eventos con control de multitudes y resguardo de delegaciones.',
};

export const SECTOR_TO_SERVICE: Record<string, string> = {
  comercial: 'guardias-de-seguridad',
  construccion: 'seguridad-industrial',
  educacion: 'guardias-de-seguridad',
  eventos: 'seguridad-eventos',
  industrial: 'seguridad-industrial',
  residencial: 'guardias-de-seguridad',
  salud: 'guardias-de-seguridad',
};

// Ubicaciones con coordenadas exactas (para el mapa Leaflet)
export interface Location {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  zone: 'Oriente' | 'Centro' | 'Norte' | 'Sur' | 'Poniente' | 'Valparaíso';
}

export const LOCATIONS: Location[] = [
  { slug: 'santiago-centro', name: 'Santiago Centro', lat: -33.4378, lng: -70.6505, zone: 'Centro' },
  { slug: 'huechuraba', name: 'Huechuraba', lat: -33.3586, lng: -70.6773, zone: 'Norte' },
  { slug: 'lampa', name: 'Lampa', lat: -33.2786, lng: -70.8764, zone: 'Norte' },
  { slug: 'quilicura', name: 'Quilicura', lat: -33.3586, lng: -70.7406, zone: 'Norte' },
  { slug: 'la-reina', name: 'La Reina', lat: -33.4473, lng: -70.5459, zone: 'Oriente' },
  { slug: 'las-condes', name: 'Las Condes', lat: -33.4189, lng: -70.5464, zone: 'Oriente' },
  { slug: 'lo-barnechea', name: 'Lo Barnechea', lat: -33.3536, lng: -70.5219, zone: 'Oriente' },
  { slug: 'vitacura', name: 'Vitacura', lat: -33.4028, lng: -70.5969, zone: 'Oriente' },
  { slug: 'conchali', name: 'Conchalí', lat: -33.3917, lng: -70.6658, zone: 'Poniente' },
  { slug: 'pudahuel', name: 'Pudahuel', lat: -33.4364, lng: -70.7406, zone: 'Poniente' },
  { slug: 'renca', name: 'Renca', lat: -33.4056, lng: -70.6969, zone: 'Poniente' },
  { slug: 'la-pintana', name: 'La Pintana', lat: -33.5836, lng: -70.6347, zone: 'Sur' },
  { slug: 'los-andes', name: 'Los Andes', lat: -32.8339, lng: -70.5981, zone: 'Valparaíso' },
  { slug: 'san-felipe', name: 'San Felipe', lat: -32.7483, lng: -70.7244, zone: 'Valparaíso' },
];

export const LOCATION_SLUGS = LOCATIONS.map((l) => l.slug) as readonly string[];
export const LOCATION_NAMES: Record<string, string> = Object.fromEntries(
  LOCATIONS.map((l) => [l.slug, l.name]),
);

export const ZONE_CONTEXT: Record<string, string> = {
  'las-condes':
    'comuna del sector oriente con alta concentración de embajadas, oficinas corporativas, clínicas privadas y centros comerciales como Parque Arauco y Costanera Center',
  vitacura:
    'comuna residencial de alto valor con parques como Bicentenario y Juan Pablo II, sedes diplomáticas y centros de diseño y arquitectura',
  'santiago-centro':
    'centro político y comercial de Chile con Palacio de La Moneda, Barrio Lastarria, universidades y alta densidad de oficinas públicas y privadas',
  huechuraba:
    'comuna del sector norte con centros comerciales como Espacio Urbano y Ciudad Empresarial, sede de empresas tecnológicas y conjuntos habitacionales',
  'la-reina':
    'comuna residencial del sector oriente con parques amplios, la Universidad Academia de Humanismo Cristiano y un perfil familiar tranquilo',
  'lo-barnechea':
    'comuna del sector oriente con propiedades de gran superficie, centros de ski en el Cajón del Maipo, colegios internacionales y áreas rurales periurbanas',
  conchali:
    'comuna del sector poniente con alta densidad poblacional, mercado mayorista, industria liviana y conectividad con Autopista Central',
  pudahuel:
    'comuna del sector poniente con el Aeropuerto Internacional SCL, zonas industriales, bodegas logísticas y el Parque Intercomunal',
  renca:
    'comuna del sector poniente con parques industriales, la Refinería de ENAP, zonas residenciales en consolidación y proyectos de renovación urbana',
  quilicura:
    'comuna del sector norte con parques industriales, centros de distribución logística, Mallplaza Norte y alta actividad de transporte de carga',
  lampa:
    'comuna del sector norte en expansión con parques industriales, bodegas de distribución, el Mall Arauco y proyectos inmobiliarios de vivienda nueva',
  'la-pintana':
    'comuna del sector sur con predominancia residencial, el Parque Mapocho, centros de formación técnica y creciente actividad comercial',
  'los-andes':
    'ciudad de la Región de Valparaíso con tradición vitivinícola, la ruta hacia el paso Los Libertadores, industrias agropecuarias y desarrollo turístico cordillerano',
  'san-felipe':
    'ciudad capital de la Provincia de Aconcagua con viñedos, huertos frutales, comercio local y creciente demanda de seguridad para propiedades agrícolas y urbanas',
};

export const ZONE_COLORS: Record<string, string> = {
  Oriente: 'red',
  Centro: 'blue',
  Norte: 'yellow',
  Sur: 'blue',
  Poniente: 'purple',
  Occidente: 'purple',
  Valparaíso: 'green',
};

export const ZONE_DOT_COLORS: Record<string, string> = {
  red: '#EF4444',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  green: '#10B981',
};

export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/ubicaciones', label: 'Ubicaciones' },
  { href: '/sectores', label: 'Sectores' },
  { href: '/guard-pod', label: 'Guardpod' },
  { href: '/ajax-systems', label: 'Ajax Systems' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/canal-de-denuncias', label: 'Canal de Denuncias' },
  { href: '/contacto', label: 'Contacto' },
];

// Canal de Denuncias (v4.1) - ruta pública + categorías soportadas.
export const DENUNCIA_PATH = '/canal-de-denuncias';
export const DENUNCIA_CATEGORIES = [
  { slug: 'codigo_conducta', label: 'Infracción al código de conducta' },
  { slug: 'delito', label: 'Potencial delito (robo, fraude, corrupción)' },
  { slug: 'acoso', label: 'Acoso laboral o sexual' },
  { slug: 'seguridad', label: 'Falla de seguridad o protocolo' },
  { slug: 'otro', label: 'Otro' },
] as const;
export type DenunciaCategorySlug = (typeof DENUNCIA_CATEGORIES)[number]['slug'];

export const DENUNCIA_RELACIONES = [
  { slug: 'trabajador', label: 'Trabajador de GuardMan' },
  { slug: 'cliente', label: 'Cliente' },
  { slug: 'proveedor', label: 'Proveedor o contratista' },
  { slug: 'externo', label: 'Externo (visitante, transeúnte)' },
  { slug: 'anonimo', label: 'Prefiero no decirlo' },
] as const;

// Nav admin v4.1 - CRM + Canal de Denuncias.
export const ADMIN_NAV_GROUPS = [
  {
    id: 'crm',
    label: 'CRM',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: 'gauge' },
      { id: 'inbox', label: 'Bandeja de Leads', href: '/admin/inbox', icon: 'inbox' },
      { id: 'pipeline', label: 'Pipeline', href: '/admin/pipeline', icon: 'pipeline' },
      { id: 'leads', label: 'Todos los Leads', href: '/admin/leads', icon: 'users' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    items: [
      { id: 'denuncias', label: 'Canal de Denuncias', href: '/admin/denuncias', icon: 'shield' },
    ],
  },
] as const;

// Compat con AdminSidebar legacy (ya no se usa, mantenido para refs externas)
export const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: 'gauge' },
  { id: 'inbox', label: 'Bandeja', href: '/admin/inbox', icon: 'inbox' },
  { id: 'pipeline', label: 'Pipeline', href: '/admin/pipeline', icon: 'pipeline' },
  { id: 'leads', label: 'Leads', href: '/admin/leads', icon: 'users' },
] as const;

export const API_TIMEOUT_MS = 15_000;

// ────────────────────────────────────────────────────────────────
// SEO + GEO metadata (v3.0)
// ────────────────────────────────────────────────────────────────

export const GEO = {
  // Coordenadas oficina principal (Providencia)
  lat: -33.4189,
  lng: -70.6068,
  // ISO 3166-2 cl-region + comuna
  region: 'CL-RM',
  regionName: 'Región Metropolitana de Santiago',
  country: 'Chile',
  countryCode: 'CL',
  city: 'Santiago',
  placeName: 'Santiago, Providencia, Chile',
  icbm: '-33.4189, -70.6068',
  // Box de cobertura aproximada RM
  coverageBox: {
    north: -33.20,
    south: -33.65,
    east: -70.40,
    west: -70.90,
  },
} as const;

export const HREFLANG = [
  { hreflang: 'es-cl', href: '/' },
  { hreflang: 'es', href: '/' },
  { hreflang: 'es-419', href: '/' },
  { hreflang: 'x-default', href: '/' },
] as const;

export const SOCIAL_PROFILES = [
  SITE.INSTAGRAM_URL,
  SITE.YOUTUBE_URL,
] as const;

// Versión del bundle (para cache-busting).
export const BUNDLE_VERSION = 'v5.2.0';
