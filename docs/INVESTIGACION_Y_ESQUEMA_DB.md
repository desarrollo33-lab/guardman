# Documento de Investigación de Mercado y Esquema de Base de Datos

## 1. Investigación de Mercado: Guardman, Ajax Systems y Competencia Local

---

### 1.1 GUARDMAN - Perfil de la Empresa

**Guardman Chile SpA** es una empresa de seguridad privada con presencia en Chile, Perú y Argentina. En Chile opera desde su sede en Providencia, Santiago.

#### Servicios Ofrecidos:

| Servicio | Descripción |
|----------|-------------|
| **Guardias de Seguridad** | Personal OS10 capacitado para protección de empresas, industrias y condominios |
| **Sistemas de Alarmas** | Soluciones Ajax Systems (sin contrato) con app de automonitoreo |
| **Patrullaje** | Servicio de rondas para condominios y empresas |
| **Drones de Seguridad** | Vigilancia aérea para grandes extensiones |
| **GUARDPOD©** | Sistema de protección autónoma |
| **Monitoreo CCTV** | Videovigilancia remota 24/7 |
| **Seguridad Electrónica** | Instalación y mantenimiento de sistemas de alarma |

#### Diferenciadores:
- Sin contratos bindantes para alarmas
- App de automonitoreo
- Tecnología Ajax Systems (europea)
- Cobertura nacional

---

### 1.2 AJAX SYSTEMS - Productos y Soluciones

Ajax Systems es un fabricante украино de sistemas de seguridad inalámbricos con presencia global. Su tecnología propietaria **Jeweller** (comunicación RF) y **Wings** (transferencia de datos) garantiza comunicación segura.

#### Línea de Productos por Categoría:

##### A) Paneles de Control (Hubs)

| Modelo | Características |
|--------|-----------------|
| **Hub Jeweller** | Panel básico, hasta 100 dispositivos |
| **Hub 2 Jeweller** | Soporte fotoverificación, Wi-Fi, Ethernet, 2 SIM |
| **Hub 2 Plus Jeweller** | Hasta 200 dispositivos, 100 cámaras IP/RTSP |
| **Ajax Ultra DP** | Dual-path (DP2/DP3/DP4), SIM incluida |

##### B) Detectores de Intrusión

| Tipo | Modelos | Uso |
|------|---------|-----|
| **Movimiento** | MotionProtect, MotionProtect Plus, MotionCam (foto), MotionProtect Curtain | Interior/exterior |
| **Apertura** | DoorProtect, DoorProtect Plus | Puertas y ventanas |
| **Rotura de vidrio** | GlassProtect | Ventanas |
| **Vibración** | DoorProtect S | Detección de manipulación |

##### C) Seguridad contra Incendios

| Modelo | Características |
|--------|-----------------|
| **FireProtect** | Detector de humo y temperatura |
| **FireProtect Plus** | Humo + CO + temperatura |
| **FireProtect 2** | Nueva generación, varios colores |

##### D) Detección de Inundaciones

| Modelo | Características |
|--------|-----------------|
| **LeakProtect** | Detección de fugas de agua |

##### E) Dispositivos de Control

| Tipo | Modelos |
|------|---------|
| **Teclados** | KeyPad, KeyPad Plus (touch) |
| **Mandos** | SpaceControl (con pánico) |
| **Botones** | Button (pánico) |

##### F) Sirenas

| Modelo | Características |
|--------|-----------------|
| **Siren** | Interior, hasta 105 dB |
| **Siren Stone** | Exterior, resistente intemperie |

##### G) Repetidores de Señal

| Modelo | Características |
|--------|-----------------|
| **ReX Jeweller** | Extiende rango hasta 2x |
| **ReX 2 Jeweller** | Soporta Wings (fotos) |

##### H) Automatización y Confort

| Dispositivo | Función |
|-------------|---------|
| **WallSwitch** | Control de alimentación |
| **Socket** | Enchufe inteligente |
| **LightSwitch** | Interruptor inteligente |
| **Relay** | Control de dispositivos |

##### I) Video Vigilancia

| Tipo | Modelos |
|------|---------|
| **NVRs** | NVR de 8/16 canales |
| **Cámaras IP** | Bullet, Dome, Turret |
| **Cámaras** | Fisheye, with |

##### J) Certificaciones

- EN 50131 (Grado 2 y 3)
- UL
- NFa2P (Francia)
- INCERT
- Grade D1, F1

---

### 1.3 COMPETENCIA LOCAL EN CHILE

#### Empresas Principales:

| Empresa | Especialidad | Diferenciador |
|---------|--------------|---------------|
| **Gard Security** | Seguridad empresarial 360° | ISO 9001, respuesta <12hrs, OS10 |
| **Prosegur Alarmas** | Alarmas monitoreadas | Tecnología PreSense, respuesta inmediata |
| **Verisure Chile** | Alarmas hogares/negocios | Líder en Europa, Fotocapture |
| **Sekron Digital** | Seguridad + domótica | 25 años experiencia, AI |
| **Chilealarmas** | Alarmas comunitarias | Kits, proyectos fondos estatales |
| **VGuard** | Seguridad profesional | Sin pagos mensuales |
| **Tecnoprotec** | Seguridad integral | Colmena Digital integrada |
| **C.R.A. Chile** | Central receptora | Estándar europeo, video-verificación |
| **Protección Tecnológica** | Alarmas + servicios | WebPay, monitoreo 24/7 |

---

## 2. Esquema de Base de Datos SQL Agnóstico

A continuación se presenta un esquema completo y agnóstico para un sistema de gestión de seguridad, basado en la estructura actual del proyecto y adaptado para un sistema de gestión de seguridad real.

### Convenciones Utilizadas:

- **PK**: Primary Key
- **FK**: Foreign Key
- **UK**: Unique Key
- **NN**: Not Null
- **AI**: Auto Increment

---

### 2.1 MÓDULO: CONFIGURACIÓN DEL SISTEMA

```sql
-- =====================================================
-- MÓDULO: CONFIGURACIÓN DEL SISTEMA
-- =====================================================

-- Tabla principal de configuración del sitio
CREATE TABLE site_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(255) NOT NULL,
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    whatsapp_number VARCHAR(20) NOT NULL,
    email_contact VARCHAR(255) NOT NULL,
    address_main TEXT,
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    facebook_url VARCHAR(255),
    youtube_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Navegación del sitio
CREATE TABLE navbar_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    href VARCHAR(255),
    is_button BOOLEAN DEFAULT FALSE,
    parent_id INT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES navbar_items(id) ON DELETE SET NULL
);

-- Redirects URL
CREATE TABLE redirects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source_url VARCHAR(500) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    status_code ENUM('301', '302') DEFAULT '301',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_source_url (source_url)
);
```

---

### 2.2 MÓDULO: GESTIÓN DE COMUNAS Y LOCALIDADES

```sql
-- =====================================================
-- MÓDULO: GESTIÓN DE COMUNAS Y LOCALIDADES
-- =====================================================

CREATE TABLE communes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    zone VARCHAR(100),
    is_other_city BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    hero_title VARCHAR(255),
    hero_subtitle VARCHAR(255),
    intro_content TEXT,
    unique_content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_communes_slug ON communes(slug);
CREATE INDEX idx_communes_zone ON communes(zone);
CREATE INDEX idx_communes_is_other_city ON communes(is_other_city);
```

---

### 2.3 MÓDULO: SERVICIOS DE SEGURIDAD

```sql
-- =====================================================
-- MÓDULO: SERVICIOS DE SEGURIDAD
-- =====================================================

CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tagline VARCHAR(255),
    icon VARCHAR(100),
    features JSON, -- Array de características
    benefits JSON, -- Array de beneficios
    cta VARCHAR(255),
    image VARCHAR(500),
    image_alt VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_slug ON services(slug);

-- Relación servicios-industrias
CREATE TABLE service_industries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    industry_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE,
    UNIQUE KEY uk_service_industry (service_id, industry_id)
);

-- Relación servicios-soluciones
CREATE TABLE service_solutions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    solution_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_service_solution (service_id, solution_id)
);
```

---

### 2.4 MÓDULO: SOLUCIONES POR INDUSTRIA

```sql
-- =====================================================
-- MÓDULO: SOLUCIONES POR INDUSTRIA
-- =====================================================

CREATE TABLE solutions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    description TEXT NOT NULL,
    icon VARCHAR(100),
    features JSON,
    benefits JSON,
    cta VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_image VARCHAR(500),
    image VARCHAR(500),
    image_alt VARCHAR(255),
    challenges JSON,
    related_services JSON,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_solutions_slug ON solutions(slug);

-- Relación soluciones-industrias
CREATE TABLE solution_industries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    solution_id INT NOT NULL,
    industry_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE,
    UNIQUE KEY uk_solution_industry (solution_id, industry_id)
);
```

---

### 2.5 MÓDULO: INDUSTRIAS

```sql
-- =====================================================
-- MÓDULO: INDUSTRIAS
-- =====================================================

CREATE TABLE industries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    description TEXT,
    image VARCHAR(500),
    image_alt VARCHAR(255),
    challenges JSON,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_industries_slug ON industries(slug);
```

---

### 2.6 MÓDULO: LEADS Y CONTACTOS

```sql
-- =====================================================
-- MÓDULO: LEADS Y CONTACTOS
-- =====================================================

CREATE TABLE leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    servicio VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255),
    mensaje TEXT,
    source VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    status ENUM('nuevo', 'contactado', 'cotizado', 'convertido', 'perdido') DEFAULT 'nuevo',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_servicio ON leads(servicio);
```

---

### 2.7 MÓDULO: PÁGINAS Y BLOQUES DE CONTENIDO

```sql
-- =====================================================
-- MÓDULO: PÁGINAS Y BLOQUES DE CONTENIDO
-- =====================================================

CREATE TABLE pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    seo_title VARCHAR(255) NOT NULL,
    seo_description TEXT,
    seo_keywords JSON,
    og_image VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_pages_slug ON pages(slug);

-- Tipos de bloques de contenido
CREATE TABLE content_block_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    schema JSON, -- Esquema de datos para el tipo
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales para tipos de bloques
INSERT INTO content_block_types (type_name, display_name, description) VALUES
('hero_ajax', 'Hero Ajax', 'Banner principal con tecnología Ajax'),
('hero_video', 'Hero Video', 'Banner con video de fondo'),
('cta_dual', 'CTA Dual', 'Llamada a la acción doble'),
('services_grid', 'Services Grid', 'Cuadrícula de servicios'),
('services_grid_ajax', 'Services Grid Ajax', 'Cuadrícula servicios Ajax'),
('stats_row', 'Stats Row', 'Fila de estadísticas'),
('stats_section', 'Stats Section', 'Sección de estadísticas'),
('process_steps', 'Process Steps', 'Pasos del proceso'),
('testimonials_slider', 'Testimonials Slider', 'Slider de testimonios'),
('partners_grid', 'Partners Grid', 'Cuadrícula de socios'),
('values_section', 'Values Section', 'Sección de valores'),
('industries_grid', 'Industries Grid', 'Cuadrícula de industrias'),
('faqs_accordion', 'FAQs Accordion', 'Preguntas frecuentes'),
('location_map', 'Location Map', 'Mapa de ubicaciones'),
('contact_form', 'Contact Form', 'Formulario de contacto'),
('content_rich', 'Content Rich', 'Contenido enriquecido'),
('image_gallery', 'Image Gallery', 'Galería de imágenes'),
('video_section', 'Video Section', 'Sección de video'),
('guardpod_feature', 'Guardpod Feature', 'Feature de Guardpod');

-- Bloques de contenido por página
CREATE TABLE content_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_id INT NOT NULL,
    block_type_id INT NOT NULL,
    order_index INT NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT, -- Markdown o HTML
    data JSON, -- Datos estructurados según tipo
    is_visible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (block_type_id) REFERENCES content_block_types(id) ON DELETE CASCADE
);

CREATE INDEX idx_content_blocks_page_order ON content_blocks(page_id, order_index);
```

---

### 2.8 MÓDULO: SEO Y METADATOS

```sql
-- =====================================================
-- MÓDULO: SEO Y METADATOS
-- =====================================================

-- Metadatos SEO por página
CREATE TABLE seo_metadata (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    keywords JSON,
    og_image VARCHAR(500),
    canonical_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_seo_metadata_page_slug ON seo_metadata(page_slug);

-- Combinaciones Servicio ×Comuna para SEO
CREATE TABLE service_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_slug VARCHAR(100) NOT NULL,
    commune_slug VARCHAR(100) NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT,
    intro_content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_service_commune (service_slug, commune_slug)
);

CREATE INDEX idx_service_locations_service ON service_locations(service_slug);
CREATE INDEX idx_service_locations_commune ON service_locations(commune_slug);
```

---

### 2.9 MÓDULO: TESTIMONIOS Y RESEÑAS

```sql
-- =====================================================
-- MÓDULO: TESTIMONIOS Y RESEÑAS
-- =====================================================

CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    company VARCHAR(255),
    quote TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    image_url VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonials_order ON testimonials(order_index);

-- Reseñas por servicio/communa
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_slug VARCHAR(100),
    commune_slug VARCHAR(100),
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_service ON reviews(service_slug);
CREATE INDEX idx_reviews_commune ON reviews(commune_slug);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

### 2.10 MÓDULO: BLOG

```sql
-- =====================================================
-- MÓDULO: BLOG
-- =====================================================

CREATE TABLE authors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(500),
    bio TEXT,
    role VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_authors_slug ON authors(slug);

CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    cover_image VARCHAR(500) NOT NULL,
    author_id INT NOT NULL,
    published_at TIMESTAMP,
    read_time INT DEFAULT 5, -- minutos
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    content JSON, -- Array de secciones
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);
```

---

### 2.11 MÓDULO: EQUIPO Y VALORES

```sql
-- =====================================================
-- MÓDULO: EQUIPO Y VALORES
-- =====================================================

CREATE TABLE team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_members_order ON team_members(order_index);

CREATE TABLE company_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_values_order ON company_values(order_index);
```

---

### 2.12 MÓDULO: PROCESO Y ESTADÍSTICAS

```sql
-- =====================================================
-- MÓDULO: PROCESO Y ESTADÍSTICAS
-- =====================================================

-- Pasos del proceso por página
CREATE TABLE process_steps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(100) NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_process_steps_page ON process_steps(page_slug);

-- Estadísticas
CREATE TABLE stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL, -- "500+", "15 años"
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stats_page ON stats(page_slug);
```

---

### 2.13 MÓDULO: HERO BANNERS

```sql
-- =====================================================
-- MÓDULO: HERO BANNERS
-- =====================================================

CREATE TABLE heroes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    background_type ENUM('youtube', 'image') NOT NULL,
    youtube_id VARCHAR(50),
    image_url VARCHAR(500),
    mobile_image_url VARCHAR(500),
    ctas JSON, -- Array de CTAs
    badges JSON, -- Array de badges
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_heroes_page_slug ON heroes(page_slug);
```

---

### 2.14 MÓDULO: LLAMADAS A LA ACCIÓN (CTAs)

```sql
-- =====================================================
-- MÓDULO: LLAMADAS A LA ACCIÓN (CTAs)
-- =====================================================

CREATE TABLE ctas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(100) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    subheadline VARCHAR(255),
    buttons JSON NOT NULL, -- Array de botones
    badges JSON,
    background_type ENUM('image', 'gradient'),
    background_value VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_ctas_page_slug ON ctas(page_slug);
```

---

### 2.15 MÓDULO: PREGUNTAS FRECUENTES

```sql
-- =====================================================
-- MÓDULO: PREGUNTAS FRECUENTES
-- =====================================================

CREATE TABLE faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_order ON faqs(order_index);
```

---

### 2.16 MÓDULO: SOCIOS Y COLABORADORES

```sql
-- =====================================================
-- MÓDULO: SOCIOS Y COLABORADORES
-- =====================================================

CREATE TABLE partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500) NOT NULL,
    type ENUM('certification', 'client', 'tech_partner') NOT NULL,
    url VARCHAR(500),
    quote TEXT,
    industry VARCHAR(100),
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_type ON partners(type);
```

---

### 2.17 MÓDULO: CARRERAS Y BENEFICIOS

```sql
-- =====================================================
-- MÓDULO: CARRERAS Y BENEFICIOS
-- =====================================================

CREATE TABLE careers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    department ENUM('operaciones', 'administracion', 'ventas', 'tecnologia') NOT NULL,
    location VARCHAR(255) NOT NULL,
    type ENUM('full-time', 'part-time', 'contract') NOT NULL,
    description TEXT NOT NULL,
    requirements JSON NOT NULL,
    responsibilities JSON NOT NULL,
    salary_range VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_careers_slug ON careers(slug);
CREATE INDEX idx_careers_department ON careers(department);
CREATE INDEX idx_careers_is_active ON careers(is_active);

CREATE TABLE career_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_career_benefits_order ON career_benefits(order_index);
```

---

### 2.18 MÓDULO: ARCHIVOS

```sql
-- =====================================================
-- MÓDULO: ARCHIVOS
-- =====================================================

CREATE TABLE files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    storage_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_storage_id ON files(storage_id);
```

---

## 3. DIAGRAMA DE RELACIONES

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ESQUEMA DE RELACIONES                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────┐
    │   pages      │         │  navbar_items│
    └──────┬───────┘         └──────────────┘
           │                         │
           │ 1:N                     │ 1:N
           ▼                         ▼
    ┌──────────────┐         ┌──────────────┐
    │content_blocks│         │   pages      │
    │  (page_id)   │         └──────────────┘
    └──────┬───────┘
           │
           │ FK
           ▼
    ┌──────────────────┐
    │content_block_types│
    └──────────────────┘

    ┌──────────────┐       ┌──────────────┐
    │   services   │       │  industries  │
    └──────┬───────┘       └──────┬───────┘
           │                      │
           │ N:M                   │ N:M
           ▼                      ▼
    ┌──────────────┐       ┌──────────────┐
    │service_inds  │       │solution_inds │
    └──────────────┘       └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  solutions   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │communes     │
                          │service_locs │
                          └─────────────┘

    ┌──────────────┐       ┌──────────────┐
    │  blog_posts  │       │   authors    │
    └──────┬───────┘       └──────────────┘
           │ FK
           ▼
    ┌──────────────┐
    │   authors    │
    └──────────────┘
```

---

## 4. ÍNDICES OPTIMIZADOS

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_solutions_is_active ON solutions(is_active);
CREATE INDEX idx_industries_is_active ON industries(is_active);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_telefono ON leads(telefono);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured, is_published);
CREATE INDEX idx_careers_expires ON careers(expires_at);
CREATE INDEX idx_careers_published ON careers(is_active, published_at);
```

---

## 5. NOTAS DE IMPLEMENTACIÓN

### Diferencias con el Schema Original de Convex:

1. **Eliminado**: Tablas de autenticación (`identAccounts`, `identUsers`, `verifications`) - son específicas de Convex Auth
2. **Eliminado**: Referencias a `v.id('_storage')` - ahora es un VARCHAR genérico
3. **Agregado**: Campos de timestamps consistentes (`created_at`, `updated_at`)
4. **Agregado**: Índices para optimización de consultas
5. **Modificado**: Arrays de JSON para campos dinámicos (features, benefits, etc.)
6. **Modificado**: Enum consistentes para campos como status, type

### Recomendaciones:

1. Usar migrations para tablas existentes
2. Mantener retrocompatibilidad durante transición
3. Agregar triggers para updated_at automático
4. Considerar particionamiento para leads (alto volumen)
5. Implementar soft deletes (is_active)
