#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// GuardMan — Seed de preguntas del cuestionario GuardPod (v1)
// v5.5.1 — D1 guardman-v2-db
//
// Filosofía: capturar lo que solo el admin sabe (cliente, mercado,
// casos vividos, objeciones). NO preguntar datos técnicos del manual
// (megapíxeles, modelos, IP rating, latencia, número de serie) —
// eso se investiga después con la ficha técnica del producto.
//
// Ejecutar:
//   node scripts/seed-guardpod-questions.mjs
// ════════════════════════════════════════════════════════════════

const QUESTIONS = [
  // ══════════════ 1 — IDENTIDAD DEL PRODUCTO (5) ══════════════
  {
    section: 'identidad', section_order: 1, question_order: 1,
    key: 'identidad.nombre_oficial', type: 'text',
    label: '¿Cómo se llama el producto en documentos y contratos?',
    help: 'Queremos conocer la forma canónica del nombre. Si hay diferencias entre "Guardpod", "GuardPod" o "guard-pod" en distintos documentos, anotalas todas.',
    prompt: 'Ej: Guardpod, GuardPod, guard-pod, o variantes según documento',
    real_world_required: 1, required: 1,
  },
  {
    section: 'identidad', section_order: 1, question_order: 2,
    key: 'identidad.claim_diferenciador', type: 'textarea',
    label: '¿Qué tiene Guardpod que no tiene ningún otro producto similar en Chile?',
    help: 'Queremos conocer la razón por la que un cliente elegiría Guardpod por sobre cualquier alternativa. No marketing: la diferencia concreta y verificable. Si la respuesta requiere datos técnicos, dejala a nivel de concepto.',
    prompt: 'Pensá en la última vez que un cliente te dijo "¿y por qué no la otra?". La respuesta que diste es la que va acá.',
    real_world_required: 1, required: 1,
  },
  {
    section: 'identidad', section_order: 1, question_order: 3,
    key: 'identidad.confusiones_tipicas', type: 'textarea',
    label: '¿Con qué confunden Guardpod los clientes antes de entenderlo?',
    help: 'Queremos conocer las confusiones más comunes. Sirven para que la página web las aclare antes de que el cliente pierda tiempo.',
    prompt: 'Las veces que un cliente llegó creyendo que era otra cosa',
    required: 0,
  },

  // ══════════════ 2 — CLIENTE Y MERCADO (12) ══════════════
  {
    section: 'cliente_mercado', section_order: 2, question_order: 1,
    key: 'cliente.tres_verticales_top', type: 'text',
    label: '¿Cuáles son los 3 tipos de proyectos donde Guardpod más se vende?',
    help: 'Queremos conocer los 3 rubros principales, ordenados por los que más te piden. Los demás se mencionan en la página web solo si hay espacio.',
    prompt: 'Los 3 más pedidos, de mayor a menor',
    real_world_required: 1, required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 2,
    key: 'cliente.caso_top_1', type: 'textarea',
    label: 'Describir un caso real del rubro más vendido (contexto concreto, no genérico).',
    help: 'Queremos conocer un caso real: tipo de faena, metros cuadrados o superficie, etapa, horario crítico, materiales o activos en riesgo. Mientras más concreto, mejor.',
    prompt: 'Ej: Obra de 4.000 m² en etapa de obra gruesa en Quilicura, fines de semana largo, riesgo de robo de cobre y herramientas. Concreto, no genérico.',
    real_world_required: 1, required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 3,
    key: 'cliente.caso_top_2', type: 'textarea',
    label: 'Describir un caso real del segundo rubro más vendido.',
    help: 'Mismo nivel de detalle que el anterior. Caso concreto, no descripción genérica.',
    prompt: 'Caso concreto del segundo rubro más importante',
    real_world_required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 4,
    key: 'cliente.caso_top_3', type: 'textarea',
    label: 'Describir un caso real del tercer rubro más vendido.',
    help: 'Mismo nivel de detalle. Caso concreto.',
    prompt: 'Caso concreto del tercer rubro más importante',
    real_world_required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 5,
    key: 'cliente.quien_busca', type: 'multiselect',
    label: '¿Quién es la persona que llega preguntando por Guardpod?',
    help: 'Queremos conocer al que llega a la web, manda WhatsApp o llama. Su cargo.',
    options: ['Gerente de obra', 'Jefe de operaciones', 'Administrador de fundo', 'Productor de eventos', 'Dueño de PYME', 'Gerente de seguridad corporativa', 'Ingeniero de faena', 'Otro'],
    required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 6,
    key: 'cliente.quien_paga', type: 'select',
    label: '¿Quién paga la factura?',
    help: 'Queremos conocer al que firma el cheque. A veces es distinto al que busca.',
    options: ['El mismo que busca', 'Gerencia general', 'Dueño de la empresa', 'Área de seguridad', 'Área de operaciones', 'Gerencia de administración y finanzas'],
    required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 7,
    key: 'cliente.tamano_empresa', type: 'select',
    label: '¿De qué tamaño son las empresas típicas que contratan Guardpod?',
    help: 'Queremos conocer la facturación mensual típica del cliente. Para apuntar el marketing a la talla correcta.',
    options: ['< $10M CLP/mes', '$10–$50M CLP/mes', '$50–$200M CLP/mes', '$200M–$1.000M CLP/mes', '> $1.000M CLP/mes'],
    required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 8,
    key: 'cliente.dolor_principal', type: 'textarea',
    label: '¿Qué es lo que más le preocupa al cliente antes de contratar Guardpod?',
    help: 'Queremos conocer el dolor que lo trae. La frase exacta que te dijo cuando preguntó por primera vez.',
    prompt: 'La frase exacta que te dijo el último cliente nuevo',
    real_world_required: 1, required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 9,
    key: 'cliente.metrica_exito', type: 'multiselect',
    label: '¿Cómo mide el cliente el éxito de Guardpod?',
    help: 'Queremos conocer la métrica que usa para decidir si le sirvió. Sirve para alimentar casos de éxito.',
    options: ['Robos evitados', 'Continuidad operacional', 'Ahorro mensual vs guardias humanos', 'Paz mental', 'Cumplimiento de seguros', 'Detección rápida de incidentes', 'Otro'],
    required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 10,
    key: 'cliente.ciclo_decision', type: 'select',
    label: '¿Cuánto tarda el cliente típico en decidir la compra?',
    help: 'Queremos conocer el ciclo promedio. Para definir el ritmo del follow-up comercial.',
    options: ['Menos de 1 semana', '1 a 4 semanas', '1 a 3 meses', 'Más de 3 meses'],
    required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 11,
    key: 'cliente.pregunta_frecuente', type: 'textarea',
    label: '¿Cuál es la pregunta que más te hace un cliente antes de firmar?',
    help: 'Queremos conocer la pregunta repetida. La que si la respondiéramos bien en la página web, venderíamos más.',
    prompt: 'La pregunta exacta que más te han hecho antes de firmar',
    required: 1,
  },
  {
    section: 'cliente_mercado', section_order: 2, question_order: 12,
    key: 'cliente.comunas_prioridad', type: 'text',
    label: '¿En qué 5 comunas o zonas hay más demanda real de Guardpod?',
    help: 'Queremos conocer la geografía. Para que la página web tenga secciones por zona y para orientar SEO local.',
    prompt: 'Las 5 zonas con más clientes o más leads',
    required: 1,
  },

  // ══════════════ 3 — PRODUCTO DESDE EL CLIENTE (8) ══════════════
  {
    section: 'producto_cliente', section_order: 3, question_order: 1,
    key: 'prod.que_resuelve', type: 'textarea',
    label: '¿Qué problema concreto de un cliente resuelve Guardpod, en sus palabras?',
    help: 'Queremos conocer el problema en lenguaje de cliente, no en lenguaje técnico. La frase que el cliente usaría.',
    prompt: 'Lo que el cliente te dijo: "lo que pasa es que en mi obra..."',
    real_world_required: 1, required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 2,
    key: 'prod.cuando_brilla', type: 'textarea',
    label: '¿En qué momento del proyecto el cliente se da cuenta de que Guardpod le sirve?',
    help: 'Queremos conocer el momento de "click". Cuándo se convence.',
    prompt: 'El instante en que el cliente pasó de "estoy viendo opciones" a "esto es lo que necesito"',
    required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 3,
    key: 'prod.porque_no_guardia', type: 'textarea',
    label: '¿Por qué el cliente elige Guardpod en vez de contratar guardias humanos?',
    help: 'Queremos conocer la razón real. No el precio solo — también el cansancio, la rotación, la responsabilidad, lo que sea.',
    prompt: 'La razón verdadera por la que el cliente cambió guardias por Guardpod',
    real_world_required: 1, required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 4,
    key: 'prod.porque_no_camara', type: 'textarea',
    label: '¿Por qué el cliente elige Guardpod en vez de instalar cámaras de seguridad fijas?',
    help: 'Queremos conocer la diferencia práctica. Lo que el cliente vio que las cámaras no le resolvían.',
    prompt: 'Lo que el cliente dijo cuando comparó: "es que las cámaras no..."',
    real_world_required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 5,
    key: 'prod.funciona_sin_luz', type: 'boolean',
    label: '¿Guardpod funciona en lugares sin electricidad ni internet fijo?',
    help: 'Queremos conocer si esto es parte central del mensaje o un caso puntual. Define la página de inicio.',
    required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 6,
    key: 'prod.donde_no_sirve', type: 'textarea',
    label: '¿Dónde NO sirve Guardpod? ¿En qué caso el cliente debería mirar otra cosa?',
    help: 'Queremos conocer los casos donde Guardpod no aplica. Para no prometer algo que no se puede cumplir y para derivar bien al cliente.',
    prompt: 'Casos reales donde dijiste "mira, para eso te conviene otra cosa"',
    real_world_required: 1, required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 7,
    key: 'prod.error_comun_cliente', type: 'textarea',
    label: '¿Cuál es el error más común que comete un cliente al evaluar Guardpod?',
    help: 'Queremos conocer la confusión típica. Sirve para aclarar en la página web antes de que el cliente se frustre.',
    prompt: 'Lo que el cliente asumió mal y después se dio cuenta de que estaba errado',
    required: 1,
  },
  {
    section: 'producto_cliente', section_order: 3, question_order: 8,
    key: 'prod.frase_testimonio', type: 'textarea',
    label: '¿Cuál es la mejor frase real que te dijo un cliente después de usar Guardpod?',
    help: 'Queremos conocer la frase textual del cliente. Aunque sea ordinaria, aunque sea mal redactada. Lo que se usa como testimonio.',
    prompt: 'Copia y pega del WhatsApp, mail o conversación. La frase exacta',
    real_world_required: 1, required: 1,
  },

  // ══════════════ 4 — CASOS VIVIDOS (10) ══════════════
  {
    section: 'casos_vividos', section_order: 4, question_order: 1,
    key: 'casos.mejor_exito', type: 'textarea',
    label: '¿Cuál es el caso de éxito del que más orgulloso estás?',
    help: 'Queremos conocer el caso completo: contexto, problema, qué hicieron, resultado. Con detalles.',
    prompt: 'Cliente, situación, qué pasó, qué sentiste cuando lo cerraste',
    real_world_required: 1, required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 2,
    key: 'casos.peor_queja', type: 'textarea',
    label: '¿Cuál fue la queja más dura que recibiste de un cliente?',
    help: 'Queremos conocer la queja real. Aunque duela. La honestidad acá vale más que diez casos de éxito.',
    prompt: 'La queja más dura, la que te hizo pensar "esto no puede repetirse"',
    real_world_required: 1, required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 3,
    key: 'casos.fallo_terreno', type: 'textarea',
    label: '¿Tuviste alguna vez una falla de Guardpod en terreno? ¿Qué pasó?',
    help: 'Queremos conocer la falla más recordada. Para prevenir que se repita y para alimentar la sección de capacitación interna.',
    prompt: 'La falla más recordada, con causa y consecuencia',
    real_world_required: 1, required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 4,
    key: 'casos.cliente_migrado_competencia', type: 'textarea',
    label: '¿Tuviste algún cliente que se cambió de la competencia a Guardpod? Contar la historia.',
    help: 'Queremos conocer la historia de la migración. Contexto: qué tenía la competencia, qué le faltaba, qué le ofreció Guardpod.',
    prompt: 'La historia completa del cambio',
    real_world_required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 5,
    key: 'casos.cliente_perdido', type: 'textarea',
    label: '¿Por qué el último cliente que NO firmó decidió no avanzar?',
    help: 'Queremos conocer la razón real. Lo que el cliente dijo cuando le preguntaste por qué. Aunque incomode.',
    prompt: 'La razón real que te dieron cuando les preguntaste por qué no avanzó',
    real_world_required: 1, required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 6,
    key: 'casos.frase_pre_firma', type: 'textarea',
    label: '¿Cuál fue la frase EXACTA del último cliente antes de firmar?',
    help: 'Queremos conocer la frase que cerró el negocio. La más persuasiva. La que se usa como cierre del proceso de venta.',
    prompt: 'Copia y pega del WhatsApp, mail o transcripción',
    real_world_required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 7,
    key: 'casos.situacion_inusual', type: 'textarea',
    label: '¿Tuviste alguna situación inusual o inesperada con un cliente? (positiva o negativa)',
    help: 'Queremos conocer los casos atípicos. Los que no encajan en el flujo normal y enseñan algo.',
    prompt: 'Algo que te pasó con un cliente que no te había pasado antes',
    required: 0,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 8,
    key: 'casos.preg_mas_rara', type: 'textarea',
    label: '¿Cuál es la pregunta más rara que te hizo un cliente sobre Guardpod?',
    help: 'Queremos conocer la pregunta inesperada. Para FAQ y para entender qué mitos circulan.',
    prompt: 'La pregunta que te hizo pensar "¿de dónde sacaron eso?"',
    required: 0,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 9,
    key: 'casos.mito_borrar', type: 'textarea',
    label: 'Si pudieras borrar un mito sobre cámaras solares con IA en Chile, ¿cuál sería?',
    help: 'Queremos conocer la creencia falsa más repetida. La que te tocó desmentir más veces en reuniones.',
    prompt: 'La frase que más escuchaste tipo "es que dicen que..."',
    real_world_required: 1, required: 1,
  },
  {
    section: 'casos_vividos', section_order: 4, question_order: 10,
    key: 'casos.miedo_cliente', type: 'textarea',
    label: '¿Cuál es el miedo #1 que tiene un cliente antes de arrendar Guardpod?',
    help: 'Queremos conocer la frase que el cliente dijo cuando dudó. La más repetida.',
    prompt: 'Lo que el cliente te dijo cuando estaba por firmar pero se echó para atrás',
    real_world_required: 1, required: 1,
  },

  // ══════════════ 5 — COMPETENCIA Y DIFERENCIACIÓN (10) ══════════════
  {
    section: 'competencia', section_order: 5, question_order: 1,
    key: 'comp.tres_competidores_top', type: 'text',
    label: '¿Con qué 3 empresas o productos compite Guardpod más seguido?',
    help: 'Queremos conocer los 3 competidores que más aparecen cuando un cliente está cotizando. Esos son los que tienen página comparativa dedicada.',
    prompt: 'Las 3 marcas o productos que más salen en las cotizaciones',
    real_world_required: 1, required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 2,
    key: 'comp.heimdal_diferencia', type: 'textarea',
    label: '¿Cómo se diferencia Guardpod de su principal competidor?',
    help: 'Queremos conocer la diferencia concreta. Hechos verificables. Lo que le dirías a un cliente que te dice "ya cotizamos con ellos".',
    prompt: 'Diferencia concreta, no genérica',
    real_world_required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 3,
    key: 'comp.heimdal_peor', type: 'textarea',
    label: '¿En qué caso un cliente debería elegir al competidor principal y no a Guardpod?',
    help: 'Queremos conocer la debilidad real. La honestidad acá es lo que más confianza genera en una página comparativa.',
    prompt: 'El caso en que el competidor es mejor opción',
    real_world_required: 1, required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 4,
    key: 'comp.dos_competidores_diferencia', type: 'textarea',
    label: '¿Cómo se diferencia Guardpod del segundo competidor más común?',
    help: 'Mismo nivel de detalle que el primero.',
    prompt: 'Diferencia concreta',
    real_world_required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 5,
    key: 'comp.dos_competidores_peor', type: 'textarea',
    label: '¿En qué caso este segundo competidor es mejor opción?',
    help: 'Mismo nivel de honestidad.',
    prompt: 'El caso en que este competidor gana',
    real_world_required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 6,
    key: 'comp.tres_competidores_diferencia', type: 'textarea',
    label: '¿Cómo se diferencia Guardpod del tercer competidor?',
    help: 'Mismo nivel de detalle.',
    prompt: 'Diferencia concreta',
    real_world_required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 7,
    key: 'comp.objeciones_comunes', type: 'textarea',
    label: '¿Las 3 objeciones más comunes de clientes que comparan con la competencia?',
    help: 'Queremos conocer las frases que más escuchás cuando el cliente viene comparando.',
    prompt: 'Las frases exactas que te dijeron en reuniones',
    required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 8,
    key: 'comp.razones_ganar', type: 'textarea',
    label: '¿Por qué un cliente elige Guardpod sobre la competencia? Las 3 razones más fuertes.',
    help: 'Queremos conocer las razones por las que firmaste los últimos contratos.',
    prompt: 'Las frases textuales que te dijeron al decidir',
    real_world_required: 1, required: 1,
  },
  {
    section: 'competencia', section_order: 5, question_order: 9,
    key: 'comp.que_practican_ellos', type: 'multiselect',
    label: '¿Qué prácticas de la competencia te han tocado enfrentar al vender?',
    help: 'Queremos conocer los movimientos reales de la competencia que más se repiten. Para preparar el equipo comercial.',
    options: ['Precio más bajo', 'Descuentos agresivos', 'Ofrecen guardia gratis los primeros N días', 'Dicen que Guardpod no es legal', 'Dicen que la IA no funciona', 'Ofrecen marca internacional', 'Otra'],
    required: 0,
  },
  {
    section: 'competencia', section_order: 5, question_order: 10,
    key: 'comp.no_podemos_competir', type: 'textarea',
    label: '¿En qué no podemos competir hoy? (Sea por precio, cobertura, capacidad u otro motivo)',
    help: 'Queremos conocer los casos donde Guardpod hoy no tiene cómo ganar. Sirve para no prometer lo que no se puede cumplir.',
    prompt: 'Lo que el cliente te pidió y tuviste que decir "no"',
    real_world_required: 1, required: 1,
  },

  // ══════════════ 6 — PRICING DEL MERCADO (5) ══════════════
  {
    section: 'pricing', section_order: 6, question_order: 1,
    key: 'pricing.precio_actual', type: 'text',
    label: '¿Cuál es el precio que más se repite en las cotizaciones de Guardpod?',
    help: 'Queremos conocer el precio que más cierras. No el más bajo ni el más alto, sino el más común. Rango o cifra.',
    prompt: 'Ej: $X–$Y CLP/mes, depende de duración. O el número más repetido',
    real_world_required: 1, required: 1,
  },
  {
    section: 'pricing', section_order: 6, question_order: 2,
    key: 'pricing.que_paga_competencia', type: 'textarea',
    label: '¿Cuánto cobra la competencia por el servicio equivalente?',
    help: 'Queremos conocer lo que el mercado está cobrando por cosas similares. Aunque sea estimado.',
    prompt: 'Lo que el cliente te dice que le cobraron los otros',
    required: 1,
  },
  {
    section: 'pricing', section_order: 6, question_order: 3,
    key: 'pricing.costo_guardia_humana', type: 'text',
    label: 'Si en vez de Guardpod contratara 2-3 guardias humanos 24/7, ¿cuánto costaría?',
    help: 'Queremos conocer la cifra comparable. Lo que pagaría un cliente por la alternativa humana.',
    prompt: 'Costo mensual estimado del equivalente con guardias humanos',
    required: 1,
  },
  {
    section: 'pricing', section_order: 6, question_order: 4,
    key: 'pricing.modelos_comerciales', type: 'multiselect',
    label: '¿Cómo se ofrece Guardpod comercialmente?',
    help: 'Queremos conocer los modelos que hoy cierras contratos.',
    options: ['Arriendo mensual', 'Arriendo por evento o día', 'Venta directa', 'Leasing', 'Comodato con servicio incluido', 'Otro'],
    required: 1,
  },
  {
    section: 'pricing', section_order: 6, question_order: 5,
    key: 'pricing.que_incluye', type: 'textarea',
    label: '¿Qué incluye el precio y qué NO?',
    help: 'Queremos conocer el alcance real. Lo que está dentro y lo que se cobra aparte.',
    prompt: 'Lista clara: incluye X, Y, Z. No incluye A, B, C',
    required: 1,
  },

  // ══════════════ 7 — OBJECIONES Y VENTAS (8) ══════════════
  {
    section: 'ventas', section_order: 7, question_order: 1,
    key: 'ventas.objetor_principal', type: 'textarea',
    label: '¿Cuál es la objeción #1 que hay que vencer para cerrar una venta?',
    help: 'Queremos conocer la frase exacta que te dijeron y la frase que tú usaste para responderla.',
    prompt: 'La objeción más repetida y la respuesta que diste',
    real_world_required: 1, required: 1,
  },
  {
    section: 'ventas', section_order: 7, question_order: 2,
    key: 'ventas.truco_cierre', type: 'textarea',
    label: '¿Cuál es el truco o argumento que más te ha servido para cerrar ventas complicadas?',
    help: 'Queremos conocer lo que dices cuando el cliente duda y está a punto de decir que no. Lo que funciona.',
    prompt: 'La frase o movimiento que usaste cuando el cliente se iba sin firmar',
    real_world_required: 1,
  },
  {
    section: 'ventas', section_order: 7, question_order: 3,
    key: 'ventas.cuando_cliente_calla', type: 'textarea',
    label: '¿Qué hacés cuando un cliente deja de responder?',
    help: 'Queremos conocer el seguimiento. Cuántos intentos, qué dices, cuándo das por perdido.',
    prompt: 'El proceso de follow-up que usás',
    required: 0,
  },
  {
    section: 'ventas', section_order: 7, question_order: 4,
    key: 'ventas.fuentes_lead', type: 'multiselect',
    label: '¿De dónde llegan los clientes que contratan?',
    help: 'Queremos conocer los canales que más convierten.',
    options: ['Web / formulario', 'WhatsApp directo', 'Vendedor en terreno', 'Referido de otro cliente', 'Aliado / partner', 'LinkedIn', 'Google Ads', 'Instagram', 'Otro'],
    required: 1,
  },
  {
    section: 'ventas', section_order: 7, question_order: 5,
    key: 'ventas.tasa_conversion', type: 'select',
    label: 'Aproximadamente, ¿qué porcentaje de leads cierra como cliente?',
    help: 'Queremos conocer la tasa de conversión real. Aunque sea estimado.',
    options: ['Menos del 5%', '5–10%', '10–20%', '20–40%', 'Más del 40%', 'No lo sé con certeza'],
    required: 0,
  },
  {
    section: 'ventas', section_order: 7, question_order: 6,
    key: 'ventas.alianzas', type: 'textarea',
    label: '¿Qué alianzas reales (con proyecto concreto) tienes?',
    help: 'Queremos conocer las alianzas con proyecto concreto, no solo contactos.',
    prompt: 'Constructora, fundo, productor de eventos, etc. con proyecto real en los últimos 12 meses',
    required: 0,
  },
  {
    section: 'ventas', section_order: 7, question_order: 7,
    key: 'ventas.ferias', type: 'multiselect',
    label: '¿En qué ferias del rubro participás?',
    help: 'Queremos conocer los puntos de contacto presencial.',
    options: ['Expo Seguridad Chile', 'Mining Convention (Expomin)', 'Feria Edifica (construcción)', 'Sago Fisur (agrícola)', 'Otra del rubro', 'Ninguna por ahora'],
    required: 0,
  },

  // ══════════════ 9 — LEGAL Y COMPLIANCE (4) ══════════════
  {
    section: 'legal', section_order: 8, question_order: 1,
    key: 'legal.cumple_ley_21659', type: 'textarea',
    label: '¿Cómo cumple GuardMan con la Ley 21.659 de Seguridad Privada?',
    help: 'Queremos conocer el cumplimiento. Número de inscripción en el Registro Nacional si lo tienen, sino anotar "pendiente" o "no estoy seguro".',
    prompt: 'Número de inscripción, alcance, o "pendiente"',
    real_world_required: 1, required: 1,
  },
  {
    section: 'legal', section_order: 9, question_order: 2,
    key: 'legal.permisos_cliente', type: 'textarea',
    label: '¿El cliente necesita algún permiso para instalar Guardpod en su terreno?',
    help: 'Queremos conocer si la instalación es libre o requiere algo.',
    prompt: 'Lo que le explicás al cliente cuando pregunta',
    required: 0,
  },
  {
    section: 'legal', section_order: 9, question_order: 3,
    key: 'legal.entidad_riesgo_alto', type: 'textarea',
    label: '¿Guardpod sirve como sistema de vigilancia exigido a entidades de riesgo alto?',
    help: 'Queremos conocer si Guardpod califica para los clientes que la Ley 21.659 obliga a tener vigilancia privada. Es un segmento B2B grande.',
    prompt: 'Sí/no + explicación de por qué',
    real_world_required: 1,
  },
  {
    section: 'legal', section_order: 9, question_order: 4,
    key: 'legal.proteccion_datos', type: 'textarea',
    label: '¿La grabación de video cumple con la Ley 19.628 de protección de datos?',
    help: 'Queremos conocer el protocolo real. Si no hay, anotar "no definido" — esa es información honesta y útil.',
    prompt: 'Protocolo actual o "no definido" si no existe',
    real_world_required: 1, required: 1,
  },

  // ══════════════ 10 — VISIÓN Y ROADMAP (3) ══════════════
  {
    section: 'vision', section_order: 9, question_order: 1,
    key: 'vis.vision_3_anios', type: 'textarea',
    label: '¿Cómo te imaginás Guardpod en 3 años?',
    help: 'Queremos conocer la visión cruda. Cifras, geografías, productos concretos.',
    prompt: 'Lo que le dirías a un socio escéptico en 60 segundos',
    real_world_required: 1, required: 1,
  },
  {
    section: 'vision', section_order: 10, question_order: 2,
    key: 'vis.hito_6_meses', type: 'textarea',
    label: '¿Cuál es el hito más importante de los próximos 6 meses?',
    help: 'Queremos conocer el objetivo más urgente. Medible, con plazo.',
    prompt: 'El objetivo medible, con plazo',
    required: 1,
  },
  {
    section: 'vision', section_order: 10, question_order: 3,
    key: 'vis.tres_barreras', type: 'textarea',
    label: '¿Cuáles son las 3 barreras más grandes para que Guardpod crezca?',
    help: 'Queremos conocer los obstáculos reales. Precio, cobertura, desconocimiento del producto, lo que sea.',
    prompt: 'Lo que frena el crecimiento',
    real_world_required: 1, required: 1,
  },
];

// ════════════════════════════════════════════════════════════════
// Generación de SQL de seed
// ════════════════════════════════════════════════════════════════

const VERSION = 'v1';
const NOW = new Date().toISOString();

function esc(value) {
  if (value === null || value === undefined) return 'NULL';
  return "'" + String(value).replace(/'/g, "''") + "'";
}

let sql = `-- Seed guardpod_questions v${VERSION} — ${QUESTIONS.length} preguntas — generado ${NOW}\n`;
sql += `DELETE FROM guardpod_questions WHERE version = '${VERSION}';\n`;

for (const q of QUESTIONS) {
  const optionsJson = q.options ? esc(JSON.stringify(q.options)) : 'NULL';
  const helpText = q.help ? esc(q.help) : 'NULL';
  const prompt = q.prompt ? esc(q.prompt) : 'NULL';
  sql += `INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('${VERSION}', ${esc(q.key)}, ${esc(q.section)}, ${q.section_order}, ${q.question_order},
     ${esc(q.type)}, ${esc(q.label)}, ${helpText}, ${prompt},
     ${q.real_world_required ? 1 : 0}, ${q.required ? 1 : 0}, ${optionsJson}, 0);\n`;
}

sql += `SELECT COUNT(*) AS total FROM guardpod_questions WHERE version='${VERSION}';\n`;

// ════════════════════════════════════════════════════════════════
// Salida
// ════════════════════════════════════════════════════════════════

const { writeFileSync } = await import('fs');
const { dirname, join } = await import('path');
const { fileURLToPath } = await import('url');

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'migrations', '0003_seed_guardpod_questions_v1.sql');
writeFileSync(out, sql, 'utf8');
console.log(`Wrote ${out}`);
console.log(`Total questions: ${QUESTIONS.length}`);
console.log(`Sections: ${new Set(QUESTIONS.map(q => q.section)).size}`);
console.log(`Real-world required: ${QUESTIONS.filter(q => q.real_world_required).length}`);
console.log(`Reduction: 131 → ${QUESTIONS.length} (${Math.round((1 - QUESTIONS.length / 131) * 100)}% less)`);
