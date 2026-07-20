# GuardMan Chile - Astro 6 v4.0.0 (Cloudflare Workers)

Migración 1:1 de `guardman-admin v1.0.0` (Cloudflare Worker monolítico + Vite/React SPA) a **Astro 6** desplegado en **Cloudflare Workers** (no Pages). Mantiene **todo** el contenido, el design system y la integración con el Worker API existente.

**v4.0.0 — Admin CRM-only + Copy/SEO/GEO optimizado para captura de leads.**

## Stack

- **Framework:** Astro 6 (SSR + adapter `@astrojs/cloudflare` en `mode: 'advanced'`, `output: 'server'`)
- **Hosting:** **Cloudflare Workers** (no Pages) - Worker con bindings completos
- **UI interactiva:** React 19 (islas con `client:only="react"`)
- **CSS:** Tailwind v4 + los 3 CSS vanilla del original (`site.css`, `dark.css`, `main.css`) preservados 1:1
- **Backend:** Worker API existente (no se toca D1, R2, KV, DO, Workflows)

## Deploy actual

- **Versión:** v4.0.0
- **Version ID:** `f07b3527-7771-41ca-8a01-60c7aafbdb14`
- **URL live:** https://guardman-astro.oficinadesarrollo33.workers.dev
- **Custom domain:** `guardman.cl` sigue en Google App Engine (no migrado)
- **Build:** server 18.6s · **Tests:** 27/27 · **Type check:** 0 errors

## Cambios v3.0.0 → v4.0.0 (resumen)

### Sitio público — restauración + mejora
- **3 componentes restaurados** (perdidos en el deploy v3.0.0-live): `HowItWorks`, `LeadCTA` (5 variantes), `TrustSignals`.
- **`index.astro` reescrito**: FAQPage schema integrado, hero con trust badges, 4 secciones adicionales de conversión (HowItWorks + LeadCTA inline + TrustSignals + LeadCTA footer).
- **Title home**: "GuardMan Chile | Seguridad Privada OS-10 en Santiago — Cotización en 24h".

### Admin — limpieza CRM-only
- **17 archivos eliminados** (no usados): CMSEditor, LazyCMS, MediaEditor, LazyMedia, CRMView, Clients, Quotes, Reports, Team (componentes) + clients, cms, crm, media, quotes, reports, team (páginas admin) + mocks.ts.
- **`ADMIN_NAV_GROUPS` reducido** a solo CRM (Dashboard, Bandeja, Pipeline, Todos los Leads).
- **`api.ts` simplificado** a `auth + crm + imageUrl` (eliminado namespaces `cms`/`media`).
- **Tests actualizados** (`api.test.ts`): reescrito de `cms.*` a `crm.leads.*`.

### SEO / GEO
- Sitemap crece 170 → 186 URLs.
- `/api/health` reporta `version: 4.0.0` + `crm-only-admin`, `lead-capture-optimized`.
- Fix: `BUNDLE_VERSION` v3.0.0 → v4.0.0 (stale string).

## Cambios v2.1.0 → v3.0.0 (resumen)

### Admin — CRM-first (núcleo del release)
- **9 componentes CRM nuevos** en `src/islands/crm/`: `Dashboard`, `Inbox`, `Pipeline`, `LeadsList`, `LeadDetail`, `Quotes`, `Reports`, `Clients`, `Team`
- **9 páginas admin nuevas** en `src/pages/admin/`: `dashboard`, `inbox`, `pipeline`, `leads`, `leads/[id]`, `quotes`, `clients`, `reports`, `team`
- **Data layer** completo en `src/lib/crm-data.ts` (834 LOC): `Lead`, `Activity`, `Task`, `Note`, `Communication`, `Quote`, `Client`, `User` con mock data realista
- **AdminLayout rediseñado**: grid shell + sidebar agrupado (CRM / Contenido / Inteligencia) + topbar con breadcrumbs, búsqueda global, notificaciones, user chip
- **CSS de admin expandido**: sistema `.panel`, `.kpi-card`, `.form-group`, `.data-table`, `.tabs`, `.pill`, `.admin-btn`, `.spinner`

### SEO / GEO ready
- **`src/lib/seo.ts`** nuevo (9 schemas): Organization, LocalBusiness (con aggregateRating + reviews), Service, ServiceArea, Place, BreadcrumbList, FAQPage, Article, WebSite (con SearchAction), Speakable
- **Sitemap expandido** de ~10 a **170 URLs**: home, 9 servicios, 14 ubicaciones, 7 sectores, 126 combos servicio × ubicación, con lastmod, priority, changefreq, hreflang alternates, image extensions
- **robots.txt v3**: bots específicos (Googlebot, Bingbot, Slurp, DuckDuckBot, Baiduspider), Disallow /admin + /api + tracking params, bloqueo de scrapers (Semrush, Ahrefs, DotBot, MJ12bot)
- **Hreflang multi-región** inyectado en todas las páginas públicas (es-cl / es / es-419 / x-default)
- **Geo meta tags**: `geo.region`, `geo.placename`, `geo.position`, `ICBM`

### Linking interno
- **`src/components/RelatedLinks.astro`** nuevo: cluster de links relacionados (variantes `servicios | ubicaciones | sectores | servicio | ubicacion | sector`)
- **`src/components/Icon.astro`** nuevo: punto único para todos los SVG iconos del sitio público

### Páginas públicas — nuevas
- `src/pages/servicios/[slug].astro` — landing por servicio
- `src/pages/servicios/[service]/[location].astro` — combos servicio × ubicación (126 páginas)
- `src/pages/sectores/[slug].astro` — landing por sector
- `src/pages/ubicaciones/[slug].astro` — landing por ubicación con mapa Leaflet

### PWA
- `public/site.webmanifest` — manifest PWA

### Estilos — overhaul
- `src/styles/global.css`: 14KB → 37KB (tokens dark, sistema de admin completo, clusters de linking)
- `src/components/Footer.astro`: rediseñado (+4.5KB)
- `src/lib/constants.ts`: +2.8KB (ADMIN_NAV_GROUPS, SERVICE_DESCRIPTIONS, ZONE_CONTEXT, HREFLANG, GEO)
- `src/lib/icons.ts`: +2.8KB (más iconos admin)

### Fix aplicado
- `src/pages/admin/leads/[id].astro`: migrado de `getStaticPaths` (modo static, no soportado) a `Astro.params.id` (correcto para `output: 'server'`) + redirect a `/admin/leads` cuando el ID no existe

## Estructura

```
guardman-astro/
├── STATUS.md                  # Snapshot único actualizado al último deploy
├── CHANGELOG.md               # Historial de versiones
├── PLAN_DE_TRABAJO.md         # Plan ejecutado v3.0.0 + pendiente v3.1
├── AUDITORIA_POST_PLAN.md     # Estado final del deploy v3.0.0
├── PROMPT_CA.md               # Brief para Coding Agent (próximas tareas v3.1+)
├── AUDITORA_FORENSE.md        # Auditoría original consolidada
├── AUDITORIA_COMPLETA.md      # Auditoría completa
├── README.md                  # Este archivo
├── astro.config.mjs           # Astro + Cloudflare Workers (output: 'server')
├── tsconfig.json
├── package.json               # v3.0.0
├── wrangler.jsonc             # Worker config (no Pages)
├── env.d.ts
├── .env.example
├── .env.production
├── public/
│   ├── favicon.svg / .ico
│   ├── site.webmanifest       # PWA
│   ├── fonts/inter-*.ttf      # Inter (5 pesos)
│   ├── styles/                # CSS vanilla originales preservados 1:1
│   │   ├── site.css           # 318 líneas - design system público
│   │   ├── dark.css           # 78 líneas - override para Guard Pod / Ajax
│   │   └── main.css           # 155 líneas - legacy
│   ├── scripts/
│   │   ├── main.js            # JS vanilla del original
│   │   └── admin-auth-guard.js # Auth redirect si no hay token
│   ├── _headers               # Cloudflare cache rules
│   ├── _redirects
│   └── images/                # WebP, OG, sectores
├── src/
│   ├── styles/global.css      # Tailwind v4 + admin shell (37KB)
│   ├── lib/
│   │   ├── constants.ts       # SITE, servicios, ubicaciones, sectores, ADMIN_NAV_GROUPS, ZONE_CONTEXT, HREFLANG, GEO
│   │   ├── api.ts             # Cliente HTTP unificado
│   │   ├── auth.ts            # JWT con access + refresh token
│   │   ├── crm-data.ts        # ⭐ NUEVO v3.0 — Data layer CRM completo
│   │   ├── seo.ts             # ⭐ NUEVO v3.0 — Helpers Schema.org + GEO + hreflang
│   │   ├── content.ts         # Contenido del sitio
│   │   ├── icons.ts           # ICONS + SERVICE_ICONS + SECTOR_ICONS
│   │   ├── validation.ts      # Validación forms
│   │   └── mocks.ts           # Mocks CRM legacy
│   ├── types/index.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Shell público (Header + Footer + main.js)
│   │   └── AdminLayout.astro  # ⭐ REDISEÑADO v3.0 — Grid shell + sidebar + topbar
│   ├── components/
│   │   ├── Header.astro       # Dropdowns Servicios/Ubicaciones/Sectores
│   │   ├── Footer.astro       # ⭐ REDISEÑADO v3.0
│   │   ├── CoverageMap.astro  # Mapa Leaflet reutilizable
│   │   ├── Icon.astro         # ⭐ NUEVO v3.0
│   │   ├── RelatedLinks.astro # ⭐ NUEVO v3.0 — Cluster de links SEO interno
│   │   ├── Analytics.astro
│   │   └── admin/
│   │       ├── AdminSidebar.astro  # ⭐ REDISEÑADO v3.0 — CRM-first agrupado
│   │       └── AdminTopbar.astro   # ⭐ REDISEÑADO v3.0 — Breadcrumbs + búsqueda + notif + user
│   ├── islands/               # React (client:only)
│   │   ├── cms/CMSEditor.tsx
│   │   ├── media/MediaEditor.tsx
│   │   ├── media/LazyMedia.tsx
│   │   ├── intel/IntelView.tsx
│   │   ├── brand/BrandEditor.tsx
│   │   ├── chat/ChatView.tsx
│   │   └── crm/               # ⭐ NUEVO v3.0 — 9 componentes CRM
│   │       ├── Dashboard.tsx
│   │       ├── Inbox.tsx
│   │       ├── Pipeline.tsx
│   │       ├── LeadsList.tsx
│   │       ├── LeadDetail.tsx
│   │       ├── Quotes.tsx
│   │       ├── Reports.tsx
│   │       ├── Clients.tsx
│   │       └── Team.tsx
│   └── pages/
│       ├── index.astro
│       ├── nosotros.astro
│       ├── guard-pod.astro    # Dark theme
│       ├── ajax-systems.astro # Dark theme
│       ├── contacto.astro     # Form que POST a /api/crm/leads/capture
│       ├── cotizacion.astro
│       ├── gracias.astro
│       ├── privacidad.astro
│       ├── terminos.astro
│       ├── 404.astro
│       ├── robots.txt.ts      # ⭐ ACTUALIZADO v3.0
│       ├── sitemap.xml.ts     # ⭐ ACTUALIZADO v3.0 (170 URLs)
│       ├── api/health.ts      # ⭐ Devuelve version + features en JSON
│       ├── servicios/
│       │   ├── index.astro
│       │   ├── [slug].astro           # ⭐ NUEVO v3.0
│       │   └── [service]/
│       │       └── [location].astro   # ⭐ NUEVO v3.0 — 126 combos
│       ├── ubicaciones/
│       │   ├── index.astro
│       │   └── [slug].astro           # ⭐ NUEVO v3.0
│       ├── sectores/
│       │   ├── index.astro
│       │   └── [slug].astro           # ⭐ NUEVO v3.0
│       └── admin/
│           ├── login.astro
│           ├── index.astro    # Dashboard
│           ├── clients.astro  # ⭐ NUEVO v3.0
│           ├── crm.astro
│           ├── cms.astro      # ⭐ NUEVO v3.0
│           ├── inbox.astro    # ⭐ NUEVO v3.0
│           ├── leads.astro    # ⭐ NUEVO v3.0
│           ├── leads/[id].astro # ⭐ NUEVO v3.0 (SSR con Astro.params.id)
│           ├── pipeline.astro # ⭐ NUEVO v3.0
│           ├── quotes.astro   # ⭐ NUEVO v3.0
│           ├── reports.astro  # ⭐ NUEVO v3.0
│           ├── team.astro     # ⭐ NUEVO v3.0
│           ├── media.astro
│           └── settings.astro
├── tests/
│   ├── api.test.ts
│   ├── auth.test.ts
│   ├── constants.test.ts
│   ├── validation.test.ts
│   └── e2e/
│       ├── public.spec.ts
│       └── admin.spec.ts
└── scripts/
    └── lighthouse-audit.mjs
```

## Comandos

```bash
npm run dev         # Desarrollo local
npm run build       # Build producción (~37s)
npm run check       # Type checking
npm run test        # Vitest (27 tests, ~600ms)
npm run test:e2e    # Playwright E2E
npm run preview     # Preview con Wrangler
npm run deploy      # astro build && wrangler deploy
npm run lighthouse  # Auditoría Lighthouse
```

## Variables de Entorno

```bash
# .env (desarrollo local)
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=http://localhost:4321

# .env.production / wrangler.jsonc vars
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=https://guardman.cl
```

## Bindings Cloudflare (verificados en deploy)

- `env.SESSION` (KV Namespace)
- `env.IMAGES` (Images binding)
- `env.ASSETS` (Assets)
- `env.PUBLIC_API_URL` = `https://guardman.oficinadesarrollo33.workers.dev`
- `env.PUBLIC_SITE_URL` = `https://guardman.cl`

## Smoke test post-deploy v3.0.0

| Endpoint | HTTP | Size | Notas |
|---|---|---|---|
| `/` | 200 | 68KB | Homepage con 43 schemas JSON-LD |
| `/servicios/guardias-de-seguridad/` | 200 | 51KB | Service + BreadcrumbList + FAQ |
| `/ubicaciones/las-condes/` | 200 | 49KB | ServiceArea + Place + BreadcrumbList |
| `/sectores/residencial/` | 200 | 47KB | 42 schemas |
| `/servicios/guardias-de-seguridad/las-condes/` | 200 | 54KB | Combo servicio×ubicación (60 schemas) |
| `/guard-pod` | 200 | 43KB | Dark theme |
| `/ajax-systems` | 200 | 43KB | Dark theme |
| `/admin` | 200 | 14KB | Shell dark + sidebar CRM-first |
| `/admin/leads/L001` | 200 | 14KB | Lead 360° (timeline + tasks + notes) |
| `/admin/leads/L999` | 200 redirect | - | → /admin/leads (ID no existe) |
| `/sitemap.xml` | 200 | 108KB | 170 URLs |
| `/robots.txt` | 200 | 758B | v3.0 con bots específicos + Sitemap |
| `/api/health` | 200 | 126B | `{"ok":true, "version":"3.0.0"}` |

## Pendiente para v3.1+

- [ ] Decisión sobre custom domain: ¿migrar `guardman.cl` a Cloudflare Workers?
- [ ] Ejecutar Playwright E2E suite completo
- [ ] Lighthouse audit en homepage + servicio + ubicación
- [ ] Verificar que las páginas admin nuevas tienen `<title>` único
- [ ] Backend Worker `guardman.oficinadesarrollo33.workers.dev` — endpoints CRM (leads, clients, quotes)
- [ ] Evaluar migración a D1 si los mocks se quedan

## Docs relacionados

- `STATUS.md` — Snapshot único actualizado al último deploy
- `CHANGELOG.md` — Historial de versiones detallado
- `PLAN_DE_TRABAJO.md` — Plan ejecutado + pendiente
- `AUDITORIA_POST_PLAN.md` — Estado final del deploy con métricas
- `PROMPT_CA.md` — Brief para Coding Agent en próximas tareas
