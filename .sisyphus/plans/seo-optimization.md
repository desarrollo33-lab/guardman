# SEO Optimization Plan - Guardman Chile

## TL;DR

> **Quick Summary**: Optimización técnica SEO completa: habilitar sitemap de Astro, agregar lazy loading a imágenes, implementar FAQ schema, configurar cache headers, y setup de Search Console + Analytics.
>
> **Deliverables**:
>
> - Sitemap oficial de Astro habilitado
> - Imágenes con lazy loading y formatos modernos
> - FAQ Schema implementado en homepage
> - vercel.json con cache headers
> - og-default.jpg creado
> - Apple touch icon agregado
> - Google Search Console configurado
> - Google Analytics 4 configurado
> - Meta descriptions optimizadas para CTR
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Sitemap → Images → Schema → Analytics

---

## Context

### Original Request

Analizar la app completa con foco en SEO y crear un plan de mejoras necesarias.

### Interview Summary

**Key Discussions**:

- Prioridad: Technical SEO primero
- Scope: CRÍTICOS + MEDIOS (15 mejoras)
- Analytics: No configurado - incluir setup
- Imágenes: Mixto (propias + Unsplash)

**Research Findings**:

- Sitemap de Astro está comentado (línea 4 astro.config.mjs)
- FAQSchema component existe pero no se usa en homepage
- Imágenes de Unsplash sin lazy loading
- vercel.json no existe
- robots.txt bien configurado
- Canonical URLs implementadas correctamente

### Metis Review

**Identified Gaps** (addressed):

- Guardrails explícitos agregados para evitar scope creep
- Acceptance criteria con comandos ejecutables (curl, lighthouse)
- Edge cases: DNS access blocking analytics, brand assets for og:image

---

## Work Objectives

### Core Objective

Mejorar el SEO técnico del sitio guardman.cl para aumentar visibilidad en buscadores y mejorar Core Web Vitals.

### Concrete Deliverables

- `astro.config.mjs` - sitemap habilitado
- `vercel.json` - cache headers configurados
- `/public/og-default.jpg` - imagen OG por defecto
- `/public/apple-touch-icon.png` - icon para iOS
- `src/pages/index.astro` - FAQ Schema implementado
- Imágenes con lazy loading y atributos width/height
- Google Search Console property verificada
- Google Analytics 4 configurado

### Definition of Done

- [ ] Lighthouse SEO score > 90
- [ ] Google Rich Results Test pasa para homepage
- [ ] Todas las imágenes tienen loading="lazy"
- [ ] Cache headers retornan max-age apropiado
- [ ] GSC muestra sitemap indexado sin errores
- [ ] GA4 real-time report muestra actividad

### Must Have

- Sitemap oficial de Astro funcionando
- FAQ Schema en homepage
- Lazy loading en todas las imágenes
- Cache headers para assets estáticos
- Search Console verificada

### Must NOT Have (Guardrails - Metis)

❌ **Content Writing**:

- No escribir nuevos artículos de blog
- No reescribir contenido existente (excepto meta descriptions)
- No optimizar párrafos - solo titles/descriptions

❌ **Design Work**:

- No rediseñar og:image - usar assets existentes
- No cambios de UI

❌ **Infrastructure**:

- No migración de CDN
- No cambios de hosting
- No cambios a Convex schema

❌ **Advanced Analytics**:

- No GTM setup - solo GA4 básico
- No funnels de conversión
- No custom event tracking (solo pageviews)
- No Looker Studio dashboards

❌ **Schema Expansion**:

- Solo FAQSchema (ya existe componente)
- No agregar LocalBusiness, Organization adicionales

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: NO
- **Automated tests**: NONE (technical SEO, no unit tests needed)
- **Framework**: N/A
- **Agent-Executed QA**: ALWAYS - curl commands, lighthouse, rich results test

### QA Policy

Every task includes agent-executed QA scenarios with evidence capture.

| Deliverable Type | Verification Tool        | Method                                     |
| ---------------- | ------------------------ | ------------------------------------------ |
| URLs/Endpoints   | Bash (curl)              | HTTP status, headers, content verification |
| Performance      | Lighthouse CLI           | SEO score, Core Web Vitals                 |
| Schema           | Google Rich Results Test | URL validation                             |
| Images           | Bash (curl + file)       | Dimensions, format, HTTP status            |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — config + assets):
├── Task 1: Habilitar sitemap de Astro [quick]
├── Task 2: Crear vercel.json con cache headers [quick]
├── Task 3: Crear og-default.jpg [quick]
└── Task 4: Agregar apple-touch-icon.png [quick]

Wave 2 (After Wave 1 — image optimization):
├── Task 5: Lazy loading en imágenes de servicios [quick]
├── Task 6: Lazy loading en imágenes de comunas [quick]
├── Task 7: Lazy loading en imágenes de blog [quick]
└── Task 8: Generar versiones webp de imágenes estáticas [unspecified-high]

Wave 3 (After Wave 2 — schema + meta):
├── Task 9: Implementar FAQSchema en homepage [quick]
├── Task 10: Optimizar meta descriptions para CTR [quick]
└── Task 11: Agregar preconnect para recursos externos [quick]

Wave 4 (After Wave 3 — analytics setup):
├── Task 12: Configurar Google Search Console [unspecified-high]
└── Task 13: Configurar Google Analytics 4 [unspecified-high]

Wave FINAL (After ALL tasks — verification):
├── Task F1: SEO compliance audit (oracle)
├── Task F2: Performance review (unspecified-high)
├── Task F3: Schema validation (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 5-7 → Task 9 → Task 12-13
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1 & 2)
```

### Dependency Matrix

| Task  | Depends On | Blocks | Wave  |
| ----- | ---------- | ------ | ----- |
| 1-4   | —          | 5-11   | 1     |
| 5-7   | 1          | 9      | 2     |
| 8     | —          | —      | 2     |
| 9-11  | 1          | 12-13  | 3     |
| 12-13 | —          | F1-F4  | 4     |
| F1-F4 | 1-13       | —      | FINAL |

### Agent Dispatch Summary

| Wave  | # Parallel | Tasks → Agent Category                                 |
| ----- | ---------- | ------------------------------------------------------ |
| 1     | **4**      | T1-T2 → `quick`, T3-T4 → `quick`                       |
| 2     | **4**      | T5-T7 → `quick`, T8 → `unspecified-high`               |
| 3     | **3**      | T9-T11 → `quick`                                       |
| 4     | **2**      | T12-T13 → `unspecified-high`                           |
| FINAL | **4**      | F1 → `oracle`, F2-F3 → `unspecified-high`, F4 → `deep` |

---

## TODOs

- [ ] 1. Habilitar Sitemap de Astro

  **What to do**:
  - Descomentar `import sitemap from "@astrojs/sitemap"` en `astro.config.mjs`
  - Agregar `sitemap()` al array de integrations
  - Configurar con `canonicalURL: 'https://guardman.cl'`
  - Eliminar o renombrar el sitemap manual `src/pages/sitemap.xml.ts`

  **Must NOT do**:
  - No eliminar robots.txt
  - No cambiar la URL del sitio

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Config change simple, archivo único
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5-11 (necesitan sitemap funcionando)
  - **Blocked By**: None

  **References**:
  - `astro.config.mjs:4` - Línea donde sitemap está comentado
  - `astro.config.mjs:9` - Array de integrations donde agregar sitemap()
  - `src/pages/sitemap.xml.ts` - Sitemap manual actual (eliminar o renombrar)
  - Docs: `https://docs.astro.build/en/guides/integrations-guide/sitemap/`

  **Acceptance Criteria**:
  - [ ] `astro.config.mjs` tiene sitemap import descomentado
  - [ ] `sitemap()` agregado a integrations array
  - [ ] `npm run build` ejecuta sin errores
  - [ ] Build genera `/dist/sitemap-index.xml`

  **QA Scenarios**:

  ```
  Scenario: Sitemap generado correctamente
    Tool: Bash
    Preconditions: Build completado
    Steps:
      1. Run `npm run build`
      2. Check `ls dist/sitemap-*.xml`
      3. Run `curl -s http://localhost:4321/sitemap-index.xml | head -5`
    Expected Result: XML válido con <urlset> y URLs del sitio
    Evidence: .sisyphus/evidence/task-01-sitemap-generated.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): enable astro sitemap integration`
  - Files: `astro.config.mjs`
  - Pre-commit: `npm run build`

- [ ] 2. Crear vercel.json con Cache Headers

  **What to do**:
  - Crear archivo `vercel.json` en la raíz del proyecto
  - Configurar headers de cache para assets estáticos:
    - `/images/*` - 1 año (31536000s)
    - `/icons/*` - 1 año
    - `/*.js, /*.css` - 1 año
    - `/*.png, /*.jpg, /*.webp` - 1 año
  - Configurar header de security básico (X-Content-Type-Options)

  **Must NOT do**:
  - No agregar redirects (no solicitado)
  - No modificar configuración de funciones serverless
  - No cambiar headers de páginas dinámicas

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Crear archivo de configuración simple
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - Docs: `https://vercel.com/docs/projects/project-configuration`
  - `astro.config.mjs` - Verificar site URL para context

  **Acceptance Criteria**:
  - [ ] `vercel.json` existe en raíz del proyecto
  - [ ] JSON válido (parsea sin errores)
  - [ ] Headers configurados para `/images/*`, `/icons/*`
  - [ ] Cache-Control max-age = 31536000 para assets

  **QA Scenarios**:

  ```
  Scenario: Cache headers aplicados en producción
    Tool: Bash (curl)
    Preconditions: Deploy completado en Vercel
    Steps:
      1. Run `curl -I https://guardman.cl/images/guardman_logo.png`
      2. Grep for "Cache-Control"
    Expected Result: Header contiene "max-age=31536000"
    Evidence: .sisyphus/evidence/task-02-cache-headers.txt

  Scenario: JSON válido
    Tool: Bash
    Steps:
      1. Run `cat vercel.json | node -e "JSON.parse(require('fs').readFileSync(0))"`
    Expected Result: No error output
    Evidence: .sisyphus/evidence/task-02-json-valid.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): add vercel.json with cache headers`
  - Files: `vercel.json`

- [ ] 3. Crear og-default.jpg

  **What to do**:
  - Crear imagen OG por defecto en `/public/og-default.jpg`
  - Dimensiones: 1200x630px (estándar OG)
  - Usar brand assets existentes: logo (`public/images/guardman_logo.png`)
  - Incluir: Logo + nombre "Guardman Chile" + tagline breve
  - Formato: JPG con calidad optimizada (< 200KB)

  **Must NOT do**:
  - No rediseñar el logo
  - No crear nuevos brand assets
  - No usar imágenes de stock externas

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Crear archivo de imagen simple
  - **Skills**: [`frontend-ui-ux`]
    - Para crear imagen con buen diseño

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `public/images/guardman_logo.png` - Logo existente
  - `src/data/site.ts:48-49` - Colores de marca (#1E40AF primary, #F59E0B accent)
  - `src/layouts/BaseLayout.astro:19` - Referencia actual a og-default.jpg

  **Acceptance Criteria**:
  - [ ] `/public/og-default.jpg` existe
  - [ ] Dimensiones: 1200x630px (verificar con `file` command)
  - [ ] Tamaño < 200KB

  **QA Scenarios**:

  ```
  Scenario: OG image accesible
    Tool: Bash (curl)
    Steps:
      1. Run `curl -I https://guardman.cl/og-default.jpg`
      2. Check HTTP status and content-type
    Expected Result: 200 OK, Content-Type: image/jpeg
    Evidence: .sisyphus/evidence/task-03-og-image.txt

  Scenario: OG image dimensions correct
    Tool: Bash (file)
    Steps:
      1. Run `file public/og-default.jpg`
    Expected Result: Contains "1200 x 630" or similar
    Evidence: .sisyphus/evidence/task-03-og-dimensions.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): add default og:image`
  - Files: `public/og-default.jpg`

- [ ] 4. Agregar apple-touch-icon.png

  **What to do**:
  - Crear `/public/apple-touch-icon.png`
  - Dimensiones: 180x180px (estándar iOS)
  - Usar el logo de Guardman existente
  - Fondo: color primary (#1E40AF) o blanco según diseño

  **Must NOT do**:
  - No rediseñar el logo
  - No modificar otros favicons

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `public/images/guardman_logo.png` - Logo existente
  - `src/layouts/BaseLayout.astro:62` - Referencia actual a apple-touch-icon.png
  - `public/favicon.svg` - Favicon actual para referencia

  **Acceptance Criteria**:
  - [ ] `/public/apple-touch-icon.png` existe
  - [ ] Dimensiones: 180x180px

  **QA Scenarios**:

  ```
  Scenario: Apple touch icon accesible
    Tool: Bash (curl)
    Steps:
      1. Run `curl -I https://guardman.cl/apple-touch-icon.png`
    Expected Result: 200 OK, Content-Type: image/png
    Evidence: .sisyphus/evidence/task-04-apple-icon.txt
  ```

  **Commit**: YES (groups with Task 3)
  - Message: `feat(seo): add apple-touch-icon`
  - Files: `public/apple-touch-icon.png`

- [ ] 5. Lazy Loading en Imágenes de Servicios

  **What to do**:
  - Agregar `loading="lazy"` a todas las imágenes en `src/pages/servicios/[slug].astro`
  - Agregar atributos `width` y `height` explícitos para evitar CLS
  - Verificar que imágenes de Unsplash tengan loading lazy

  **Must NOT do**:
  - No cambiar las URLs de las imágenes
  - No agregar nuevas imágenes
  - No optimizar las imágenes (solo lazy loading)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: None
  - **Blocked By**: Task 1 (sitemap para contexto)

  **References**:
  - `src/pages/servicios/[slug].astro:42-46` - Imagen de hero del servicio
  - `src/pages/servicios/[slug].astro:137` - Imagen de pattern SVG

  **Acceptance Criteria**:
  - [ ] Todas las imágenes en `[slug].astro` tienen `loading="lazy"`
  - [ ] Imágenes tienen `width` y `height` definidos
  - [ ] `npm run build` sin errores

  **QA Scenarios**:

  ```
  Scenario: Lazy loading en página de servicio
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to https://guardman.cl/servicios/guardias-seguridad
      2. Check img elements have loading="lazy" attribute
      3. Scroll down and verify images load
    Expected Result: All <img> tags have loading="lazy"
    Evidence: .sisyphus/evidence/task-05-lazy-services.png
  ```

  **Commit**: NO (groups with Tasks 6, 7)
  - Files: `src/pages/servicios/[slug].astro`

- [ ] 6. Lazy Loading en Imágenes de Comunas

  **What to do**:
  - Agregar `loading="lazy"` a todas las imágenes en `src/pages/cobertura/[comuna].astro`
  - Agregar atributos `width` y `height` explícitos
  - Verificar imagen de hero de Unsplash

  **Must NOT do**:
  - No cambiar URLs de imágenes
  - No agregar nuevas imágenes

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/pages/cobertura/[comuna].astro:106-109` - Imagen de hero
  - También verificar componente LocalBusinessSchema si tiene imágenes

  **Acceptance Criteria**:
  - [ ] Todas las imágenes tienen `loading="lazy"`
  - [ ] Imágenes tienen `width` y `height`

  **QA Scenarios**:

  ```
  Scenario: Lazy loading en página de comuna
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to https://guardman.cl/cobertura/las-condes
      2. Check img elements have loading="lazy" attribute
    Expected Result: All <img> tags have loading="lazy"
    Evidence: .sisyphus/evidence/task-06-lazy-comunas.png
  ```

  **Commit**: NO (groups with Tasks 5, 7)
  - Files: `src/pages/cobertura/[comuna].astro`

- [ ] 7. Lazy Loading en Imágenes de Blog

  **What to do**:
  - Agregar `loading="lazy"` a imágenes en templates de blog
  - Verificar `src/pages/blog/[slug].astro`
  - Si hay imágenes en el contenido MDX, pueden necesitar configuración global

  **Must NOT do**:
  - No modificar contenido de artículos

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/pages/blog/[slug].astro` - Template de blog post
  - `src/content/blog/*.mdx` - Contenido con imágenes embebidas

  **Acceptance Criteria**:
  - [ ] Imágenes en blog template tienen lazy loading
  - [ ] `npm run build` sin errores

  **QA Scenarios**:

  ```
  Scenario: Lazy loading en blog post
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to any blog post
      2. Check img elements in article content
    Expected Result: Images have loading="lazy" or equivalent
    Evidence: .sisyphus/evidence/task-07-lazy-blog.png
  ```

  **Commit**: YES
  - Message: `feat(seo): add lazy loading to all images`
  - Files: `src/pages/servicios/[slug].astro`, `src/pages/cobertura/[comuna].astro`, `src/pages/blog/[slug].astro`

- [ ] 8. Generar Versiones WebP de Imágenes Estáticas

  **What to do**:
  - Convertir imágenes PNG en `public/images/` a formato WebP
  - Mantener originales PNG como fallback
  - Usar herramienta CLI (sharp, squoosh, o similar)
  - Actualizar referencias en código para usar `<picture>` con srcset

  **Must NOT do**:
  - No eliminar imágenes PNG originales
  - No cambiar URLs sin mantener compatibilidad

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Tarea de optimización con múltiples archivos
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `public/images/` - Directorio de imágenes estáticas
  - `public/images/guardman_logo.png` - Logo principal (104KB, necesita webp)
  - `src/components/seo/LocalBusinessSchema.astro:28` - Referencia al logo

  **Acceptance Criteria**:
  - [ ] Archivos `.webp` creados para cada `.png` en `public/images/`
  - [ ] WebP files son < 50% del tamaño original
  - [ ] Build sin errores

  **QA Scenarios**:

  ```
  Scenario: WebP files exist
    Tool: Bash
    Steps:
      1. Run `ls public/images/*.webp | wc -l`
      2. Compare with `ls public/images/*.png | wc -l`
    Expected Result: Same number of webp as png files
    Evidence: .sisyphus/evidence/task-08-webp-files.txt

  Scenario: WebP size reduction
    Tool: Bash
    Steps:
      1. Run `du -h public/images/*.png` and `du -h public/images/*.webp`
    Expected Result: WebP files smaller than PNG
    Evidence: .sisyphus/evidence/task-08-webp-sizes.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): add webp versions of static images`
  - Files: `public/images/*.webp`

- [ ] 9. Implementar FAQSchema en Homepage

  **What to do**:
  - Importar `FAQSchema` component en `src/pages/index.astro`
  - Pasar los `faqs` obtenidos de Convex al componente
  - Agregar `<FAQSchema faqs={faqs} />` dentro del BaseLayout

  **Must NOT do**:
  - No modificar el componente FAQSchema
  - No agregar otros schemas (Organization ya existe)
  - No cambiar la visualización de FAQs

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Una línea de código, usar componente existente
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11)
  - **Blocks**: Task F3 (schema validation)
  - **Blocked By**: Task 1

  **References**:
  - `src/components/seo/FAQSchema.astro` - Componente existente
  - `src/pages/index.astro:42-46` - FAQs ya se obtienen de Convex
  - `src/pages/index.astro:55` - BaseLayout donde agregar schema

  **Acceptance Criteria**:
  - [ ] `FAQSchema` importado en index.astro
  - [ ] Componente renderizado con `faqs` prop
  - [ ] HTML contiene `<script type="application/ld+json">` con FAQPage

  **QA Scenarios**:

  ```
  Scenario: FAQ schema en homepage
    Tool: Bash (curl)
    Steps:
      1. Run `curl -s https://guardman.cl | grep -o 'FAQPage'`
    Expected Result: Output contains "FAQPage"
    Evidence: .sisyphus/evidence/task-09-faq-schema.txt

  Scenario: Rich Results Test passes
    Tool: Web (manual verification with URL)
    Steps:
      1. Open https://search.google.com/test/rich-results
      2. Test https://guardman.cl
    Expected Result: FAQPage schema detected and valid
    Evidence: .sisyphus/evidence/task-09-rich-results.png
  ```

  **Commit**: YES
  - Message: `feat(seo): add FAQ schema to homepage`
  - Files: `src/pages/index.astro`

- [ ] 10. Optimizar Meta Descriptions para CTR

  **What to do**:
  - Mejorar meta descriptions de páginas principales con CTAs
  - Incluir: ✓ checkmarks, números, beneficios
  - Mantener < 160 caracteres
  - Páginas a optimizar:
    - Homepage (ya tiene buena description)
    - `/servicios/index.astro`
    - `/cobertura/index.astro`
    - `/nosotros.astro`

  **Must NOT do**:
  - No cambiar titles (solo descriptions)
  - No reescribir contenido de las páginas
  - No agregar nuevas páginas

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`writing`]
    - Para escribir descriptions persuasivas

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 11)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/data/site.ts:48-49` - Description actual del sitio
  - `src/pages/servicios/index.astro` - Página de servicios
  - `src/pages/cobertura/index.astro` - Página de cobertura

  **Acceptance Criteria**:
  - [ ] Meta descriptions optimizadas en 4+ páginas
  - [ ] Todas < 160 caracteres
  - [ ] Incluyen CTA o beneficio

  **QA Scenarios**:

  ```
  Scenario: Meta description length
    Tool: Bash
    Steps:
      1. Run `curl -s https://guardman.cl/servicios | grep -o 'meta name="description"[^>]*'`
      2. Check character count
    Expected Result: content attribute < 160 chars
    Evidence: .sisyphus/evidence/task-10-meta-length.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): optimize meta descriptions for CTR`
  - Files: `src/pages/servicios/index.astro`, `src/pages/cobertura/index.astro`, `src/pages/nosotros.astro`

- [ ] 11. Agregar Preconnect para Recursos Externos

  **What to do**:
  - Agregar `<link rel="preconnect">` en BaseLayout para:
    - `https://fonts.googleapis.com`
    - `https://fonts.gstatic.com`
    - `https://images.unsplash.com` (si se usa frecuentemente)
  - Agregar `crossorigin` donde sea necesario

  **Must NOT do**:
  - No agregar preconnect a dominios no usados
  - No cambiar la carga de Google Fonts (ya existe)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/layouts/BaseLayout.astro:80-86` - Google Fonts ya cargado
  - Verificar imágenes de Unsplash en páginas de servicios/comunas

  **Acceptance Criteria**:
  - [ ] Preconnect agregado para fonts.googleapis.com
  - [ ] Preconnect agregado para fonts.gstatic.com con crossorigin
  - [ ] `npm run build` sin errores

  **QA Scenarios**:

  ```
  Scenario: Preconnect headers present
    Tool: Bash (curl)
    Steps:
      1. Run `curl -s https://guardman.cl | grep -o 'rel="preconnect"'`
    Expected Result: At least 2 preconnect links
    Evidence: .sisyphus/evidence/task-11-preconnect.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): add preconnect for external resources`
  - Files: `src/layouts/BaseLayout.astro`

- [ ] 12. Configurar Google Search Console

  **What to do**:
  - Crear property en Google Search Console para guardman.cl
  - Verificar dominio vía DNS TXT record (requiere acceso DNS del cliente)
  - Agregar sitemap: `https://guardman.cl/sitemap-index.xml`
  - Configurar preferred domain (https://guardman.cl)
  - Revisar y resolver errores de cobertura si existen

  **Must NOT do**:
  - No configurar GTM (fuera de scope)
  - No crear múltiples properties

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requiere interacción con consola web y DNS
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 13)
  - **Blocks**: Task F1 (SEO audit)
  - **Blocked By**: None (pero requiere DNS access)

  **References**:
  - Docs: `https://support.google.com/webmasters/answer/9008080`
  - `public/robots.txt` - Ya referencia el sitemap

  **Acceptance Criteria**:
  - [ ] Property creada en GSC
  - [ ] Dominio verificado (green checkmark)
  - [ ] Sitemap enviado y procesando
  - [ ] Sin errores críticos de cobertura

  **QA Scenarios**:

  ```
  Scenario: GSC property verified
    Tool: Manual (Google Search Console UI)
    Steps:
      1. Login to Google Search Console
      2. Check property guardman.cl
      3. Verify ownership status
    Expected Result: Property verified, sitemap submitted
    Evidence: .sisyphus/evidence/task-12-gsc-verified.png

  Scenario: Sitemap indexed
    Tool: Bash (curl)
    Steps:
      1. Wait 24-48 hours after submission
      2. Check GSC sitemap report
    Expected Result: Sitemap shows "Success" or indexed URLs
    Evidence: .sisyphus/evidence/task-12-sitemap-indexed.png
  ```

  **Commit**: NO (configuración externa)
  - Files: N/A

- [ ] 13. Configurar Google Analytics 4

  **What to do**:
  - Crear propiedad GA4 en Google Analytics
  - Obtener Measurement ID (G-XXXXXXXXXX)
  - Agregar gtag.js a BaseLayout o usar Vercel Analytics
  - Verificar que pageviews se registran
  - Configurar basic events si es simple (form submissions)

  **Must NOT do**:
  - No configurar GTM
  - No crear custom dimensions
  - No configurar conversion funnels

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 12)
  - **Blocks**: Task F1
  - **Blocked By**: None (pero requiere Google account)

  **References**:
  - `src/layouts/BaseLayout.astro` - Donde agregar gtag
  - `astro.config.mjs:11-13` - Vercel webAnalytics ya habilitado
  - Docs: `https://support.google.com/analytics/answer/9304153`

  **Acceptance Criteria**:
  - [ ] GA4 property creada
  - [ ] Measurement ID configurado en el sitio
  - [ ] Real-time report muestra actividad

  **QA Scenarios**:

  ```
  Scenario: GA4 tracking code present
    Tool: Bash (curl)
    Steps:
      1. Run `curl -s https://guardman.cl | grep -o 'G-[A-Z0-9]*'`
    Expected Result: GA4 Measurement ID found in HTML
    Evidence: .sisyphus/evidence/task-13-ga4-id.txt

  Scenario: Real-time tracking works
    Tool: Manual (Google Analytics UI)
    Steps:
      1. Open GA4 Real-time report
      2. Visit guardman.cl in another tab
      3. Check if user appears in real-time
    Expected Result: 1 active user shown
    Evidence: .sisyphus/evidence/task-13-ga4-realtime.png
  ```

  **Commit**: YES
  - Message: `feat(seo): add google analytics 4`
  - Files: `src/layouts/BaseLayout.astro` o `astro.config.mjs`

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **SEO Compliance Audit** — `oracle`
      Run Lighthouse SEO audit on all major pages. Verify sitemap accessible, robots.txt correct, meta tags present. Check Google Rich Results Test passes for homepage with FAQ schema. Verify OG images load correctly.
      Output: `Lighthouse SEO [score] | Sitemap [PASS/FAIL] | Robots [PASS/FAIL] | Schema [PASS/FAIL] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Performance Review** — `unspecified-high`
      Run `curl -I` on all static assets to verify cache headers. Check image lazy loading with Playwright (scroll page, verify images load). Test Core Web Vitals with Lighthouse.
      Output: `Cache Headers [N/N] | Lazy Loading [N/N] | CWV [PASS/FAIL] | VERDICT`

- [ ] F3. **Schema Validation** — `unspecified-high`
      Use Google Rich Results Test API or manual test URLs for homepage FAQ schema. Validate Organization and LocalBusiness schemas on relevant pages. Check for JSON-LD syntax errors.
      Output: `FAQ Schema [PASS/FAIL] | Organization [PASS/FAIL] | LocalBusiness [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      Verify no content was written beyond meta descriptions. Check no new schemas added beyond FAQ. Verify no design changes made. Confirm guardrails respected.
      Output: `Content [CLEAN/N violations] | Schemas [CLEAN/N extra] | Design [CLEAN/N changes] | VERDICT`

---

## Commit Strategy

| After Task | Message                                                          | Files                                     | Verification        |
| ---------- | ---------------------------------------------------------------- | ----------------------------------------- | ------------------- |
| 1-4        | `feat(seo): add sitemap, cache headers, and default og image`    | astro.config.mjs, vercel.json, public/\*  | npm run build       |
| 5-8        | `feat(seo): add lazy loading and webp images`                    | src/pages/\*_/_.astro, public/images/\*   | npm run build       |
| 9-11       | `feat(seo): implement FAQ schema and optimize meta descriptions` | src/pages/index.astro, src/data/\*        | npm run build       |
| 12-13      | `feat(seo): configure search console and analytics`              | src/layouts/BaseLayout.astro, vercel.json | Manual verification |

---

## Success Criteria

### Verification Commands

```bash
# Sitemap
curl -s https://guardman.cl/sitemap-index.xml | grep -c "<url>"

# Cache headers
curl -I https://guardman.cl/images/guardman_logo.png | grep "Cache-Control"

# OG Image
curl -I https://guardman.cl/og-default.jpg | grep "200 OK"

# FAQ Schema
curl -s https://guardman.cl | grep "FAQPage"

# Apple touch icon
curl -I https://guardman.cl/apple-touch-icon.png | grep "200 OK"
```

### Final Checklist

- [ ] Lighthouse SEO score > 90
- [ ] Google Rich Results Test passes
- [ ] All images have loading="lazy"
- [ ] Cache headers return max-age > 0
- [ ] GSC property verified
- [ ] GA4 tracking pageviews
- [ ] No content written (except meta descriptions)
- [ ] No design changes made
