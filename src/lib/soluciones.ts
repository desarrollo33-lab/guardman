// ════════════════════════════════════════════════════════════════
// GuardMan Chile — Soluciones integradas (Fase 4)
// ════════════════════════════════════════════════════════════════
//
// El nicho que nos pertenece por estructura de empresa: un solo
// proveedor para seguridad privada y aseo. La investigacion de SERP
// (2026-10-02) mostro que en "seguridad y aseo para condominios" y
// "empresa que contrata seguridad y aseo" solo compiten empresas de
// multiservicios sin contenido editorial. El unico con SERP solida
// es promarcochile.cl, que es solo aseo.
//
// El argumento comercial no es "hacemos más servicios". Es el problema
// de coordinacion, que es real y esta documentado en el propio repo
// (content.ts, problemas del servicio de aseo):
//   "Coordinación deficiente entre aseo y seguridad, generando pérdida
//    de llaves o accesos no controlados."
//
// Eso es lo unico que un proveedor de seguridad y uno de aseo no pueden
// resolver por separado.

export interface SolutionPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  updatedISO: string;
  /**
   * Etiqueta corta del tipo de cliente. Va en el badge del hero y en el
   * schema, donde el espacio es limitado: "Condominios", no la frase
   * completa. Antes `audience` hacía los dos trabajos —etiqueta y
   * descripción— y el resultado era un texto de 68 caracteres dentro de
   * un pill, que se desborda en móvil.
   */
  audience: string;
  /** Descripción larga del tipo de cliente, para la tarjeta del índice. */
  audienceLong: string;
  /** El problema de coordinacion, que es el argumento central. */
  coordinationProblem: { title: string; body: string }[];
  /** Servicios incluidos, con el rol de cada uno. */
  services: { name: string; role: string; detail: string }[];
  /** Como se opera el sitio para que ambos servicios no se estorben. */
  operation: { step: string; detail: string }[];
  sections: { heading: string; body: string[] }[];
  faqs: { q: string; a: string }[];
}

export const SOLUTIONS: SolutionPage[] = [
  {
    slug: 'condominio-seguridad-y-aseo',
    title: 'Seguridad y aseo para condominios',
    metaTitle: 'Seguridad y aseo para condominios en Santiago',
    metaDescription:
      'Un solo proveedor para seguridad y aseo en condominios. Menos coordinadores, acceso controlado a los espacios de limpieza y responsable único ante incidentes.',
    h1: 'Seguridad y aseo para condominios, con un solo responsable',
    lead:
      'Un condominio con vigilancia y con aseo tiene dos empresas coordinándose todos los días. El punto de fricción siempre es el mismo: el acceso de las equipes de limpieza y el control de quién entra y sale.',
    updatedISO: '2026-10-02',
    audience: 'Condominios',
    audienceLong: 'Administraciones de condominios residenciales en Santiago y Valparaíso',
    coordinationProblem: [
      {
        title: 'Las llaves y los accesos que nadie controla',
        body: 'Las equipes de aseo necesitan llaves, códigos y acceso a espacios comunes, estacionamientos y dependencias de servicio. Cuando eso se resuelve con llaves en formato físico y confianza, el control de acceso pierde su sentido en exactamente las horas en que el edificio está vacío.',
      },
      {
        title: 'El personal de limpieza sin acreditación en un sitio vigilado',
        body: 'Un guardia que controla el acceso y un equipo de aseo que entra a zonas comunes y estacionamientos sin registro es una inconsistencia que cualquier auditoría del edificio detecta. El acceso del personal de servicios también se registra.',
      },
      {
        title: 'Dos proveedores, dos versiones de los hechos',
        body: 'Cuando ocurre algo, cada empresa cuenta lo que vio. El registro de acceso dice una cosa, el parte de aseo dice otra, y la administración termina sin una versión única. Con un proveedor, el registro es uno.',
      },
    ],
    services: [
      {
        name: 'Vigilancia y control de accesos',
        role: 'Puesto de guardia',
        detail:
          'Control de acceso vehicular y peatonal, registro de visitas y entregas, y rondas preventivas sobre accesos, estacionamientos y zonas comunes.',
      },
      {
        name: 'Aseo de áreas comunes',
        role: 'Servicio de aseo',
        detail:
          'Limpieza de halls, ascensores, escaleras y zonas comunes, con personal uniformado, productos certificados y supervisión de terreno asignada a la cuenta.',
      },
      {
        name: 'Control del acceso de servicio',
        role: 'Coordinación',
        detail:
          'El equipo de aseo entra con registro, credencial propia y horario definido. El guardia sabe quién entra a limpiar y a qué hora, sin depender de llaves entregadas informalmente.',
      },
      {
        name: 'Coordinación con la administración',
        role: 'Interlocutor único',
        detail:
          'Un solo canal de comunicación con la administración del condominio para seguridad, aseo e incidencias. Sin intermediarios entre el incidente y quien tiene que resolverlo.',
      },
    ],
    operation: [
      {
        step: 'Accesos diferenciados por tipo de servicio',
        detail:
          'Los ingresos de visitas, proveedores y personal de limpieza se registran en categorías distintas, con horarios esperados para cada una. La operación nocturna del sitio es la que más se beneficia de esta separación.',
      },
      {
        step: 'Personal de aseo con identificación propia',
        detail:
          'Cada colaborador del servicio de aseo porta identificación visible y trabaja con un supervisor de terreno asignado a la cuenta, independiente de la operación de vigilancia.',
      },
      {
        step: 'Reporte único',
        detail:
          'Un solo informe mensual con cobertura de turnos, registro de accesos, incidencias y ejecución del plan de aseo. La administración recibe el estado del condominio en un documento.',
      },
      {
        step: 'Responsable único ante incidentes',
        detail:
          'Cuando ocurre algo, hay un interlocutor. No hay que determinar primero a qué empresa corresponde el hecho.',
      },
    ],
    sections: [
      {
        heading: 'Por qué dos empresas no es un problema teórico',
        body: [
          'La razón por la que casi todos los condominios tienen dos proveedores no es técnica, es histórica: son compras separadas por proveedor, cada una con su cotización, su contrato y su propia lógica.',
          'El resultado es que la coordinación entre ellas no la lidera nadie. El guardia no sabe qué va a pasar con la limpieza, el equipo de aseo no tiene instrucción de seguridad, y la administración termina arbitrando diferencias todos los meses.',
          'Cuando los dos servicios son provistos por una sola empresa, la coordinación deja de ser un problema de las partes y pasa a ser parte de la operación. Eso es la diferencia real entre la lista de servicios y el servicio integrado.',
        ],
      },
      {
        heading: 'El punto de mayor riesgo es la noche',
        body: [
          'En la mayoría de los condominios, la franja de mayor exposición es la noche: el edificio está vacío o con muy pocos residentes, el personal de aseo ya se retiró o entra temprano, y la operación se reduce a la vigilancia.',
          'Es también la franja en que los accesos de servicio son más sensibles, porque la supervisión es menor y el registro importa más. Un servicio integrado puede diseñar la cobertura de esa franja con la información de las otras operaciones.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿El personal de aseo necesita acreditación OS-10?',
        a: 'No. El personal de aseo no requiere acreditación OS-10 para realizar tareas de limpieza. La acreditación es necesaria cuando la persona ejerce funciones de seguridad, vigilancia o control de acceso. Lo que sí se controla en un servicio integrado es que el acceso del personal de limpieza quede registrado por el sistema de vigilancia.',
      },
      {
        q: '¿Podemos contratar solo la vigilancia o solo el aseo?',
        a: 'Sí. Los servicios se pueden contratar por separado. El valor del servicio integrado aparece cuando ambos van juntos: ahí es que se resuelven los problemas de acceso de servicio, la coordinación de horarios y el reporte único.',
      },
      {
        q: '¿El equipo de aseo entra a zonas restringidas?',
        a: 'Solo a las zonas que la administración autorice, y siempre con registro. Las zonas de acceso restringido —salas de servidores, bodegas de elementos sensibles, dependencias de llaves— se definen en conjunto y quedan fuera del alcance del aseo.',
      },
      {
        q: '¿Cómo cambia el costo respecto a contratar por separado?',
        a: 'Depende del alcance. Puede haber savings en la administración de la relación y en la coordinación, y también puede haber diferencias en el precio de cada servicio. La propuesta se entrega con el alcance detallado de ambos, para que se pueda comparar con la de los proveedores actuales.',
      },
    ],
  },

  {
    slug: 'edificio-corporativo-cctv-y-aseo',
    title: 'Videovigilancia y aseo para edificios corporativos',
    metaTitle: 'CCTV y aseo para edificios de oficinas',
    metaDescription:
      'Videovigilancia y aseo coordinados en edificios de oficinas. Control de acceso, cámaras y limpieza con un solo responsable operativo.',
    h1: 'Videovigilancia y aseo para edificios corporativos',
    lead:
      'En un edificio de oficinas, la videovigilancia y el aseo se complementan de una forma que rara vez se diseña en conjunto: las cámaras ven los accesos y los espacios comunes, y el aseo los mantiene en condiciones de uso y de seguridad.',
    updatedISO: '2026-10-02',
    audience: 'Edificios corporativos',
    audienceLong: 'Edificios de oficinas, torres y centros corporativos en Santiago',
    coordinationProblem: [
      {
        title: 'Cámaras que capturan de más y vigilan de menos',
        body: 'Es un problema común: el sistema de videovigilancia registra un alto volumen de imágenes y sin embargo no cubre los puntos que de verdad importan. La causa habitual es que la instalación se dimensionó por cantidad de cámaras y no por puntos de riesgo.',
      },
      {
        title: 'El aseo como variable de seguridad',
        body: 'Un pasillo bloqueado, un acceso con visibilidad reducida por acumulación de objetos, un sistema de alarma con obstrucciones o un acceso despejado de forma irregular son condiciones que afectan la seguridad y que el aseo detecta todos los días.',
      },
      {
        title: 'Mantenimiento y limpieza con el mismo activo',
        body: 'Las cámaras y los sensores están en plafones, pasillos y espacios que el aseo mantiene. Una coordinación deficiente termina en obstrucciones, cortes y cámaras fuera de servicio que nadie sabe que están caídas.',
      },
    ],
    services: [
      {
        name: 'Videovigilancia',
        role: 'Diseño e instalación',
        detail:
          'Diseño por puntos de riesgo del edificio, no por cantidad de cámaras. Cobertura de accesos, estacionamientos, zonas comunes y puntos definidos en la evaluación.',
      },
      {
        name: 'Monitoreo',
        role: 'Operación',
        detail:
          'Central propia que supervisa las alertas, valida los eventos antes de escalar y mantiene registro de la operación.',
      },
      {
        name: 'Aseo de zonas comunes',
        role: 'Servicio de aseo',
        detail:
          'Limpieza de halls, ascensores, cocinas comunes, baños y zonas de servicio, con personal uniformado y supervisión de terreno.',
      },
      {
        name: 'Inspección conjunta',
        role: 'Coordinación',
        detail:
          'Revisión periódica de cámaras, sensores y condiciones de los espacios que afectan la seguridad, con registro y acción correctiva.',
      },
    ],
    operation: [
      {
        step: 'Diseño por puntos de riesgo',
        detail:
          'La instalación parte de un mapeo de accesos, estacionamientos y zonas de flujo. La cantidad de cámaras es consecuencia del diseño, no al revés.',
      },
      {
        step: 'Registro de los accesos de servicio',
        detail:
          'El personal de aseo entra con registro y credencial. Las cámaras de los accesos registran ese tránsito, que es el que más se olvida documentar.',
      },
      {
        step: 'Inspección de la infraestructura',
        detail:
          'Cámaras, sensores e iluminación se revisan periódicamente, incluyendo el estado de los espacios que las alrededor, para detectar obstrucciones o condiciones que degradan la cobertura.',
      },
      {
        step: 'Reporte de operación',
        detail:
          'Estado de la videovigilancia, eventos relevantes, registro de accesos y ejecución del plan de aseo, en un informe único para la administración.',
      },
    ],
    sections: [
      {
        heading: 'Qué revisar en un edificio antes de instalar cámaras',
        body: [
          'Antes de dimensionar un sistema, la pregunta no es cuántas cámaras se pueden instalar, sino qué tiene que pasar en el edificio que la cámara debe registrar.',
          'Los puntos que se evalúan: accesos vehiculares y peatonales, incluidas áreas de tránsito de carga, estacionamientos y su cobertura por zonas, halls y ascensores, salidas de emergencia, espacios de servicio, y los puntos donde se producen los incidentes históricos del edificio.',
          'Con esa información, la instalación se dimensiona donde aporta. Una cámara bien ubicada en un acceso tiene más valor que cuatro cámaras que cubren un pasillo donde no ocurre nada.',
        ],
      },
      {
        heading: 'El aseo como parte del mantenimiento',
        body: [
          'Las cámaras y los sensores se deterioran por el uso y el entorno. Un lente empolvado, un sensor obstruido o una cámara cubierta por una caja de entrega son fallas que se acumulan en silencio.',
          'Un servicio integrado permite que el personal de aseo reporte condiciones que afectan la seguridad durante su operación diaria, y que esa observación llegue a alguien que puede actuar sobre ella.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántas cámaras necesita un edificio?',
        a: 'Depende de los puntos de riesgo, no del tamaño. La evaluación revisa accesos, estacionamientos, zonas comunes, salidas de emergencia y los puntos donde se han producido incidentes. La cantidad de cámaras es consecuencia de ese mapeo. Si alguien le ofrece un número sin conocer el edificio, es una estimación.',
      },
      {
        q: '¿El monitoreo desde central reemplaza al guardia?',
        a: 'No. Son funciones complementarias. La central supervisa alertas y sensores; el guardia está en el sitio viendo lo que una cámara no registra. Para sitios de riesgo alto, la Ley 21.659 exige un sistema de vigilancia privada con organización interna, no solo tecnología.',
      },
      {
        q: '¿El personal de aseo puede acceder a zonas con cámaras restringidas?',
        a: 'Solo a las zonas que la administración autorice. Las zonas de acceso restringido —salas de servidores, bodegas— quedan fuera del alcance del aseo y además seernas en el plan de limpieza.',
      },
      {
        q: '¿Qué pasa si una cámara deja de funcionar?',
        a: 'Debe existir un procedimiento de detección y reposición. La central detecta alertas de falla en los propios sistemas, y el informe mensual debe dar cuenta del estado de la cobertura. Un sistema con cámaras caídas sin registro no es un sistema monitoreado.',
      },
    ],
  },

  {
    slug: 'centro-comercial-guardias-y-limpieza',
    title: 'Guardias y limpieza para centros comerciales',
    metaTitle: 'Vigilancia y aseo para centros comerciales',
    metaDescription:
      'Vigilancia y mantenimiento para centros comerciales: control de accesos, prevención de hurtos y aseo de zonas comunes con un solo responsable.',
    h1: 'Vigilancia y aseo para centros comerciales',
    lead:
      'En un centro comercial, la seguridad y el aseo confluyen en los mismos espacios y a las mismas horas. El pasillo donde hay más tránsito es el mismo donde hay más que limpiar, y la percepción de los locales se construye con las dos cosas.',
    updatedISO: '2026-10-02',
    audience: 'Centros comerciales',
    audienceLong: 'Centros comerciales, galerías y paseos peatonales',
    coordinationProblem: [
      {
        title: 'Aseo que interfiere con los accesos en hora alta',
        body: 'La limpieza profunda en un centro comercial compite con el acceso de público y con la operación de los locales. Sin coordinación, el aseo se hace en el momento de mayor tránsito, que es el peor horario para ambos.',
      },
      {
        title: 'Zonas comunes que definen la experiencia',
        body: 'El estado de los pasillos, estacionamientos, ascensores y baños no es solo una cuestión estética. Un pasillo descuidado comunica una imagen del centro que ningún local puede compensar.',
      },
      {
        title: 'Reposición y logística en horario restricted',
        body: 'La carga y descarga de los locales ocurre en ventanas horarias específicas, muchas veces de madrugada. Es la franja con más movimiento de personas y mercaderías sin la presencia de público que observa.',
      },
    ],
    services: [
      {
        name: 'Vigilancia y control de accesos',
        role: 'Puesto y rondas',
        detail:
          'Control de acceso en los ingresos, vigilancia de zonas comunes y estacionamientos, y rondas preventivas sobre las áreas de mayor circulación.',
      },
      {
        name: 'Prevención y respuesta',
        role: 'Operación',
        detail:
          'Detección temprana de situaciones de riesgo, coordinación con Carabineros cuando corresponde, y registro de incidentes con evidencia.',
      },
      {
        name: 'Aseo de zonas comunes',
        role: 'Servicio de aseo',
        detail:
          'Mantenimiento de pasillos, escaleras, ascensores, baños, estacionamientos y áreas exteriores, con horarios definidos según el flujo del centro.',
      },
      {
        name: 'Logística y acceso de servicio',
        role: 'Coordinación',
        detail:
          'Registro del ingreso de personal de aseo, proveedores y personal de carga, con coordinación de horarios para no interferir con la operación.',
      },
    ],
    operation: [
      {
        step: 'Aseo programado según flujo',
        detail:
          'Las tareas intensivas se ejecutan en las horas de menor tránsito. El mantenimiento diario se realiza con el centro en operación, con personal identificado.',
      },
      {
        step: 'Ventanas de servicio coordinadas',
        detail:
          'El ingreso de personal de limpieza, proveedores y carga se coordina con la operación para que no interfiera con el acceso de público ni con los locales.',
      },
      {
        step: 'Rondas sobre zonas comunes',
        detail:
          'Las rondas del guardia cubren las mismas zonas que mantiene el aseo, lo que permite detectar condiciones y deprecación de forma inmediata.',
      },
      {
        step: 'Informe para la administración del centro',
        detail:
          'Cobertura de vigilancia, incidentes, estado de zonas comunes y cumplimiento del plan de mantenimiento, en un informe mensual.',
      },
    ],
    sections: [
      {
        heading: 'El centro comercial como imagen',
        body: [
          'En un centro comercial, la seguridad y el mantenimiento de espacios comunes tienen un efecto que va más allá de la seguridad del edificio: definen cómo percibe el público el lugar.',
          'Un centro con vigilancia presente y zonas comunes en buen estado transmite una imagen de cuidado que los locales individuales no pueden construir por su cuenta. Y a la inversa, un centro descuidado erosiona el trabajo de todos los operadores que están dentro.',
          'Por eso los dos servicios, en un espacio comercial, no son dos líneas de gasto independientes: son dos formas de sostener la misma percepción.',
        ],
      },
      {
        heading: 'Prevención en retail',
        body: [
          'El objetivo en un centro comercial no es primarily detener hurtos, sino reducirlos mediante presencia visible y disuasión. La vigilancia discreta y constante cumple esa función mejor que la reacción.',
          'La coordinación con la información de los locales y del aseo permite detectar patrones: accesos indebidos por zonas,icious zonas de baja circulación donde se acumulan los problemas, o situaciones que se repiten en horarios específicos.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿En qué horarios conviene hacer la limpieza profunda?',
        a: 'En las ventanas de menor tránsito, que en un centro comercial suelen ser posteriores al cierre o en la madrugada. La coordinación es clave: el plan de aseo se diseña con la operación del centro, no de forma independiente.',
      },
      {
        q: '¿Cómo se evita que el personal de aseo interfiera con los locales?',
        a: 'Con horarios definidos y registro de acceso. El personal de aseo tiene ventanas asignadas y rutas establecidas, y el acceso queda registrado, lo que además es una protección para el propio personal y para los locales.',
      },
      {
        q: '¿La vigilancia puede integrarse con los locales?',
        a: 'Sí. Los locales pueden requerir coordinación con el guardia central para temas de acceso, entregas y cierres. Eso requiere un interlocutor definido, que es una de las razones por las que el proveedor integrado suele ser más eficiente en este tipo de espacios.',
      },
      {
        q: '¿ManejanSolo el centro o también el interior de los locales?',
        a: 'El alcance de cada servicio se define en la propuesta. En un centro comercial lo habitual es que la vigilancia y el aseo cubran zonas comunes, accesos y estacionamientos, y que el interior de cada local se maneje según el acuerdo con cada operador.',
      },
    ],
  },

  {
    slug: 'construccion-seguridad-industrial-y-aseo',
    title: 'Seguridad industrial y aseo en construcción',
    metaTitle: 'Seguridad y aseo en faenas de construcción',
    metaDescription:
      'Vigilancia, control de accesos y mantenimiento en faenas de construcción. Personal propio, acceso registrado y coordinación entre seguridad y servicios.',
    h1: 'Seguridad y mantenimiento en faenas de construcción',
    lead:
      'Una faena de construcción tiene una particularidad que la distingue de cualquier otro sitio: el perímetro cambia. Los accesos se mueven, los turnos rotan y el terreno.available es finito.',
    updatedISO: '2026-10-02',
    audience: 'Faenas de construcción',
    audienceLong: 'Constructoras, contratistas y operaciones de faena en Santiago',
    coordinationProblem: [
      {
        title: 'Accesos que cambian con el avance de la obra',
        body: 'En una faena, los ingresos y salidas se modifican conforme avanza el proyecto. Un control de acceso diseñado al inicio puede quedar desalineado en cuestión de semanas si no se revisa.',
      },
      {
        title: 'Personal que entra y sale todos los días',
        body: 'La rotación de operarios y subcontratas es alta, y con ella la cantidad de personas que acceden al sitio. Sin un registro ordenado, es imposible saber quién estaba en la faena cuando ocurrió un hecho.',
      },
      {
        title: 'El mantenimiento que la obra genera',
        body: 'El aseo y el mantenimiento del sitio son parte de la seguridad: el retiro de escombros, la limpieza de zonas de tránsito y el orden del campamento reducen riesgos de forma directa.',
      },
    ],
    services: [
      {
        name: 'Vigilancia y control de accesos',
        role: 'Puesto',
        detail:
          'Control de acceso de personal, proveedores y vehículos, con registro. En faenas, el registro es el activo principal: define quién estuvo en el sitio y cuándo.',
      },
      {
        name: 'Rondas y prevención',
        role: 'Operación',
        detail:
          'Rondas sobre el perímetro, dependencias y zonas comunes del campamento, con reporte de condiciones y spotting de riesgos.',
      },
      {
        name: 'Aseo y mantenimiento del sitio',
        role: 'Servicio de aseo',
        detail:
          'Retiro de escombros, limpieza de zonas de tránsito y mantenimiento del campamento, con personal propio y supervision de terreno.',
      },
      {
        name: 'Control de activos',
        role: 'Coordinación',
        detail:
          'Registro de ingreso y salida de vehículos y materiales, en coordinación con el responsable de la obra.',
      },
    ],
    operation: [
      {
        step: 'Diseño de accesos evolutivo',
        detail:
          'El plan de control de accesos se revisa junto con el avance de la obra. Un sitio en construcción cambia, y el diseño tiene que reconocer eso.',
      },
      {
        step: 'Registro de personal y subcontratas',
        detail:
          'Cada ingreso queda registrado con identificación. Para una faena, esto no es burocracia: es lo que permite reconstruir qué pasó y quién estaba presente.',
      },
      {
        step: 'Mantenimiento coordinado con la obra',
        detail:
          'El plan de aseo se alinea con el cronograma de la faena, incluyendo la limpieza de zonas de tránsito y el cuidado del campamento.',
      },
      {
        step: 'Reporte de operación y seguridad',
        detail:
          'Cobertura, accesos registrados, incidentes y condiciones detectadas en las rondas, entregado al responsable de la obra.',
      },
    ],
    sections: [
      {
        heading: 'Guardpod en faenas',
        body: [
          'Existe una alternativa al guardia presencial para perímetros de faena: Guardpod, el sistema autónomo que opera sin conexión eléctrica ni a internet, con energía solar y transmisión 4G.',
          'Es pertinente en trabajos de perímetro, terrenos acotados y recintos temporales donde no hay infraestructura y la cobertura presencial continua no se justifica por sí sola. No reemplaza al guardia en los puntos de acceso, que requieren presencia física.',
          'La decisión entre esquema autónomo, mixto o vigilancia presencial se toma con la evaluación del sitio, considerando el perímetro, los accesos y el nivel de riesgo.',
        ],
      },
      {
        heading: 'Por qué el registro es el servicio principal en una faena',
        body: [
          'En un sitio de construcción, la pérdida material suele venir por robo de herramientas, materiales o maquinaria, y la respuesta depende de poder probar qué entrado y cuándo.',
          'Por eso el control de acceso con registro es más relevante que la presencia física en sí misma. Un guardia que registra correctamente cada ingreso genera evidencia con valor operativo, legal y de seguro.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Guardpod reemplaza al guardia en una faena?',
        a: 'No. Guardpod cubre perímetros donde no hay infraestructura disponible, sin conexión eléctrica ni internet. El guardia presencial sigue siendo necesario en los puntos de acceso y en las tareas que requieren observación directa. Ambos pueden convivir en un mismo sitio.',
      },
      {
        q: '¿Cómo manejan la rotación de operarios?',
        a: 'Con un registro de acceso que identifica a cada persona que ingresa. En faenas la rotación es alta, y ese registro es lo que permite saber quién estaba en el sitio en un momento determinado.',
      },
      {
        q: '¿El aseo incluye retiro de escombros?',
        a: 'Sí, el retiro de escombros y el mantenimiento de las zonas de tránsito son parte del alcance. El plan se define en conjunto con el responsable de la obra, en función del cronograma y de las condiciones del sitio.',
      },
      {
        q: '¿Pueden cubrir una faena en otra comuna?',
        a: 'La cobertura se define según disponibilidad de personal y capacidad de operación. Las faenas en Las Condes, Santiago Centro y otras comunas con presencia permanente se cubren sin dificultad; para sitios alejados, la disponibilidad se confirma antes de cotizar.',
      },
    ],
  },

  {
    slug: 'eventos-vigilancia-y-limpieza',
    title: 'Vigilancia y limpieza para eventos',
    metaTitle: 'Vigilancia y limpieza para eventos',
    metaDescription:
      'Seguridad y mantenimiento para eventos: control de accesos, cobertura por sectors y limpieza coordinada con el montaje y desmontaje.',
    h1: 'Vigilancia y limpieza para eventos',
    lead:
      'Un evento tiene una estructura que no tiene un edificio: se monta, se usa y se desmonta. La seguridad y el aseo tienen que moverse con esa estructura, no por separado.',
    updatedISO: '2026-10-02',
    audience: 'Eventos',
    audienceLong: 'Organizadores de eventos corporativos, bodas, congresos y donaciones',
    coordinationProblem: [
      {
        title: 'El montaje y el desmontaje son parte de la operación',
        body: 'La mayor concentración de personas y riesgos de un evento no está durante el evento, sino durante el montaje y el desmontaje. Esos tramos necesitan cobertura específica, y a menudo quedan fuera de los presupuestos.',
      },
      {
        title: 'Limpieza sin turno definido',
        body: 'La limpieza de un evento no es un servicio continuo: es una operación intensiva, con una ventana de ejecución corta después de que termina la actividad. Requiere personal suficiente y capacitado para trabajar en ese tiempo específico.',
      },
      {
        title: 'Accesos de proveedores y logística',
        body: 'Durante el montaje entran proveedores, técnicos, contratistas y vehículos. El control de esos accesos tiene consecuencias directas sobre la seguridad posterior del evento.',
      },
    ],
    services: [
      {
        name: 'Vigilancia de evento',
        role: 'Plan y cobertura',
        detail:
          'Plan de seguridad con cobertura por sectores, control de accesos y coordinación con Carabineros cuando el nivel de riesgo lo requiere.',
      },
      {
        name: 'Control de acceso',
        role: 'Puesto',
        detail:
          'Verificación de asistentes, credenciales yControl de proveedores, con registro de los ingresos durante montaje, evento y desmontaje.',
      },
      {
        name: 'Limpieza de evento',
        role: 'Servicio de aseo',
        detail:
          'Limpieza de recintos, baños, zonas de tránsito y retiro de residuos después de la actividad, con equipo dimensionado para la ventana de ejecución.',
      },
      {
        name: 'Coordinación de operación',
        role: 'Interlocutor',
        detail:
          'Un responsable de la operación que coordina seguridad y mantenimiento en los mismos tramos horarios, que es donde se concentra la complejidad.',
      },
    ],
    operation: [
      {
        step: 'Planificación por tramos',
        detail:
          'La cobertura se planifica por tramos: montaje, evento y desmontaje. Cada tramo tiene riesgos yRequirements distintos, y se dimensiona por separado.',
      },
      {
        step: 'Ventana de limpieza dimensionada',
        detail:
          'La limpieza se ejecuta en una ventana acotada después de la actividad. El personal se dimensiona considerando ese tiempo real, no un turno estándar.',
      },
      {
        step: 'Registro de montaje y desmontaje',
        detail:
          'Los ingresos de personal, proveedores y vehículos durante montaje y desmontaje quedan registrados, porque son los momentos de mayor exposición del evento.',
      },
      {
        step: 'Cierre de operación',
        detail:
          'Al término del desmontaje se verifica que el recinto queda en las condiciones acordadas y se entrega el registro de toda la operación.',
      },
    ],
    sections: [
      {
        heading: 'El marco legal de los eventos masivos',
        body: [
          'La Ley 21.659 creó una regulación específica para los eventos que superan las 3.000 personas. Los organizadores deben presentar su solicitud ante la delegación presidencial regional a través de una plataforma informática y diseñar un plan de seguridad que cumpla los requisitos del reglamento.',
          'La ley establece además un estatuto de responsabilidad especial para los organizadores, con la obligación de contratar seguros de daños contra terceros.',
          'Esto tiene una consecuencia práctica que conviene tener presente desde el inicio: en eventos de ese tamaño, el plan de seguridad no es discretionario. Es un requisito regulatorio, y el costo de cumplirlo con tiempo es siempre menor que el de improvisarlo.',
        ],
      },
      {
        heading: 'Por qué limpiar bien importa en un evento',
        body: [
          'La limpieza de un evento tiene un efecto directo en la seguridad que casi nunca se considera: un pasillo bloqueado, un piso mojado sin señalización o un techo con material acumulado son condiciones de riesgo reales.',
          'Cuando el aseo y la vigilancia son provistos por separado, la secuencia de desmontaje suele quedar sin nadie a cargo. El resultado es que la limpieza se hace con el evento todavía montado, o con el desmontaje ya avanzado y sin cobertura.',
          'Un servicio integrado permite ordenar esa secuencia: primero seguridad confirmando que el espacio está libre, después mantenimiento retirando, y el registro final dando cuenta de cómo terminó la operación.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántas personas necesita mi evento?',
        a: 'La cobertura de un evento se dimensiona por sector, tipo de acceso, perfil de asistentes y momento de la operación. Los tramos de montaje y desmontaje suelen requerir más personal que el evento en sí. La planificación correcta es por tramos, con una revisión del plan de seguridad ante la autoridad cuando el evento supera las 3.000 personas.',
      },
      {
        q: '¿Necesito un plan de seguridad aprobado?',
        a: 'Para eventos con más de 3.000 asistentes, sí. La Ley 21.659 exige presentar la solicitud ante la delegación presidencial regional y contar con un plan de seguridad que cumpla los requisitos del reglamento. Para eventos menores, el plan sigue siendo recomendable, pero no es un requisito de la ley.',
      },
      {
        q: '¿La limpieza se puede hacer durante el evento?',
        a: 'Sí, con Personal propio y en horarios definidos. Para el mantenimiento mayor suele reservarse la ventana posterior a la actividad, dimensionando el equipo para ese tiempo acotado.',
      },
      {
        q: '¿Trabajan con wedding o eventos pequeños?',
        a: 'Sí. La cobertura se ajusta al tamaño y al nivel de riesgo de cada evento. En eventos pequeños, la coordinación entre seguridad y limpieza se resuelve con un responsable de operación, que es lo que evita los problemas de secuencia en el desmontaje.',
      },
    ],
  },
];

export const SOLUTIONS_BY_SLUG = Object.fromEntries(
  SOLUTIONS.map((s) => [s.slug, s]),
) as Record<string, SolutionPage>;
