-- 0005: el cuestionario GuardPod en español neutro, sin voseo.
--
-- Por qué una migración y no editar 0003: 0003 ya está aplicada en D1. Editar
-- el archivo de una migración aplicada hace que el repo describa un estado
-- que la base no tiene, y un despliegue sobre otra base diverge en silencio.
--
-- Solo registro: los anglicismos del seed (follow-up, mail, partner) se
-- dejan como estaban, porque son uso convencional en Chile.
--
-- El texto viejo ya no está en el repo (los dos archivos del seed quedaron
-- corregidos). Este archivo se generó diffeando el seed contra 2035960^, así
-- que los 32 question_key salen de claves que existen de verdad.
--
-- NO se pudo aplicar desde el entorno de desarrollo: el token OAuth de
-- wrangler no tiene alcance de D1 remoto (APIError 7403, "The given account
-- is not valid or is not authorized"). Correr desde una sesión con permisos:
--
--   npx wrangler d1 migrations apply guardman-v2-db --remote
--
-- Es idempotente: se puede correr más de una vez sin efecto.

-- identidad.nombre_oficial / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer la forma canónica del nombre. Si hay diferencias entre "Guardpod", "GuardPod" o "guard-pod" en distintos documentos, anótelas todas.'
  WHERE question_key = 'identidad.nombre_oficial';

-- identidad.claim_diferenciador / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer la razón por la que un cliente elegiría Guardpod por sobre cualquier alternativa. No marketing: la diferencia concreta y verificable. Si la respuesta requiere datos técnicos, déjela a nivel de concepto.'
  WHERE question_key = 'identidad.claim_diferenciador';

-- identidad.claim_diferenciador / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Piense en la última vez que un cliente le dijo "¿y por qué no la otra?". La respuesta que dio es la que va aquí.'
  WHERE question_key = 'identidad.claim_diferenciador';

-- cliente.tres_verticales_top / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer los 3 rubros principales, ordenados por los que más le piden. Los demás se mencionan en la página web solo si hay espacio.'
  WHERE question_key = 'cliente.tres_verticales_top';

-- cliente.dolor_principal / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer el dolor que lo trae. La frase exacta que le dijo cuando preguntó por primera vez.'
  WHERE question_key = 'cliente.dolor_principal';

-- cliente.dolor_principal / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'La frase exacta que le dijo el último cliente nuevo'
  WHERE question_key = 'cliente.dolor_principal';

-- cliente.pregunta_frecuente / label
UPDATE guardpod_questions SET label = '¿Cuál es la pregunta que más le hace un cliente antes de firmar?'
  WHERE question_key = 'cliente.pregunta_frecuente';

-- cliente.pregunta_frecuente / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'La pregunta exacta que más le han hecho antes de firmar'
  WHERE question_key = 'cliente.pregunta_frecuente';

-- prod.que_resuelve / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Lo que el cliente le dijo: "lo que pasa es que en mi obra..."'
  WHERE question_key = 'prod.que_resuelve';

-- prod.donde_no_sirve / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Casos reales donde dijo "mira, para eso le conviene otra cosa"'
  WHERE question_key = 'prod.donde_no_sirve';

-- prod.frase_testimonio / label
UPDATE guardpod_questions SET label = '¿Cuál es la mejor frase real que le dijo un cliente después de usar Guardpod?'
  WHERE question_key = 'prod.frase_testimonio';

-- casos.peor_queja / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'La queja más dura, la que le hizo pensar "esto no puede repetirse"'
  WHERE question_key = 'casos.peor_queja';

-- casos.cliente_perdido / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer la razón real. Lo que el cliente dijo cuando le preguntó por qué. Aunque incomode.'
  WHERE question_key = 'casos.cliente_perdido';

-- casos.cliente_perdido / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'La razón real que le dieron cuando les preguntó por qué no avanzó'
  WHERE question_key = 'casos.cliente_perdido';

-- casos.situacion_inusual / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Algo que le pasó con un cliente que no le había pasado antes'
  WHERE question_key = 'casos.situacion_inusual';

-- casos.preg_mas_rara / label
UPDATE guardpod_questions SET label = '¿Cuál es la pregunta más rara que le hizo un cliente sobre Guardpod?'
  WHERE question_key = 'casos.preg_mas_rara';

-- casos.preg_mas_rara / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'La pregunta que le hizo pensar "¿de dónde sacaron eso?"'
  WHERE question_key = 'casos.preg_mas_rara';

-- casos.mito_borrar / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer la creencia falsa más repetida. La que le tocó desmentir más veces en reuniones.'
  WHERE question_key = 'casos.mito_borrar';

-- casos.miedo_cliente / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Lo que el cliente le dijo cuando estaba por firmar pero se echó para atrás'
  WHERE question_key = 'casos.miedo_cliente';

-- comp.heimdal_diferencia / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer la diferencia concreta. Hechos verificables. Lo que le diría a un cliente que le dice "ya cotizamos con ellos".'
  WHERE question_key = 'comp.heimdal_diferencia';

-- comp.objeciones_comunes / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Las frases exactas que le dijeron en reuniones'
  WHERE question_key = 'comp.objeciones_comunes';

-- comp.razones_ganar / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Las frases textuales que le dijeron al decidir'
  WHERE question_key = 'comp.razones_ganar';

-- comp.que_practican_ellos / label
UPDATE guardpod_questions SET label = '¿Qué prácticas de la competencia le han tocado enfrentar al vender?'
  WHERE question_key = 'comp.que_practican_ellos';

-- comp.no_podemos_competir / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Lo que el cliente le pidió y tuvo que decir "no"'
  WHERE question_key = 'comp.no_podemos_competir';

-- pricing.que_paga_competencia / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Lo que el cliente le dice que le cobraron los otros'
  WHERE question_key = 'pricing.que_paga_competencia';

-- ventas.objetor_principal / help_text
UPDATE guardpod_questions SET help_text = 'Queremos conocer la frase exacta que le dijeron y la frase que usted usó para responderla.'
  WHERE question_key = 'ventas.objetor_principal';

-- ventas.truco_cierre / label
UPDATE guardpod_questions SET label = '¿Cuál es el truco o argumento que más le ha servido para cerrar ventas complicadas?'
  WHERE question_key = 'ventas.truco_cierre';

-- ventas.cuando_cliente_calla / label
UPDATE guardpod_questions SET label = '¿Qué hace cuando un cliente deja de responder?'
  WHERE question_key = 'ventas.cuando_cliente_calla';

-- ventas.cuando_cliente_calla / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'El proceso de follow-up que usa'
  WHERE question_key = 'ventas.cuando_cliente_calla';

-- legal.permisos_cliente / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Lo que le explica al cliente cuando pregunta'
  WHERE question_key = 'legal.permisos_cliente';

-- vis.vision_3_anios / label
UPDATE guardpod_questions SET label = '¿Cómo imaginaría Guardpod dentro de 3 años?'
  WHERE question_key = 'vis.vision_3_anios';

-- vis.vision_3_anios / real_world_prompt
UPDATE guardpod_questions SET real_world_prompt = 'Lo que le diría a un socio escéptico en 60 segundos'
  WHERE question_key = 'vis.vision_3_anios';
