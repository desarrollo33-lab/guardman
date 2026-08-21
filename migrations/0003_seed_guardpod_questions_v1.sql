-- Seed guardpod_questions vv1 — 131 preguntas — generado 2026-08-21T02:52:25.309Z
DELETE FROM guardpod_questions WHERE version = 'v1';
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.nombre_oficial', 'identidad', 1, 1,
     'text', '¿Cómo se llama el producto?', 'Queremos conocer el nombre oficial que se usa en documentos, contratos y la página web. A veces "Guardpod" tiene una variante con mayúscula, con guion, abreviado. Necesitamos el nombre canónico.', 'Ej: Guardpod, GuardPod, Guard-Pod',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.tagline', 'identidad', 1, 2,
     'text', '¿Cuál es la frase corta que lo describe? (≤80 chars)', 'Queremos conocer cómo se presenta el producto en una tarjeta. La frase que alguien repite cuando le preguntan "¿qué es Guardpod?".', 'Ej: Vigilancia autónoma con IA, sin infraestructura',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.proposicion_valor', 'identidad', 1, 3,
     'textarea', '¿Cómo lo explicarías en una frase? (≤200 chars)', 'Queremos conocer la versión un-poco-más-larga de la descripción. La que cabe en un párrafo introductorio.', 'Ej: Cámara PTZ 360° con IA, alimentada por panel solar, monitoreada desde nuestra central 24/7.',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.claim_diferenciador', 'identidad', 1, 4,
     'textarea', '¿Qué tiene Guardpod que nadie más en Chile tiene?', 'Queremos conocer la razón por la que un cliente debería elegir Guardpod por sobre cualquier otra opción. Lo que tú sabes del mercado chileno y del producto real. La respuesta honesta, no la marketera.', 'Ej: Somos la única empresa en Chile que diseña, fabrica y monitorea su propia torre solar con IA desde su propia central 24/7.',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.tres_palabras', 'identidad', 1, 5,
     'text', 'Si tuvieras que explicar Guardpod a un gerente de obra en 3 palabras, ¿cuáles serían?', 'Queremos conocer el vocabulario que usa la gente real (no el de la página web). Las 3 palabras que un cliente usa cuando habla de Guardpod con su familia, con su socio, con su contador.', 'Ej: autónoma, con IA, sin cables',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.que_no_es', 'identidad', 1, 6,
     'multiselect', '¿Qué NO es Guardpod?', 'Queremos conocer las confusiones más comunes que tienen los clientes. Lo que creen que es y no es. Sirve para aclarar expectativas antes de que pierdan tiempo.', NULL,
     0, 1, '["Cámara de seguridad tradicional","Alarma con monitoreo","Dron de seguridad","Guardia humano presencial","CCTV con grabación","Sistema que requiere internet fijo","Sistema que requiere generador eléctrico","Sistema que requiere obras civiles"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.tono_comunicacion', 'identidad', 1, 7,
     'multiselect', '¿Qué tono querés que use la página web cuando habla de Guardpod?', 'Queremos conocer si el cliente típico de Guardpod responde mejor a un lenguaje técnico, a uno más cercano, a uno premium, etc. Tú conoces al cliente, no nosotros.', NULL,
     0, 1, '["Técnico y preciso","Cercano y directo","Premium / aspiracional","B2B sobrio","Cercano al terreno (obras, faenas)","Agrícola / rural"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'identidad.logo_archivo', 'identidad', 1, 8,
     'upload', '¿Tenés un logo o imagotipo separado para Guardpod o usás el de GuardMan?', 'Queremos conocer si existe material gráfico propio o si hay que crearlo. Si hay archivo, lo subís.', 'Sube el archivo si existe',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.camera_ptz_brand', 'hardware', 2, 1,
     'text', '¿Qué marca y modelo exacto de cámara PTZ usan?', 'Queremos conocer la ficha técnica real. Lo que está dentro de la caja, con su número de modelo.', 'Ej: Hikvision DS-2DE4A425IW, Dahua SD6AL245U-HNI, etc.',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.resolucion', 'hardware', 2, 2,
     'select', '¿De cuántos megapíxeles es la cámara?', 'Queremos conocer la resolución real. 2MP, 4MP, 4K, 8K. Lo que entrega la cámara, no lo que dice el folleto.', NULL,
     0, 1, '["2MP (1080p)","4MP","4K (8MP)","8K"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.zoom_optico', 'hardware', 2, 3,
     'number', '¿Cuánto zoom óptico tiene?', 'Queremos conocer las veces que puede acercar la imagen sin perder calidad. Por ejemplo, 30×.', 'Ej: 30',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.rango_ptz_horizontal', 'hardware', 2, 4,
     'number', '¿Cuántos grados gira horizontalmente?', 'Queremos conocer el rango real de movimiento horizontal. La mayoría cubre 360°.', 'Ej: 360',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.rango_ptz_vertical', 'hardware', 2, 5,
     'number', '¿Cuántos grados gira verticalmente?', 'Queremos conocer el rango real de movimiento vertical. Generalmente -15° a 90°.', 'Ej: 90',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.vision_nocturna_tipo', 'hardware', 2, 6,
     'select', '¿Qué tipo de visión nocturna usa?', 'Queremos conocer si usa infrarrojo, starlight (color de noche), térmica, o una mezcla. Cada una tiene implicancias distintas en el tipo de faena donde sirve.', NULL,
     0, 1, '["Infrarroja (IR)","Starlight (color de noche)","Térmica","IR + térmica","Starlight + IR"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.vision_nocturna_alcance', 'hardware', 2, 7,
     'number', '¿Hasta cuántos metros ve de noche?', 'Queremos conocer el alcance real. La cifra que le decís al cliente cuando pregunta "¿ve hasta allá?".', 'Ej: 150',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.bateria_capacidad', 'hardware', 2, 8,
     'text', '¿De qué capacidad es la batería?', 'Queremos conocer la capacidad de la batería interna. La cifra en Wh o Ah.', 'Ej: 200Ah, 2.4kWh, etc.',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.autonomia_declarada_horas', 'hardware', 2, 9,
     'number', '¿Cuántas horas dura sin sol, según el manual?', 'Queremos conocer la autonomía declarada por el fabricante. La cifra del folleto.', 'Ej: 72',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.autonomia_real_horas', 'hardware', 2, 10,
     'number', '¿Y en terreno, cuántas horas duró en la peor prueba?', 'Queremos conocer la autonomía real, medida en uso. Si la real es menor que la declarada, lo importante es la real.', 'La cifra más baja que mediste en uso real',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.panel_solar_potencia', 'hardware', 2, 11,
     'number', '¿De cuántos watts es el panel solar?', 'Queremos conocer la potencia del panel en watts peak.', 'Ej: 400',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.panel_solar_fabricante', 'hardware', 2, 12,
     'text', '¿Quién fabricó el panel solar?', 'Queremos conocer la marca del panel para la ficha técnica.', 'Ej: Canadian Solar, Trina, Jinko, propio',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.conectividad', 'hardware', 2, 13,
     'multiselect', '¿Cómo se conecta a internet?', 'Queremos conocer las opciones de conectividad que tiene Guardpod. Real, no teórica.', NULL,
     0, 1, '["4G/LTE","5G (opcional)","Satelital","WiFi","Ethernet"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.operador_4g', 'hardware', 2, 14,
     'select', '¿Qué operador 4G usan?', 'Queremos conocer la SIM que viene por defecto y con cuál tienen mejor cobertura en faena.', NULL,
     0, 1, '["Movistar","Entel","Claro","WOM","Multi-SIM (roaming entre operadores)"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.certificacion_ip', 'hardware', 2, 15,
     'select', '¿Qué certificación IP tiene el equipo?', 'Queremos conocer la resistencia al agua y al polvo. La cifra que importa cuando un cliente pregunta "¿aguanta la lluvia?".', NULL,
     0, 1, '["IP65","IP66","IP67","IP68"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.rango_temperatura', 'hardware', 2, 16,
     'text', '¿En qué rango de temperatura opera?', 'Queremos conocer los límites de operación. Para responder a clientes en zonas frías (Patagonia) o calurosas (norte minero).', 'Ej: -10°C a 55°C',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.peso_kg', 'hardware', 2, 17,
     'number', '¿Cuánto pesa el módulo completo?', 'Queremos conocer el peso para responder a clientes que preguntan si pueden cargarlo entre dos personas o si requiere maquinaria.', 'Ej: 85',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'hardware.tiempo_instalacion_min', 'hardware', 2, 18,
     'number', '¿Cuánto demora la instalación típica?', 'Queremos conocer los minutos entre que llega al lugar y está transmitiendo.', 'Ej: 30',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.origen', 'software_ia', 3, 1,
     'select', '¿La detección por IA la hicieron ustedes o la compraron a un tercero?', 'Queremos conocer si la IA es propia (entrenada por GuardMan) o viene de un proveedor (Hikvision, Dahua, Scylla, etc.). Esto define qué tan único es el producto.', NULL,
     1, 1, '["Propia (entrenada por GuardMan)","Hikvision","Dahua","Scylla AI","Otro proveedor","Híbrida (base de terceros + ajustes propios)"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.objetos_detectables', 'software_ia', 3, 2,
     'multiselect', '¿Qué cosas puede detectar la IA?', 'Queremos conocer la lista real de lo que la IA distingue hoy. No lo que dice el brochure.', NULL,
     0, 1, '["Persona","Vehículo","Animal","Arma","Paquete","Rostro","Multitudes","Cruce de línea virtual"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.falsos_positivos_declarado_pct', 'software_ia', 3, 3,
     'number', '¿Cuántas falsas alarmas declara el fabricante? (en %)', 'Queremos conocer el porcentaje de veces que la IA manda una alerta sin que haya pasado nada, según la ficha técnica.', 'Ej: 5',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.falsos_positivos_real_pct', 'software_ia', 3, 4,
     'number', '¿Y cuántas falsas alarmas tuvo en el peor mes? (en %)', 'Queremos conocer la cifra real, medida en terreno. La honestidad acá vale más que la cifra del manual.', 'El peor mes que recuerdes',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.deteccion_direccion', 'software_ia', 3, 5,
     'boolean', '¿Detecta la dirección del movimiento?', 'Queremos conocer si la IA distingue si alguien entra o sale.', NULL,
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.deteccion_permanencia', 'software_ia', 3, 6,
     'boolean', '¿Detecta permanencia prolongada (loitering)?', 'Queremos conocer si la IA alerta cuando alguien se queda mucho tiempo en un lugar.', NULL,
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.deteccion_cruce_linea', 'software_ia', 3, 7,
     'boolean', '¿Detecta cruce de línea virtual?', 'Queremos conocer si se puede definir una línea imaginaria y que la IA alerte cuando alguien la cruza.', NULL,
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.deteccion_aglomeracion', 'software_ia', 3, 8,
     'boolean', '¿Detecta aglomeración de personas?', 'Queremos conocer si la IA alerta cuando se concentran varias personas en un punto.', NULL,
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.latencia_alerta_segundos', 'software_ia', 3, 9,
     'number', 'Entre que la IA detecta algo y suena la alerta, ¿cuántos segundos pasan?', 'Queremos conocer la latencia real. La cifra que importa cuando hay una intrusión real.', 'En segundos',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.app_cliente_video_en_vivo', 'software_ia', 3, 10,
     'boolean', '¿El cliente puede ver el video en vivo desde su celular?', 'Queremos conocer si hay app o dashboard. Si sí, qué puede hacer el cliente desde ahí.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.retencion_local_dias', 'software_ia', 3, 11,
     'number', '¿Cuántos días de video se guardan en el equipo local?', 'Queremos conocer la retención de video en la memoria interna del equipo.', 'En días',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'ia.retencion_nube_dias', 'software_ia', 3, 12,
     'number', '¿Y en la nube, cuántos días?', 'Queremos conocer la retención de video en el almacenamiento en la nube.', 'En días',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.propia', 'central', 4, 1,
     'boolean', '¿La central que monitorea Guardpod es de GuardMan o la contratan a otro?', 'Queremos conocer si la central de monitoreo es propia. Esto es central para entender qué tan único es el servicio.', NULL,
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.operativa_24_7_365', 'central', 4, 2,
     'boolean', '¿La central opera 24/7 los 365 días?', 'Queremos conocer si la cobertura es real o tiene horarios.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.operadores_por_turno', 'central', 4, 3,
     'number', '¿Cuántos operadores hay por turno?', 'Queremos conocer la redundancia real. Si cae un operador, ¿hay otro?', 'Número entero',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.tiempo_reaccion_minutos', 'central', 4, 4,
     'number', 'Cuando suena una alerta, ¿cuántos minutos tardan en reaccionar?', 'Queremos conocer el tiempo promedio entre que suena la alerta y se hace algo.', 'En minutos',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.protocolo_alerta', 'central', 4, 5,
     'textarea', '¿Qué hacen paso a paso cuando suena una alerta?', 'Queremos conocer el protocolo real. Lo que el operador hace, en orden, cuando recibe una alerta.', 'Escribe los 5-7 pasos como los haría tu operador más metódico, con tiempos entre cada paso',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.cuando_llama_carabineros', 'central', 4, 6,
     'select', '¿Cuándo llaman a Carabineros?', 'Queremos conocer en qué situación se llama. La regla que aplica.', NULL,
     0, 1, '["Siempre que hay alerta","Solo si se confirma intrusión visualmente","Si pasa más de N minutos sin respuesta del cliente","Nunca, solo se notifica al cliente","Depende del cliente (configurable)"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.coordinacion_terreno', 'central', 4, 7,
     'boolean', '¿También se coordina con personal de GuardMan en terreno?', 'Queremos conocer si además de Carabineros hay respuesta propia. Cómo es la cadena.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.reporte_diario', 'central', 4, 8,
     'boolean', '¿Le mandan un reporte diario al cliente?', 'Queremos conocer la periodicidad y el formato de los reportes.', NULL,
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.dashboard_cliente', 'central', 4, 9,
     'boolean', '¿El cliente puede entrar a un dashboard y ver en vivo?', 'Queremos conocer si hay portal del cliente y qué puede ver.', NULL,
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'central.sla_uptime_pct', 'central', 4, 10,
     'number', '¿Qué uptime prometen por contrato? (en %)', 'Queremos conocer la cifra de SLA. Cuánto se comprometen a que la central esté prendida.', 'Ej: 99.5',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.verticales_orden', 'casos_uso', 5, 1,
     'text', '¿Para qué tipos de proyectos sirve más Guardpod? (ordenado por prioridad)', 'Queremos conocer los rubros donde mejor funciona. Los que más te piden. Los que más se repiten. El orden es importante — los primeros son donde más hay que enfocarse.', 'Ordena por los verticales donde ya tienes clientes o donde llegan más leads. Ej: 1) obras construcción, 2) faenas mineras, 3) parcelas agrícolas, 4) eventos masivos, 5) estacionamientos',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.caso_canonico_1', 'casos_uso', 5, 2,
     'textarea', 'Para el primer vertical, describí un caso real.', 'Queremos conocer el caso típico de cada rubro. Con metros cuadrados, etapa, horario crítico, materiales en riesgo. Un caso concreto, no una descripción genérica.', 'Como si le explicaras a un amigo: obra de 4.000 m² en etapa de obra gruesa en Quilicura, fines de semana largo, robo de cobre y herramientas',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.caso_canonico_2', 'casos_uso', 5, 3,
     'textarea', 'Para el segundo vertical, describí un caso real.', 'Queremos conocer el caso típico de cada rubro. Con metros cuadrados, etapa, horario crítico, materiales en riesgo. Un caso concreto, no una descripción genérica.', 'Caso concreto del segundo rubro más importante',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.caso_canonico_3', 'casos_uso', 5, 4,
     'textarea', 'Para el tercer vertical, describí un caso real.', 'Queremos conocer el caso típico de cada rubro. Con metros cuadrados, etapa, horario crítico, materiales en riesgo. Un caso concreto, no una descripción genérica.', 'Caso concreto del tercer rubro más importante',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.no_atendemos', 'casos_uso', 5, 5,
     'multiselect', '¿Hay casos donde NO ofrecen Guardpod?', 'Queremos conocer los casos donde mejor ni intentarlo. Para no perder tiempo ni prometer algo que no se puede cumplir.', NULL,
     0, 0, '["Residencial urbano permanente con portero 24/7","Edificio de apartamentos con CCTV ya instalado","Retail con monitoreo propio","Faena a más de X km de la central","Terreno con internet fijo y electricidad estable","Cliente que necesita videovigilancia 24/7 con vigilante en terreno"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.errores_comunes_clientes', 'casos_uso', 5, 6,
     'textarea', '¿Qué errores cometen los clientes cuando evalúan Guardpod?', 'Queremos conocer las confusiones típicas. Lo que creen que es y no es. Para la FAQ.', 'Lo que más has tenido que aclarar en reuniones',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.mejor_testimonio', 'casos_uso', 5, 7,
     'textarea', '¿Cuál es el mejor caso de éxito que tengas?', 'Queremos conocer el caso del que más orgullo tienes. Con detalles. Si tenés foto o video del cliente, lo subís.', 'Lo que el cliente te dijo verbatim, o la frase más recordada del caso',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.peor_experiencia', 'casos_uso', 5, 8,
     'textarea', '¿Cuál fue la peor experiencia o queja real?', 'Queremos conocer el caso donde algo salió mal. Aunque duela. La honestidad acá vale más que diez casos de éxito.', 'La queja más dura que recibiste',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.fallo_terreno', 'casos_uso', 5, 9,
     'textarea', '¿Tuviste alguna vez un caso donde Guardpod falló en terreno?', 'Queremos conocer la falla más recordada. La que te hizo decir "esto no debería haber pasado". Sirve para prevenir que se repita.', 'La falla más recordada, con causa y consecuencia',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'casos.alertas_ultimo_mes', 'casos_uso', 5, 10,
     'number', '¿Cuántas alertas reales (no pruebas) hubo el último mes?', 'Queremos conocer el número de la última planilla. El real, no el estimado.', 'Abre la planilla del último mes y anota el número exacto',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.heimdal_diferencia', 'competencia', 6, 1,
     'textarea', '¿En qué se diferencia Guardpod de Heimdal?', 'Queremos conocer la diferencia concreta. Hechos verificables. Lo que le dirías a un cliente que te dice "ya cotizamos con ellos".', 'Diferencia concreta, no genérica',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.heimdal_mejor', 'competencia', 6, 2,
     'multiselect', '¿En qué cosas es mejor Guardpod que Heimdal?', 'Queremos conocer las ventajas específicas. Para armar la tabla comparativa.', NULL,
     0, 0, '["Precio","Hardware propio","IA propia","Monitoreo 24/7 desde central propia","Cobertura RM","Rapidez de instalación","SLA / uptime","Soporte"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.heimdal_peor', 'competencia', 6, 3,
     'textarea', '¿En qué es igual o peor que Heimdal?', 'Queremos conocer las debilidades reales. La honestidad acá es lo que más confía la gente.', '¿En qué caso un cliente debería elegir Heimdal y no Guardpod?',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.cleanlight_diferencia', 'competencia', 6, 4,
     'textarea', '¿En qué se diferencia Guardpod de Cleanlight (rental de torres)?', 'Queremos conocer la diferencia concreta contra el arriendo de torres solares puro.', 'Diferencia concreta, no genérica',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.cleanlight_peor', 'competencia', 6, 5,
     'textarea', '¿En qué es igual o peor que Cleanlight?', 'Queremos conocer las debilidades reales. La honestidad acá es lo que más confía la gente.', '¿En qué caso un cliente debería elegir Cleanlight y no Guardpod?',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.vigilante_online_diferencia', 'competencia', 6, 6,
     'textarea', '¿En qué se diferencia Guardpod de Vigilante Online (kits solares agrícolas)?', 'Queremos conocer la diferencia concreta contra el competidor del segmento agrícola.', 'Diferencia concreta, no genérica',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.gard_diferencia', 'competencia', 6, 7,
     'textarea', '¿En qué se diferencia Guardpod de Gard Security?', 'Queremos conocer la diferencia concreta contra Gard Security (B2B exclusivo).', 'Diferencia concreta, no genérica',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.objeciones_comunes', 'competencia', 6, 8,
     'textarea', '¿Las 3 objeciones más comunes de clientes que comparan con la competencia?', 'Queremos conocer las frases que más escuchás cuando el cliente viene comparando. Las tres más repetidas.', 'Las frases exactas que te dijeron en reuniones',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.razones_ganar', 'competencia', 6, 9,
     'textarea', '¿Por qué un cliente elige Guardpod sobre la competencia? Las 3 razones más fuertes.', 'Queremos conocer las razones por las que firmaste los últimos contratos. Lo que el cliente te dijo al decidir.', 'Las frases textuales que te dijeron al firmar',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'comp.cliente_migrado', 'competencia', 6, 10,
     'textarea', '¿Tuviste algún cliente que se cambió de la competencia a Guardpod?', 'Queremos conocer la historia de la migración. Con contexto: qué tenía el otro, qué le faltaba, qué le ofrecimos.', 'Contexto: qué tenía la competencia, qué le faltaba, qué le ofrecimos',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.modelos', 'pricing', 7, 1,
     'multiselect', '¿Cómo ofrecen Guardpod?', 'Queremos conocer los modelos comerciales disponibles. Cuáles operan hoy, cuáles son promesa.', NULL,
     0, 1, '["Arriendo mensual","Arriendo por evento/día","Venta directa","Leasing","Comodato con servicio incluido"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.arriendo_mensual_clp', 'pricing', 7, 2,
     'number', '¿Cuánto cuesta el arriendo mensual? (CLP)', 'Queremos conocer el precio real del arriendo mensual. El promedio que cobraste en los últimos 3 meses.', 'Precio en CLP, sin IVA',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.arriendo_evento_clp', 'pricing', 7, 3,
     'number', '¿Y el arriendo por evento o día? (CLP)', 'Queremos conocer el precio del arriendo por evento. Para ferias, conciertos, eventos masivos.', 'Precio en CLP por día, sin IVA',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.venta_equipo_clp', 'pricing', 7, 4,
     'number', '¿Cuánto cuesta comprar el equipo? (CLP)', 'Queremos conocer el precio de venta del equipo, si ofrecen esa modalidad.', 'Precio en CLP, sin IVA',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.minimo_meses', 'pricing', 7, 5,
     'number', '¿Hay mínimo de meses de arriendo?', 'Queremos conocer el compromiso mínimo que le pedís al cliente.', 'Ej: 3',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.costo_instalacion_clp', 'pricing', 7, 6,
     'number', '¿La instalación tiene costo aparte? (CLP)', 'Queremos conocer si los cobros extra están dentro o fuera del arriendo mensual.', '0 si está incluida, o el valor en CLP',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.costo_desinstalacion_clp', 'pricing', 7, 7,
     'number', '¿Y la desinstalación?', 'Queremos conocer el costo de retirar el equipo al final del contrato.', '0 si está incluida, o el valor en CLP',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.costo_mantencion_clp', 'pricing', 7, 8,
     'number', '¿Cuánto se cobra por una visita a terreno para mantención? (CLP)', 'Queremos conocer el costo real de una visita técnica.', 'Precio en CLP por visita',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.que_incluye', 'pricing', 7, 9,
     'textarea', '¿Qué incluye el precio y qué NO?', 'Queremos conocer el alcance exacto del servicio. Lo que está dentro y lo que se cobra aparte.', 'Lista clara: incluye X, Y, Z. No incluye A, B, C',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.descuento_volumen', 'pricing', 7, 10,
     'textarea', '¿Hay descuento por arrendar 3+ unidades?', 'Queremos conocer la política de volumen.', 'Ej: 10% de descuento desde la 3ra unidad',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'pricing.costo_sustituto_guardias_clp', 'pricing', 7, 11,
     'number', 'Si en vez de Guardpod contratara 2-4 guardias humanos 24/7, ¿cuánto costaría? (CLP/mes)', 'Queremos conocer la cifra comparable. Lo que pagaría un cliente si en vez de Guardpod contratara guardias humanos.', 'Costo mensual en CLP del equivalente con guardias',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.quien_busca', 'cliente', 8, 1,
     'multiselect', '¿Quién busca Guardpod? (el que llega a la web o llama)', 'Queremos conocer la persona que llega preguntando. Su cargo.', NULL,
     0, 1, '["Gerente de obra","Jefe de operaciones","Administrador de fundo","Productor de eventos","Dueño de PYME","Gerente de seguridad corporativa","Ingeniero de faena minera","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.quien_paga', 'cliente', 8, 2,
     'multiselect', '¿Quién paga la factura?', 'Queremos conocer al que firma el cheque. A veces es distinto al que busca.', NULL,
     0, 1, '["El mismo que busca","Gerencia general","Dueño de la empresa","Área de seguridad","Área de operaciones / producción","Gerencia de administración y finanzas"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.quien_decide', 'cliente', 8, 3,
     'multiselect', '¿Quién tiene la última palabra para firmar?', 'Queremos conocer al tomador real de la decisión. El que dice "sí, avancemos".', NULL,
     0, 1, '["El mismo que busca","Gerencia general","Dueño de la empresa","Área de seguridad","Área de operaciones / producción","Gerencia de administración y finanzas"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.facturacion_tipica', 'cliente', 8, 4,
     'select', '¿De qué tamaño son las empresas típicas que contratan Guardpod?', 'Queremos conocer la facturación anual del cliente tipo. Para saber a quién apuntarle en marketing.', NULL,
     0, 1, '["< $10M CLP/mes","$10–$50M CLP/mes","$50–$200M CLP/mes","$200M–$1.000M CLP/mes","> $1.000M CLP/mes"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.cargo_decisor', 'cliente', 8, 5,
     'text', '¿Qué cargo suele tener el que firma?', 'Queremos conocer el título típico. Para los copies de ads y emails.', 'Ej: Gerente de Operaciones, Jefe de Seguridad, Administrador de Fundo',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.dolor_principal', 'cliente', 8, 6,
     'textarea', '¿Qué es lo que más le preocupa al cliente antes de contratar?', 'Queremos conocer el dolor que lo trae. La frase que te dijo cuando te preguntó por primera vez.', 'La frase exacta que te dijo el último cliente nuevo',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.metrica_exito', 'cliente', 8, 7,
     'multiselect', '¿Cómo mide el éxito el cliente?', 'Queremos conocer la métrica que usa para decidir si Guardpod le sirvió o no.', NULL,
     0, 1, '["Robos evitados","Continuidad operacional","Ahorro mensual vs guardias","Recuperación de inversión","Paz mental / dormir tranquilo","Cumplimiento de seguros","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.ciclo_decision', 'cliente', 8, 8,
     'select', '¿Cuánto tarda el cliente típico en decidir?', 'Queremos conocer el ciclo. Días, semanas, meses. Para saber cuánto follow-up hacer.', NULL,
     0, 1, '["Menos de 1 semana","1 a 4 semanas","1 a 3 meses","Más de 3 meses"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.objetor_principal', 'cliente', 8, 9,
     'textarea', '¿Cuál es la objeción #1 que hay que vencer?', 'Queremos conocer la frase exacta que te dijeron y la frase que tú usaste para responderla.', 'La objeción más repetida y la respuesta que diste',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.pregunta_frecuente', 'cliente', 8, 10,
     'textarea', '¿Cuál es la pregunta que más te hacen antes de firmar?', 'Queremos conocer la pregunta repetida. La que si la respondiéramos bien en la página web, venderíamos más.', 'La pregunta exacta que más te han hecho',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.frase_pre_firma', 'cliente', 8, 11,
     'textarea', '¿Cuál fue la frase exacta del último cliente antes de firmar?', 'Queremos conocer la frase que cerró el negocio. La más persuasiva. La querés copiar textual.', 'Copia y pega del WhatsApp, mail, o transcripción',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'cliente.cliente_perdido_motivo', 'cliente', 8, 12,
     'textarea', '¿Por qué el último cliente que NO firmó decidió no avanzar?', 'Queremos conocer la razón real. Lo que te dijeron cuando les preguntaste por qué no. Aunque sea incómodo.', 'La razón real que te dieron cuando les preguntaste por qué no avanzó',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'op.tiempo_solicitud_a_operativa_dias', 'operacion', 9, 1,
     'number', '¿Cuánto tardan desde que el cliente pide hasta que Guardpod está operando?', 'Queremos conocer el tiempo real. Días o semanas. Lo que le prometés vs lo que cumplís.', 'En días',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'op.radio_cobertura_km', 'operacion', 9, 2,
     'number', '¿A qué distancia máxima desde la central puede operar Guardpod?', 'Queremos conocer el radio de cobertura. Si hay límites geográficos, dónde están.', 'En kilómetros',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'op.cobertura_fuera_santiago', 'operacion', 9, 3,
     'boolean', '¿Pueden operar en faenas lejanas a Santiago?', 'Queremos conocer si hay límite de kilómetros. Si llegan a regiones, a faenas remotas.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'op.flota_actual', 'operacion', 9, 4,
     'number', '¿Cuántas unidades tiene la flota hoy?', 'Queremos conocer las unidades disponibles para arrendar. No incluye las arrendadas a un cliente específico.', 'La flota propia, no la de un cliente',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'op.disponibilidad_inmediata', 'operacion', 9, 5,
     'number', '¿Cuántas están disponibles hoy?', 'Queremos conocer la disponibilidad inmediata. Cuántas podríamos arrendar esta semana.', 'Las que podrías arrendar esta semana',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'op.tiempo_reubicacion_horas', 'operacion', 9, 6,
     'number', '¿Cuánto se tarda en mudar una unidad de una faena a otra?', 'Queremos conocer el tiempo de reubicación. Si el cliente necesita moverla, cuánto demora.', 'En horas',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.registro_nacional', 'legal', 10, 1,
     'boolean', '¿GuardMan está inscripta en el Registro Nacional de Seguridad Privada?', 'Queremos conocer si tienen el número de inscripción. Lo que exige la Ley 21.659.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.os10_vigente', 'legal', 10, 2,
     'boolean', '¿Los operadores de la central tienen OS-10 vigente?', 'Queremos conocer la certificación de la gente que monitorea. Lo que exige el Decreto 867.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.cumple_ley_21659', 'legal', 10, 3,
     'textarea', '¿Cómo cumple Guardpod con la Ley 21.659 y el DS 209/2025?', 'Queremos conocer los puntos concretos de cumplimiento. Con qué artículo cumple, bajo qué número de inscripción, etc. Si no está seguro, marcarlo como "no estoy seguro, validar con legal".', 'Artículo X, número de inscripción Y, etc.',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.cumple_decreto_867', 'legal', 10, 4,
     'boolean', '¿Cumplen con el Decreto 867/2017?', 'Queremos conocer la conformidad con el reglamento histórico de empresas de seguridad.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.seguro_rc', 'legal', 10, 5,
     'boolean', '¿Tienen seguro de responsabilidad civil?', 'Queremos conocer si hay póliza vigente. Lo que exige el DS 867.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.permisos_cliente', 'legal', 10, 6,
     'textarea', '¿El cliente necesita algún permiso para instalar Guardpod en su terreno?', 'Queremos conocer si la instalación es libre o si requiere municipal, eléctrico, etc. Lo que le decís al cliente cuando pregunta.', 'Lo que le explicas al cliente cuando pregunta',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.entidad_riesgo_alto', 'legal', 10, 7,
     'textarea', '¿Guardpod aplica para entidades de riesgo alto según la Ley 21.659?', 'Queremos conocer si Guardpod sirve como sistema de vigilancia exigido a entidades de riesgo alto. El ángulo B2B que puede ser enorme.', 'Sí/no + explicación de por qué',
     1, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'legal.proteccion_datos', 'legal', 10, 8,
     'textarea', '¿La grabación de video cumple con la Ley 19.628 de protección de datos?', 'Queremos conocer el protocolo real. Qué pasa con el video al terminar el contrato. Si no hay protocolo, anotar "no definido".', 'Protocolo actual o "no definido" si no existe',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.keywords_5', 'marketing', 11, 1,
     'text', '¿Cuáles son las 5 búsquedas de Google donde querés aparecer primero?', 'Queremos conocer las 5 frases que tú pondrías en Google si fueras un cliente buscando Guardpod. Las que tú usarías, no las que "deberían" usarse.', 'Las 5 frases que tú pondrías en Google si fueras el cliente',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.comunas_prioridad', 'marketing', 11, 2,
     'text', '¿Cuáles son las 5 comunas o regiones prioritarias?', 'Queremos conocer dónde están los clientes o donde más prospectos hay. Para apuntar a la zona.', 'Las 5 comunas o regiones donde más hay que enfocar el marketing',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.gbp_separado', 'marketing', 11, 3,
     'boolean', '¿Tienen Google Business Profile separado para Guardpod?', 'Queremos conocer si existe la ficha o hay que crearla. Importante para aparecer en búsquedas locales.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.canal_principal', 'marketing', 11, 4,
     'select', '¿Por dónde llegan los clientes principalmente?', 'Queremos conocer el canal principal. Donde poner más esfuerzo.', NULL,
     0, 1, '["Web / formulario","WhatsApp","Vendedor en terreno","Referido de otro cliente","Aliado / partner","LinkedIn","Google Ads","Instagram","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.canal_secundario', 'marketing', 11, 5,
     'select', '¿Y el canal secundario?', 'Queremos conocer el segundo canal más importante.', NULL,
     0, 1, '["Web / formulario","WhatsApp","Vendedor en terreno","Referido de otro cliente","Aliado / partner","LinkedIn","Google Ads","Instagram","Otro"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.alianzas_reales', 'marketing', 11, 6,
     'textarea', '¿Hay alianzas con constructoras, empresas agrícolas, productoras de eventos?', 'Queremos conocer las alianzas reales con proyectos concretos en los últimos 12 meses.', 'Solo alianzas con proyecto concreto. No contactos sin proyecto',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.ferias', 'marketing', 11, 7,
     'multiselect', '¿Participan en ferias del rubro?', 'Queremos conocer dónde se ven con clientes. Para considerar el calendario 2026-2027.', NULL,
     0, 0, '["Expo Seguridad Chile","Mining Convention (Expomin)","Feria de la Construcción (Edifica)","Feria agrícola (Sago Fisur, etc.)","Otra del rubro","Ninguna"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.tono_blog', 'marketing', 11, 8,
     'select', '¿Qué tono querés en el blog?', 'Queremos conocer el tono del blog. Para saber qué contenido producir.', NULL,
     0, 1, '["Técnico y detallado","Casos de estudio reales","Noticias del rubro","Guías prácticas","Mixto"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.tres_ideas_blog', 'marketing', 11, 9,
     'textarea', 'Tres ideas de artículos para el blog', 'Queremos conocer los temas que creés que mejor conectarían con clientes. Las preguntas que te hacen en reuniones.', 'Las preguntas que más te hacen en reuniones convertidas en títulos de artículo',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.influencers', 'marketing', 11, 10,
     'text', 'Tres cuentas o personas que podrían amplificar Guardpod', 'Queremos conocer influencers del rubro, cuentas técnicas, medios especializados. Para outreach.', 'Cuentas técnicas, periodistas, gremios, etc.',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'mkt.pregunta_google_top', 'marketing', 11, 11,
     'text', '¿Cuál es la pregunta de Google que más te gustaría que la página web responda primera?', 'Queremos conocer la pregunta exacta, larga, con comuna si aplica. La que tú pondrías en Google hoy si fueras el cliente.', 'La pregunta larga, específica, con comuna si aplica',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'obj.pregunta_rara', 'objeciones', 12, 1,
     'textarea', '¿Cuál es la pregunta más rara que te han hecho sobre Guardpod?', 'Queremos conocer la pregunta inesperada. La que te hizo pensar "¿de dónde sacaron eso?". Para FAQ.', 'La pregunta más inesperada que te hicieron',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'obj.miedo_principal', 'objeciones', 12, 2,
     'textarea', '¿Cuál es el miedo #1 que tienen los clientes antes de arrendar?', 'Queremos conocer la frase que el cliente te dijo cuando dudó. "Y si no funciona", "y si me roban la torre", etc. La más repetida.', 'La frase que más te dijeron cuando dudaron',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'obj.que_no_haria', 'objeciones', 12, 3,
     'textarea', '¿Qué no harías con Guardpod?', 'Queremos conocer los usos para los que NO sirve. La honestidad acá es lo que más confianza genera.', 'Los casos donde mejor ni intentarlo',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'obj.error_comun_cliente', 'objeciones', 12, 4,
     'textarea', '¿Cuál es el error más común que cometen los clientes con Guardpod?', 'Queremos conocer la decisión que el cliente tomó y que vos pensaste "no, eso no". Para advertirlo en la FAQ.', 'La decisión equivocada que más te ha tocado corregir',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'obj.mito_borrar', 'objeciones', 12, 5,
     'textarea', 'Si pudieras borrar un mito sobre cámaras solares con IA en Chile, ¿cuál sería?', 'Queremos conocer la creencia falsa más repetida. La que te tocó desmentir más veces en reuniones.', 'La frase que más escuchaste tipo "es que dicen que..."',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'gar.equipo', 'garantias', 13, 1,
     'text', '¿Tienen garantía del equipo físico?', 'Queremos conocer los años o meses de garantía. Lo que dice el contrato.', 'Ej: 2 años, 3 años, etc.',
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'gar.uptime', 'garantias', 13, 2,
     'text', '¿Tienen garantía de uptime del servicio?', 'Queremos conocer el SLA. Lo que pasa si no se cumple.', 'Ej: 99.5% uptime, con crédito si no se cumple',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'gar.tiempo_reparacion_horas', 'garantias', 13, 3,
     'number', 'Si Guardpod se rompe, ¿cuánto tardan en repararlo?', 'Queremos conocer el tiempo real. La última falla grave y cuánto tardó en resolverse.', 'La última falla grave real, en horas',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'gar.mesa_ayuda_24_7', 'garantias', 13, 4,
     'boolean', '¿Tienen mesa de ayuda 24/7?', 'Queremos conocer si hay alguien respondiendo a toda hora.', NULL,
     0, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'gar.canales_soporte', 'garantias', 13, 5,
     'multiselect', '¿Cómo se contacta al soporte?', 'Queremos conocer los canales disponibles. Lo que el cliente tiene a mano.', NULL,
     0, 1, '["WhatsApp","Teléfono","Email","App móvil","Dashboard web"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'gar.mantencion_preventiva', 'garantias', 13, 6,
     'text', '¿Hay plan de mantención preventiva?', 'Queremos conocer la frecuencia y qué incluye.', 'Frecuencia y qué se revisa',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.vision_3_anios', 'vision', 14, 1,
     'textarea', '¿Cómo te imaginás Guardpod en 3 años?', 'Queremos conocer la visión cruda. Las cifras, geografías, productos que imaginás. Lo que le dirías a tu socio más escéptico en 60 segundos.', 'Cifras, geografías, productos concretos. Sin frases genéricas',
     1, 1, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.integraciones_futuras', 'vision', 14, 2,
     'multiselect', '¿Qué integraciones querés a futuro?', 'Queremos conocer las piezas que faltan para que Guardpod sea más potente. Lo que los clientes piden y hoy no hay.', NULL,
     0, 0, '["Drones autónomos","Bodycams para guardias","Alarmas Ajax Systems","Control de acceso biométrico","IA generativa para informes","Reconocimiento de patentes","Integración con seguros","Otra"]', 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.expansion_geografica', 'vision', 14, 3,
     'textarea', '¿Planean expandirse fuera de Chile?', 'Queremos conocer la ambición geográfica. Si hay mercado objetivo en LATAM.', 'Países, plazos, mercados objetivo',
     0, 0, NULL, 0);
INSERT INTO guardpod_questions
    (version, question_key, section, section_order, question_order, question_type, label,
     help_text, real_world_prompt, real_world_required, required, options_json, seo_relevance)
  VALUES
    ('v1', 'vis.hito_6_meses', 'vision', 14, 4,
     'textarea', '¿Cuál es el hito más importante de los próximos 6 meses?', 'Queremos conocer el objetivo más urgente. Lo que tendría que pasar en este segundo semestre para que Guardpod avance.', 'El objetivo medible, con plazo',
     0, 1, NULL, 0);
SELECT COUNT(*) AS total FROM guardpod_questions WHERE version='v1';
