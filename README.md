# GuardMan Chile — Astro 6 v0.1.0 (Cloudflare Workers)

Sitio público + panel admin de GuardMan Chile, la empresa de seguridad privada OS-10 más grande de la Región Metropolitana. Producto estrella: **Guardpod** (vigilancia autónoma 360° + IA, sin infraestructura).

## Stack

- **Framework:** Astro 6 (SSR, `output: 'server'`, adapter `@astrojs/cloudflare` en `mode: 'advanced'`)
- **Hosting:** Cloudflare Workers (no Pages) — Worker `guardman-astro`
- **Islands interactivas:** React 19 (`client:only="react"`)
- **CSS:** design system propio (vanilla CSS + custom properties, no Tailwind)
- **DB:** D1 (`guardman-v2-db`)
- **KV:** namespace `SESSION` (auth cookies)
- **Imágenes:** Cloudflare Images binding
- **TypeScript:** strict

## Deploy

- **Versión:** v0.1.0 (master baseline)
- **URL live:** https://guardman-astro.oficinadesarrollo33.workers.dev
- **Custom domain:** `guardman.cl` — NO apunta a este worker (sigue en Google Sites, pendiente de migrar DNS)
- **Build:** `npm run build`
- **Deploy:** `npx wrangler deploy`
- **Wrangler auth:** oficinadesarrollo33@gmail.com (account `b3a89fc9524552b7ab3202269f1ab6f3`)

## Comandos

```bash
npm run dev         # Dev server (Astro)
npm run build       # Build producción (~15-30s)
npm run check       # astro check (type checking)
npm run test        # vitest (unit tests)
npm run test:e2e    # Playwright E2E
npm run preview     # wrangler dev
npm run deploy      # astro build && wrangler deploy
npm run lighthouse  # Auditoría Lighthouse
```

## Variables de Entorno

```bash
# .env (dev local)
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=http://localhost:4321

# Producción (wrangler.jsonc vars)
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=https://guardman.cl
```

## Bindings Cloudflare (verificados en deploy)

- `env.DB` → D1 database `guardman-v2-db`
- `env.SESSION` → KV Namespace
- `env.IMAGES` → Images binding
- `env.ASSETS` → Assets
- `env.PUBLIC_API_URL`, `env.PUBLIC_SITE_URL` → vars

## Estructura

```
guardman/
├── STATUS.md                  # Snapshot único (fuente de verdad operativa)
├── CHANGELOG.md               # Historial de versiones
├── AGENTS.md                  # Contexto operativo (deploy, logo, tareas)
├── README.md                  # Este archivo
├── astro.config.mjs           # Astro + Cloudflare Workers
├── wrangler.jsonc             # Worker config
├── tsconfig.json
├── package.json
├── env.d.ts / .env.example
├── public/
│   ├── images/                # WebP, OG, sectores, productos
│   ├── styles/                # CSS vanilla (site, dark, main)
│   ├── scripts/               # JS legacy
│   ├── videos/                # MP4s guardpod
│   ├── fonts/                 # Inter Variable
│   ├── _headers / _redirects  # Cloudflare config
│   └── favicon.* + apple-touch-icon.png
├── src/
│   ├── styles/                # design-tokens, global, components
│   ├── lib/                   # api, auth, content, crm-data, seo, validation, icons
│   ├── layouts/               # BaseLayout, AdminLayout
│   ├── components/            # Astro componentes públicos + admin
│   ├── islands/               # React islands (admin/, crm/)
│   ├── pages/                 # rutas + api/*
│   │   ├── index.astro
│   │   ├── servicios/  sectores/  ubicaciones/
│   │   ├── guard-pod.astro  ajax-systems.astro
│   │   ├── nosotros.astro  contacto.astro  cotizacion.astro
│   │   ├── canal-de-denuncias.astro + estado/[id].astro
│   │   ├── admin/            # login + dashboard + leads + pipeline + ...
│   │   └── api/              # health, leads, denuncias, guardpod, analytics
│   └── types/
├── migrations/                # D1 SQL schemas (0001, 0002, 0003...)
├── tests/                     # vitest (api, auth, constants, validation)
│   └── e2e/                   # playwright (public, admin, guardpod-wizard)
├── logo/                      # original logo assets
├── imagenes guardman/         # original image assets
└── scripts/                   # lighthouse-audit
```

## Funcionalidad

### Público (`src/pages/*.astro` + sub-rutas)
- Home con hero, clusters SEO, sectores, servicios, ubicaciones, guardpod
- `/servicios/[slug]` + `/servicios/[service]/[location]` (combo SEO long-tail)
- `/sectores/[slug]`, `/ubicaciones/[slug]`
- `/guard-pod` (dark theme, producto estrella)
- `/ajax-systems` (dark theme, alarmas)
- `/nosotros` (institucional + timeline + FAQ)
- `/cotizacion`, `/contacto`, `/canal-de-denuncias` (+ estado/[id])
- `/privacidad`, `/terminos`, `/gracias`, `/404`

### Admin (`/admin/*`, requiere auth)
- Login (cookie `gm_session` + localStorage `gm_token`)
- Dashboard CRM, Leads (+ `[id]`), Pipeline, Inbox
- Canal de denuncias
- Cuestionario Guardpod (60 preguntas, autoguardado, export JSON)
- Settings

### APIs (`src/pages/api/*`)
- `GET /api/health`
- `POST /api/leads/capture`, `GET/POST /api/leads`, `GET /api/leads/[id]`
- `POST /api/denuncias`, `GET /api/denuncias/[id]`
- `GET/POST /api/guardpod/session`, `POST /api/guardpod/answer`, `POST /api/guardpod/answer/batch`, `GET /api/guardpod/export`, `GET /api/guardpod/progress`
- `POST /api/analytics/pageview`
- `GET/POST /api/admin/session`

## Auth

- Cookie `gm_session` con token (>= 16 chars)
- `localStorage.gm_token` + `gm_token_expires_at` (client-side guard, `public/scripts/admin-auth-guard.js`)
- API endpoints: `isAdminRequest()` chequea cookie O `x-admin-token` / `Authorization: Bearer` contra secret `DENUNCIAS_ADMIN_TOKEN`

## D1 (guardman-v2-db)

- `leads` — captura cotizaciones
- `denuncias` + `denuncias_updates` — canal de denuncias
- `pageviews` — analytics
- `guardpod_questions` — cuestionario versionado (v1: 60 preguntas)
- `guardpod_sessions` — 1 sesión por admin
- `guardpod_answers` — 1 fila por respuesta
- `guardpod_answer_history` — auditoría de cambios

## Convenciones operativas

- **Español neutro** — sin voseo, sin regionales argentinos/rioplatenses.
- **No Service Worker / PWA** en landings agencia.
- **Sin Mavis/minimax en copy público** — solo "equipo Millalobo Agencia" o "DEV33".
- **Ediciones quirúrgicas** — no re-arquitectura.
- **CSS/visual = código + `Invoke-WebRequest` + `npm run build`**, no dev server.
- **git status antes de declarar "terminé todo"**.
- **Merge committed ≠ production deployed** — verificar con curl.
- **Audit factual antes de planear**.

Ver [STATUS.md](./STATUS.md) para el snapshot completo del estado actual.  
Ver [AGENTS.md](./AGENTS.md) para el contexto operativo (deploy, logo, gotchas).
