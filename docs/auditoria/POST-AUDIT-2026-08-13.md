# Post-auditoría — Acciones realizadas y pasos para switch a guardman.cl

**Fecha:** 2026-08-13
**Versión desplegada:** 5.3.0 (workers.dev)
**Commit:** `36fb110` (master)

---

## 1. Lo que se hizo (resumen ejecutivo)

### P0 remediados ✅

| ID original | Hallazgo | Estado |
|---|---|---|
| SEC-001 | Admin routes sin auth server-side | ✅ Middleware SSR en `src/middleware.ts` redirige a `/admin/login` si no hay cookie `gm_session` |
| SEC-005 | Token `v41-denu-2026` hardcodeado + inyectado en HTML | ✅ Token rotado, almacenado como wrangler secret `DENUNCIAS_ADMIN_TOKEN`, sin fallback hardcoded, sin `define:vars` en el HTML |
| FUN-004 | PATCH denuncias con token hardcoded | ✅ Acepta solo `env.DENUNCIAS_ADMIN_TOKEN` o cookie de sesión |
| SEO-001 | Canonical/OG/sitemap apuntan a dominio no resuelto | 🟡 Resuelto estructuralmente (sitemap reescrito) pero el problema raíz `guardman.cl → Worker` sigue siendo **acción de Kammler** (ver §3) |
| PROD-005 | `guardman.cl` apunta a Google Sites | 🟡 Pendiente switch DNS — ver §3 |
| LEGACY-D5-001 | Test roto `constants.test.ts` | ✅ Agregado `EMPRESAS: '200+'` a `STATS`. 27/27 tests pasan |

### P1 remediados ✅

| ID original | Hallazgo | Estado |
|---|---|---|
| FUN-001 | Headers de seguridad ausentes | ✅ Middleware agrega X-Content-Type-Options, HSTS, Referrer-Policy, X-Frame-Options, CSP, Permissions-Policy |
| SEO-002/003 | Title/description homepage exceden límites | ✅ Title 50 chars, description 157 chars |
| SEO-004 | Sitemap lastmod congelado en 1970-01-01 | ✅ `today` se computa en cada request, no al cargar el módulo |
| PROD-010 | Health no verifica D1 | ✅ `SELECT 1 AS ok` a D1, devuelve 503 si falla |
| SEC-010 | Salt hardcodeado para IP hash | ✅ Movido a wrangler secret `DENU_SALT` |
| SEC-004 | Email pre-rellenado en login | ✅ Eliminado, agregado `autocomplete="username"` |
| npm audit | 13 vulnerabilidades high | 🟡 Reducidas con `npm audit fix` (js-yaml, nanoid, postcss). Las que requieren `astro@7` siguen pendientes (breaking change grande) |

### Cambios adicionales
- Nuevo endpoint `/api/admin/session` para set/clear de cookie httpOnly de sesión.
- Login FE ahora setea cookie `gm_session` después del login exitoso.
- Logout FE limpia la cookie antes de redirigir a login.
- Endpoints de denuncias aceptan auth por cookie de sesión **o** por `DENUNCIAS_ADMIN_TOKEN` (compatibilidad con integraciones externas).

### Pendiente para v1.0 (fuera de este sprint)
- CSRF tokens en mutaciones
- Rate limiting server-side en login
- Migración a `astro@7.2.1` (breaking — requiere testing)
- RBAC en panel admin
- Logging estructurado
- Backup automatizado de D1
- Cleanup de código muerto (9 exports no usados en `constants.ts`/`content.ts`)

---

## 2. Smoke tests live (verificados post-deploy)

```
✅ GET /                              → 200, headers de seguridad presentes
✅ GET /admin                         → 302 Location: /admin/login?redirect=%2Fadmin
✅ GET /admin/login                   → 200
✅ GET /admin/leads (sin cookie)      → 302 → /admin/login
✅ GET /api/health                    → 200, version "5.3.0", checks.d1="ok"
✅ GET /api/denuncias?admin_token=XXX_VIEJO → 401 Unauthorized (token quemado)
✅ GET /api/denuncias                 → 401 (sin auth)
✅ POST /api/denuncias (body vacío)   → 400 Validación fallida
✅ GET /sitemap.xml                   → lastmod=2026-08-13 (no 1970)
✅ GET /admin/denuncias (HTML)        → NO contiene "v41-denu" ni "adminToken"
```

---

## 3. Pasos para switch final a `guardman.cl`

**Esto es trabajo de Kammler, no del worker.** El código está listo. Falta el lado DNS.

### 3.1. Decisión: ¿la zona `guardman.cl` está en Cloudflare?

Esto es el primer fork. Verificar en el dashboard de Cloudflare de la cuenta `oficinadesarrollo33@gmail.com` (account `b3a89fc9524552b7ab3202269f1ab6f3`).

**Estado actual conocido:**
- `nslookup guardman.cl` → nameservers `ns01-04.inc.cl` (NO Cloudflare)
- `www.guardman.cl` → responde con `Server: ESF` (Google Sites)
- `guardman.cl` → 301 a `www.guardman.cl`

### 3.2. Si la zona `guardman.cl` está en la cuenta Cloudflare (caso fácil)

1. Agregar al `wrangler.jsonc`:
   ```jsonc
   "routes": [
     { "pattern": "guardman.cl/*", "zone_name": "guardman.cl" },
     { "pattern": "www.guardman.cl/*", "zone_name": "guardman.cl" }
   ]
   ```
2. Rebuild + deploy:
   ```bash
   npm run build
   npx wrangler deploy
   ```
3. Verificar:
   ```bash
   curl -I https://guardman.cl
   # Esperado: Server: cloudflare
   ```
4. En el dashboard de Google Sites, eliminar el site publicado o cambiar DNS para que NO responda.

### 3.3. Si la zona NO está en Cloudflare (caso real probable)

Los nameservers están en INC.cl, lo que sugiere que la zona completa está ahí. Pasos:

1. **Crear la zona en Cloudflare** (cuenta `oficinadesarrollo33@gmail.com`):
   - Dashboard → Add a Site → `guardman.cl`
   - Plan Free es suficiente.

2. **Migrar nameservers** desde INC.cl a los que Cloudflare asigna:
   - Cloudflare te da 2 nameservers del tipo `xxx.ns.cloudflare.com`.
   - En el panel de INC.cl (o donde esté la administración del dominio `.cl`), cambiar los NS records.
   - En Chile, los `.cl` se gestionan vía NIC Chile (https://www.nic.cl). El proceso puede tomar 24-48h.

3. **Una vez propagados los NS**, agregar el dominio al worker (igual que 3.2).

4. **Eliminar el site de Google Sites** o cambiarlo a "unpublished".

### 3.4. Verificación final del switch

```bash
# 1. NS records
nslookup -type=NS guardman.cl
# Esperado: xxx.ns.cloudflare.com

# 2. Headers en guardman.cl
curl -I https://guardman.cl
# Esperado: Server: cloudflare, Strict-Transport-Security, etc.

# 3. Redirects
curl -I https://www.guardman.cl
# Esperado: 301 a https://guardman.cl (o viceversa, según config)
```

### 3.5. DNS records complementarios (P1 del audit, recomendado hacerlo en el mismo paso)

Una vez en Cloudflare, agregar en el DNS:

| Tipo | Nombre | Contenido | TTL |
|---|---|---|---|
| TXT | `@` | `v=spf1 mx a:mail.guardman.cl include:_spf.google.com ~all` (ajustar al provider real) | Auto |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@guardman.cl; pct=100` | Auto |
| TXT | `default._domainkey` | (ya existe el DKIM actual) | Auto |

Si no se envía email desde `@guardman.cl`, omitir el SPF. Pero **DMARC sí o sí**.

---

## 4. Secrets que Kammler debe guardar de forma segura

| Secret | Valor | Dónde se usa |
|---|---|---|
| `DENUNCIAS_ADMIN_TOKEN` | `J-4x8bghQk8f_oBe6ggzB_RJFXx33kXLlYzOXQPp2J4v10pSjvIF1ZpwBUcLBOP-` | Header `X-Admin-Token` o `?admin_token=` para `/api/denuncias` admin (listar, patch). Solo para integraciones externas (CLI, scripts). El panel web usa la cookie. |
| `DENU_SALT` | `QDEdTcdXoTL3dE6MDMYtrkvHtLLfSBXS3si2BcP6uvc` | Hash de IP en canal de denuncias. Si se rota, las IPs hasheadas anteriormente quedan inconsistentes. |

**Rotación de emergencia** (si el token se ve comprometido):
```bash
echo "NUEVO_VALOR" | npx wrangler secret put DENUNCIAS_ADMIN_TOKEN
echo "NUEVO_VALOR" | npx wrangler secret put DENU_SALT
# Rebuild + deploy
npm run build && npx wrangler deploy
```

---

## 5. Backups de D1 (P1 PROD-013, recomendado antes de switch)

D1 `guardman-v2-db` no tiene backup automatizado. Recomendado:

```bash
# Backup manual
npx wrangler d1 export guardman-v2-db --remote --output=backups/denuncias-$(date +%Y%m%d).sql
```

Para automatizar, agregar cron semanal (GitHub Actions o Cloudflare Workers Cron Trigger). Script base:

```yaml
# .github/workflows/backup-d1.yml (ejemplo)
name: D1 backup
on:
  schedule: [{ cron: '0 3 * * 0' }]  # semanal domingo 3am UTC
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npx wrangler d1 export guardman-v2-db --remote --output=backups/d1-$(date +%Y%m%d).sql
      - uses: actions/upload-artifact@v4
        with:
          name: d1-backup
          path: backups/
```

---

## 6. Cosas que Kammler debe confirmar antes de entregar al cliente

- [ ] Dominio `guardman.cl` resolviendo al worker (switch DNS completo)
- [ ] Login del admin funciona con credenciales reales (probar una vez)
- [ ] Health endpoint reporta `checks.d1: "ok"` desde `https://guardman.cl/api/health`
- [ ] Sitemap accesible desde `https://guardman.cl/sitemap.xml` con lastmod real
- [ ] El CRM sigue siendo mock — el panel admin muestra datos de demo, no reales. **Esto es esperado y debe estar documentado al cliente como v1.0 limitada.**
- [ ] Backup de D1 programado
- [ ] SPF/DMARC configurados si se envía email desde el dominio

---

## 7. Limitaciones conocidas (transparencia al cliente)

| Limitación | Impacto | Workaround |
|---|---|---|
| CRM (leads, pipeline, inbox) usa datos mock | El panel admin muestra datos demo, no se persisten cambios | Documentar como "vista previa". Para v1.1 conectar al Worker API externo `guardman.oficinadesarrollo33.workers.dev` (que SÍ existe). |
| Login rate-limiting solo client-side | Bypass trivial con curl o localStorage limpio | Aceptable para v1.0 si se complementa con Cloudflare Rate Limiting rules en el dashboard. |
| `astro@7.2.1` y `vite@7.3.6` con vulnerabilidades high | Vulnerabilidades conocidas pero no explotables en runtime de Workers | Migrar en v1.1 después de testing. |
| 7 errores de TypeScript preexistentes (no introducidos) | `npm run check` no pasa limpio | No bloquea build ni deploy. Limpiar en sprint de calidad. |
