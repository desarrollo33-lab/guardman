-- Relaciones servicio-solucion (service_solutions)
-- alarmas(1) con todas las soluciones
INSERT INTO service_solutions (service_id, solution_id) VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5);
-- guardias(2) con empresa, industria, condominio
INSERT INTO service_solutions (service_id, solution_id) VALUES (2, 2), (2, 3), (2, 5);
-- cctv(3) con todas
INSERT INTO service_solutions (service_id, solution_id) VALUES (3, 1), (3, 2), (3, 3), (3, 4), (3, 5);
-- patrullaje(4) con empresa, condominio
INSERT INTO service_solutions (service_id, solution_id) VALUES (4, 2), (4, 5);
-- monitoreo(5) con todas
INSERT INTO service_solutions (service_id, solution_id) VALUES (5, 1), (5, 2), (5, 3), (5, 4), (5, 5);

-- Relaciones servicio-comuna (service_locations)
-- Alarmas(1) en comunas principales
INSERT INTO service_locations (service_id, commune_id, meta_title, meta_description, hero_title, hero_subtitle, starting_price, content_status) VALUES
(1, 12, 'Alarmas en Las Condes | Guardman Chile', 'Sistemas de alarma Ajax Systems en Las Condes', 'Alarmas en Las Condes', 'Proteccion premium', 89990, 'auto'),
(1, 13, 'Alarmas en Providencia | Guardman Chile', 'Alarmas sin contrato en Providencia', 'Alarmas en Providencia', 'Seguridad inteligente', 89990, 'auto'),
(1, 26, 'Alarmas en Maipu | Guardman Chile', 'Alarmas en Maipu sin permanencia', 'Alarmas en Maipu', 'Proteccion confiable', 79990, 'auto'),
(1, 31, 'Alarmas en La Florida | Guardman Chile', 'Alarmas en La Florida sin contrato', 'Alarmas en La Florida', 'Seguridad accesible', 79990, 'auto'),
(1, 1, 'Alarmas en Santiago Centro | Guardman Chile', 'Alarmas en Santiago Centro', 'Alarmas en Santiago Centro', 'Proteccion urbana', 89990, 'auto');

-- Guardias(2) en comunas
INSERT INTO service_locations (service_id, commune_id, meta_title, meta_description, hero_title, hero_subtitle, content_status) VALUES
(2, 12, 'Guardias en Las Condes | Guardman', 'Guardias OS10 en Las Condes', 'Guardias en Las Condes', 'Personal certificado', 'auto'),
(2, 26, 'Guardias en Maipu | Guardman', 'Guardias de seguridad en Maipu', 'Guardias en Maipu', 'Proteccion industrial', 'auto');

-- CCTV(3) en comunas
INSERT INTO service_locations (service_id, commune_id, meta_title, meta_description, hero_title, hero_subtitle, starting_price, content_status) VALUES
(3, 12, 'CCTV en Las Condes | Guardman', 'Camaras de seguridad en Las Condes', 'CCTV en Las Condes', 'Vigilancia premium', 149990, 'auto'),
(3, 13, 'CCTV en Providencia | Guardman', 'Camaras en Providencia', 'CCTV en Providencia', 'Control visual', 149990, 'auto');

-- FAQs
INSERT INTO faqs (question, answer, category, order_index) VALUES
('Las alarmas tienen contrato?', 'No, nuestras alarmas Ajax no tienen contrato de permanencia. Puedes cancelar cuando quieras.', 'Alarmas', 1),
('Cuanto cuesta una alarma?', 'Nuestros sistemas parten desde $79.990 con instalacion incluida.', 'Alarmas', 2),
('Puedo monitorear desde el celular?', 'Si, todas nuestras alarmas incluyen la app Ajax para automonitoreo gratuito.', 'Alarmas', 3),
('Los guardias estan certificados?', 'Si, todo nuestro personal tiene licencia OS10 vigente.', 'Guardias', 4),
('Cuanto demora la instalacion?', 'La instalacion de alarma demora entre 2 y 4 horas.', 'Instalacion', 5);

-- Testimonios
INSERT INTO testimonials (author, role, company, quote, rating, verified, order_index) VALUES
('Maria Gonzalez', 'Gerente', 'Retail Store', 'Excelente servicio de guardias. Personal muy profesional.', 5, 1, 1),
('Carlos Mendoza', 'Propietario', '-', 'Instalaron mi alarma en menos de 3 horas. La app funciona perfecto.', 5, 1, 2),
('Ana Perez', 'Administradora', 'Edificio Norte', 'El sistema de camaras supero nuestras expectativas.', 5, 1, 3);

-- Partners
INSERT INTO partners (name, logo_url, type, order_index) VALUES
('Ajax Systems', '/images/partners/ajax.svg', 'tech_partner', 1),
('OS10 Carabineros', '/images/partners/os10.svg', 'certification', 2);

-- Site config
INSERT INTO site_config (brand_name, phone_primary, whatsapp_number, email_contact, address_main) VALUES
('Guardman Chile', '+56 2 2345 6789', '+56 9 1234 5678', 'contacto@guardman.cl', 'Av. Providencia 1234, Providencia');
