# Plan de Trabajo — GuardMan Chile v4.0.0

**Fecha deploy:** 2026-07-13
**Version ID:** `f07b3527-7771-41ca-8a01-60c7aafbdb14`
**Modo ejecución:** Implementación del tarball `guardman-v4.0.0-2026-07-13.tar.gz` sobre v3.0.0 deployado

---

## Contexto del Proyecto

- **Stack:** Astro 6 (`output: 'server'`) + React 19 + Tailwind v4 + Cloudflare Workers
- **Versión anterior:** v3.0.0 (en `guardman-v3.0.0-2026-07-13-live.tar.gz`)
- **Versión actual:** v4.0.0 (deploy 2026-07-13)
- **URL live:** https://guardman-astro.oficinadesarrollo33.workers.dev
- **Custom domain:** guardman.cl sigue en Google App Engine (no migrado)
- **Backend:** Worker API existente en `guardman.oficinadesarrollo33.workers.dev` (otro worker, no se toca)

---

## Trabajo ejecutado (2026-07-13)

### 1. Auditoría del tarball v4.0.0
- **Inventario:** 132 archivos en el tarball (vs 146 en v3.0.0-live)
- **Cambios detectados** vs v3.0.0-live:
  - **17 archivos eliminados** (admin no usado en producción): CMSEditor, LazyCMS, MediaEditor, LazyMedia, CRMView, Clients, Quotes, Reports, Team (componentes) + clients, cms, crm, media, quotes, reports, team (páginas admin) + mocks.ts
  - **3 archivos agregados** (sitio público): HowItWorks.astro, LeadCTA.astro, TrustSignals.astro
  - **9 archivos modificados** (sustanciales):
    - `package.json` (4.0.0, deps nuevas: `marked`, `lucide-react`, `@vitest/coverage-v8`)
    - `src/lib/api.ts` (simplificado a `auth + crm + imageUrl`, eliminado `cms`/`media`)
    - `src/lib/constants.ts` (ADMIN_NAV_GROUPS reducido a solo CRM)
    - `src/pages/index.astro` (reescrito, 364 → 409 líneas, FAQ schema + HowItWorks + LeadCTA + TrustSignals)
    - `src/pages/api/health.ts` (version 4.0.0, features actualizadas)
    - `src/lib/seo.ts` (refactor menor)
    - `src/lib/content.ts` (refactor menor)
    - `tests/api.test.ts` (actualizado de `cms.*` a `crm.leads.*`)
    - `src/types/index.ts` (sin type-check issues)

### 2. Snapshot defensivo
- Backup del estado v3.0.0-live antes de tocar nada → `guardman-v3.0.0-2026-07-13-live-backup.tar.gz` (17.5MB, sin node_modules)
- Preservados en directorio: `.env`, `.env.production` y `node_modules`
- Backup adicional de `.env` y `.env.production` en `$env:TEMP` por seguridad
- Trashed de: src, public, scripts, tests, dist, .astro, .wrangler, .github, docs, configs, package.json/lock, README, CHANGELOG, STATUS, PLAN, AUDITORIAS

### 3. Implementación
- Extracción del tarball v4.0.0 al directorio del proyecto
- Restauración del `.env` y `.env.production` desde backup en temp
- **Fix de BUNDLE_VERSION stale**: `src/lib/constants.ts` decía `BUNDLE_VERSION = 'v3.0.0'` (no se actualizó al crear el tarball). Corregido a `v4.0.0`.
- `npm install`: 679 paquetes OK (up to date con lockfile)
- **Fix de tests**: `tests/api.test.ts` usaba `cms.get('service', ...)` que ya no existe en el `api.ts` simplificado. Reescrito para usar `crm.leads.get(id)` / `crm.leads.list()`. 27/27 tests pasando.
- `npm run check`: 0 errors, 0 warnings, 2 hints cosméticos
- `npm test`: 27/27 OK (api, auth, constants, validation)
- `npm run build`: server 18.6s, 184 assets, gzip 298.34 KiB
- `npm run deploy`: 9.81s, version ID `f07b3527-7771-41ca-8a01-60c7aafbdb14`

### 4. Smoke test post-deploy (25 URLs verificadas)
- **15 páginas públicas** (200 con contenido válido + JSON-LD):
  - home, contacto, cotizacion, gracias, servicios, servicios/guardias-de-seguridad, ubicaciones, ubicaciones/las-condes, sectores, sectores/residencial, servicios/guardias-de-seguridad/las-condes, guard-pod, ajax-systems, nosotros, privacidad, terminos
- **7 admin pages activas** (200): dashboard, login, inbox, leads, leads/L001, pipeline, settings
- **3 admin pages eliminadas** (404 confirmado): clients, cms, team
- **2 SEO endpoints** (200): sitemap.xml (186 URLs, 118KB), robots.txt (755 bytes)
- **1 API endpoint** (200): /api/health reporta `version: 4.0.0`

### 5. Documentación
- Creado `CHANGELOG.md` con entradas v2.1.0, v3.0.0 y v4.0.0
- Creado `STATUS.md` con snapshot único del deploy v4.0.0
- Reescrito este `PLAN_DE_TRABAJO.md`, `README.md`, `AUDITORIA_POST_PLAN.md`, `PROMPT_CA.md` a v4.0.0

---

## Resultados v4.0.0

| Categoría | Antes (v3.0.0) | Ahora (v4.0.0) |
|---|---|---|
| Páginas públicas | 170 indexadas | **186 indexadas** (+16 URLs legales/gracias en sitemap) |
| Admin pages | 15 | **7** (CRM-only: dashboard, login, inbox, leads, leads/[id], pipeline, settings) |
| Componentes CRM | 9 (separados) | **5** (Dashboard, Inbox, LeadDetail, LeadsList, Pipeline) |
| Componentes públicos | 6 | **9** (+3: HowItWorks, LeadCTA, TrustSignals restaurados) |
| Componentes eliminados | — | **17** (CMS, Media, Clients, Quotes, Reports, Team, mocks, CRMView) |
| API client exports | `auth + cms + media + crm + imageUrl` | **`auth + crm + imageUrl` + helper `unwrapResponse()`** |
| Sitio público home | 68KB | **90KB** (+4 secciones de conversión: HowItWorks, LeadCTA inline, TrustSignals, LeadCTA footer) |
| FAQ schema en home | NO | **SÍ** (4 preguntas) |
| Title home | "GuardMan Chile \| Seguridad Privada Profesional en Santiago" | **"GuardMan Chile \| Seguridad Privada OS-10 en Santiago — Cotización en 24h"** |
| Trust badges en hero | NO | **SÍ** (4: 24h, sin compromiso, OS-10, 14 comunas) |
| Hero CTAs | Cotizar + Nosotros | **Cotizar + Teléfono** |
| Sitemap URLs | 170 | **186** |
| Tests | 27/27 | 27/27 (api.test.ts actualizado a `crm.*`) |
| Type errors | 0 | 0 |
| Build time | 37.48s | **18.6s server** (más rápido por menos páginas admin) |
| Deploy time | 11.43s | 9.81s |

---

## Pendiente para v4.1+

### P0 — esta semana (2-3h cada uno)

1. **Custom domain `guardman.cl` → Cloudflare Workers**
   - Decisión: ¿migrar DNS o dejar staging en workers.dev?
   - Si sí: actualizar Worker Route en dashboard de Cloudflare, verificar que `guardman.cl` resuelve al worker
   - Verificar que no hay conflicto con el `Server: ESF` actual (App Engine)
   - Output esperado: `https://guardman.cl/` responde con el mismo HTML que `https://guardman-astro.oficinadesarrollo33.workers.dev/`

2. **Backend Worker para `/api/crm/leads` y `/api/crm/leads/capture`**
   - El frontend llama a `${PUBLIC_API_URL}/api/crm/leads` desde `crm.leads.list()` (en api.ts)
   - El form de contacto y cotizacion envía a `${PUBLIC_API_URL}/api/crm/leads/capture`
   - Verificar que el backend Worker `guardman.oficinadesarrollo33.workers.dev` tiene los endpoints CRM listos
   - Si los endpoints no existen, hay que crearlos (probablemente en otro repo, no en este)
   - Output esperado: lista de endpoints + estado (existe / no existe / mock)

3. **Playwright E2E suite completo**
   - Correr `npx playwright test` (configurado pero no ejecutado)
   - Verificar que los 2 specs (public + admin) pasan contra el deploy actual
   - Si fallan, ajustar selectores (la v4.0 restauró 3 componentes públicos que cambian estructura)
   - Output esperado: 2 specs verdes, screenshots de smoke test

### P1 — próximas 2 semanas

4. **Lighthouse audit del nuevo home**
   - `npm run lighthouse` en homepage
   - El home creció 68KB → 90KB (HowItWorks + LeadCTA + TrustSignals + LeadCTA footer)
   - Score objetivo: > 90 en todas las categorías
   - Si baja de 90: corregir (probable: imágenes sin dimensiones en trust badges, JS bloqueante de Leaflet)
   - Output esperado: reporte Lighthouse con scores > 90

5. **Hreflang verificar en producción**
   - Confirmar que Google indexa las páginas con hreflang correcto
   - Revisar Google Search Console (si está configurado)
   - Output esperado: reporte de indexación

6. **Verificar imágenes de servicio con fallback**
   - 10 servicios × 14 comunas = 140 combos servicio×ubicación
   - No todas las imágenes `service-*.webp` existen para todos los servicios
   - Verificar que el `onerror` fallback (`this.src='/images/hero-home.webp'`) funciona en el SSR
   - Output esperado: lista de imágenes faltantes + plan de generación

### P2 — backlog

7. **Eliminar constante `BUNDLE_VERSION` si no se usa**
   - `src/lib/constants.ts` exporta `BUNDLE_VERSION = 'v4.0.0'` pero no se usa en ningún archivo de `src/`
   - Solo `tests/constants.test.ts` valida que exista
   - Decisión: ¿mantener como trazabilidad o eliminar?
   - Si eliminar: quitar export + test

8. **Evaluar mover componentes de conversión a otras páginas**
   - HowItWorks, LeadCTA, TrustSignals ahora solo en home
   - Considerar agregar LeadCTA inline en páginas de servicio/ubicación/sector
   - Output esperado: +30% CTR en landing pages internas

9. **Code splitting admin**
   - `React.lazy()` + `Suspense` para Islands CRM
   - Output esperado: bundle admin reducido en ~30%

10. **Imágenes optimizadas con Astro Image**
    - Reemplazar `<img>` por `<Image>` de astro/assets
    - Formatos WebP/AVIF automáticos
    - Probable impacto: -30% peso en páginas con muchas imágenes

### P3 — nice to have

11. **Migrar secrets a Cloudflare Secrets Store**
    - Hoy las URLs están en `wrangler.jsonc` vars
    - Mover API keys reales a Secrets Store
    - Output esperado: `wrangler secret put` para cada secret

12. **i18n real (no solo hreflang)**
    - Hoy hay hreflang declarado pero el contenido está solo en es-CL
    - Si se quiere atender mercado LATAM (es-419), traducir contenido
    - Decisión de scope con Kammler

13. **PWA completa**
    - `site.webmanifest` existe pero falta service worker
    - Agregar service worker para offline + push notifications
    - Output esperado: PWA instalable desde Chrome

---

## Archivos Clave

```
src/lib/crm-data.ts        # ⭐ v3.0 — Data layer CRM (834 LOC)
src/lib/seo.ts             # ⭐ v3.0 — 9 schemas SEO/GEO
src/lib/constants.ts       # ⭐ v4.0 — ADMIN_NAV_GROUPS solo CRM + BUNDLE_VERSION v4.0.0
src/lib/api.ts             # ⭐ v4.0 — auth + crm + imageUrl (eliminado cms/media)
src/lib/auth.ts            # JWT con access + refresh token
src/lib/content.ts         # Contenido del sitio
src/lib/icons.ts           # ICONS + SERVICE_ICONS + SECTOR_ICONS
src/lib/validation.ts      # validateLead para forms
src/styles/global.css      # Tailwind v4 + admin shell (37KB)
src/layouts/AdminLayout.astro    # Grid shell admin
src/layouts/BaseLayout.astro     # Layout público (schemas, OG, hreflang)
src/components/admin/AdminSidebar.astro  # Sidebar CRM-only
src/components/admin/AdminTopbar.astro   # Topbar
src/components/RelatedLinks.astro        # Cluster SEO interno
src/components/Icon.astro                # Iconos SVG
src/components/HowItWorks.astro          # ⭐ v4.0 — Restaurado
src/components/LeadCTA.astro             # ⭐ v4.0 — Restaurado (5 variantes)
src/components/TrustSignals.astro        # ⭐ v4.0 — Restaurado
src/pages/index.astro                    # ⭐ v4.0 — FAQ schema + 4 secciones de conversión
src/pages/admin/leads/[id].astro         # Lead 360° SSR
src/pages/sitemap.xml.ts                 # 186 URLs con hreflang
src/pages/robots.txt.ts                  # v3 robots con bots específicos
public/styles/site.css       # Design system público
public/styles/dark.css       # Override Guard Pod / Ajax
public/styles/main.css       # Legacy
astro.config.mjs             # Astro + Cloudflare Workers (output: 'server')
wrangler.jsonc               # Worker config
package.json                 # v4.0.0
```

---

## Comandos

```bash
npm run dev         # Desarrollo local
npm run build       # Build producción (~19s server)
npm run check       # Type checking
npm run test        # Vitest (27 tests, ~700ms)
npm run test:e2e    # Playwright E2E
npm run preview     # Preview con Wrangler
npm run deploy      # astro build && wrangler deploy
npm run lighthouse  # Auditoría Lighthouse
```

---

## Variables de Entorno

```bash
# .env (desarrollo local)
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=http://localhost:4321

# .env.production / wrangler.jsonc vars
PUBLIC_API_URL=https://guardman.oficinadesarrollo33.workers.dev
PUBLIC_SITE_URL=https://guardman.cl
```

---

## Tarballs y snapshots

- `guardman-v2.1.0-2026-07-13.tar.gz` — snapshot original v2.1.0 (en directorio)
- `guardman-v3.0.0-2026-07-13.tar.gz` — código fuente v3.0.0 (en directorio padre)
- `guardman-v3.0.0-2026-07-13-live.tar.gz` — snapshot de lo que estaba deployado antes de v4.0
- `guardman-v4.0.0-2026-07-13.tar.gz` — código fuente v4.0.0 (en directorio padre)
- `guardman-v2.1.0-2026-07-13-backup.tar.gz` — snapshot defensivo pre-v3 (rollback a v2.1.0)
- `guardman-v3.0.0-2026-07-13-live-backup.tar.gz` — snapshot defensivo pre-v4.0 (rollback a v3.0)
