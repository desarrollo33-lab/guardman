# Auditoría Técnica Exhaustiva — GuardMan Chile

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Realizar una auditoría end-to-end del sitio público, panel de control, infraestructura, calidad de código y preparación para producción, generando un documento ejecutable con hallazgos priorizados.

**Architecture:** Auditoría en 5 fases secuenciales (A→E) que producen un documento Markdown único con hallazgos categorizados (FUN/SEC/UX/PERF/A11Y/LEGACY/PROD), evidencia reproducible, y plan de remediación por sprints.

**Tech Stack:** Astro 6 SSR, Cloudflare Workers, D1, React 19, Tailwind v4, TypeScript strict

---

## File Structure

El documento de auditoría se generará en:
- Create: `docs/auditoria/2026-08-13-auditoria-tecnica.md`

Las fases de auditoría explorarán:
- `src/pages/` — Rutas públicas y admin
- `src/components/` — Componentes UI
- `src/layouts/` — Layouts base
- `src/lib/` — Lógica de negocio, auth, validación
- `src/islands/` — Componentes React interactivos
- `migrations/` — Schema D1
- `wrangler.jsonc` — Configuración Workers
- `public/` — Assets estáticos

---

## Fase A — Inventario y Mapa

### Task 1: Inventario de archivos y estructura

**Files:**
- Read: `src/pages/` (all routes)
- Read: `src/components/` (all components)
- Read: `src/layouts/` (layouts)
- Read: `src/lib/` (business logic)
- Read: `src/islands/` (React islands)
- Read: `migrations/` (D1 schema)
- Read: `wrangler.jsonc` (bindings)
- Read: `package.json` (dependencies)

- [ ] **Step 1: Listar todas las rutas públicas**

```bash
# Generar lista de rutas públicas con método HTTP y tipo de renderizado
find src/pages -name "*.astro" -o -name "*.ts" | grep -v admin | sort
```

Documentar para cada ruta:
- Path pattern
- HTTP method (GET/POST)
- Renderizado (SSR/SSG)
- Autenticación requerida (Sí/No)
- Propósito en una línea

- [ ] **Step 2: Listar todas las rutas del panel admin**

```bash
find src/pages/admin -name "*.astro" | sort
```

Documentar igual que rutas públicas, incluyendo nivel de protección.

- [ ] **Step 3: Mapear bindings de Cloudflare**

De `wrangler.jsonc` extraer:
- D1 databases (binding, name, id)
- KV namespaces
- R2 buckets
- Durable Objects
- Variables de entorno
- Secrets (los que estén documentados)

- [ ] **Step 4: Identificar variables de entorno y secrets**

```bash
# Buscar referencias a env vars en el código
grep -r "env\." src/ --include="*.ts" --include="*.astro" | head -50
grep -r "import.meta.env" src/ | head -50
```

Marcar cuáles están documentados en `.env.example` y cuáles no.

- [ ] **Step 5: Generar árbol de src/ anotado**

```bash
tree src/ -L 3 --dirsfirst -I 'node_modules'
```

Anotar con:
- `[Público]` — Rutas accesibles sin auth
- `[Admin]` — Rutas protegidas
- `[API]` — Endpoints API
- `[Utilidad]` — Libs, helpers, types

---

## Fase B — Auditoría del Sitio Público

### Task 2: B1 — Funcional y contenido

**Files:**
- Read: `src/pages/index.astro`
- Read: `src/pages/contacto.astro`
- Read: `src/pages/cotizacion.astro`
- Read: `src/pages/nosotros.astro`
- Read: `src/pages/servicios/*.astro`
- Read: `src/pages/ubicaciones/*.astro`
- Read: `src/pages/sectores/*.astro`
- Read: `src/layouts/BaseLayout.astro`
- Read: `src/components/Header.astro`
- Read: `src/components/Footer.astro`

- [ ] **Step 1: Verificar meta tags en cada página pública**

Para cada página pública, verificar:
- `<title>` único y descriptivo (50-60 chars)
- `<meta name="description">` (50-160 chars)
- `<link rel="canonical">`
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags (twitter:card, twitter:title, twitter:description)
- `lang="es-CL"` en `<html>`

```bash
# Curl para verificar headers y HTML
curl -s -o /dev/null -w "%{http_code} %{time_total}s %{size_download}B" https://guardman-astro.oficinadesarrollo33.workers.dev/
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/ | grep -E "<title>|<meta name=\"description\"|<link rel=\"canonical\"|og:|twitter:"
```

- [ ] **Step 2: Verificar headers de seguridad**

```bash
curl -I https://guardman-astro.oficinadesarrollo33.workers.dev/
```

Verificar presencia de:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (en HTTPS)
- `Content-Security-Policy` (revisar si existe, flag `unsafe-inline` en script-src)

- [ ] **Step 3: Verificar datos legales en footer**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/ | grep -A 50 "<footer"
```

Verificar presencia de:
- RUT de la empresa
- Razón social
- Domicilio
- Enlaces a términos y política de privacidad

- [ ] **Step 4: Verificar robots.txt y sitemap.xml**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/robots.txt
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/sitemap.xml | head -50
```

- `robots.txt` debe tener: User-agent, Allow/Disallow, Sitemap
- `sitemap.xml` debe incluir todas las rutas públicas indexables

- [ ] **Step 5: Verificar páginas 404 y 500**

```bash
curl -s -o /dev/null -w "%{http_code}" https://guardman-astro.oficinadesarrollo33.workers.dev/ruta-inexistente
```

Debe retornar 404 con página personalizada (no el default de Cloudflare).

---

### Task 3: B2 — Performance

**Files:**
- Read: `astro.config.mjs` (build config)
- Read: `public/_headers` (cache rules)
- Read: `src/components/Analytics.astro`

- [ ] **Step 1: Ejecutar Lighthouse en home**

```bash
npm run lighthouse
```

O manualmente:
```bash
npx lighthouse https://guardman-astro.oficinadesarrollo33.workers.dev/ --output=json --output-path=./lighthouse-home.json
```

Capturar:
- LCP (Largest Contentful Paint)
- INP (Interaction to Next Paint) o FID (legacy)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TBT (Total Blocking Time)
- Speed Index

- [ ] **Step 2: Ejecutar Lighthouse en página interna pesada**

```bash
npx lighthouse https://guardman-astro.oficinadesarrollo33.workers.dev/servicios/guardias-de-seguridad/ --output=json --output-path=./lighthouse-servicio.json
```

- [ ] **Step 3: Identificar cuellos de botella**

Revisar en los reportes Lighthouse:
- Imágenes sin `loading="lazy"` ni `decoding="async"`
- Imágenes sin `width/height` (causan CLS)
- JS bloqueante
- CSS no crítico no inlineado
- Fuentes sin `font-display: swap`

```bash
# Buscar imágenes sin lazy loading
grep -r "<img" src/ --include="*.astro" | grep -v "loading=" | head -20

# Buscar imágenes sin width/height
grep -r "<img" src/ --include="*.astro" | grep -v "width=" | head -20
```

- [ ] **Step 4: Verificar compresión y cache**

```bash
curl -I -H "Accept-Encoding: br, gzip" https://guardman-astro.oficinadesarrollo33.workers.dev/
```

Verificar:
- `Content-Encoding: br` o `gzip`
- `Cache-Control` en assets estáticos

---

### Task 4: B3 — Accesibilidad (WCAG 2.1 AA)

**Files:**
- Read: `src/components/Header.astro`
- Read: `src/components/Footer.astro`
- Read: `src/pages/index.astro`
- Read: `src/pages/contacto.astro`

- [ ] **Step 1: Ejecutar Lighthouse accessibility**

```bash
npx lighthouse https://guardman-astro.oficinadesarrollo33.workers.dev/ --only-categories=accessibility --output=json --output-path=./lighthouse-a11y.json
```

- [ ] **Step 2: Verificar contraste de color**

Revisar en el reporte Lighthouse:
- Contraste en header/footer oscuro
- Logo con `filter: brightness(0) invert(1)` sobre fondo oscuro
- Texto sobre fondos con gradiente

- [ ] **Step 3: Verificar navegación por teclado**

Manualmente o con script:
- Tab debe recorrer todos los elementos interactivos en orden lógico
- Foco visible en cada elemento
- Sin trampas de foco (modal que no se puede cerrar con ESC)

- [ ] **Step 4: Verificar alt en imágenes**

```bash
grep -r "<img" src/ --include="*.astro" | grep -v "alt=" | head -20
grep -r "<img" src/ --include="*.astro" | grep 'alt=""' | head -20
```

- `alt=""` solo para imágenes decorativas
- `alt="descriptivo"` para imágenes informativas

- [ ] **Step 5: Verificar labels en formularios**

```bash
grep -r "<input" src/ --include="*.astro" | grep -v "id=" | head -20
grep -r "<label" src/ --include="*.astro" | grep -v "for=" | head -20
```

Cada `<input>` debe tener un `<label>` asociado con `for="id"`.

- [ ] **Step 6: Verificar estructura de headings**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/ | grep -oE "<h[1-6][^>]*>" | head -20
```

- Un solo `<h1>` por página
- Jerarquía sin saltos (h1 → h2 → h3, no h1 → h3)

- [ ] **Step 7: Verificar landmarks**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/ | grep -E "<header|<nav|<main|<footer"
```

Debe existir: `<header>`, `<nav>`, `<main>`, `<footer>`

---

### Task 5: B4 — Responsive y cross-browser

**Files:**
- Read: `src/styles/global.css`
- Read: `public/styles/site.css`
- Read: `src/components/Header.astro`

- [ ] **Step 1: Verificar breakpoints en CSS**

```bash
grep -r "@media" src/styles/ public/styles/ | head -30
```

Identificar breakpoints definidos (mobile, tablet, desktop).

- [ ] **Step 2: Verificar logo responsive**

```bash
grep -r "logo" src/components/Header.astro | grep -E "width|height|size"
```

Según AGENTS.md: 50px desktop / 44px mobile.

- [ ] **Step 3: Verificar scroll horizontal**

Con Playwright o manualmente en 360×800 (móvil):
```bash
npx playwright test --grep "responsive"
```

- [ ] **Step 4: Verificar menú móvil**

```bash
grep -r "menu\|hamburger\|mobile" src/components/Header.astro | head -20
```

Verificar:
- Se abre con click
- Se cierra con ESC
- Atrapa foco (focus trap)
- Navegable por teclado

---

### Task 6: B5 — SEO técnico

**Files:**
- Read: `src/pages/robots.txt.ts`
- Read: `src/pages/sitemap.xml.ts`
- Read: `src/lib/seo.ts`
- Read: `src/lib/constants.ts`

- [ ] **Step 1: Verificar Schema.org**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/ | grep -o '"@type":"[^"]*"' | sort | uniq
```

Esperado: Organization, LocalBusiness, BreadcrumbList, FAQPage, etc.

- [ ] **Step 2: Verificar robots.txt**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/robots.txt
```

No debe bloquear páginas que deberían indexarse.

- [ ] **Step 3: Verificar sitemap.xml**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/sitemap.xml | grep -c "<url>"
```

Debe incluir todas las rutas públicas indexables (~187 URLs según STATUS.md).

- [ ] **Step 4: Verificar imágenes con alt relevante**

```bash
grep -r "<img" src/ --include="*.astro" | grep -E 'alt="(image|img|photo|picture)' | head -20
```

No debe haber alts genéricos como "image1.jpg".

- [ ] **Step 5: Verificar links internos (páginas huérfanas)**

```bash
# Listar todas las rutas públicas
find src/pages -name "*.astro" | grep -v admin | sed 's|src/pages||;s|\.astro||;s|/index||' > /tmp/routes.txt

# Buscar links internos en el código
grep -r "href=\"/" src/ --include="*.astro" | grep -o 'href="[^"]*"' | sort | uniq > /tmp/links.txt

# Comparar
comm -23 /tmp/routes.txt /tmp/links.txt
```

---

## Fase C — Auditoría del Panel de Control

### Task 7: C1 — Autenticación y autorización

**Files:**
- Read: `src/lib/auth.ts`
- Read: `src/pages/admin/login.astro`
- Read: `src/layouts/AdminLayout.astro`
- Read: `public/scripts/admin-auth-guard.js`

- [ ] **Step 1: Analizar mecanismo de autenticación**

```bash
cat src/lib/auth.ts
```

Identificar:
- ¿Cómo se autentica? (sesión + cookie httpOnly, JWT, Cloudflare Access)
- ¿Dónde se almacena el token? (localStorage, cookie, etc.)
- ¿Cuál es la expiración?

- [ ] **Step 2: Verificar protección de rutas admin**

```bash
# Intentar acceder a ruta admin sin token
curl -s -o /dev/null -w "%{http_code}" https://guardman-astro.oficinadesarrollo33.workers.dev/admin
curl -s -o /dev/null -w "%{http_code}" https://guardman-astro.oficinadesarrollo33.workers.dev/admin/leads
```

Debe retornar 401 o redirect a login.

- [ ] **Step 3: Verificar middleware global de auth**

```bash
find src/ -name "middleware.*" | head -5
grep -r "middleware" src/ --include="*.ts" | head -20
```

Si no existe middleware global, es hallazgo.

- [ ] **Step 4: Verificar roles/permisos**

```bash
grep -r "role\|permission\|admin" src/lib/auth.ts | head -20
```

Si hay roles, verificar que se aplican en cada endpoint.

---

### Task 8: C2 — Seguridad de las APIs

**Files:**
- Read: `src/pages/api/health.ts`
- Read: `src/pages/api/denuncias/` (if exists)
- Read: `src/lib/validation.ts`
- Read: `src/lib/denuncias-validation.ts`

- [ ] **Step 1: Verificar validación server-side en mutaciones**

```bash
find src/pages/api -name "*.ts" | xargs grep -l "POST\|PUT\|PATCH\|DELETE"
```

Para cada endpoint de mutación:
- ¿Tiene validación de schema? (zod, valibot, manual)
- ¿Sanitiza inputs?

- [ ] **Step 2: Verificar protección CSRF**

```bash
grep -r "csrf\|CSRF\|token" src/pages/api/ | head -20
```

Si usa cookies de sesión, debe haber token anti-CSRF o verificación de Origin/Referer.

- [ ] **Step 3: Verificar rate limiting**

```bash
grep -r "rate\|limit\|throttle" src/ | head -20
```

Debe existir en:
- Login
- Recuperación de contraseña
- Endpoints sensibles (denuncias)

- [ ] **Step 4: Verificar SQL injection en D1**

```bash
grep -r "env.DB\|\.prepare\|\.run\|\.all" src/ --include="*.ts" | head -30
```

Todas las queries deben ser parametrizadas (no concatenación de strings).

- [ ] **Step 5: Verificar XSS**

```bash
grep -r "dangerouslySetInnerHTML\|set:html\|innerHTML" src/ --include="*.astro" --include="*.tsx" | head -20
```

Si existe, verificar que el contenido está sanitizado.

- [ ] **Step 6: Verificar secrets hardcodeados**

```bash
grep -r "password\|secret\|api_key\|token" src/ --include="*.ts" --include="*.astro" | grep -v "test\|mock\|example" | head -20
grep -r "v41-denu-2026" src/ | head -5
```

No debe haber secrets en el código.

---

### Task 9: C3 — Lógica de negocio

**Files:**
- Read: `src/pages/admin/index.astro`
- Read: `src/pages/admin/leads.astro`
- Read: `src/pages/admin/leads/[id].astro`
- Read: `src/pages/admin/inbox.astro`
- Read: `src/pages/admin/pipeline.astro`
- Read: `src/pages/admin/denuncias.astro`
- Read: `src/lib/crm-data.ts`

- [ ] **Step 1: Identificar flujos críticos del panel**

Flujos a verificar:
1. Login → Dashboard
2. Ver leads → Ver detalle lead
3. Crear/editar lead
4. Ver denuncias → Ver detalle denuncia
5. Cambiar estado denuncia

- [ ] **Step 2: Verificar edge cases en forms**

Para cada form del panel:
- ¿Qué pasa si envío form vacío?
- ¿Con un ID que no existe?
- ¿Con un ID que pertenece a otro tenant/usuario?

```bash
# Test con ID inexistente
curl -s -o /dev/null -w "%{http_code}" https://guardman-astro.oficinadesarrollo33.workers.dev/admin/leads/L999
```

- [ ] **Step 3: Verificar consistencia panel ↔ sitio público**

Si se edita algo en el panel, ¿se refleja inmediatamente en el sitio público?
¿Hay caché que deba invalidarse?

- [ ] **Step 4: Verificar permisos a nivel de registro**

Un usuario del panel ¿puede ver/editar registros que no debería?

---

### Task 10: C4 — UX del panel

**Files:**
- Read: `src/islands/crm/Dashboard.tsx`
- Read: `src/islands/crm/LeadsList.tsx`
- Read: `src/islands/crm/LeadDetail.tsx`
- Read: `src/islands/crm/Inbox.tsx`

- [ ] **Step 1: Verificar empty states**

¿Qué muestra el panel cuando no hay datos?
- Lista vacía de leads
- Sin denuncias
- Sin mensajes en inbox

- [ ] **Step 2: Verificar loading states**

¿Muestra spinner/skeleton mientras carga?
```bash
grep -r "loading\|spinner\|skeleton" src/islands/ | head -20
```

- [ ] **Step 3: Verificar error states**

¿Qué muestra si falla la API?
```bash
grep -r "error\|catch\|fallback" src/islands/ | head -20
```

- [ ] **Step 4: Verificar acciones destructivas**

¿Tiene confirmación antes de eliminar?
```bash
grep -r "confirm\|delete\|remove" src/islands/ | head -20
```

- [ ] **Step 5: Verificar paginación**

¿Trae todos los registros o pagina?
```bash
grep -r "page\|limit\|offset\|pagination" src/islands/ src/lib/ | head -20
```

---

## Fase D — Calidad de Código

### Task 11: D1 — TypeScript y types

**Files:**
- Read: `tsconfig.json`
- Read: `src/types/index.ts`
- Read: `src/lib/validation.ts`
- Read: `src/lib/denuncias-validation.ts`

- [ ] **Step 1: Verificar strict mode**

```bash
cat tsconfig.json | grep -E "strict|noImplicitAny|strictNullChecks"
```

Debe tener `strict: true` o equivalentes.

- [ ] **Step 2: Buscar `any` o `as unknown as X`**

```bash
grep -r ": any\|as any\|as unknown" src/ --include="*.ts" --include="*.tsx" | head -30
```

Cada uno debe tener justificación.

- [ ] **Step 3: Verificar tipos duplicados**

```bash
# Buscar definiciones de tipo duplicadas
grep -r "interface\|type " src/types/ src/lib/ | grep -o "interface [A-Za-z]*\|type [A-Za-z]*" | sort | uniq -d
```

---

### Task 12: D2 — Código muerto y legacy

**Files:**
- Read: `src/lib/constants.ts`
- Read: `src/lib/crm-data.ts`
- Read: `src/lib/content.ts`

- [ ] **Step 1: Buscar imports no usados**

```bash
npx ts-prune | head -50
```

O manualmente:
```bash
grep -r "import.*from" src/ --include="*.ts" --include="*.tsx" | wc -l
```

- [ ] **Step 2: Buscar exports no usados**

```bash
grep -r "export " src/lib/ --include="*.ts" | grep -o "export [a-z]* [A-Za-z]*" | sort | uniq > /tmp/exports.txt
grep -r "import.*from.*lib" src/ --include="*.ts" --include="*.astro" | grep -o "[A-Za-z]*" | sort | uniq > /tmp/imports.txt
comm -23 /tmp/exports.txt /tmp/imports.txt
```

- [ ] **Step 3: Buscar archivos huérfanos**

```bash
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.astro" | while read f; do
  basename=$(basename "$f" | sed 's/\.[^.]*$//')
  if ! grep -r "$basename" src/ --include="*.ts" --include="*.tsx" --include="*.astro" -q; then
    echo "Huérfano: $f"
  fi
done
```

- [ ] **Step 4: Buscar console.log, debugger, alert**

```bash
grep -r "console\.\(log\|debug\|info\|warn\|error\)\|debugger\|alert(" src/ --include="*.ts" --include="*.tsx" --include="*.astro" | head -30
```

- [ ] **Step 5: Buscar código comentado o deprecado**

```bash
grep -r "// TODO\|// FIXME\|// HACK\|// XXX\|// deprecated\|// ya no se usa" src/ | head -30
grep -r "if (false)" src/ | head -10
```

- [ ] **Step 6: Verificar migrations D1**

```bash
cat migrations/0001_create_denuncias.sql
```

Comparar con schema real en D1 (si hay acceso).

---

### Task 13: D3 — Dependencias

**Files:**
- Read: `package.json`
- Read: `package-lock.json` (first 100 lines)

- [ ] **Step 1: Listar dependencias y verificar uso**

```bash
npm ls --depth=0
```

Para cada dependencia:
- ¿Se usa realmente? Si no, eliminar.
- ¿Está desactualizado?

- [ ] **Step 2: Verificar advisories de seguridad**

```bash
npm audit
```

Reportar cualquier advisory activo.

- [ ] **Step 3: Verificar bundle size**

```bash
npm run build
```

Revisar output. Cualquier chunk >100KB es sospechoso.

---

### Task 14: D4 — Consistencia

- [ ] **Step 1: Verificar naming consistency**

```bash
# Buscar mezcla de idiomas en nombres de variables/functions
grep -r "function [a-z]*[A-Z]" src/ --include="*.ts" | head -20
grep -r "const [a-z]*_[a-z]" src/ --include="*.ts" | head -20
```

- [ ] **Step 2: Verificar formato**

¿Hay linter/formatter configurado?
```bash
cat package.json | grep -E "lint|format|prettier|eslint"
```

- [ ] **Step 3: Verificar mensajes de error al usuario**

```bash
grep -r "error\|Error\|mensaje\|message" src/ --include="*.ts" --include="*.astro" | grep -i "usuario\|user\|client" | head -20
```

---

### Task 15: D5 — Testing

**Files:**
- Read: `tests/api.test.ts`
- Read: `tests/auth.test.ts`
- Read: `tests/constants.test.ts`
- Read: `tests/validation.test.ts`
- Read: `tests/e2e/public.spec.ts`
- Read: `tests/e2e/admin.spec.ts`
- Read: `vitest.config.ts`
- Read: `playwright.config.ts`

- [ ] **Step 1: Ejecutar tests unitarios**

```bash
npm test
```

Verificar que pasan 27/27.

- [ ] **Step 2: Verificar cobertura de tests**

```bash
npm run test:coverage
```

¿Qué porcentaje cubren? ¿Hay tests de los flujos críticos del panel?

- [ ] **Step 3: Ejecutar tests E2E**

```bash
npm run test:e2e
```

Si fallan, documentar por qué.

- [ ] **Step 4: Evaluar necesidad de smoke tests**

¿Hay smoke tests de las rutas críticas?
```bash
grep -r "smoke\|critical\|happy.path" tests/ | head -20
```

---

## Fase E — Producción

### Task 16: E1 — Deploy

- [ ] **Step 1: Verificar build limpio**

```bash
npm run build 2>&1 | tail -30
```

No debe haber warnings críticos.

- [ ] **Step 2: Verificar type check**

```bash
npm run check
```

Debe pasar sin errores.

- [ ] **Step 3: Verificar que deploy está documentado**

```bash
cat README.md | grep -A 10 "Deploy"
cat AGENTS.md | grep -A 10 "Deploy"
```

Debe haber instrucciones claras y reproducibles.

- [ ] **Step 4: Verificar .env.example vs secrets reales**

```bash
cat .env.example
```

Comparar con lo que espera el código. No debe faltar nada.

---

### Task 17: E2 — Dominio y DNS

- [ ] **Step 1: Verificar estado actual de guardman.cl**

```bash
curl -I https://guardman.cl
nslookup guardman.cl
```

Confirmar que apunta a Google Sites (Server: ESF).

- [ ] **Step 2: Evaluar opciones de migración**

Documentar:
- Si la zona `guardman.cl` está en la cuenta oficinadesarrollo33@gmail.com
- Si no, proceso de migración (cambiar nameservers, crear zone, agregar routes)

- [ ] **Step 3: Verificar DNS records**

```bash
nslookup -type=MX guardman.cl
nslookup -type=TXT guardman.cl
```

Verificar si hay MX, TXT, SPF, DKIM, DMARC configurados.

---

### Task 18: E3 — Observabilidad

- [ ] **Step 1: Verificar logging**

```bash
grep -r "console\.\(log\|error\|warn\)" src/ --include="*.ts" | head -20
```

¿Hay logs estructurados? ¿Se envían a algún lado?

- [ ] **Step 2: Verificar health check**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/api/health
```

Debe retornar JSON con version y status.

- [ ] **Step 3: Verificar Workers Analytics**

En `wrangler.jsonc`:
```json
"observability": {
  "enabled": true,
  "logs": { "enabled": true },
  "head_sampling_rate": 1
}
```

---

### Task 19: E4 — Backups

- [ ] **Step 1: Verificar estrategia de backup D1**

```bash
grep -r "backup\|export\|dump" scripts/ | head -10
```

¿Hay script documentado para backup periódico de D1?

- [ ] **Step 2: Verificar versionado de objetos críticos**

Si usa R2, ¿tiene versionado habilitado?

---

### Task 20: E5 — Legal y compliance

**Files:**
- Read: `src/pages/privacidad.astro`
- Read: `src/pages/terminos.astro`

- [ ] **Step 1: Verificar política de privacidad**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/privacidad | grep -E "<h1|<h2|RUT|razón social"
```

Debe existir y tener contenido relevante.

- [ ] **Step 2: Verificar términos de servicio**

```bash
curl -s https://guardman-astro.oficinadesarrollo33.workers.dev/terminos | grep -E "<h1|<h2|RUT|razón social"
```

- [ ] **Step 3: Verificar banner de cookies**

```bash
grep -r "cookie\|Cookie\|consent" src/ --include="*.astro" --include="*.tsx" | head -20
```

Si hay analytics o trackers, debe haber banner de cookies.

- [ ] **Step 4: Verificar cumplimiento Ley 19.628**

Si el panel maneja datos personales, verificar:
- Consentimiento para recopilar datos
- Derecho a acceso, rectificación, eliminación
- Política de retención de datos

---

## Generación del Documento Final

### Task 21: Consolidar hallazgos en documento final

- [ ] **Step 1: Crear estructura del documento**

```markdown
# Auditoría guardman.cl — 2026-08-13

## 0. Resumen ejecutivo
- Estado general: [listo para producción | requiere fixes antes de producción | no listo]
- Bloqueadores de entrega: [lista corta]
- Esfuerzo total estimado: [X días / Y sprints]
- Top 5 hallazgos críticos: [resumen de 1 línea cada uno]

## 1. Inventario
[Árbol de archivos anotado, lista de rutas, bindings, env vars]

## 2. Hallazgos
### 2.1 Sitio público
### 2.2 Panel de control
### 2.3 Seguridad
### 2.4 Calidad de código
### 2.5 Producción / infra

## 3. Plan de remediación sugerido
### Sprint 1 (esta semana) — P0
### Sprint 2 — P1
### Backlog P2/P3

## 4. Riesgos residuales

## 5. Checklist de entrega a cliente
```

- [ ] **Step 2: Categorizar hallazgos**

Cada hallazgo lleva:
- ID: FUN-001, SEC-002, UX-003, PERF-004, A11Y-005, LEGACY-006, PROD-007
- Severidad: P0/P1/P2/P3
- Esfuerzo: S/M/L
- Evidencia: archivo:línea, screenshot, comando, response
- Impacto
- Recomendación

- [ ] **Step 3: Priorizar y crear plan de remediación**

Sprint 1 (P0): Bloqueadores de entrega
Sprint 2 (P1): Afecta experiencia o calidad visible
Backlog (P2/P3): Nice-to-have

- [ ] **Step 4: Crear checklist de entrega a cliente**

```markdown
- [ ] Dominio custom conectado
- [ ] HTTPS forzado
- [ ] 404/500 pages personalizadas
- [ ] Términos y privacidad publicados
- [ ] Smoke tests pasando
- [ ] Build limpio
- [ ] Deploy reproducible documentado
- [ ] Backups configurados
- [ ] Observabilidad básica
- [ ] DNS limpio (SPF/DKIM/DMARC si aplica)
```

- [ ] **Step 5: Commit del documento**

```bash
git add docs/auditoria/2026-08-13-auditoria-tecnica.md
git commit -m "docs: add comprehensive technical audit 2026-08-13"
```

---

## Execution Handoff

After saving this plan, the recommended execution approach is:

**Subagent execution** — Given the 21 independent tasks across 5 phases, using `compose:subagent` will allow parallel execution of independent audit phases while maintaining sequential dependencies within phases.

**Execution order:**
1. Fase A (Task 1) — Inventario (bloquea todo lo demás)
2. Fase B (Tasks 2-6) — Sitio público (paralelizable)
3. Fase C (Tasks 7-10) — Panel de control (paralelizable)
4. Fase D (Tasks 11-15) — Calidad de código (paralelizable)
5. Fase E (Tasks 16-20) — Producción (paralelizable)
6. Task 21 — Consolidación (secuencial, después de todo)

**Tiempo estimado:** 4-6 horas con subagentes paralelos.
