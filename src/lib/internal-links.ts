// Mapa de enlaces internos entre la capa editorial y la capa comercial.
//
// El sitio tenía dos mitades separadas. La comercial (home, servicios, sectores,
// ubicaciones) enlazaba a sí misma y nunca llegaba a las guías; la editorial
// (guías, marco legal, soluciones) se enlazaba entre sí pero no salía hacia
// ningún servicio. En la práctica: un lector que terminaba "Cómo elegir una
// empresa de seguridad" no tenía, en el contenido, ningún camino a un producto.
//
// Este módulo es el mapa único de esa conexión. Vive aparte de los templates
// porque es la parte del sitio que hay que poder auditar: `internal-links.test.ts`
// verifica que cada entrada apunte a una ruta real, y el mapa se lee entero para
// detectar pares que dejaron de tener sentido.
//
// `note` no es decorativo: es la frase que explica por qué ese destino va ahí.
// Un bloque de enlaces sin razón visible es un catálogo, no una navegación.

export interface BridgeLink {
  /** Ruta interna, sin barra final. */
  href: string;
  /** Texto del enlace. Descriptivo, nunca "ver más". */
  label: string;
  /** Por qué este destino le sirve al lector de esta página. */
  note: string;
}

/**
 * Ícono para un destino, derivado de la ruta.
 *
 * Se calcula en vez de declararse en cada entrada porque son ~60 links y una
 * lista de iconos escrita a mano se desincroniza en cuanto se agrega un
 * servicio. `internal-links.test.ts` verifica que todo nombre cae en el
 * catálogo de `Icon.astro`, así que un icono inventado rompe la suite.
 */
const ICON_BY_SLUG: Record<string, string> = {
  // Servicios
  'guardias-de-seguridad': 'shield',
  'cctv-videovigilancia': 'eye',
  'control-de-accesos': 'lock',
  'escoltas-privados': 'user',
  'monitoreo-24-7': 'monitor',
  'seguridad-eventos': 'eventos',
  'seguridad-deportiva': 'deportivo',
  'seguridad-industrial': 'industrial',
  'auditoria-seguridad': 'search',
  'guard-pod': 'eye',
  aseo: 'aseo',
  servicios: 'shield',
  // Sectores
  residencial: 'residencial',
  comercial: 'comercial',
  industrial: 'industrial',
  construccion: 'construccion',
  educacion: 'educacion',
  eventos: 'eventos',
  hoteleria: 'hoteleria',
  salud: 'salud',
  automotriz: 'automotriz',
  deportivo: 'deportivo',
  sectores: 'radar',
  ubicaciones: 'location',
  // Editorial
  guias: 'book',
  soluciones: 'users',
  'seguridad-privada': 'scale',
  'que-es-os-10': 'scale',
  'ley-21659': 'scale',
  'nosotros': 'users',
  'canal-de-denuncias': 'shield',
};

const slugOf = (href: string) => href.split('/').filter(Boolean).pop() ?? '';

/** Convierte un puente en los items que espera el widget RelatedLinks. */
export function bridgeItems(links: BridgeLink[] | undefined) {
  return (links ?? []).map((l) => ({
    url: l.href,
    name: l.label,
    desc: l.note,
    icon: ICON_BY_SLUG[slugOf(l.href)] ?? 'shield',
  }));
}

/** Artículo editorial → páginas comerciales que resuelven su tema. */
export const EDITORIAL_BRIDGE: Record<string, BridgeLink[]> = {
  // ── Guías de dotación y contratación ───────────────────────────────
  'cuantos-guardias-necesita-mi-condominio': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'El servicio que se cotiza una vez definida la dotación.',
    },
    {
      href: '/sectores/residencial',
      label: 'Seguridad residencial',
      note: 'Protocolos de acceso, rondas y control vehicular para condominios.',
    },
  ],
  'cuantos-guardias-para-mi-edificio': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'Dotación con cobertura y turnos para edificios de oficinas.',
    },
    {
      href: '/soluciones/edificio-corporativo-cctv-y-aseo',
      label: 'Videovigilancia y aseo para edificios corporativos',
      note: 'La solución integrada que suma control de accesos y mantención.',
    },
  ],
  'turnos-y-cobertura-24-7': [
    {
      href: '/servicios/monitoreo-24-7',
      label: 'Monitoreo 24/7',
      note: 'Central propia con redundancia y coordinación directa con Carabineros.',
    },
    {
      href: '/servicios/control-de-accesos',
      label: 'Control de accesos',
      note: 'El servicio que sostiene un turno continuo sin brechas.',
    },
  ],
  'como-elegir-empresa-de-seguridad': [
    {
      href: '/servicios',
      label: 'Todos los servicios',
      note: 'El detalle de cada línea, con su alcance y cobertura.',
    },
    {
      href: '/seguridad-privada/que-es-os-10',
      label: 'Qué es la certificación OS-10',
      note: 'El requisito que hay que verificar antes de firmar con cualquiera.',
    },
    {
      href: '/nosotros',
      label: 'Nuestra trayectoria',
      note: 'Más de diez años operando con personal propio.',
    },
  ],

  // ── Marco legal y referencia ──────────────────────────────────────
  'que-es-os-10': [
    {
      href: '/servicios/seguridad-deportiva',
      label: 'Seguridad deportiva',
      note: 'Recintos que exigen certificación OS-10 para su operación.',
    },
    {
      href: '/sectores/salud',
      label: 'Seguridad hospitalaria',
      note: 'Sector donde el estándar OS-10 es condición de operación.',
    },
  ],
  'ley-21659': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'La actividad que la ley regula de forma más específica.',
    },
    {
      href: '/nosotros',
      label: 'GuardMan Chile',
      note: 'Operamos bajo el marco que esta página describe.',
    },
    {
      href: '/canal-de-denuncias',
      label: 'Canal de denuncias',
      note: 'Vía interna para reportar un incumplimiento, con reserva de identidad.',
    },
  ],
  'que-puede-hacer-un-guardia': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'El servicio donde estas funciones se ejecutan con instrucción escrita.',
    },
    {
      href: '/servicios/control-de-accesos',
      label: 'Control de accesos',
      note: 'Donde estas funciones aparecen con más frecuencia.',
    },
  ],
  'guardia-vs-vigilante': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'La figura que contrata cuando necesita respaldo armado y escalamiento.',
    },
  ],
  'funciones-guardia-en-condominio': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'Servicio con protocolo de turno y registro de novedades.',
    },
    {
      href: '/sectores/residencial',
      label: 'Seguridad residencial',
      note: 'El plan operativo que se aplica en condominios.',
    },
  ],

  // ── Soluciones integradas ─────────────────────────────────────────
  'condominio-seguridad-y-aseo': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'Vigilancia y control de accesos con turnos declarados.',
    },
    {
      href: '/servicios/aseo',
      label: 'Aseo de áreas comunes',
      note: 'Mantención con el mismo interlocutor y la misma bitácora.',
    },
    {
      href: '/sectores/residencial',
      label: 'Seguridad residencial',
      note: 'El sector donde esta combinación se aplica completa.',
    },
  ],
  'edificio-corporativo-cctv-y-aseo': [
    {
      href: '/servicios/cctv-videovigilancia',
      label: 'CCTV Videovigilancia',
      note: 'Cobertura de cámaras con grabación y respaldo.',
    },
    {
      href: '/servicios/aseo',
      label: 'Aseo de zonas comunes',
      note: 'Mantención de halls, ascensores y áreas de uso común.',
    },
    {
      href: '/servicios/control-de-accesos',
      label: 'Control de accesos',
      note: 'El complemento natural del videovigilancia en edificios.',
    },
  ],
  'centro-comercial-guardias-y-limpieza': [
    {
      href: '/servicios/guardias-de-seguridad',
      label: 'Guardias de seguridad',
      note: 'Vigilancia perimetral, aforo y prevención en circuitos cerrados.',
    },
    {
      href: '/servicios/aseo',
      label: 'Limpieza y mantención',
      note: 'Operación diaria de zonas comunes, patios y estacionamientos.',
    },
    {
      href: '/sectores/comercial',
      label: 'Seguridad para el sector comercial',
      note: 'Plan operativo para locales y centros de concentración de personas.',
    },
  ],
  'construccion-seguridad-industrial-y-aseo': [
    {
      href: '/servicios/seguridad-industrial',
      label: 'Seguridad industrial',
      note: 'Vigilancia perimetral con rondas programadas y control de carga.',
    },
    {
      href: '/servicios/aseo',
      label: 'Aseo y mantención del sitio',
      note: 'Limpieza de faena y retiro de residuos.',
    },
    {
      href: '/sectores/construccion',
      label: 'Seguridad para obras',
      note: 'El sector con sus propios protocolos de faena.',
    },
  ],
  'eventos-vigilancia-y-limpieza': [
    {
      href: '/servicios/seguridad-eventos',
      label: 'Seguridad Eventos',
      note: 'Planificación de seguridad con control de accesos y aforo.',
    },
    {
      href: '/servicios/aseo',
      label: 'Limpieza del recinto',
      note: 'Operación previa, durante y posterior al evento.',
    },
    {
      href: '/sectores/eventos',
      label: 'Seguridad para eventos en Chile',
      note: 'Marco regulatorio y protocolos según tipo de evento.',
    },
  ],
};

/** Servicio comercial → contenido editorial que resuelve dudas previas. */
export const SERVICE_BRIDGE: Record<string, BridgeLink[]> = {
  'guardias-de-seguridad': [
    {
      href: '/guias/cuantos-guardias-necesita-mi-condominio',
      label: 'Cuántos guardias necesita un condominio',
      note: 'Cómo se define la dotación antes de cotizar.',
    },
    {
      href: '/guias/cuantos-guardias-para-mi-edificio',
      label: 'Cuántos guardias para un edificio de oficinas',
      note: 'La misma dotación, calculada para un destino de oficinas.',
    },
    {
      href: '/seguridad-privada/que-puede-hacer-un-guardia',
      label: 'Qué puede y qué no puede hacer un guardia',
      note: 'El alcance legal de la figura que vas a contratar.',
    },
    {
      href: '/seguridad-privada/funciones-guardia-en-condominio',
      label: 'Funciones de un guardia en condominios',
      note: 'Qué se le pide a un guardia cuando el sitio es un condominio.',
    },
  ],
  'cctv-videovigilancia': [
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Qué exigir a cualquier proveedor de videovigilancia.',
    },
    {
      href: '/seguridad-privada/ley-21659',
      label: 'La Ley 21.659 de Seguridad Privada',
      note: 'Marco legal que regula a la empresa que instala y monitorea.',
    },
  ],
  'control-de-accesos': [
    {
      href: '/guias/turnos-y-cobertura-24-7',
      label: 'Turnos y cobertura 24/7',
      note: 'Cómo se sostiene una cobertura continua sin brechas.',
    },
  ],
  'escoltas-privados': [
    {
      href: '/seguridad-privada/guardia-vs-vigilante',
      label: 'Diferencia entre guardia y vigilante privado',
      note: 'La distinción entre ambas figuras legales.',
    },
  ],
  'monitoreo-24-7': [
    {
      href: '/guias/turnos-y-cobertura-24-7',
      label: 'Turnos y cobertura 24/7',
      note: 'Qué significa una cobertura real, con turnos y relevos.',
    },
  ],
  'seguridad-eventos': [
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Qué revisar antes de contratar seguridad para un evento.',
    },
    {
      href: '/soluciones/eventos-vigilancia-y-limpieza',
      label: 'Vigilancia y limpieza para eventos',
      note: 'Cuando el evento necesita además operación de limpieza.',
    },
  ],
  'seguridad-deportiva': [
    {
      href: '/seguridad-privada/que-es-os-10',
      label: 'Qué es la certificación OS-10',
      note: 'El estándar que exige un recinto deportivo.',
    },
  ],
  'seguridad-industrial': [
    {
      href: '/seguridad-privada/ley-21659',
      label: 'La Ley 21.659 de Seguridad Privada',
      note: 'Obligaciones legales del proveedor y del mandante.',
    },
    {
      href: '/soluciones/construccion-seguridad-industrial-y-aseo',
      label: 'Seguridad y mantenimiento en faenas',
      note: 'Cuando la faena incluye además servicios de mantención.',
    },
  ],
  'auditoria-seguridad': [
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Qué preguntar antes de firmar el informe de auditoría.',
    },
  ],
  'guard-pod': [
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Contexto general de contratación antes de evaluar la tecnología.',
    },
  ],
  aseo: [
    {
      href: '/soluciones/condominio-seguridad-y-aseo',
      label: 'Seguridad y aseo con un solo responsable',
      note: 'Por qué unificar ambos servicios mejora la coordinación.',
    },
  ],
};

/** Sector comercial → editorial y soluciones que aplican a ese sector. */
export const SECTOR_BRIDGE: Record<string, BridgeLink[]> = {
  residencial: [
    {
      href: '/soluciones/condominio-seguridad-y-aseo',
      label: 'Seguridad y aseo para condominios',
      note: 'La solución integrada para este sector.',
    },
    {
      href: '/guias/cuantos-guardias-necesita-mi-condominio',
      label: 'Cuántos guardias necesita un condominio',
      note: 'El criterio de dotación específico de residencial.',
    },
    {
      href: '/seguridad-privada/funciones-guardia-en-condominio',
      label: 'Funciones de un guardia en condominios',
      note: 'El alcance del trabajo en un condominio con acceso restringido.',
    },
  ],
  comercial: [
    {
      href: '/soluciones/centro-comercial-guardias-y-limpieza',
      label: 'Vigilancia y aseo para centros comerciales',
      note: 'La solución para concentración de personas.',
    },
    {
      href: '/soluciones/edificio-corporativo-cctv-y-aseo',
      label: 'Videovigilancia y aseo para edificios corporativos',
      note: 'La solución para edificios de oficinas.',
    },
    {
      href: '/guias/cuantos-guardias-para-mi-edificio',
      label: 'Cuántos guardias para un edificio de oficinas',
      note: 'La dotación de un destino de oficinas por superficie.',
    },
  ],
  industrial: [
    {
      href: '/servicios/seguridad-industrial',
      label: 'Seguridad industrial',
      note: 'Vigilancia perimetral y control de carga.',
    },
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Qué exigir a un proveedor en plantas y bodegas.',
    },
  ],
  construccion: [
    {
      href: '/soluciones/construccion-seguridad-industrial-y-aseo',
      label: 'Seguridad y mantenimiento en faenas',
      note: 'La solución para obras en ejecución.',
    },
    {
      href: '/servicios/seguridad-industrial',
      label: 'Seguridad industrial',
      note: 'El servicio base del plan de faena.',
    },
  ],
  educacion: [
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Lo que exige un establecimiento educativo.',
    },
  ],
  eventos: [
    {
      href: '/soluciones/eventos-vigilancia-y-limpieza',
      label: 'Vigilancia y limpieza para eventos',
      note: 'La solución para eventos.',
    },
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Qué revisar antes de contratar seguridad de eventos.',
    },
  ],
  hoteleria: [
    {
      href: '/soluciones/edificio-corporativo-cctv-y-aseo',
      label: 'Videovigilancia y aseo para edificios',
      note: 'Cobertura de accesos y áreas comunes.',
    },
  ],
  salud: [
    {
      href: '/seguridad-privada/que-es-os-10',
      label: 'Qué es la certificación OS-10',
      note: 'El estándar exigido en hospitales y clínicas.',
    },
  ],
  automotriz: [
    {
      href: '/guias/como-elegir-empresa-de-seguridad',
      label: 'Cómo elegir una empresa de seguridad privada',
      note: 'Criterios de contratación para el sector.',
    },
  ],
  deportivo: [
    {
      href: '/servicios/seguridad-deportiva',
      label: 'Seguridad deportiva',
      note: 'Control de tribunas, perímetro y hinchadas.',
    },
    {
      href: '/seguridad-privada/que-es-os-10',
      label: 'Qué es la certificación OS-10',
      note: 'El estándar que habilita un recinto deportivo.',
    },
  ],
};
