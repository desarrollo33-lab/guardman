# Fase A — Inventario y Mapa

> **GuardMan Chile** · Astro 6 SSR + Cloudflare Workers  
> Auditoría técnica · Generado: 2026-08-13

---

## 1. Rutas Públicas

| # | Path Pattern | HTTP | Render | Auth | Propósito |
|---|---|---|---|---|---|
| 1 | `/` | GET | SSR | No | Homepage: hero, servicios, clientes, stats, CTA |
| 2 | `/servicios` | GET | SSR | No | Índice de servicios (11 servicios listados) |
| 3 | `/servicios/[slug]` | GET | SSR | No | Detalle de servicio (guardias, cctv, accesos, etc.) |
| 4 | `/servicios/[service]/[location]` | GET | SSR | No | Página combo servicio + ubicación (SEO long-tail) |
| 5 | `/ubicaciones` | GET | SSR | No | Índice de ubicaciones (14 comunas) |
| 6 | `/ubicaciones/[slug]` | GET | SSR | No | Detalle de comuna con features, FAQs, mapa |
| 7 | `/sectores` | GET | SSR | No | Índice de sectores industriales (10 sectores) |
| 8 | `/sectores/[slug]` | GET | SSR | No | Detalle de sector (residencial, comercial, etc.) |
| 9 | `/guard-pod` | GET | SSR | No | Landing Guardpod (vigilancia autónoma PTZ + IA) |
| 10 | `/ajax-systems` | GET | SSR | No | Landing Ajax Systems (alarmas, instalador oficial) |
| 11 | `/nosotros` | GET | SSR | No | Página institucional: historia, valores, equipo |
| 12 | `/contacto` | GET | SSR | No | Formulario de contacto (captura lead → CRM) |
| 13 | `/cotizacion` | GET | SSR | No | Formulario de cotización (captura lead → CRM) |
| 14 | `/canal-de-denuncias` | GET | SSR | No | Formulario anónimo de denuncias (Ley 20.393) |
| 15 | `/canal-de-denuncias/estado/[id]` | GET | SSR | No | Consulta pública de estado de denuncia por tracking ID |
| 16 | `/gracias` | GET | SSR | No | Página de confirmación post-formulario |
| 17 | `/terminos` | GET | SSR | No | Términos y condiciones |
| 18 | `/privacidad` | GET | SSR | No | Política de privacidad |
| 19 | `/404` | GET | SSR | No | Página de error 404 |
| 20 | `/robots.txt` | GET | SSR (TS) | No | Genera robots.txt dinámico |
| 21 | `/sitemap.xml` | GET | SSR (TS) | No | Genera sitemap.xml dinámico |

### API Endpoints Públicos

| # | Path Pattern | HTTP | Auth | Propósito |
|---|---|---|---|---|
| 1 | `/api/health` | GET | No | Healthcheck del servicio |
| 2 | `/api/health` | OPTIONS | No | CORS preflight |
| 3 | `/api/denuncias` | POST | No | Crear denuncia anónima (validación + D1) |
| 4 | `/api/denuncias/[id]` | GET | No | Consulta pública de estado de denuncia |

---

## 2. Rutas Admin

> Todas las rutas admin usan `AdminLayout` con `requireAuth=true` por defecto.  
> Auth: client-side guard (`/scripts/admin-auth-guard.js`) lee JWT de `localStorage` y redirige a `/admin/login` si no hay token válido.  
> Login contra Worker API externo: `POST {API_URL}/api/login`.

| # | Path Pattern | HTTP | Auth | Propósito |
|---|---|---|---|---|
| 1 | `/admin/login` | GET | No | Página de login (sin AdminLayout, standalone) |
| 2 | `/admin` | GET | Sí | Dashboard CRM: KPIs, funnel, agenda, actividad reciente |
| 3 | `/admin/inbox` | GET | Sí | Bandeja de leads (capturados desde formularios web) |
| 4 | `/admin/pipeline` | GET | Sí | Pipeline Kanban de ventas (drag & drop) |
| 5 | `/admin/leads` | GET | Sí | Listado de leads con filtros |
| 6 | `/admin/leads/[id]` | GET | Sí | Lead 360°: timeline, tasks, notes, communications |
| 7 | `/admin/denuncias` | GET | Sí | Kanban de gestión de denuncias (MPD compliance) |
| 8 | `/admin/settings` | GET | Sí | Configuración: logout, demo mode, system info |

### API Endpoints Admin (denuncias)

| # | Path Pattern | HTTP | Auth | Propósito |
|---|---|---|---|---|
| 1 | `/api/denuncias` | GET | `X-Admin-Token` | Listar denuncias (paginado, filtrable) |
| 2 | `/api/denuncias/[id]` | PATCH | `X-Admin-Token` | Actualizar status + admin_notes de denuncia |

**Nota:** Los endpoints CRM (`/api/crm/*`, `/api/login`, `/api/refresh`) están en el Worker API externo (`guardman-astro.oficinadesarrollo33.workers.dev`), NO en este proyecto. El frontend admin hace fetch a ese API.

---

## 3. Bindings Cloudflare

Fuente: `wrangler.jsonc`

### D1 Databases

| Binding | Database Name | Database ID | Migrations Dir |
|---|---|---|---|
| `DB` | `guardman-v2-db` | `fd1871a2-77a4-42ca-8b07-de283ff70bab` | `migrations` |

### KV Namespaces

_Ninguna configurada._

### R2 Buckets

_Ninguno configurado._

### Durable Objects

_Ninguno configurado._

### Assets Binding

| Binding | Directorio | Not Found Handling |
|---|---|---|
| `ASSETS` | `./dist` | `single-page-application` |

### Variables de Entorno (wrangler.jsonc `vars`)

| Variable | Valor | Exposed to Client |
|---|---|---|
| `PUBLIC_API_URL` | `https://guardman.oficinadesarrollo33.workers.dev` | Sí (import.meta.env) |
| `PUBLIC_SITE_URL` | `https://guardman.cl` | Sí (import.meta.env) |

### Secrets (documentados)

| Secret | Dónde se usa | Estado |
|---|---|---|
| `DENUNCIAS_ADMIN_TOKEN` | `/api/denuncias` GET/PATCH admin auth | **Hardcoded como fallback** `v41-denu-2026` — pendiente mover a `wrangler secret put` |

### Observability

| Feature | Config |
|---|---|
| Observability | `enabled: true` |
| Logs | `enabled: true` |
| Head Sampling Rate | `1` (100%) |

---

## 4. Variables de Entorno

### Definidas en `env.d.ts` (ImportMetaEnv)

| Variable | Tipo | Fuente | Uso |
|---|---|---|---|
| `PUBLIC_API_URL` | `string` | `wrangler.jsonc` vars / `.env` | URL del Worker API externo |
| `PUBLIC_SITE_URL` | `string` | `wrangler.jsonc` vars / `.env` | URL canónica del sitio |

### Uso en código fuente

| Patrón | Archivo | Línea | Contexto |
|---|---|---|---|
| `import.meta.env.PUBLIC_SITE_URL` | `src/lib/constants.ts` | 13 | `SITE.URL` |
| `import.meta.env.PUBLIC_API_URL` | `src/lib/constants.ts` | 14 | `SITE.API_URL` |
| `process.env.PUBLIC_SITE_URL` | `astro.config.mjs` | 10 | Config Astro `site` |

### Bindings Cloudflare (runtime `env`)

| Binding | Archivo | Acceso |
|---|---|---|
| `DB` (D1) | `src/pages/api/denuncias/index.ts` | `import { env } from 'cloudflare:workers'` |
| `DB` (D1) | `src/pages/api/denuncias/[id].ts` | `import { env } from 'cloudflare:workers'` |
| `DB` (D1) | `src/pages/admin/denuncias.astro` | `import { env } from 'cloudflare:workers'` |
| `DB` (D1) | `src/pages/canal-de-denuncias/estado/[id].astro` | `import { env } from 'cloudflare:workers'` |
| `DENUNCIAS_ADMIN_TOKEN` | `src/pages/api/denuncias/[id].ts` | `env.DENUNCIAS_ADMIN_TOKEN` |
| `DENUNCIAS_ADMIN_TOKEN` | `src/pages/admin/denuncias.astro` | `env.DENUNCIAS_ADMIN_TOKEN` |

### `.env.example`

```
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=http://localhost:4321
```

---

## 5. Árbol src/ Anotado

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.astro          [Admin] — Navegación lateral del CRM
│   │   └── AdminTopbar.astro           [Admin] — Barra superior del admin
│   ├── Analytics.astro                 [Public] — Google Analytics / tracking
│   ├── CoverageMap.astro               [Public] — Mapa Leaflet de cobertura
│   ├── Footer.astro                    [Public] — Footer global del sitio
│   ├── Header.astro                    [Public] — Header con nav + logo
│   ├── HowItWorks.astro               [Public] — Sección "Cómo funciona"
│   ├── Icon.astro                      [Utility] — Componente renderizador de SVG icons
│   ├── LeadCTA.astro                   [Public] — Call-to-action para captura de leads
│   ├── LeadForm.astro                  [Public] — Formulario de contacto/cotización
│   ├── PageHero.astro                  [Public] — Hero section reutilizable
│   ├── RelatedLinks.astro              [Public] — Cluster de links relacionados (SEO)
│   ├── Section.astro                   [Utility] — Wrapper de sección genérico
│   ├── StaffSection.astro              [Public] — Sección de equipo/staff
│   └── TrustSignals.astro              [Public] — Badges de confianza (OS-10, etc.)
│
├── islands/
│   └── crm/
│       ├── Dashboard.tsx               [Admin] — Isla React: Dashboard KPIs
│       ├── Inbox.tsx                    [Admin] — Isla React: Bandeja de leads
│       ├── LeadDetail.tsx              [Admin] — Isla React: Lead 360°
│       ├── LeadsList.tsx               [Admin] — Isla React: Listado de leads
│       └── Pipeline.tsx                [Admin] — Isla React: Kanban pipeline
│
├── layouts/
│   ├── AdminLayout.astro               [Admin] — Shell admin (sidebar + topbar + auth guard)
│   └── BaseLayout.astro                [Public] — Layout raíz sitio público (SEO, schemas, OG)
│
├── lib/
│   ├── api.ts                          [Utility] — Cliente HTTP unificado para Worker API (CRM)
│   ├── auth.ts                         [Utility] — Auth helpers JWT (localStorage): login, refresh, token
│   ├── constants.ts                    [Utility] — Constantes: SITE, SERVICES, LOCATIONS, NAV, GEO, etc.
│   ├── content.ts                      [Utility] — Contenido completo: servicios, ubicaciones, sectores, clientes
│   ├── crm-data.ts                     [Utility] — Mock data CRM + tipos + helpers (Lead, Dashboard, Pipeline)
│   ├── denuncias-validation.ts         [Utility] — Validación formulario denuncias + tracking ID
│   ├── icons.ts                        [Utility] — Registro de iconos SVG (57 icons)
│   ├── seo.ts                          [Utility] — Schema.org generators (Organization, Service, FAQ, etc.)
│   └── validation.ts                   [Utility] — Validación forms contacto/cotización (LeadPayload)
│
├── pages/
│   ├── 404.astro                       [Public] — Página de error 404
│   ├── ajax-systems.astro              [Public] — Landing Ajax Systems
│   ├── contacto.astro                  [Public] — Formulario de contacto
│   ├── cotizacion.astro                [Public] — Formulario de cotización
│   ├── gracias.astro                   [Public] — Confirmación post-formulario
│   ├── guard-pod.astro                 [Public] — Landing Guardpod
│   ├── index.astro                     [Public] — Homepage
│   ├── nosotros.astro                  [Public] — Página institucional
│   ├── privacidad.astro                [Public] — Política de privacidad
│   ├── terminos.astro                  [Public] — Términos y condiciones
│   ├── robots.txt.ts                   [Public] — Generador robots.txt (APIRoute)
│   ├── sitemap.xml.ts                  [Public] — Generador sitemap.xml (APIRoute)
│   │
│   ├── api/
│   │   ├── health.ts                   [API] — GET /api/health (healthcheck)
│   │   └── denuncias/
│   │       ├── index.ts                [API] — POST (público) + GET (admin) /api/denuncias
│   │       └── [id].ts                 [API] — GET (público) + PATCH (admin) /api/denuncias/[id]
│   │
│   ├── canal-de-denuncias/
│   │   └── estado/
│   │       └── [id].astro              [Public] — Consulta estado denuncia
│   │
│   ├── sectores/
│   │   ├── index.astro                 [Public] — Índice de sectores
│   │   └── [slug].astro                [Public] — Detalle de sector
│   │
│   ├── servicios/
│   │   ├── index.astro                 [Public] — Índice de servicios
│   │   ├── [slug].astro                [Public] — Detalle de servicio
│   │   └── [service]/
│   │       └── [location].astro        [Public] — Combo servicio + ubicación (SEO)
│   │
│   ├── ubicaciones/
│   │   ├── index.astro                 [Public] — Índice de ubicaciones
│   │   └── [slug].astro                [Public] — Detalle de ubicación
│   │
│   ├── admin/
│   │   ├── login.astro                 [Admin] — Login (standalone, sin auth guard)
│   │   ├── index.astro                 [Admin] — Dashboard CRM
│   │   ├── inbox.astro                 [Admin] — Bandeja de leads
│   │   ├── pipeline.astro              [Admin] — Pipeline Kanban
│   │   ├── leads.astro                 [Admin] — Listado de leads
│   │   ├── leads/
│   │   │   └── [id].astro              [Admin] — Lead 360° detail
│   │   ├── denuncias.astro             [Admin] — Kanban de denuncias
│   │   └── settings.astro              [Admin] — Configuración del CRM
│
├── styles/
│   ├── components.css                  [Utility] — Estilos de componentes
│   ├── design-tokens.css               [Utility] — CSS custom properties (design system)
│   └── global.css                      [Utility] — Estilos globales + admin shell
│
└── types/
    └── index.ts                        [Utility] — Tipos compartidos: SeoMeta, HeroSection, PageData, etc.
```

---

## 6. Dependencias

### Dependencies (runtime)

| Paquete | Versión | Propósito |
|---|---|---|
| `astro` | `^6.0.0` | Framework SSR (Astro 6) |
| `@astrojs/cloudflare` | `^13.6.0` | Adapter para Cloudflare Workers |
| `@astrojs/react` | `^4.0.0` | Integración React para islas interactivas |
| `react` | `^19.2.0` | UI library (islas CRM) |
| `react-dom` | `^19.2.0` | React DOM renderer |
| `vite` | `7.1.0` | Build tool (bundled con Astro) |
| `clsx` | `^2.1.1` | Utility para combinar classNames |
| `lucide-react` | `^1.8.0` | Iconos React (admin CRM) |
| `marked` | `^18.0.1` | Markdown parser (renderizado de notas/descripciones) |

### DevDependencies (build + test)

| Paquete | Versión | Propósito |
|---|---|---|
| `@astrojs/check` | `^0.9.9` | Type checking para Astro |
| `@playwright/test` | `^1.61.1` | E2E testing framework |
| `@tailwindcss/vite` | `^4.0.0` | Tailwind CSS v4 Vite plugin |
| `@types/react` | `^19.2.0` | TypeScript types para React |
| `@types/react-dom` | `^19.2.0` | TypeScript types para React DOM |
| `@vitest/coverage-v8` | `^4.1.10` | Coverage provider para Vitest |
| `jsdom` | `^29.1.1` | DOM environment para tests |
| `lighthouse` | `^12.8.2` | Auditoría de performance Lighthouse |
| `tailwindcss` | `^4.0.0` | Utility-first CSS framework |
| `typescript` | `^5.9.3` | TypeScript compiler |
| `vitest` | `^4.0.0` | Unit testing framework |
| `wrangler` | `^4.0.0` | Cloudflare Workers CLI (dev + deploy) |

---

## 7. Configuración Resumen

### `astro.config.mjs`

| Key | Valor | Notas |
|---|---|---|
| `site` | `process.env.PUBLIC_SITE_URL ?? 'https://guardman.cl'` | URL canónica |
| `output` | `'server'` | SSR mode (todas las rutas son server-rendered) |
| `adapter` | `cloudflare()` | @astrojs/cloudflare v13 (Workers advanced mode) |
| `integrations` | `[react()]` | React para islas CRM |
| `vite.plugins` | `[tailwindcss()]` | Tailwind CSS v4 |
| `vite.ssr.external` | `['node:fs', 'node:path']` | Externalizar Node builtins |
| `image.service` | `astro/assets/services/sharp` | Sharp para optimización de imágenes |
| `devToolbar` | `enabled: false` | Deshabilitado |
| `build.inlineStylesheets` | `'always'` | CSS inline en HTML (elimina round-trips) |
| `prefetch` | `prefetchAll: true, defaultStrategy: 'hover'` | Prefetch on hover |

### `tsconfig.json`

| Key | Valor |
|---|---|
| `extends` | `astro/tsconfigs/strict` |
| `jsx` | `react-jsx` |
| `jsxImportSource` | `react` |
| `baseUrl` | `.` |
| `paths` | `@/* → src/*`, `@components/*`, `@layouts/*`, `@lib/*`, `@islands/*` |
| `verbatimModuleSyntax` | `true` |
| `strictNullChecks` | `true` |
| `noUnusedLocals` | `true` |
| `noUnusedParameters` | `true` |

### `wrangler.jsonc`

| Key | Valor |
|---|---|
| `name` | `guardman-astro` |
| `main` | `@astrojs/cloudflare/entrypoints/server` |
| `compatibility_date` | `2026-06-01` |
| `compatibility_flags` | `['nodejs_compat']` |
| `assets.directory` | `./dist` |
| `assets.binding` | `ASSETS` |
| `assets.not_found_handling` | `single-page-application` |
| `observability.enabled` | `true` |
| `d1_databases` | `DB → guardman-v2-db (fd1871a2-...)` |

### `vitest.config.ts`

| Key | Valor |
|---|---|
| `test.include` | `tests/**/*.test.ts`, `tests/**/*.test.tsx` |
| `test.environment` | `node` |
| `coverage.provider` | `v8` |
| `coverage.include` | `src/lib/**/*.ts` |
| `coverage.exclude` | `src/lib/icons.ts`, `src/lib/mocks.ts`, `src/lib/content.ts` |
| `resolve.alias` | `@ → ./src` |

### `playwright.config.ts`

| Key | Valor |
|---|---|
| `testDir` | `./tests/e2e` |
| `fullyParallel` | `true` |
| `retries` | CI: 2 / local: 0 |
| `projects` | Chromium only |
| `webServer` | `npx wrangler dev --port 8788` (si no BASE_URL) |
| `baseURL` | `process.env.BASE_URL ?? http://localhost:8788` |

### D1 Schema (migrations)

Una sola migración: `0001_create_denuncias.sql`

| Tabla | Columnas Clave | Índices |
|---|---|---|
| `denuncias` | `id` (PK, D-YYYYMMDD-XXXX), `categoria`, `descripcion`, `status`, `ip_hash`, `created_at`, `updated_at` | `status`, `categoria`, `created_at DESC`, `ip_hash` |

### Tests

| Archivo | Tipo | Propósito |
|---|---|---|
| `tests/auth.test.ts` | Vitest | Tests de auth helpers |
| `tests/constants.test.ts` | Vitest | Tests de constantes |
| `tests/api.test.ts` | Vitest | Tests de API helpers |
| `tests/validation.test.ts` | Vitest | Tests de validación de formularios |
| `tests/e2e/public.spec.ts` | Playwright | E2E sitio público |
| `tests/e2e/admin.spec.ts` | Playwright | E2E admin CRM |

---

## Hallazgos Notables del Inventario

1. **Custom domain `guardman.cl` no apunta al Worker** — Responde con Google Sites. `wrangler.jsonc` no tiene `routes` ni `custom_domains`.
2. **Admin auth es client-side only** — `admin-auth-guard.js` lee JWT de `localStorage`. No hay middleware SSR que verifique autenticación en las rutas `/admin/*`.
3. **Token admin de denuncias hardcoded** — `v41-denu-2026` como fallback en 3 archivos. Pendiente migrar a `wrangler secret put`.
4. **CRM data es mock** — `crm-data.ts` contiene datos hardcodeados. Los endpoints CRM reales están en el Worker API externo.
5. **Solo 1 binding D1** — Solo la tabla `denuncias` existe. No hay tablas de leads, usuarios, etc. en este proyecto (viven en el Worker API externo).
6. **Admin denuncias expone token en HTML** — `denuncias.astro` inyecta `adminToken` via `define:vars` en un `<script>`, visible en el HTML fuente.
