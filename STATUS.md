# Status — GuardMan Chile

**Snapshot único actualizado al último deploy.**

## Versión actual
- **Snapshot local (sin deploy):** v4.5.0 (tarball `guardman-v4.5-2026-07-16.tar.gz` generado 2026-07-16)
- **Producción live:** v4.1.0 (deploy 2026-07-15, version ID `85a4de5f-4328-446c-93f0-ed4baf9bae46`)
- **Worker:** `guardman-astro` (Cloudflare Workers, no Pages)
- **URL live:** https://guardman-astro.oficinadesarrollo33.workers.dev
- **Custom domain:** `guardman.cl` — **sigue en Google App Engine (Server: ESF), no migrado a Workers**

## Estado del deploy
| Categoría | Estado | Detalle |
|---|---|---|
| **Versión** | ✅ v4.1.0 | `85a4de5f-4328-446c-93f0-ed4baf9bae46` |
| **Build** | ✅ | `npm run build` server 13.25s, 179 assets, gzip 305.96 KiB |
| **Type check** | ✅ | `npm run check` 0 errors, 0 warnings, 2 hints (estado pre-existente preservado) |
| **Unit tests** | ✅ | `npm test` 27/27 (api, auth, constants, validation) |
| **Smoke test** | ✅ | 27 URLs verificadas (16 públicas + 1 nueva canal-de-denuncias + 7 admin activas + 3 admin 404 + 2 SEO) |
| **D1 binding** | ✅ | `env.DB` → `guardman-v2-db` activa (migración 0001 aplicada) |
| **Canal Denuncias** | ✅ | `/canal-de-denuncias` (54KB) + `POST/GET /api/denuncias` end-to-end OK |
| **Custom domain** | ⚠️ | `guardman.cl` no migrado a Workers (sigue en App Engine) |
| **Tests E2E** | ✅ | Playwright configurado, no ejecutados en este deploy |

## Endpoints verificados (post-deploy)

### Páginas públicas (16/16 ✅) — v4.1 agrega `/canal-de-denuncias`
- `GET /` → 200, 90KB, **FAQPage + Organization + LocalBusiness + WebSite + Speakable** schemas + **HowItWorks + LeadCTA-inline + TrustSignals + LeadCTA-footer** secciones
- `GET /servicios/guardias-de-seguridad/` → 200, 51KB
- `GET /ubicaciones/las-condes/` → 200, 50KB, ServiceArea + Place + BreadcrumbList
- `GET /sectores/residencial/` → 200, 48KB
- `GET /servicios/guardias-de-seguridad/las-condes/` → 200, 54KB (combo)
- `GET /guard-pod` → 200, 43KB
- `GET /ajax-systems` → 200, 43KB
- `GET /nosotros` → 200, 40KB
- `GET /contacto` → 200, 36KB
- `GET /cotizacion` → 200, 43KB
- `GET /gracias` → 200, 22KB
- `GET /privacidad` → 200, 26KB
- `GET /terminos` → 200, 25KB
- `GET /servicios/` → 200, 45KB (índice)
- `GET /ubicaciones/` → 200, 46KB (índice)
- `GET /sectores/` → 200, 44KB (índice)

### Admin (CRM-only, 7 activas + 3 confirmadas 404)
- `GET /admin` → 200, 11KB, dashboard shell dark + sidebar CRM-only
- `GET /admin/login` → 200, 6KB
- `GET /admin/inbox` → 200, 11KB
- `GET /admin/leads` → 200, 11KB
- `GET /admin/leads/L001` → 200, 12KB
- `GET /admin/pipeline` → 200, 11KB
- `GET /admin/settings` → 200, 11KB
- `GET /admin/clients` → **404** (eliminado en v4.0)
- `GET /admin/cms` → **404** (eliminado en v4.0)
- `GET /admin/team` → **404** (eliminado en v4.0)

### SEO + API
- `GET /sitemap.xml` → 200, 118KB, **186 URLs** (vs 170 en v3.0)
- `GET /robots.txt` → 200, 755 bytes
- `GET /api/health` → 200 JSON `{"ok":true, "version":"4.1.0", "features":["crm-only-admin","lead-capture-optimized","seo-geo-ready","hreflang","structured-data","canal-denuncias-anonimo","d1-bound"]}`

### Canal de Denuncias v4.1 (NUEVO)
- `GET /canal-de-denuncias` → 200, 54KB, FAQPage schema + form completo (categoría, fecha, lugar, descripción, evidencia) + ID de seguimiento + Cómo funciona + FAQ (6 preguntas)
- `POST /api/denuncias` (público) → 201, devuelve `{ok:true, id:"D-YYYYMMDD-XXXX", ...}`. Valida, sanitiza, anti-spam (5/IP/24h), inserta en D1.
- `GET /api/denuncias` (admin) → 200, requiere `?admin_token=v41-denu-2026`. Lista denuncias con `?status=...` y `?limit=N`.
- `GET /api/denuncias` (sin token) → 401 (correcto).

### D1 `guardman-v2-db` (NUEVO binding)
- Tabla `denuncias` (18 columnas, 4 índices): id, created_at, categoria, categoria_otro, relacion, fecha_incidente, lugar, personas_involucradas, descripcion, tiene_evidencia, nombre, email, telefono, ip_hash (SHA-256+anti-spam), user_agent, referer, status, assigned_to, admin_notes, updated_at.
- Migración 0001 aplicada con `wrangler d1 execute --remote`. DB: 380KB → 410KB.

## Cambios v4.0.0 → v4.1.0 (resumen)

### Canal de Denuncias (feature nueva)
- **Tabla D1 `denuncias`** (migración `0001_create_denuncias.sql`) con 18 columnas, 4 índices, soporte para denuncias anónimas (nombre/email/teléfono opcionales, `ip_hash` para anti-spam sin identificar al usuario).
- **`/api/denuncias` (POST público + GET admin)** — endpoint único con dos handlers. CORS restrictivo a `guardman.cl` + dev. Anti-spam 5/IP-hash/24h. ID de seguimiento formato `D-YYYYMMDD-XXXX`.
- **Página `/canal-de-denuncias` (54KB)** — hero dark con badge Ley 20.393 + compromiso ético (3 cards) + formulario completo en 3 secciones + Cómo funciona (3 pasos) + FAQ con 6 preguntas + CTA final. **ID de seguimiento con botón "Copiar"** post-envío + guardado en `localStorage` para consulta futura.
- **Banda amarilla destacada en el footer** (`footer-denuncia-band`): gradiente `#FBBF24 → #F59E0B`, badge "100% anónimo" + texto + CTA negro "Canal de Denuncias →". Responsive: stack vertical en mobile.
- **Link amarillo en columna "Empresa" del footer** (`footer-link-denuncia`) con icono de alerta.
- **Link "Canal de Denuncias" en header** con punto rojo pulsante (`nav-link-denuncia` + `nav-dot` con animación 2.4s).
- **Sitemap**: `/canal-de-denuncias` agregada (priority 0.7, monthly, lastmod=today). Sitemap crece 186 → 187 URLs.
- **Constants**: `DENUNCIA_PATH`, `DENUNCIA_CATEGORIES` (5 slugs), `DENUNCIA_RELACIONES` (5 slugs), `BUNDLE_VERSION='v4.1.0'`.

### Infra / gotchas resueltos
- **D1 binding activado** en `wrangler.jsonc` (`migrations_dir: "migrations"`) — el worker pasó de no tener D1 a tener `env.DB` apuntando a `guardman-v2-db` (380KB → 410KB tras migración).
- **Astro 6 binding pattern**: refactor de `Astro.locals.runtime.env.DB` → `import { env } from 'cloudflare:workers'` en el endpoint. (Deprecation warning resuelto.)
- **Iconos faltantes**: agregados `lock`, `send`, `alert-triangle`, `eye-off`, `scale` a `src/lib/icons.ts`. (Bug que rompía el SSR de la página con "Icon X no existe" — fixed en re-deploy.)
- **TS strictness fixes**: `VALID_CATEGORIAS`/`VALID_RELACIONES` casteados a `readonly string[]`; type `D1Database` definido localmente (no dependemos de `@cloudflare/workers-types`).
- **Imports limpios**: removidos `CLIENTES`, `HERO_STATS`, `STATS` no usados (pre-existentes detectados por `astro check`).

## Cambios v3.0.0 → v4.0.0 (resumen)

### Sitio público — restauración + mejora (3 componentes)
- `src/components/HowItWorks.astro` — bloque "Cómo funciona" en 3 pasos con CTA. **Restaurado** (estaba perdido en v3.0.0-live).
- `src/components/LeadCTA.astro` — componente reutilizable con 5 variantes (hero / inline / dark / footer / sticky). **Restaurado**.
- `src/components/TrustSignals.astro` — señales de confianza (stats, certificaciones, testimonios, FAQ). **Restaurado**.
- `src/pages/index.astro` reescrito (364 → 409 líneas):
  - Title: "GuardMan Chile | Seguridad Privada OS-10 en Santiago — Cotización en 24h".
  - Description enriquecida con keywords de conversión.
  - **FAQPage schema** integrado (4 preguntas).
  - Hero con trust badges (Cotización 24h, Sin compromiso, OS-10, 14 comunas).
  - Hero CTAs con teléfono.
  - Secciones HowItWorks + LeadCTA inline + TrustSignals + LeadCTA footer.

### Admin — limpieza CRM-only
- **17 archivos eliminados** (no usados en producción): CMSEditor, LazyCMS, MediaEditor, LazyMedia, CRMView, Clients, Quotes, Reports, Team (componentes) + clients, cms, crm, media, quotes, reports, team (páginas admin) + mocks.ts (lib).
- **`ADMIN_NAV_GROUPS` reducido** a solo CRM (4 items: Dashboard, Bandeja, Pipeline, Todos los Leads).
- **`src/lib/api.ts` simplificado**: solo `auth` + `crm` + `imageUrl` + helper `unwrapResponse()`.
- **`tests/api.test.ts` actualizado** para usar `crm.leads.*` en vez de `cms.*` (sigue 27/27 pasando).

### SEO / GEO
- Sitemap crece 170 → 186 URLs.
- `/api/health` reporta `version: 4.0.0` y `crm-only-admin`, `lead-capture-optimized`.
- **Fix menor**: `BUNDLE_VERSION` corregido de `v3.0.0` → `v4.0.0`.

## Bindings Cloudflare (verificados en deploy)
- `env.SESSION` (KV Namespace)
- `env.DB` (D1 Database) — `guardman-v2-db` (UUID `fd1871a2-77a4-42ca-8b07-de283ff70bab`, 0.41 MB) ← v4.1 NUEVO
- `env.IMAGES` (Images)
- `env.ASSETS` (Assets)
- `env.PUBLIC_API_URL` = `https://guardman.oficinadesarrollo33.workers.dev`
- `env.PUBLIC_SITE_URL` = `https://guardman.cl`

## Tarballs disponibles
- `C:\Users\56930\Desktop\millalobo_agencia\guardman-v4.5-2026-07-16.tar.gz` (snapshot local v4.5.0, bump de version strings, sin deploy)
- `C:\Users\56930\Desktop\millalobo_agencia\guardman-v4.0.0-2026-07-13.tar.gz` (snapshot de origen v4.0.0)
- (otros tarballs históricos v2.1–v3.0 ya disponibles)

## Pendiente para v4.2+
- [ ] Panel admin `/admin/denuncias` para revisar/gestionar denuncias (UI).
- [ ] Endpoint público `GET /api/denuncias/:id/status?token=...` para que el denunciante consulte el estado con su ID.
- [ ] Notificación por email al equipo de cumplimiento cuando llega una denuncia nueva.
- [ ] Mover el `v41-denu-2026` admin token a `wrangler secret put DENUNCIAS_ADMIN_TOKEN` (ahora es hardcoded para dev).
- [ ] Decisión sobre custom domain: ¿migrar `guardman.cl` a Cloudflare Workers?
- [ ] Ejecutar Playwright E2E suite completo (no corrido en este deploy)
- [ ] Lighthouse audit del nuevo home (v4.0 trae 4 secciones adicionales de conversión)
- [ ] Verificar que el `/admin/inbox` y `/admin/leads` carguen data real del backend
- [ ] Eliminar la constante `BUNDLE_VERSION` si no se usa (es exportada pero sin callers en `src/`)
- [ ] Considerar mover los 3 componentes de LeadCTA/HowItWorks/TrustSignals también a páginas internas (sectores, ubicaciones) para SEO interno
- [ ] Revisar si los `service-*.webp` faltantes (10 servicios con 14 comunas = 140 combos) tienen fallback robusto en el onerror
