-- Servicios
INSERT INTO services (slug, title, description, tagline, icon, features, benefits, cta, meta_title, meta_description, order_index) VALUES
('guardias', 'Guardias de Seguridad', 'Personal OS10 para empresas y condominios', 'Guardias OS10', 'shield', '[]', '[]', 'Solicitar', 'Guardias OS10 | Guardman', 'Guardias certificados', 2),
('cctv', 'Camaras de Seguridad', 'Videovigilancia IP con monitoreo remoto', 'Vigilancia 24/7', 'camera', '[]', '[]', 'Cotizar', 'CCTV | Guardman', 'Camaras de seguridad', 3),
('patrullaje', 'Patrullaje', 'Rondas para condominios y empresas', 'Rondas programadas', 'car', '[]', '[]', 'Contratar', 'Patrullaje | Guardman', 'Servicio de patrullaje', 4),
('monitoreo', 'Monitoreo 24/7', 'Central de monitoreo profesional', 'Monitoreo profesional', 'monitor', '[]', '[]', 'Contratar', 'Monitoreo | Guardman', 'Monitoreo 24/7', 5);

-- Soluciones
INSERT INTO solutions (slug, title, description, icon, features, benefits, order_index) VALUES
('hogar', 'Seguridad para Hogar', 'Proteccion para tu casa', 'home', '[]', '[]', 1),
('empresa', 'Seguridad Empresarial', 'Soluciones para PYMEs', 'building', '[]', '[]', 2),
('industria', 'Seguridad Industrial', 'Proteccion para fabricas', 'factory', '[]', '[]', 3),
('retail', 'Seguridad para Retail', 'Proteccion para tiendas', 'shopping-cart', '[]', '[]', 4),
('condominio', 'Seguridad para Condominios', 'Proteccion residencial', 'users', '[]', '[]', 5);

-- Industrias
INSERT INTO industries (slug, name, description, icon, order_index) VALUES
('retail', 'Retail y Comercio', 'Tiendas y malls', 'shopping-bag', 1),
('mineria', 'Mineria', 'Faenas mineras', 'mountain', 2),
('logistica', 'Logistica', 'Bodegas y transporte', 'truck', 3),
('salud', 'Salud', 'Hospitales y clinicas', 'heart', 4),
('educacion', 'Educacion', 'Colegios y universidades', 'graduation-cap', 5);
