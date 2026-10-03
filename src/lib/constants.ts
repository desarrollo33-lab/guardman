// ════════════════════════════════════════════════════════════════
// GuardMan - Constantes unificadas del sitio y el admin.
// Reemplaza a `src/types/index.ts` y `src/ssr/site-data.ts`.
// Una sola fuente de verdad.
// ════════════════════════════════════════════════════════════════

export const SITE = {
  NAME: 'GuardMan Chile',
  LEGAL_NAME: 'GuardMan Chile',
  TAGLINE: 'Seguridad Privada OS-10 - 10+ años protegiendo empresas y residencias',
  // Sin `DESCRIPTION` aquí a propósito: era una cadena escrita a mano con
  // "14 comunas de la Región Metropolitana" (la RM tiene 12) y servía como
  // `description` por defecto en BaseLayout, así que contaminaba el meta de
  // toda página que no definía el suyo. Se usa `SITE_DESCRIPTION`, derivado de
  // la cobertura real, declarado más abajo en este archivo.
  URL: import.meta.env.PUBLIC_SITE_URL ?? 'https://guardman.cl',
  // Login / refresh / logout viven en este mismo worker (same-origin).
  // Fallback cadena vacía = `${apiUrl}/api/login` se vuelve `/api/login`
  // (ruta relativa, sin CORS, sin CSP extra).
  API_URL: import.meta.env.PUBLIC_API_URL ?? '',
  PHONE: '+56 9 300 000 10',
  PHONE_TEL: '+56930000010',
  EMAIL_INFO: 'info@guardman.cl',
  EMAIL_VENTAS: 'info@guardman.cl',
  ADDRESS: 'Av. Américo Vespucio 1940, Oficina 301-01, Núcleo Vespucio',
  ADDRESS_LOCALITY: 'Conchalí',
  ADDRESS_REGION: 'Región Metropolitana',
  ADDRESS_POSTAL_CODE: '8560027',
  ADDRESS_COUNTRY: 'CL',
  // RUT real. Antes era '77.123.456-7', un placeholder inventado que se
  // publicaba en /terminos (2 veces) y /privacidad (1 vez): un identificador
  // tributario falso en páginas legales. Confirmado por el cliente que era
  // placeholder. OJO: 76.437.095-3 viene de los datos maestros del brief
  // (inicio 03/11/14, coherente con la fundación de 2014). Verificar contra
  // la documentación legal del cliente antes de cualquier uso que no sea
  // este. Si cambia, cambia acá y sale en las tres páginas.
  RUT: '76.437.095-3',
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

// `STATS` se eliminó (2026-10-03): no lo renderizaba nada y su `COMUNAS: '14'`
// ya era falso. Las cifras que sí se publican salen de COVERAGE_TOTAL.

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
//
// `qid` = Wikidata QID de la COMUNA (no de la ciudad ni de la estación de
// metro). Verificado uno por uno contra la API de Wikidata el 2026-10-01:
// los 14 devuelven P31=Q1840161 ("comuna de Chile") y son 14 IDs distintos.
// La regla de oro: `qid` se escribe a mano DESPUÉS de verificar; nunca se
// deriva de otra variable (un `slug.length * n` anterior produjo Q56 en cuatro
// comunas distintas, que es indistinguible para un modelo).
export interface Location {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  zone: 'Oriente' | 'Centro' | 'Norte' | 'Sur' | 'Poniente' | 'Valparaíso';
  /** Región administrativa: RM = Región Metropolitana, VS = Valparaíso. */
  region: 'RM' | 'VS';
  /** Wikidata QID verificado de la comuna. */
  qid: string;
}

export const LOCATIONS: Location[] = [
  { slug: 'santiago-centro', name: 'Santiago Centro', lat: -33.4378, lng: -70.6505, zone: 'Centro', region: 'RM', qid: 'Q188002' },
  { slug: 'huechuraba', name: 'Huechuraba', lat: -33.3586, lng: -70.6773, zone: 'Norte', region: 'RM', qid: 'Q14433' },
  { slug: 'lampa', name: 'Lampa', lat: -33.2786, lng: -70.8764, zone: 'Norte', region: 'RM', qid: 'Q14477' },
  { slug: 'quilicura', name: 'Quilicura', lat: -33.3586, lng: -70.7406, zone: 'Norte', region: 'RM', qid: 'Q51612' },
  { slug: 'la-reina', name: 'La Reina', lat: -33.4473, lng: -70.5459, zone: 'Oriente', region: 'RM', qid: 'Q14466' },
  { slug: 'las-condes', name: 'Las Condes', lat: -33.4189, lng: -70.5464, zone: 'Oriente', region: 'RM', qid: 'Q14484' },
  { slug: 'providencia', name: 'Providencia', lat: -33.4362, lng: -70.6090, zone: 'Oriente', region: 'RM', qid: 'Q51587' },
  { slug: 'nunoa', name: 'Ñuñoa', lat: -33.4593, lng: -70.6003, zone: 'Oriente', region: 'RM', qid: 'Q201076' },
  { slug: 'lo-barnechea', name: 'Lo Barnechea', lat: -33.3536, lng: -70.5219, zone: 'Oriente', region: 'RM', qid: 'Q14502' },
  { slug: 'vitacura', name: 'Vitacura', lat: -33.4028, lng: -70.5969, zone: 'Oriente', region: 'RM', qid: 'Q201036' },
  { slug: 'conchali', name: 'Conchalí', lat: -33.3917, lng: -70.6658, zone: 'Poniente', region: 'RM', qid: 'Q3851' },
  { slug: 'pudahuel', name: 'Pudahuel', lat: -33.4364, lng: -70.7406, zone: 'Poniente', region: 'RM', qid: 'Q51591' },
  { slug: 'renca', name: 'Renca', lat: -33.4056, lng: -70.6969, zone: 'Poniente', region: 'RM', qid: 'Q56119' },
  { slug: 'la-pintana', name: 'La Pintana', lat: -33.5836, lng: -70.6347, zone: 'Sur', region: 'RM', qid: 'Q14464' },
  { slug: 'los-andes', name: 'Los Andes', lat: -32.8339, lng: -70.5981, zone: 'Valparaíso', region: 'VS', qid: 'Q23660195' },
  { slug: 'san-felipe', name: 'San Felipe', lat: -32.7483, lng: -70.7244, zone: 'Valparaíso', region: 'VS', qid: 'Q23660221' },
];

// ────────────────────────────────────────────────────────────────
// Cobertura — fuente única de verdad
//
// Las tres capas que exponen cobertura (copy visible, `areaServed` del
// JSON-LD y llms.txt) se derivan de acá. Si se edita una comuna, cambia
// en las tres. Contar ≠ 14 en llms.txt es imposible por construcción.
// ────────────────────────────────────────────────────────────────
export const COVERAGE_RM = LOCATIONS.filter((l) => l.region === 'RM');
export const COVERAGE_VS = LOCATIONS.filter((l) => l.region === 'VS');
export const COVERAGE_TOTAL = LOCATIONS.length;

/**
 * Trozos de cobertura para copy. Existen porque el patrón de bug que los
 * motivó (2026-10-02) fue escribir el número a mano en los templates: el
 * sitio decía "14 comunas: 12 en la RM y 2 en Valparaíso" cuando ya había
 * 16 (14 + 2). Doce páginas publicaban la cifra equivocada.
 *
 * Estos tres cubren los casos de uso reales y se actualizan solos. Si en
 * el futuro aparece una frase nueva, se agrega AQUÍ, no en el template.
 *
 * - COVERAGE_PHRASE_LONG:  "16 comunas: 14 en la RM y 2 en Valparaíso"
 * - COVERAGE_PHRASE_RM:    "14 comunas de la Región Metropolitana"
 * - COVERAGE_PHRASE_TOTAL: "16 comunas"
 */
export const COVERAGE_PHRASE_LONG =
  `${COVERAGE_TOTAL} comunas: ${COVERAGE_RM.length} en la Región Metropolitana ` +
  `y ${COVERAGE_VS.length} en Valparaíso`;

export const COVERAGE_PHRASE_RM =
  `${COVERAGE_RM.length} comunas de la Región Metropolitana`;

export const COVERAGE_PHRASE_TOTAL = `${COVERAGE_TOTAL} comunas`;

/** "Las Condes, Vitacura, ... y Lampa" — lista de la RM, para copy. */
export const RM_COMMUNES_LIST = COVERAGE_RM.map((l) => l.name).join(', ');

/** "Los Andes y San Felipe" — lista de Valparaíso, para copy. */
export const VS_COMMUNES_LIST = COVERAGE_VS.map((l) => l.name).join(' y ');

/**
 * Descripción corta de cada servicio. Va AQUÍ, y no junto a `SERVICE_NAMES`,
 * porque la primera entrada deriva el número de cobertura: antes de este
 * cambio la línea era un string fijo y por eso publicaba "14 comunas" cuando
 * eran 16. Declararla antes de `COVERAGE_TOTAL` la dejaría en TDZ y el módulo
 * no cargaría.
 */
export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'guardias-de-seguridad': `Guardias certificados OS-10 con verificación de antecedentes, rondas preventivas y supervisión nocturna para empresas y residencias en ${COVERAGE_TOTAL} comunas.`,
  'cctv-videovigilancia': 'Cámaras IP HD/4K con visión nocturna, grabación NVR y monitoreo remoto desde nuestro centro de control propio.',
  'control-de-accesos': 'Lectores biométricos, códigos QR y torniquetes con registro digital de visitantes para edificios corporativos.',
  'escoltas-privados': 'PPI (Protección de Personas Importantes) con escoltas certificados OS-10, evaluación previa de riesgos y vehículos equipados para protección ejecutiva y traslado de valores.',
  'monitoreo-24-7': 'Central de vigilancia propia con redundancia de sistemas, análisis en tiempo real y coordinación directa con Carabineros.',
  'seguridad-eventos': 'Planificación de seguridad personalizada para eventos corporativos, sociales y masivos con control de accesos y aforo.',
  'seguridad-deportiva': 'Cobertura de seguridad OS-10 para recintos y eventos deportivos: control de acceso por tribuna, vigilancia perimetral, manejo de hinchadas y coordinación con Carabineros.',
  'seguridad-industrial': 'Vigilancia perimetral con rondas programadas y control de carga para plantas, bodegas y centros de distribución.',
  'auditoria-seguridad': 'Inspección en terreno de perímetros, CCTV, alarmas e iluminación con informe ejecutivo y plan de acción priorizado.',
  'guard-pod': 'Sistema autónomo de vigilancia con cámaras 360°, detección de intrusos por IA y monitoreo 24/7 sin infraestructura eléctrica.',
  aseo: 'Servicio de aseo con personal uniformado, productos certificados y planes diurnos, nocturnos o de fin de semana.',
};

/**
 * Frase de cobertura única. Toda mención de cobertura en el sitio debe
 * salir de acá para que el número nunca contradiga a `areaServed`.
 */
export const COVERAGE_SENTENCE =
  `Operamos en ${COVERAGE_RM.length} comunas de la Región Metropolitana ` +
  `(${RM_COMMUNES_LIST}) y en ${COVERAGE_VS.length} de Valparaíso (${VS_COMMUNES_LIST}), ` +
  `${COVERAGE_TOTAL} comunas en total.`;

/**
 * Descripción canónica del sitio, derivada de la cobertura real.
 *
 * Sustituye al que fue `SITE.DESCRIPTION`, una cadena escrita a mano que decía
 * "14 comunas de la Región Metropolitana" cuando la RM tiene 12. Se usaba como
 * `description` por defecto en BaseLayout, así que toda página sin meta
 * description propia publicaba el número equivocado.
 *
 * Se eliminó la constante en vez de corregirla porque una descripción escrita
 * a mano es exactamente la forma de dato que vuelve a desincronizarse. El
 * guard que la vigilaba no servía: iba detrás de `import.meta.env.DEV`, y
 * `astro build` corre con DEV=false, o sea que nunca se ejecutó en el build
 * que produce producción.
 */
export const SITE_DESCRIPTION =
  'GuardMan Chile - Seguridad privada con certificación OS-10. Guardias, CCTV, control de accesos, ' +
  'PPI (Protección de Personas Importantes), monitoreo 24/7, Guardpod y Ajax Systems. ' +
  `Cobertura en ${COVERAGE_RM.length} comunas de la Región Metropolitana más ` +
  `${COVERAGE_VS.length} en Valparaíso (${COVERAGE_TOTAL} en total).`;

export const LOCATION_SLUGS = LOCATIONS.map((l) => l.slug) as readonly string[];
export const LOCATION_NAMES: Record<string, string> = Object.fromEntries(
  LOCATIONS.map((l) => [l.slug, l.name]),
);

export const ZONE_CONTEXT: Record<string, string> = {
  'las-condes':
    'comuna del sector oriente con alta concentración de embajadas, oficinas corporativas, clínicas privadas y centros comerciales como Parque Arauco y Costanera Center',
  providencia:
    'comuna del sector oriente con el Parque Bicentenario, el Costanera Center, el Barrio Italia y una alta concentración de oficinas, comercios y restaurantes a lo largo de Avenida Providencia',
  nunoa:
    'comuna del sector oriente con el Estadio Nacional y su parque deportivo, el Campus Islae de la Pontificia Universidad Católica, barrios residenciales consolidados y un sector de comercio local activo',
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

// Nav admin v5.5 - CRM + Compliance + Producto (GuardPod).
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
    id: 'producto',
    label: 'Producto',
    items: [
      { id: 'guardpod', label: 'Guardpod', href: '/admin/guardpod', icon: 'shield' },
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

export const API_TIMEOUT_MS = 15_000;

// ────────────────────────────────────────────────────────────────
// Asset versioning
// ────────────────────────────────────────────────────────────────
// Single source of truth para la versión de assets estáticos.
// Regla: si una URL lleva `?v=FONT_VERSION`, **todas las referencias**
// al mismo recurso deben usar el mismo valor — `<link rel="preload">`
// en BaseLayout, `@font-face { src:url(...) }` en public/styles/site.css,
// y cualquier llamada desde JS. Si solo cambia uno, el browser hace
// doble GET (689 KB de Inter por primera vista en vez de 344 KB).
// Bumpear cuando se regenera public/fonts/InterVariable.woff2.
// ────────────────────────────────────────────────────────────────
export const FONT_VERSION = '20260925';
/** URL completa del woff2 de Inter Variable con cache-bust. */
export const INTER_FONT_URL = `/fonts/InterVariable.woff2?v=${FONT_VERSION}`;

/**
 * Versión de las imágenes re-codificadas (soporte responsive + compresión).
 *
 * `/images/*` y `/videos/*` se sirven con `max-age=31536000, immutable`
 * (public/_headers). Re-codificar un archivo CONSERVANDO su nombre no cambia la
 * cache key: el edge sigue sirviendo el binario viejo hasta que expire el año.
 * Por eso toda referencia a una imagen re-codificada lleva `?v=${IMAGE_VERSION}`.
 *
 * Bumpear SOLO cuando cambian los bytes de alguna de esas imágenes, y siempre
 * en el mismo commit que el re-encode (scripts/reencode-images.mjs).
 */
export const IMAGE_VERSION = '20261002-2';

/**
 * Media type de los documentos markdown para agentes.
 *
 * `text/markdown` a secas está incompleto para ARD: el conformance tester de la
 * spec lo acepta como "standard discovery type" pero exige el parámetro
 * `profile`, y el validador de "Agent Discoverability" marca la entrada como
 * Low. Con el perfil, ambos dan limpio.
 *
 * El perfil declara para qué está escrito el documento, no qué género tiene:
 * estos son material de referencia que existe para que lo lean asistentes
 * (`llms.txt` nació justo para eso), que es lo que el perfil dice.
 *
 * Se usa en el manifiesto Y en el header Content-Type de los endpoints: el
 * header tiene que decir lo mismo que el manifiesto, o el consumidor recibe una
 * cosa y lee otra.
 */
export const ARD_MARKDOWN_TYPE = 'text/markdown; profile="urn:air:agent-skills"';


// ────────────────────────────────────────────────────────────────
// SEO + GEO metadata (v3.0)
// ────────────────────────────────────────────────────────────────

export const GEO = {
  // Coordenadas oficina principal (Núcleo Vespucio, Conchalí)
  // Aproximadas (±50m). Verificar con pin Google Maps si hace falta precisión quirúrgica.
  lat: -33.389,
  lng: -70.644,
  // ISO 3166-2 cl-region + comuna
  region: 'CL-RM',
  regionName: 'Región Metropolitana de Santiago',
  country: 'Chile',
  countryCode: 'CL',
  city: 'Santiago',
  placeName: 'Santiago, Conchalí, Chile',
  icbm: '-33.389, -70.644',
  // Box de cobertura aproximada RM
  coverageBox: {
    north: -33.20,
    south: -33.65,
    east: -70.40,
    west: -70.90,
  },
} as const;

// Hreflang. El sitio es 100% en español y no existe ninguna página /en/,
// por lo que declarar `es` y `es-419` como alternates apuntaba a la misma
// URL sin contenido distinto: 4 declarations para 1 página. Google las
// trata como hreflang contradictorio. Se deja sólo el par canónico.
export const HREFLANG = [
  { hreflang: 'es-cl', href: '/' },
  { hreflang: 'x-default', href: '/' },
] as const;

// Horario de atención — fuente única.
//
// Antes vivía en tres versiones: el JSON-LD (L-V 08:00-20:00, S-D 24/7),
// llms.txt (L-V 09:00-18:00, "GMT-4") y el copy visible. Un asistente que
// citaba llms.txt daba un horario que el sitio no mostraba. Ahora lo
// declara el JSON-LD y llms.txt lo lee de acá, así que no pueden divergir.
//
// Zona horaria: UTC-3 (hora oficial de Chile continental). El "GMT-4" que
// declaraba llms.txt era el offset de horario de verano, no el de Chile.
export const OPENING_HOURS = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    dayLabel: 'lunes a viernes',
    opens: '08:00',
    closes: '20:00',
    note: 'Atención comercial',
  },
  {
    days: ['Saturday', 'Sunday'],
    dayLabel: 'sábado y domingo',
    opens: '00:00',
    closes: '23:59',
    note: 'Monitoreo 24/7 (centro de operaciones)',
  },
] as const;

/**
 * Imagen social. Las dimensiones van declaradas acá y no hardcodeadas en el
 * `<head>`: `og-default-v2.jpg` es 1400x775 y el head anunciaba 1200x630, así
 * que la tarjeta se recortaba con un marco que no era el de la pieza. Si se
 * cambia el archivo, se cambian estos dos números con él.
 */
export const OG_IMAGE = {
  PATH: '/images/og-default-v2.jpg',
  WIDTH: 1400,
  HEIGHT: 775,
} as const;

export const TIMEZONE = 'America/Santiago';
export const TIMEZONE_LABEL = 'UTC-3 (hora oficial de Chile)';

/** "lunes a viernes 08:00-20:00; sábado y domingo 00:00-23:59 (monitoreo 24/7)" */
export const OPENING_HOURS_TEXT = OPENING_HOURS.map(
  (h) => `${h.dayLabel} ${h.opens}-${h.closes}`,
).join('; ');

export const SOCIAL_PROFILES = [
  SITE.INSTAGRAM_URL,
  SITE.YOUTUBE_URL,
] as const;

// ────────────────────────────────────────────────────────────────
// FAQ de la home — fuente única
//
// Antes vivía duplicada: `TrustSignals.astro` (6 preguntas, texto A) y
// `index.astro` (4 preguntas, texto B). El JSON-LD FAQPage salía de la
// segunda, así que Google Rich Results marcaba contenido que el usuario
// no veía en la página — violation de las directrices de datos
// estructurados. Ahora ambas capas leen esta lista: el marcado es un
// espejo exacto del `<details>` visible, por construcción.
//
// Si se agrega una pregunta, se agrega acá y aparece en ambos lados.
export const FAQ_HOME: { q: string; a: string }[] = [
  {
    q: '¿Cuánto demora la cotización?',
    a: 'Nuestro equipo comercial le contacta en menos de 24 horas hábiles. Para urgencias, llame al +56 9 300 000 10 y atendemos en el acto, todos los días del año.',
  },
  {
    q: '¿Cuál es el mínimo de guardias que puedo contratar?',
    a: 'No hay mínimo. Diseñamos planes desde un guardia con turno parcial hasta operaciones 24/7 con múltiples puestos. Cada cotización se ajusta a sus necesidades reales.',
  },
  {
    q: '¿Los guardias están realmente certificados?',
    a: 'Sí, todos nuestros guardias acreditan certificación OS-10 vigente emitida por la Prefectura de Seguridad Privada de Carabineros. Verificamos antecedentes penales, laborales y referencias.',
  },
  {
    q: '¿Qué comunas de Santiago cubren?',
    a: `Cubrimos ${COVERAGE_RM.length} comunas de la Región Metropolitana: ${RM_COMMUNES_LIST}. También ${VS_COMMUNES_LIST} en la Región de Valparaíso.`,
  },
  {
    q: '¿Pueden combinar guardias con tecnología?',
    a: 'Sí. Integramos guardias OS-10 con CCTV, control de accesos biométrico, Ajax Systems (somos instaladores oficiales) y el sistema autónomo Guardpod para vigilancia en zonas sin infraestructura. La cotización incluye la combinación óptima para su propiedad.',
  },
  {
    q: '¿Qué pasa si necesito reemplazar un guardia?',
    a: 'Contamos con un sistema de respaldo garantizado. Si un guardia se ausenta, enviamos reemplazo certificado en menos de 4 horas, sin costo adicional para el cliente.',
  },
];

// Versión del bundle (para cache-busting).
export const BUNDLE_VERSION = 'v5.5.4';
