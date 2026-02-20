# 🧹 Guardman — Codebase Cleanup Audit

> **Objetivo**: Identificar y documentar todos los elementos redundantes, obsoletos o innecesarios que deben ser eliminados antes de ejecutar el plan de desarrollo de 8 fases (`convex_plan.md` Draft 7).
>
> **Metodología**: 3 loops de investigación cruzando cada archivo contra el plan.
>
> **Fecha**: 19 de febrero de 2026

---

## Resumen Ejecutivo

| Categoría | Archivos | Acción |
|-----------|----------|--------|
| Root — Archivos de debug/log | 6 | 🗑️ Eliminar |
| Root — Configs obsoletos | 3 | 🗑️ Eliminar |
| Root — Documentación legacy | 1 | 🗑️ Eliminar |
| Web — Componentes muertos | 5 | 🗑️ Eliminar |
| Web — Backup / .bak | 2 | 🗑️ Eliminar |
| Web — Datos estáticos obsoletos | 2 | 🔄 Refactorizar → Eliminar |
| Web — Blog estático (Content Collections) | 10 | 🗑️ Eliminar (ya migrado a Convex) |
| Web — API endpoints legacy | 2 | 🗑️ Eliminar |
| Web — Middleware vacío | 1 | 🗑️ Eliminar |
| Web — Wrappers Convex redundantes | 2 | 🔄 Consolidar |
| Convex — Funciones duplicadas/debug | 3 | 🗑️ Eliminar |
| Scripts — Herramientas de migración | 4 | 🗑️ Eliminar |
| Admin — Sistema actual (reemplazo total por Refine) | ~17 páginas + 3 componentes | 🔄 Reemplazar |
| **TOTAL** | **~50+ elementos** | |

---

## 1. Root — Archivos de Debug y Logs

Estos archivos son productos de sesiones de desarrollo y debugging. No pertenecen al repositorio.

| Archivo | Tamaño | Razón de eliminación |
|---------|--------|---------------------|
| `build-err.log` | 5.9 KB | Log de error de build antiguo |
| `dev-err.log` | variable | Log de errores de dev server |
| `dev-out.log` | variable | Salida de dev server |
| `dev.log` | 19 B | Log de desarrollo |
| `check_output_restore.txt` | 50.5 KB | Output de verificación de schema (one-time debug) |
| `schema-validation-evidence.txt` | variable | Evidencia de validación de schema (one-time debug) |

**Acción**: `🗑️ Eliminar todos`. Agregar al `.gitignore`:
```gitignore
*.log
check_output_restore.txt
schema-validation-evidence.txt
```

---

## 2. Root — Configuraciones Obsoletas

| Archivo | Contenido | Razón de eliminación |
|---------|-----------|---------------------|
| `stitch_mcp_config.json` | Config de Google Stitch MCP con API key hardcoded | ⚠️ API key expuesta + servicio no relevante al plan |
| `pnpm-workspace.yaml` | `packages: ['web', 'admin']` (4 líneas) | El proyecto usa **npm**, no pnpm. Archivo creado por error durante la migración |
| `MIGRATION_PLAN.md` | Plan de migración Admin Astro → Vite (1,049 líneas) | ✅ Migración COMPLETADA. Toda la información útil ya está en `convex_plan.md` |

**Acción**: `🗑️ Eliminar los 3`.

---

## 3. Web — Componentes Muertos (Dead Code)

### 3.1 `DynamicSection.astro` + 3 componentes Ajax

Estos 4 archivos forman un sistema de secciones dinámicas que **nunca se importa desde ninguna página**:

| Archivo | Líneas | Verificación |
|---------|--------|-------------|
| `web/src/components/DynamicSection.astro` | 38 | `grep DynamicSection web/src/pages/` → **0 resultados** |
| `web/src/components/sections/FAQAjax.astro` | 80 | Solo importado desde `DynamicSection.astro` (que es dead code) |
| `web/src/components/sections/HeroAjax.astro` | 110 | Solo importado desde `DynamicSection.astro` |
| `web/src/components/sections/ServicesGridAjax.astro` | 108 | Solo importado desde `DynamicSection.astro` |

**Contexto**: Estos componentes son duplicados "Ajax" de `FAQ.astro`, `Hero.astro`, y `ServicesGrid.astro`. Fueron creados como parte de un sistema de content blocks dinámicos (`content_blocks` table en Convex), pero el sistema nunca se conectó a ninguna página.

**Acción**: `🗑️ Eliminar los 4 archivos`. Los componentes "normales" (`FAQ.astro`, `Hero.astro`, `ServicesGrid.astro`) ya manejan datos dinámicos desde Convex vía SSR.

### 3.2 `index.static.astro` — Backup de Homepage

| Archivo | Líneas | Contenido |
|---------|--------|-----------|
| `web/src/pages/index.static.astro` | 113 | Copia exacta del homepage original con data fetching de Convex |

**Contexto**: Creado como backup durante la iteración del diseño del homepage. El `index.astro` actual es la versión activa.

**Acción**: `🗑️ Eliminar`.

---

## 4. Web — Archivos Backup (.bak)

| Archivo | Razón |
|---------|-------|
| `web/src/pages/sitemap.xml.ts.bak` | Backup del sitemap que fue reescrito. El `.bak` no sirve |

**Acción**: `🗑️ Eliminar`.

---

## 5. Web — Datos Estáticos Obsoletos

### 5.1 `web/src/data/site.ts` (103 líneas)

**Contenido actual**: Objeto `SiteConfig` hardcoded con:
- Nombre, URL, descripción del sitio
- Teléfono, WhatsApp, email
- Dirección completa
- Links de redes sociales
- Colores del brand
- Horarios
- Estadísticas (founded, clients, guards)
- 4 funciones helper (`getWhatsAppUrl`, `getPhoneLink`, `getEmailLink`, `getGoogleMapsUrl`)

**Estado en el plan**: §34.3 Phase 2 (Step 2.3) crea `web/src/data/site.ts` como un **módulo simplificado** que importa de la tabla `site_config` de Convex. Los helpers se mueven a `lib/`.

**Acción**: `🔄 Refactorizar en Phase 2` → Reemplazar por versión que lee de Convex + mover helpers a `lib/helpers.ts`. **NO eliminar antes de Phase 2** (es dependency de Header, Footer, SEO schemas).

**Dependencias actuales** (verificar antes de eliminar):
- `web/src/components/layout/Footer.astro` — usa `site.phone`, `site.email`, `site.social`
- `web/src/components/layout/Header.astro` — usa `site.name`
- `web/src/components/seo/OrganizationSchema.astro` — usa `site.address`
- `web/src/pages/index.static.astro` — usa `site` (se elimina antes)

### 5.2 `web/src/content/config.ts` + 9 blog posts estáticos

| Archivo | Contenido |
|---------|-----------|
| `web/src/content/config.ts` | Schema de Astro Content Collections para blog (18 líneas) |
| `web/src/content/blog/alarmas-ajax-tecnologia.mdx` | Blog post MDX (6.9 KB) |
| `web/src/content/blog/alarmas-ajax.md` | Blog post MD (2.6 KB) |
| `web/src/content/blog/elegir-empresa-seguridad.md` | Blog post MD (3.2 KB) |
| `web/src/content/blog/guardias-os10-certificados.mdx` | Blog post MDX (6.1 KB) |
| `web/src/content/blog/guardias-os10.md` | Blog post MD (2.5 KB) |
| `web/src/content/blog/guardpod-modulos-seguridad.mdx` | Blog post MDX (7.6 KB) |
| `web/src/content/blog/patrullaje-condominios.mdx` | Blog post MDX (7.7 KB) |
| `web/src/content/blog/seguridad-condominios.mdx` | Blog post MDX (8.1 KB) |
| `web/src/content/blog/seguridad-eventos.md` | Blog post MD (2.7 KB) |

**Contexto**: El blog ya está migrado a Convex (tabla `blog_posts`). Estos archivos estáticos son la fuente original que fue migrada mediante los scripts `migrate-blog-to-convex.ts` y `seed-blog-to-convex.ts`.

**Verificación**: El blog actual (`web/src/pages/blog/[slug].astro`) ya lee de Convex, no de Content Collections.

**Acción**: `🗑️ Eliminar todo el directorio web/src/content/` (config.ts + 9 posts). El contenido ya existe en la tabla `blog_posts` de Convex.

---

## 6. Web — API Endpoints Legacy

### 6.1 `web/src/pages/api/admin/auth.ts` (42 líneas)

**Contenido**: Sistema de autenticación por **cookie + contraseña fija** (`guardman2024`).

**Problema**: Este es el sistema de auth pre-Convex. El admin actual usa **Convex Auth** (`@convex-dev/auth`) con email/password vía el componente `AuthGuard.tsx` en la app admin de Vite. Este endpoint ya no se usa.

**Acción**: `🗑️ Eliminar`.

### 6.2 `web/src/pages/api/webhooks/sheets.ts` (120 líneas)

**Contenido**: Webhook que reenvía datos de leads a Google Sheets vía Google Apps Script.

**Estado en el plan**: El plan no menciona Google Sheets. Los leads van directamente a Convex (`leads` table) y serán gestionados desde el admin CMS.

**Acción**: `🗑️ Eliminar`. Los leads se gestionan exclusivamente desde Convex.

> ⚠️ **NOTA**: `web/src/pages/api/leads.ts` (90 líneas) es el endpoint **activo** para crear leads en Convex. **NO ELIMINAR**.

---

## 7. Web — Middleware Vacío

| Archivo | Contenido |
|---------|-----------|
| `web/src/middleware.ts` | No-op middleware (9 líneas). Define `PUBLIC_ADMIN_ROUTES` pero el handler solo hace `return next()`. |

**Contexto**: Creado para proteger rutas `/admin/*` con cookies, pero desde que admin es una app Vite separada, este middleware no hace nada.

**Acción**: `🗑️ Eliminar`.

---

## 8. Web — Wrappers Convex Redundantes

| Archivo | Líneas | Función |
|---------|--------|---------|
| `web/src/components/forms/ConvexContactForm.tsx` | 22 | Wrapper con `<ConvexProvider>` alrededor de `ContactForm` |
| `web/src/components/forms/ConvexLeadForm.tsx` | 25 | Wrapper con `<ConvexProvider>` alrededor de `LeadForm` |

**Contexto**: Estos wrappers existen porque los componentes React necesitan `ConvexProvider` cuando se usan en archivos `.astro` con `client:*` directives. Cada wrapper crea su propia instancia del `ConvexReactClient`.

**Estado en el plan**: Phase 2 (Step 2.2) reestructura los forms. El `LeadForm` se simplifica y el `ContactForm` se integra en el Footer.

**Acción**: `🔄 Consolidar en Phase 2`. Crear un solo wrapper `ConvexWrapper.tsx` genérico, o integrar el provider a nivel de layout. **NO eliminar antes de Phase 2** (son dependencias activas).

---

## 9. Convex — Funciones Duplicadas y Debug

### 9.1 `convex/communes.ts` (116 líneas)

**Contenido**: CRUD completo para la tabla `communes` (getAll, getBySlug, create, update, updateSEO, delete, reorder).

**Problema**: Este archivo es un **duplicado funcional** de `convex/locations.ts`, que ya maneja todas las operaciones sobre `communes`:
- `locations.ts` tiene `getAllCommunes`, `getCommuneBySlug`, `createCommune`, `bulkImportCommunes`, `getGroupedCommunes`, `getCommuneWithSEO`, etc.
- `communes.ts` expone las mismas operaciones con nombres levemente diferentes
- Ambos archivos operan sobre la misma tabla `communes` en el schema

**Verificación**: `locations.ts` tiene 18+ referencias en el codebase. `communes.ts` solo es referenciado desde `_generated/api.d.ts` (auto-generado).

**Acción**: `🗑️ Eliminar`. Actualizar cualquier referencia a `api.communes.*` para usar `api.locations.*`.

### 9.2 `convex/debug_pages.ts` (8 líneas)

**Contenido**: Un solo query que lista todos los registros de la tabla `pages`.

**Problema**: Es una función de debugging, sin validación ni filtros. Las funciones de `pages` ya existen en el CRUD estándar.

**Acción**: `🗑️ Eliminar`.

### 9.3 `convex/_test/utils.ts` (208 líneas)

**Contenido**: Utilidades de testing con mocks (`createMockContext`, `createMockQuery`, `createTestLead`, `waitFor`).

**Problema**: No hay tests que importen este archivo. Es un scaffold de testing que nunca se conectó a un test runner. El plan (Phase 7) define una estrategia de testing diferente usando Playwright + Lighthouse.

**Acción**: `🗑️ Eliminar todo el directorio convex/_test/`.

---

## 10. Scripts de Migración One-Time

| Script | Líneas | Propósito |
|--------|--------|-----------|
| `scripts/copy-admin-to-output.js` | 39 | Copia build de admin a `.vercel/output/static/admin` |
| `scripts/copy-admin.js` | 42 | Copia build de admin a `web/dist/admin` |
| `scripts/migrate-blog-to-convex.ts` | 310 | Parser de frontmatter MD/MDX → Convex blog_posts |
| `scripts/seed-blog-to-convex.ts` | 101 | Seeder de blog posts a Convex |

**Contexto**:
- `copy-admin*.js`: Fueron necesarios durante la transición a monorepo. Con Vercel configurado correctamente, ya no se necesitan.
- `migrate-blog*.ts` / `seed-blog*.ts`: Migración one-time completada. Los datos ya están en Convex.

**Acción**: `🗑️ Eliminar el directorio scripts/` completo.

---

## 11. Admin — Sistema Actual (Reemplazo por Refine)

El plan (Phase 4) reemplaza completamente el admin actual con **Refine + Ant Design**. El sistema actual consiste en:

### Archivos que serán REEMPLAZADOS:

| Archivo | Líneas | Reemplazo |
|---------|--------|-----------|
| `admin/src/App.tsx` | ~90 | Refine `<App>` con `<Refine>` provider |
| `admin/src/main.tsx` | ~15 | Nuevo entry point con Refine providers |
| `admin/src/index.css` | ~70 | Ant Design themes |
| `admin/src/components/layout/Layout.tsx` | ~20 | `<ThemedLayoutV2>` de Refine |
| `admin/src/components/layout/Sidebar.tsx` | ~140 | Ant Design `<Menu>` con routing automático |
| `admin/src/components/shared/AuthGuard.tsx` | ~30 | Refine `authProvider` |
| `admin/src/lib/convex.ts` | ~10 | Refine `dataProvider` |
| `admin/src/lib/auth.tsx` | ~10 | Refine `authProvider` + `<Authenticated>` |
| `admin/src/pages/` (17 directorios ×1 archivo c/u) | ~17×80 | Refine resource configs + auto-generated CRUD |

**Acción**: `🔄 Reemplazo total en Phase 4`. **NO eliminar contenido antes de Phase 4** — el admin actual debe seguir funcionando hasta que Refine esté listo. Los archivos de pages contienen lógica de formularios que puede servir como referencia.

---

## 12. Admin — Cosas que SÍ se conservan (NO eliminar)

| Archivo/Tabla | Razón |
|---------------|-------|
| `convex/admin_utils.ts` | Utilidades admin (promoteToAdmin, createAdminUser) — se **mantienen** como herramientas CLI |
| `convex/content_blocks.ts` | Activamente usado por `index.astro` — **refactorizar** para soportar nuevos tipos |
| `web/src/pages/api/leads.ts` | Endpoint activo para crear leads — **mantener** hasta Phase 2 |
| `web/src/components/forms/LeadForm.tsx` | Form activo (22 KB) — **refactorizar** en Phase 2 |
| `web/src/components/forms/ContactForm.tsx` | Form activo en Footer — **mantener** hasta Phase 2 |
| `web/src/components/og/Template.tsx` | Template de OpenGraph images — **mantener** |
| `web/src/utils/seo.ts` | Utilidades SEO — **mantener y extender** en Phase 6 |
| `convex/locations.ts` | Versión canónica de communes CRUD — **mantener** |
| `e2e/` | Tests E2E — **mantener y extender** en Phase 7 |

---

## 13. Orden de Ejecución Recomendado

### Paso 1: Limpieza inmediata (antes de Phase 0)

Estos archivos son **basura pura** sin dependencias:

```bash
# Root — Logs y debug
rm build-err.log dev-err.log dev-out.log dev.log
rm check_output_restore.txt schema-validation-evidence.txt

# Root — Configs obsoletos
rm stitch_mcp_config.json pnpm-workspace.yaml MIGRATION_PLAN.md

# Web — Dead code sin importadores
rm web/src/components/DynamicSection.astro
rm web/src/components/sections/FAQAjax.astro
rm web/src/components/sections/HeroAjax.astro
rm web/src/components/sections/ServicesGridAjax.astro
rm web/src/pages/index.static.astro
rm web/src/pages/sitemap.xml.ts.bak

# Web — Blog estático ya migrado a Convex
rm -rf web/src/content/

# Web — API legacy
rm web/src/pages/api/admin/auth.ts
rm web/src/pages/api/webhooks/sheets.ts
rm web/src/middleware.ts

# Convex — Dead code
rm convex/communes.ts
rm convex/debug_pages.ts
rm -rf convex/_test/

# Scripts — Migración completada
rm -rf scripts/
```

**Total archivos eliminados**: ~30 archivos/directorios
**Riesgo**: ⚡ Bajo — ninguno de estos archivos tiene importadores activos.

### Paso 2: Refactoring en Phase 2

- Reemplazar `web/src/data/site.ts` con versión que lee de Convex
- Consolidar `ConvexContactForm.tsx` + `ConvexLeadForm.tsx` → wrapper genérico
- Migrar helpers de `site.ts` a `lib/helpers.ts`

### Paso 3: Reemplazo en Phase 4

- Reemplazar todo el admin actual con Refine + Ant Design

---

## 14. Impacto en `.gitignore`

Agregar estas líneas al `.gitignore` existente:

```gitignore
# Development logs
*.log
check_output_restore.txt
schema-validation-evidence.txt

# MCP configs (contienen API keys)
stitch_mcp_config.json

# Backup files
*.bak
*.static.astro
```

---

## 15. Post-Limpieza: Verificación

Después del Paso 1, ejecutar:

```bash
# Verificar que el build web sigue funcionando
cd web && npm run build

# Verificar que convex dev funciona sin errores
npx convex dev --once

# Verificar que admin sigue funcionando  
cd admin && npm run build
```

---

> **Documento generado**: 19 de febrero de 2026
> **Basado en**: `convex_plan.md` Draft 7 (5,447 líneas)
> **Loops de investigación**: 3 (estructura → análisis cruzado → verificación de referencias)
