# Prompt para Coding Agent — GuardMan Chile v3.0.0

Eres un senior full-stack developer. Tu objetivo es ejecutar las tareas pendientes del proyecto GuardMan Chile (ver `PLAN_DE_TRABAJO.md` sección "Pendiente para v3.1+"). v3.0.0 ya está deployado y funcionando.

## Estado del proyecto

- **Versión actual:** v3.0.0 — deployada y verificada
- **URL live:** https://guardman-astro.oficinadesarrollo33.workers.dev
- **Version ID:** `09d7d4eb-56c0-4316-96fa-32b1dcfefb80`
- **Build:** 37.48s, 177 assets, gzip 294.62 KiB
- **Tests:** 27/27 OK
- **Type errors:** 0
- **Stack:** Astro 6 (`output: 'server'`) + React 19 + Tailwind v4 + Cloudflare Workers
- **Backend:** Worker API externo en `guardman.oficinadesarrollo33.workers.dev`

## Lo que NO debes hacer

- **No reescribir el proyecto desde cero** — el v3.0.0 está completo, las tareas pendientes son incrementales
- **No tocar la lógica CRM** (`src/lib/crm-data.ts`, `src/islands/crm/*`) — son mocks funcionales, no inventar
- **No mover páginas a static output** — el proyecto es `output: 'server'`, todas las rutas son SSR/dinámicas
- **No agregar deps nuevas** sin justificación — el package.json está optimizado
- **No usar `getStaticPaths()`** en páginas con rutas dinámicas — usar `Astro.params.id` (fix ya aplicado en `/admin/leads/[id].astro`)
- **No borrar el snapshot defensivo** `guardman-v2.1.0-2026-07-13-backup.tar.gz` — es el rollback
- **No migrar DNS del custom domain** sin aprobación explícita de Kammler — `guardman.cl` sigue en App Engine por decisión previa
- **No escribir 5 archivos en paralelo** — Kammler prefiere 1 brief → revisar → aprobar → derivar

## Reglas

- Lee `PLAN_DE_TRABAJO.md` para entender el contexto completo
- Lee `STATUS.md` para ver el estado actual del deploy
- Lee `CHANGELOG.md` para entender qué cambió en cada versión
- Mantén el design system existente (`site.css`, `dark.css`, `main.css`) — NO reescribir
- Si hay errores de TypeScript, arréglalos antes de continuar
- Si rompes un test, arréglalo y documenta por qué
- Después de cada cambio: `npm run check && npm test && npm run build`
- Deploy solo cuando todos los checks pasan
- Reporta estado al final con: qué se hizo, qué se saltó, qué se descubrió

## Tareas pendientes (en orden de prioridad)

### P0 — esta semana

#### 1. Custom domain `guardman.cl` → Cloudflare Workers
**Output esperado:** `https://guardman.cl/` responde con el HTML de v3.0.0
- Decidir: ¿migrar DNS o dejar staging?
- Si migrar:
  - Actualizar Worker Route en dashboard de Cloudflare para `guardman.cl/*` y `www.guardman.cl/*`
  - Verificar que no hay conflicto con el `Server: ESF` actual (App Engine)
  - Validar con curl que el HTML coincide con workers.dev
  - Verificar sitemap.xml accesible en `https://guardman.cl/sitemap.xml`

#### 2. Playwright E2E suite completo
**Output esperado:** 2 specs verdes (`tests/e2e/public.spec.ts`, `tests/e2e/admin.spec.ts`)
- Correr `npx playwright test`
- Si fallan, ajustar selectores (la v3 cambió estructura de admin y páginas detalle)
- Capturar screenshots de smoke test
- Documentar cualquier cambio necesario en los specs

#### 3. Lighthouse audit
**Output esperado:** Reporte con scores > 90 en todas las categorías
- `npm run lighthouse` en homepage, un servicio, una ubicación
- Si score < 90: corregir issue específico
- Común: imágenes sin dimensiones, JS bloqueante, falta de preload de fuentes
- Documentar fixes aplicados

### P1 — próximas 2 semanas

#### 4. Verificar backend Worker para endpoints CRM
**Output esperado:** Lista de endpoints + estado (existe / no existe / mock)
- El frontend llama a `${PUBLIC_API_URL}/api/crm/leads/capture` (en `contacto.astro`)
- Verificar que el backend Worker `guardman.oficinadesarrollo33.workers.dev` tiene:
  - `POST /api/crm/leads/capture`
  - `GET /api/cms/content`
  - `GET /api/crm/leads`
  - `GET /api/media`
  - etc.
- Si los endpoints no existen: hay que crearlos (probablemente en otro repo, no en este)
- Si existen pero son mocks: dejarlo documentado en `docs/backend-status.md`

#### 5. Title único por admin page
**Output esperado:** 15 admin pages con `<title>` específico
- Verificar cada `src/pages/admin/*.astro` tiene title descriptivo
- Patrón sugerido: `${title} — GuardMan Admin`
- Si hay titles genéricos, corregir y verificar con curl

#### 6. Hreflang verificar en producción
**Output esperado:** Reporte de indexación con hreflang correcto
- Confirmar que Google indexa las páginas con hreflang correcto
- Revisar Google Search Console (si está configurado)
- Verificar que el atributo `xhtml:link rel="alternate" hreflang="..."` está en el HTML

### P2 — backlog (cuando haya tiempo)

7. **Evaluar D1 vs mocks para CRM data** — los `crmLeads` son estáticos, si el operador los usa de verdad hay que migrar a D1 o R2
8. **PWA completa** — service worker + push notifications (manifest ya existe)
9. **Imágenes optimizadas con Astro Image** — reemplazar `<img>` por `<Image>` de astro/assets
10. **Code splitting admin** — `React.lazy()` + `Suspense` para CMSEditor, MediaEditor, IntelView

### P3 — nice to have

11. **i18n real** — hoy hay hreflang declarado pero el contenido está solo en es-CL
12. **Migrar secrets a Cloudflare Secrets Store** — mover API keys de `wrangler.jsonc` vars
13. **CI/CD con E2E** — agregar Playwright al pipeline antes de deploy

## Archivos importantes

```
src/lib/constants.ts        # SITE, servicios, ubicaciones, ADMIN_NAV_GROUPS, ZONE_CONTEXT
src/lib/api.ts              # Cliente HTTP unificado con JWT refresh
src/lib/auth.ts             # JWT con access + refresh token
src/lib/crm-data.ts         # Data layer CRM (834 LOC, mocks)
src/lib/seo.ts              # 9 schemas SEO/GEO
src/lib/content.ts          # Contenido del sitio
src/lib/icons.ts            # ICONS + SERVICE_ICONS + SECTOR_ICONS
src/lib/validation.ts       # Validación forms
src/styles/global.css       # Tailwind v4 + admin shell (37KB)
src/layouts/BaseLayout.astro
src/layouts/AdminLayout.astro
src/components/admin/AdminSidebar.astro
src/components/admin/AdminTopbar.astro
src/components/RelatedLinks.astro
src/components/Icon.astro
src/islands/crm/            # 9 componentes CRM
src/pages/admin/leads/[id].astro  # ⚠️ getStaticPaths NO soportado — usar Astro.params.id
src/pages/sitemap.xml.ts    # 170 URLs
src/pages/robots.txt.ts     # v3.0
public/styles/site.css      # Design system público
public/styles/dark.css      # Override Guard Pod / Ajax
public/styles/main.css      # Legacy
astro.config.mjs            # Astro + Cloudflare Workers (output: 'server')
wrangler.jsonc              # Worker config (no Pages)
package.json                # v3.0.0
```

## Gotchas conocidos

- **Astro 6 + esbuild**: JSX inline con `&&` + type assertion rompe esbuild. Extraer a componente `.astro` separado.
- **Template literals con `$` literal**: romper esbuild. Usar concatenación sin backticks.
- **Astro redirect en SSR**: `Astro.redirect()` funciona, pero `getStaticPaths()` NO en `output: 'server'`.
- **D1 migrations no idempotentes**: SQLite no soporta `ADD COLUMN IF NOT EXISTS`. Aplicar nueva directo con `wrangler d1 execute --file=...`.
- **Cloudflare DO `new_sqlite_classes` migration obligatorio**: al agregar workflow/clase nueva, tag único + commit del `_entry.ts` regenerado.
- **Bindings en wrangler.jsonc**: si el Worker no encuentra el binding, los assets estáticos fallan. Verificar `vars` antes de deploy.

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

**Empieza con la tarea P0 que Kammler apruebe. No empieces todas en paralelo.**
