-- =====================================================
-- MÓDULO: CONFIGURACIÓN DEL SISTEMA
-- =====================================================

CREATE TABLE site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL,
    phone_primary TEXT NOT NULL,
    phone_secondary TEXT,
    whatsapp_number TEXT NOT NULL,
    email_contact TEXT NOT NULL,
    address_main TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE navbar_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    href TEXT,
    is_button INTEGER DEFAULT 0,
    parent_id INTEGER,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (parent_id) REFERENCES navbar_items(id) ON DELETE SET NULL
);

CREATE TABLE redirects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    status_code TEXT DEFAULT '301',
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    UNIQUE(source_url)
);

-- =====================================================
-- MÓDULO: LOCALIDADES - CLAVE PARA SEO LOCAL
-- =====================================================

CREATE TABLE communes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    zone TEXT,
    sector TEXT,
    latitude REAL,
    longitude REAL,
    population INTEGER,
    area_km2 REAL,
    density REAL,
    meta_title TEXT,
    meta_description TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    intro_content TEXT,
    unique_content TEXT,
    crime_rate_index REAL,
    avg_income REAL,
    main_industries TEXT,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_communes_slug ON communes(slug);
CREATE INDEX idx_communes_zone ON communes(zone);
CREATE INDEX idx_communes_sector ON communes(sector);

-- Barrios/Sectores dentro de comunas grandes
CREATE TABLE neighborhoods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commune_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    population INTEGER,
    meta_title TEXT,
    meta_description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (commune_id) REFERENCES communes(id) ON DELETE CASCADE
);

CREATE INDEX idx_neighborhoods_commune ON neighborhoods(commune_id);
CREATE UNIQUE INDEX idx_neighborhoods_slug ON neighborhoods(commune_id, slug);

-- =====================================================
-- MÓDULO: SERVICIOS - BASE DEL SEO PROGRAMÁTICO
-- =====================================================

CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tagline TEXT,
    icon TEXT,
    features TEXT,
    benefits TEXT,
    cta TEXT,
    image TEXT,
    image_alt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    generate_location_pages INTEGER DEFAULT 1,
    generate_industry_pages INTEGER DEFAULT 1,
    generate_intent_pages INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_services_slug ON services(slug);

-- Palabras clave asociadas a cada servicio
CREATE TABLE service_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    search_volume INTEGER DEFAULT 0,
    difficulty TEXT,
    intent TEXT,
    is_long_tail INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE(service_id, keyword)
);

CREATE INDEX idx_service_keywords_service ON service_keywords(service_id);

-- Intenciones de búsqueda por servicio
CREATE TABLE user_intents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    search_template TEXT,
    content_type TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Relación servicios × intenciones
CREATE TABLE service_intents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    intent_id INTEGER NOT NULL,
    priority INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (intent_id) REFERENCES user_intents(id) ON DELETE CASCADE,
    UNIQUE(service_id, intent_id)
);

-- =====================================================
-- MÓDULO: INDUSTRIAS
-- =====================================================

CREATE TABLE industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    image TEXT,
    image_alt TEXT,
    challenges TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_industries_slug ON industries(slug);

-- Relación servicios × industrias
CREATE TABLE service_industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    industry_id INTEGER NOT NULL,
    priority INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE,
    UNIQUE(service_id, industry_id)
);

-- =====================================================
-- MÓDULO: SOLUCIONES
-- =====================================================

CREATE TABLE solutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT NOT NULL,
    icon TEXT,
    features TEXT,
    benefits TEXT,
    cta TEXT,
    meta_title TEXT,
    meta_description TEXT,
    og_image TEXT,
    image TEXT,
    image_alt TEXT,
    challenges TEXT,
    related_services TEXT,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_solutions_slug ON solutions(slug);

CREATE TABLE solution_industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solution_id INTEGER NOT NULL,
    industry_id INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE,
    UNIQUE(solution_id, industry_id)
);

-- Relación servicios × soluciones
CREATE TABLE service_solutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    solution_id INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
    UNIQUE(service_id, solution_id)
);

-- =====================================================
-- MÓDULO: SEO PROGRAMÁTICO - GENERACIÓN AUTOMÁTICA
-- =====================================================

-- Plantillas para generación de páginas
CREATE TABLE page_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    template_type TEXT NOT NULL,
    url_template TEXT NOT NULL,
    title_template TEXT NOT NULL,
    h1_template TEXT NOT NULL,
    meta_title_template TEXT NOT NULL,
    meta_description_template TEXT NOT NULL,
    schema_template TEXT,
    content_blocks_order TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- PÁGINAS GENERADAS AUTOMÁTICAMENTE
CREATE TABLE generated_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_type TEXT NOT NULL,
    service_id INTEGER,
    commune_id INTEGER,
    industry_id INTEGER,
    intent_id INTEGER,
    neighborhood_id INTEGER,
    guide_id INTEGER,
    slug TEXT NOT NULL UNIQUE,
    full_url TEXT NOT NULL,
    title TEXT NOT NULL,
    h1 TEXT NOT NULL,
    meta_title TEXT NOT NULL,
    meta_description TEXT,
    seo_description TEXT,
    content TEXT,
    status TEXT DEFAULT 'pending',
    content_status TEXT DEFAULT 'auto',
    target_keywords TEXT,
    target_search_volume INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    generated_at INTEGER,
    published_at INTEGER,
    last_updated INTEGER DEFAULT (strftime('%s', 'now')),
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (commune_id) REFERENCES communes(id) ON DELETE SET NULL,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE SET NULL,
    FOREIGN KEY (intent_id) REFERENCES user_intents(id) ON DELETE SET NULL,
    FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE SET NULL
);

CREATE INDEX idx_generated_pages_type ON generated_pages(page_type);
CREATE INDEX idx_generated_pages_status ON generated_pages(status);
CREATE INDEX idx_generated_pages_slug ON generated_pages(slug);

-- SERVICE LOCATIONS - combinaciones service x commune
CREATE TABLE service_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    commune_id INTEGER NOT NULL,
    industry_id INTEGER,
    meta_title TEXT NOT NULL,
    meta_description TEXT,
    intro_content TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    local_benefits TEXT,
    local_features TEXT,
    starting_price REAL,
    price_notes TEXT,
    stats TEXT,
    is_active INTEGER DEFAULT 1,
    content_status TEXT DEFAULT 'auto',
    generated_page_id INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (commune_id) REFERENCES communes(id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_page_id) REFERENCES generated_pages(id) ON DELETE SET NULL,
    UNIQUE(service_id, commune_id),
    UNIQUE(service_id, commune_id, industry_id)
);

CREATE INDEX idx_service_locations_service ON service_locations(service_id);
CREATE INDEX idx_service_locations_commune ON service_locations(commune_id);
CREATE INDEX idx_service_locations_active ON service_locations(is_active);

-- =====================================================
-- MÓDULO: PÁGINAS Y BLOQUES DE CONTENIDO
-- =====================================================

CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    seo_title TEXT NOT NULL,
    seo_description TEXT,
    seo_keywords TEXT,
    og_image TEXT,
    is_published INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_pages_slug ON pages(slug);

CREATE TABLE content_block_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    schema TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE content_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,
    block_type_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    data TEXT,
    is_visible INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (block_type_id) REFERENCES content_block_types(id) ON DELETE CASCADE
);

CREATE INDEX idx_content_blocks_page_order ON content_blocks(page_id, order_index);

-- =====================================================
-- MÓDULO: SEO METADATA
-- =====================================================

CREATE TABLE seo_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    keywords TEXT,
    og_image TEXT,
    canonical_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_seo_metadata_page_slug ON seo_metadata(page_slug);

-- =====================================================
-- MÓDULO: LEADS Y CONTACTOS
-- =====================================================

CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT,
    servicio TEXT NOT NULL,
    ciudad TEXT,
    commune_id INTEGER,
    industry_id INTEGER,
    mensaje TEXT,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    landing_page TEXT,
    referring_url TEXT,
    status TEXT DEFAULT 'nuevo',
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (commune_id) REFERENCES communes(id) ON DELETE SET NULL,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE SET NULL
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_servicio ON leads(servicio);
CREATE INDEX idx_leads_commune ON leads(commune_id);

-- =====================================================
-- MÓDULO: BLOG
-- =====================================================

CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    role TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_authors_slug ON authors(slug);

CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published_at INTEGER,
    read_time INTEGER DEFAULT 5,
    tags TEXT,
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 0,
    content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);

-- Artículos por location
CREATE TABLE blog_location_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_post_id INTEGER NOT NULL,
    commune_id INTEGER,
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (commune_id) REFERENCES communes(id) ON DELETE CASCADE
);

-- =====================================================
-- MÓDULO: TESTIMONIOS Y RESEÑAS
-- =====================================================

CREATE TABLE testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    role TEXT,
    company TEXT,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url TEXT,
    verified INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_testimonials_order ON testimonials(order_index);

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT,
    commune_slug TEXT,
    author_name TEXT NOT NULL,
    author_role TEXT,
    rating INTEGER NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_reviews_service ON reviews(service_slug);
CREATE INDEX idx_reviews_commune ON reviews(commune_slug);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =====================================================
-- MÓDULO: EQUIPO Y VALORES
-- =====================================================

CREATE TABLE team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_team_members_order ON team_members(order_index);

CREATE TABLE company_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_company_values_order ON company_values(order_index);

-- =====================================================
-- MÓDULO: PROCESO Y ESTADÍSTICAS
-- =====================================================

CREATE TABLE process_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_process_steps_page ON process_steps(page_slug);

CREATE TABLE stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_stats_page ON stats(page_slug);

-- =====================================================
-- MÓDULO: HEROES Y CTAs
-- =====================================================

CREATE TABLE heroes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    background_type TEXT NOT NULL,
    youtube_id TEXT,
    image_url TEXT,
    mobile_image_url TEXT,
    ctas TEXT,
    badges TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_heroes_page_slug ON heroes(page_slug);

CREATE TABLE ctas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    headline TEXT NOT NULL,
    subheadline TEXT,
    buttons TEXT NOT NULL,
    badges TEXT,
    background_type TEXT,
    background_value TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_ctas_page_slug ON ctas(page_slug);

-- =====================================================
-- MÓDULO: FAQs
-- =====================================================

CREATE TABLE faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_order ON faqs(order_index);

-- =====================================================
-- MÓDULO: PARTNERS
-- =====================================================

CREATE TABLE partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT,
    quote TEXT,
    industry TEXT,
    icon TEXT,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_partners_type ON partners(type);

-- =====================================================
-- MÓDULO: CARRERAS
-- =====================================================

CREATE TABLE careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    salary_range TEXT,
    is_remote INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    published_at INTEGER,
    expires_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_careers_slug ON careers(slug);
CREATE INDEX idx_careers_department ON careers(department);
CREATE INDEX idx_careers_is_active ON careers(is_active);

CREATE TABLE career_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_career_benefits_order ON career_benefits(order_index);

-- =====================================================
-- MÓDULO: ARCHIVOS
-- =====================================================

CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storage_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_files_storage_id ON files(storage_id);

-- =====================================================
-- SEED DATA - 40 COMUNAS DEL GRAN SANTIAGO
-- =====================================================

INSERT INTO communes (name, slug, zone, sector, latitude, longitude, population, order_index) VALUES
-- ZONA CENTRO
('Santiago', 'santiago', 'centro', 'interior', -33.4378, -70.6503, 404495, 1),
('Estación Central', 'estacion-central', 'centro', 'interior', -33.3990, -70.6790, 147041, 2),
('Independencia', 'independencia', 'centro', 'interior', -33.4167, -70.6667, 100881, 3),
('Recoleta', 'recoleta', 'centro', 'interior', -33.4100, -70.6400, 157251, 4),
('Conchalí', 'conchali', 'centro', 'interior', -33.3700, -70.6800, 126919, 5),
('Huechuraba', 'huechuraba', 'centro', 'interior', -33.3500, -70.6300, 86335, 6),
-- ZONA NORTE
('Quilicura', 'quilicura', 'norte', 'periferico', -33.3500, -70.7200, 25635, 7),
('Colina', 'colina', 'norte', 'periferico', -33.2000, -70.6700, 180000, 8),
('Lampa', 'lampa', 'norte', 'periferico', -33.2800, -70.7800, 23000, 9),
('Tiltil', 'tiltil', 'norte', 'periferico', -33.1000, -70.7300, 18000, 10),
-- ZONA NORPONIENTE
('Vitacura', 'vitacura', 'norponiente', 'interior', -33.3900, -70.5900, 91701, 11),
('Las Condes', 'las-condes', 'norponiente', 'interior', -33.4100, -70.5900, 294838, 12),
('Providencia', 'providencia', 'norponiente', 'interior', -33.4300, -70.6000, 126936, 13),
('Nuñoa', 'nunoa', 'norponiente', 'interior', -33.4500, -70.6300, 247686, 14),
('San Joaquín', 'san-joaquin', 'norponiente', 'interior', -33.4800, -70.6300, 103485, 15),
('La Reina', 'la-reina', 'norponiente', 'interior', -33.4400, -70.5500, 96129, 16),
-- ZONA NORORIENTE
('Lo Barnechea', 'lo-barnechea', 'nororiente', 'periferico', -33.3500, -70.5200, 120000, 17),
('La Dehesa', 'la-dehesa', 'nororiente', 'periferico', -33.4500, -70.5000, 30000, 18),
-- ZONA SUR
('San Miguel', 'san-miguel', 'sur', 'interior', -33.5000, -70.6500, 104316, 19),
('La Cisterna', 'la-cisterna', 'sur', 'interior', -33.5200, -70.6600, 90731, 20),
('El Bosque', 'el-bosque', 'sur', 'interior', -33.5500, -70.6800, 172000, 21),
('San Ramón', 'san-ramon', 'sur', 'interior', -33.5400, -70.6400, 86000, 22),
('La Granja', 'la-granja', 'sur', 'interior', -33.5300, -70.6000, 132000, 23),
('Cerro Navia', 'cerro-navia', 'sur', 'interior', -33.4400, -70.7200, 134000, 24),
('Lo Prado', 'lo-prado', 'sur', 'interior', -33.4400, -70.7300, 104000, 25),
-- ZONA SUR PERIFERICO
('Maipú', 'maipu', 'sur', 'periferico', -33.5100, -70.7500, 600000, 26),
('Padre Hurtado', 'padre-hurtado', 'sur', 'periferico', -33.5800, -70.7000, 56000, 27),
('San Bernardo', 'san-bernardo', 'sur', 'periferico', -33.5900, -70.7000, 294000, 28),
('Buin', 'buin', 'sur', 'periferico', -33.7300, -70.7300, 110000, 29),
('Paine', 'paine', 'sur', 'periferico', -33.8100, -70.7500, 70000, 30),
-- ZONA SURORIENTE
('La Florida', 'la-florida', 'suroriente', 'periferico', -33.5200, -70.6000, 400000, 31),
('Macul', 'macul', 'suroriente', 'interior', -33.4900, -70.5900, 134000, 32),
('Puente Alto', 'puente-alto', 'suroriente', 'periferico', -33.6100, -70.5800, 568000, 33),
('San José de Maipo', 'san-jose-de-maipo', 'suroriente', 'periferico', -33.5000, -70.3500, 18000, 34),
('Pirque', 'pirque', 'suroriente', 'periferico', -33.6300, -70.4000, 25000, 35);
