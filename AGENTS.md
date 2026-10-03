# guardman — Contexto operativo

## Orden de cascada de los CSS — leer antes de "arreglar" un color o un estilo
- `public/styles/site.css` se sirve con `<link>` y se carga **primero**.
- `src/styles/*.css` (design-tokens, components) se compilan a `/_astro/*.css` y se cargan **después**.
- Con la misma especificidad **gana `components.css` sobre `site.css`**. Corolario real: editar
  `public/styles/site.css` para cambiar el color de un botón o de un link puede no hacer nada y
  `wrangler deploy` reporta éxito igual. Los tokens viven en `design-tokens.css`
  (`--gm-*`, mapeados a `--*`); los componentes que reusan estilos del sitio están en
  `components.css`.
- **Regla de método:** para saber qué gana de verdad, medir el estilo computado en el navegador
  (Playwright `getComputedStyle`) y leer los tokens resueltos, no deducirlo leyendo la cascada.
  `design-tokens.css` redefine `--muted`, `--accent` y `--fg`, así que los valores de
  `site.css:30` no son los finales.

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
- **Verificar el HTML con cache-bust.** Tras un deploy, un fetch normal a una ruta SSR puede
  devolver todavía el HTML del deploy anterior (observado 2026-10-02 en `/guard-pod`, que
  seguía emitiendo `"url":"/guard-pod"` en vez de la URL absoluta). Para comprobar un cambio
  de HTML o de JSON-LD: `curl "https://guardman.cl/ruta?cb=$(timestamp)"`.
- Lo mismo aplica a **`/images/*`** y **`/videos/*`**, que también son `immutable` por un año. Si se
  re-codifica un asset **conservando el nombre** (ej. `sector-salud.webp` de 1280×1280 a 400×225),
  hay que bumpear el `?v=` en **todas** las referencias que lo usan. Si en cambio el asset cambia de
  nombre (variantes `-640`/`-560`/…), la cache key cambia sola y no hay que hacer nada.
- **El `?v=` de imágenes y videos es `IMAGE_VERSION`** (`src/lib/constants.ts`), hoy `20261002-2`.
  Nunca escribir la versión a mano en un template: importarla. La excepción conocida es el
  `background-image` de `HowItWorks.astro`, porque los `<style>` de Astro no aceptan expresiones; ahí
  el valor está hardcodeado con un comentario que apunta a `IMAGE_VERSION`.
- **Re-codificar imágenes = usar `scripts/reencode-images.mjs`.** Guarda el original en `.reenc-src/`
  (gitignored, recuperable desde git) y siempre encodea desde ahí, así que re-correr el script no
  recomprime dos veces. Los `quality` del script no son gusto: son el punto donde la heurística de
  compresión de Lighthouse deja de pedir más compresión. Si se sube un quality, se re-codifica TODO
  el set en el mismo commit que el bumpe de `IMAGE_VERSION`.
- Un `?v=` también se necesita para el **`poster` de un `<video>`**: al cambiar sus bytes, la
  referencia en el HTML cambia aunque el `.mp4` no se toque.

## Regla del panel admin: nunca interpolar datos en innerHTML
- `POST /api/leads/capture` es **público y sin autenticación** (es el form de contacto).
  `validateLead` (`src/lib/validation.ts`) rechaza `<` y `>` en el nombre, porque un nombre
  propio no lleva markup y ese campo se renderiza en el panel.
- Aun con eso, el buscador global de `AdminTopbar.astro` construye sus resultados con
  `createElement` + `textContent`. Si alguna vez vuelve a `innerHTML` con `l.name`/`l.email`/
  `l.phone` interpolados, es un XSS almacenado: cualquiera puede ejecutar script en el origen
  del admin con `gm_session` puesta. Hay regresión en `tests/security-regressions.test.ts`.
- Regla general del panel: datos que vienen de la API se escriben con `textContent`, nunca
  se interpolan en una cadena de HTML. Los literales estáticos sí pueden usar `innerHTML`.
- `leads` tiene UNA columna de asignación, `assigned_to` (la escribe el PATCH, la leen las
  islas, tiene índice). `owner_email` se eliminó en la migración `0004`; si vuelve a
  aparecer en un SELECT, es un bug.

## E2E nunca contra producción por defecto
- `tests/e2e/guardpod-wizard.spec.ts` **borra y escribe filas reales** de `guardpod_answers`.
  Apunta a `127.0.0.1:8788` y falla ruidosamente si el host resuelto no es local, salvo que
  se exporte `ALLOW_PROD_TESTS=1` a propósito. Exige `ADMIN_TOKEN` real: la cookie falsa de
  32 caracteres que usaba antes dejó de funcionar cuando `isAdminRequest` pasó a verificar
  la firma del JWT (2026-10-02) y el test moría en el setup sin proteger nada.
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
  Es `async`; los endpoints de datos lo esperan con `await`.
- **Todo el HTTP del panel pasa por `src/lib/api-client.ts`** (`apiFetch(path, options)`).
  Ninguna isla ni componente debe hacer `fetch('/api/...')` suelto: ahí es donde vivía el
  bug de sesión. Ese módulo adjunta el Bearer, refresca el access token con single-flight al
  recibir 401, **re-emite la cookie `gm_session`** y, si la sesión murió de verdad, limpia y
  manda a `/admin/login` en vez de pintar un error con botón "Reintentar".
  Excepción conocida: la descarga del export de GuardPod usa `fetch` directo porque lee un blob.
- **Invariante:** si cambia el TTL del access token, hay que revisar `ACCESS_TTL_SEC` en
  `auth-server.ts` y las constantes de expiración en `api-client.ts` y `login.astro`, que
  guardan `2h`/`30d` en tres lugares. `SESSION_MAX_AGE` en `api/admin/session.ts` sigue la
  misma cifra. El TTL solo no basta: si el cliente deja de llamar a `apiFetch`, el refresh y
  el re-sync de cookie dejan de ejecutarse y el panel vuelve a morir a las 2h sin avisar.
- **Logout:** un solo punto de salida, `window.gmLogout()` definido en `AdminLayout.astro`.
  Revoca el refresh token con `POST /api/logout` ANTES de borrar localStorage y la cookie.
  Los tres botones (topbar, mobile nav, settings) lo llaman; ninguno reimprime el flujo.
- Escape hatch para integraciones: header `X-Admin-Token` / `Authorization: Bearer` con el
  secreto `DENUNCIAS_ADMIN_TOKEN`. Aceptado en los 9 endpoints, sin expiración ni alcance:
  una fuga concede lectura/escritura total, incluido el export completo de GuardPod.

## AEO / descubrimiento para agentes
- `/llms.txt`, `/.well-known/ard.json` y `/.well-known/ai-catalog.json` se **generan** desde
  `src/lib/constants.ts` (el manifiesto, desde `src/lib/ai-catalog.ts`). No editarlos a mano: si el
  sitio cambia, se desincronizan (ya pasó, ver el comentario de `src/pages/llms.txt.ts`).
- **El manifiesto se valida contra el esquema oficial en `tests/ai-catalog.test.ts`.** El esquema
  está vendorizado en `tests/fixtures/ard-ai-catalog.schema.json` (spec `ards-project/ard-spec`) y
  también sirve `node scripts/validate-ai-catalog.mjs <archivo>` contra un archivo ya publicado.
  Dos reglas que rompimos el 2026-10-02 y hay que respetar al agregar entradas:
  `host` es `additionalProperties:false` (solo displayName, identifier, documentationUrl, logoUrl,
  trustManifest) y cada entrada lleva `url` **XOR** `data`, nunca ambos.
- El tipo de media de una entrada no lo restringe el esquema, pero el validador de
  "Agent Discoverability" solo acepta los tipos estándar de ARD. `text/html` y
  `application/json` quedan fuera de esa lista a propósito: son los tipos honestos de páginas
  públicas y de catálogos propios, y etiquetarlos como `application/ai-catalog+json` haría que un
  consumidor conforme intente parsearlos como manifiesto y falle.
- **`text/markdown` a secas está INCOMPLETO para ARD**: el conformance tester lo acepta como
  "standard discovery type" pero exige el parámetro `profile="urn:air:agent-skills"`, y el
  validador de Agent Discoverability marca la entrada como Low. Con las dos fuentes diciendo lo
  mismo, no es quirk del validador. El tipo correcto es `ARD_MARKDOWN_TYPE` en `constants.ts`, y
  es el mismo que va en el `Content-Type` de `/llms.txt` y los `/llms*.md`: el header tiene que
  decir lo mismo que el manifiesto. El perfil declara para qué está escrito el documento, no qué
  género tiene — estos existen para que los lean asistentes. Ese detalle se agregado el
  2026-10-02, después de descartar dos veces el aviso como falso positivo.
- **Los 403 en `/.well-known/*` y `/llms*` vienen del edge, no del Worker.** Medido el 2026-10-02:
  la **Browser Integrity Check** bloquea los User-Agent que no son navegadores (típicamente
  `Python-urllib/x.y`, que es el que usa el conformance tester oficial de la spec), y una regla
  gestionada de Cloudflare ("Cloudflare Bot Management rules for all plans" → "Block AI bots on ad
  pages") bloquea a GPTBot y ClaudeBot en todo el sitio **salvo `/.well-known/`**. Resolverlo:
  custom rule `Allow discovery paths (ARD + llms)` con acción Skip sobre
  `starts_with(path, "/.well-known/") or starts_with(path, "/llms")`, marcando **Browser Integrity
  Check** en "More components to skip" — sin esa casilla el Skip matchea pero no cambia nada.
  Con eso `conformance-test publisher guardman.cl` da PASS.
- **El bloqueo a GPTBot/ClaudeBot no es una decisión del cliente**, es el default de Cloudflare, y
  es coherente con `ai-train=no`. Los crawlers que CITAN (OAI-SearchBot, ChatGPT-User, Claude-User,
  Claude-SearchBot, PerplexityBot) no están bloqueados. No tocar AI Crawl Control ni Bot Fight Mode.
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
