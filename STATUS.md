# STATUS — guardman

Snapshot del estado actual del proyecto. v0.1.0 = master baseline. Esta es la única fuente de verdad operativa; el CHANGELOG registra los cambios.

## Deploy
- **Worker**: `guardman-astro` → https://guardman-astro.oficinadesarrollo33.workers.dev
- **Cuenta Cloudflare**: oficinadesarrollo33@gmail.com (account ID `b3a89fc9524552b7ab3202269f1ab6f3`)
- **Stack**: Astro 6 SSR + @astrojs/cloudflare
- **Build**: `npm run build` (debe correrse antes de `wrangler deploy`)
- **Deploy**: `npx wrangler deploy`
- **Custom domain** `guardman.cl`: NO apunta a este worker (responde con `Server: ESF` de Google Sites). `wrangler.jsonc` no tiene `routes` ni `custom_domains` configurado. Pendiente.

## Tech stack
- **Frontend SSR**: Astro 6
- **Adapter**: @astrojs/cloudflare (SSR, no SSG)
- **Islands**: React 19 (solo admin) + lucide-react iconos
- **DB**: D1 (`guardman-v2-db`)
- **KV**: `SESSION` namespace (auth cookies)
- **Imágenes**: Cloudflare Images binding
- **TypeScript**: strict

## Estructura
```
src/
├── components/      # componentes Astro públicos
├── islands/         # React islands (admin)
│   ├── admin/       # GuardpodWizard, AdminSidebar, etc.
│   └── crm/         # CRM dashboard, leads, pipeline
├── layouts/         # BaseLayout, AdminLayout
├── lib/             # api, auth, content, crm-data, seo, validation
├── pages/
│   ├── api/         # endpoints SSR
│   │   ├── guardpod/  # cuestionario producto
│   │   ├── denuncias/ # canal de denuncias
│   │   ├── leads/     # captura
│   │   └── ...
│   ├── admin/       # /admin/*
│   ├── servicios/   # /servicios + [slug] + combos
│   ├── sectores/    # /sectores + [slug]
│   └── ubicaciones/ # /ubicaciones + [slug]
├── styles/          # CSS (design-tokens, global, components)
└── types/           # TS types

public/
├── images/          # assets optimizados
├── styles/          # CSS vanilla
├── scripts/         # JS legacy
├── videos/          # MP4s guardpod
└── fonts/

migrations/          # D1 SQL schemas (numeradas 000X)
tests/               # vitest + playwright
wrangler.jsonc       # Cloudflare config
astro.config.mjs
```

## Funcionalidad

### Público
- **Home** (`/`) — hero + clusters + sectores + servicios + ubicaciones + guardpod
- **Servicios** (`/servicios`) — 10 servicios, cada uno con landing
- **Combos servicio × ubicación** (`/servicios/[service]/[location]`) — SEO long-tail
- **Sectores** (`/sectores`) — 11 verticales
- **Ubicaciones** (`/ubicaciones`) — 14 comunas RM + 2 Valparaíso
- **Guardpod** (`/guard-pod`) — landing dedicada del producto estrella (vigilancia autónoma 360° + IA)
- **Ajax Systems** (`/ajax-systems`) — landing alarmas
- **Nosotros** (`/nosotros`) — institucional + timeline
- **Cotización** (`/cotizacion`) — formulario
- **Contacto** (`/contacto`)
- **Canal de denuncias** (`/canal-de-denuncias`) — formulario público + estado/[id]
- **Privacidad**, **Términos**, **404**, **gracias**

### Admin (requiere auth)
- `/admin/login` — login con cookie `gm_session`
- `/admin` — dashboard CRM
- `/admin/leads` + `/admin/leads/[id]` — gestión de leads
- `/admin/pipeline` — pipeline visual
- `/admin/inbox` — bandeja
- `/admin/denuncias` — canal de denuncias
- `/admin/guardpod` — cuestionario profundo del producto (131 preguntas, autoguardado)
- `/admin/settings`

### APIs
- `/api/health` — health check
- `/api/leads/*` — captura + gestión
- `/api/denuncias/*` — creación + estado
- `/api/guardpod/session`, `/api/guardpod/answer`, `/api/guardpod/answer/batch`, `/api/guardpod/export`, `/api/guardpod/progress`
- `/api/analytics/pageview`
- `/api/admin/session`

## Auth
- Cookie `gm_session` con token (>= 16 chars)
- `localStorage.gm_token` + `gm_token_expires_at` (client-side guard)
- Admin API endpoints: `isAdminRequest()` chequea cookie o `x-admin-token` / `Authorization: Bearer` contra secret `DENUNCIAS_ADMIN_TOKEN`

## DB (D1)
- `leads` — captura cotizaciones
- `denuncias` — canal de denuncias
- `denuncias_updates` — historial
- `pageviews` — analytics
- `guardpod_questions` — cuestionario versionado (v1: 60 preguntas activas)
- `guardpod_sessions` — 1 sesión por admin
- `guardpod_answers` — 1 fila por respuesta
- `guardpod_answer_history` — auditoría de cambios

## Versión
- **v0.1.0** — master baseline. Estado de código al 2026-08-24.
- Próxima versión: incrementar minor (`0.2.0`) para features, patch (`0.1.1`) para fixes.

## Tareas pendientes
- Resolver custom domain `guardman.cl` (migrar DNS desde Google Sites o agregar `routes` si la zone está en esta cuenta Cloudflare)
- Multi-admin (auth actualmente single-user con `admin@guardman.cl` hardcoded)
- i18n real (hreflang declarado, contenido solo es-CL)
- Migrar secrets a Cloudflare Secrets Store (URLs hoy en `wrangler.jsonc` vars)
- Subida a R2 para `guardpod` upload (placeholder URL hoy)

## Convenciones operativas
- **No voseo** (vos, tenés, etc.). Solo español neutro.
- **No Service Worker / PWA** en landings agencia.
- **Sin Mavis/minimax en copy público** — solo "equipo Millalobo Agencia" o "DEV33".
- **Ediciones quirúrgicas** — no re-arquitectura.
- **CSS/visual = código + `Invoke-WebRequest` al CSS + `npm run build`**, no dev server.
- **git status antes de declarar "terminé todo"**.
- **Merge committed ≠ production deployed** — verificar con curl.
- **Audit factual antes de planear**.

Ver [AGENTS.md](./AGENTS.md) para el contexto operativo completo.
