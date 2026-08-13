# Auditoría guardman.cl — 2026-08-13

## 0. Resumen ejecutivo

- **Estado general:** ⚠️ Requiere fixes antes de producción
- **Bloqueadores de entrega:** 2 críticos (P0)
  1. `guardman.cl` apunta a Google Sites, no al Worker
  2. Admin routes sin autenticación server-side (cualquiera accede al panel)
- **Esfuerzo total estimado:** 3-5 días (1 sprint para P0, 1 sprint para P1)
- **Top 5 hallazgos críticos:**
  1. **SEC-001 (P0):** Rutas `/admin/*` no tienen protección server-side — HTML completo del panel accesible sin login
  2. **SEC-005 (P0):** Token admin `v41-denu-2026` hardcodeado + expuesto en HTML via `define:vars`
  3. **PROD-005 (P0):** `guardman.cl` apunta a Google Sites (Server: ESF), no al Worker
  4. **SEO-001 (P0):** Canonical, OG, sitemap, robots.txt apuntan a `guardman.cl` que no resuelve al Worker
  5. **SEC-D3-001 (P0):** 13 vulnerabilidades npm (11 high) incluyendo XSS en astro y path traversal en vite

---

## 1. Inventario

### Rutas Públicas (21 rutas + 4 API)

| # | Path | HTTP | Auth | Propósito |
|---|---|---|---|---|
| 1 | `/` | GET | No | Homepage: hero, servicios, stats, CTAs |
| 2 | `/servicios` | GET | No | Índice de servicios (11) |
| 3 | `/servicios/[slug]` | GET | No | Detalle de servicio |
| 4 | `/servicios/[service]/[location]` | GET | No | Combo SEO long-tail (154 páginas) |
| 5 | `/ubicaciones` | GET | No | Índice de ubicaciones (14 comunas) |
| 6 | `/ubicaciones/[slug]` | GET | No | Detalle de comuna |
| 7 | `/sectores` | GET | No | Índice de sectores (10) |
| 8 | `/sectores/[slug]` | GET | No | Detalle de sector |
| 9 | `/guard-pod` | GET | No | Landing Guardpod (dark theme) |
| 10 | `/ajax-systems` | GET | No | Landing Ajax Systems (dark theme) |
| 11 | `/nosotros` | GET | No | Página institucional |
| 12 | `/contacto` | GET | No | Formulario de contacto |
| 13 | `/cotizacion` | GET | No | Formulario de cotización |
| 14 | `/canal-de-denuncias` | GET | No | Denuncias anónimas (Ley 20.393) |
| 15 | `/canal-de-denuncias/estado/[id]` | GET | No | Consulta estado denuncia |
| 16 | `/gracias` | GET | No | Confirmación post-formulario |
| 17 | `/terminos` | GET | No | Términos y condiciones |
| 18 | `/privacidad` | GET | No | Política de privacidad |
| 19 | `/404` | GET | No | Página de error 404 |
| 20 | `/robots.txt` | GET | No | Robots.txt dinámico |
| 21 | `/sitemap.xml` | GET | No | Sitemap dinámico (~202 URLs) |

**API Públicos:** `/api/health` (GET), `/api/denuncias` (POST), `/api/denuncias/[id]` (GET)

### Rutas Admin (8 rutas + 2 API)

| # | Path | Auth | Propósito |
|---|---|---|---|
| 1 | `/admin/login` | No | Página de login |
| 2 | `/admin` | Sí* | Dashboard CRM |
| 3 | `/admin/inbox` | Sí* | Bandeja de leads |
| 4 | `/admin/pipeline` | Sí* | Pipeline Kanban |
| 5 | `/admin/leads` | Sí* | Listado de leads |
| 6 | `/admin/leads/[id]` | Sí* | Lead 360° |
| 7 | `/admin/denuncias` | Sí* | Gestión de denuncias |
| 8 | `/admin/settings` | Sí* | Configuración |

*Auth es client-side only (localStorage + script inline). No hay protección server-side.

**API Admin:** `/api/denuncias` (GET con X-Admin-Token), `/api/denuncias/[id]` (PATCH con X-Admin-Token)

### Bindings Cloudflare

| Binding | Tipo | Nombre | Estado |
|---|---|---|---|
| `DB` | D1 | `guardman-v2-db` | ✅ Activo (1 migration) |
| `ASSETS` | Assets | `./dist` | ✅ Activo |
| `PUBLIC_API_URL` | Env Var | `https://guardman.oficinadesarrollo33.workers.dev` | ✅ |
| `PUBLIC_SITE_URL` | Env Var | `https://guardman.cl` | ⚠️ No resuelve al Worker |

**Secrets pendientes:** `DENUNCIAS_ADMIN_TOKEN` (hardcoded como `v41-denu-2026`)

### Dependencias

| Runtime | Dev |
|---|---|
| astro ^6.0.0 | @astrojs/check ^0.9.9 |
| @astrojs/cloudflare ^13.6.0 | @playwright/test ^1.61.1 |
| @astrojs/react ^4.0.0 | @tailwindcss/vite ^4.0.0 |
| react ^19.2.0 | tailwindcss ^4.0.0 |
| react-dom ^19.2.0 | typescript ^5.9.3 |
| vite 7.1.0 | vitest ^4.0.0 |
| clsx ^2.1.1 | wrangler ^4.0.0 |
| lucide-react ^1.8.0 | lighthouse ^12.8.2 |
| marked ^18.0.1 | jsdom ^29.1.1 |

---

## 2. Hallazgos

### 2.1 Sitio público

| ID | Categoría | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|---|
| SEO-001 | SEO | **P0** | S | Canonical, OG, Twitter, sitemap y robots.txt apuntan a `guardman.cl` que no resuelve al Worker | `BaseLayout.astro:170`, `robots.txt.ts`, `sitemap.xml.ts` | Google no indexa el sitio real; previews de redes sociales no funcionan | Conectar dominio o cambiar `PUBLIC_SITE_URL` a la URL del Worker |
| FUN-001 | Security | **P1** | S | Faltan headers de seguridad: X-Content-Type-Options, Referrer-Policy, HSTS | `curl -I` — 0 headers de seguridad | Vulnerable a MIME sniffing, clickjacking | Agregar middleware o configurar headers en wrangler |
| SEO-002 | SEO | **P1** | S | `<title>` del homepage excede 60 caracteres (61 chars) | `index.astro` — title concatenado con SITE.NAME | Google trunca en SERPs | Acortar a ≤50 chars |
| SEO-003 | SEO | **P1** | S | `<meta description>` del homepage excede 160 caracteres (~318 chars) | `index.astro` | Google trunca la descripción | Acortar a 150-160 chars |
| FUN-002 | Security | **P2** | M | Falta Content-Security-Policy | No hay CSP configurado | Vulnerable a XSS sin mitigación | Configurar CSP restrictivo |
| SEO-004 | SEO | **P2** | S | sitemap.xml: `<lastmod>1970-01-01</lastmod>` en combos servicio×ubicación | `sitemap.xml.ts:72` | Google puede devaluar las URLs | Fijar lastmod a fecha real |
| PERF-001 | Performance | **P2** | S | `main.js` y `yt-lite.js` se cargan sin `defer`/`async` (parser-blocking) | `BaseLayout.astro:263-264` | Bloquea el parser, afecta FCP | Agregar `defer` |
| PERF-002 | Performance | **P2** | M | Leaflet JS/CSS se cargan de forma bloqueante en homepage | `index.astro:337` | Afecta LCP en homepage | Cargar con `defer` o `client:idle` |
| A11Y-001 | Accesibilidad | **P2** | S | Footer links: `rgba(255,255,255,.55)` sobre fondo oscuro no cumple contraste AA (3.5:1) | `site.css:177` | Texto ilegible para usuarios con baja visión | Cambiar a `rgba(255,255,255,.7)` |
| PERF-003 | Performance | **P3** | S | HTML responses sin Cache-Control header | `curl -I` | Navegadores usan heurística | Agregar `Cache-Control: public, max-age=3600` |
| A11Y-002 | Accesibilidad | **P3** | S | Secciones oscuras: texto `rgba(255,255,255,.7)` marginal en AA | CSS | Contraste borderline | Cambiar a `.75` o `.8` |
| UX-001 | Responsive | **P3** | S | Logo: 42px/38px vs especificación AGENTS.md de 50px/44px | `site.css:31-32` | Inconsistencia con design spec | Ajustar a 50px/44px |
| FUN-003 | Security | **P3** | S | Falta Permissions-Policy header | — | Exposición de APIs del browser | Agregar header |

### 2.2 Panel de control

| ID | Categoría | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|---|
| SEC-001 | Auth | **P0** | L | Admin routes sin protección server-side | `AdminLayout.astro:28` — solo script client-side. `curl /admin` → 200 con HTML completo | Cualquiera accede al panel completo sin login | Implementar middleware SSR que verifique JWT |
| SEC-005 | Auth | **P0** | S | Token admin hardcodeado y expuesto al cliente | `denuncias/index.ts:64`, `denuncias.astro:253` — `define:vars` inyecta token en HTML | Compromete confidencialidad del canal de denuncias MPD | Mover a wrangler secret, NO inyectar en HTML |
| FUN-004 | Negocio | **P0** | S | PATCH denuncias acepta token hardcodeado como fallback | `denuncias/[id].ts:56` — `env.DENUNCIAS_ADMIN_TOKEN ?? 'v41-denu-2026'` | Cualquiera puede modificar estados de denuncias | Eliminar fallback hardcoded |
| SEC-002 | Auth | **P1** | M | JWT almacenado en localStorage | `auth.ts:7-10` | XSS → robo de tokens (access 2h, refresh 30d) | Migrar a cookies httpOnly |
| SEC-006 | API | **P1** | M | Rate limiting solo client-side en login | `login.astro:52-70` — localStorage | Bypass fácil: limpiar localStorage, usar curl | Implementar rate limiting server-side |
| SEC-007 | API | **P1** | M | Sin protección CSRF | 0 referencias a CSRF en código | Atacante puede forzar acciones desde otro sitio | Implementar double-submit cookie |
| FUN-001 | Negocio | **P1** | L | CRM usa datos mock, no persiste | `crm-data.ts` — array hardcodeado. Islands no llaman a API | Panel es una demo funcional, no producción | Conectar React islands a API real |
| FUN-002 | Negocio | **P1** | M | Endpoint /api/login no existe en este worker | POST `/api/login` → 404 | Login no funciona | Implementar endpoints de auth o configurar API_URL externo |
| FUN-003 | Negocio | **P1** | M | Denuncias admin lee D1 sin auth SSR | `denuncias.astro:41-58` | HTML contiene todas las denuncias sin login | Verificar JWT en middleware |
| SEC-003 | Auth | **P2** | M | No hay roles/permisos | `auth.ts` — solo distingue logueado/no logueado | Cualquier usuario tiene acceso total | Implementar RBAC |
| SEC-009 | API | **P2** | S | 17 usos de `set:html` (actualmente seguros, riesgo futuro) | Múltiples archivos | XSS si se conecta a CMS dinámico | Auditar periódicamente |
| UX-002 | UX | **P2** | M | Sin loading states (skeletons/spinners) | Todos los .tsx | Usuario ve panel vacío 1-3s mientras React hidrata | Agregar skeletons |
| UX-003 | UX | **P2** | M | Sin error states en componentes React | Todos los .tsx | API failure → componente se rompe silenciosamente | Implementar Error Boundaries |
| SEC-004 | Auth | **P3** | S | Email pre-rellenado en login | `login.astro:31` | Facilita fuerza bruta | Eliminar value pre-rellenado |
| SEC-010 | API | **P3** | S | Hardcoded salt para IP hashing | `denuncias/index.ts:94` | Salt predecible, evasión de rate-limit | Mover a env.DENU_SALT |
| UX-004 | UX | **P3** | S | Acciones destructivas sin confirmación | `LeadsList.tsx:99`, `LeadDetail.tsx:371` | Click accidental descarta lead | Agregar confirm() |
| UX-005 | UX | **P3** | M | Sin paginación en listas | `LeadsList.tsx`, `denuncias.astro:48` (LIMIT 200) | Lento con miles de registros | Implementar paginación server-side |
| UX-006 | UX | **P3** | S | Demo mode bypassa auth guard | `admin-auth-guard.js:7-9` | Cualquiera puede setear demo mode en localStorage | Eliminar bypass |

### 2.3 Seguridad

| ID | Categoría | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|---|
| SEC-001 | Auth | **P0** | L | Admin routes sin auth server-side | Ver 2.2 | Panel accesible sin login | Middleware SSR |
| SEC-005 | Auth | **P0** | S | Token admin hardcodeado + expuesto en HTML | Ver 2.2 | Canal de denuncias comprometido | Wrangler secret |
| SEC-D3-001 | Deps | **P0** | M | 13 vulnerabilidades npm (11 high) | `npm audit` | XSS, path traversal | `npm audit fix` |
| SEC-D3-002 | Deps | **P0** | M | Astro XSS: CVE-2026-54298, CVE-2026-7pw4, CVE-2026-4g3v | `npm audit` — astro <=7.0.9 | Inyección de scripts | Actualizar a astro >=7.2.1 |
| SEC-002 | Auth | **P1** | M | JWT en localStorage | Ver 2.2 | Robo de tokens via XSS | Cookies httpOnly |
| SEC-006 | API | **P1** | M | Rate limiting solo client-side | Ver 2.2 | Bypass de login rate-limit | Rate limiting server-side |
| SEC-007 | API | **P1** | M | Sin protección CSRF | Ver 2.2 | Acciones forzadas desde otro sitio | Double-submit cookie |
| SEC-D3-003 | Deps | **P1** | S | Vite path traversal (Windows dev) | `npm audit` — vite 7.0.0-7.3.3 | Archivos expuestos en desarrollo | Actualizar vite >=7.3.6 |
| SEC-D3-004 | Deps | **P1** | S | esbuild arbitrary file read | `npm audit` | Archivos locales expuestos | `npm audit fix` |
| SEC-003 | Auth | **P2** | M | No hay roles/permisos | Ver 2.2 | Acceso total a cualquier usuario autenticado | RBAC |
| SEC-009 | API | **P2** | S | 17 usos de `set:html` (actualmente seguros) | Ver 2.2 | Riesgo futuro si CMS dinámico | Auditar |
| SEC-004 | Auth | **P3** | S | Email pre-rellenado en login | Ver 2.2 | Facilita fuerza bruta | Eliminar |
| SEC-010 | API | **P3** | S | Hardcoded salt para IP hash | Ver 2.2 | Evasión de rate-limit | Mover a secret |

### 2.4 Calidad de código

| ID | Categoría | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|---|
| LEGACY-D5-001 | Testing | **P0** | S | Test roto: `constants.test.ts` espera 4 STATS keys, código tiene 3 | `npm test` — AssertionError | CI no pasa | Fix test o agregar key |
| LEGACY-D2-001 | Dead code | **P2** | S | `ADMIN_NAV` exportado sin imports | `constants.ts:237-242` | Código muerto | Eliminar |
| LEGACY-D2-002 | Dead code | **P2** | S | `SOCIAL_PROFILES` exportado sin imports | `constants.ts:278-281` | Código muerto | Eliminar |
| LEGACY-D2-003 | Dead code | **P2** | S | `LOCATION_NAMES` exportado sin imports | `constants.ts:131-133` | Código muerto | Eliminar |
| LEGACY-D2-004 | Dead code | **P2** | S | `CLIENTES` en content.ts sin imports | `content.ts:995-1004` | Código muerto | Eliminar |
| LEGACY-D2-005 | Dead code | **P2** | S | `HERO_STATS` en content.ts sin imports | `content.ts:1007-1011` | Código muerto | Eliminar |
| LEGACY-D2-006 | Dead code | **P2** | S | `NOSOTROS_TIMELINE` en content.ts sin imports | `content.ts:1014-1020` | Código muerto | Eliminar |
| LEGACY-D2-007 | Dead code | **P2** | S | `icon()`, `serviceIcon()`, `sectorIcon()` sin imports | `icons.ts:89-101` | Código muerto | Eliminar |
| LEGACY-D1-001 | Types | **P2** | S | `src/types/index.ts` — 12 interfaces nunca importadas | grep = 0 resultados | Archivo huérfano | Eliminar |
| LEGACY-D1-002 | Types | **P2** | S | Regex duplicadas entre validation.ts y denuncias-validation.ts | `EMAIL_RE`, `PHONE_RE` idénticas | Duplicación | Extraer a patterns.ts |
| LEGACY-D5-002 | Testing | **P1** | M | Sin tests para denuncias-validation.ts | No existe test file | Compliance flow sin cobertura | Crear tests |
| LEGACY-D5-003 | Testing | **P1** | M | Sin tests para seo.ts | No existe test file | Schema.org sin cobertura | Crear tests |
| LEGACY-D4-001 | Tools | **P1** | S | No hay linter/formatter configurado | 0 archivos .eslintrc/.prettierrc/biome | Inconsistencia no detectada | Configurar Biome |
| LEGACY-D2-008 | Dead code | **P3** | S | `imageUrl` en api.ts sin imports | `api.ts:157` | Código muerto | Eliminar |
| LEGACY-D2-009 | Dead code | **P3** | S | `contentCluster()` en seo.ts sin imports | `seo.ts:416-433` | Código muerto | Eliminar |
| LEGACY-D3-001 | Deps | **P3** | S | `jsdom` en devDeps pero vitest usa `node` env | `package.json:35` | Dependencia innecesaria | Eliminar |
| LEGACY-D4-003 | Naming | **P3** | L | Nombres mixtos español/inglés | Varios archivos | Menor legibilidad | Documentar convención |
| LEGACY-D5-005 | Testing | **P2** | S | E2E admin mínimo (1 test) | `tests/e2e/admin.spec.ts` | Flujos críticos no verificados | Agregar E2E |
| LEGACY-D5-007 | Testing | **P3** | S | Tests solo Chromium | `playwright.config.ts` | No verifica Firefox/Safari | Agregar projects |

### 2.5 Producción / infra

| ID | Categoría | Severidad | Effort | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|---|---|---|
| PROD-005 | Dominio | **P0** | M | `guardman.cl` apunta a Google Sites, no al Worker | `curl -I https://guardman.cl` → Server: ESF. `wrangler.jsonc` sin routes | Leads no encuentran el sitio real | Migrar zona a Cloudflare + agregar routes |
| PROD-001 | Deploy | **P1** | S | Hardcoded admin token en endpoints | `denuncias/index.ts:64`, `denuncias/[id].ts:56` | Token público en código | `wrangler secret put` |
| PROD-006 | DNS | **P1** | S | Sin registro SPF | `nslookup -type=TXT guardman.cl` | Emails marcados como spam | Agregar TXT SPF |
| PROD-007 | DNS | **P1** | S | Sin registro DMARC | `nslookup -type=TXT _dmarc.guardman.cl` | Vulnerable a spoofing | Crear registro DMARC |
| PROD-010 | Observ. | **P1** | S | Health endpoint no verifica D1 | `health.ts:20-37` — JSON estático | No detecta degradación | Agregar `SELECT 1` a health |
| PROD-013 | Backups | **P1** | M | Sin estrategia de backup D1 | 0 scripts de backup | Pérdida de denuncias (Ley 20.393) | Script + cron semanal |
| PROD-002 | Deploy | **P2** | S | Hardcoded salt para anti-spam | `denuncias/index.ts:94` | Evasión de rate-limit | Mover a secret |
| PROD-004 | Deploy | **P2** | S | STATUS.md desactualizado (dice v4.1.0, live es v4.5.0) | `STATUS.md` vs `/api/health` | Confusión sobre versión real | Actualizar STATUS.md |
| PROD-008 | DNS | **P2** | M | Nameservers en INC.cl (no Cloudflare) | `nslookup` — ns01-04.inc.cl | No se puede usar proxy Cloudflare | Evaluar migración |
| PROD-011 | Observ. | **P2** | M | Sin logging estructurado | 0 console.log en código | Imposible auditar post-mortem | Agregar logging en endpoints críticos |
| PROD-014 | Backups | **P2** | L | Sin versionado para assets críticos | `wrangler.jsonc` — solo ASSETS | No se puede revertir assets | Considerar R2 con versioning |
| PROD-017 | Legal | **P2** | S | Analytics con consentimiento pero sin tracking | `Analytics.astro` sin props | Banner de cookies innecesario | Configurar o eliminar Analytics |
| PROD-003 | Deploy | **P3** | S | Build warning: punycode deprecado | Build output | No afecta producción | Monitorear |
| PROD-009 | DNS | **P3** | S | DKIM presente pero sin SPF/DMARC complementarios | `nslookup` — DKIM válido | Protección parcial | Completar con SPF+DMARC |
| PROD-012 | Observ. | **P3** | — | Observability configurado correctamente | `wrangler.jsonc:18-22` | ✅ Positivo | Mantener |

---

## 3. Plan de remediación sugerido

### Sprint 1 (esta semana) — P0

| # | Tarea | Archivos a tocar | Criterios de aceptación | Riesgo |
|---|---|---|---|---|
| 1 | **Middleware SSR para admin** | Crear `src/middleware.ts` | `curl /admin` → 302→/admin/login sin JWT válido | Medio — puede romper admin si JWT no está configurado |
| 2 | **Eliminar token hardcodeado** | `src/pages/api/denuncias/index.ts`, `[id].ts`, `src/pages/admin/denuncias.astro` | Token solo via `env.DENUNCIAS_ADMIN_TOKEN`, sin fallback. `define:vars` eliminado | Alto — denuncias deja de funcionar si secret no está configurado |
| 3 | **Conectar dominio o cambiar SITE_URL** | `wrangler.jsonc` o DNS | Canonical, OG, sitemap apuntan a URL que resuelve | Alto — afecta SEO |
| 4 | **Fix test roto** | `tests/constants.test.ts` | `npm test` → 27/27 pasando | Bajo |
| 5 | **`npm audit fix`** | `package.json`, `package-lock.json` | 0 vulnerabilidades high | Medio — puede haber breaking changes |
| 6 | **Headers de seguridad** | `src/middleware.ts` o `wrangler.jsonc` | X-Content-Type-Options, Referrer-Policy, HSTS presentes | Bajo |

### Sprint 2 — P1

| # | Tarea | Archivos a tocar | Criterios de aceptación | Riesgo |
|---|---|---|---|---|
| 7 | **JWT en cookies httpOnly** | `src/lib/auth.ts`, `src/pages/admin/login.astro` | Token no accesible via JS | Medio |
| 8 | **Rate limiting server-side** | `src/pages/api/denuncias/index.ts`, login endpoint | Max 5 intentos/min por IP | Bajo |
| 9 | **CSRF protection** | `src/middleware.ts`, forms | Token CSRF verificado en mutaciones | Bajo |
| 10 | **Shorten title + meta description** | `src/pages/index.astro` | Title ≤60 chars, description ≤160 chars | Bajo |
| 11 | **Tests denuncias-validation** | Crear `tests/denuncias-validation.test.ts` | ≥8 tests pasando | Bajo |
| 12 | **DNS: SPF + DMARC** | DNS records | `nslookup` muestra registros | Bajo |
| 13 | **Health check con D1** | `src/pages/api/health.ts` | Health falla si D1 no responde | Bajo |
| 14 | **Backup D1** | Crear script en `scripts/` | Script ejecutable, documentado | Bajo |
| 15 | **Configurar linter** | Crear `biome.json`, agregar script `"lint"` | `npm run lint` pasa | Bajo |

### Backlog P2/P3

| # | Tarea | Esfuerzo |
|---|---|---|
| 16 | Agregar `defer` a main.js y yt-lite.js | S |
| 17 | Fix lastmod en sitemap para combos | S |
| 18 | Mejorar contraste footer links | S |
| 19 | Eliminar código muerto (9+ exports, types/index.ts) | S |
| 20 | Loading states + Error states en React islands | M |
| 21 | E2E tests para admin flows | M |
| 22 | Logging estructurado en endpoints críticos | M |
| 23 | Decidir sobre Analytics (configurar o eliminar) | S |
| 24 | Ajustar logo a 50px/44px per AGENTS.md | S |
| 25 | Eliminar jsdom de devDeps | S |

---

## 4. Riesgos residuales

Incluso después de aplicar el plan de remediación:

1. **CRM es mock** — Los React islands del panel son demos funcionales. Conectar a API real requiere implementar endpoints CRM en el Worker o en un Worker separado. Esto es trabajo de semanas, no días.

2. **Login no funciona** — El endpoint `/api/login` no existe en este Worker. El sistema JWT fue diseñado para un backend que nunca se implementó aquí. La autenticación real requiere arquitectura de backend.

3. **Denuncias admin sin roles** — No hay RBAC. Cualquier usuario autenticado puede gestionar denuncias. Para compliance MPD, debería haber roles.

4. **Sin tests E2E completos** — Solo 1 test admin (login rate-limit). Los flujos críticos del panel no están verificados end-to-end.

5. **DNS en INC.cl** — Los nameservers no están en Cloudflare. Sin proxy, no hay DDoS protection ni WAF.

---

## 5. Checklist de entrega a cliente

- [ ] **Dominio custom conectado** — `guardman.cl` resuelve al Worker
- [ ] **HTTPS forzado** — Redirect HTTP→HTTPS + HSTS header
- [ ] **404/500 pages personalizadas** — 404 existe ✅, 500 pendiente
- [ ] **Términos y privacidad publicados** — ✅ Ambos completos
- [ ] **Smoke tests pasando** — 27 unit tests, verificar post-deploy
- [ ] **Build limpio** — ✅ (1 warning Node.js, no errores)
- [ ] **Deploy reproducible documentado** — ✅ en README.md
- [ ] **Backups configurados** — ❌ Sin estrategia de backup D1
- [ ] **Observabilidad básica** — ⚠️ Observability OK, health check no verifica D1
- [ ] **DNS limpio** — ❌ Sin SPF ni DMARC
- [ ] **Headers de seguridad** — ❌ 0 headers configurados
- [ ] **Admin protegido server-side** — ❌ Solo client-side auth
- [ ] **Secrets migrados** — ❌ Token hardcodeado

**Estado:** 3/13 checks pasando. Requiere trabajo significativo antes de entrega.

---

## Datos del auditor

- **Fecha:** 2026-08-13
- **Versión auditada:** v5.2.0 (local) / v4.5.0 (producción)
- **Herramientas:** curl, lectura de código fuente, npm audit, npm test
- **Documentos de fase:** `docs/auditoria/fase-{a,b,c,d,e}-*.md`
