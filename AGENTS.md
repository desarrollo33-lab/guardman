# guardman — Contexto operativo

## Deploy
- Worker: `guardman-astro` (https://guardman-astro.oficinadesarrollo33.workers.dev)
- Cuenta Cloudflare: oficinadesarrollo33@gmail.com (account ID b3a89fc9524552b7ab3202269f1ab6f3)
- Astro 6 SSR + @astrojs/cloudflare
- Build: `npm run build` (debe correrse antes de `wrangler deploy`, ver gotcha en MEMORY.md)
- Deploy: `npx wrangler deploy`

## Cache de assets estáticos — INVARIANTE
- `public/_headers` sirve `/styles/site.css` con `Cache-Control: public, max-age=31536000,
  immutable`. **Cualquier cambio de contenido en `site.css` obliga a bumpear el `?v=` de los
  `<link>` en `src/layouts/BaseLayout.astro:327,333` dentro del MISMO commit.** Sin eso el
  edge sigue respondiendo la versión anterior hasta un año. `wrangler deploy` reporta éxito
  igual: el síntoma es silencioso.
- `/styles/dark.css` **no** está en `_headers`, así que revalida sola. Esa asimetría es la que
  hace el bug invisible: después de un deploy los dos stylesheets quedan en versiones
  distintas. No agregar `dark.css` a `_headers` sin antes definir estrategia de versión.
- El `?v=` del stylesheet y `FONT_VERSION` (`20260925`, `src/lib/constants.ts:367`) son
  independientes. Bumpear el del CSS no provoca descarga doble de Inter, porque el `<link
  rel=preload>` de la fuente usa `INTER_FONT_URL`, no el `?v=` del stylesheet.
- **Verificar los bytes servidos después de deployear, no el exit code.** Traer la URL real
  del asset y grepear el valor nuevo. Ejemplo 2026-10-02: el HTML ya traía el critical CSS en
  1200px mientras `site.css` seguía sirviendo `.header-inner` en 1280px.
- Lo mismo aplica a **`/images/*`**, que también es `immutable` por un año. Si se re-codifica
  una imagen **conservando el nombre** (ej. `sector-salud.webp` de 1280×1280 a 400×225), hay
  que bumpear el `?v=` en la referencia que la usa, hoy `` `/images/sector-${s.slug}.webp?v=20261002` ``
  en `src/pages/index.astro` y `src/pages/sectores/index.astro`. Si en cambio la imagen cambia
  de nombre (variantes `-640`/`-960`/…), la cache key cambia sola y no hay que hacer nada.

## Custom domain `guardman.cl` — ESTADO
- **RESUELTO (verificado 2026-10-02).** El dominio SÍ sirve este worker.
- `guardman.cl`, `www.guardman.cl` y `guardman-astro.oficinadesarrollo33.workers.dev` devuelven
  el mismo deploy. Evidencia: `/api/health` responde `{"service":"guardman-astro"}`, el
  `robots.txt` en vivo es idéntico a `src/pages/robots.txt.ts`, y el HTML referencia
  `/_astro/page.*.js`.
- La anotación anterior ("responde `Server: ESF` / Google Sites") quedó obsoleta: ese bloqueo
  se cerró solo o por consola de Cloudflare, no desde el repo. El `wrangler.jsonc` sigue sin
  `routes` ni `custom_domains` porque la conexión se hizo a nivel de zona (Custom Domain en el
  dashboard), no con un route pattern.
- **No volver a documentar esto como pendiente.** Si hay que reconfirmar, es un `Invoke-WebRequest`
  a `https://guardman.cl/api/health`.

## Logo
- Archivo: `public/images/logo-byn.png` (recortado a 681×250, era 800×600 con 61% de espacio vacío)
- Original: `logo/LOGO BYN.png` (no recortar de nuevo, ya está optimizado en public/)
- Header: 50px desktop / 44px mobile
- Footer: 48px desktop
- Dark contexts: `filter: brightness(0) invert(1)` para invertir negro→blanco

## Auth del panel admin
- Cookie httpOnly `gm_session` = **access token JWT** (HS256, `JWT_SECRET` de Wrangler secrets).
- `isAdminRequest` (`src/lib/auth-server.ts`) verifica la firma, `iss`, `aud`, `exp` y `type`.
  Es `async`; los 9 endpoints de datos lo esperan con `await`.
- Invariante: si se cambia la expiración del access token, hay que revisar `SESSION_MAX_AGE`
  en `src/pages/api/admin/session.ts` y que `syncSessionCookie()` siga re-emitiendo la cookie
  tras cada refresh en `src/lib/api.ts`. Sin ese re-sync, la cookie queda con un JWT vencido y
  el SSR expulsa al admin aunque su sesión en localStorage siga viva.
- Escape hatch para integraciones: header `X-Admin-Token` / `Authorization: Bearer` con el
  secreto `DENUNCIAS_ADMIN_TOKEN`.

## AEO / descubrimiento para agentes
- `/llms.txt` y `/.well-known/ai-catalog.json` se **generan** desde `src/lib/constants.ts`.
  No editarlos a mano: si el sitio cambia, se desincronizan (ya pasó, ver el comentario de
  `src/pages/llms.txt.ts`).
- `Link:` headers en respuestas HTML salen de `src/middleware.ts`, no de `public/_headers`:
  ese archivo solo aplica a assets estáticos y nunca aparece en páginas SSR.
- `robots.txt` declara `ai-train=no, search=yes, ai-input=yes`: GuardMan quiere ser citado por
  asistentes, solo no quiere que lo usen para entrenar.
- WebMCP expone `/cotizacion` y `/contacto`. **`/canal-de-denuncias` va excluido a propósito**
  (canal de cumplimiento anónimo, requiere autor humano). No revertir.
- **Markdown for Agents está en stand by** (decisión Kammler 2026-10-02): Cloudflare lo
  limita a plan Pro o Business y la cuenta está en plan gratuito. No es un bug ni una tarea
  pendiente: no hay toggle en el dashboard. Si algún día sube el plan, se activa en
  AI Crawl Control y se mide si el markdown conserva las 14 comunas y los 8 servicios
  antes de dejarlo prendido.
