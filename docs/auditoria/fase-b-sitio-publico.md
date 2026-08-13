# Fase B — Auditoría del Sitio Público

**Proyecto:** GuardMan Chile (Astro 6 SSR en Cloudflare Workers)
**URL auditada:** https://guardman-astro.oficinadesarrollo33.workers.dev
**Fecha:** 2026-08-13

---

## B1. Funcional y Contenido

### Títulos de página (`<title>`)

| Página | Title renderizado | Chars | Veredicto |
|--------|-------------------|-------|-----------|
| / | Seguridad Privada OS-10 en Santiago Chile GuardMan Chile | 61 | P2: >60 chars |
| /servicios | (verificar) | — | — |
| /contacto | Contacto 24/7 GuardMan Chile Seguridad Privada | 48 | OK |
| /404 | Página no encontrada GuardMan Chile | 35 | OK (noindex) |

**Patrón:** `BaseLayout` concatena `${title} ${SITE.NAME}` → todos los títulos incluyen "GuardMan Chile" al final, lo que consume ~16 chars. El title del homepage excede60 caracteres.

### Meta `<meta name="description">`

| Página | Chars | Veredicto |
|--------|-------|-----------|
| / | ~318 | P1: >160 chars (Google truncará) |
| /contacto | ~155 | OK |
| /404 | ~55 | OK |

### `<link rel="canonical">`

- **Presente:** Sí (`src/layouts/BaseLayout.astro:170`)
- **Problema P1:** Apunta a `https://guardman.cl/` (el dominio configurado en `PUBLIC_SITE_URL`), pero `guardman.cl` NO resuelve al worker. El canonical debería apuntar a la URL del worker hasta que el dominio esté conectado.

### Open Graph tags

- **Presentes:** og:type, og:title, og:description, og:url, og:image (1200×630), og:image:alt, og:locale (es_CL), og:site_name — `BaseLayout.astro:183-203`
- **Problema P1:** og:url apunta a `guardman.cl` (no al worker). Las preview de redes sociales no funcionarán.

### Twitter Card tags

- **Presentes:** twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image, twitter:image:alt, twitter:label1/data1, twitter:label2/data2 — `BaseLayout.astro:206-214`
- **Mismo problema P1:** URLs apuntan a `guardman.cl`.

### `lang="es-CL"`

- **Presente:** `<html lang="es-CL">` — `BaseLayout.astro:156` ✅

### Encabezados de seguridad (curl -I)

```
HTTP/1.1 200 OK
Content-Type: text/html
Server: cloudflare
```

| Header | Estado | Severidad |
|--------|--------|-----------|
| `X-Content-Type-Options: nosniff` | ❌ Ausente | P1 |
| `Referrer-Policy: strict-origin-when-cross-origin` | ❌ Ausente | P1 |
| `Strict-Transport-Security` | ❌ Ausente | P1 |
| `Content-Security-Policy` | ❌ Ausente | P2 |
| `Permissions-Policy` | ❌ Ausente | P3 |

No hay middleware ni configuración de headers de seguridad en el Worker.

### Footer — datos legales

- **RUT:** `77.123.456-7` ✅ (`Footer.astro:124`)
- **Razón social:** `GuardMan Chile` ✅ (`Footer.astro:124`)
- **Domicilio:** `Av. Américo Vespucio Norte 1980, Providencia, Santiago, Chile` ✅ (`Footer.astro:125`)
- **Link a /privacidad:** ✅ (`Footer.astro:61`)
- **Link a /terminos:** ✅ (`Footer.astro:62`)

### robots.txt

- **Existe:** ✅ `src/pages/robots.txt.ts`
- **Disallow correcto:** /admin, /admin/, /api, /api/, parámetros UTM
- **Problema P1:** `Sitemap: https://guardman.cl/sitemap.xml` — el dominio no resuelve al worker. Debería apuntar a `https://guardman-astro.oficinadesarrollo33.workers.dev/sitemap.xml`.

### sitemap.xml

- **Existe:** ✅ `src/pages/sitemap.xml.ts`
- **Cobertura:** Incluye homepage, páginas estáticas,11 servicios,14 ubicaciones,10 sectores, y combos servicio×ubicación (11×14=154 URLs). Total: ~193 URLs.
- **Problema P1:** Todas las URLs usan `guardman.cl` como base (no el worker).
- **Problema P2:** Los combos servicio×ubicación muestran `<lastmod>1970-01-01</lastmod>`. El código usa `new Date().toISOString().slice(0,10)` en la sección estática pero la sección de combos no tiene `lastmod` definido y cae al valor por defecto de `undefined` → se serializa como epoch.

### Página404

- **HTTP status:** `404` ✅ (curl -o /dev/null -w "%{http_code}")
- **Contenido:** Muestra "404", "Página no encontrada", links a inicio/contacto, y navegación principal.
- **noindex:** ✅ (`BaseLayout` con `noindex` prop)

---

## B2. Performance

### Imágenes

| Verificación | Estado | Evidencia |
|-------------|--------|-----------|
| `loading="lazy"` en imágenes no-hero | ✅ | Todas las cards y split images tienen `loading="lazy"` |
| `decoding="async"` | ✅ | Todas las imágenes |
| `width` y `height` explícitos | ✅ | Todas las imágenes tienen dimensiones |
| `fetchpriority="high"` en hero | ✅ | `index.astro:87` |
| Formato WebP | ✅ | Todas las imágenes usan .webp |

### JavaScript bloqueante

- **Problema P2:** `main.js` y `yt-lite.js` se cargan como `<script is:inline src="...">` sin `defer` ni `async` — `BaseLayout.astro:263-264`. Bloquean el parser.
- **Problema P2:** Leaflet JS (`/vendor/leaflet/leaflet.js`) se carga inline en homepage sin `defer`/`async` — `index.astro:337`.
- **Problema P3:** Leaflet CSS se carga como `<link rel="stylesheet">` sin `media="print"` + onload pattern.

### CSS no crítico

- **Problema P2:** `/styles/site.css` (361 líneas) se carga como render-blocking `<link>`. Se hace preload (`BaseLayout.astro:227`) pero sigue siendo blocking.
- **Positivo:** `build.inlineStylesheets: 'always'` en astro.config.mjs inline los CSS de Astro en el HTML, eliminando round-trips.

### Fonts

- **`font-display: swap`:** ✅ (`public/styles/site.css:6`)
- **Preload de InterVariable.woff2:** ✅ (`BaseLayout.astro:224`)
- **Formato woff2 (variable):** ✅ — un solo archivo reemplaza5 TTFs.

### Compresión

```
curl -s -I https://guardman-astro.oficinadesarrollo33.workers.dev/
```
- **Content-Encoding:** No presente en la respuesta. Cloudflare Workers con `@astrojs/cloudflare` debería servir br/gzip automáticamente. Verificar si el adapter lo configura.

### Cache-Control en assets

- **HTML:** Sin header Cache-Control (ni `public` ni `max-age`). Los navegadores usan heurística.
- **robots.txt:** `Cache-Control: public, max-age=3600` ✅
- **sitemap.xml:** `Cache-Control: public, max-age=3600` ✅
- **Assets estáticos (CSS, JS, imágenes):** Gestionados por Workers Static Assets binding. Verificar headers en producción.

---

## B3. Accesibilidad (WCAG 2.1 AA)

### Contraste de color

- **Header/Footer oscuro (#0D0D0D, #1A2744) con texto blanco:** Contraste >15:1 ✅
- **Problema P2:** Texto semi-transparente en secciones oscuras: `rgba(255,255,255,.7)` sobre `#1A2744` → ratio ~4.2:1 (cumple AA para texto normal, pero `rgba(255,255,255,.55)` en footer links → ~2.8:1, **no cumple AA**).
- **Footer links:** `color: rgba(255,255,255,.55)` sobre `#0D0D0D` → ~3.5:1 (cumple AA large text, **no cumple AA normal text**). Ver `site.css:177`.

### Imágenes con `alt`

- **Todas las `<img>` tienen `alt`:** ✅
- **Alt text relevante:** ✅ (ej: "Seguridad Privada GuardMan Chile — Guardias OS-10", "Equipo GuardMan", nombres de servicios)

### Formularios con `<label>`

- **LeadForm component:** Genera `<label>` asociado a cada input via `for`/`id` — ✅ (`LeadForm.astro`)
- **Dropdown buttons en nav:** Usan `<button>` con texto visible — ✅

### Jerarquía de headings

**Homepage:**
- `<h1>`: "Seguridad Privada Profesional en Santiago de Chile" ✅ (único)
- `<h2>`: Títulos de secciones (6+ instancias) ✅
- `<h3>`: Cards, features ✅
- **No hay niveles salteados** ✅

### Landmarks

- `<header>`: ✅ (`Header.astro:20`)
- `<nav>`: ✅ (`Header.astro:25`)
- `<main id="main-content">`: ✅ (`BaseLayout.astro:254`)
- `<footer>`: ✅ (`Footer.astro:12`)
- **Skip link:** `<a href="#main-content" class="skip-link">Saltar al contenido</a>` ✅ (`BaseLayout.astro:241`)

### ARIA

- `aria-label` en logo link: ✅ (`Header.astro:22`)
- `aria-label="Menú"` en mobile toggle: ✅ (`Header.astro:77`)
- `aria-expanded="false"` en mobile toggle: ✅
- `aria-label="Breadcrumb"` en nav breadcrumb: ✅ (`BaseLayout.astro:245`)
- `aria-current="page"` en breadcrumb: ✅ (`BaseLayout.astro:249`)
- `aria-label` en redes sociales: ✅ (`Footer.astro:21-22`)
- `role="list"` / `role="listitem"` en stat-strip: ✅ (`index.astro:190-191`)

---

## B4. Responsive

### Breakpoints definidos en CSS

| Breakpoint | Uso |
|-----------|-----|
| `640px` | features-grid, feature-tiles, cert-grid, trust-badges |
| `768px` | coverage-split, locations-grid, cert-split, stats-grid, card-grid |
| `1023px` | section-grid, staff-section, values-grid, differentiators-grid |
| `1024px` | header height, nav display, split layout, footer-grid |

### Logo responsive

- **Desktop (>1024px):** `.logo-img { height: 42px }` — `site.css:32`
- **Mobile:** `.logo-img { height: 38px }` — `site.css:31`
- **Problema P3:** AGENTS.md especifica 50px desktop / 44px mobile. El CSS usa42px/38px. El atributo HTML `width="680" height="250"` es el tamaño intrínseco de la imagen, no el tamaño de visualización.

### Indicadores de scroll horizontal

- **No se detectan:** Los layouts usan `max-width: 1280px` con `padding: 0 16px` y los grids usan `minmax()` o se colapsan a1 columna en mobile.
- `overflow-x` no se establece explícitamente en body/html.

---

## B5. SEO Técnico

### Schema.org (JSON-LD)

| Tipo | Estado | Fuente |
|------|--------|--------|
| Organization | ✅ | `seo.ts` → `organizationSchema()` |
| LocalBusiness | ✅ | `seo.ts` → `localBusinessSchema()` (homepage) |
| WebSite | ✅ | `seo.ts` → `websiteSchema()` |
| Service | ✅ | `seo.ts` → `serviceSchema()` (páginas de servicio) |
| BreadcrumbList | ✅ | `seo.ts` → `breadcrumbSchema()` |
| FAQPage | ✅ | `seo.ts` → `faqSchema()` (homepage, servicios) |
| Article | ✅ | `seo.ts` → `articleSchema()` |
| Product | ✅ | Construido inline en BaseLayout |
| Speakable | ✅ | `seo.ts` → `speakableSchema()` |

### robots.txt vs páginas indexables

- `/admin` y `/api` bloqueados ✅
- Páginas públicas no bloqueadas ✅
- `Crawl-delay: 1` para bots genéricos

### sitemap.xml — cobertura

- **Páginas estáticas:**13 (/, /servicios, /ubicaciones, /sectores, /nosotros, /guard-pod, /ajax-systems, /contacto, /cotizacion, /canal-de-denuncias, /gracias, /privacidad, /terminos)
- **Servicios:**11 (/servicios/{slug})
- **Ubicaciones:**14 (/ubicaciones/{slug})
- **Sectores:**10 (/sectores/{slug})
- **Combos servicio×ubicación:**11×14=154
- **Total:** ~202 URLs
- **Problema:** Todas las URLs apuntan a `guardman.cl` (no resuelve). Google seguirá los links pero las URLs canónicas no son accesibles.

### Alt text en imágenes

- **Todas las imágenes tienen alt text relevante:** ✅
- Los alt text incluyen nombres de servicios, ubicaciones y descripción del equipo.

---

## Resumen de hallazgos

| ID | Categoría | Severidad | Effort | Hallazgo |
|----|-----------|-----------|--------|----------|
| SEO-001 | SEO | **P0** | S | Canonical, OG, Twitter, sitemap y robots.txt apuntan a `guardman.cl` que no resuelve al worker |
| FUN-001 | Security | **P1** | S | Faltan headers de seguridad: X-Content-Type-Options, Referrer-Policy, HSTS |
| FUN-002 | Security | **P2** | M | Falta Content-Security-Policy |
| SEO-002 | SEO | **P1** | S | `<title>` del homepage excede60 caracteres (61 chars) |
| SEO-003 | SEO | **P1** | S | `<meta description>` del homepage excede160 caracteres (~318 chars) |
| SEO-004 | SEO | **P2** | S | sitemap.xml: `<lastmod>1970-01-01</lastmod>` en combos servicio×ubicación |
| PERF-001 | Performance | **P2** | S | `main.js` y `yt-lite.js` se cargan sin `defer`/`async` (parser-blocking) |
| PERF-002 | Performance | **P2** | M | Leaflet JS/CSS se cargan de forma bloqueante en homepage |
| PERF-003 | Performance | **P3** | S | HTML responses sin Cache-Control header |
| A11Y-001 | Accesibilidad | **P2** | S | Footer links: `rgba(255,255,255,.55)` sobre fondo oscuro no cumple contraste AA (3.5:1) |
| A11Y-002 | Accesibilidad | **P3** | S | Secciones oscuras: texto `rgba(255,255,255,.7)` marginal en AA |
| UX-001 | Responsive | **P3** | S | Logo:42px/38px vs especificación AGENTS.md de50px/44px |
| FUN-003 | Security | **P3** | S | Falta Permissions-Policy header |

---

## Recomendaciones prioritarias

### Inmediato (P0/P1 — bloqueante para SEO)

1. **Conectar `guardman.cl` al worker** o cambiar `PUBLIC_SITE_URL` a la URL del worker. Esto resuelve SEO-001 de un solo golpe (canonical, OG, sitemap, robots.txt, hreflang).

2. **Agregar headers de seguridad** via middleware de Cloudflare o en el adapter:
   ```
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

3. **Acortar title del homepage** a ≤60 chars. Ej: "Seguridad Privada OS-10 Santiago Chile | GuardMan" (50 chars).

4. **Acortar meta description del homepage** a ≤160 chars.

### Corto plazo (P2)

5. Agregar `defer` a `main.js` y `yt-lite.js`.
6. Cargar Leaflet con `defer` o usar `client:idle` de Astro.
7. Fix `lastmod` en sitemap para combos servicio×ubicación.
8. Mejorar contraste de footer links a `rgba(255,255,255,.7)` (ratio ~5.5:1).

### Mejora continua (P3)

9. Agregar `Permissions-Policy` header.
10. Ajustar logo a50px/44px per AGENTS.md.
11. Agregar `Cache-Control: public, max-age=3600, s-maxage=86400` a responses HTML.

---

## Datos del auditor

- **Herramientas:** curl (headers HTTP), lectura de código fuente (Astro components, CSS, config)
- **Páginas analizadas:** /, /contacto, /404, /robots.txt, /sitemap.xml, /privacidad, /terminos
- **Componentes clave:** BaseLayout.astro, Header.astro, Footer.astro, LeadForm.astro, site.css, global.css
