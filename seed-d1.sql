-- =====================================================
-- SEED DATA - GUARDMAN D1 DATABASE
-- =====================================================

-- Insertar servicios principales
INSERT INTO services (slug, title, description, tagline, icon, features, benefits, cta, meta_title, meta_description, generate_location_pages, generate_industry_pages, order_index) VALUES
('alarmas', 'Sistemas de Alarmas', 'Sistemas de alarma inalámbricos Ajax Systems sin contrato. Control total desde tu celular con automonitoreo.', 'Alarmas sin contrato', 'bell', '["Inalámbrico 100%", "App móvil incluida", "Sin permanencia", "Detectores europeos"]', '["Sin contratos bindantes", "Instalación en 24hrs", "Soporte técnico 24/7"]', 'Cotizar alarma', 'Alarmas sin contrato en Chile | Guardman', 'Sistemas de alarma Ajax Systems sin contrato. Automonitoreo desde tu celular. Instalación profesional en Santiago.', 1, 1, 1),
('guardias', 'Guardias de Seguridad', 'Personal de seguridad OS10 altamente capacitado para protección de empresas, industrias y condominios.', 'Guardias OS10 certificados', 'shield', '["Personal OS10 certificado", "Cobertura 24/7", "Supervisión constante", "Equipamiento completo"]', '["Personal certificado", "Reemplazo garantizado", "Reportes en tiempo real"]', 'Solicitar guardia', 'Guardias de Seguridad OS10 en Chile | Guardman', 'Servicio de guardias de seguridad OS10 para empresas y condominios. Personal certificado y cobertura 24/7.', 1, 1, 2),
('cctv', 'Cámaras de Seguridad', 'Sistemas de videovigilancia IP con monitoreo remoto 24/7. Accede a tus cámaras desde cualquier lugar.', 'Vigilancia 24/7', 'camera', '["Cámaras IP HD", "Monitoreo remoto", "Grabación en la nube", "Detección de movimiento"]', '["Monitoreo desde celular", "Grabación continua", "Alertas en tiempo real"]', 'Cotizar cámaras', 'Cámaras de Seguridad CCTV en Chile | Guardman', 'Instalación de cámaras de seguridad CCTV con monitoreo remoto. Videovigilancia profesional para empresas.', 1, 1, 3),
('patrullaje', 'Patrullaje', 'Servicio de rondas periódicas para condominios y empresas. Respuesta rápida ante emergencias.', 'Rondas programadas', 'car', '["Rondas programadas", "Respuesta rápida", "Vehículos equipados", "GPS tracking"]', '["Disuasión delictiva", "Respuesta en minutos", "Reportes automáticos"]', 'Contratar patrullaje', 'Servicio de Patrullaje en Santiago | Guardman', 'Servicio de patrullaje para condominios y empresas en Santiago. Rondas programadas y respuesta rápida.', 1, 1, 4),
('drones', 'Drones de Seguridad', 'Vigilancia aérea automatizada para grandes extensiones. Patrullaje aéreo 24/7.', 'Vigilancia aérea', 'plane', '["Vuelo autónomo", "Cámaras térmicas", "Batería extendida", "IA de detección"]', '["Cobertura total", "Detección nocturna", "Sin riesgo humano"]', 'Cotizar drones', 'Drones de Seguridad en Chile | Guardman', 'Servicio de vigilancia con drones para industrias y grandes extensiones. Patrullaje aéreo automatizado.', 1, 1, 5),
('guardpod', 'GUARDPOD©', 'Sistema de protección autónoma modular. Seguridad inteligente sin intervención humana.', 'Protección autónoma', 'box', '["100% autónomo", "Energía solar", "IA integrada", "Fácil instalación"]', '["Sin costos fijos", "Autosuficiente", "Escalable"]', 'Conocer GUARDPOD', 'GUARDPOD - Protección Autónoma | Guardman', 'GUARDPOD: Sistema de protección autónoma con IA. Seguridad inteligente sin costos fijos de personal.', 1, 1, 6),
('monitoreo', 'Monitoreo 24/7', 'Central de monitoreo profesional con respuesta inmediata. Videoverificación de alarmas.', 'Monitoreo profesional', 'monitor', '["Operadores 24/7", "Videoverificación", "Respuesta coordinada", "App de seguimiento"]', '["Respuesta inmediata", "Falsa alarma filtrada", "Coordinación policial"]', 'Contratar monitoreo', 'Monitoreo de Alarmas 24/7 en Chile | Guardman', 'Central de monitoreo de alarmas 24/7 con videoverificación. Respuesta inmediata a emergencias.', 1, 1, 7),
('control-acceso', 'Control de Acceso', 'Sistemas de control de acceso biométrico y tarjetas. Gestión de visitantes y personal.', 'Acceso inteligente', 'key', '["Biométrico", "Tarjetas RFID", "App móvil", "Reportes detallados"]', '["Registro automático", "Zonas restringidas", "Integración RRHH"]', 'Cotizar control', 'Control de Acceso en Chile | Guardman', 'Sistemas de control de acceso biométrico para empresas. Gestión de personal y visitantes.', 1, 1, 8);

-- Insertar soluciones
INSERT INTO solutions (slug, title, description, icon, features, benefits, cta, meta_title, meta_description, order_index) VALUES
('hogar', 'Seguridad para el Hogar', 'Protección completa para tu casa y familia. Alarmas, cámaras y monitoreo integrados.', 'home', '["Alarmas inalámbricas", "Cámaras interiores", "Detectores de humo", "App móvil"]', '["Protección 24/7", "Sin contrato", "Fácil instalación"]', 'Proteger mi hogar', 'Seguridad para Hogares | Guardman', 'Soluciones de seguridad para el hogar en Chile. Alarmas, cámaras y monitoreo sin contrato.', 1),
('empresa', 'Seguridad Empresarial', 'Soluciones integrales para PYMEs y grandes empresas. Protege tu negocio completo.', 'building', '["Control de acceso", "CCTV profesional", "Guardias", "Monitoreo"]', '["Reducción de pérdidas", "Personal protegido", "Cumplimiento normativo"]', 'Proteger mi empresa', 'Seguridad para Empresas | Guardman', 'Soluciones de seguridad empresarial en Chile. Control de acceso, CCTV y guardias OS10.', 2),
('industria', 'Seguridad Industrial', 'Protección para fábricas, bodegas e industrias. Cobertura perimetral y patrimonial.', 'factory', '["Perímetro 360°", "Guardias armados", "Drones", "CCTV térmico"]', '["Cero robos", "Continuidad operativa", "Seguros validados"]', 'Proteger mi industria', 'Seguridad Industrial | Guardman', 'Seguridad para industrias y bodegas en Chile. Protección perimetral y patrimonial.', 3),
('retail', 'Seguridad para Retail', 'Protección para tiendas, malls y centros comerciales. Prevención de pérdidas.', 'shopping-cart', '["Vigilancia encubierta", "EAS antirrobo", "Control de mercadería", "Análisis de flujo"]', '["Menos shrinkage", "Mejor experiencia", "Personal capacitado"]', 'Proteger mi tienda', 'Seguridad para Retail | Guardman', 'Soluciones de seguridad para retail en Chile. Prevención de pérdidas y vigilancia.', 4),
('condominio', 'Seguridad para Condominios', 'Protección residencial para condominios y edificios. Guardias y tecnología integrada.', 'users', '["Portería controlada", "Patrullaje interno", "CCTV común", "App residentes"]', '["Vecinos seguros", "Áreas comunes", "Control de visitas"]', 'Proteger mi condominio', 'Seguridad para Condominios | Guardman', 'Seguridad para condominios y edificios residenciales en Chile. Guardias y tecnología.', 5),
('evento', 'Seguridad para Eventos', 'Protección para eventos masivos, conciertos y conferencias. Personal especializado.', 'calendar', '["Control de aforo", "Guardias de evento", "Plan de emergencia", "Coordinación policial"]', '["Evento seguro", "Respuesta rápida", "Cumplimiento legal"]', 'Cotizar evento', 'Seguridad para Eventos | Guardman', 'Servicio de seguridad para eventos masivos en Chile. Personal especializado y control de aforo.', 6);

-- Insertar industrias
INSERT INTO industries (slug, name, description, icon, order_index) VALUES
('retail', 'Retail y Comercio', 'Tiendas, malls, supermercados y centros comerciales', 'shopping-bag', 1),
('mineria', 'Minería', 'Faenas mineras, campamentos y operaciones extractivas', 'mountain', 2),
('logistica', 'Logística y Transporte', 'Bodegas, puertos, aeropuertos y centros de distribución', 'truck', 3),
('salud', 'Salud', 'Hospitales, clínicas y centros médicos', 'heart', 4),
('educacion', 'Educación', 'Colegios, universidades y centros educativos', 'graduation-cap', 5),
('banca', 'Banca y Finanzas', 'Bancos, financieras y aseguradoras', 'university', 6),
('gobierno', 'Gobierno', 'Instituciones públicas y organismos estatales', 'landmark', 7),
('inmobiliaria', 'Inmobiliaria', 'Edificios corporativos y residenciales', 'building', 8),
('hospitalidad', 'Hospitalidad', 'Hoteles, restaurantes y turismo', 'bed', 9),
('construccion', 'Construcción', 'Obras, campamentos y proyectos inmobiliarios', 'hard-hat', 10);

-- Relacionar servicios con soluciones (service_solutions)
INSERT INTO service_solutions (service_id, solution_id) VALUES
-- Alarmas - todas las soluciones
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
-- Guardias - todas excepto hogar
(2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
-- CCTV - todas
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
-- Patrullaje - condominios, empresa, industria
(4, 2), (4, 3), (4, 5),
-- Drones - industria, logística, minería
(5, 2), (5, 3),
-- GUARDPOD - industria, construcción, logística
(6, 2), (6, 3),
-- Monitoreo - todas
(7, 1), (7, 2), (7, 3), (7, 4), (7, 5),
-- Control de acceso - empresa, industria, banca, gobierno
(8, 2), (8, 3), (8, 6), (8, 7);

-- Relacionar servicios con industrias (service_industries)
INSERT INTO service_industries (service_id, industry_id, priority) VALUES
-- Alarmas - retail, salud, educación, hospedaje
(1, 1, 1), (1, 4, 2), (1, 5, 3), (1, 9, 4),
-- Guardias - minería, logística, construcción, gobierno
(2, 2, 1), (2, 3, 2), (2, 10, 3), (2, 7, 4),
-- CCTV - todas
(3, 1, 1), (3, 2, 2), (3, 3, 3), (3, 4, 4), (3, 5, 5), (3, 6, 6),
-- Patrullaje - inmobiliaria, construcción
(4, 8, 1), (4, 10, 2),
-- Drones - minería, logística, construcción
(5, 2, 1), (5, 3, 2), (5, 10, 3),
-- Control acceso - banca, gobierno, salud
(8, 6, 1), (8, 7, 2), (8, 4, 3);

-- Generar service_locations para algunos ejemplos
-- Alarmas en comunas principales
INSERT INTO service_locations (service_id, commune_id, meta_title, meta_description, hero_title, hero_subtitle, starting_price, content_status) VALUES
-- Alarmas
(1, 12, 'Alarmas en Las Condes | Guardman Chile', 'Sistemas de alarma Ajax Systems en Las Condes. Sin contrato, instalación profesional y automonitoreo desde tu celular.', 'Alarmas en Las Condes', 'Protección premium para hogares y empresas', 89990, 'auto'),
(1, 13, 'Alarmas en Providencia | Guardman Chile', 'Alarmas sin contrato en Providencia. Instalación en 24 horas y soporte técnico incluido.', 'Alarmas en Providencia', 'Seguridad inteligente para tu hogar', 89990, 'auto'),
(1, 26, 'Alarmas en Maipú | Guardman Chile', 'Sistemas de alarma en Maipú. Alarmas inalámbricas Ajax con app de automonitoreo.', 'Alarmas en Maipú', 'Protección confiable para tu familia', 79990, 'auto'),
(1, 31, 'Alarmas en La Florida | Guardman Chile', 'Alarmas en La Florida sin permanencia. Control total desde tu smartphone.', 'Alarmas en La Florida', 'Seguridad accesible para tu hogar', 79990, 'auto'),
(1, 1, 'Alarmas en Santiago Centro | Guardman Chile', 'Alarmas en Santiago Centro para departamentos y oficinas. Instalación profesional.', 'Alarmas en Santiago Centro', 'Protección para tu propiedad urbana', 89990, 'auto'),
-- Guardias
(2, 12, 'Guardias de Seguridad en Las Condes | Guardman', 'Servicio de guardias OS10 en Las Condes. Personal certificado para empresas y condominios.', 'Guardias en Las Condes', 'Personal OS10 certificado', NULL, 'auto'),
(2, 3, 'Guardias de Seguridad en San Bernardo | Guardman', 'Guardias de seguridad en San Bernardo para industrias y bodegas.', 'Guardias en San Bernardo', 'Protección industrial profesional', NULL, 'auto'),
-- CCTV
(3, 11, 'Cámaras de Seguridad en Vitacura | Guardman', 'Instalación de cámaras CCTV en Vitacura. Monitoreo remoto y grabación en la nube.', 'CCTV en Vitacura', 'Vigilancia premium 24/7', 149990, 'auto'),
(3, 14, 'Cámaras de Seguridad en Ñuñoa | Guardman', 'Sistemas de videovigilancia en Ñuñoa. Cámaras IP HD con acceso remoto.', 'CCTV en Ñuñoa', 'Control visual total', 129990, 'auto');

-- Insertar FAQs
INSERT INTO faqs (question, answer, category, order_index) VALUES
('¿Las alarmas tienen contrato de permanencia?', 'No, nuestras alarmas Ajax Systems no tienen contrato de permanencia. Puedes cancelar cuando quieras sin multas ni penalidades.', 'Alarmas', 1),
('¿Cuánto cuesta una alarma para casa?', 'Nuestros sistemas de alarma para hogar parten desde $79.990 con instalación incluida. El precio varía según la cantidad de sensores que necesites.', 'Alarmas', 2),
('¿Puedo monitorear mi alarma desde el celular?', 'Sí, todas nuestras alarmas incluyen la app de Ajax para automonitoreo gratuito. Puedes ver el estado, recibir alertas y controlar tu sistema desde cualquier lugar.', 'Alarmas', 3),
('¿Los guardias están certificados?', 'Sí, todo nuestro personal de seguridad tiene licencia OS10 vigente emitida por Carabineros de Chile. Además reciben capacitación continua.', 'Guardias', 4),
('¿Cuánto demora la instalación?', 'La instalación de un sistema de alarma demora entre 2 y 4 horas dependiendo de la cantidad de sensores. Para CCTV puede tomar medio día.', 'Instalación', 5),
('¿Ofrecen servicio en todo Santiago?', 'Sí, cubrimos las 35 comunas del Gran Santiago. También tenemos cobertura en regiones para proyectos especiales.', 'General', 6);

-- Insertar algunos testimonios
INSERT INTO testimonials (author, role, company, quote, rating, verified, order_index) VALUES
('María González', 'Gerente de Operaciones', 'Retail Store Chile', 'Excelente servicio de guardias. El personal siempre puntual y muy profesional. Llevamos 2 años trabajando con Guardman.', 5, 1, 1),
('Carlos Mendoza', 'Propietario', '-', 'Instalaron mi alarma en menos de 3 horas. La app funciona perfecto y me da tranquilidad cuando viajo.', 5, 1, 2),
('Ana Pérez', 'Administradora', 'Edificio Plaza Norte', 'El sistema de cámaras que instalaron superó nuestras expectativas. El soporte técnico responde al instante.', 5, 1, 3);

-- Insertar partners
INSERT INTO partners (name, logo_url, type, url, order_index) VALUES
('Ajax Systems', '/images/partners/ajax.svg', 'tech_partner', 'https://ajax.systems', 1),
('OS10 Carabineros', '/images/partners/os10.svg', 'certification', NULL, 2),
('ISO 9001', '/images/partners/iso9001.svg', 'certification', NULL, 3);

-- Insertar config del sitio
INSERT INTO site_config (brand_name, phone_primary, whatsapp_number, email_contact, address_main, instagram_url, linkedin_url) VALUES
('Guardman Chile', '+56 2 2345 6789', '+56 9 1234 5678', 'contacto@guardman.cl', 'Av. Providencia 1234, Oficina 56, Providencia, Santiago', 'https://instagram.com/guardmancl', 'https://linkedin.com/company/guardman');
