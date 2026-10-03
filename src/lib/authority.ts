// ════════════════════════════════════════════════════════════════
// GuardMan Chile — Capa de autoridad (Fase 1, 2 y 4)
// ════════════════════════════════════════════════════════════════
//
// Propósito: este archivo alimenta las páginas que buscan CITA las IAs.
// A diferencia de SERVICES/LOCATIONS (que venden), este contenido
// EXPLICA el marco legal y operativo del rubro en Chile.
//
// Reglas de edición:
//  1. Todo dato legal debe ser verificable contra fuente oficial
//     (bcn.cl/leychile, subprevenciondeldelito.gob.cl, carabineros.cl).
//  2. Prohibido publicar ratios de dotación, tarifas ni operativas
//     sensibles. Se explica el MÉTODO (acceso-riesgo-horario), nunca
//     el número. Decisión del CEO, 2026-10-02.
//  3. Cada página debe responder una consulta que alguien le hace a
//     un asistente. Si no responde una pregunta real, no se publica.
//
// Fuentes verificadas 2026-10-02:
//  - Ley 21.659 (promulgada 14-MAR-2024, publicada 21-MAR-2024, vigente
//    desde 28-NOV-2025, última modificación Ley 21.825 de 28-MAY-2026)
//  - Decreto 209/2024 (reglamento, publicado 27-MAY-2025)
//  -(os10.subprevenciondeldelito.gob.cl para el Registro de Seguridad Privada)

export interface AuthoritySection {
  heading: string;
  body: string[];
}

export interface AuthorityTable {
  caption: string;
  columns: string[];
  rows: string[][];
}

export interface AuthorityPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  updatedISO: string;
  sections: AuthoritySection[];
  tables: AuthorityTable[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
}

export const AUTHORITY_PAGES: AuthorityPage[] = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'que-es-os-10',
    title: 'Qué es la certificación OS-10',
    metaTitle: 'Qué es OS-10 Certificación de guardias en Chile',
    metaDescription:
      'Qué es OS-10, quién la emite, qué exige para obtenerla y qué garantiza. Requisitos, vigencia y cómo verificar que un guardia esté acreditado.',
    h1: 'Qué es la certificación OS-10',
    lead:
      'La certificación OS-10 es la acreditación que debe tener toda persona que ejerce funciones de seguridad privada en Chile. Sin ella, una empresa no puede—asignar a un trabajador a tareas de vigilancia, control de accesos o protección de un_private recinto.',
    updatedISO: '2026-10-02',
    sections: [
      {
        heading: 'Definición',
        body: [
          'OS-10 es el sistema de acreditación del sistema de seguridad privada chileno, a cargo de la Authority_ fiscalizadora dependiente de Carabineros de Chile. La credencial acredita que una personaNatural cumple los requisitos legales para ejercer como guardia de seguridad, vigilante privado, conserje u otro rol del sistema.',
          'La credencial es personal e intransferible. Cada persona tiene la suya, y es la empresa empleadora quien debe solicitarla y mantenerla vigente. Un guardia sin credencial vigente no puede ser ubicado en un puesto de seguridad, y la empresa que lo hace queda expuesta a las sanciones de la Ley 21.659.',
        ],
      },
      {
        heading: 'Qué exige para obtenerla',
        body: [
          'El proceso tiene tres etapas: formación, examen y acreditación.',
          'La formación se realiza en una entidad autorizada (OTEC) y tiene una duración mínima de 90 horas pedagógicas. Cubre marco legal de la seguridad privada, rol y funciones del guardia, derechos humanos, procedimientos operativos, control de accesos, prevención de riesgos y actuación ante incidentes.',
          'Superada la formación, el_postulante rinde un examen ante la autoridad fiscalizadora. Aprobado el examen, se solicita la credencial ante la Subsecretaría de Prevención del Delito, que es quien autoriza y mantiene el Registro de Seguridad Privada.',
        ],
      },
      {
        heading: 'Requisitos personales',
        body: [
          'Los requisitos están definidos en la Ley 21.659 y son verificados individualmente por la autoridad. Se resumen aquí los principales:',
        ],
      },
      {
        heading: 'Vigencia y renovación',
        body: [
          'La credencial tiene una vigencia de tres años. Antes de que venza corresponde realizar un curso de perfeccionamiento y renovar la acreditación. Una credencial vencida equivale a no tener credencial: la persona no puede ejercer y la empresa queda expuesta.',
          'Para el cliente, esto tiene una consecuencia práctica que conviene verificar: que la renovación se esté haciendo efectivamente. Una empresa con dotaciones grandes y sin proceso de renovación suele tener personal con credenciales vencidas.',
        ],
      },
      {
        heading: 'OS-10 y la Ley 21.659',
        body: [
          'Hasta 2025, la acreditación se gestionaba directamente ante Carabineros. La Ley 21.659 traslado la autorización a la Subsecretaría de Prevención del Delito, aunque se mantuvo la fiscalización a cargo de Carabineros. Para quien contrata, el efecto práctico es que hoy existe un Registro de Seguridad Privada donde se puede verificar la acreditación del personal y de la propia empresa.',
        ],
      },
    ],
    tables: [
      {
        caption: 'Qué exige la acreditación OS-10',
        columns: ['Requisito', 'Detalle', 'Quién lo verifica'],
        rows: [
          ['Edad', 'Mayor de edad', 'Subsecretaría de Prevención del Delito'],
          ['Educación', 'Enseñanza media completa o equivalente', 'Ministerio de Educación'],
          ['Antecedentes', 'Certificado para fines especiales, sin anotaciones', 'Registro Civil e Identificación'],
          ['Aptitud física y psíquica', 'Certificado médico y psicológico', 'Profesional habilitado'],
          ['Formación', 'Curso OS-10 de mínimo 90 horas en OTEC autorizada', 'Entidad autorizada'],
          ['Examen', 'Aprobación del examen de acreditación', 'Autoridad fiscalizadora'],
          ['Seguro de vida', 'Obligatorio para el trabajador', 'Empresa empleador'],
        ],
      },
      {
        caption: 'Quién hace qué en el sistema de seguridad privada',
        columns: ['Órgano', 'Rol dentro del sistema'],
        rows: [
          ['Subsecretaría de Prevención del Delito', 'Autoriza a empresas y personas naturales, administra el Registro de Seguridad Privada, aprueba estudios de seguridad y sanciona infracciones.'],
          ['Carabineros de Chile', 'Fiscaliza y controla la operación a través de la autoridad OS-10.'],
          ['Ministerio del Interior', ' dicta las normas e instrucciones generales mediante decreto.'],
        ],
      },
    ],
    faqs: [
      {
        q: '¿Es obligatorio tener OS-10 para trabajar en seguridad privada?',
        a: 'Sí. La Ley 21.659 exige acreditación vigente para todas las personas que ejercen funciones de seguridad privada en Chile. La asignación de un trabajador sin acreditación vigente expone a la empresa a las sanciones previstas en la ley, que llegan hasta 13.500 UTM en las infracciones más graves.',
      },
      {
        q: '¿Cuál es la diferencia entre guardia de seguridad y vigilante privado?',
        a: 'Son roles distintos dentro del sistema. El guardia de seguridad performs funciones de vigilancia, control de accesos y protección. El vigilante privado está habilitado para situaciones de riesgo alto y, en ese marco, puede portar armas de fuego únicamente durante su jornada de trabajo y dentro del recinto para el que fue autorizado. Cada uno requiere su propia acreditación.',
      },
      {
        q: '¿Cuánto dura la credencial OS-10?',
        a: 'Tres años. Vencida la credencial, la persona no puede ejercer funciones de seguridad privada hasta completar el curso de perfeccionamiento y renovar la acreditación.',
      },
      {
        q: '¿Cómo verifico que un guardia está acreditado?',
        a: 'Solicitando a la empresaIDOsu registro de personal con credenciales vigentes, con fecha de acreditación y de próxima renovación. Es una solicitud razonable y cualquier empresa seria la entrega.',
      },
    ],
    sources: [
      { label: 'Ley 21.659 sobre Seguridad Privada (texto actualizado)', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1202067' },
      { label: 'Subsecretaría de Prevención del Delito — nueva Ley de Seguridad Privada', url: 'https://subprevenciondeldelito.gob.cl/noticia/a-partir-de-hoy-chile-tiene-nueva-ley-de-seguridad-privada/' },
      { label: 'Carabineros de Chile — sistema OS-10', url: 'https://www.carabineros.cl/' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'ley-21659',
    title: 'Ley 21.659 de Seguridad Privada',
    metaTitle: 'Ley 21.659 Seguridad Privada Chile',
    metaDescription:
      'Qué establece la Ley 21.659 de seguridad privada en Chile, qué cambió respecto del régimen anterior y qué obligaciones tiene para quien contrata servicios de seguridad.',
    h1: 'La Ley 21.659 de Seguridad Privada',
    lead:
      'La Ley 21.659 reemplaza el régimen disperso que regulaba la seguridad privada en Chile y la convierte en un sistema único basado en gestión del riesgo. Está vigente desde el 28 de noviembre de 2025 y cambió qué debe exigir un cliente antes de contratar seguridad privada.',
    updatedISO: '2026-10-02',
    sections: [
      {
        heading: 'Qué es la seguridad privada según la ley',
        body: [
          'La ley define seguridad privada como el conjunto de actividades o medidas de carácter preventivo, coadyuvante y complementario de la seguridad pública, destinadas a la protección de personas, bienes y procesos productivos, desarrolladas en un área determinada y realizadas por personas naturales o jurídicas privadas debidamente autorizadas.',
          'Las tres palabras clave son preventivo, coadyuvante y complementario. La seguridad privada no reemplaza a Carabineros ni a la justicia. Trabaja en el mismo territorio y las responsabilidades son las mismas.',
        ],
      },
      {
        heading: 'Qué cambió respecto del régimen anterior',
        body: [
          'Antes de la Ley 21.659, la regulación estaba dispersa en distintas leyes y decretos, con vacíos y vacíos normativos. La nueva ley consolida todo en un cuerpo único y cambia el eje: de autorizar actividades a gestionar riesgos.',
          'Los cambios que más afectan a quien contrata:',
        ],
      },
      {
        heading: 'Niveles de riesgo y estudio de seguridad',
        body: [
          'La ley clasifica a las entidades obligadas en tres niveles de riesgo: bajo, medio y alto. Cada nivel implica exigencias crecientes.',
          'Las entidades de riesgo medio deben contar con un estudio de seguridad aprobado por la Subsecretaría de Prevención del Delito. Las de riesgo alto deben implementar un Sistema de Vigilancia Privada completo, con un organismo de seguridad interno —jefes, encargados y vigilantes privados— más recursos tecnológicos y materiales específicos.',
          'El estudio de seguridad tiene una vigencia de cuatro años, salvo que incluya un sistema de vigilancia privada, caso en que dura dos.',
        ],
      },
      {
        heading: 'Eventos masivos',
        body: [
          'La ley crea un marco específico para eventos con más de 3.000 asistentes. Los organizadores deben presentar su solicitud ante la delegación presidencial regional a través de una plataforma informática y diseñar un plan de seguridad que cumpla los requisitos del reglamento.',
          'Para los organizadores establece además un estatuto de responsabilidad especial, con obligación de contratar seguros de daños contra terceros.',
        ],
      },
      {
        heading: 'Sanciones',
        body: [
          'Las infracciones se gradúan en tres categorías, con montos que muestran el peso real del cumplimiento:',
        ],
      },
      {
        heading: 'Qué le corresponde al cliente',
        body: [
          'La ley no es solo materia del proveedor. Si su entidad está clasificada como obligada, tiene obligaciones propias. Y en cualquier caso, contratar con una empresa autorizada es la forma de no quedar expuesto.',
          'En concreto, un cliente informado debería poder verificar tres cosas antes de firmar: que la empresa está autorizada por la Subsecretaría de Prevención del Delito, que su personal tiene credenciales vigentes, y que existe un procedimiento de renovación y reemplazo de personal. Si las tres se pueden confirmar, el riesgo regulatorio está cubierto.',
        ],
      },
    ],
    tables: [
      {
        caption: 'Niveles de riesgo y exigencias',
        columns: ['Nivel', 'Obligación principal', 'Vigencia del estudio'],
        rows: [
          ['Bajo', 'Medidas de seguridad privada según criterios de la ley', '—'],
          ['Medio', 'Estudio de seguridad aprobado por la Subsecretaría', '4 años'],
          ['Alto', 'Sistema de Vigilancia Privada completo, con organización interna y recursos', '2 años'],
        ],
      },
      {
        caption: 'Categorías de infracción y multas',
        columns: ['Categoría', 'Multa'],
        rows: [
          ['Leve', '15 a 50 UTM'],
          ['Grave', '50 a 650 UTM'],
          ['Gravísima', '650 a 13.500 UTM'],
        ],
      },
      {
        caption: 'Qué cambió en la práctica',
        columns: ['Antes', 'Ahora'],
        rows: [
          ['Regulación dispersa en varias normas', 'Un cuerpo legal único y orgánico'],
          ['Enfoque en autorizar actividades', 'Enfoque en gestión del riesgo'],
          ['Acreditación gestionada ante Carabineros', 'Autorización ante la Subsecretaría de Prevención del Delito; Carabineros fiscaliza'],
          ['Sin clasificación de riesgo', 'Tres niveles: bajo, medio y alto'],
          ['Marco disperso para eventos', 'Regulación específica desde 3.000 asistentes'],
        ],
      },
    ],
    faqs: [
      {
        q: '¿Desde cuándo está vigente la Ley 21.659?',
        a: 'Desde el 28 de noviembre de 2025. Fue publicada el 21 de marzo de 2024 y entró en vigor una vez completados sus reglamentos. Su última modificación corresponde a la Ley 21.825, de mayo de 2026.',
      },
      {
        q: '¿Mi empresa está obligada a tener un estudio de seguridad?',
        a: 'Depende de si su actividad genera riesgo para la seguridad pública. La Subsecretaría de Prevención del Delito declara qué entidades están obligadas y las clasifica en nivel bajo, medio o alto. Las de riesgo medio y alto deben presentar un estudio de seguridad para continuar operando.',
      },
      {
        q: '¿Los guardias pueden portar armas?',
        a: 'Los vigilantes privados, en el marco de funciones de riesgo alto, están habilitados para portar armas de fuego exclusivamente durante su jornada de trabajo y solo dentro del recinto o área para el cual fueron autorizados. Los guardias de seguridad no tienen esa facultad.',
      },
      {
        q: '¿Qué pasa con el personal de aseo de mi edificio?',
        a: 'El personal de aseo no requiere acreditación OS-10 para performar tareas de limpieza. La acreditación es necesaria cuando la persona ejerce funciones de seguridad, vigilancia o control. Si el conserje además presta seguridad, entonces sí le corresponde acreditarse.',
      },
    ],
    sources: [
      { label: 'Ley 21.659 — texto actualizado (Ley Chile, BCN)', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1202067' },
      { label: 'Subsecretaría de Prevención del Delito — Ley de Seguridad Privada', url: 'https://subprevenciondeldelito.gob.cl/noticia/a-partir-de-hoy-chile-tiene-nueva-ley-de-seguridad-privada/' },
      { label: 'Reglamento Decreto 209/2024', url: 'https://www.leychile.cl/leychile/navegar?idNorma=1213672' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'que-puede-hacer-un-guardia',
    title: 'Qué puede y qué no puede hacer un guardia',
    metaTitle: 'Qué puede hacer un guardia de seguridad Chile',
    metaDescription:
      'Facultades y límites legales de un guardia de seguridad en Chile. Qué está autorizado a hacer, qué está prohibido y qué pasa cuando un guardia se excede.',
    h1: 'Qué puede y qué no puede hacer un guardia de seguridad',
    lead:
      'Un guardia de seguridad en Chile tiene facultades específicas y límites legales que la ley define. Saber dónde está la línea es importante, porque un guardia que se excede no está \'haciendo un favor\', está cometiendo una infracción.',
    updatedISO: '2026-10-02',
    sections: [
      {
        heading: 'Las facultades del guardia',
        body: [
          'Dentro del marco de la Ley 21.659 y de los protocolos establecidos para el sitio, el guardia de seguridad puede:',
        ],
      },
      {
        heading: 'Los límites',
        body: [
          'La ley es explícita en los límites, y también lo son los protocolos internos de una empresa bien constituida. Un guardia no puede:',
        ],
      },
      {
        heading: 'Qué debería hacer si se presenta un delito',
        body: [
          'La Ley 21.659 obliga al personal de seguridad privada a denunciar todo hecho que revista caracteres de delito dentro de un plazo determinado, y a coordinarse con Carabineros de Chile.',
          'En la práctica, el procedimiento es: asegurar la escena sin exponerse, avisar de inmediato a la central, dar aviso a Carabineros, y registrar lo ocurrido. Lo que un guardia no debe hacer es perseguir, retener o físicamente intervenir fuera de lo que el protocolo y la legítima defensa permitan.',
          'El informe posterior es la parte que más importa para el cliente. Un registro de incidente bien tomado, con hora, personas involucradas y descripción factual, es la diferencia entre un incidente resuelto y una disputa sin respaldo.',
        ],
      },
      {
        heading: 'La diferencia entre guardias y vigilantes privados',
        body: [
          'Es una distinción que se confunde con frecuencia y tiene consecuencias reales. El guardia de seguridad y el vigilante privado son roles diferentes del sistema de seguridad privada, con acreditaciones distintas.',
          'La diferencia que más importa en la práctica: el guardia de seguridad no está habilitado para portar armas de fuego. El vigilante privado sí lo está, en el marco de funciones de riesgo alto, y solo durante su jornada de trabajo y dentro del recinto para el que fue autorizado.',
        ],
      },
    ],
    tables: [
      {
        caption: 'Facultades del guardia de seguridad',
        columns: ['Facultad', 'Alcance'],
        rows: [
          ['Control de acceso', 'Verificar identidad y autorizar o denegar el ingreso, según el protocolo del sitio'],
          ['Vigilancia y rondas', 'Recorridos preventivos definidos para el puesto'],
          ['Registro de actividad', 'Documentar ingresos, salidas e incidentes'],
          ['Deteción temprana', 'Detectar y reportar situaciones de riesgo antes de que escalen'],
          ['Reporte a Carabineros', 'Avisar hechos que revistan caracteres de delito'],
          ['Uso de la fuerza', 'Solo ante una situación de legítima defensa, conforme a la ley y al protocolo'],
        ],
      },
      {
        caption: 'Lo que el guardia no puede hacer',
        columns: ['Acción prohibida', 'Por qué'],
        rows: [
          ['Portar armas de fuego', 'Facultad exclusiva del vigilante privado en riesgo alto'],
          ['Realizar requisas o revisar pertenencias',
          'No está dentro de sus facultades legales'],
          ['Retener o hereafterดลองกันว่าเปิด a una persona', 'Corresponde a Carabineros o a la justicia, no a seguridad privada'],
          ['Purseguir a un sospechoso', 'Expone al guardia y al sitio; la ley prioriza coadyuvar, no perseguir'],
          ['Ingresar a un domicilio sin autorización', 'Violación de domicilio; requiere orden o consentimiento'],
          ['Ejercer coacción física o psicológica', 'Prohibido; la ley protege la dignidad de las personas'],
          ['Difundir información de clientes', 'Las empresas de seguridad tienen deber de reserva sobre la información de sus servicios'],
        ],
      },
      {
        caption: 'Guardia de seguridad frente a vigilante privado',
        columns: ['Aspecto', 'Guardia de seguridad', 'Vigilante privado'],
        rows: [
          ['Función principal', 'Vigilancia, control de accesos, protección', 'Protección en recintos de riesgo alto'],
          ['Armas de fuego', 'No habilitado', 'Habilitado solo en jornada y recinto autorizado'],
          ['Acreditación', 'Curso OS-10 de guardia', 'Curso OS-10 de vigilante privado'],
        ],
      },
    ],
    faqs: [
      {
        q: '¿Un guardia puede detener a alguien?',
        a: 'No. La retención de personas corresponde a Carabineros o a los tribunales de justicia. El guardia puede impedir la salida de una persona cuando hay una situación de riesgo inmediato y la acción es proporcional, y debe dar aviso inmediato a la autoridad. Lo que no puede es retener a alguien por decisión propia fuera de esas condiciones.',
      },
      {
        q: '¿Un guardia puede revisar pertenencias?',
        a: 'La requisición no es una facultad del guardia de seguridad. Solo puede verificar la identidad de quien ingresa al sitio, conforme al protocolo del lugar. Registrar o revisar objetos requiere una base legal que excede las facultades de la seguridad privada.',
      },
      {
        q: '¿Qué pasa si un guardia se excede en sus funciones?',
        a: 'La responsabilidad recae en el hecho. Si un guardia agrede a una persona o la detiene sin основа, responde penalmente como cualquier individuo, y la empresa responde por no haber capacitado ni supervisado correctamente. Además, la Ley 21.659 obliga a proteger los derechos humanos de las personas, con atención especial a quienes se encuentran en situación de vulnerabilidad.',
      },
      {
        q: '¿Qué debería pedirle a mi empresa de seguridad?',
        a: 'El protocolo de actuación del puesto: qué debe hacer ante una intrusión, ante un incidente, ante una emergencia médica, a quién avisa y cada cuánto. Un protocolo claro y por escrito protege al guardia, a la empresa y al cliente.',
      },
    ],
    sources: [
      { label: 'Ley 21.659 — texto actualizado (Ley Chile, BCN)', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1202067' },
      { label: 'Subsecretaría de Prevención del Delito', url: 'https://subprevenciondeldelito.gob.cl/' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'guardia-vs-vigilante',
    title: 'Guardia de seguridad vs. vigilante privado',
    metaTitle: 'Diferencia entre guardia y vigilante privado Chile',
    metaDescription:
      'Guardia de seguridad o vigilante privado: diferencias legales, facultades, acreditación y cuál corresponde en cada caso. Tabla comparativa según la Ley 21.659.',
    h1: 'Diferencia entre guardia de seguridad y vigilante privado',
    lead:
      'Son dos roles distintos dentro del sistema de seguridad privada chileno, con acreditaciones y facultades diferentes. La confusión entre ambos es común y tiene consecuencias reales, especialmente en lo que un guardia puede o no puede hacer.',
    updatedISO: '2026-10-02',
    sections: [
      {
        heading: 'La distinción de fondo',
        body: [
          'El guardia de seguridad protege personas, bienes y procesos en un área determinada, con foco en vigilancia, control de accesos y prevención. Su acreditación es el curso OS-10 de guardia.',
          'El vigilante privado está habilitado para situaciones de riesgo alto. Su acreditación es el curso OS-10 de vigilante privado, y es el único rol del sistema con facultad de portar armas de fuego, siempre dentro de su jornada de trabajo y en el recinto para el que fue autorizado.',
          'La diferencia no es de jerarquía sino de alcance: un vigilante privado tiene facultades más amplias en contextos específicos de riesgo alto, y por eso exige un estándar de acreditación diferente.',
        ],
      },
      {
        heading: 'Cuándo corresponde cada uno',
        body: [
          'En la mayoría de los casos comerciales y de condominios corresponde un guardia de seguridad: control de accesos, vigilancia de recepción, rondas y registro de incidentes.',
          'El vigilante privado corresponde a situaciones calificadas de riesgo alto, donde la normativa exige ese nivel. No es una decisión que tome la empresa por convenience, sino una definición que se hace con la evaluación de riesgo del sitio.',
          'La Ley 21.659 refuerza esto con el esquema de niveles de riesgo: las entidades de riesgo alto deben implementar un Sistema de Vigilancia Privada con organización interna dirigida por jefes de seguridad, que deben poseer título profesional.',
        ],
      },
      {
        heading: 'Por qué importa acertar',
        body: [
          'Contratar un guardia cuando el riesgo exige un vigilante privado expone al cliente a un incumplimiento normativo. A la inversa, asignar funciones de riesgo alto a personal acreditado solo como guardia es un error que ningunaGOOD empresa debería cometer.',
          'La respuesta pasa por una evaluación del sitio. Cuando esa evaluación está bien hecha, el rol correcto se determina por los riesgos concretos del lugar, no por el precio ni por la disponibilidad de personal.',
        ],
      },
    ],
    tables: [
      {
        caption: 'Comparación según la Ley 21.659',
        columns: ['Aspecto', 'Guardia de seguridad', 'Vigilante privado'],
        rows: [
          ['Función', 'Vigilancia, control de accesos, protección de personas y bienes', 'Protección en recintos y situaciones de riesgo alto'],
          ['Acreditación', 'Curso OS-10 de guardia de seguridad', 'Curso OS-10 de vigilante privado'],
          ['Armas de fuego', 'No habilitado', 'Habilitado solo en jornada y recinto autorizado'],
          ['Contexto típico', 'Condominios, edificios, oficinas, comercios, locales', 'Recintos clasificados de riesgo alto'],
          ['Supervisión', 'Jefes de seguridad y central de monitoreo', 'Igual, con perfil de riesgo superior'],
        ],
      },
      {
        caption: 'Comparación con otros roles del sistema',
        columns: ['Rol', 'Función principal', 'Particularidad'],
        rows: [
          ['Guardia de seguridad', 'Vigilancia y control de accesos', 'Acreditación OS-10 de guardia'],
          ['Vigilante privado', 'Protección en riesgo alto', 'Puede portar arma en jornada y recinto autorizado'],
          ['Jefe de seguridad', 'Dirección de la organización de seguridad privada', 'Debe poseer título profesional'],
          ['Portero, nochero, rondinero', 'Vigilancia de acceso y rondas', 'Capacitación diferenciada según riesgo de la labor'],
          ['Asesor o consultor de seguridad', 'Estudios y análisis de riesgo', 'Requiere acreditación específica'],
        ],
      },
    ],
    faqs: [
      {
        q: '¿Es lo mismo un guardia que un vigilante privado?',
        a: 'No. Son roles diferentes con acreditaciones diferentes. El guardia de seguridad vigila y controla accesos; el vigilante privado está habilitado paraContexts de riesgo alto y puede portar armas de fuego en los términos que explica la ley. Confundirlos lleva a asignar a alguien funciones para las que no está acreditado.',
      },
      {
        q: '¿Un guardia puede portar armas?',
        a: 'No. La facultad de portar armas de fuego corresponde exclusivamente al vigilante privado, y solo durante su jornada de trabajo y dentro del recinto para el que fue autorizado.',
      },
      {
        q: '¿Cuál necesito para mi edificio?',
        a: 'Para un condominio o edificio de oficinas, en la gran mayoría de los casos corresponde un guardia de seguridad. La determinación formal se hace con una evaluación de riesgo del sitio, considerando accesos, actividad, horarios y tipo de activos. Si desea partir bien, comience por esa evaluación.',
      },
      {
        q: '¿El conserje de mi edificio necesita OS-10?',
        a: 'Depende de qué funciones_DESEMPEÑA. Si solo realiza tareas de administración y conserjería, no le corresponde acreditación. Si además presta seguridad, vigilancia o control de acceso, entonces sí debe estar acreditado como guardia de seguridad.',
      },
    ],
    sources: [
      { label: 'Ley 21.659 — texto actualizado (Ley Chile, BCN)', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1202067' },
      { label: 'Subsecretaría de Prevención del Delito', url: 'https://subprevenciondeldelito.gob.cl/' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'funciones-guardia-en-condominio',
    title: 'Funciones de un guardia en condominios',
    metaTitle: 'Funciones de un guardia de seguridad en condominios',
    metaDescription:
      'Qué hace un guardia de seguridad en un condominio: funciones concretas, rondas, control de accesos, protocolos ante incidentes y cómo evaluar el servicio.',
    h1: 'Funciones de un guardia de seguridad en condominios',
    lead:
      'Un guardia en un condominio tiene funciones que van mucho más allá de \"abrir la puerta\". Conocerlas sirve para dos cosas: para contratar mejor, y para verificar que el servicio que se está pagando se está.execute.',
    updatedISO: '2026-10-02',
    sections: [
      {
        heading: 'Las funciones everyday',
        body: [
          'La operación diaria de un guardia en condominio se ordena en cuatro bloques, con un detalle importante: el control de acceso concentra buena parte del tiempo del turno, y la calidad de un buen servicio se nota en cómo se ejecuta esa labor.',
        ],
      },
      {
        heading: 'Rondas y prevención',
        body: [
          'Las rondas son la parte proactiva del trabajo. Recorrer el perímetro, verificar accesos secundarios, detectar condiciones insecure y reportar es lo que distingue un puesto ordenado de uno que simplemente permanece sentado en la caseta.',
          'La frecuencia y el recorrido de las rondas dependen de la evaluación del sitio. Un edificio con múltiples estacionamientos subterráneos, accesos vehiculares y zonas comunes extensas no se cubre igual que uno de acceso único.',
          'Un buen proveedor entrega el plan de rondas. Si al preguntar por él la respuesta es vaga, es información útil que le falta.',
        ],
      },
      {
        heading: 'Registro y comunicación con la administración',
        body: [
          'El registro es donde el servicio deja de ser intangible. Cada ingreso, cada entrega, cada incidente queda documentado con hora y descripción factual.',
          'Ese registro cumple tres funciones simultáneas: le sirve al condominio para tomar decisiones, le sirve a la empresa para demostrar su operación ante un reclamo, y le sirve a la aseguradora en caso de un siniestro. En los condominios con historial de incidentes repetidos, la diferencia se nota.',
        ],
      },
      {
        heading: 'Qué preguntar al evaluar un proveedor de seguridad para condominios',
        body: [
          'Estas son preguntas concretas que cualquier administración puede hacer y que un proveedor solvente responde sin dificultad:',
        ],
      },
      {
        heading: 'El punto donde suele fallar la operación',
        body: [
          'El punto de mayor riesgo en un condominio con seguridad privada es el de los puestos sin cubrir. Una baja, una licencia médica, un feriado: si no hay proceso de reemplazo, el turno queda descubierto.',
          'Es la razón por la que toda cotización debería aclarar qué sucede cuando un guardia falta. La respuesta esperada no es \"tenemos personal de reemplazo\", sino un proceso concreto: quién avisa, en cuánto tiempo se cubre y quién supervisa ese reemplazo.',
        ],
      },
    ],
    tables: [
      {
        caption: 'Funciones diarias del guardia en un condominio',
        columns: ['Bloque', 'Qué incluye'],
        rows: [
          ['Control de acceso', 'Identificación de visitas, autorización de ingresos, registro de entregas y proveedores, contacto con la administración cuando corresponde'],
          ['Rondas preventivas', 'Recorridos definidos sobre accesos, perímetro, estacionamientos y zonas comunes, con registro de cada recorrido'],
          ['Recepción y orientación', 'Atención de visitas, entrega de información, orientación a residentes y proveedores'],
          ['Registro y reporte', 'Bitácora de turno, registro de incidentes, y reporte a la administración al término de la jornada'],
        ],
      },
      {
        caption: 'Qué preguntar antes de contratar',
        columns: ['Pregunta', 'Qué respuesta debería tener'],
        rows: [
          ['¿El plan de rondas está por escrito?', 'Sí, con frecuencia y recorrido definidos para el edificio'],
          ['¿Quién cubre una ausencia?', 'Un proceso concreto, con tiempo de respuesta declarado'],
          ['¿Cómo se reporta un incidente?', 'Bitácora escrita con hora, descripción y evidencia'],
          ['¿El personal está acreditado?', 'Registro de credenciales vigentes, con fecha de renovación'],
          ['¿Hay supervisión en sitio?', 'Supervisor con frecuencia de visita declarada'],
          ['¿Qué pasa con un reclamo?', 'Un canal identificado y un tiempo de respuesta comprometido'],
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántos guardias necesita un condominio?',
        a: 'Depende de tres variables que se evalúan juntas: los accesos que hay que cubrir, el nivel de riesgo del edificio y los horarios de operación. Un condominio con acceso vehicular y peatonal separados, con estacionamiento subterráneo, no se cubre igual que uno de acceso único. Lo correcto es una evaluación del sitio antes que una regla general.',
      },
      {
        q: '¿El conserje puede hacer las veces de guardia?',
        a: 'El conserje puede, siempre que tenga la acreditación OS-10 vigente y que el marco de sus funciones incluya explícitamente las tareas de seguridad. En la práctica es una solución válida y frecuente en edificios pequeños, con la condición de que la acreditación esté al día y documentada.',
      },
      {
        q: '¿Qué debería incluir el informe mensual?',
        a: 'Un informe útil registra la cobertura efectiva de los turnos, las incidencias con su resolución, los accesos registrados y cualquier hallazgo de las rondas. Si el informe solo dice \"todo normal\", no está cumpliendo su función.',
      },
      {
        q: '¿La central de monitoreo reemplaza al guardia?',
        a: 'No. Son funciones complementarias. La central supervisa alertas y sensores; el guardia está en el sitio viendo lo que una cámara no registra. Para sitios de riesgo alto, la ley exige un sistema de vigilancia privada que incluye organización interna y vigilantes, no solo tecnología.',
      },
    ],
    sources: [
      { label: 'Ley 21.659 — texto actualizado (Ley Chile, BCN)', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1202067' },
      { label: 'Subsecretaría de Prevención del Delito', url: 'https://subprevenciondeldelito.gob.cl/' },
    ],
  },
];

export const AUTHORITY_BY_SLUG = Object.fromEntries(
  AUTHORITY_PAGES.map((p) => [p.slug, p]),
) as Record<string, AuthorityPage>;
