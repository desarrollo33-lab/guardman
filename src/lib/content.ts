// ════════════════════════════════════════════════════════════════
// GuardMan Chile — Contenido completo optimizado v5.1
// Contenido único por página, sin duplicaciones.
// Español neutro latinoamericano, tono profesional.
// ════════════════════════════════════════════════════════════════

// ─── Servicios: contenido completo (features, problemas, FAQs) ──
export interface ServiceFAQ { q: string; a: string }
export interface ServiceContent {
  name: string
  shortDesc: string
  longDesc: string
  heroBadge: string
  heroTitle: string
  heroSub: string
  features: { title: string; description: string }[]
  problems: string[]
  faqs: ServiceFAQ[]
}

export const SERVICES: Record<string, ServiceContent> = {
  'guardias-de-seguridad': {
    name: 'Guardias de Seguridad',
    shortDesc: 'Protección profesional con guardias certificados las 24 horas',
    longDesc:
      'Protección profesional con guardias certificados OS-10 disponibles 24/7 para empresas, condominios y eventos en toda la Región Metropolitana.',
    heroBadge: 'Certificación OS-10',
    heroTitle: 'Guardias de Seguridad Profesionales en Chile',
    heroSub:
      'Proteja su empresa, condominio o evento con personal certificado OS-10 y más de 10 años de experiencia en seguridad privada.',
    features: [
      { title: 'Verificación exhaustiva de antecedentes', description: 'Cada guardia pasa por un proceso de selección riguroso con verificación de antecedentes penales, laborales y referencias antes de ser asignado.' },
      { title: 'Supervisión nocturna preventiva', description: 'Rondas programadas y supervisión en tiempo real durante turnos nocturnos para detectar conductas sospechosas antes de que ocurran incidentes.' },
      { title: 'Protocolos adaptados por sector', description: 'Diseñamos procedimientos específicos según el tipo de propiedad: corporativo, residencial, industrial o comercial.' },
      { title: 'Academia de capacitación continua', description: 'Formación permanente en primeros auxilios, manejo de conflictos, uso de tecnología y normativa vigente en nuestra academia interna.' },
      { title: 'Vehículos de reacción rápida', description: 'Flota de vehículos equipados desplegados estratégicamente para respuesta inmediata ante emergencias en cada zona de cobertura.' },
      { title: 'Comunicación radial permanente', description: 'Cada guardia mantiene comunicación constante con supervisores y central de monitoreo mediante radios digitales encriptados.' },
      { title: 'Reportes digitales diarios', description: 'Bitácoras digitales con registro fotográfico de rondas, incidentes y novedades, accesibles en tiempo real por el cliente.' },
      { title: 'Guardias de reemplazo garantizados', description: 'Sistema de backup con personal de reserva para asegurar continuidad del servicio ante ausencias imprevistas.' },
    ],
    problems: [
      'Incremento de robos en condominios durante horarios nocturnos y fines de semana, cuando la vigilancia disminuye.',
      'Ingresos no autorizados a bodegas y oficinas por falta de control efectivo en puntos de acceso.',
      'Vandalismo recurrente en estacionamientos y áreas comunes que genera costos de reparación constantes.',
      'Ausencia de protocolos claros ante emergencias, lo que provoca respuestas lentas y descoordinadas.',
    ],
    faqs: [
      { q: '¿Qué es la certificación OS-10 y por qué es importante?', a: 'La certificación OS-10 es la autorización que otorga Carabineros de Chile a las personas que desean trabajar como guardias de seguridad privada. Es un requisito legal indispensable. En GuardMan Chile, todos nuestros guardias mantienen esta certificación vigente, lo que garantiza formación en uso de la fuerza, primeros auxilios, control de accesos y normativa legal.' },
      { q: '¿Cuánto cuesta contratar un guardia de seguridad en Chile?', a: 'El precio varía según la cantidad de guardias, el tipo de turno (diurno, nocturno, 4x4, 6x1), la ubicación y las necesidades específicas del servicio. Ofrecemos cotizaciones personalizadas sin compromiso. Contáctenos para recibir un presupuesto ajustado a sus requerimientos.' },
      { q: '¿En qué comunas de Santiago ofrecen servicios de guardias?', a: 'Tenemos presencia en 14 comunas de la Región Metropolitana: Las Condes, Vitacura, Lo Barnechea, La Reina, Huechuraba, Quilicura, Renca, Conchalí, La Pintana, Lampa, Pudahuel, Santiago Centro, Providencia y más. También cubrimos Los Andes y San Felipe.' },
      { q: '¿Qué diferencia a GuardMan Chile de otras empresas de seguridad?', a: 'Nos diferenciamos por nuestro central de monitoreo propio 24/7, verificación rigurosa de antecedentes, academia interna de capacitación, vehículos de reacción rápida y el Guardpod, nuestro sistema autónomo de vigilancia. Más de 10 años y 200+ guardias certificados nos respaldan.' },
    ],
  },

  'cctv-videovigilancia': {
    name: 'CCTV y Videovigilancia',
    shortDesc: 'Cámaras de última generación con monitoreo 24/7',
    longDesc:
      'Sistemas de cámaras IP y CCTV con monitoreo remoto 24/7, respaldo en la nube y personal certificado OS-10.',
    heroBadge: 'Videovigilancia 24/7',
    heroTitle: 'CCTV y Videovigilancia Profesional en Chile',
    heroSub:
      'Proteja su empresa, condominio o residencia con sistemas de videovigilancia de última tecnología, monitoreo 24/7 y personal certificado OS-10.',
    features: [
      { title: 'Cámaras HD y 4K con visión nocturna', description: 'Equipos de alta definición con detección de movimiento, ideales para interiores y exteriores con condiciones de baja luminosidad.' },
      { title: 'Grabación continua en NVR con respaldo', description: 'Almacenamiento seguro en grabadores de red con respaldo automático, permitiendo revisar eventos pasados con total claridad.' },
      { title: 'Acceso remoto desde cualquier dispositivo', description: 'Visualización en vivo desde smartphone o computador, para que pueda ver lo que sucede en su propiedad desde cualquier lugar.' },
      { title: 'Integración con alarmas y sensores', description: 'Conexión con sistemas de alarma, control de acceso y sensores perimetrales para crear una barrera de seguridad multicapa.' },
      { title: 'Instalación profesional con cableado seguro', description: 'Técnicos especializados realizan la instalación con cableado estructurado y configuración optimizada para máxima cobertura.' },
      { title: 'Mantención preventiva programada', description: 'Revisiones periódicas de equipos, limpieza de lentes, actualización de firmware y verificación de almacenamiento.' },
    ],
    problems: [
      'Robos en bodegas y patios durante la noche, cuando no hay personal presente y las cámaras convencionales no registran con claridad.',
      'Ingresos no autorizados a condominios o plantas industriales por falta de vigilancia visual permanente.',
      'Vandalismo en estacionamientos que genera costos de reparación sin evidencia identificable para la investigación.',
      'Imposibilidad de identificar responsables ante incidentes por cámaras con baja resolución o ángulos ciegos.',
    ],
    faqs: [
      { q: '¿Qué incluye el servicio de CCTV de GuardMan?', a: 'Incluye diseño del sistema, instalación de cámaras HD/4K, configuración de NVR, monitoreo 24/7 desde nuestro centro propio, mantención periódica y acceso remoto. Todo el personal operativo cuenta con certificación OS-10 vigente.' },
      { q: '¿Cuánto cuesta instalar videovigilancia en Chile?', a: 'El costo varía según la cantidad de cámaras, resolución, tipo de instalación y complejidad del cableado. Ofrecemos cotizaciones personalizadas tras una visita técnica sin compromiso.' },
      { q: '¿Qué certificaciones tienen los operadores de CCTV?', a: 'Todos nuestros operadores cuentan con certificación OS-10 vigente y capacitación continua en sistemas de videovigilancia, protocolos de seguridad y atención de emergencias.' },
      { q: '¿En qué comunas ofrecen cobertura para videovigilancia?', a: 'Prestamos servicios en 14 comunas de la Región Metropolitana y en Los Andes y San Felipe. Contáctenos para verificar disponibilidad en su sector.' },
    ],
  },

  'control-de-accesos': {
    name: 'Control de Accesos',
    shortDesc: 'Control total de accesos con tecnología biométrica',
    longDesc:
      'Sistemas de control de accesos con lectores biométricos, tarjetas y QR para edificios y oficinas, integrado con monitoreo 24/7.',
    heroBadge: 'Tecnología + Personal OS-10',
    heroTitle: 'Control de Accesos Profesional en Chile',
    heroSub:
      'Proteja su propiedad con sistemas inteligentes y guardias certificados OS-10. Más de 10 años de experiencia en 14 comunas de la Región Metropolitana.',
    features: [
      { title: 'Lectores biométricos y QR', description: 'Torniquetes con reconocimiento de huella, lector de patentes, códigos QR y software de gestión de visitas para un control preciso.' },
      { title: 'Protocolos personalizados por propiedad', description: 'Diseñamos procedimientos de acceso específicos para edificios corporativos, condominios residenciales o parques industriales.' },
      { title: 'Bitácoras digitales con registro completo', description: 'Historial confiable de cada acceso con datos de visitante, horario y destino, facilitando auditorías y control interno.' },
      { title: 'Gestión de visitantes y proveedores', description: 'Sistema digital que reemplaza los cuadernos de papel, eliminando errores humanos y proporcionando trazabilidad total.' },
      { title: 'Integración con CCTV y alarmas', description: 'Conexión con sistemas de videovigilancia y alarmas para verificación visual de cada acceso y alertas ante intentos no autorizados.' },
      { title: 'Reportes periódicos de actividad', description: 'Informes con estadísticas de accesos, horarios pico y anomalías detectadas para optimizar los protocolos de ingreso.' },
    ],
    problems: [
      'Ingresos no autorizados por falta de verificación de identidad en accesos peatonales y vehiculares.',
      'Robos oportunistas en empresas donde personas ajenas ingresan sin control durante horarios de alta afluencia.',
      'Registro de visitas inexistente o mal llevado, sin respaldo digital ni control de horarios de egreso.',
      'Conflictos con proveedores y repartidores por ausencia de protocolos claros de ingreso y coordinación.',
    ],
    faqs: [
      { q: '¿Qué incluye el servicio de control de accesos?', a: 'Incluye instalación de sistemas tecnológicos (lectores biométricos, QR, torniquetes), asignación de guardias OS-10, supervisión desde nuestro central de monitoreo 24/7 y gestión digital de visitas.' },
      { q: '¿Cuánto cuesta contratar control de accesos profesional?', a: 'El costo depende del tipo de propiedad, cantidad de accesos, tecnología requerida y número de guardias. Ofrecemos cotizaciones personalizadas sin compromiso.' },
      { q: '¿Qué certificaciones tienen sus guardias?', a: 'Todos nuestros guardias cuentan con certificación OS-10 vigente y capacitación continua en nuestra academia interna.' },
      { q: '¿En qué comunas ofrecen el servicio?', a: 'Operamos en 14 comunas de la Región Metropolitana más Los Andes y San Felipe.' },
    ],
  },

  'escoltas-privados': {
    name: 'PPI (Protección de Personas Importantes)',
    shortDesc: 'PPI (Protección de Personas Importantes) para ejecutivos y personas de alto perfil',
    longDesc:
      'Servicio de PPI (Protección de Personas Importantes) con escoltas privados certificados OS-10 y entrenamiento táctico para ejecutivos, autoridades y personas de alto perfil.',
    heroBadge: 'PPI OS-10',
    heroTitle: 'PPI (Protección de Personas Importantes) en Santiago',
    heroSub:
      'Servicio de PPI con escoltas certificados OS-10, evaluación previa de riesgos, vehículos equipados y coordinación permanente con nuestro central de monitoreo.',
    features: [
      { title: 'Evaluación previa de riesgos por misión', description: 'Análisis de amenazas, rutas y contexto antes de cada desplazamiento para diseñar un plan de protección efectivo.' },
      { title: 'Vehículos equipados para traslados seguros', description: 'Flota de vehículos con equipamiento táctico y comunicación permanente con el central de monitoreo.' },
      { title: 'Protocolos actualizados según normativa', description: 'Procedimientos de seguridad certificados y actualizados conforme a la legislación vigente de seguridad privada.' },
      { title: 'Respaldo y reemplazo sin interrupciones', description: 'Personal de reserva disponible para servicios continuos, asegurando cobertura permanente sin gaps de protección.' },
      { title: 'Coordinación con Carabineros', description: 'Protocolos de coordinación directa con Carabineros para situaciones de alta complejidad o emergencias.' },
      { title: 'Confidencialidad garantizada', description: 'Todos nuestros escoltas firman acuerdos de confidencialidad y cumplen protocolos estrictos de discreción profesional.' },
    ],
    problems: [
      'Amenazas recibidas o situaciones de hostigamiento que requieren protección personal inmediata.',
      'Desplazamientos por zonas de alta delincuencia durante traslados ejecutivos o comerciales.',
      'Traslado seguro de especies valoradas, documentos confidenciales o material de alto riesgo.',
      'Acompañamiento en eventos públicos con gran concentración de personas donde el riesgo aumenta.',
    ],
    faqs: [
      { q: '¿Qué es PPI (Protección de Personas Importantes)?', a: 'PPI es la categoría técnica de la escolta privada orientada a la protección de ejecutivos, autoridades y personas de alto perfil. En GuardMan Chile, nuestro servicio de PPI se opera con personal certificado OS-10, verificación de antecedentes, autorización de la Autoridad Administrativa Laboral y capacitación continua en protección ejecutiva y manejo de emergencias.' },
      { q: '¿Puedo contratar escoltas PPI solo para eventos específicos?', a: 'Sí, ofrecemos servicios PPI permanentes y eventuales. Contáctenos para una cotización personalizada según sus necesidades.' },
      { q: '¿En qué comunas ofrecen servicio de PPI?', a: 'Cobertura en 14 comunas de la Región Metropolitana más Los Andes y San Felipe.' },
      { q: '¿Cómo se determina el precio del servicio PPI?', a: 'Depende de la duración, número de escoltas, nivel de riesgo y servicios adicionales como vehículos de apoyo. Solicite una cotización sin compromiso.' },
    ],
  },

  'monitoreo-24-7': {
    name: 'Monitoreo 24/7',
    shortDesc: 'Centro de control con vigilancia las 24 horas',
    longDesc:
      'Centro de monitoreo propio 24/7 con operadores certificados OS-10 y respuesta inmediata ante cualquier evento.',
    heroBadge: 'Central Propia 24/7',
    heroTitle: 'Monitoreo 24/7 Profesional en Chile',
    heroSub:
      'Protección ininterrumpida desde nuestro central de monitoreo propio con redundancia de sistemas y operadores certificados OS-10.',
    features: [
      { title: 'Redundancia de sistemas y comunicaciones', description: 'Infraestructura con respaldo de energía, internet y comunicaciones para asegurar operación continua sin interrupciones.' },
      { title: 'Análisis en tiempo real de cámaras', description: 'Operadores especializados supervisan feeds de video con detección de conductas sospechosas y alertas automáticas.' },
      { title: 'Integración con Ajax Systems', description: 'Conexión directa con sistemas de alarma Ajax Systems como instaladores oficiales en Chile.' },
      { title: 'Supervisión preventiva nocturna', description: 'Protocolos específicos de vigilancia nocturna para identificar riesgos antes de que se materialicen en incidentes.' },
      { title: 'Reportes periódicos de actividad', description: 'Informes detallados de eventos, alarmas verificadas y estado de los sistemas de seguridad del cliente.' },
      { title: 'Servicio personalizado por cliente', description: 'Protocolos de actuación diseñados según las necesidades específicas de cada empresa, condominio o residencia.' },
    ],
    problems: [
      'Su empresa permanece cerrada durante la noche o fines de semana sin supervisión de sus instalaciones.',
      'Incremento de la delincuencia en su zona que requiere protección profesional permanente para su hogar.',
      'Administración de condominio que necesita control de accesos más vigilancia constante de áreas comunes.',
      'Necesidad de reducir costos de seguridad integrando tecnología con personal certificado en lugar de guardias exclusivamente presenciales.',
    ],
    faqs: [
      { q: '¿En qué consiste el servicio de monitoreo 24/7?', a: 'Supervisión permanente desde nuestra central de vigilancia propia. Operadores capacitados vigilan cámaras y alarmas en tiempo real, detectan eventos, verifican alertas y coordinan respuestas según protocolos establecidos. Operamos directamente nuestro centro con redundancia de sistemas.' },
      { q: '¿Cuál es el costo del monitoreo 24/7?', a: 'Depende de la cantidad de cámaras, puntos de alarma, nivel de riesgo y servicios adicionales. Ofrecemos cotización personalizada sin costo donde evaluamos sus necesidades específicas.' },
      { q: '¿Qué significa la certificación OS-10?', a: 'Es la acreditación oficial de Carabineros de Chile que confirma que el guardia ha completado formación en vigilancia, primeros auxilios y legislación aplicable. Todos nuestros guardias mantienen esta certificación vigente.' },
      { q: '¿En qué comunas tienen cobertura?', a: 'Cobertura en 14 comunas de la Región Metropolitana más Los Andes y San Felipe. Esta cobertura regional permite atender desde torres corporativas hasta parcelas residenciales.' },
      { q: '¿Cómo funciona la integración con alarmas y cámaras?', a: 'Como instaladores oficiales de Ajax Systems, implementamos soluciones conectadas a nuestra central. Cuando una alarma se activa, los operadores verifican por cámara, descartan falsas alarmas y activan el protocolo de respuesta, incluyendo contacto con Carabineros si corresponde.' },
    ],
  },

  'seguridad-eventos': {
    name: 'Seguridad para Eventos',
    shortDesc: 'Seguridad profesional para todo tipo de eventos',
    longDesc:
      'Cobertura de seguridad para eventos masivos y privados con guardias certificados OS-10.',
    heroBadge: 'Eventos Masivos y Privados',
    heroTitle: 'Seguridad para Eventos en Chile',
    heroSub:
      'Planificación de seguridad personalizada para eventos corporativos, sociales y masivos con guardias certificados OS-10 y unidades Guardpod.',
    features: [
      { title: 'Planificación según tipo y tamaño', description: 'Diseño de protocolos de seguridad personalizados según el tipo de evento, número de asistentes y características del recinto.' },
      { title: 'Control de accesos y gestión de aforo', description: 'Registro de invitados, control de aforo y coordinación de flujos para evitar aglomeraciones y accesos no autorizados.' },
      { title: 'Unidades Guardpod para perímetro', description: 'Vigilancia autónoma perimetral con cámaras PTZ y detección IA, ideal para eventos al aire libre o en recintos sin infraestructura.' },
      { title: 'Coordinación con Carabineros', description: 'Protocolos de coordinación directa con Carabineros para eventos de alta concurrencia y gestión de vías públicas.' },
      { title: 'Personal capacitado en emergencias', description: 'Guardias con formación en primeros auxilios, manejo de multitudes y evacuación de recintos.' },
      { title: 'Reporte post-evento con recomendaciones', description: 'Informe detallado de incidencias, tiempos de respuesta y recomendaciones de mejora para futuros eventos.' },
    ],
    problems: [
      'Acceso no autorizado de personas ajenas al evento mediante identificación deficiente o inexistente.',
      'Aglomeraciones y descontrol en accesos durante eventos masivos sin gestión de aforo.',
      'Robos y hurtos en eventos con alto flujo de público y poca vigilancia en zonas perimetrales.',
      'Emergencias mal gestionadas por ausencia de protocolos de evacuación y comunicación claros.',
    ],
    faqs: [
      { q: '¿Cuántos guardias necesito para mi evento?', a: 'Depende del tipo de evento, número de asistentes, recinto y nivel de exposición. Para eventos pequeños (hasta 100 personas) recomendamos mínimo 2 guardias; eventos masivos pueden requerir equipos de 10 o más. Contáctenos para una evaluación precisa.' },
      { q: '¿Qué incluye el servicio de seguridad para eventos?', a: 'Selección de guardias OS-10, briefing de protocolo, supervisión durante la jornada, coordinación con central de monitoreo, comunicación interna y reporte post-evento. Opcionalmente: cámaras, Guardpod y coordinación con Carabineros.' },
      { q: '¿Cómo certifican la calidad del personal?', a: 'Proceso riguroso: verificación de antecedentes, validación de OS-10 ante Carabineros, evaluación de experiencia y competencias, capacitación interna de protocolos y supervisor de piso asignado.' },
      { q: '¿Pueden cubrir eventos fuera de Santiago?', a: 'Sí. Además de las 14 comunas metropolitanas, tenemos presencia en San Felipe y Los Andes. Para otras zonas evaluamos viabilidad logística.' },
    ],
  },

  'seguridad-deportiva': {
    name: 'Seguridad Deportiva',
    shortDesc: 'Seguridad profesional para recintos y eventos deportivos',
    longDesc:
      'Cobertura integral de seguridad para recintos deportivos, estadios y eventos masivos con personal OS-10, control de accesos diferenciado por tribuna, vigilancia perimetral y protocolos de evacuación documentados.',
    heroBadge: 'Estadios y Recintos Deportivos',
    heroTitle: 'Seguridad Deportiva Profesional en Chile',
    heroSub:
      'Proteja su recinto deportivo o evento masivo con guardias certificados OS-10, control de accesos por zona, manejo de hinchadas y coordinación directa con Carabineros y servicios de emergencia.',
    features: [
      { title: 'Control de acceso por tribuna y sector', description: 'Verificación de entradas diferenciadas por tribuna, palco, prensa y zona técnica, con lectores QR y torniquetes para gestión precisa de aforo.' },
      { title: 'Vigilancia perimetral del recinto', description: 'Cobertura de perímetros extensos con rondas programadas, CCTV integrado y unidades Guardpod autónomas para estacionamientos y accesos secundarios.' },
      { title: 'Manejo de multitudes e hinchadas', description: 'Personal entrenado en disuasión preventiva, control de flujos y segregación de hinchadas rivales para evitar enfrentamientos dentro y fuera del recinto.' },
      { title: 'Coordinación con Carabineros y PDI', description: 'Protocolos de enlace operativo con fuerzas de seguridad para eventos de alta convocatoria, con canales de comunicación dedicados durante el partido.' },
      { title: 'Evacuación y emergencias', description: 'Plan de evacuación documentado, señalización verificada, salidas de emergencia despejadas y personal capacitado en primeros auxilios.' },
      { title: 'Protección de zonas críticas', description: 'Vigilancia reforzada en vestuarios, sala de prensa, palco oficial, zona de árbitros, depósitos de material y áreas de transmisión.' },
      { title: 'Pre-filtrado en accesos exteriores', description: 'Anillos de seguridad perimetrales con cacheo preventivo y disuasión de elementos prohibidos antes del ingreso a tribuna.' },
      { title: 'Reporte post-evento con indicadores', description: 'Informe con asistentes, incidentes, tiempos de respuesta y recomendaciones de mejora para futuros encuentros.' },
    ],
    problems: [
      'Ingreso de personas a zonas no autorizadas como cancha, vestuarios o zona de prensa por fallas en el control de accesos.',
      'Enfrentamientos entre hinchadas rivales dentro y fuera del recinto que escalan sin intervención profesional.',
      'Sobrecupo en tribunas populares y generales con riesgo de avalanchas y aplastamiento en graderías.',
      'Robos y hurtos en estacionamientos durante el partido, aprovechando la distracción del público asistente.',
    ],
    faqs: [
      { q: '¿Cuántos guardias se necesitan para un estadio?', a: 'Depende del aforo y la categoría del evento. Como referencia operativa, un partido estándar parte de 1 guardia por cada 250 asistentes, más refuerzos en accesos y perímetro. Entregamos un plan operativo detallado tras la visita técnica.' },
      { q: '¿Tienen experiencia con eventos de alta convocatoria?', a: 'Sí, operamos eventos masivos, finales y clásicos con coordinación directa con Carabineros, gestión de hinchadas rivales y planes de contingencia documentados.' },
      { q: '¿Coordinan con las fuerzas de seguridad del Estado?', a: 'Sí. Mantenemos canales de comunicación directa con Carabineros y PDI durante el evento, con un supervisor de enlace asignado en el módulo de coordinación.' },
      { q: '¿Pueden cubrir partidos fuera de Santiago?', a: 'Sí. Operamos en 14 comunas de la Región Metropolitana y en Los Andes y San Felipe. Para recintos en otras regiones evaluamos logística y desplazamos equipos.' },
    ],
  },

  'seguridad-industrial': {
    name: 'Seguridad Industrial',
    shortDesc: 'Protección para industrias, bodegas y obras',
    longDesc:
      'Vigilancia perimetral y control de acceso para industrias, bodegas y obras con personal OS-10.',
    heroBadge: 'Industria + Bodegas + Obras',
    heroTitle: 'Seguridad Industrial para Empresas en Chile',
    heroSub:
      'Proteja su planta, bodega o instalación industrial con guardias especializados en entornos industriales, control de carga y supervisión 24/7.',
    features: [
      { title: 'Guardias con experiencia industrial', description: 'Personal formado en dinámica de turnos industriales, control de acceso a áreas restringidas y coordinación con producción.' },
      { title: 'Rondas programadas y aleatorias', description: 'Inspecciones periódicas y sorpresivas según perfil de riesgo, cubriendo perímetros extensos y múltiples puntos de acceso.' },
      { title: 'Control de carga y descarga', description: 'Registro digital de vehículos, conductores y mercadería en puntos de ingreso y egreso con verificación documental.' },
      { title: 'Coordinación con Carabineros', description: 'Protocolos de respuesta ante emergencias industriales con comunicación directa a Carabineros y servicios de emergencia.' },
      { title: 'Seguro de responsabilidad civil', description: 'Cobertura obligatoria que resguarda al cliente ante cualquier eventualidad durante el servicio de vigilancia.' },
      { title: 'Informes de gestión mensuales', description: 'Reportes con estadísticas de incidentes, rondas realizadas y cumplimiento de protocolos para toma de decisiones.' },
    ],
    problems: [
      'Robo de materiales, equipos y productos terminados en bodegas y plantas durante turnos nocturnos.',
      'Acceso no autorizado por perímetros extensos con múltiples puntos de vulnerabilidad.',
      'Pérdidas por negligencia en el control de salida de mercadería y materiales sin trazabilidad.',
      'Requerimientos normativos de seguridad que exigen presencia de vigilancia autorizada durante faenas.',
    ],
    faqs: [
      { q: '¿Qué diferencia la seguridad industrial de la empresarial?', a: 'La seguridad industrial requiere guardias con experiencia en plantas, bodegas y centros de distribución. Nuestros guardias están capacitados para trabajar en zonas con maquinaria, sustancias peligrosas y condiciones de ruido, entendiendo la dinámica de turnos industriales.' },
      { q: '¿Cómo garantizan la calidad del servicio?', a: 'Supervisores zonales realizan inspecciones regulares, nuestro central de monitoreo supervisa 24/7 y emitimos informes mensuales de gestión con estadísticas de incidentes y cumplimiento.' },
      { q: '¿Cuánto cuesta contratar seguridad industrial?', a: 'Depende de la cantidad de guardias, horarios, complejidad de la instalación y protocolos requeridos. Cotizamos cada proyecto de forma personalizada.' },
      { q: '¿Se adaptan a los turnos de nuestra planta?', a: 'Sí, diseñamos planes según su operación: turnos diurnos, nocturnos, rotativos, 4x4 o según sus requerimientos específicos.' },
    ],
  },

  'auditoria-seguridad': {
    name: 'Auditoría de Seguridad',
    shortDesc: 'Evaluación profesional de vulnerabilidades',
    longDesc:
      'Diagnóstico de vulnerabilidades y plan de mejora de seguridad para empresas, condominios y comunidades.',
    heroBadge: 'Diagnóstico Profesional',
    heroTitle: 'Auditoría de Seguridad Profesional en Santiago',
    heroSub:
      'Inspección en terreno de perímetros, CCTV, alarmas e iluminación con informe ejecutivo y plan de acción priorizado.',
    features: [
      { title: 'Evaluación perimetral completa', description: 'Revisión de muros, rejas, puertas, ventanas y puntos ciegos de acceso con medición de vulnerabilidades.' },
      { title: 'Diagnóstico de iluminación', description: 'Detección de zonas oscuras que facilitan la acción delictiva, con recomendaciones de mejora lumínica.' },
      { title: 'Verificación de CCTV y alarmas', description: 'Análisis de cobertura de cámaras, calidad de imagen, almacenamiento y estado de sistemas de alarma.' },
      { title: 'Revisión de protocolos y personal', description: 'Evaluación de procedimientos de ingreso, rondas de guardias, manejo de emergencias y certificación OS-10 del personal.' },
      { title: 'Evaluación por rubro específico', description: 'Análisis adaptado a comercio, bodegas, oficinas, condominios, eventos o comunidades según las características del cliente.' },
      { title: 'Informe ejecutivo con plan de acción', description: 'Documento con priorización de hallazgos, recomendaciones concretas y cronograma de implementación sugerido.' },
    ],
    problems: [
      'Perímetros vulnerables con muros bajos, rejas en mal estado o puertas sin refuerzo que facilitan ingresos no autorizados.',
      'Iluminación deficiente en estacionamientos y accesos secundarios que crean zonas de riesgo para peatones y vehículos.',
      'Cámaras mal ubicadas con ángulos ciegos o baja resolución que impiden una vigilancia efectiva ante incidentes.',
      'Personal de seguridad sin certificación OS-10 vigente o sin capacitación actualizada en primeros auxilios.',
    ],
    faqs: [
      { q: '¿Qué es una auditoría de seguridad y para qué sirve?', a: 'Es un examen sistemático de las medidas de protección física, tecnológica y procedimental de una propiedad. Identifica vulnerabilidades, evalúa riesgos y propone mejoras concretas bajo estándares OS-10.' },
      { q: '¿Cuánto dura y qué incluye?', a: 'Entre 4 y 8 horas para una empresa o condominio estándar. Incluye inspección en terreno, revisión de documentación, análisis de sistemas y entrevistas. Entregamos informe escrito con hallazgos y recomendaciones.' },
      { q: '¿Cuál es el precio?', a: 'Varía según alcance y complejidad. Una auditoría básica puede partir desde $150.000. Ofrecemos presupuestos personalizados sin compromiso.' },
      { q: '¿Necesito auditoría si ya tengo guardias y cámaras?', a: 'Sí. Muchas veces los sistemas están mal configurados, las cámaras tienen ángulos ciegos o los guardias carecen de protocolos claros. Una auditoría detecta estas brechas y optimiza los recursos existentes.' },
    ],
  },

  'guard-pod': {
    name: 'Guardpod',
    shortDesc: 'Unidades móviles de vigilancia 24/7 con tecnología avanzada',
    longDesc:
      'Unidades autónomas de vigilancia con cámaras PTZ 360° y detección IA para zonas sin infraestructura.',
    heroBadge: 'Tecnología Propia GuardMan',
    heroTitle: 'Guardpod, vigilancia autónoma sin infraestructura',
    heroSub:
      'Sistema autónomo de vigilancia con cámaras PTZ 360° con detección IA y monitoreo 24/7. Desarrollado durante 15 meses de I+D, sin necesidad de infraestructura eléctrica ni personal permanente.',
    features: [
      { title: 'Detección de intrusos con inteligencia artificial', description: 'Sensores avanzados que distinguen entre personas, vehículos y animales, reduciendo falsas alarmas y enviando alertas precisas.' },
      { title: 'Alimentación autónoma con baterías de litio', description: 'Baterías de alta capacidad que garantizan operación continua hasta 72 horas sin recarga. Recarga automática cuando vuelve a haber sol.' },
      { title: 'Conectividad 4G/LTE integrada', description: 'Módem incorporado para transmisión de video y alertas sin necesidad de conexión fija a internet.' },
      { title: 'Instalación rápida sin obras', description: 'Se instala en minutos sobre superficie plana, sin excavaciones ni cableado. Reubicable según necesidades del proyecto.' },
      { title: 'Elemento disuasorio visible', description: 'La presencia física del sistema autónomo con iluminación y señalización disuade a potenciales intrusos antes de que actúen.' },
      { title: 'Coordinación directa con Carabineros', description: 'Ante intrusiones confirmadas, el central de monitoreo activa protocolos de respuesta incluyendo notificación a Carabineros.' },
    ],
    problems: [
      'Costos elevados de guardias presenciales para turnos nocturnos o fines de semana en faenas y terrenos.',
      'Terrenos sin acceso a electricidad ni internet donde los sistemas de seguridad tradicionales no funcionan.',
      'Obras de construcción vulnerables a robos y vandalismo durante la noche o períodos de inactividad.',
      'Eventos masivos o ferias temporales que requieren vigilancia perimetral sin infraestructura permanente.',
    ],
    faqs: [
      { q: '¿Guardpod funciona sin electricidad ni internet?', a: 'Sí, es completamente autónomo. Paneles solares y baterías de litio proveen energía, y el módem 4G integrado permite transmisión de video y alertas sin conexión fija.' },
      { q: '¿Qué tipo de detección tiene?', a: 'Inteligencia artificial que detecta personas, vehículos y objetos, reduciendo falsas alarmas. Diferencia entre una persona y un animal, enviando alertas solo cuando es relevante.' },
      { q: '¿Cuánto tiempo opera sin sol?', a: 'Las baterías permiten hasta 72 horas de operación sin recarga solar. En condiciones normales, la recarga diaria es suficiente.' },
      { q: '¿Se puede reubicar fácilmente?', a: 'Sí, su diseño modular permite desmontar y trasladar en minutos. Ideal para proyectos temporales como obras, eventos o ferias.' },
      { q: '¿Quién monitorea las alertas?', a: 'Nuestro central de monitoreo propio opera 24/7. Ante una intrusión confirmada, se coordina respuesta con Carabineros o personal en terreno.' },
      { q: '¿El Guardpod reemplaza a los guardias?', a: 'Complementa extraordinariamente la seguridad. Es ideal donde la vigilancia física permanente es costosa, y trabaja en conjunto con nuestros servicios tradicionales.' },
    ],
  },

  aseo: {
    name: 'Aseo',
    shortDesc: 'Aseo profesional para oficinas, condominios, industrias y obras',
    longDesc:
      'Servicio de aseo profesional con personal uniformado, supervisado y con productos certificados para oficinas, condominios, industrias y obras en la Región Metropolitana.',
    heroBadge: 'Aseo Profesional',
    heroTitle: 'Aseo Profesional para Empresas y Condominios en Chile',
    heroSub:
      'Servicio de aseo continuo o puntual con personal uniformado, productos certificados y supervisión permanente en 14 comunas.',
    features: [
      { title: 'Personal uniformado con identificación', description: 'Cada colaborador porta identificación visible y cuenta con un supervisor de terreno asignado a su cuenta.' },
      { title: 'Productos certificados ecológicos', description: 'Productos de limpieza industriales certificados, con opciones biodegradables según requerimiento del cliente.' },
      { title: 'Planes adaptables al horario', description: 'Opciones diurnas, nocturnas y de fin de semana ajustadas al horario de operación de cada propiedad.' },
      { title: 'Protocolos de sanitización profunda', description: 'Procedimientos especializados para áreas críticas: cocinas, baños, salas de servidores y zonas de alto tráfico.' },
      { title: 'Reporte mensual detallado', description: 'Checklist de actividades, incidencias y horas ejecutadas con seguimiento mensual de calidad del servicio.' },
      { title: 'Maquinaria industrial profesional', description: 'Aspiradoras industriales, máquinas de piso e hidrolavadoras para aseo de grandes superficies y áreas industriales.' },
    ],
    problems: [
      'Falta de personal de aseo propio o rotación constante que afecta la continuidad y calidad del servicio.',
      'Necesidad de sanitización profunda en oficinas y áreas comunes después del horario laboral.',
      'Aseo de áreas industriales con residuos y polvo que requieren maquinaria especializada no disponible internamente.',
      'Coordinación deficiente entre aseo y seguridad, generando pérdida de llaves o accesos no controlados.',
    ],
    faqs: [
      { q: '¿Qué incluye el servicio de aseo?', a: 'Personal uniformado, productos de limpieza, maquinaria industrial, supervisión de terreno y reporte mensual. Los planes se ajustan al tipo de propiedad y horario.' },
      { q: '¿Pueden trabajar en horario nocturno?', a: 'Sí. La mayoría de nuestros clientes operan con planes nocturnos para no interrumpir la operación diurna. Coordinamos accesos con su equipo de seguridad.' },
      { q: '¿Qué tipo de productos utilizan?', a: 'Productos certificados de uso industrial. Opciones biodegradables disponibles. Para áreas críticas contamos con protocolos de sanitización profunda.' },
      { q: '¿En qué comunas ofrecen servicio?', a: 'En las 14 comunas de cobertura metropolitana más Los Andes y San Felipe.' },
    ],
  },
};

// ─── Ubicaciones: contenido ÚNICO por comuna ─────────────────────
export interface LocationContent {
  name: string
  zone: string
  zoneLabel: string
  zoneFull: string
  intro: string
  features: string[]
  problems: string[]
  faqs: { q: string; a: string }[]
}

export const LOCATIONS: Record<string, LocationContent> = {
  'las-condes': {
    name: 'Las Condes', zone: 'oriente', zoneLabel: 'Zona Oriente', zoneFull: 'oriente',
    intro: 'Las Condes es el epicentro corporativo y diplomático de Santiago, con embajadas, sedes de empresas multinacionales, clínicas privadas y centros comerciales como Parque Arauco y Costanera Center. GuardMan Chile protege esta comuna con guardias especializados en entornos corporativos de alta exigencia.',
    features: [
      'Guardias con experiencia en edificios corporativos y torres de oficinas',
      'Control de acceso para embajadas y consulados con protocolos diplomáticos',
      'Vigilancia para centros comerciales de alta afluencia',
      'Protección de clínicas y centros médicos privados',
      'Rondas preventivas adaptadas al perfil de riesgo corporativo',
      'Coordinación directa con Carabineros y seguridad de edificios',
    ],
    problems: [
      'Robos en estacionamientos subterráneos de torres corporativas durante horarios no laborales',
      'Acceso no autorizado a edificios de oficinas por ingreso de personas ajenas junto a empleados',
      'Hurto en locales comerciales de alta concurrencia como Costanera Center y Parque Arauco',
      'Vehículos de lujo como objetivo en estacionamientos de restaurantes y centros comerciales',
    ],
    faqs: [
      { q: '¿Qué servicios ofrecen específicamente para Las Condes?', a: 'Ofrecemos guardias para edificios corporativos, control de acceso para embajadas, vigilancia de centros comerciales y protección de clínicas. Todos con certificación OS-10 y adaptados al perfil de alta exigencia de la comuna.' },
      { q: '¿Tienen experiencia con embajadas y consulados?', a: 'Sí, trabajamos con representaciones diplomáticas aplicando protocolos de seguridad específicos que incluyen verificación de identidad, control de perímetro y coordinación con organismos de seguridad del Estado.' },
      { q: '¿Cuál es el tiempo de respuesta en Las Condes?', a: 'Menos de 15 minutos para incidentes prioritarios. Contamos con vehículos de reacción rápida desplegados en la zona Oriente.' },
    ],
  },

  'vitacura': {
    name: 'Vitacura', zone: 'oriente', zoneLabel: 'Zona Oriente', zoneFull: 'oriente',
    intro: 'Vitacura es una de las comunas residenciales de mayor valor en Santiago, con parques emblemáticos como el Bicentenario y Juan Pablo II, sedes diplomáticas, estudios de arquitectura y diseñadores de alto perfil. GuardMan Chile ofrece protección discreta y profesional para residencias, condominios y propiedades de alto valor.',
    features: [
      'Vigilancia discreta para residencias de alto valor',
      'Control de acceso en condominios exclusivos con protocolo personalizado',
      'Protección de parques y áreas verdes con rondas preventivas',
      'Seguridad para eventos privados y corporativos en la comuna',
      'Guardias con experiencia en atención a público de alto perfil',
      'Monitoreo 24/7 con respuesta coordinada para la zona Oriente',
    ],
    problems: [
      'Robos en residencias de alto valor durante ausencias prolongadas de los propietarios',
      'Ingresos por jardines y perímetros laterales de propiedades con medidas de seguridad insuficientes',
      'Hurto de vehículos de lujo en estacionamientos de condominios y restaurantes',
      'Vandalismo en parques y áreas verdes durante horarios nocturnos',
    ],
    faqs: [
      { q: '¿Ofrecen seguridad discreta para residencias de alto valor?', a: 'Sí, nuestro servicio en Vitacura se enfoca en vigilancia profesional sin alterar la privacidad del hogar. Protocolos diseñados para propiedades de alto valor con atención personalizada.' },
      { q: '¿Pueden cubrir eventos privados en Vitacura?', a: 'Por supuesto. Contamos con experiencia en seguridad para eventos sociales y corporativos en residencias, jardines y recintos privados de la comuna.' },
      { q: '¿Qué cobertura tienen en la zona Oriente?', a: 'Vitacura, Las Condes, Lo Barnechea y La Reina están cubiertas por nuestro equipo zonal con vehículos de reacción rápida y supervisión permanente.' },
    ],
  },

  'lo-barnechea': {
    name: 'Lo Barnechea', zone: 'oriente', zoneLabel: 'Zona Oriente', zoneFull: 'oriente',
    intro: 'Lo Barnechea combina áreas residenciales de gran superficie con zonas rurales periurbanas, colegios internacionales, centros ecuestres y acceso al Cajón del Maipo. La comuna presenta desafíos de seguridad únicos por la extensión de las propiedades y la distancia entre vecinos. GuardMan Chile ofrece soluciones adaptadas a este perfil.',
    features: [
      'Vigilancia perimetral para propiedades de gran superficie',
      'Rondas en terrenos rurales y parcelas con perímetros extensos',
      'Unidades Guardpod para terrenos sin infraestructura eléctrica',
      'Control de acceso en colegios internacionales y centros ecuestres',
      'Protección de casas de campo y segundas residencias',
      'Coordinación con Carabineros para zonas de difícil acceso',
    ],
    problems: [
      'Robos en parcelas y terrenos extensos donde la distancia dificulta la vigilancia convencional',
      'Ingresos por perímetros rurales sin cerramiento adecuado ni sistemas de alarma',
      'Vulnerabilidad de segundas residencias y casas de campo durante períodos de ausencia',
      'Robo de maquinaria agrícola, herramientas y equipos en propiedades rurales',
    ],
    faqs: [
      { q: '¿Pueden proteger propiedades rurales o parcelas?', a: 'Sí, es una de nuestras especialidades en Lo Barnechea. Ofrecemos guardias para perímetros extensos, unidades Guardpod autónomas para terrenos sin electricidad y sistemas de alarma inalámbricos.' },
      { q: '¿El Guardpod funciona en parcelas sin electricidad?', a: 'Exactamente. El Guardpod fue diseñado para este tipo de terrenos: funciona con alimentación autónoma, conectividad 4G y detección IA, sin necesidad de obras ni cableado.' },
      { q: '¿Cubren el Cajón del Maipo y zonas cordilleranas?', a: 'Evalúamos cada caso según la ubicación específica. Nuestra cobertura principal es Lo Barnechea urbano y periurbano, pero podemos extender servicios con unidades autónomas.' },
    ],
  },

  'la-reina': {
    name: 'La Reina', zone: 'oriente', zoneLabel: 'Zona Oriente', zoneFull: 'oriente',
    intro: 'La Reina es una comuna residencial del sector oriente caracterizada por sus parques amplios, la Universidad Academia de Humanismo Cristiano y un perfil familiar tranquilo. GuardMan Chile protege esta comunidad con servicios adaptados al carácter residencial y seguro de la comuna.',
    features: [
      'Guardias para condominios familiares con protocolo de atención cercana',
      'Vigilancia de parques y áreas verdes comunitarias',
      'Control de acceso para edificios residenciales con registro digital',
      'Protección de instituciones educacionales en la comuna',
      'Rondas nocturnas preventivas adaptadas al perfil residencial',
      'Coordinación con comités de seguridad vecinal',
    ],
    problems: [
      'Robos en viviendas unifamiliares durante horarios laborales cuando los propietarios están ausentes',
      'Acceso no autorizado a condominios por falta de control efectivo en porterías',
      'Vehículos estacionados en la vía pública como objetivo de hurto o vandalismo',
      'Robos en dependencias de la Universidad y establecimientos educacionales',
    ],
    faqs: [
      { q: '¿Qué servicios ofrecen para La Reina?', a: 'Guardias para condominios familiares, control de acceso en edificios, vigilancia de parques y protección de instituciones educacionales. Todo adaptado al perfil residencial de la comuna.' },
      { q: '¿Trabajan con comités de seguridad vecinal?', a: 'Sí, coordinamos nuestros servicios con los comités de seguridad de La Reina, compartiendo información y alineando protocolos con las iniciativas vecinales.' },
      { q: '¿Cuál es el tiempo de respuesta en La Reina?', a: 'Menos de 15 minutos. Nuestros vehículos de reacción rápida cubren toda la zona Oriente, incluyendo La Reina.' },
    ],
  },

  'santiago-centro': {
    name: 'Santiago Centro', zone: 'centro', zoneLabel: 'Zona Centro', zoneFull: 'centro',
    intro: 'Santiago Centro es el corazón político, comercial y cultural de Chile, con Palacio de La Moneda, el Barrio Lastarria, universidades, el Barrio Bellavista y una de las mayores concentraciones de oficinas públicas y privadas del país. La alta densidad urbana genera desafíos de seguridad específicos que GuardMan Chile atiende con protocolos especializados.',
    features: [
      'Guardias para edificios corporativos en el districto financiero',
      'Control de acceso para instituciones públicas y universidades',
      'Vigilancia de locales comerciales en paseos y galerías',
      'Protección de hoteles y hostales en zonas turísticas',
      'Rondas preventivas en áreas de alta concentración peatonal',
      'Coordinación con Carabineros para eventos masivos en la comuna',
    ],
    problems: [
      'Hurto y carterismo en zonas de alta concentración peatonal como paseos y estaciones de metro',
      'Robos a locales comerciales en galerías y paseos durante horarios de cierre',
      'Acceso no autorizado a edificios de oficinas por tailgating en horarios de alta afluencia',
      'Vandalismo y daños a la propiedad en zonas comerciales y turísticas durante la noche',
    ],
    faqs: [
      { q: '¿Qué seguridad ofrecen para el centro de Santiago?', a: 'Guardias para edificios corporativos, control de acceso institucional, vigilancia comercial, protección hotelera y rondas en zonas turísticas. Adaptados a la alta densidad y complejidad del centro.' },
      { q: '¿Tienen experiencia con instituciones públicas?', a: 'Sí, trabajamos con edificios gubernamentales, universidades y organismos públicos, aplicando protocolos de control de acceso y seguridad patrimonial.' },
      { q: '¿Pueden cubrir eventos masivos en el centro?', a: 'Por supuesto. Tenemos experiencia en seguridad para eventos culturales, marchas, ferias y manifestaciones en el centro de Santiago, con coordinación directa con Carabineros.' },
    ],
  },

  'huechuraba': {
    name: 'Huechuraba', zone: 'norte', zoneLabel: 'Zona Norte', zoneFull: 'norte',
    intro: 'Huechuraba alberga Ciudad Empresarial, uno de los principales clusters corporativos de Santiago, junto con centros comerciales como Espacio Urbano y conjuntos habitacionales en crecimiento. GuardMan Chile protege esta comuna con servicios especializados en el entorno corporativo y comercial.',
    features: [
      'Guardias para parques corporativos y Ciudad Empresarial',
      'Control de acceso en centros comerciales y retail',
      'Vigilancia de conjuntos habitacionales en desarrollo',
      'Protección de bodegas y centros logísticos en la zona norte',
      'Rondas preventivas adaptadas al perfil mixto de la comuna',
      'Coordinación con administraciones de parques empresariales',
    ],
    problems: [
      'Robos en oficinas y locales comerciales durante fines de semana y feriados',
      'Acceso no autorizado a Ciudad Empresarial fuera de horarios laborales',
      'Hurto en estacionamientos de centros comerciales durante horas pico',
      'Vandalismo en conjuntos habitacionales nuevos sin comunidad organizada',
    ],
    faqs: [
      { q: '¿Ofrecen seguridad para Ciudad Empresarial?', a: 'Sí, es uno de nuestros puntos focales en Huechuraba. Ofrecemos guardias para edificios corporativos, control de acceso vehicular y peatonal, y vigilancia de estacionamientos.' },
      { q: '¿Cubren centros comerciales como Espacio Urbano?', a: 'Trabajamos con locales comerciales y administraciones de centros comerciales en la comuna, ofreciendo seguridad adaptada al flujo de público.' },
      { q: '¿Qué tiempo de respuesta tienen en Huechuraba?', a: 'Menos de 15 minutos con vehículos de reacción rápida desplegados en la zona Norte.' },
    ],
  },

  'quilicura': {
    name: 'Quilicura', zone: 'norte', zoneLabel: 'Zona Norte', zoneFull: 'norte',
    intro: 'Quilicura es uno de los principales polos industriales y logísticos de Santiago, con parques industriales, centros de distribución, Mallplaza Norte y alta actividad de transporte de carga. GuardMan Chile ofrece seguridad especializada para el sector industrial y logístico de la comuna.',
    features: [
      'Guardias con experiencia en bodegas y centros de distribución',
      'Control de carga y descarga con registro digital de vehículos',
      'Vigilancia perimetral de parques industriales',
      'Protección de locales comerciales en Mallplaza Norte y alrededores',
      'Rondas nocturnas en zonas industriales con alta actividad logística',
      'Coordinación con seguridad de parques industriales y condominios industriales',
    ],
    problems: [
      'Robo de mercadería en tránsito y en centros de distribución durante operaciones nocturnas',
      'Acceso no autorizado a bodegas por perímetros industriales extensos con puntos ciegos',
      'Hurto de combustible y repuestos de vehículos de carga en estacionamientos industriales',
      'Vandalismo en locales comerciales durante el cierre de Mallplaza y centros comerciales',
    ],
    faqs: [
      { q: '¿Qué seguridad ofrecen para el sector industrial de Quilicura?', a: 'Guardias especializados en bodegas y centros de distribución, control de carga y descarga, vigilancia perimetral y protección de parques industriales con protocolos adaptados al rubro logístico.' },
      { q: '¿Pueden controlar el acceso de vehículos de carga?', a: 'Sí, implementamos registro digital de vehículos, conductores y mercadería, con verificación documental y coordinación con el personal de logística del cliente.' },
      { q: '¿Tienen experiencia con empresas de e-commerce y fulfillment?', a: 'Sí, trabajamos con centros de distribución de comercio electrónico, adaptando los protocolos de seguridad a los horarios extendidos y alta rotación de personal.' },
    ],
  },

  'lampa': {
    name: 'Lampa', zone: 'norte', zoneLabel: 'Zona Norte', zoneFull: 'norte',
    intro: 'Lampa es una comuna en rápida expansión con parques industriales, bodegas de distribución, el Mall Arauco Lampa y proyectos inmobiliarios de vivienda nueva. Su crecimiento genera nuevas necesidades de seguridad que GuardMan Chile atiende con soluciones adaptadas al perfil de comuna en desarrollo.',
    features: [
      'Unidades Guardpod para terrenos en desarrollo sin infraestructura',
      'Guardias para bodegas y parques industriales en expansión',
      'Protección de obras de construcción y proyectos inmobiliarios',
      'Vigilancia de locales comerciales en Mall Arauco y strip centers',
      'Control de acceso para conjuntos habitacionales nuevos',
      'Cobertura en zonas periurbanas con difícil acceso',
    ],
    problems: [
      'Robos en obras de construcción durante períodos de inactividad nocturna o fines de semana',
      'Vulnerabilidad de terrenos baldíos y proyectos inmobiliarios sin infraestructura de seguridad',
      'Hurto en bodegas de distribución con perímetros extensos y poca iluminación',
      'Acceso no autorizado a conjuntos habitacionales nuevos sin portería ni sistemas de control',
    ],
    faqs: [
      { q: '¿Pueden proteger obras de construcción en Lampa?', a: 'Sí, es una de nuestras fortalezas en la comuna. Ofrecemos guardias presenciales, unidades Guardpod autónomas y sistemas de alarma inalámbricos adaptados a faenas temporales.' },
      { q: '¿El Guardpod funciona en terrenos sin electricidad en Lampa?', a: 'Exactamente. Lampa tiene muchos terrenos en desarrollo sin infraestructura eléctrica, y el Guardpod fue diseñado para operar con alimentación autónoma y conectividad 4G.' },
      { q: '¿Cubren el Mall Arauco y locales comerciales?', a: 'Sí, ofrecemos seguridad para locales comerciales, strip centers y el Mall Arauco Lampa con guardias adaptados al flujo de público de la comuna.' },
    ],
  },

  'conchali': {
    name: 'Conchalí', zone: 'poniente', zoneLabel: 'Zona Poniente', zoneFull: 'poniente',
    intro: 'Conchalí es una comuna del sector poniente con alta densidad poblacional, mercado mayorista, industria liviana y excelente conectividad con la Autopista Central. Su perfil mixto residencial-comercial requiere servicios de seguridad versátiles. GuardMan Chile atiende esta comuna con soluciones adaptadas a su realidad urbana.',
    features: [
      'Guardias para condominios y edificios residenciales de alta densidad',
      'Vigilancia de locales comerciales y mercados',
      'Control de acceso en conjuntos habitacionales con múltiples torres',
      'Protección de industrias livianas y bodegas en la zona',
      'Rondas preventivas en pasajes y áreas comunes residenciales',
      'Coordinación con comités de seguridad de la comuna',
    ],
    problems: [
      'Robos en viviendas y departamentos durante horarios laborales por falta de vigilancia en pasajes',
      'Acceso no autorizado a conjuntos habitacionales por porterías desatendidas o sin control',
      'Hurto en locales comerciales y mercados durante cierres y fines de semana',
      'Vehículos como objetivo de robo o vandalismo en estacionamientos sin supervisión',
    ],
    faqs: [
      { q: '¿Qué seguridad ofrecen para Conchalí?', a: 'Guardias para condominios residenciales, vigilancia comercial, protección industrial y control de acceso en conjuntos habitacionales. Adaptados al perfil mixto de la comuna.' },
      { q: '¿Trabajan con el mercado mayorista de Conchalí?', a: 'Sí, ofrecemos servicios de seguridad para locales y bodegas del mercado mayorista, con protocolos específicos para el comercio de alimentos y productos perecederos.' },
      { q: '¿Cuál es el tiempo de respuesta en Conchalí?', a: 'Menos de 15 minutos con vehículos desplegados en la zona Poniente.' },
    ],
  },

  'pudahuel': {
    name: 'Pudahuel', zone: 'poniente', zoneLabel: 'Zona Poniente', zoneFull: 'poniente',
    intro: 'Pudahuel es estratégica por su cercanía al Aeropuerto Internacional SCL, con zonas industriales, bodegas logísticas, hoteles de tránsito y el Parque Intercomunal. La comuna requiere seguridad especializada para el flujo constante de pasajeros, carga y operaciones logísticas. GuardMan Chile domina este entorno.',
    features: [
      'Guardias para hoteles de tránsito y cercanos al aeropuerto',
      'Vigilancia de bodegas logísticas y centros de carga aérea',
      'Control de acceso en zonas industriales con alta rotación de vehículos',
      'Protección de propiedades residenciales en el Parque Intercomunal',
      'Coordinación con protocolos de seguridad aeroportuaria',
      'Unidades Guardpod para terrenos logísticos sin infraestructura permanente',
    ],
    problems: [
      'Robo de carga en bodegas logísticas cercanas al aeropuerto durante operaciones nocturnas',
      'Acceso no autorizado a zonas industriales con perímetros extensos y múltiples accesos vehiculares',
      'Hurto en hoteles de tránsito durante horarios de alta rotación de huéspedes',
      'Vulnerabilidad de terrenos logísticos temporales sin infraestructura de seguridad',
    ],
    faqs: [
      { q: '¿Ofrecen seguridad para bodegas logísticas en Pudahuel?', a: 'Sí, es nuestra especialidad en la comuna. Guardias con experiencia en control de carga, registro de vehículos y vigilancia de perímetros industriales logísticos.' },
      { q: '¿Pueden proteger hoteles cerca del aeropuerto?', a: 'Por supuesto. Trabajamos con hoteles de tránsito y alojamiento turístico en Pudahuel, con protocolos adaptados a la alta rotación de huéspedes.' },
      { q: '¿El Guardpod es adecuado para terrenos logísticos temporales?', a: 'Exactamente. El Guardpod se instala en minutos sin obras, funciona con alimentación autónoma y conectividad 4G, y se reubica fácilmente según las necesidades del proyecto logístico.' },
    ],
  },

  'renca': {
    name: 'Renca', zone: 'poniente', zoneLabel: 'Zona Poniente', zoneFull: 'poniente',
    intro: 'Renca combina parques industriales con zonas residenciales en consolidación, la Refinería de ENAP y proyectos de renovación urbana. La transición de la comuna genera necesidades de seguridad tanto industrial como residencial. GuardMan Chile ofrece servicios adaptados a esta dualidad.',
    features: [
      'Guardias para parques industriales y plantas de procesamiento',
      'Vigilancia de zonas residenciales en renovación urbana',
      'Control de acceso en instalaciones industriales con protocolos de seguridad estrictos',
      'Protección de obras de construcción y proyectos inmobiliarios',
      'Rondas nocturnas en áreas industriales con alta actividad nocturna',
      'Coordinación con seguridad industrial de plantas como ENAP',
    ],
    problems: [
      'Robo de materiales y cobre en obras de construcción y proyectos de renovación urbana',
      'Acceso no autorizado a parques industriales durante fines de semana y feriados',
      'Vulnerabilidad de nuevas urbanizaciones sin comunidad organizada ni infraestructura de seguridad',
      'Vandalismo en propiedades abandonadas o en proceso de demolición',
    ],
    faqs: [
      { q: '¿Qué seguridad ofrecen para la zona industrial de Renca?', a: 'Guardias para parques industriales, plantas de procesamiento y bodegas, con protocolos de control de acceso estrictos y coordinación con seguridad industrial.' },
      { q: '¿Pueden proteger obras de renovación urbana?', a: 'Sí, ofrecemos seguridad para proyectos de construcción y renovación con guardias, Guardpod y sistemas de alarma inalámbricos adaptados a faenas temporales.' },
      { q: '¿Trabajan con instalaciones como la Refinería ENAP?', a: 'Evaluamos cada caso según las necesidades específicas. Tenemos experiencia en entornos industriales de alta sensibilidad con protocolos de seguridad estrictos.' },
    ],
  },

  'la-pintana': {
    name: 'La Pintana', zone: 'sur', zoneLabel: 'Zona Sur', zoneFull: 'sur',
    intro: 'La Pintana es una comuna del sector sur con predominancia residencial, el Parque Mapocho, centros de formación técnica y una creciente actividad comercial. GuardMan Chile protege esta comunidad con servicios accesibles y adaptados a las necesidades de seguridad de sus barrios y comercios.',
    features: [
      'Guardias para condominios y conjuntos habitacionales',
      'Vigilancia de locales comerciales y strip centers',
      'Control de acceso en edificios residenciales con registro digital',
      'Protección de centros educativos y de formación',
      'Rondas nocturnas preventivas en pasajes y áreas residenciales',
      'Coordinación con juntas de vecinos y comités de seguridad',
    ],
    problems: [
      'Robos en viviendas durante horarios laborales, especialmente en pasajes con poca iluminación',
      'Acceso no autorizado a conjuntos habitacionales por porterías sin control efectivo',
      'Hurto en locales comerciales durante cierres nocturnos y fines de semana',
      'Vehículos en la vía pública como objetivo de robo o daños vandálicos',
    ],
    faqs: [
      { q: '¿Qué servicios ofrecen en La Pintana?', a: 'Guardias para condominios y conjuntos habitacionales, vigilancia comercial, protección educativa y control de acceso residencial. Adaptados a las necesidades de la comuna.' },
      { q: '¿Trabajan con juntas de vecinos?', a: 'Sí, coordinamos nuestros servicios con las juntas de vecinos y comités de seguridad de La Pintana, alineando protocolos con las iniciativas comunitarias.' },
      { q: '¿Cuál es el tiempo de respuesta en La Pintana?', a: 'Menos de 15 minutos con vehículos de reacción rápida desplegados en la zona Sur.' },
    ],
  },

  'los-andes': {
    name: 'Los Andes', zone: 'valparaiso', zoneLabel: 'Valparaíso', zoneFull: 'valparaiso',
    intro: 'Los Andes es una ciudad de la Región de Valparaíso con fuerte tradición vitivinícola, acceso al Paso Los Libertadores hacia Argentina, industrias agropecuarias y un creciente desarrollo turístico cordillerano. GuardMan Chile extiende su cobertura a esta zona con servicios adaptados a sus necesidades rurales y urbanas.',
    features: [
      'Guardias para propiedades agrícolas y viñedos',
      'Vigilancia de bodegas y centros de distribución en la zona',
      'Control de acceso para conjuntos residenciales urbanos',
      'Protección de propiedades turísticas y cabañas cordilleranas',
      'Unidades Guardpod para terrenos agrícolas sin infraestructura',
      'Coordinación con Carabineros de la zona de Aconcagua',
    ],
    problems: [
      'Robo de herramientas, maquinaria agrícola y productos en viñedos y fundos',
      'Vulnerabilidad de propiedades turísticas durante temporadas bajas de afluencia',
      'Acceso no autorizado a bodegas de almacenamiento y distribución de productos',
      'Falta de sistemas de seguridad en terrenos agrícolas extensos sin infraestructura eléctrica',
    ],
    faqs: [
      { q: '¿Ofrecen seguridad para viñedos y propiedades agrícolas?', a: 'Sí, es uno de nuestros servicios diferenciadores en Los Andes. Guardias para perímetros agrícolas, unidades Guardpod autónomas y sistemas de alarma inalámbricos.' },
      { q: '¿El Guardpod funciona en terrenos agrícolas sin electricidad?', a: 'Exactamente. Funciona con alimentación autónoma y conectividad 4G, ideal para fundos, viñedos y terrenos agrícolas extensos.' },
      { q: '¿Pueden cubrir propiedades turísticas en la cordillera?', a: 'Sí, evaluamos cada caso según la ubicación. Ofrecemos protección para cabañas, hosterías y propiedades turísticas con soluciones adaptadas.' },
    ],
  },

  'san-felipe': {
    name: 'San Felipe', zone: 'valparaiso', zoneLabel: 'Valparaíso', zoneFull: 'valparaiso',
    intro: 'San Felipe es la capital de la Provincia de Aconcagua, con una economía basada en viñedos, huertos frutales, comercio local y una creciente demanda de seguridad para propiedades agrícolas y urbanas. GuardMan Chile atiende esta ciudad con soluciones que combinan seguridad urbana y rural.',
    features: [
      'Guardias para comercios locales y propiedades urbanas',
      'Vigilancia de huertos frutales y terrenos agrícolas',
      'Control de acceso en condominios y conjuntos residenciales',
      'Protección de bodegas de almacenamiento y distribución de productos agrícolas',
      'Unidades Guardpod para terrenos rurales sin infraestructura',
      'Coordinación con Carabineros de la provincia de Aconcagua',
    ],
    problems: [
      'Robo de productos agrícolas, herramientas y maquinaria en huertos y fundos',
      'Hurto en comercios locales durante horarios de cierre y fines de semana',
      'Vulnerabilidad de propiedades agrícolas extensas sin sistemas de vigilancia',
      'Acceso no autorizado a bodegas de almacenamiento de productos de temporada',
    ],
    faqs: [
      { q: '¿Qué seguridad ofrecen en San Felipe?', a: 'Guardias para comercios y propiedades urbanas, vigilancia agrícola con Guardpod, control de acceso residencial y protección de bodegas de distribución.' },
      { q: '¿Pueden cubrir huertos y terrenos agrícolas?', a: 'Sí, ofrecemos soluciones con unidades Guardpod y guardias para perímetros agrícolas, adaptadas a las necesidades del sector agropecuario.' },
      { q: '¿Tienen cobertura permanente en San Felipe?', a: 'Sí, contamos con presencia operativa permanente en San Felipe y Los Andes, con personal local y coordinación con nuestra central de monitoreo.' },
    ],
  },
};

// ─── Sectores: contenido ÚNICO por industria ──────────────────────
export interface SectorContent {
  name: string
  heroTitle: string
  heroSub: string
  intro: string
  features: { title: string; description: string }[]
  problems: string[]
  faqs: { q: string; a: string }[]
  seoTitle?: string
  seoDescription?: string
}

export const SECTORS: Record<string, SectorContent> = {
  residencial: {
    name: 'Residencial',
    heroTitle: 'Seguridad Residencial Profesional',
    heroSub: 'Guardias certificados OS-10 con experiencia en condominios y comunidades residenciales. Protección 24/7 con control de accesos y monitoreo permanente.',
    intro: 'La seguridad residencial requiere un equilibrio entre protección efectiva y convivencia cotidiana. En GuardMan Chile diseñamos protocolos específicos para condominios, edificios y comunidades, donde cada guardia comprende la dinámica del hogar y actúa con la discreción que merecen los residentes.',
    features: [
      { title: 'Control de acceso en porterías', description: 'Registro digital de visitantes, proveedores y residentes con verificación de identidad y seguimiento de ingresos y salidas.' },
      { title: 'Rondas perimetrales programadas', description: 'Inspecciones regulares de muros, rejas, estacionamientos y áreas comunes según el perfil de riesgo de cada comunidad.' },
      { title: 'Monitoreo integrado con CCTV', description: 'Supervisión de cámaras comunitarias desde nuestro centro de operaciones con alertas ante movimientos sospechosos.' },
      { title: 'Protocolos de emergencia personalizados', description: 'Planes de evacuación, comunicación con Carabineros y procedimientos ante incendios, sismos o situaciones de riesgo.' },
      { title: 'Sistema de guardias de reemplazo', description: 'Personal de reserva garantizado para asegurar continuidad del servicio ante ausencias imprevistas del titular.' },
      { title: 'Reportes diarios de actividad', description: 'Bitácoras digitales con registro de rondas, incidentes y novedades accesibles por la administración del condominio.' },
    ],
    problems: [
      'Ingresos de desconocidos a condominios por falta de verificación efectiva en porterías.',
      'Robo de vehículos y especies en estacionamientos subterráneos durante la noche.',
      'Ausencia de patrullaje nocturno en pasajes y áreas comunes interiores del condominio.',
    ],
    faqs: [
      { q: '¿Cuánto cuesta contratar un guardia para un residencial?', a: 'Varía según la cantidad de guardias, turnos requeridos y características del condominio. Ofrecemos cotizaciones personalizadas sin compromiso donde evaluamos las necesidades específicas de su comunidad.' },
      { q: '¿Los guardias pueden actuar ante emergencias?', a: 'Tienen facultades para realizar acciones preventivas y de disuasión. Su rol es detectar irregularidades, controlar accesos y reportar incidentes a supervisores y autoridades competentes.' },
      { q: '¿Puedo contratar solo para horarios nocturnos?', a: 'Sí, ofrecemos turnos flexibles: diurnos, nocturnos, 4x4, 6x1, 5x2 o cobertura 24/7 continua según las necesidades de su comunidad.' },
    ],
  },

  comercial: {
    name: 'Comercial',
    heroTitle: 'Seguridad para el Sector Comercial',
    heroSub: 'Proteja su negocio con guardias certificados OS-10, prevención de hurto y control de aforo. Cobertura en 14 comunas de la Región Metropolitana.',
    intro: 'El comercio minorista enfrenta riesgos específicos: hurto interno y externo, accesos sin control durante horas pico y vandalismo en horarios de cierre. GuardMan Chile diseña protocolos de seguridad comerciales que protegen su inventario sin interferir con la experiencia de compra de sus clientes.',
    features: [
      { title: 'Prevención de hurto con presencia disuasoria', description: 'Guardias posicionados estratégicamente para disuadir el hurto en tiendas, locales y paseos comerciales.' },
      { title: 'Control de aforo durante eventos de alta demanda', description: 'Gestión de flujos de público para Black Friday, lanzamientos y temporadas de alta afluencia sin aglomeraciones.' },
      { title: 'Coordinación con administración de malls', description: 'Protocolos alineados con la seguridad del centro comercial para una respuesta integrada ante incidentes.' },
      { title: 'Turnos adaptados a horarios comerciales', description: 'Cobertura que coincide con los horarios de apertura, cierre y períodos de mayor actividad del negocio.' },
      { title: 'Vigilancia de bodegas y áreas de almacenamiento', description: 'Control de acceso a zonas de stock y descarga de mercadería para prevenir pérdidas internas.' },
      { title: 'Reportes de incidentes con evidencia', description: 'Registro detallado de cada evento con fotografías y datos para investigación y respaldo ante aseguradoras.' },
    ],
    problems: [
      'Hurto en tiendas durante horarios de alta afluencia por falta de vigilancia visual en el piso de ventas.',
      'Accesos sin control a bodegas y áreas de almacenamiento donde se concentra el inventario de mayor valor.',
      'Vandalismo en locales comerciales durante la noche o fines de semana sin presencia disuasoria.',
    ],
    faqs: [
      { q: '¿Cuántos guardias se necesitan para un local comercial?', a: 'Depende del tamaño, horarios, tipo de mercadería y nivel de riesgo. Recomendamos evaluación en terreno para determinar el número óptimo de personal.' },
      { q: '¿Trabajan con horarios de mall?', a: 'Sí, coordinamos con la administración del mall y sus protocolos de seguridad para una operación integrada.' },
      { q: '¿Pueden manejar eventos como Black Friday?', a: 'Por supuesto. Diseñamos planes especiales con refuerzo temporal de personal y coordinación con Carabineros para eventos de alta demanda.' },
    ],
  },

  industrial: {
    name: 'Industrial',
    heroTitle: 'Seguridad Industrial Profesional',
    heroSub: 'Guardias con experiencia en plantas manufactureras, bodegas y centros de distribución. Control de carga, rondas perimetrales y supervisión 24/7.',
    intro: 'Las instalaciones industriales presentan desafíos únicos: perímetros extensos, maquinaria de alto valor, materiales peligrosos y operaciones nocturnas. GuardMan Chile cuenta con guardias formados específicamente para entornos industriales, comprendiendo la dinámica de turnos, la coordinación con producción y los protocolos de seguridad laboral.',
    features: [
      { title: 'Guardias con formación industrial específica', description: 'Personal capacitado para trabajar en zonas con maquinaria, sustancias peligrosas, altas temperaturas y condiciones de ruido.' },
      { title: 'Control de carga y descarga digital', description: 'Registro de vehículos, conductores y mercadería con verificación documental en puntos de ingreso y egreso.' },
      { title: 'Rondas programadas y aleatorias', description: 'Inspecciones periódicas y sorpresivas para cubrir perímetros extensos y múltiples puntos de acceso.' },
      { title: 'Planes de emergencia y evacuación', description: 'Diseñados según normativa chilena y regulaciones internas del cliente para cada tipo de riesgo industrial.' },
      { title: 'Informes de gestión mensuales', description: 'Estadísticas de incidentes, rondas realizadas y cumplimiento de protocolos para la toma de decisiones.' },
      { title: 'Integración con sistemas de alarma', description: 'Conexión con alarmas, control de acceso biométrico y domótica existente en la planta industrial.' },
    ],
    problems: [
      'Robo de materiales y maquinaria durante turnos nocturnos cuando la vigilancia disminuye.',
      'Ingresos no autorizados por perímetros extensos con múltiples puntos de vulnerabilidad.',
      'Pérdidas por control deficiente de salida de mercadería y materiales sin trazabilidad.',
      'Incidentes de seguridad por falta de vigilancia durante turnos nocturnos o festivos.',
    ],
    faqs: [
      { q: '¿Qué tipo de industrias protegen?', a: 'Plantas manufactureras, centros de distribución, bodegas, faenas mineras, parques industriales, plantas de alimentos y empresas logísticas.' },
      { q: '¿Cómo manejan el control de carga y descarga?', a: 'Registro digital de vehículos, conductores y mercadería con verificación de documentación y coordinación con el personal de logística.' },
      { q: '¿Tienen experiencia con empresas certificadas ISO?', a: 'Sí, trabajamos con empresas certificadas ISO 28000 y adaptamos nuestros protocolos a sus estándares internos de seguridad en la cadena de suministro.' },
    ],
  },

  construccion: {
    name: 'Construcción',
    heroTitle: 'Seguridad para Obras de Construcción',
    heroSub: 'Proteja su faena con guardias, unidades Guardpod y sistemas de alarma. Más de 10 años protegiendo proyectos de construcción en toda la Región Metropolitana.',
    intro: 'Las obras de construcción presentan vulnerabilidades únicas: perímetros abiertos, herramientas y materiales de alto valor expuestos, y períodos prolongados sin actividad. GuardMan Chile ofrece soluciones específicas para faenas, desde guardias presenciales hasta unidades Guardpod autónomas para terrenos sin infraestructura eléctrica.',
    features: [
      { title: 'Guardias con experiencia en faenas', description: 'Personal formado en la dinámica de obras de construcción, con conocimiento de riesgos específicos del rubro.' },
      { title: 'Unidades Guardpod para terrenos sin infraestructura', description: 'Vigilancia autónoma con cámaras PTZ y detección IA para obras en terrenos baldíos o zonas sin electricidad.' },
      { title: 'Control de acceso con registro de trabajadores', description: 'Registro digital de entrada y salida de trabajadores, visitantes y vehículos autorizados en la faena.' },
      { title: 'Protección de bodegaje y maquinaria', description: 'Vigilancia de zonas donde se almacenan herramientas, materiales y equipos de alto valor.' },
      { title: 'Planes de emergencia para obras', description: 'Protocolos de evacuación y respuesta adaptados a las características específicas de cada proyecto en construcción.' },
      { title: 'Cobertura en comunas clave para la construcción', description: 'Presencia en Las Condes, Vitacura, Lo Barnechea, Pudahuel, Quilicura, Lampa, Huechuraba y más.' },
    ],
    problems: [
      'Robo de materiales, herramientas y equipos durante la noche o fines de semana en faenas inactivas.',
      'Ingresos no autorizados por perímetros sin cerramiento adecuado en obras en etapa inicial.',
      'Falta de vigilancia en obras paralizadas por falta de financiamiento o permisos.',
    ],
    faqs: [
      { q: '¿Pueden cubrir obras en zonas remotas?', a: 'Sí, con unidades Guardpod autónomas con conectividad 4G, sin necesidad de infraestructura eléctrica ni de red.' },
      { q: '¿Cómo manejan los cambios de turno de trabajadores?', a: 'Control de acceso con registro digital de ingresos y salidas, ideal para la rotación típica de faenas de construcción.' },
      { q: '¿Pueden cubrir múltiples faenas simultáneas?', a: 'Sí, con supervisores zonales que coordinan las operaciones en múltiples proyectos en paralelo.' },
    ],
  },

  educacion: {
    name: 'Educación',
    heroTitle: 'Seguridad para Instituciones Educacionales',
    heroSub: 'Guardias con formación en protocolos educativos, control de accesos escolares y gestión de emergencias para colegios, universidades y centros de formación.',
    intro: 'Las instituciones educacionales requieren un enfoque de seguridad que combine protección efectiva con un ambiente acogedor. GuardMan Chile forma a sus guardias en protocolos específicos para entornos educativos, incluyendo manejo de situaciones de crisis y coordinación con equipos directivos.',
    features: [
      { title: 'Control de accesos con registro de visitantes', description: 'Verificación de identidad y registro de ingresos de estudiantes, personal externo y visitantes al establecimiento.' },
      { title: 'Rondas perimetrales según horarios escolares', description: 'Patrullaje adaptado a los períodos de mayor actividad: ingreso, recreos, salida y eventos especiales.' },
      { title: 'Botones de pánico y comunicación interna', description: 'Sistemas de alerta inmediata con radios push-to-talk para coordinación rápida ante situaciones de riesgo.' },
      { title: 'Protocolos de emergencia escolar', description: 'Procedimientos específicos para evacuación, sismo, incendio y situaciones de crisis en el entorno educativo.' },
      { title: 'Personal capacitado en primeros auxilios', description: 'Guardias con formación en atención inmediata de emergencias médicas en el campus o recinto educacional.' },
      { title: 'Presencia disuasoria preventiva', description: 'La presencia visible de seguridad reduce intentos de ingreso no autorizado y mejora la percepción de seguridad.' },
    ],
    problems: [
      'Ingreso de personas ajenas al establecimiento sin control ni verificación de identidad.',
      'Ausencia de protocolos claros de emergencia escolar ante sismos, incendios o situaciones de crisis.',
      'Robo de equipos y materiales en horarios no lectivos cuando el establecimiento está vacío.',
    ],
    faqs: [
      { q: '¿Manejan protocolos para situaciones de bullying?', a: 'Sí, nuestros guardias están capacitados en detección y prevención de situaciones de acoso, con protocolos de actuación inmediata y coordinación con el equipo directivo.' },
      { q: '¿Pueden cubrir eventos como actos o graduaciones?', a: 'Por supuesto, ofrecemos cobertura especializada para eventos masivos en recintos educacionales con control de accesos y gestión de aforo.' },
      { q: '¿Tienen experiencia con universidades?', a: 'Sí, trabajamos con colegios, institutos profesionales y universidades, adaptándonos a sus reglamentos internos y necesidades específicas.' },
    ],
  },

  eventos: {
    name: 'Eventos',
    heroTitle: 'Seguridad para Eventos en Chile',
    heroSub: 'Planificación de seguridad personalizada para eventos corporativos, sociales y masivos con guardias OS-10 y unidades Guardpod.',
    intro: 'Cada evento es único y requiere un plan de seguridad diseñado a medida. Ya sea una boda íntima, un congreso corporativo o un concierto masivo, GuardMan Chile planifica la seguridad considerando el tipo de evento, el perfil de los asistentes y las características del recinto.',
    features: [
      { title: 'Planificación según tipo de evento', description: 'Diseño de protocolos personalizados para eventos corporativos, sociales, deportivos y culturales según tamaño y complejidad.' },
      { title: 'Control de accesos y gestión de aforo', description: 'Registro de invitados, control de aforo y coordinación de flujos para evitar aglomeraciones y accesos no autorizados.' },
      { title: 'Unidades Guardpod para perímetro', description: 'Vigilancia autónoma con cámaras PTZ y detección IA para eventos al aire libre o en recintos sin infraestructura.' },
      { title: 'Coordinación con Carabineros', description: 'Protocolos de coordinación directa para eventos de alta concurrencia, desvíos de tránsito y permisos municipales.' },
      { title: 'Personal con formación en emergencias', description: 'Guardias capacitados en primeros auxilios, manejo de multitudes y evacuación de recintos.' },
      { title: 'Reporte post-evento', description: 'Informe detallado de incidencias, tiempos de respuesta y recomendaciones de mejora para futuros eventos.' },
    ],
    problems: [
      'Falta de control de aforo que genera aglomeraciones y riesgo de accidentes en eventos masivos.',
      'Accesos no supervisados que permiten el ingreso de personas sin invitación ni verificación.',
      'Emergencias sin protocolos de evacuación claros ni coordinación con servicios de emergencia.',
    ],
    faqs: [
      { q: '¿Trabajan con productoras de eventos?', a: 'Sí, nos integramos con el equipo de producción, adaptándonos a los riders técnicos y requisitos específicos de cada evento.' },
      { q: '¿Pueden coordinar con Carabineros para cortes de calle?', a: 'Sí, tenemos experiencia gestionando coordinación con Carabineros para desvíos, permisos municipales y seguridad vial.' },
      { q: '¿Manejan eventos con personalidades VIP?', a: 'Por supuesto, contamos con personal PPI especializado y protocolos de protección VIP para invitados de alto perfil.' },
    ],
  },

  hoteleria: {
    name: 'Hotelería',
    heroTitle: 'Seguridad para Hoteles',
    heroSub: 'Protección discreta y profesional para establecimientos hoteleros con guardias certificados y monitoreo 24/7 en 14 comunas.',
    intro: 'La seguridad hotelera exige un equilibrio delicado: proteger huéspedes, personal y activos sin alterar la experiencia de hospitalidad. GuardMan Chile forma a sus guardias en atención al cliente hotelero, discreción profesional y protocolos específicos para el entorno de alojamiento.',
    features: [
      { title: 'Guardias con especialización hotelera', description: 'Personal formado en atención al cliente, manejo de situaciones delicadas y protocolos de discreción profesional.' },
      { title: 'Control de acceso a zonas de huéspedes', description: 'Verificación de identidad en ascensores, pasillos y áreas exclusivas para prevenir ingresos no autorizados.' },
      { title: 'Patrullaje nocturno adaptado', description: 'Rondas diseñadas según los horarios de mayor actividad del hotel: check-in, check-out y períodos de baja afluencia.' },
      { title: 'Integración con sistemas CCTV existentes', description: 'Trabajamos con la infraestructura tecnológica del hotel y asesoramos en mejoras de cobertura y calidad.' },
      { title: 'Servicio PPI para huéspedes VIP', description: 'Acompañamiento y protección bajo protocolo de PPI para ejecutivos y personalidades que requieran seguridad adicional durante su estadía.' },
      { title: 'Capacitación al personal del hotel', description: 'Formación en primeros auxilios y procedimientos de seguridad básica para el equipo del establecimiento.' },
    ],
    problems: [
      'Ingreso de personas ajenas a zonas exclusivas de huéspedes como pisos, piscinas o áreas de spa.',
      'Robo de equipaje y objetos de valor en áreas comunes, recepción o habitaciones durante ausencias.',
      'Falta de seguridad discreta que altere la experiencia de hospitalidad del establecimiento.',
    ],
    faqs: [
      { q: '¿Se integran con nuestro sistema de llaves electrónicas?', a: 'Sí, trabajamos con los principales sistemas del mercado y podemos integrar control de accesos y CCTV con la infraestructura existente del hotel.' },
      { q: '¿Tienen experiencia con hoteles boutique?', a: 'Por supuesto, nuestro servicio se adapta al nivel de sofisticación y discreción que requiere cada tipo de establecimiento, desde hoteles boutique hasta cadenas internacionales.' },
      { q: '¿Pueden cubrir eventos privados en el hotel?', a: 'Sí, ofrecemos cobertura especializada para bodas, conferencias y eventos corporativos realizados dentro del establecimiento.' },
    ],
  },

  salud: {
    name: 'Salud',
    heroTitle: 'Seguridad Hospitalaria y Clínica OS-10 en Chile',
    heroSub: 'Protección profesional para hospitales, clínicas, laboratorios y centros médicos con guardias certificados OS-10 y protocolos adaptados al ambiente hospitalario.',
    seoTitle: 'Seguridad para Hospitales y Clínicas OS-10 en Santiago | GuardMan Chile',
    seoDescription: 'Seguridad privada OS-10 para hospitales, clínicas, laboratorios y centros médicos en Santiago y 14 comunas de la Región Metropolitana. Control de acceso a pabellones, UCI, urgencias y farmacias. Personal con protocolo hospitalario, manejo de conflictos y confidencialidad médica. Cotice en 24 horas.',
    intro: 'El sector salud en Chile opera con estándares de exigencia únicos: áreas restringidas con acceso crítico como pabellones, UCI y farmacias de alto costo, pacientes en situaciones vulnerables, medicamentos de alto valor y la necesidad permanente de mantener un ambiente de calma. GuardMan Chile forma a sus guardias en protocolos hospitalarios que combinan seguridad efectiva con sensibilidad hacia pacientes, personal médico y visitantes, con presencia operativa en 14 comunas de la Región Metropolitana.',
    features: [
      { title: 'Control de acceso en áreas críticas', description: 'Verificación de identidad en urgencias, pabellones quirúrgicos, UCI/UTI, farmacias y unidades de alto riesgo con lectores biométricos y registro digital de cada ingreso.' },
      { title: 'Gestión de visitantes y acompañantes', description: 'Registro digital, acreditación con foto y acompañamiento de visitas con verificación de identidad y control riguroso de horarios de visita.' },
      { title: 'Coordinación con seguridad interna del recinto', description: 'Trabajo articulado con el equipo de seguridad del establecimiento, comité de emergencias y protocolos clínicos propios de cada recinto.' },
      { title: 'Rondas perimetrales y videovigilancia', description: 'Vigilancia en tiempo real de accesos principales, estacionamientos, salas de espera y perímetros para prevenir ingresos no autorizados.' },
      { title: 'Reportes auditables con registro horario', description: 'Informes fotográficos y cronológicos de cada evento, con respaldo ante auditorías ministeriales, aseguradoras y sumarios sanitarios.' },
      { title: 'Formación en ambiente hospitalario', description: 'Guardias capacitados en confidencialidad médica, manejo de pacientes agitados, contención verbal y trato respetuoso con personal de salud.' },
    ],
    problems: [
      'Acceso no autorizado a áreas restringidas como pabellones, UCI, salas de procedimientos y farmacias con medicamentos de alto costo.',
      'Agresiones al personal médico, enfermeras y personal de atención en servicios de urgencia y consultas ambulatorias.',
      'Robo de insumos médicos críticos, medicamentos controlados y equipos portátiles como monitores y bombas de infusión.',
      'Filtración de pacientes psiquiátricos, familiares agresivos o personas en crisis que alteran la operación del recinto.',
    ],
    faqs: [
      { q: '¿Tienen experiencia con clínicas y hospitales de alta complejidad?', a: 'Sí, trabajamos con clínicas, hospitales y centros médicos de alta complejidad, incluyendo pabellones quirúrgicos, UCI, neonatología, diálisis y áreas de manejo de sustancias controladas.' },
      { q: '¿Pueden manejar pacientes agresivos o en crisis?', a: 'Nuestros guardias están capacitados en técnicas de desescalada verbal, manejo no violento de conflictos y contención física solo cuando es estrictamente necesaria, priorizando la protección del personal médico y de otros pacientes.' },
      { q: '¿Cumplen con protocolos de confidencialidad médica?', a: 'Todos nuestros guardias firman acuerdos de confidencialidad, conocen la Ley 19.628 de protección de datos personales y cumplen con los protocolos internos del recinto sobre historia clínica y datos sensibles.' },
      { q: '¿Coordinan con la seguridad interna del hospital o clínica?', a: 'Sí, operamos como extensión del equipo de seguridad del establecimiento, con canales de comunicación directa, protocolos conjuntos y reuniones periódicas de coordinación.' },
      { q: '¿Cubren turnos 24/7 en recintos hospitalarios?', a: 'Sí, ofrecemos cobertura continua con turnos 4x4 o 6x1 según la necesidad del recinto, con personal de respaldo garantizado para evitar vacíos en la cobertura.' },
    ],
  },

  automotriz: {
    name: 'Automotriz',
    heroTitle: 'Seguridad para el Sector Automotriz',
    heroSub: 'Protección para concesionarios, talleres y plantas automotrices con control de llaves, vigilancia nocturna y monitoreo 24/7.',
    intro: 'El sector automotriz maneja activos de alto valor: vehículos en exhibición, inventario en bodegas, herramientas especializadas y la trazabilidad de llaves. GuardMan Chile ofrece protocolos específicos para concesionarios y plantas que integran vigilancia, control de acceso y gestión de inventario físico.',
    features: [
      { title: 'Control de llaves con trazabilidad', description: 'Sistema de registro digital de quién retira y devuelve cada llave de vehículo, con verificación de identidad.' },
      { title: 'Vigilancia nocturna de exhibición', description: 'Supervisión de vehículos en exhibición exterior e interior durante horarios de cierre del concesionario.' },
      { title: 'Control de acceso vehicular y peatonal', description: 'Registro de ingresos y salidas de vehículos de clientes, proveedores y personal con verificación documental.' },
      { title: 'Alarmas perimetrales integradas', description: 'Instalación de sensores perimetrales conectados a nuestra central de monitoreo para alertas inmediatas.' },
      { title: 'Cobertura para eventos de lanzamiento', description: 'Seguridad especializada para presentaciones de nuevos modelos y eventos corporativos del sector.' },
      { title: 'Respuesta coordinada con Carabineros', description: 'Tiempos garantizados de respuesta ante alarmas con coordinación directa a Carabineros de Chile.' },
    ],
    problems: [
      'Robo de vehículos en exhibición y estacionamientos durante la noche o fines de semana.',
      'Pérdida o robo de llaves con acceso a múltiples unidades de inventario.',
      'Daños vandálicos sin cobertura de cámaras que permita identificar a los responsables.',
    ],
    faqs: [
      { q: '¿Pueden controlar llaves de múltiples unidades?', a: 'Sí, implementamos sistemas de control y trazabilidad de llaves con registro digital de cada movimiento.' },
      { q: '¿Manejan eventos de lanzamiento de vehículos?', a: 'Por supuesto, ofrecemos cobertura especializada para eventos corporativos y lanzamientos automotrices con control de accesos y gestión de invitados.' },
      { q: '¿Cubren plantas automotrices?', a: 'Sí, tenemos experiencia protegiendo plantas de ensamblaje con vigilancia perimetral y control de acceso a áreas sensibles.' },
    ],
  },

  deportivo: {
    name: 'Deportivo',
    heroTitle: 'Seguridad para el Sector Deportivo',
    heroSub: 'Protección para clubes, recintos deportivos y eventos masivos con control de multitudes, resguardo de jugadores y coordinación con Carabineros.',
    intro: 'El sector deportivo requiere seguridad especializada que combine control de multitudes, protección de jugadores y delegaciones, y vigilancia perimetral de recintos. GuardMan Chile cuenta con experiencia en eventos deportivos de diversa escala, desde partidos de fútbol hasta maratones y competencias nacionales.',
    features: [
      { title: 'Control de multitudes en eventos', description: 'Coordinación de flujos de público, tribunas y zonas críticas durante partidos y competencias deportivas.' },
      { title: 'Resguardo de jugadores y delegaciones', description: 'Acompañamiento y protección en traslados entre hotel, aeropuerto, centro de entrenamiento y estadio.' },
      { title: 'Control de accesos con verificación de credenciales', description: 'Gestión de entradas, listas de invitados y acceso a zonas VIP, prensa y áreas restringidas.' },
      { title: 'Protección perimetral de recintos', description: 'Vigilancia de canchas, graderías, estacionamientos y zonas de entrenamiento fuera de horario de competencia.' },
      { title: 'Coordinación con Carabineros para alta convocatoria', description: 'Protocolos integrados con Carabineros y organismos de seguridad para eventos de gran envergadura.' },
      { title: 'CCTV y monitoreo en tiempo real', description: 'Sistemas de cámaras y supervisión permanente para resguardo de instalaciones deportivas las 24 horas.' },
    ],
    problems: [
      'Ingreso de personas no autorizadas a zonas de jugadores, vestuarios o áreas restringidas del recinto.',
      'Aglomeraciones y descontrol en accesos durante eventos masivos con alta afluencia de público.',
      'Vandalismo y daños en canchas, graderías y estacionamientos fuera de horario de competencia.',
      'Falta de resguardo a delegaciones deportivas en traslados entre hotel, aeropuerto y recinto.',
    ],
    faqs: [
      { q: '¿Tienen experiencia con clubes profesionales?', a: 'Sí, trabajamos con clubes y organizadores de eventos deportivos de diversa escala. Nuestro personal está capacitado en control de multitudes, resguardo de jugadores y coordinación con Carabineros.' },
      { q: '¿Pueden cubrir partidos con hinchada visitante?', a: 'Sí, diseñamos planes específicos con separación de parcialidades, control de accesos por sector y coordinación con la seguridad del club y Carabineros.' },
      { q: '¿Ofrecen resguardo de jugadores fuera del recinto?', a: 'Sí, brindamos acompañamiento a jugadores, cuerpos técnicos y delegaciones en traslados con personal capacitado en protección de personas.' },
      { q: '¿Pueden proteger recintos fuera de horario de competencia?', a: 'Por supuesto. Ofrecemos vigilancia perimetral 24/7 con rondas programadas, CCTV y respuesta ante alarmas.' },
    ],
  },
};

// ─── Clientes (homepage carousel) ────────────────────────────────
export const CLIENTES = [
  { name: 'Mall Premium', initials: 'MP', color: '#3B82F6' },
  { name: 'Banco Regional', initials: 'BR', color: '#10B981' },
  { name: 'Hotel Plaza', initials: 'HP', color: '#F59E0B' },
  { name: 'Clínica Las Condes', initials: 'CLC', color: '#8B5CF6' },
  { name: 'Inmobiliaria Andes', initials: 'IA', color: '#EF4444' },
  { name: 'Grupo Delta', initials: 'GD', color: '#06B6D4' },
  { name: 'Constructora Norte', initials: 'CN', color: '#EC4899' },
  { name: 'Colegio San Patricio', initials: 'CSP', color: '#84CC16' },
];

// ─── Hero stats (homepage) ────────────────────────────────────────
export const HERO_STATS = [
  { value: '10+', label: 'Años de experiencia' },
  { value: '200+', label: 'Guardias certificados' },
  { value: '14', label: 'Comunas cubiertas' },
];

// ─── Nosotros timeline (extraído del live) ───────────────────────
export const NOSOTROS_TIMELINE = [
  { year: '2014', title: 'Fundación de GuardMan Chile', text: 'GuardMan Chile inicia operaciones en Santiago con la misión de ofrecer servicios de seguridad privada de excelencia, comenzando con un equipo fundador de guardias certificados OS-10.' },
  { year: '2017', title: 'Consolidación en el mercado metropolitano', text: 'Tras sus primeros años, la empresa consolida su presencia en la Región Metropolitana, sumando sus primeros clientes corporativos y residenciales y fortaleciendo su academia interna de capacitación.' },
  { year: '2020', title: 'Inauguración del central de monitoreo', text: 'Se instala un central de monitoreo propio con tecnología de punta, permitiendo supervisión en tiempo real y respuesta inmediata, elevando los estándares de seguridad para los clientes.' },
  { year: '2023', title: 'Expansión a 200+ guardias y 14 comunas', text: 'GuardMan Chile supera los 200 guardias certificados OS-10, cubriendo 14 comunas de la Región Metropolitana, posicionándose como un actor relevante en la seguridad privada local.' },
  { year: '2024', title: 'Lanzamiento de Guardpod', text: 'Se introduce Guardpod, un sistema autónomo de vigilancia que integra cámaras PTZ, detección por inteligencia artificial y alimentación autónoma, optimizando la gestión de seguridad para clientes.' },
];

// ─── Zonas (cobertura) ────────────────────────────────────────────
export const ZONAS = [
  { name: 'Centro', locations: ['Santiago Centro'] },
  { name: 'Norte', locations: ['Huechuraba', 'Lampa', 'Quilicura'] },
  { name: 'Oriente', locations: ['La Reina', 'Las Condes', 'Lo Barnechea', 'Vitacura'] },
  { name: 'Poniente', locations: ['Conchalí', 'Pudahuel', 'Renca'] },
  { name: 'Sur', locations: ['La Pintana'] },
  { name: 'Valparaíso', locations: ['Los Andes', 'San Felipe'] },
];