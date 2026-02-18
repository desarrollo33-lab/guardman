# GUARDMAN: ESTRATEGIA MAESTRA Y ARQUITECTURA DIGITAL
**Versión:** 2.0 (Remastered)
**Fecha:** 18 de Febrero, 2026
**Objetivo:** Consolidar diseño premium, SEO avanzado y arquitectura 100% data-driven en Convex.

---

## 1. ANÁLISIS COMPARATIVO E INVESTIGACIÓN

### 1.1 El Estándar "Ajax Systems" (Documento Original)
El análisis original destaca correctamente:
- **Estética:** Minimalismo monocromático (Negro/Blanco) con tipografía fuerte.
- **Psicología:** El "Negro Profundo" (`#181818`) transmite autoridad y tecnología, diferenciándose del "Azul Seguridad" genérico.
- **Estructura:** Alternancia rítmica entre secciones oscuras (impacto) y claras (lectura).

### 1.2 Investigación Adicional: Verticales Críticas
Tras analizar el sector de seguridad moderna y las capacidades de Guardman, se identifican las siguientes mejoras sobre el análisis original:

#### A. Data-Driven Architecture (El "100% Convex")
*Hallazgo:* El esquema actual tiene `services` y `solutions`, pero muchos textos (Headers, Footers, Titulares de Home) siguen hardcodeados.
*Solución:* **"Todo es un Registro"**. Desde el número de teléfono del header hasta el título del Hero debe venir de la DB. Esto permite A/B testing y cambios sin deploy.

#### B. La "Confianza Inmediata" (UX Trust)
*Hallazgo:* Ajax es una marca de producto global. Guardman es una empresa de servicios local.
*Diferencia Clave:* Ajax vende hardware; Guardman vende *personas* (Guardias).
*Mejora:* El diseño no puede ser tan frío. Necesitamos humanizar la tecnología.
- **Componente Vital:** `VerifiedBadge` (Certificación OS10) visible en el primer viewport móvil.
- **Floating CTA:** En móvil, el botón "Llamar ahora" o "Emergencia" debe estar siempre accesible, no solo "Cotizar".

#### C. SEO Hiper-Local
*Hallazgo:* El documento original menciona SEO general.
*Mejora:* Estructura de "Landing Pages Programáticas".
- `/seguridad-privada-las-condes`, `/guardias-vitacura`.
- Usar la tabla `communes` para generar miles de páginas long-tail automáticamente con contenido variable inyectado desde Convex.

---

## 2. NUEVA ARQUITECTURA DE INFORMACIÓN (CONVEX SCHEMA 2.0)

Para cumplir el objetivo de "100% en base de datos", se propone la siguiente expansión del esquema:

### 2.1 Tablas Base (Existentes & Mejoradas)
- **`services`**: Añadir campos para `icon_dark` y `icon_light` para soportar temas dinámicos.
- **`solutions`**: Añadir relación `parent_solution` para jerarquías anidadas.
- **`products`**: (Nueva) Para hardware físico (cámaras, alarmas) separado de servicios humanos.

### 2.2 Tablas de Contenido Global (Nuevas)
Estas tablas eliminan el hardcoding del frontend.

#### `site_config`
Configuración global del sitio. Un solo documento activo.
```typescript
{
  phone_primary: "600 XXX XXXX",
  whatsapp_number: "+569...",
  email_contact: "contacto@guardman.cl",
  social_links: { instagram: "...", linkedin: "..." },
  navbar_items: [ { label: "Servicios", link: "/servicios" }, ... ],
  footer_columns: [ ... ]
}
```

#### `pages`
Metadatos y configuración específica por ruta.
```typescript
{
  slug: "/", // Homepage
  seo_title: "Guardman - Seguridad Privada Chile",
  seo_description: "...",
  hero_section_id: "id_de_tabla_sections" // Relación
}
```

#### `content_blocks` (o `sections`)
El corazón del diseño modular. Cada sección del sitio es un registro.
```typescript
{
  page_slug: "/", // Dónde aparece
  type: "hero_ajax" | "services_grid" | "cta_dual", // Qué componente usar
  order: 1,
  data: {
    title: "Protegemos lo que importa",
    subtitle: "Guardias OS10 y Tecnología",
    bg_image: "url...",
    primary_cta: { text: "Cotizar", link: "#" }
  }
}
```

#### `testimonials`
```typescript
{
  author: "Juan Pérez",
  role: "Gerente de Operaciones",
  company: "Retail S.A.",
  quote: "Servicio impecable...",
  rating: 5,
  verified: true
}
```

---

## 3. SISTEMA DE DISEÑO & COMPONENTES GLOBALES

Implementaremos un sistema de componentes "Agnósticos al Contenido". El componente no sabe *qué* muestra, solo *cómo* mostrarlo.

### 3.1 Componente Maestro: `<DynamicSection />`
Este componente recibe un objeto de la tabla `content_blocks` y renderiza el componente Astro/React correspondiente.

```astro
---
// Pseudo-código
const { block } = Astro.props;
/*
  Mapping dinámico:
  hero_ajax -> <HeroAjax data={block.data} />
  services_grid -> <ServicesGrid data={block.data} />
  testimonials_carousel -> <TestimonialsCarousel data={block.data} />
*/
---
<Component maps={block.type} {...block.data} />
```

### 3.2 Componentes de UI (Mejoras Visuales)

#### A. Cards de Servicio (La "Ficha Técnica Visual")
Basado en Ajax, pero con adaptaciones de servicio:
- **Estado Normal:** Fondo blanco, imagen limpia, título negro.
- **Hover:** Elevación sutil, borde inferior en `guardman-blue`.
- **Datos Data-Driven:** Icono SVG inyectado desde Convex, no importado localmente.

#### B. El "Trust Banner"
Una barra delgada debajo del Hero o en el Footer que renderiza logos de certificaciones (OS10, Carabineros, ISO).
- **Control:** Lista de logos gestionable desde una tabla `partners` o `certifications` en Convex.

#### C. Formularios Inteligentes
Un solo componente `<LeadForm />` que recibe props de configuración:
- `source`: "home_hero", "footer", "landing_las_condes".
- `service_interest`: Pre-llenado según la página actual.

---

## 4. ESTRATEGIA SEO & PERFORMANCE

### 4.1 Programmatic SEO (PSEO)
Utilizar Astro Dynamic Routes (`[...slug].astro`) alimentadas por Convex.
1. **Query:** `convex.query(api.seo.generateRoutes)`
2. **Generación:** Crea miles de rutas estáticas en build time (o SSR con caché).
   - `/servicios/guardias-de-seguridad`
   - `/servicios/guardias-de-seguridad/en-las-condes`
   - `/servicios/guardias-de-seguridad/para-condominios`

### 4.2 Asset Optimization
- Integrar **Image Optimization** de Astro con las URLs de almacenamiento de Convex.
- Uso de `font-display: swap` para tipografías (Inter/Roboto).

---

## 5. HOJA DE RUTA DE IMPLEMENTACIÓN

### Fase 1: Migración de Datos (Backend)
1. Modificar `schema.ts` para incluir `site_config`, `pages`, `content_blocks`.
2. Crear scripts de "Seed" para migrar el contenido hardcodeado actual a la base de datos.
3. Crear Dashboard básico (o usar Convex Dashboard) para editar estos textos.

### Fase 2: Refactorización de Componentes (Frontend)
1. Crear el `<DynamicPageBuilder />` en Astro.
2. Refactorizar `Hero`, `ServicesGrid`, `Footer` para aceptar props puras desde la DB.
3. Eliminar textos hardcodeados en `.astro` files.

### Fase 3: SEO & Expansión
1. Implementar páginas dinámicas de comunas.
2. Activar sitemap dinámico.

---

## CONCLUSIÓN
Esta estrategia eleva a Guardman de un "sitio web estático con base de datos" a una **"Plataforma de Experiencia Digital (DXP)"**.
- **Diseño:** Premium, inspirado en Ajax Systems.
- **Contenido:** 100% editable sin tocar código.
- **Escalabilidad:** Lista para generar miles de landing pages automáticamente.
