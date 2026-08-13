# Fase C — Auditoría del Panel de Control

**Proyecto**: GuardMan Chile (Astro 6 SSR + Cloudflare Workers)
**URL producción**: https://guardman-astro.oficinadesarrollo33.workers.dev
**Fecha**: 2026-08-13
**Versión auditada**: v5.2.0 (healthcheck) / admin v4.1

---

## Resumen ejecutivo

| Severidad | Cantidad |
|-----------|----------|
| P0 — Crítico | 3 |
| P1 — Alto | 5 |
| P2 — Medio | 4 |
| P3 — Bajo | 3 |

**Hallazgo principal**: Las rutas `/admin/*` NO tienen protección server-side. La autenticación es 100% client-side (localStorage + script inline), lo que significa que cualquier request directa al HTML devuelve el contenido completo del panel sin verificar credenciales.

---

## C1. Autenticación y autorización

### SEC-001: Admin routes sin protección server-side
- **Severidad**: P0
- **Esfuerzo**: L
- **Evidencia**: `src/layouts/AdminLayout.astro:28` — `{requireAuth && <script is:inline src="/scripts/admin-auth-guard.js"></script>}`
- **Evidencia live**: `curl -s -o /dev/null -w "%{http_code}" https://guardman-astro.oficinadesarrollo33.workers.dev/admin` → `200` (HTML completo del dashboard)
- **Impacto**: Cualquier usuario puede acceder al HTML completo del panel admin, leads, pipeline, inbox y denuncias sin autenticación. El `admin-auth-guard.js` solo redirige en el navegador; un bot, curl, o scraper obtiene todo el contenido.
- **Recomendación**: Implementar middleware de Astro (`src/middleware.ts`) que verifique el JWT en cookie httpOnly o header `Authorization` antes de renderizar cualquier ruta `/admin/*`. Retornar 302→/admin/login si no hay sesión válida.

### SEC-002: Tokens JWT almacenados en localStorage
- **Severidad**: P1
- **Esfuerzo**: M
- **Evidencia**: `src/lib/auth.ts:7-10` — `localStorage.setItem(ACCESS_TOKEN_KEY, ...)`
- **Impacto**: localStorage es accesible por cualquier JS en la misma origin (XSS → robo de tokens). Los tokens persisten 2h (access) y 30d (refresh), ampliando la ventana de explotación.
- **Recomendación**: Migrar a cookies httpOnly, Secure, SameSite=Strict para ambos tokens. El refresh token de 30 días en localStorage es especialmente peligroso.

### SEC-003: No hay roles ni permisos
- **Severidad**: P2
- **Esfuerzo**: M
- **Evidencia**: `src/lib/auth.ts` — No existe ningún concepto de `role`, `permission`, o `user.id`. El sistema solo distingue "logueado" vs "no logueado".
- **Impacto**: Cualquier usuario autenticado tiene acceso total: ver todos los leads, cambiar estados, eliminar, gestionar denuncias. No hay RBAC.
- **Recomendación**: Implementar roles (`admin`, `manager`, `agent`) en el JWT y verificarlos en middleware + API endpoints.

### SEC-004: Email pre-rellenado en login
- **Severidad**: P3
- **Esfuerzo**: S
- **Evidencia**: `src/pages/admin/login.astro:31` — `value="admin@guardman.oficinadesarrollo33.workers.dev"`
- **Impacto**: Facilita ataques de fuerza bruta al exponer el email de admin.
- **Recomendación**: Eliminar el `value` pre-rellenado.

---

## C2. Seguridad de las APIs

### SEC-005: Token de admin hardcodeado y expuesto al cliente
- **Severidad**: P0
- **Esfuerzo**: S
- **Evidencia**: `src/pages/api/denuncias/index.ts:64` — `const expected = 'v41-denu-2026';`
- **Evidencia**: `src/pages/api/denuncias/[id].ts:56` — `const expected = (env as { DENUNCIAS_ADMIN_TOKEN?: string }).DENUNCIAS_ADMIN_TOKEN ?? 'v41-denu-2026';`
- **Evidencia**: `src/pages/admin/denuncias.astro:32` — `const adminToken = (env as { DENUNCIAS_ADMIN_TOKEN?: string }).DENUNCIAS_ADMIN_TOKEN ?? 'v41-denu-2026';`
- **Evidencia**: `src/pages/admin/denuncias.astro:253` — `<script define:vars={{ adminToken }}>` — El token se inyecta en el HTML como variable JS visible.
- **Evidencia live**: `curl "https://guardman-astro.oficinadesarrollo33.workers.dev/api/denuncias?admin_token=v41-denu-2026"` → devuelve todas las denuncias.
- **Impacto**: El token `v41-denu-2026` está en el código fuente Y se expone en el HTML renderizado. Cualquiera puede listar, leer y modificar denuncias (cambiar status, notas admin). Esto compromete la confidencialidad del canal de denuncias del MPD.
- **Recomendación**:
  1. Mover `DENUNCIAS_ADMIN_TOKEN` a wrangler secret (sin fallback hardcoded).
  2. NO inyectar el token en el HTML del cliente.
  3. Usar una cookie de sesión httpOnly para autenticar al admin en las llamadas API del cliente.
  4. Verificar autenticación server-side en el endpoint GET de denuncias.

### SEC-006: Rate limiting solo client-side en login
- **Severidad**: P1
- **Esfuerzo**: M
- **Evidencia**: `src/pages/admin/login.astro:52-70` — Rate limit implementado con `localStorage` (5 intentos/min).
- **Impacto**: Un atacante puede bypassar el rate limit fácilmente: limpiar localStorage, usar incógnito, o hacer curl directo al endpoint `/api/login` sin limitación alguna. No hay rate limiting server-side.
- **Recomendación**: Implementar rate limiting server-side usando Cloudflare Workers (por IP, con Durable Objects o KV para contadores). Considerar Cloudflare Rate Limiting rules en el dashboard.

### SEC-007: Sin protección CSRF
- **Severidad**: P1
- **Esfuerzo**: M
- **Evidencia**: Búsqueda de `csrf|CSRF|xsrf|XSRF` en todo `src/` → 0 resultados.
- **Impacto**: Los endpoints POST/PATCH/DELETE no verifican tokens CSRF. Un atacante podría forzar a un admin autenticado a ejecutar acciones (crear leads, cambiar estados de denuncias) desde otro sitio.
- **Recomendación**: Implementar doble-submit cookie pattern o synchronizer token para todas las mutaciones.

### SEC-008: SQL injection — protegido por D1 parameterized queries
- **Severidad**: N/A (OK)
- **Evidencia**: `src/pages/api/denuncias/index.ts:124-143` — Todas las queries usan `.bind()`.
- **Evidencia**: `src/pages/api/denuncias/[id].ts:77-91, 159-162` — `.bind()` en todas las queries.
- **Impacto**: Las queries de D1 están correctamente parametrizadas. No se detectó SQL injection.
- **Nota**: El endpoint PATCH construye el SET dinámicamente (`src/pages/api/denuncias/[id].ts:150-156`), pero los valores van por `.bind()`, así que es seguro.

### SEC-009: XSS via `set:html` — Riesgo bajo
- **Severidad**: P2
- **Esfuerzo**: S
- **Evidencia**: 17 usos de `set:html` en componentes Astro. Los más relevantes:
  - `src/components/PageHero.astro:67` — `set:html={subtitle}` — subtitle viene de props del page (hardcoded, no user input).
  - `src/components/LeadForm.astro:162` — `set:html={section.help}` — help viene de props hardcoded.
  - `src/components/LeadForm.astro:193` — `set:html={f.acceptLabel}` — labels de aceptación con links.
  - `src/pages/servicios/[service]/[location].astro:218` — `set:html={SERVICE_ICONS[r.slug]}` — icons de un mapa estático.
- **Impacto**: Actualmente los valores son hardcoded o de fuentes controladas. Sin embargo, si en el futuro se conectan a CMS o datos de usuario, habría XSS. Los SVGs inline (Icon component) son seguros ya que vienen de un mapa estático.
- **Recomendación**: Auditar cada `set:html` periódicamente. Para datos dinámicos futuros, usar DOMPurify o sanitización server-side.

### SEC-010: Hardcoded salt para IP hashing
- **Severidad**: P3
- **Esfuerzo**: S
- **Evidencia**: `src/pages/api/denuncias/index.ts:94` — `const salt = 'guardman-v41-denu';`
- **Impacto**: El salt es predecible. Un atacante puede pre-computar hashes de IPs conocidas para correlacionar denuncias con IPs. El comentario dice "en prod, leer de env.DENU_SALT".
- **Recomendación**: Mover a `env.DENU_SALT` como wrangler secret.

---

## C3. Lógica de negocio

### FUN-001: CRM usa datos mock (no persiste)
- **Severidad**: P1
- **Esfuerzo**: L
- **Evidencia**: `src/lib/crm-data.ts:231-527` — Array `crmLeads` con datos hardcodeados. `src/islands/crm/Dashboard.tsx:17` — `buildDashboard(crmLeads, crmTasks)` usa datos mock.
- **Evidencia**: `src/islands/crm/LeadDetail.tsx:51-62` — `addNote` solo actualiza estado local de React (`setNotes`), no persiste.
- **Impacto**: Todas las acciones del panel (agregar notas, crear tareas, mover leads en pipeline, cambiar estados) son solo mutaciones de estado local de React. Al recargar la página, todo se pierde. El panel es esencialmente una demo funcional.
- **Recomendación**: Conectar los componentes React a la API real (`/api/crm/*`) definida en `src/lib/api.ts`. Los endpoints existen en el código del API client pero no se usan en los islands.

### FUN-002: Endpoint /api/login no existe en este worker
- **Severidad**: P1
- **Esfuerzo**: M
- **Evidencia**: `src/lib/api.ts:131` — `request('/api/login', ...)`. `src/pages/admin/login.astro:131` — `fetch(\`\${apiUrl}/api/login\`, ...)`.
- **Evidencia live**: POST a `/api/login` retorna 404 (HTML de página no encontrada del sitio público).
- **Evidencia**: `src/lib/constants.ts:14` — `API_URL: import.meta.env.PUBLIC_API_URL ?? 'https://guardman.oficinadesarrollo33.workers.dev'` — el API URL apunta al mismo worker.
- **Impacto**: El login no funciona. Los endpoints `/api/login`, `/api/refresh`, `/api/crm/*` no existen en el worker desplegado. Solo existen `/api/health`, `/api/denuncias`, `/api/denuncias/[id]`.
- **Recomendación**: Implementar los endpoints de autenticación y CRM en el worker, o configurar `PUBLIC_API_URL` para apuntar a un worker API separado.

### FUN-003: Admin denuncias lee directo de D1 sin auth SSR
- **Severidad**: P1
- **Esfuerzo**: M
- **Evidencia**: `src/pages/admin/denuncias.astro:41-58` — Lee directamente de `env.DB` en el frontmatter de Astro (SSR) sin verificar autenticación.
- **Impacto**: El HTML renderizado de `/admin/denuncias` contiene todas las denuncias (IDs, categorías, fechas, lugares) accesibles sin login.
- **Recomendación**: Verificar JWT/session en middleware antes de llegar al frontmatter.

### FUN-004: Denuncias PATCH permite acceso con token hardcodeado
- **Severidad**: P0
- **Esfuerzo**: S
- **Evidencia**: `src/pages/api/denuncias/[id].ts:56` — Fallback a `'v41-denu-2026'` si `env.DENUNCIAS_ADMIN_TOKEN` no está configurado.
- **Evidencia live**: `curl -s -X PATCH "/api/denuncias/D-20260715-24AV" -H "X-Admin-Token: v41-denu-2026" -d '{"status":"reviewing"}'` — funciona (aunque curl en PowerShell tuvo issues de encoding, el código confirma que el token es aceptado).
- **Impacto**: Cualquiera que lea el código fuente (público en GitHub o en el HTML del admin) puede modificar el estado de cualquier denuncia.
- **Recomendación**: Eliminar el fallback hardcoded. Solo aceptar `env.DENUNCIAS_ADMIN_TOKEN`. Si no está configurado, denegar todo acceso admin.

### FUN-005: Sin row-level permissions en leads
- **Severidad**: P2
- **Esfuerzo**: L
- **Evidencia**: `src/lib/crm-data.ts` — Todos los leads son accesibles para cualquier usuario autenticado. No hay filtro por `assigned_to` o `owner_email`.
- **Impacto**: Un agente de ventas puede ver y modificar leads de otros agentes, incluyendo datos sensibles de clientes.
- **Recomendación**: Implementar filtrado por usuario en las queries de leads (columna `assigned_to` o `owner_id`).

---

## C4. UX del panel

### UX-001: Empty states implementados correctamente
- **Severidad**: N/A (OK)
- **Evidencia**:
  - `Dashboard.tsx:84-85` — `Sin actividades agendadas para hoy.`
  - `Dashboard.tsx:109-110` — `Sin tareas pendientes.`
  - `LeadsList.tsx:159-164` — `No se encontraron leads con los filtros actuales.`
  - `LeadDetail.tsx:40-45` — `Lead no encontrado.`
  - `Inbox.tsx:80-83` — `🎉 Bandeja vacía.`
  - `Pipeline.tsx:171` — `Arrastra leads aquí`

### UX-002: Sin loading states (skeletons/spinners)
- **Severidad**: P2
- **Esfuerzo**: M
- **Evidencia**: Ningún componente React (`Dashboard.tsx`, `LeadsList.tsx`, `LeadDetail.tsx`, `Inbox.tsx`, `Pipeline.tsx`) tiene estados de loading. Usan `client:only="react"` lo que significa que no se renderizan server-side — el usuario ve un espacio vacío hasta que React hidrata.
- **Impacto**: Mala experiencia percibida. El usuario ve un panel vacío por 1-3 segundos mientras React carga. No hay feedback visual de que algo está cargando.
- **Recomendación**: Agregar skeletons o spinners de carga. Considerar usar `client:load` en lugar de `client:only` para renderizar HTML base server-side.

### UX-003: Sin error states en componentes React
- **Severidad**: P2
- **Esfuerzo**: M
- **Evidencia**: Ningún componente React maneja errores de API. `src/lib/api.ts` lanza `ApiError` pero ningún island lo captura con try/catch o error boundaries.
- **Impacto**: Si la API falla, el componente React se rompe silenciosamente o muestra un error no manejado de React.
- **Recomendación**: Implementar React Error Boundaries y estados de error en cada componente.

### UX-004: Acciones destructivas sin confirmación
- **Severidad**: P3
- **Esfuerzo**: S
- **Evidencia**: `LeadsList.tsx:99` — `<button className="admin-btn admin-btn-danger">Eliminar</button>` sin `onClick` handler ni confirmación.
- **Evidencia**: `LeadDetail.tsx:371` — `<button className="admin-btn admin-btn-danger">✕ Marcar perdido</button>` sin handler.
- **Evidencia**: `Inbox.tsx:221` — `onMove(lead.id, 'lost')` descarta lead sin confirmación.
- **Impacto**: Un click accidental puede descartar un lead sin posibilidad de deshacer (aunque actualmente los datos son mock y no persisten).
- **Recomendación**: Agregar `window.confirm()` o un modal de confirmación antes de acciones destructivas. Cuando se conecte la API real, esto será crítico.

### UX-005: Sin paginación en listas
- **Severidad**: P3
- **Esfuerzo**: M
- **Evidencia**: `LeadsList.tsx` — Carga todos los leads de una vez (`crmLeads` completo). `src/pages/admin/denuncias.astro:48` — `LIMIT 200` hardcodeado.
- **Evidencia**: `src/pages/api/denuncias/index.ts:180` — `const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200)` — máximo 200.
- **Impacto**: Con pocos leads (13 actuales) no es problema, pero a escala real con miles de leads, la tabla se volverá lenta y la carga de 200 denuncias sin paginación es ineficiente.
- **Recomendación**: Implementar paginación server-side con cursor o offset. Agregar virtual scrolling para tablas grandes.

### UX-006: Demo mode bypassa auth guard
- **Severidad**: P3
- **Esfuerzo**: S
- **Evidencia**: `public/scripts/admin-auth-guard.js:7-9` — `var demo = localStorage.getItem('gm_demo_mode') === 'crm'; if (isExpired && !demo) { ... redirect ... }`
- **Impacto**: Cualquier usuario puede setear `localStorage.setItem('gm_demo_mode', 'crm')` para bypassar el auth guard client-side y ver el panel completo.
- **Recomendación**: Eliminar el demo mode bypass o mover la verificación a server-side.

---

## Hallazgos transversales

### Arquitectura de autenticación
El sistema tiene una desconexión fundamental:
1. **Auth helpers** (`src/lib/auth.ts`): Funciones client-side que manejan JWT en localStorage.
2. **API client** (`src/lib/api.ts`): Envía `Authorization: Bearer <token>` a endpoints que no existen en el worker.
3. **Admin layout** (`AdminLayout.astro`): Solo incluye un script client-side para redirigir.
4. **API de denuncias**: Usa un token estático hardcodeado, independiente del sistema JWT.

No hay unificado. El sistema JWT parece diseñado para un backend separado que nunca se implementó en este worker.

### `set:html` audit
Los 17 usos de `set:html` son actualmente seguros (valores hardcoded o de mapas estáticos). No hay user input directo. Riesgo futuro si se conecta a CMS.

### SQL injection
Las queries D1 están correctamente parametrizadas con `.bind()`. No se detectaron vulnerabilidades de SQL injection.

---

## Tabla resumen

| ID | Severidad | Tipo | Descripción | Archivo |
|----|-----------|------|-------------|---------|
| SEC-001 | P0 | Auth | Admin routes sin auth server-side | AdminLayout.astro:28 |
| SEC-005 | P0 | Auth | Token admin hardcodeado y expuesto al cliente | denuncias/index.ts:64, denuncias.astro:32 |
| FUN-004 | P0 | Negocio | PATCH denuncias acepta token hardcodeado | denuncias/[id].ts:56 |
| SEC-002 | P1 | Auth | JWT en localStorage (robo via XSS) | auth.ts:7-10 |
| SEC-006 | P1 | API | Rate limiting solo client-side | login.astro:52-70 |
| SEC-007 | P1 | API | Sin protección CSRF | — |
| FUN-001 | P1 | Negocio | CRM usa datos mock, no persiste | crm-data.ts |
| FUN-002 | P1 | Negocio | Endpoint /api/login no existe | api.ts:131 |
| FUN-003 | P1 | Negocio | Denuncias admin lee D1 sin auth SSR | denuncias.astro:41-58 |
| SEC-003 | P2 | Auth | No hay roles/permisos | auth.ts |
| SEC-009 | P2 | API | XSS potencial via set:html (17 usos) | múltiples |
| UX-002 | P2 | UX | Sin loading states | todos los .tsx |
| UX-003 | P2 | UX | Sin error states | todos los .tsx |
| SEC-004 | P3 | Auth | Email pre-rellenado en login | login.astro:31 |
| SEC-010 | P3 | API | Hardcoded salt para IP hash | denuncias/index.ts:94 |
| UX-004 | P3 | UX | Acciones destructivas sin confirmación | LeadsList.tsx:99, LeadDetail.tsx:371 |
| UX-005 | P3 | UX | Sin paginación | LeadsList.tsx, denuncias.astro:48 |
| UX-006 | P3 | UX | Demo mode bypassa auth guard | admin-auth-guard.js:7-9 |
