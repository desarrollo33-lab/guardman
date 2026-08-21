-- Seed guardpod_questions vv1 — 62 preguntas — generado 2026-08-21T03:37:52.235Z
DELETE FROM guardpod_questions WHERE version = 'v1';
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.nombre_oficial', 'identidad', 1, 1,
     'text', '¿Cómo se llama el producto en documentos y contratos?', 'Queremos conocer la forma canónica del nombre. Si hay diferencias entre "Guardpod", "GuardPod" o "guard-pod" en distintos documentos, anotalas todas.', 'Ej: Guardpod, GuardPod, guard-pod, o variantes según documento',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.claim_diferenciador', 'identidad', 1, 2,
     'textarea', '¿Qué tiene Guardpod que no tiene ningún otro producto similar en Chile?', 'Queremos conocer la razón por la que un cliente elegiría Guardpod por sobre cualquier alternativa. No marketing: la diferencia concreta y verificable. Si la respuesta requiere datos técnicos, dejala a nivel de concepto.', 'Pensá en la última vez que un cliente te dijo "¿y por qué no la otra?". La respuesta que diste es la que va acá.',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.confusiones_tipicas', 'identidad', 1, 3,
     'textarea', '¿Con qué confunden Guardpod los clientes antes de entenderlo?', 'Queremos conocer las confusiones más comunes. Sirven para que la página web las aclare antes de que el cliente pierda tiempo.', 'Las veces que un cliente llegó creyendo que era otra cosa',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.tres_verticales_top', 'cliente_mercado', 2, 1,
     'text', '¿Cuáles son los 3 tipos de proyectos donde Guardpod más se vende?', 'Queremos conocer los 3 rubros principales, ordenados por los que más te piden. Los demás se mencionan en la página web solo si hay espacio.', 'Los 3 más pedidos, de mayor a menor',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.caso_top_1', 'cliente_mercado', 2, 2,
     'textarea', 'Describir un caso real del rubro más vendido (contexto concreto, no genérico).', 'Queremos conocer un caso real: tipo de faena, metros cuadrados o superficie, etapa, horario crítico, materiales o activos en riesgo. Mientras más concreto, mejor.', 'Ej: Obra de 4.000 m² en etapa de obra gruesa en Quilicura, fines de semana largo, riesgo de robo de cobre y herramientas. Concreto, no genérico.',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.caso_top_2', 'cliente_mercado', 2, 3,
     'textarea', 'Describir un caso real del segundo rubro más vendido.', 'Mismo nivel de detalle que el anterior. Caso concreto, no descripción genérica.', 'Caso concreto del segundo rubro más importante',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.caso_top_3', 'cliente_mercado', 2, 4,
     'textarea', 'Describir un caso real del tercer rubro más vendido.', 'Mismo nivel de detalle. Caso concreto.', 'Caso concreto del tercer rubro más importante',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.quien_busca', 'cliente_mercado', 2, 5,
     'multiselect', '¿Quién es la persona que llega preguntando por Guardpod?', 'Queremos conocer al que llega a la web, manda WhatsApp o llama. Su cargo.', NULL,
     0, 1, '["Gerente de obra","Jefe de operaciones","Administrador de fundo","Productor de eventos","Dueño de PYME","Gerente de seguridad corporativa","Ingeniero de faena","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.quien_paga', 'cliente_mercado', 2, 6,
     'select', '¿Quién paga la factura?', 'Queremos conocer al que firma el cheque. A veces es distinto al que busca.', NULL,
     0, 1, '["El mismo que busca","Gerencia general","Dueño de la empresa","Área de seguridad","Área de operaciones","Gerencia de administración y finanzas"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.tamano_empresa', 'cliente_mercado', 2, 7,
     'select', '¿De qué tamaño son las empresas típicas que contratan Guardpod?', 'Queremos conocer la facturación mensual típica del cliente. Para apuntar el marketing a la talla correcta.', NULL,
     0, 1, '["< $10M CLP/mes","$10–$50M CLP/mes","$50–$200M CLP/mes","$200M–$1.000M CLP/mes","> $1.000M CLP/mes"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.dolor_principal', 'cliente_mercado', 2, 8,
     'textarea', '¿Qué es lo que más le preocupa al cliente antes de contratar Guardpod?', 'Queremos conocer el dolor que lo trae. La frase exacta que te dijo cuando preguntó por primera vez.', 'La frase exacta que te dijo el último cliente nuevo',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.metrica_exito', 'cliente_mercado', 2, 9,
     'multiselect', '¿Cómo mide el cliente el éxito de Guardpod?', 'Queremos conocer la métrica que usa para decidir si le sirvió. Sirve para alimentar casos de éxito.', NULL,
     0, 1, '["Robos evitados","Continuidad operacional","Ahorro mensual vs guardias humanos","Paz mental","Cumplimiento de seguros","Detección rápida de incidentes","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.ciclo_decision', 'cliente_mercado', 2, 10,
     'select', '¿Cuánto tarda el cliente típico en decidir la compra?', 'Queremos conocer el ciclo promedio. Para definir el ritmo del follow-up comercial.', NULL,
     0, 1, '["Menos de 1 semana","1 a 4 semanas","1 a 3 meses","Más de 3 meses"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.pregunta_frecuente', 'cliente_mercado', 2, 11,
     'textarea', '¿Cuál es la pregunta que más te hace un cliente antes de firmar?', 'Queremos conocer la pregunta repetida. La que si la respondiéramos bien en la página web, venderíamos más.', 'La pregunta exacta que más te han hecho antes de firmar',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.comunas_prioridad', 'cliente_mercado', 2, 12,
     'text', '¿En qué 5 comunas o zonas hay más demanda real de Guardpod?', 'Queremos conocer la geografía. Para que la página web tenga secciones por zona y para orientar SEO local.', 'Las 5 zonas con más clientes o más leads',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.que_resuelve', 'producto_cliente', 3, 1,
     'textarea', '¿Qué problema concreto de un cliente resuelve Guardpod, en sus palabras?', 'Queremos conocer el problema en lenguaje de cliente, no en lenguaje técnico. La frase que el cliente usaría.', 'Lo que el cliente te dijo: "lo que pasa es que en mi obra..."',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.cuando_brilla', 'producto_cliente', 3, 2,
     'textarea', '¿En qué momento del proyecto el cliente se da cuenta de que Guardpod le sirve?', 'Queremos conocer el momento de "click". Cuándo se convence.', 'El instante en que el cliente pasó de "estoy viendo opciones" a "esto es lo que necesito"',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.porque_no_guardia', 'producto_cliente', 3, 3,
     'textarea', '¿Por qué el cliente elige Guardpod en vez de contratar guardias humanos?', 'Queremos conocer la razón real. No el precio solo — también el cansancio, la rotación, la responsabilidad, lo que sea.', 'La razón verdadera por la que el cliente cambió guardias por Guardpod',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.porque_no_camara', 'producto_cliente', 3, 4,
     'textarea', '¿Por qué el cliente elige Guardpod en vez de instalar cámaras de seguridad fijas?', 'Queremos conocer la diferencia práctica. Lo que el cliente vio que las cámaras no le resolvían.', 'Lo que el cliente dijo cuando comparó: "es que las cámaras no..."',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.funciona_sin_luz', 'producto_cliente', 3, 5,
     'boolean', '¿Guardpod funciona en lugares sin electricidad ni internet fijo?', 'Queremos conocer si esto es parte central del mensaje o un caso puntual. Define la página de inicio.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.donde_no_sirve', 'producto_cliente', 3, 6,
     'textarea', '¿Dónde NO sirve Guardpod? ¿En qué caso el cliente debería mirar otra cosa?', 'Queremos conocer los casos donde Guardpod no aplica. Para no prometer algo que no se puede cumplir y para derivar bien al cliente.', 'Casos reales donde dijiste "mira, para eso te conviene otra cosa"',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.error_comun_cliente', 'producto_cliente', 3, 7,
     'textarea', '¿Cuál es el error más común que comete un cliente al evaluar Guardpod?', 'Queremos conocer la confusión típica. Sirve para aclarar en la página web antes de que el cliente se frustre.', 'Lo que el cliente asumió mal y después se dio cuenta de que estaba errado',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'prod.frase_testimonio', 'producto_cliente', 3, 8,
     'textarea', '¿Cuál es la mejor frase real que te dijo un cliente después de usar Guardpod?', 'Queremos conocer la frase textual del cliente. Aunque sea ordinaria, aunque sea mal redactada. Lo que se usa como testimonio.', 'Copia y pega del WhatsApp, mail o conversación. La frase exacta',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.mejor_exito', 'casos_vividos', 4, 1,
     'textarea', '¿Cuál es el caso de éxito del que más orgulloso estás?', 'Queremos conocer el caso completo: contexto, problema, qué hicieron, resultado. Con detalles.', 'Cliente, situación, qué pasó, qué sentiste cuando lo cerraste',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.peor_queja', 'casos_vividos', 4, 2,
     'textarea', '¿Cuál fue la queja más dura que recibiste de un cliente?', 'Queremos conocer la queja real. Aunque duela. La honestidad acá vale más que diez casos de éxito.', 'La queja más dura, la que te hizo pensar "esto no puede repetirse"',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.fallo_terreno', 'casos_vividos', 4, 3,
     'textarea', '¿Tuviste alguna vez una falla de Guardpod en terreno? ¿Qué pasó?', 'Queremos conocer la falla más recordada. Para prevenir que se repita y para alimentar la sección de capacitación interna.', 'La falla más recordada, con causa y consecuencia',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.cliente_migrado_competencia', 'casos_vividos', 4, 4,
     'textarea', '¿Tuviste algún cliente que se cambió de la competencia a Guardpod? Contar la historia.', 'Queremos conocer la historia de la migración. Contexto: qué tenía la competencia, qué le faltaba, qué le ofreció Guardpod.', 'La historia completa del cambio',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.cliente_perdido', 'casos_vividos', 4, 5,
     'textarea', '¿Por qué el último cliente que NO firmó decidió no avanzar?', 'Queremos conocer la razón real. Lo que el cliente dijo cuando le preguntaste por qué. Aunque incomode.', 'La razón real que te dieron cuando les preguntaste por qué no avanzó',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.frase_pre_firma', 'casos_vividos', 4, 6,
     'textarea', '¿Cuál fue la frase EXACTA del último cliente antes de firmar?', 'Queremos conocer la frase que cerró el negocio. La más persuasiva. La que se usa como cierre del proceso de venta.', 'Copia y pega del WhatsApp, mail o transcripción',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.situacion_inusual', 'casos_vividos', 4, 7,
     'textarea', '¿Tuviste alguna situación inusual o inesperada con un cliente? (positiva o negativa)', 'Queremos conocer los casos atípicos. Los que no encajan en el flujo normal y enseñan algo.', 'Algo que te pasó con un cliente que no te había pasado antes',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.preg_mas_rara', 'casos_vividos', 4, 8,
     'textarea', '¿Cuál es la pregunta más rara que te hizo un cliente sobre Guardpod?', 'Queremos conocer la pregunta inesperada. Para FAQ y para entender qué mitos circulan.', 'La pregunta que te hizo pensar "¿de dónde sacaron eso?"',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.mito_borrar', 'casos_vividos', 4, 9,
     'textarea', 'Si pudieras borrar un mito sobre cámaras solares con IA en Chile, ¿cuál sería?', 'Queremos conocer la creencia falsa más repetida. La que te tocó desmentir más veces en reuniones.', 'La frase que más escuchaste tipo "es que dicen que..."',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.miedo_cliente', 'casos_vividos', 4, 10,
     'textarea', '¿Cuál es el miedo #1 que tiene un cliente antes de arrendar Guardpod?', 'Queremos conocer la frase que el cliente dijo cuando dudó. La más repetida.', 'Lo que el cliente te dijo cuando estaba por firmar pero se echó para atrás',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.tres_competidores_top', 'competencia', 5, 1,
     'text', '¿Con qué 3 empresas o productos compite Guardpod más seguido?', 'Queremos conocer los 3 competidores que más aparecen cuando un cliente está cotizando. Esos son los que tienen página comparativa dedicada.', 'Las 3 marcas o productos que más salen en las cotizaciones',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.heimdal_diferencia', 'competencia', 5, 2,
     'textarea', '¿Cómo se diferencia Guardpod de su principal competidor?', 'Queremos conocer la diferencia concreta. Hechos verificables. Lo que le dirías a un cliente que te dice "ya cotizamos con ellos".', 'Diferencia concreta, no genérica',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.heimdal_peor', 'competencia', 5, 3,
     'textarea', '¿En qué caso un cliente debería elegir al competidor principal y no a Guardpod?', 'Queremos conocer la debilidad real. La honestidad acá es lo que más confianza genera en una página comparativa.', 'El caso en que el competidor es mejor opción',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.dos_competidores_diferencia', 'competencia', 5, 4,
     'textarea', '¿Cómo se diferencia Guardpod del segundo competidor más común?', 'Mismo nivel de detalle que el primero.', 'Diferencia concreta',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.dos_competidores_peor', 'competencia', 5, 5,
     'textarea', '¿En qué caso este segundo competidor es mejor opción?', 'Mismo nivel de honestidad.', 'El caso en que este competidor gana',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.tres_competidores_diferencia', 'competencia', 5, 6,
     'textarea', '¿Cómo se diferencia Guardpod del tercer competidor?', 'Mismo nivel de detalle.', 'Diferencia concreta',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.objeciones_comunes', 'competencia', 5, 7,
     'textarea', '¿Las 3 objeciones más comunes de clientes que comparan con la competencia?', 'Queremos conocer las frases que más escuchás cuando el cliente viene comparando.', 'Las frases exactas que te dijeron en reuniones',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.razones_ganar', 'competencia', 5, 8,
     'textarea', '¿Por qué un cliente elige Guardpod sobre la competencia? Las 3 razones más fuertes.', 'Queremos conocer las razones por las que firmaste los últimos contratos.', 'Las frases textuales que te dijeron al decidir',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.que_practican_ellos', 'competencia', 5, 9,
     'multiselect', '¿Qué prácticas de la competencia te han tocado enfrentar al vender?', 'Queremos conocer los movimientos reales de la competencia que más se repiten. Para preparar el equipo comercial.', NULL,
     0, 0, '["Precio más bajo","Descuentos agresivos","Ofrecen guardia gratis los primeros N días","Dicen que Guardpod no es legal","Dicen que la IA no funciona","Ofrecen marca internacional","Otra"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.no_podemos_competir', 'competencia', 5, 10,
     'textarea', '¿En qué no podemos competir hoy? (Sea por precio, cobertura, capacidad u otro motivo)', 'Queremos conocer los casos donde Guardpod hoy no tiene cómo ganar. Sirve para no prometer lo que no se puede cumplir.', 'Lo que el cliente te pidió y tuviste que decir "no"',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.precio_actual', 'pricing', 6, 1,
     'text', '¿Cuál es el precio que más se repite en las cotizaciones de Guardpod?', 'Queremos conocer el precio que más cierras. No el más bajo ni el más alto, sino el más común. Rango o cifra.', 'Ej: $X–$Y CLP/mes, depende de duración. O el número más repetido',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.que_paga_competencia', 'pricing', 6, 2,
     'textarea', '¿Cuánto cobra la competencia por el servicio equivalente?', 'Queremos conocer lo que el mercado está cobrando por cosas similares. Aunque sea estimado.', 'Lo que el cliente te dice que le cobraron los otros',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.costo_guardia_humana', 'pricing', 6, 3,
     'text', 'Si en vez de Guardpod contratara 2-3 guardias humanos 24/7, ¿cuánto costaría?', 'Queremos conocer la cifra comparable. Lo que pagaría un cliente por la alternativa humana.', 'Costo mensual estimado del equivalente con guardias humanos',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.modelos_comerciales', 'pricing', 6, 4,
     'multiselect', '¿Cómo se ofrece Guardpod comercialmente?', 'Queremos conocer los modelos que hoy cierras contratos.', NULL,
     0, 1, '["Arriendo mensual","Arriendo por evento o día","Venta directa","Leasing","Comodato con servicio incluido","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.que_incluye', 'pricing', 6, 5,
     'textarea', '¿Qué incluye el precio y qué NO?', 'Queremos conocer el alcance real. Lo que está dentro y lo que se cobra aparte.', 'Lista clara: incluye X, Y, Z. No incluye A, B, C',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.objetor_principal', 'ventas', 7, 1,
     'textarea', '¿Cuál es la objeción #1 que hay que vencer para cerrar una venta?', 'Queremos conocer la frase exacta que te dijeron y la frase que tú usaste para responderla.', 'La objeción más repetida y la respuesta que diste',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.truco_cierre', 'ventas', 7, 2,
     'textarea', '¿Cuál es el truco o argumento que más te ha servido para cerrar ventas complicadas?', 'Queremos conocer lo que dices cuando el cliente duda y está a punto de decir que no. Lo que funciona.', 'La frase o movimiento que usaste cuando el cliente se iba sin firmar',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.cuando_cliente_calla', 'ventas', 7, 3,
     'textarea', '¿Qué hacés cuando un cliente deja de responder?', 'Queremos conocer el seguimiento. Cuántos intentos, qué dices, cuándo das por perdido.', 'El proceso de follow-up que usás',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.fuentes_lead', 'ventas', 7, 4,
     'multiselect', '¿De dónde llegan los clientes que contratan?', 'Queremos conocer los canales que más convierten.', NULL,
     0, 1, '["Web / formulario","WhatsApp directo","Vendedor en terreno","Referido de otro cliente","Aliado / partner","LinkedIn","Google Ads","Instagram","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.tasa_conversion', 'ventas', 7, 5,
     'select', 'Aproximadamente, ¿qué porcentaje de leads cierra como cliente?', 'Queremos conocer la tasa de conversión real. Aunque sea estimado.', NULL,
     0, 0, '["Menos del 5%","5–10%","10–20%","20–40%","Más del 40%","No lo sé con certeza"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.alianzas', 'ventas', 7, 6,
     'textarea', '¿Qué alianzas reales (con proyecto concreto) tienes?', 'Queremos conocer las alianzas con proyecto concreto, no solo contactos.', 'Constructora, fundo, productor de eventos, etc. con proyecto real en los últimos 12 meses',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ventas.ferias', 'ventas', 7, 7,
     'multiselect', '¿En qué ferias del rubro participás?', 'Queremos conocer los puntos de contacto presencial.', NULL,
     0, 0, '["Expo Seguridad Chile","Mining Convention (Expomin)","Feria Edifica (construcción)","Sago Fisur (agrícola)","Otra del rubro","Ninguna por ahora"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.cumple_ley_21659', 'legal', 8, 1,
     'textarea', '¿Cómo cumple GuardMan con la Ley 21.659 de Seguridad Privada?', 'Queremos conocer el cumplimiento. Número de inscripción en el Registro Nacional si lo tienen, sino anotar "pendiente" o "no estoy seguro".', 'Número de inscripción, alcance, o "pendiente"',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.permisos_cliente', 'legal', 9, 2,
     'textarea', '¿El cliente necesita algún permiso para instalar Guardpod en su terreno?', 'Queremos conocer si la instalación es libre o requiere algo.', 'Lo que le explicás al cliente cuando pregunta',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.entidad_riesgo_alto', 'legal', 9, 3,
     'textarea', '¿Guardpod sirve como sistema de vigilancia exigido a entidades de riesgo alto?', 'Queremos conocer si Guardpod califica para los clientes que la Ley 21.659 obliga a tener vigilancia privada. Es un segmento B2B grande.', 'Sí/no + explicación de por qué',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.proteccion_datos', 'legal', 9, 4,
     'textarea', '¿La grabación de video cumple con la Ley 19.628 de protección de datos?', 'Queremos conocer el protocolo real. Si no hay, anotar "no definido" — esa es información honesta y útil.', 'Protocolo actual o "no definido" si no existe',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.vision_3_anios', 'vision', 9, 1,
     'textarea', '¿Cómo te imaginás Guardpod en 3 años?', 'Queremos conocer la visión cruda. Cifras, geografías, productos concretos.', 'Lo que le dirías a un socio escéptico en 60 segundos',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.hito_6_meses', 'vision', 10, 2,
     'textarea', '¿Cuál es el hito más importante de los próximos 6 meses?', 'Queremos conocer el objetivo más urgente. Medible, con plazo.', 'El objetivo medible, con plazo',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.tres_barreras', 'vision', 10, 3,
     'textarea', '¿Cuáles son las 3 barreras más grandes para que Guardpod crezca?', 'Queremos conocer los obstáculos reales. Precio, cobertura, desconocimiento del producto, lo que sea.', 'Lo que frena el crecimiento',
     1, 1, NULL, 0);
SELECT COUNT(*) AS total FROM guardpod_questions WHERE version='v1';
