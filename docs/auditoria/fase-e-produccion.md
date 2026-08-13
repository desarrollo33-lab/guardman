# Fase E — Producción e Infraestructura

**Auditoría GuardMan Chile · Astro 6 SSR en Cloudflare Workers**
**Fecha:** 2026-08-13
**Producción:** https://guardman-astro.oficinadesarrollo33.workers.dev
**Versión producción (STATUS.md):** v4.1.0 · **Versión local (health endpoint):** v4.5.0

---

## Resumen ejecutivo

| Categoría | Hallazgos | P0 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| E1. Deploy | 4 | 0 | 1 | 2 | 1 |
| E2. Dominio y DNS | 5 | 1 | 2 | 1 | 1 |
| E3. Observabilidad | 3 | 0 | 1 | 1 | 1 |
| E4. Backups | 2 | 0 | 1 | 1 | 0 |
| E5. Legal y compliance | 3 | 0 | 0 | 2 | 1 |
| **Total** | **17** | **1** | **5** | **7** | **4** |

---

## E1. Deploy

### PROD-001 · Hardcoded admin token en endpoints de denuncias
- **Severidad:** P1 · **Esfuerzo:** S
- **Evidencia:**
  - `src/pages/api/denuncias/index.ts:64` — `const expected = 'v41-denu-2026';`
  - `src/pages/api/denuncias/[id].ts:56` — `env.DENUNCIAS_ADMIN_TOKEN ?? 'v41-denu-2026'`
- **Impacto:** Token de admin hardcodeado en el código fuente. Cualquiera con acceso al repo o al bundle desplegado puede gestionar denuncias. El endpoint `[id].ts` intenta leer el secret pero cae al fallback; `index.ts` ni siquiera intenta leer el env.
- **Recomendación:** Ejecutar `npx wrangler secret put DENUNCIAS_ADMIN_TOKEN` y eliminar el fallback hardcoded de ambos archivos. El endpoint `index.ts:checkAdmin()` debe usar el mismo patrón que `[id].ts:isAdmin()` (leer de `env`).

### PROD-002 · Hardcoded salt para anti-spam
- **Severidad:** P2 · **Esfuerzo:** S
- **Evidencia:** `src/pages/api/denuncias/index.ts:94` — `const salt = 'guardman-v41-denu'; // en prod, leer de env.DENU_SALT`
- **Impacto:** El salt para el hash SHA-256 de IPs está en el código. Un atacante puede pre-computar hashes y evadir el rate-limit de 5/IP/24h.
- **Recomendación:** Mover a `wrangler secret put DENU_SALT` y leer de `env`.

### PROD-003 · Build limpio con 1 warning
- **Severidad:** P3 · **Esfuerzo:** S
- **Evidencia:** Build output — `(node:10796) [DEP0040] DeprecationWarning: The 'punycode' module is deprecated.`
- **Impacto:** Warning de Node.js sobre módulo `punycode` deprecado. No afecta el build ni el bundle del worker (es un warning de Node, no del código Astro).
- **Recomendación:** Sin acción inmediata. Monitorear cuando se actualice Node.js.

### PROD-004 · Desfase de versión local vs producción
- **Severidad:** P2 · **Esfuerzo:** S
- **Evidencia:**
  - `STATUS.md:6` — "Snapshot local (sin deploy): v4.5.0"
  - `STATUS.md:7` — "Producción live: v4.1.0"
  - `src/pages/api/health.ts:27` — `version: '4.5.0'` (código local)
  - Live `/api/health` → `{"version":"4.5.0"}` (el deploy más reciente sí lleva v4.5.0)
- **Impacto:** STATUS.md dice que producción es v4.1.0 pero el health endpoint live devuelve v4.5.0. Esto indica que hubo un deploy posterior a la última actualización de STATUS.md. El snapshot del documento no refleja el estado real.
- **Recomendación:** Actualizar STATUS.md para reflejar la versión real en producción (v4.5.0).

---

## E2. Dominio y DNS

### PROD-005 · guardman.cl no apunta al Worker (P0)
- **Severidad:** P0 · **Esfuerzo:** M
- **Evidencia:**
  - `curl -I https://guardman.cl` → `Server: Apache`, `Location: https://www.guardman.cl/`
  - `curl -I https://www.guardman.cl` → `Server: ESF` (Google Sites)
  - `nslookup guardman.cl` → `200.24.13.85` (IP de INC.cl/Google)
  - `wrangler.jsonc` — sin `routes` ni `custom_domains`
- **Impacto:** El dominio principal `guardman.cl` sirve un sitio de Google Sites (Apache redirect → Google Sites). El proyecto real solo es accesible en `guardman-astro.oficinadesarrollo33.workers.dev`. Los leads que busquen "guardman.cl" no encuentran el sitio.
- **Recomendación:**
  1. Verificar si la zona `guardman.cl` está en la cuenta Cloudflare `oficinadesarrollo33@gmail.com`.
  2. Si está: migrar nameservers a Cloudflare y agregar `routes: [{ pattern: "guardman.cl/*", zone_name: "guardman.cl" }]` al wrangler.jsonc.
  3. Si no está: transferir la zona desde INC.cl a Cloudflare, o configurar CNAME/AAAA en INC.cl apuntando al worker.
  4. Actualizar `PUBLIC_SITE_URL` en wrangler.jsonc si se usa www.

### PROD-006 · Sin registro SPF
- **Severidad:** P1 · **Esfuerzo:** S
- **Evidencia:** `nslookup -type=TXT guardman.cl` — Solo devuelve `google-site-verification=...`. No hay registro `v=spf1 ...`.
- **Impacto:** Sin SPF, cualquier servidor puede enviar emails como `@guardman.cl`. Los emails legítimos del dominio (cotizaciones, notificaciones) serán marcados como spam o rechazados. Riesgo de phishing usando el dominio.
- **Recomendación:** Agregar registro TXT SPF. Ejemplo: `v=spf1 mx a:mail.guardman.cl include:_spf.google.com ~all` (ajustar según el proveedor de email real).

### PROD-007 · Sin registro DMARC
- **Severidad:** P1 · **Esfuerzo:** S
- **Evidencia:** `nslookup -type=TXT _dmarc.guardman.cl` → `Non-existent domain`
- **Impacto:** Sin DMARC, no hay política para manejar emails que fallen SPF/DKIM. Vulnerable a spoofing de dominio.
- **Recomendación:** Crear `_dmarc.guardman.cl` con TXT: `v=DMARC1; p=quarantine; rua=mailto:dmarc@guardman.cl; pct=100`

### PROD-008 · Nameservers en INC.cl (no Cloudflare)
- **Severidad:** P2 · **Esfuerzo:** M
- **Evidencia:** `nslookup guardman.cl` — Nameservers: `ns01.inc.cl`, `ns02.inc.cl`, `ns03.inc.cl`, `ns04.inc.cl`
- **Impacto:** Los DNS están gestionados por INC.cl, no por Cloudflare. No se puede usar Cloudflare como proxy (DDoS, WAF, cache edge). Si se quiere conectar el dominio al Worker con proxy, hay que migrar los nameservers.
- **Recomendación:** Evaluar migración de nameservers a Cloudflare. Alternativa: usar `workers.dev` como dominio canónico y configurar CNAME en INC.cl.

### PROD-009 · DKIM presente pero sin verificar
- **Severidad:** P3 · **Esfuerzo:** S
- **Evidencia:** `nslookup -type=TXT default._domainkey.guardman.cl` → devuelve registro DKIM válido (`v=DKIM1; k=rsa; p=...`)
- **Impacto:** DKIM está configurado correctamente (protege contra alteración de emails). Sin embargo, sin SPF y DMARC, la protección es parcial.
- **Recomendación:** Confirmar que el selector `default` es el correcto para el proveedor de email. Completar con SPF y DMARC (PROD-006, PROD-007).

---

## E3. Observabilidad

### PROD-010 · Health endpoint no verifica conectividad D1
- **Severidad:** P1 · **Esfuerzo:** S
- **Evidencia:** `src/pages/api/health.ts:20-37` — Devuelve JSON estático con `ok: true` sin hacer ping a D1 ni verificar bindings.
- **Impacto:** Si D1 (`guardman-v2-db`) cae o el binding se desconfigura, `/api/health` seguirá reportando `ok: true`. No hay forma de detectar degradación del servicio desde monitoreo externo.
- **Recomendación:** Agregar un `SELECT 1` a D1 dentro del health check. Si falla, devolver `ok: false` con status 503.

### PROD-011 · Sin logging estructurado en el código
- **Severidad:** P2 · **Esfuerzo:** M
- **Evidencia:** `grep console.log/warn/error src/**/*.ts` → 0 resultados. `wrangler.jsonc` tiene `observability.logs.enabled: true` pero el código no emite logs.
- **Impacto:** El dashboard de Cloudflare Workers captura logs del runtime, pero la aplicación no registra eventos de negocio (leads capturados, denuncias creadas, errores de validación). Imposible auditar comportamiento post-mortem.
- **Recomendación:** Agregar logging estructurado en endpoints críticos: `POST /api/denuncias`, `POST /api/crm/leads/capture`, errores 5xx. Formato JSON con `timestamp`, `level`, `event`, `data`.

### PROD-012 · Observability configurado correctamente
- **Severidad:** P3 · **Esfuerzo:** — (positivo)
- **Evidencia:** `wrangler.jsonc:18-22` — `observability: { enabled: true, logs: { enabled: true }, head_sampling_rate: 1 }`
- **Impacto:** Cloudflare Workers observability está habilitado con sampling al 100%. Los logs del runtime (request/response, errores no capturados) sí se registran.
- **Recomendación:** Mantener. Considerar reducir `head_sampling_rate` si el tráfico crece mucho (ahorro de costos).

---

## E4. Backups

### PROD-013 · Sin estrategia de backup para D1
- **Severidad:** P1 · **Esfuerzo:** M
- **Evidencia:**
  - `glob **/backup*` → 0 archivos
  - `scripts/` solo contiene: `compress-hero-webp.mjs`, `process-flota-portada.cjs`, `process-equipo-firma.cjs`, `lighthouse-audit.mjs`
  - No hay cron job ni script de backup para `guardman-v2-db`
- **Impacto:** La tabla `denuncias` contiene datos sensibles (denuncias anónimas bajo Ley 20.393). Si se borra la DB o se corrompe una migración, se pierden todas las denuncias sin posibilidad de recuperación.
- **Recomendación:**
  1. Script: `npx wrangler d1 export guardman-v2-db --remote > backups/d1-$(date +%Y%m%d).sql`
  2. Automatizar con GitHub Actions o cron local (semanal mínimo).
  3. Cloudflare D1 soporta `wrangler d1 backup create` (verificar disponibilidad en el plan).

### PROD-014 · Sin versionado para objetos críticos
- **Severidad:** P2 · **Esfuerzo:** L
- **Evidencia:** `wrangler.jsonc` — No hay configuración de R2 ni KV versioning. Solo D1 y ASSETS bindings.
- **Impacto:** Los assets estáticos (imágenes, CSS, JS) están en el binding ASSETS de Workers. Si se sobrescribe un asset en un deploy, no hay forma de revertir. Los datos en KV (SESSION) tampoco tienen versionado.
- **Recomendación:** Para assets: el deploy crea un nuevo bundle, así que los assets anteriores se pierden. Considerar subir imágenes críticas a R2 con versioning habilitado. Para SESSION KV: los datos de sesión son transitorios, menor riesgo.

---

## E5. Legal y compliance

### PROD-015 · Política de privacidad completa y conforme
- **Severidad:** — (positivo) · **Esfuerzo:** —
- **Evidencia:** `src/pages/privacidad.astro` (347 líneas)
  - Referencia Ley 19.628, D.S. N° 83/2005, Ley 20.575
  - Derechos ARCO documentados (Acceso, Rectificación, Supresión, Oposición)
  - Contacto del encargado de tratamiento
  - Tabla de cookies (esenciales, analíticas, marketing)
  - Schema.org `PrivacyPolicy` markup
  - FAQ con 3 preguntas frecuentes
- **Recomendación:** Sin acción. Documento robusto.

### PROD-016 · Términos y condiciones completos
- **Severidad:** — (positivo) · **Esfuerzo:** —
- **Evidencia:** `src/pages/terminos.astro` (224 líneas)
  - Referencia Ley 21.659 (Seguridad Privada)
  - Identificación legal de la empresa (razón social, RUT, domicilio)
  - Marco legal chileno explícito
  - FAQ con 4 preguntas frecuentes
- **Recomendación:** Sin acción.

### PROD-017 · Analytics con consentimiento pero sin tracking activo
- **Severidad:** P2 · **Esfuerzo:** S
- **Evidencia:**
  - `src/components/Analytics.astro` — Acepta `gaId` y `plausibleDomain` como props
  - `src/layouts/BaseLayout.astro:262` — `<Analytics />` (sin props → ambos vacíos)
  - Banner de consentimiento se muestra (1.2s delay) pero no hay nada que cargar
- **Impacto:** El banner de cookies aparece pidiendo consentimiento para analytics, pero no se carga ningún tracker. Experiencia confusa para el usuario (pide consentimiento para nada). Si se quiere analytics, falta configurar los IDs.
- **Recomendación:** Opcionalmente:
  1. Si se quiere analytics: pasar `gaId="G-XXXXXXX"` o `plausibleDomain="guardman.cl"` a `<Analytics />`.
  2. Si NO se quiere analytics: eliminar `<Analytics />` de BaseLayout para no mostrar el banner innecesariamente.

---

## Resumen de prioridades

### Acciones inmediatas (P0-P1)
1. **PROD-005** — Resolver custom domain `guardman.cl` → Worker (bloqueador de negocio)
2. **PROD-001** — Mover admin token a `wrangler secret` (seguridad)
3. **PROD-006** — Agregar registro SPF (email deliverability)
4. **PROD-007** — Agregar registro DMARC (anti-spoofing)
5. **PROD-010** — Health check con verificación D1 (observabilidad)
6. **PROD-013** — Estrategia de backup D1 (resiliencia)

### Mejoras (P2-P3)
7. **PROD-002** — Mover salt a secret
8. **PROD-004** — Actualizar STATUS.md
9. **PROD-008** — Evaluar nameservers Cloudflare
10. **PROD-011** — Logging estructurado
11. **PROD-014** — Versionado de assets críticos
12. **PROD-017** — Decidir sobre analytics (configurar o eliminar)
