# Changelog — GuardMan Chile

Todas las versiones relevantes del proyecto. Formato basado en [Keep a Changelog](https://keepachangelog.com/).

## [5.2.0] — 2026-07-17

### Resumen
Normalización profunda de layouts Astro, unificación del sistema de diseño Guardman, reescritura del copy en español neutro y reforzamiento del producto exclusivo Guardpod como diferenciador competitivo. Conserva intactos orden de secciones, estructura, imágenes y colores de fondo del v5.1.

### Layouts (Task 1)
- `BaseLayout.astro` v5.2: título sin separadores `|` o `-` (concatenación natural con espacio).
- Creado `src/components/Section.astro`: wrapper estandarizado con `variant`, `padding`, `container` props. Reemplaza los `<section style="padding:…;background:…">` inline.
- Creado `src/components/PageHero.astro`: hero estandarizado con variantes `light | dark | split | detail | compact`.

### Sistema de diseño (Task 2)
- `src/styles/design-tokens.css` extendido con alias legacy (`--primary`, `--accent`, `--muted`, `--border`, `--bg`, `--surface`, `--radius-*`, `--shadow-*`, `--font`, `--surface-0..3`, `--color-navy*`, `--color-fg*`, etc.) mapeados al namespace `--gm-*`. Toda regla CSS existente sigue funcionando sin tocar `public/styles/site.css` ni `dark.css`.
- Añadidas constantes de layout: `--gm-container`, `--gm-container-narrow`, `--gm-section-pad-y*`.
- Añadidas clases utilitarias `.gm-section`, `.gm-section--{white,neutral,dark,navy,transparent}`, `.gm-section--pad-{sm,md,lg,none}`, `.gm-hero`, `.gm-hero--{light,dark,split,detail,compact}`, `.gm-trust-row` y refinamiento de `.btn` con tokens.

### Copy + SEO (Task 3)
- **Títulos sin `|` ni `-`** en todas las páginas públicas. Verificado en 145+ rutas prerenderizadas (hubs, detalles, combos servicio×ubicación).
- Subtítulos y descripciones meta reescritos para ser únicos por página (sin repetir "Solicitar Cotización Gratis", "200+ clientes", "8+ años" como boilerplate).
- **Español neutro** formal con `usted` en todo el sitio público (B2B Chile). Eliminado el `tú` informal de páginas como `/contacto`, `/cotizacion`, `/canal-de-denuncias`, `/gracias`, `/404`, componentes `HowItWorks`, `TrustSignals`, `LeadCTA`, `StaffSection`.
- `heroTitle` de los 10 sectores en `content.ts` reescritos sin ` - GuardMan Chile`.
- Marca normalizada: `Guard Pod` / `GuardPod` → `Guardpod` en `SERVICE_NAMES`, `NAV_LINKS`, footer, header y 30+ menciones en `content.ts`.
- `centro de monitoreo` → `central de monitoreo propia` (terminología unificada).

### Guardpod reforzado (Task 4)
- Homepage: hero destaca a Guardpod como tecnología exclusiva; split section dedicada con pitch completo de diferenciación.
- `/guard-pod`: hero, intro y FAQ reescritos enfatizando "única en el mercado chileno", "desarrollada y operada por GuardMan", "15 meses de I+D", "60% de reducción de costos".
- `/nosotros`: primer diferenciador es Guardpod con descripción de capacidades.
- `/ajax-systems`: intro menciona Guardpod como complemento para perímetros extensos.
- `/servicios/[slug]`: intro de cada servicio menciona Guardpod para zonas sin infraestructura.
- `/ubicaciones/[slug]`: hero menciona Guardpod para faenas y terrenos.
- `/sectores/[slug]`: servicio recomendado lista Guardpod entre complementos.
- `/cotizacion`: hero trusts mencionan "unidad autónoma Guardpod".

### Build
- `npx astro check`: 3 errores, todos pre-existentes en v5.1 (`LeadForm.astro` typing). 0 errores nuevos introducidos.
- `npm run build`: SUCCESS. 145+ páginas prerenderizadas generadas correctamente.

### Bump
- `package.json` `version`: `5.1.0` → `5.2.0`.
- `src/lib/constants.ts` `BUNDLE_VERSION`: `'v5.1.0'` → `'v5.2.0'`.

## [5.1.0] — 2026-07-16

### Resumen
Snapshot v5.1 base: layouts Astro + componentes Guardman + Canal de Denuncias v4.1 ya migrado a componentes reutilizables. Línea base sobre la cual se construye v5.2 (normalización de layouts, design system unificado, copy en español neutro y refuerzo de Guardpod).

### Cambios
- `package.json` `version`: `4.1.0` → `4.5.0`.
- `src/lib/constants.ts` `BUNDLE_VERSION`: `'v4.1.0'` → `'v4.5.0'`.
- `src/pages/api/health.ts` `version`: `'4.1.0'` → `'4.5.0'`.
- `STATUS.md` versión actual: `v4.1.0` → `v4.5.0` (snapshot, sin deploy todavía).
- Sin cambios funcionales de código — el código es el acumulado al cierre de la sesión 2026-07-15 (Canal de Denuncias v4.1 + restauraciones v4.0).

### Pendiente
- Confirmar si el bump requiere re-deploy del worker o si se mantiene v4.1.0 en producción hasta nuevo sprint.
- Resolver el custom domain `guardman.cl` (sigue en Google App Engine, fuera del scope de este tarball).

## [4.1.0] — 2026-07-15

### Resumen
Implementación del **Canal de Denuncias anónimo** inspirado en `https://www.guardman.cl/canal-de-denuncias` (sitio de Google Sites legacy). Nuevo endpoint POST público + D1 binding + tabla `denuncias` con 18 columnas + 4 índices + página pública con FAQ + banda amarilla destacada en el footer + link con punto rojo en el header.

### D1 + persistencia
- **D1 binding activado**: `guardman-v2-db` (`fd1871a2-77a4-42ca-8b07-de283ff70bab`) en `wrangler.jsonc` con `migrations_dir: "migrations"`.
- **Nueva tabla `denuncias`** (vía `migrations/0001_create_denuncias.sql`):
  - `id` (PK, formato `D-YYYYMMDD-XXXX` para tracking público)
  - `categoria`, `categoria_otro`, `relacion`, `fecha_incidente`, `lugar`, `personas_involucradas`
  - `descripcion` (TEXT NOT NULL, 30–5000 chars)
  - `tiene_evidencia` (si/no/desconocido)
  - `nombre`, `email`, `telefono` (todos NULL = denuncia anónima)
  - `ip_hash` (SHA-256(ip+salt), auditoría anti-spam; no identifica al usuario)
  - `user_agent`, `referer`, `status`, `assigned_to`, `admin_notes`, `created_at`, `updated_at`
  - 4 índices: `status`, `categoria`, `created_at DESC`, `ip_hash`.
- Migración aplicada con `wrangler d1 execute guardman-v2-db --remote --file=./migrations/0001_create_denuncias.sql` (5 queries, 7 rows written).

### API
- **`POST /api/denuncias`** — público, valida con `validateDenuncia()`, inserta en D1, anti-spam (máx 5/IP-hash/24h), responde `{ok:true, id:'D-...', message, contacto}`. CORS restrictivo a `guardman.cl` + dev.
- **`GET /api/denuncias`** — admin, requiere `?admin_token=...` o header `x-admin-token: v41-denu-2026`. Lista con `?status=...` y `?limit=N` (default 50, max 200).

### Sitio público
- **`src/pages/canal-de-denuncias.astro`** (página completa, 26KB):
  - Hero dark con badge "Canal oficial · Ley 20.393" + trust badges (100% anónimo, sin represalias, 72h revisión).
  - Sección "Compromiso ético" (3 cards: anonimato, cumplimiento legal, zero represalias) con iconos.
  - Formulario completo en 3 secciones:
    1. Tipo de denuncia: categoría (7 opciones) + campo condicional "Especifica" si es "otro" + relación con GuardMan.
    2. Sobre el hecho: fecha (max=hoy), lugar, personas involucradas, descripción (con contador 0/5000 + min 30), radio pills de evidencia.
    3. Datos de contacto (opcional): nombre, email, teléfono.
  - Aceptación de términos (checkbox + link a `/terminos`).
  - Panel de éxito con **ID de seguimiento copiable** (guarda en `localStorage` también).
  - "Cómo funciona" (3 pasos numerados).
  - FAQ con 6 preguntas (incluye FAQPage schema en el head).
  - CTA final con teléfono y email.
  - Validación client-side con `validateDenuncia()`.
  - Mantiene 100% el sistema de diseño (form-card, form-row, form-group, btn-primary, hero, bg-dark, etc.).
- **Banda amarilla destacada en el footer** (`src/components/Footer.astro`):
  - Fondo gradiente `#FBBF24 → #F59E0B` con borde `#B45309`.
  - Badge "100% anónimo" + texto "¿Viste algo que no está bien?" + CTA negro "Canal de Denuncias →".
  - Responsive: en mobile se apila vertical con texto centrado.
- **Link amarillo en columna "Empresa" del footer** (`footer-link-denuncia` class).
- **Link en el header con punto rojo pulsante** (`nav-link-denuncia` + `nav-dot` con animación `nav-dot-pulse 2.4s`).
- **Sitemap**: `src/pages/sitemap.xml.ts` agrega `/canal-de-denuncias` (priority 0.7, monthly, lastmod=today).
- **NavLinks**: `constants.ts` agrega "Canal de Denuncias" en `NAV_LINKS`.

### Constants
- `DENUNCIA_PATH = '/canal-de-denuncias'`
- `DENUNCIA_CATEGORIES` (7 slugs: codigo_conducta, delito, acoso, seguridad, otro)
- `DENUNCIA_RELACIONES` (5 slugs: trabajador, cliente, proveedor, externo, anonimo)
- `BUNDLE_VERSION = 'v4.1.0'`

### Versions
- `package.json` v4.0.0 → v4.1.0
- `wrangler.jsonc` agrega `d1_databases[]` con binding `DB`
- `/api/health` v4.0.0 → v4.1.0, features incluye `canal-denuncias-anonimo`, `d1-bound`

### Pendiente v4.2+
- Panel admin `/admin/denuncias` para revisar/gestionar denuncias (UI).
- Endpoint público `GET /api/denuncias/:id/status?token=...` para que el denunciante consulte el estado con su ID.
- Notificación por email al equipo de cumplimiento cuando llega una denuncia nueva.
- Mover `ADMIN_TOKEN` a `wrangler secret put` (ahora es hardcoded para dev).

## [4.0.0] — 2026-07-13

### Resumen
Refactor del admin a **CRM-only** (eliminación de CMS/Media/Clients/Quotes/Reports/Team no usados) + **restauración y mejora del sitio público** con componentes de conversión (HowItWorks, LeadCTA, TrustSignals) + **copy/SEO/GEO optimizado para captura de leads** en el home.

### Sitio público — restauración + mejora
- **3 componentes públicos restaurados** (que el deploy v3.0.0-live había perdido):
  - `src/components/HowItWorks.astro` — bloque "Cómo funciona" en 3 pasos con CTA.
  - `src/components/LeadCTA.astro` — componente reutilizable de CTA con 5 variantes (hero / inline / dark / footer / sticky).
  - `src/components/TrustSignals.astro` — bloque de señales de confianza (stats, certificaciones, testimonios, FAQ).
- **`src/pages/index.astro` reescrito** (364 → 409 líneas):
  - Title: "GuardMan Chile | Seguridad Privada OS-10 en Santiago — Cotización en 24h".
  - Description enriquecida con keywords de conversión (Cotización gratis en 24h, 14 comunas, etc.).
  - **FAQ schema** integrado (`faq={[...4 preguntas]}`).
  - Hero con trust badges (Cotización en 24h, Sin compromiso, Guardias OS-10, Cobertura 14 comunas).
  - Hero CTAs con teléfono (`tel:+56930000010`).
  - Sección `<HowItWorks />` (3 pasos numerados).
  - `<LeadCTA variant="inline" />` después de nosotros.
  - `<TrustSignals />` antes de clientes.
  - `<LeadCTA variant="footer" />` al cierre.

### Admin — limpieza CRM-only
- **17 archivos eliminados** (no usados en producción):
  - Componentes admin: `CMSEditor`, `LazyCMS`, `MediaEditor`, `LazyMedia`, `CRMView`, `Clients`, `Quotes`, `Reports`, `Team`.
  - Páginas admin: `clients.astro`, `cms.astro`, `crm.astro`, `media.astro`, `quotes.astro`, `reports.astro`, `team.astro`.
  - Lib: `mocks.ts`.
- **`ADMIN_NAV_GROUPS` reducido** a solo CRM: `Dashboard`, `Bandeja de Leads`, `Pipeline`, `Todos los Leads`. El grupo "Contenido" e "Inteligencia" se eliminan del sidebar.
- **`src/lib/api.ts` simplificado** a solo:
  - `auth` (login/logout/refresh).
  - `crm` (dashboard, pipeline, leads.{list,get,create,update,delete,capture}).
  - `imageUrl`.
  - Helper genérico `unwrapResponse()` para cualquier envelope del backend.
  - Eliminado: `cms`, `media`, `clients`, `proposals` namespaces.
- **Tests actualizados** (`tests/api.test.ts`): el suite usaba `cms.get('service', ...)`. Reescrito para usar `crm.leads.get(id)` / `crm.leads.list()`. 27/27 tests pasando.

### SEO / GEO
- **Sitemap crece** de 170 → 186 URLs (servicios × ubicaciones + páginas legales).
- **`/api/health` reporta `version: 4.0.0`** y features: `crm-only-admin`, `lead-capture-optimized`, `seo-geo-ready`, `hreflang`, `structured-data`.
- **Fix**: `BUNDLE_VERSION` en `src/lib/constants.ts` corregido de `v3.0.0` → `v4.0.0` (era un stale string).
- SEO/GEO schemas, hreflang, geo meta tags, sitemap, robots: **sin cambios** (la base v3.0 se mantiene).

### Stack — sin cambios
- Astro 6 (`output: 'server'`) + React 19 + Tailwind v4 + Cloudflare Workers.
- Cloudflare bindings: `env.SESSION` (KV), `env.IMAGES` (Images), `env.ASSETS` (Assets).
- Worker version: `f07b3527-7771-41ca-8a01-60c7aafbdb14`.

### Verificación post-deploy
- `npm run check`: 0 errors, 0 warnings, 2 hints (cosméticos)
- `npm test`: 27/27 OK (4 archivos: api, auth, constants, validation)
- `npm run build`: ~18.6s server + 184 assets, gzip 298.34 KiB
- `npm run deploy`: 9.81s
- **Smoke test** (15 URLs públicas + 8 admin + 2 SEO):
  - 15/15 páginas públicas: 200, contenido válido, JSON-LD presente
  - 7/7 admin pages activas: 200 (`/admin`, `/login`, `/inbox`, `/leads`, `/leads/L001`, `/pipeline`, `/settings`)
  - 3/3 admin pages eliminadas: 404 (`/admin/clients`, `/admin/cms`, `/admin/team`)
  - `/sitemap.xml`: 200, 186 URLs, 118KB
  - `/robots.txt`: 200, 755 bytes
  - `/api/health`: 200, `version: 4.0.0`
- Custom domain `guardman.cl`: **sigue apuntando a Google App Engine (Server: ESF), NO al worker `guardman-astro`**. Pendiente decisión de Kammler sobre migración DNS.

---

## [3.0.0] — 2026-07-13

### Resumen
Refactorización mayor del admin (CRM-first) + overhaul del sistema de estilos + SEO/GEO ready + linking interno mejorado. El sitio público crece de ~10 a ~170 URLs indexadas con structured data enriquecido.

### Admin — CRM-first
- **9 componentes CRM nuevos**: `Clients`, `Dashboard`, `Inbox`, `LeadDetail`, `LeadsList`, `Pipeline`, `Quotes`, `Reports`, `Team` (en `src/islands/crm/`).
- **9 páginas admin nuevas**: `/admin/clients`, `/admin/cms`, `/admin/inbox`, `/admin/leads`, `/admin/leads/[id]` (SSR), `/admin/pipeline`, `/admin/quotes`, `/admin/reports`, `/admin/team`.
- **AdminLayout rediseñado** con grid shell + sidebar agrupado (CRM / Contenido / Inteligencia) + topbar con breadcrumbs, búsqueda global, notificaciones y user chip.
- **Data layer completo** en `src/lib/crm-data.ts` (834 LOC): `Lead`, `Activity`, `Task`, `Note`, `Communication`, `Quote`, `Client`, `User`, mock data realista, helpers (`formatCLP`, `relativeTime`, `leadTimeline`, etc.).
- **Fix**: `src/pages/admin/leads/[id].astro` migrado de `getStaticPaths` (modo static) a `Astro.params.id` (modo SSR correcto del proyecto). Redirect a `/admin/leads` cuando el ID no existe.

### SEO / GEO
- **`src/lib/seo.ts`** nuevo: helpers para `Organization`, `LocalBusiness` (con `aggregateRating` + reviews), `Service`, `ServiceArea`, `Place`, `BreadcrumbList`, `FAQPage`, `Article`, `WebSite` (con `SearchAction`), `Speakable`, geo meta tags, hreflang multi-región (es-cl / es / es-419 / x-default), `contentCluster`.
- **Sitemap expandido** (`src/pages/sitemap.xml.ts`): de ~10 a 170 URLs. Incluye home, 9 servicios, 14 ubicaciones, 7 sectores, 126 combos servicio × ubicación, lastmod, priority, changefreq, hreflang alternates, image extensions.
- **robots.txt v3** (`src/pages/robots.txt.ts`): bots específicos (Googlebot, Bingbot, Slurp, DuckDuckBot, Baiduspider), Disallow /admin + /api + tracking params, bloqueo de scrapers (Semrush, Ahrefs, DotBot, MJ12bot), Sitemap declarado.
- **Hreflang** inyectado en todas las páginas públicas.

### Linking interno
- **`src/components/RelatedLinks.astro`** nuevo: cluster de links relacionados (servicios, ubicaciones, sectores) para SEO interno. Variantes `servicios | ubicaciones | sectores | servicio | ubicacion | sector`.
- **`src/components/Icon.astro`** nuevo: punto único de uso para todos los SVG iconos del sitio público.

### Páginas públicas — nuevas
- `src/pages/servicios/[slug].astro` — landing por servicio.
- `src/pages/servicios/[service]/[location].astro` — combos servicio × ubicación (126 páginas generadas).
- `src/pages/sectores/[slug].astro` — landing por sector.
- `src/pages/ubicaciones/[slug].astro` — landing por ubicación con mapa Leaflet.

### PWA
- `public/site.webmanifest` — manifest para PWA.

### Estilos
- **`src/styles/global.css`** crece de 14KB a 37KB: tokens dark, sistema completo `.panel`, `.kpi-card`, `.form-group`, `.data-table`, `.tabs`, `.pill`, `.admin-btn`, `.spinner`, `.related-cluster`, `.cluster-card`, animaciones.
- **`src/components/Footer.astro`** rediseñado (+4.5KB).
- **`src/lib/constants.ts`** expandido (+2.8KB): `ADMIN_NAV_GROUPS`, `SERVICE_DESCRIPTIONS`, `ZONE_CONTEXT`, `HREFLANG`, `GEO`, etc.
- **`src/lib/icons.ts`** expandido (+2.8KB): más iconos para admin.

### Backend / Deploy
- Cloudflare binding `IMAGES` (Images) ahora en uso.
- Worker version 3.0.0 reportando en `/api/health`: `crm-first-admin`, `lead-360`, `seo-geo-ready`, `hreflang`, `structured-data`.

### Verificación post-deploy
- `npm run build`: OK (37.48s)
- `npm test`: 27/27 OK
- `npm run check`: 0 errors, 0 warnings, 2 hints (cosméticos)
- Smoke test: 17 URLs verificadas, todas 200 con contenido válido y structured data enriquecido
- Custom domain `guardman.cl`: **sigue apuntando a Google App Engine (Server: ESF), NO al worker `guardman-astro`**. Pendiente decisión de Kammler sobre migración DNS.

---

## [2.1.0] — 2026-07-13

Migración 1:1 de `guardman-admin v1.0.0` (Cloudflare Worker monolítico + Vite/React SPA) a **Astro 6** desplegado en **Cloudflare Workers**.

### Highlights
- Astro 6 SSR + adapter `@astrojs/cloudflare` en `mode: 'advanced'`
- React 19 con islas `client:only="react"`
- Tailwind v4 + 3 CSS vanilla del original preservados 1:1 (`site.css`, `dark.css`, `main.css`)
- 6 admin pages: `login`, `index`, `crm`, `media`, `intel`, `brand`, `chat`
- 27 unit tests (api, auth, constants, validation)
- E2E tests con Playwright configurados
- CI/CD con GitHub Actions
- JWT con refresh token + rate limiting client-side
- Schema.org Organization + LocalBusiness + sitemap básico

Ver `AUDITORIA_POST_PLAN.md` v2.1.0 para detalle completo de las 26 tareas ejecutadas.
