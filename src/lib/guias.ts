// ════════════════════════════════════════════════════════════════
// GuardMan Chile — Guías de dotación (Fase 3)
// ════════════════════════════════════════════════════════════════
//
// Objetivo comercial: explicar el MÉTODO con el que dimensionamos, para
// que un lead entienda por qué la dotación que le proponemos es la que
// es. Un administrador que no entiende el razonamiento no puede
// evaluar la propuesta.
//
// Restricción del CEO (2026-10-02): el método se explica, los números no.
// Se publica el marco "acceso - riesgo - horario" porque es conocimiento
// conceptual, y se omite deliberadamente:
//
//   - ratios de guardias por puesto o por superficie
//   - fórmulas de cálculo con coeficientes
//   - número de guardias resultante para un caso tipo
//   - precios, listas o rangos
//
// Motivo: publicar eso entregaría a un competidor el playbook completo de
// dimensionamiento. El marco conceptual no se puede copiar sin haberlo
// ejecutado, que es justamente lo que este contenido busca demostrar.
//
// Toda afirmación sobre el método debe ser verificable en terreno. No se
// publica ninguna que no se pueda sostener en una visita técnica.

/**
 * Sección de contenido largo.
 *
 * `list` existe porque `body` solo puede producir párrafos. Cuando la
 * intención editorial es una enumeración —"estas cuatro preguntas", "estas
 * seis verificaciones"— escribirla como `body` la convertía en un muro de
 * párrafos sin jerarquía visual y sin forma de plegar la respuesta.
 * Con `list`, la intención se declara como dato y el template la renderiza
 * con el acordeón canónico (FaqList → .faq-list / .faq-item).
 *
 * Regla de redacción: si el contenido empieza con "estas", "estos",
 * "cuatro", "seis" o similar, es una lista. Va en `list`, no en `body`.
 */
export interface GuideSection {
  heading: string;
  body?: string[];
  list?: { q: string; a: string }[];
}

export interface GuidePage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  updatedISO: string;
  /** Marco de dimensionamiento: los tres ejes, explicados. */
  axes: { name: string; question: string; body: string[] }[];
  /** Qué se evalúa en terreno antes de proponer. */
  assessment: { step: string; detail: string }[];
  /** Errores frecuentes de quien contrata sin evaluación. */
  mistakes: { mistake: string; consequence: string }[];
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaBody: string;
}

export const GUIDES: GuidePage[] = [
  {
    slug: 'cuantos-guardias-necesita-mi-condominio',
    title: 'Cuántos guardias necesita un condominio',
    metaTitle: 'Cuántos guardias necesita un condominio',
    metaDescription:
      'Cómo se determina la dotación de guardias de un condominio. Los tres factores que inciden, qué se evalúa en terreno y por qué no existe un número único.',
    h1: 'Cuántos guardias necesita un condominio',
    lead:
      'No existe un número que sirva para todos los condominios. La dotación se determina a partir de tres variables que se evalúan juntas: los accesos que hay que cubrir, el nivel de riesgo del edificio y los horarios en que debe operar el servicio.',
    updatedISO: '2026-10-02',
    axes: [
      {
        name: 'Acceso',
        question: '¿Cuántos puntos de entrada y salida tiene el edificio y hay que cubrir?',
        body: [
          'Es el primer factor y el más fácil de overlooking. Un condominio con acceso peatonal y vehicular separados, más uno secundario para servicio, no se cubre de la misma manera que uno de acceso único.',
          'La pregunta relevante no es "cuántos guardias" sino "cuántos puntos requieren la presencia de alguien". Un acceso sin cobertura es un acceso abierto, por más que haya personal en otro lado.',
          'También importa cómo es cada acceso: una garita permite control efetivo, un portón automático con citófono abre otra lógica, y un acceso sin garita física exige otra solución.',
        ],
      },
      {
        name: 'Riesgo',
        question: '¿Qué pasa en el edificio si falla la seguridad?',
        body: [
          'El riesgo no se mide solo por el tipo deproperty_. Un edificio con estacionamientos subterráneos sin cámaras de videovigilancia tiene un perfil de riesgo distinto al de uno que ya las tiene.',
          'Los factores que más incidimos en terreno son la existencia y estado de cámaras, la presencia de iluminación en zonas comunes y estacionamientos, la cantidad de unidades residenciales, los horarios de mayor actividad, y el historial de incidentes del propio edificio.',
          'La historial de incidentes es especialmente informativo. Un edificio que nunca ha tenido un hecho relevante no necesita la misma dotación que uno con un patrón repetido, aunque ambos se vean iguales por fuera.',
        ],
      },
      {
        name: 'Horario',
        question: '¿Cuántas horas del día tiene que haber alguien presente?',
        body: [
          'La cobertura 24/7 y la cobertura diurna no son el mismo servicio ni tienen la misma dotación. Este es el eje que más se negocia, porque es el que define la estructura del turno.',
          'Un edificio con recepción nocturna activa tiene una necesidad distinta de uno donde el conserje cierra a las 20:00 y el resto del horario queda sin cobertura presencial.',
          'También incide la calidad de esa cobertura: un turno de 12 horas es físicamente distinto de un turno de 8, tanto para laBSDBs sostenida del guardia como para la capacidad real de respuesta. No es el mismo servicio aunque ambos se llamen "guardia de seguridad".',
        ],
      },
    ],
    assessment: [
      {
        step: 'Visita al sitio',
        detail:
          'Recorremos el edificio con la administración: accesos, estacionamientos, zonas comunes, caseta de vigilancia, zonas con iluminación deficiente. No se puede dimensionar un puesto sin verlo.',
      },
      {
        step: 'Revisión de infraestructura existente',
        detail:
          'Cámaras de videovigilancia y su estado, cobertura real de las zonas críticas, iluminación, sistema de citófono o control de acceso ya instalado. Lo que ya existe reduce la necesidad de personal, y es importante saberlo antes de proponer.',
      },
      {
        step: 'Revisión de antecedentes del edificio',
        detail:
          'Historial de incidentes, reclamos yailed de acceso no autorizado. Un edificio sin historial y uno con un patrón repetido parten de un análisis diferente.',
      },
      {
        step: 'Definición de horarios de cobertura',
        detail:
          'Cuántas horas al día y en qué bloques. Esta definición determina la estructura de turnos y condiciona todo el resto.',
      },
      {
        step: 'Propuesta con alcance explícito',
        detail:
          'La propuesta especifica qué se cubre, en qué horarios, con qué protocolo de reemplazo y qué supervisión acompaña al servicio. Nada queda supuesto.',
      },
    ],
    mistakes: [
      {
        mistake: 'Pedir un número por teléfono sin visita previa',
        consequence:
          'El número que se da por teléfono no puede ser correcto. Sin ver el sitio, cualquier respuesta es una estimación, y una estimación mal dimensionada se traduce en Either un gasto de más o un hueco de seguridad.',
      },
      {
        mistake: 'Comparar cotizaciones que cubren servicios distintos',
        consequence:
          'Es el error más común y el más caro. Dos propuestas pueden diferir en un porcentaje que parece pequeño cuando una cubre 12 horas y otra 8, o cuando una incluye videovigilancia y la otra no. Comparar sin homogenizar el alcance lleva a elegir la más barata que no cubre lo necesario.',
      },
      {
        mistake: 'Contratar el mínimo y esperar que rinda más',
        consequence:
          'Un puesto subdotado no es un puesto eficiente, es un puesto que no puede cumplir su función. El control de accesos se vuelve superficial, las rondas se saltan y el registro se degrada.',
      },
      {
        mistake: 'No preguntar qué pasa cuando falta un guardia',
        consequence:
          'Este es el escenario que más veces se produce y menos veces se anticipa. Si no hay proceso de reemplazo declarado, cada baja, licencia o feriado se convierte en un puesto descubierto.',
      },
    ],
    sections: [
      {
        heading: 'Por qué no publicamos el número',
        body: [
          'Muchos sitios answered "cuántos guardias necesito" con una tabla de ratios por superficie o por cantidad de unidades. Puede ser un punto de partida, pero un número sin evaluación de sitio no es una recomendación profesional.',
          'Más aún en seguridad privada: los ratios que circulan en internet suelen provenir de contextos de otros países, con otras normas, otras jornadas y otros niveles de riesgo. Aplicados sin ajuste a un edificio chileno, pueden quedar muy por encima o muy por debajo de lo que el sitio realmente necesita.',
          'Por eso preferimos no publicar ratios. Lo que sí hacemos es explicar cómo razonamos la dotación, para que puedas evaluar la propuesta que recibas de cualquier proveedor, incluido nosotros.',
        ],
      },
      {
        heading: 'Qué sí puedes comparar entre proveedores',
        body: [
          'Si el método no es público, hay señales que sí permiten comparar y que dicen más que el número final de una cotización.',
        ],
        list: [
          { q: '¿La propuesta incluye visita a terreno antes de cotizar?', a: 'Si el número salió de un formulario, es una estimación. Una cotización sin visita no puede ser correcta, y esa es la primera señal de que el proveedor no conoce el sitio.' },
          { q: '¿El alcance está declarado con precisión?', a: 'Puestos, horarios, protocolo de reemplazo, supervisión, uniforme y equipamiento. Una propuesta vaga obliga a adivinar después, y lo que no está declarado no se puede comparar.' },
          { q: '¿El personal tiene acreditación vigente y hay proceso de renovación?', a: 'Bajo la Ley 21.659 es obligación. Una empresa ordenada lo demuestra sin que se le pida, y una que lo entrega tiene el control montado.' },
          { q: '¿Existe un procedimiento para los puestos descubiertos?', a: 'Es la pregunta que separa a un proveedor de un intermediario, y la que más directamente afecta su seguridad.' },
        ],
      },
      {
        heading: 'El costo de equivocarse en cada dirección',
        body: [
          'Sobre-dimensionar tiene un costo visible: se paga más de lo necesario por un servicio que no rinde proporcionalmente más.',
          'Sub-dimensionar tiene un costo invisible y más caro: un incidente que se previene porque no había nadie, o un control que se degrada justo en el horario de mayor riesgo. Ese costo no aparece en la boleta y aparece en el historial del edificio.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántos guardias necesita un condominio de 80 unidades?',
        a: 'La cantidad de unidades es solo uno de los factores y no el determinante. Un edificio de 80 unidades con un acceso único y good_ iluminación no se cubre igual que otro de 80 unidades con tres accesos, estacionamientos sin videovigilancia e historial de incidentes. Necesitamos ver el sitio.',
      },
      {
        q: '¿Cuál es la diferencia entre 12 y 8 horas de turno?',
        a: 'La diferencia es estructural. Un turno de 12 horas exige rotación, y la capacidad de respuesta sostenida de un guardia cambia a lo largo de la jornada. Un turno de 8 horas permite rotación más frecuente y descansos más cortos. No es solo un tema de horas contratadas: es un modelo de operación distinto, con efectos en la rotación, la supervisión y el costo.',
      },
      {
        q: '¿Puede mi conserje hacer el control de acceso?',
        a: 'Puede, si tiene la acreditación OS-10 vigente y el alcance de sus funciones incluye explícitamente las tareas de seguridad. Es una solución habitual y válida en edificios pequeños. Requiere que la acreditación esté documentada y al día.',
      },
      {
        q: '¿Qué pasa si mi edificio no necesita vigilancia privada?',
        a: 'Es una conclusión válida y laCsvamos a decir. Si la infraestructura, la iluminación y el historial del edificio hacen innecesaria una dotación permanente, lo indicado es decirlo. Agregar personal donde no se necesita es un gasto sin retorno.',
      },
      {
        q: '¿Cada cuánto conviene revisar la dotación?',
        a: 'Cada vez que cambia algo relevante: una ampliación del edificio, un nuevo acceso, un cambio de horarios de operación o un incidente que revela un punto débil. La dotación no es fija: es el resultado de una evaluación en un momento dado.',
      },
    ],
    ctaTitle: 'Solicita una evaluación para tu condominio',
    ctaBody:
      'La visita a terreno es el primer paso y no tiene costo. Recorremos el edificio, revisamos la infraestructura existente y los antecedentes, y a partir de ahí definimos la cobertura que corresponde. Si la conclusión es que no necesitas vigilancia privada, te lo vamos a decir.',
  },

  {
    slug: 'cuantos-guardias-para-mi-edificio',
    title: 'Cuántos guardias para un edificio de oficinas',
    metaTitle: 'Dotación de guardias para edificios de oficinas',
    metaDescription:
      'Cómo se dimensiona la seguridad en un edificio de oficinas: accesos, flujos, horarios de operación y particularidades de cada torre.',
    h1: 'Dotación de guardias para un edificio de oficinas',
    lead:
      'Los edificios de oficinas tienen un patrón distinto a los condominios. El acceso no se concentra en un punto, los flujos cambianradicalmente a lo largo del día y hay zonas con horaires extendidos que exigen un tratamiento diferente.',
    updatedISO: '2026-10-02',
    axes: [
      {
        name: 'Acceso',
        question: '¿Cuántos ingresos tiene el edificio y cómo se distribuyen entre los distintos usos?',
        body: [
          'Un edificio de oficinas combina accesos peatonales, vehiculares, de servicio y de carga. Cada uno tiene dinámicas distintas: el de carga tiene horarios propios, el vehicular se concentra en la mañana y la tarde, el peatonal se mueve con los horarios de los tenants.',
          'La pregunta clave es si la cobertura se puede diseñar por zonas. En muchos edificios es posible concentrar presencia en los accesos de mayor flujo y cubrir los secundarios con registro y alertas, en vez de despre_un puesto en cada puerta.',
        ],
      },
      {
        name: 'Riesgo',
        question: '¿Qué activos y qué actividad hay que proteger?',
        body: [
          'En un edificio de oficinas el riesgo no es homogéneo. Un piso de oficinas sin datos sensibles tiene un perfil distinto de una sala de servidores en el subsuelo, y esa diferencia se refleja en cómo se organiza la seguridad.',
          'Revisamos en terreno: Existence de salas de servidores o data center, cartera de inquilinos y actividad por piso, présence de acceso restringido, y estado de la videovigilancia existente.',
          'También el entorno inmediato. Un edificio en un eje con alto flujo peatonal no tiene el mismo perfil que uno con acceso directo desde una calle secundario, incluso con el mismo edificio.',
        ],
      },
      {
        name: 'Horario',
        question: '¿Cuándo hay actividad y hasta dónde llega la necesidad de cobertura?',
        body: [
          'En oficinas el horario es determinante porque define casi toda la estructura. Hay edificios con operación 8x5, otros con atención extendida hasta la noche, y algunos con turnos o centros de operaciones que funcionan 24/7.',
          'La cobertura distingue entre horario hábil y extensión nocturna, y esa decisión cambia la dotación más que cualquier otro factor. Una torre con un solo acceso vehicular que se abre a las 08:00 y cierra a las 19:00 no justifica la misma estructura nocturna que una torre con un centro de operaciones.',
        ],
      },
    ],
    assessment: [
      {
        step: 'Recorrido por el edificio',
        detail:
          'Accesos, estacionamientos, salas de servidores, zonas de uso común, y el estado real de los sistemas de videovigilancia. Revisamos también los puntos ciegos conocidos por la administración.',
      },
      {
        step: 'Mapa de flujos',
        detail:
          'Con la administración revisamos cómo se mueve la gente por el edificio: horarios de entrada y salida, uso de estacionamientos, operación de la zona de carga. De ahí sale la distribución de la cobertura.',
      },
      {
        step: 'Revisión de contratos y obligations',
        detail:
          'Si el edificio está expuesto al régimen de la Ley 21.659, verificamos qué exige su clasificación de riesgo y si el estudio de seguridad está vigente.',
      },
      {
        step: 'Definición de la propuesta',
        detail:
          'Cobertura por zonas y horarios, protocolo de acceso, procedimiento de reemplazo y supervisión. Con eso se puede comparar la propuesta con las de otros proveedores sin ambigüedad.',
      },
    ],
    mistakes: [
      {
        mistake: 'Cubrir todos los accesos con la misma intensidad',
        consequence:
          'Se terminan cubriendo de más los accesos que lo necesitan menos y de menos los críticos. La cobertura por zonas, ajustada al flujo real, entrega más seguridad con la misma dotación.',
      },
      {
        mistake: 'Olvidar los horarios extendidos',
        consequence:
          'Un edificio con atención hasta las 22:00 pero con cobertura contratada solo hasta las 19:00 tiene una franja sin cubrir que nadie Má notices porque la propiedad está activa.',
      },
      {
        mistake: 'No considerar las salas de servidores o data center',
        consequence:
          'En muchos edificios es la zona de mayor concentración de riesgo y la que suele quedar fuera del diseño original de seguridad. Es de las primeras preguntas que hacemos en terreno.',
      },
    ],
    sections: [
      {
        heading: 'El control de acceso es el grueso del trabajo',
        body: [
          'En un edificio de oficinas, la parte del turno que más se extiende es la verificación de ingresos. Con frecuencia viene con carga de Validate de que el visitante existe, de que va al lugar correcto y de que su credencial es válida.',
          'Un proceso de acceso mal diseñado genera fricción permanente: se eliminan los tiempos de espera, pero también la verificación real. Ahí es donde la tecnología cumple su función, y donde un buen proveedor te va a proponer un sistema en vez de más horas de personal.',
        ],
      },
      {
        heading: 'La coordinación con la administración',
        body: [
          'Un edificio de oficinas tiene una administración con la que hay que hablar todos los días: Arriendos, mudanzas, visitas técnicas, entregas. La seguridad tiene que estar informada de todo eso.',
          'Un proveedor que no tiene ese canal de comunicación con la administración genera revisar después de cada movimiento. Y en un edificio con rotación de inquilinos, eso es un problema recurrente.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántos guardias necesita un edificio de oficinas?',
        a: 'Se determina con una visita, no con una regla general. En un edificio de oficinas las variables decisivas son cuántos accesos hay y de qué tipo, cómo se distribuyen los flujos a lo largo del día, si hay zonas de riesgo concentrado como servidores, y hasta qué horario hay actividad. Con esos datos, la dotación se define por zonas y bloques horarios.',
      },
      {
        q: '¿Qué diferencia hay entre un guardia y un conserje de edificio?',
        a: 'En un edificio de oficinas la figura del conserje cumple muchas funciones administrativas además de las de seguridad. Si la seguridad es parte de sus tareas y tiene acreditación OS-10 vigente, la combinación es válida y habitual. Si las funciones de seguridad son relevantes, conviene que estén cubiertas de forma explícita y no como un añadido al cargo.',
      },
      {
        q: '¿Conviene sumar videovigilancia en vez de más guardias?',
        a: 'Depende del caso. La videovigilancia cubre áreas Amplas con personal en los puntos críticos; el guardia cubre el punto. En edificios con accesos bien definidos, una combinación suele rendir más que aumentar dotación. Es una decisión que se toma con el análisis del sitio, no por preferencia.',
      },
      {
        q: '¿Pueden cubrir solo el horario nocturno?',
        a: 'Sí, y en muchos edificios es lo que se necesita. Si la propiedad opera en horario hábil con personal propio de administración y la necesidad se concentra en la noche, la cobertura nocturna bien resuelta puede ser la solución más adecuada.',
      },
    ],
    ctaTitle: 'Solicita una evaluación para tu edificio',
    ctaBody:
      'Recorremos el edificio, revisamos accesos, flujos e infraestructura existente, y definimos la cobertura por zonas y horarios que corresponde a ese edificio en particular. La propuesta llega con el alcance declarado, para que puedas compararla con cualquiera.',
  },

  {
    slug: 'turnos-y-cobertura-24-7',
    title: 'Turnos y cobertura 24/7',
    metaTitle: 'Turnos y cobertura 24/7 en seguridad privada',
    metaDescription:
      'Cómo funcionan los turnos de seguridad en Chile: esquemas más comunes, qué define una buena cobertura y qué preguntar sobre el reemplazo de personal.',
    h1: 'Turnos y cobertura 24/7 en seguridad privada',
    lead:
      'Un turno no es solo un bloque de horas. La forma en que se organiza determina si el servicio se sostiene en el tiempo o si se degrada de forma silenciosa a medida que pasa el personal.',
    updatedISO: '2026-10-02',
    axes: [
      {
        name: 'Estructura del turno',
        question: '¿Cómo se organizan las horas y la rotación?',
        body: [
          'Los esquemas más habituales en seguridad privada son los turnos de 12 horas, los de 8 horas y los ciclos de 4x4, 5x2 o 6x1. Cada uno tiene consecuencias operativas distintas.',
          'El turno de 12 horas permite una rotación más sencilla, pero la vigilancia sostenida de un guardia tiene un límite físico real, y esa limitación se nota en la segunda mitad de la jornada. El turno de 8 horas rota más frecuente y permite descansos más cortos, pero requiere más personal para cubrir las mismas horas.',
          'Los ciclos de 4x4, 5x2 y 6x1 favorecen la estabilidad de la empleo, pero exigen un pool de personal más grande para sostener la rotación. Un ciclo de 4x4 significa cuatro días de trabajo y cuatro de descanso, lo que obliga a mantener una dotación bastante mayor para garantizar la cobertura.',
        ],
      },
      {
        name: 'Supervisión',
        question: '¿Quién verifica que el servicio se está cumpliendo?',
        body: [
          'La supervisión es la diferencia entre un servicio declarado y uno real. Sin verificación, una puerta que debería estar cubierta puede seguir abierta mientras nadie lo revisa.',
          'Revisamos la frecuencia de visita del supervisor, qué se verifica en cada visita, y si hay un registro de esas visitas. Un supervisor que pasa una vez al mes sin registro deja de cumplir la función.',
        ],
      },
      {
        name: 'Reemplazo',
        question: '¿Qué pasa cuando falta un guardia?',
        body: [
          'Es la pregunta que más revela la calidad de un proveedor. Las bajas, licencias médicas, feriados y permisos ocurren todos los días. Un puesto sin cubrir es un incidente esperando.',
          'El estándar que exigimos es simple y verificable: un proceso de reemplazo declarado, con tiempo de respuesta definido y un mecanismo de comunicación con la administración del sitio.',
        ],
      },
    ],
    assessment: [
      {
        step: 'Definir las horas a cubrir',
        detail: 'Cuántas horas al día, en qué bloques y con qué actividad esperada en cada uno. Es el punto de partida de toda la estructura.',
      },
      {
        step: 'Elegir el esquema de turno',
        detail: 'Según las horas a cubrir, la operación del sitio y la estabilidad de la dotación disponible. No todos los esquemas sirven para todos los casos.',
      },
      {
        step: 'Dimensionar el pool',
        detail: 'El personal necesario para sostener la rotación elegida, incluyendo cobertura de ausencias, licencias y vacaciones sin bajar el servicio.',
      },
      {
        step: 'Definir la supervisión',
        detail: 'Frecuencia de visita, qué se verifica y cómo queda registro. Sin esto, el servicio no es auditable.',
      },
      {
        step: 'Documentar el protocolo de reemplazo',
        detail: 'Quién avisa, en cuánto tiempo se cubre, quién supervisa el reemplazo. Por escrito, antes de necesitarlo.',
      },
    ],
    mistakes: [
      {
        mistake: 'Contratar el número de horas sin pensar en la rotación',
        consequence:
          'Se llega a cubrir las horas contratadas sin poder sostener la rotación. El resultado es que el reemplazo se resuelve con improvisación, y la improvisación siempre se paga en el turno que queda descubierto.',
      },
      {
        mistake: 'Elegir el esquema por el precio y no por la operación',
        consequence:
          'Un ciclo de 4x4 puede ser más barato por hora y mucho más caro en operación, porque exige un pool más grande y una gestión de rotación más compleja. Un proveedor que no puede sostener la rotación con holgura no está offering ese esquema en serio.',
      },
      {
        mistake: 'Aceptar "tenemos personal de reemplazo" sin proceso',
        consequence:
          'La frase no significa nada por sí sola. Lo que cuenta es el tiempo de respuesta declarado y quién se encarga. Sin eso, la respuesta real ante una ausencia suele ser la misma: quedarse sin cubrir.',
      },
    ],
    sections: [
      {
        heading: 'Lo que un buen proveedor debe poder responder',
        body: [
          'Estas son preguntas concretas. Cualquiera se puede responder sin dejar nada para después, y la respuesta es tan reveladora como la pregunta: un proveedor con método responde con datos concretos y uno que improvisa responde con evasivas.',
        ],
        list: [
          { q: '¿Cuántas horas al día y en qué bloques se cubre?', a: 'Debe decirlo por bloques, no como promedio. "Cobertura 24/7" no es una respuesta: cubrir las 24 horas de lunes a domingo es distinto de cubrir las 24 horas de lunes a viernes, y la dotación cambia por completo.' },
          { q: '¿Con qué esquema de turnos y cómo se sostiene la rotación?', a: 'El esquema (12 horas, 8 horas, 4x4, 5x2) determina la rotación y el pool de personal necesario. La pregunta importante es cómo se cubre una ausencia, la licencia y las vacaciones sin bajar el servicio.' },
          { q: '¿Con qué frecuencia visita un supervisor y qué verifica?', a: 'Sin frecuencia declarada, la supervisión es una afirmación. Un supervisor que pasa una vez al mes sin registro dejó de cumplir la función hace tiempo.' },
          { q: '¿Qué pasa cuando falta un guardia, en cuánto tiempo se cubre y quién lo comunica?', a: 'Se espera un tiempo de respuesta concreto y un responsable identificado, no la frase "tenemos personal de reemplazo". Esta es la pregunta que más revela la calidad de un proveedor.' },
          { q: '¿Cómo se registra la cobertura efectiva de cada turno?', a: 'El registro de cobertura efectiva es el indicador que permite verificar el servicio con el tiempo. Si no lo llevan, es probable que no lo estén midiendo.' },
        ],
      },
      {
        heading: 'La cobertura efectiva',
        body: [
          'Un dato que conviene pedir siempre: el porcentaje de turnos efectivamente cubiertos. Es un número que un proveedor ordenado entrega sin dificultad y que permite verificar la calidad del servicio con el tiempo.',
          'Si un proveedor no puede dar ese dato, la razón suele ser que no lo está midiendo. Y si no lo mide, no lo está gestionando.',
        ],
      },
      {
        heading: 'La carga horaria y la normativa',
        body: [
          'La organización de los turnos debe respetar la normativa laboral aplicable y la propia Ley 21.659, que establece los requisitos de formación y acreditación de todo el personal que ejerce funciones de seguridad privada.',
          'Un esquema de turnos que depende de excesos o de personal no acreditado no es un esquema de rotación: es un incumplimiento con consecuencias regulatorias para el cliente.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué es mejor, turno de 12 horas o de 8 horas?',
        a: 'Depende de la operación del sitio y de la estabilidad de la dotación. El turno de 12 horas simplifica la rotación, pero la vigilancia sostenida tiene un límite físico que se nota en la segunda mitad de la jornada. El turno de 8 horas rota más y requiere más personal para las mismas horas. La elección correcta se hace con el análisis del sitio.',
      },
      {
        q: '¿Qué es un turno 4x4?',
        a: 'Es un esquema de rotación de cuatro días de trabajo por cuatro de descanso. Tiene la ventaja de la estabilidad de la empleo, pero exige un pool de personal bastante más grande para sostener la rotación sin bajar la cobertura. Suele ser una opción para clientes que valoran la continuidad del mismo equipo.',
      },
      {
        q: '¿La central de monitoreo cubre los turnos?',
        a: 'No. La central supervisa alertas, sensores y cámaras. El guardia está en el sitio viendo lo que un sensor no registra. Para sitios de riesgo alto, la Ley 21.659 exige un sistema de vigilancia privada que incluye organización interna y vigilantes, no solo tecnología.',
      },
      {
        q: '¿Cómo verifico que los turnos se están cubriendo?',
        a: 'Solicitando el registro de cobertura efectiva. Un proveedor ordenado lleva ese control y lo entrega. Es la manera más directa de verificar un servicio cuyo resultado se ve únicamente cuando falla.',
      },
    ],
    ctaTitle: 'Revisa tu esquema de turnos con un especialista',
    ctaBody:
      'Muchos contratos se hicieron con un esquema que ya no corresponde a la operación actual. Revisamos tu cobertura, el esquema de turnos y el proceso de reemplazo, y te decimos si lo que tienes vigente funciona o si conviene ajustarlo.',
  },

  {
    slug: 'como-elegir-empresa-de-seguridad',
    title: 'Cómo elegir una empresa de seguridad privada',
    metaTitle: 'Cómo elegir una empresa de seguridad privada en Chile',
    metaDescription:
      'Los puntos que conviene verificar antes de contratar una empresa de seguridad privada en Chile, bajo la Ley 21.659. Verificaciones concretas y verificables.',
    h1: 'Cómo elegir una empresa de seguridad privada en Chile',
    lead:
      'La Ley 21.659 cambió lo que se puede exigirle a un proveedor. No hace falta conocer la norma para contratar bien: basta con hacer las preguntas correctas y verificar que las respuestas se sostienen.',
    updatedISO: '2026-10-02',
    axes: [
      {
        name: 'Autorización',
        question: '¿La empresa está autorizada por la Subsecretaría de Prevención del Delito?',
        body: [
          'Bajo la Ley 21.659, solo pueden prestar servicios de seguridad privada las empresaspcs autorizadas por la Subsecretaría de Prevención del Delito. La autorización es verificable.',
          'Una empresa que no puede acreditar su autorización, o que responde de forma vaga cuando se le pregunta, estáFuera del sistema legal. Ese es el punto de partida y no hay compensaciones por el resto de las características.',
        ],
      },
      {
        name: 'Personal',
        question: '¿El personal tiene acreditación vigente y hay proceso de renovación?',
        body: [
          'Todo el personal que ejerce funciones de seguridad privada necesita acreditación OS-10 vigente. La credencial tiene una vigencia de tres años y requiere renovación.',
          'La pregunta que importa no es si el personal está acreditado hoy, sino si existe un proceso de renovación. Una empresa conProcesses ordenado lo demuestra entregando el registro de credenciales con sus fechas.',
        ],
      },
      {
        name: 'Estructura',
        question: '¿Cómo se sostiene la operación día a día?',
        body: [
          'El punto donde más se differentiates a las empresas es en la estructura: rotación, supervisión, reemplazo y documentación. Son los cuatro elementos que separan a un proveedor que opera de uno que intermediates.',
          'Un intermediario puede tener mejores precios y personal acreditado, pero delega la estructura. En seguridad privada eso se traduce en que no hay nadie que responda por la continuidad del servicio.',
        ],
      },
    ],
    assessment: [
      { step: 'Verificar la autorización de la empresa', detail: 'Debe poder acreditarla y se comprueba en el Registro de Seguridad Privada.' },
      { step: 'Pedir el registro de credenciales del personal', detail: 'Con las fechas de acreditación y de próxima renovación, para verificar que están vigentes.' },
      { step: 'Exigir una visita antes de cotizar', detail: 'Sin visita al sitio, la cotización es una estimación y debe ser tratada como tal.' },
      { step: 'Revisar el alcance declarado', detail: 'Puestos, horarios, rondas, supervisión, reemplazo, uniforme y equipamiento. Por escrito.' },
      { step: 'Preguntar por el proceso de reemplazo', detail: 'Quién avisa, en cuánto tiempo se cubre y quién lo comunica al cliente.' },
      { step: 'Revisar el seguro y la responsabilidad civil', detail: 'Debe cubrir la operación. Un contrato sin seguro es un riesgo asumido sin saberlo.' },
    ],
    mistakes: [
      {
        mistake: 'Elegir por precio sin homologar el alcance',
        consequence:
          'Es el error más caro. Dos propuestas con alcances distintos no son comparables hasta que se normalizan. Comparar el número final sin revisar qué incluye cada una es la vía más común a una mala decisión.',
      },
      {
        mistake: 'Contratar sin exigir visita a terreno',
        consequence:
          'La cotización sale de un formulario, y un formulario no sabe cuántos accesos tiene el edificio ni cómo es su operación. El resultado es una dotación aproximada que puede sobrar o faltar.',
      },
      {
        mistake: 'No verificar la acreditación del personal',
        consequence:
          'Es un riesgo regulatorio para el cliente y un riesgo operativo. Un guardia sin credencial vigente no puede estar en el puesto, y la empresa que lo asigna expone al cliente a las sanciones de la Ley 21.659.',
      },
      {
        mistake: 'Aceptar un contrato sin cláusula de continuidad',
        consequence:
          'Sin cláusula que defina qué pasa ante una baja o un incumplimiento de cobertura, la resolución del problema queda en la mano de las partes en el momento en que hay más tensión.',
      },
    ],
    sections: [
      {
        heading: 'Las cuatro preguntas que más revelan la calidad de un proveedor',
        body: [
          'Si solo puedes hacer cuatro preguntas antes de decidir, que sean estas.',
        ],
        list: [
          { q: '¿El plan de rondas está por escrito?', a: 'Un proveedor que tiene un método responde con frecuencia y recorrido definidos. Uno que improvisa responde con evasivas, y esa diferencia ya dice casi todo.' },
          { q: '¿Qué pasa cuando falta un guardia?', a: 'La respuesta esperada incluye tiempo de respuesta y responsable identificado, no solo la frase "tenemos personal de reemplazo".' },
          { q: '¿Cómo se documenta la cobertura efectiva de los turnos?', a: 'Es un indicador que un proveedor organizado lleva por control propio. Si no lo tiene, conviene asumir que no lo está midiendo.' },
          { q: '¿Puedo ver el registro de acreditación del personal?', a: 'Con fechas de acreditación y de próxima renovación. No es una petición arbitraria: es una consecuencia directa de la Ley 21.659, y cualquier empresa que opera en el sistema puede entregarlo.' },
        ],
      },
      {
        heading: 'Sobre el precio',
        body: [
          'El precio es un dato, no el criterio. Y en seguridad privada hay una razón concreta por la que los proveedores no publican tarifas: el costo de un servicio depende de la dotación, los turnos, la supervisión y el nivel de riesgo del sitio. Sin esos elementos, cualquier cifra publicada es una cifra que no describe a nadie.',
          'Por eso el mejor proxy de calidad en una cotización es el detalle con que viene: si el alcance está declarado con precisión, hay procesos detrás, y la propuesta se puede comparar. Si es un número con dos líneas, no hay nada detrás que evaluar.',
        ],
      },
      {
        heading: 'La Ley 21.659 cambió el estándar de lo exigible',
        body: [
          'La entrada en vigor de la ley el 28 de noviembre de 2025 no transformó la suscripción en un diferenciador de mercado: la convirtió en el nuevo piso de lo aceptable.',
          'Verificar la autorización de la empresa, la acreditación del personal y la existencia de procedimientos escritos dejó de ser una ventaja de las empresas rigurosas: pasó a ser lo mínimo esperable. Entender el marco permite saber qué preguntar y detectar inmediatamente a quien no cumple.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuál es la diferencia entre una empresa de seguridad y un intermediario?',
        a: 'La diferencia está en la estructura. Una empresa que opera tiene personal en relación laboral propia, proceso de rotación y renovación de acreditaciones, supervisión con registro, y responsabilidad por la continuidad del servicio. Un intermediario puede tener personal acreditado y mejores precios, pero delega esa estructura. En seguridad privada, la estructura es el servicio.',
      },
      {
        q: '¿Debo pedir que me muestren las credenciales de los guardias?',
        a: 'Sí. Es una solicitud razonable y exigible por la ley. La respuesta esperable es un registro con las fechas de acreditación y de próxima renovación, no una negativa ni una evasiva. Cualquier empresa que opera en el sistema puede entregarlo.',
      },
      {
        q: '¿El precio más bajo es siempre la mejor opción?',
        a: 'No necesariamente. Con frecuencia, una propuesta más barata subdimensiona la dotación o excluye elementos que la otra incluye. Antes de comparar precios, hay que normalizar el alcance: mismos puestos, mismos horarios, mismas inclusiones. Solo después la comparación es válida.',
      },
      {
        q: '¿Qué contrato debería tener?',
        a: 'Un contrato que defina con precisión el alcance, los horarios, la supervisión, el procedimiento de reemplazo, las condiciones de rescisión y el seguro de responsabilidad civil. Y que contemple una cláusula de continuidad ante cualquier incumplimiento de cobertura.',
      },
    ],
    ctaTitle: 'Cotiza con una empresa que responde las preguntas',
    ctaBody:
      'Si nuestro propuesta no resiste estas preguntas, no debería acceptarse. Con gusto las respondemos por escrito: autorización, acreditación del personal, estructura de turnos, supervisión y procedimiento de reemplazo.',
  },
];

export const GUIDES_BY_SLUG = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g]),
) as Record<string, GuidePage>;
