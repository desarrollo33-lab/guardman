# Reporte: instrucciones de isitagentready.com vs. realidad de GuardMan

**Fecha:** 2026-10-02
**Alcance:** análisis, sin cambios en el código. Chequeo externo en `isitagentready.com/www.guardman.cl`.
**Método:** 11 instrucciones del reporte vs. código fuente (`src/`, `public/`, `wrangler.jsonc`) y verificación en vivo de los 8 endpoints citados.

---

## Veredicto

**El reporte acierta en el síntoma y se equivoca en 8 de 12 causas.**

GuardMan no es invisible para agentes por falta de metadata de descubrimiento. Es invisible porque
nadie apunta a nada: tiene un `/llms.txt` de 6,4 KB y un sitemap de 202 URLs ya generados desde
`constants.ts`, pero no existe un puntero estándar, legible por máquina, que conecte el home con
esas piezas. El reporte detectó la ausencia de 12 archivos concretos y propuso crear 12. Casi
todas las especificaciones que cita describen plataformas que **consumen APIs como producto**.
GuardMan no vende API: es un sitio de seguridad privada con un CRM interno detrás. El marco del
reporte no aplica.

**De los 12 ítems: 3 tienen sentido, 1 tiene sentido con el ejemplo corregido, 8 no deberían
implementarse tal como están escritos.**

Además, el paso 1 de verificación cambió el estado real del proyecto (ver abajo), y hay un
problema de seguridad en el código que pesa más que los 12 ítems juntos.

---

## Antes de las instrucciones: dos correcciones de partida

### 1. `guardman.cl` YA sirve este worker (AGENTS.md está desactualizado)

`AGENTS.md` afirma que el dominio custom no apunta al worker y responde `Server: ESF` (Google
Sites). **Es falso a fecha de hoy.** Verificado en vivo:

| URL | Server | Evidencia |
|---|---|---|
| `https://guardman.cl/` | cloudflare | mismo `<title>` del código |
| `https://www.guardman.cl/` | cloudflare | idem |
| `https://guardman-astro...workers.dev` | cloudflare | idem |

Pruebas de que los tres son el mismo deploy y este repo:
- `/api/health` → `{"service":"guardman-astro","version":"0.1.0"}`
- `/robots.txt` en vivo = byte a byte el string de `src/pages/robots.txt.ts` (v3.0, 758 B)
- `/llms.txt` en vivo = 6.393 B, coincide con el generador de `src/pages/llms.txt.ts`
- HTML contiene `/_astro/page.DtwJibBx.js`

El bloqueo documentado en `AGENTS.md` como "tarea pendiente" desde 2026-07-15 está resuelto. La
zona `guardman.cl` sí está en la cuenta y el worker sí está sirviendo. Falta desactualizar el
documento; las implicancias de performance/AEO se estaban midiendo contra un sitio que ya no es
el que estaba en producción.

### 2. Los 8 `404` del reporte son reales (no falsos positivos)

Comprobé que el fallback SPA de `wrangler.jsonc` (`not_found_handling: single-page-application`)
**no** enmascara los 404 con un 200 de `index.html`. Todos los endpoints ausentes devuelven 404
limpio. El detector es confiable en este punto: lo que no encontró, no existe.

```
/robots.txt                              200   758 B
/llms.txt                                200   6.393 B
/sitemap.xml                             200   84.400 B  (202 URLs)
/api/health                              200   417 B
/.well-known/ai-catalog.json             404
/.well-known/api-catalog                 404
/.well-known/mcp/server-card.json        404
/.well-known/agent-skills/index.json     404
/.well-known/openid-configuration        404
/.well-known/oauth-protected-resource    404
/auth.md                                 404
```

---

## Lo que GuardMan ya tiene (y el reporte no reconoce)

Esto es el punto de partida real, y es mejor que el que el reporte asume:

1. **`/llms.txt` derivado de `constants.ts`** — no es un archivo mantenido a mano. Está generado
   desde las mismas variables que alimentan el `areaServed`, el `openingHoursSpecification` y el
   copy visible. El comentario de `src/pages/llms.txt.ts:4-14` documenta por qué: la versión
   anterior desacoplada tenía 13 teléfonos inventados y 5 URLs en 404, y un asistente citaba un
   número inexistente a un cliente. **Esta es la decisión de arquitectura correcta del proyecto
   y es exactamente la razón por la que el ítem 12 (ai-catalog.json) sale barato.**
2. **`<link rel="llms-txt">` en el head** — `src/layouts/BaseLayout.astro:324`. Puntero
   explícito, aunque con un `rel` no registrado. El detector no lo contó.
3. **JSON-LD** (`Product` + `Organization` + `Brand`) — `BaseLayout.astro:163-170, 321`.
4. **202 URLs en sitemap** con hreflang, incluyendo combinaciones `servicio × comuna`.
5. **`User-agent: *` con `Allow: /`** en robots.txt. GPTBot, ClaudeBot, PerplexityBot y
   compañía **no están bloqueados**. No hay un solo `Disallow` dirigido a un crawler de IA.

El ítem 4 del reporte ("Content Signals") es el único que podría estropear esto.

---

## Análisis ítem por ítem

| # | Ítem | Veredicto | Razón |
|---|---|---|---|
| 1 | Link headers (RFC 8288) | **Hacer** | Barato. Pero apuntar a lo que existe, no a un `api-catalog` que no existirá. |
| 2 | DNS-AID records | No | Draft IETF sin consumidor. DNSSEC fuera de alcance. |
| 3 | Markdown for Agents | **Probar** | Único con valor AEO real. Requiere medición previa. |
| 4 | Content Signals | **Sí, con otro valor** | El ejemplo del reporte contradice el objetivo del proyecto. |
| 5 | API catalog (RFC 9727) | No | No hay API pública. El catálogo describiría endpoints que no existen. |
| 6 | OpenID configuration | **No** | Publicaría un `authorization_endpoint` inexistente. |
| 7 | OAuth Protected Resource | **No** | Mismo problema. No hay `authorization_servers`. |
| 8 | auth.md | No | Es un programa de identidad para agentes. Scope de otro orden. |
| 9 | MCP Server Card | No ahora | No es config: es una decisión de producto. |
| 10 | Agent Skills index | No ahora | Igual: exige construir las skills primero. |
| 11 | WebMCP | **Hacer, con exclusión** | Implementable. No en el canal de denuncias. |
| 12 | ARD `ai-catalog.json` | **Hacer primero** | Sale del mismo `constants.ts` que `llms.txt`. |

### #1 — Link headers: hacerlo, pero con los targets correctos

`public/_headers` **solo aplica a assets estáticos** en Cloudflare, no a respuestas SSR. Un
`Link:` en ese archivo no aparecería nunca en el home. Tiene que ir en
`src/middleware.ts:78-104`, que ya centraliza todos los headers de respuesta.

El error del reporte es sugerir `<.well-known/api-catalog>; rel="api-catalog"`. Eso publica una
promesa rota. Lo honesto:

```
Link: </llms.txt>; rel="describedby"; type="text/markdown"
Link: </sitemap.xml>; rel="service-desc"
```

`rel="describedby"` está registrado en IANA. `service-desc` es para APIs, no para sitemaps: usar
`rel="sitemap"` o simplemente omitir. Un `Link:` con una relación registrada y verificable vale
más que cuatro con relaciones inventadas.

### #3 — Markdown for Agents: el único con retorno AEO real

Probado en vivo: `Accept: text/markdown` sobre el home devuelve **`200 text/html`**, sin
`x-markdown-tokens`. Es el único ítem que ataca un problema que el proyecto ya resolvió
resolvió por otra vía (`llms.txt`).

Antes de activarlo a nivel de zona, hay que medir el daño. El home de GuardMan tiene un video
autoplay (`/videos/guardpod-home.mp4`), un `<img srcset>` de 4 anchos y lógica de menú. Una
conversión automática a markdown producirá algo degradado en esos puntos. La pregunta correcta
no es "¿el score sube?" sino "¿el markdown que sale es usable por un asistente para responder
preguntas de cobertura, servicios y contacto?". Si la respuesta es sí, vale. Si el markdown
sale como un esqueleto sin las 16 comunas de la RM, es ruido con apariencia de compliance.

Además: el feature es un toggle de zona en Cloudflare, no código. No requiere tocar el repo, lo
que lo hace barato de revertir.

### #4 — Content Signals: el ejemplo del reporte es activamente dañino

El reporte propone literalmente:

```
Content-Signal: ai-train=no, search=yes, ai-input=no
```

`ai-input=no` significa "no permitas que un asistente use mi contenido como entrada para
responder". Eso le dice a Perplexity, ChatGPT y Claude **no citar a GuardMan**. Es exactamente
lo contrario del objetivo de las tres últimas sesiones de trabajo: `/llms.txt` derivado de
constantes, 202 URLs de cobertura, hreflang, `llms.txt` linkeado desde el head. Todo eso existe
para **ser encontrado y citado** por asistentes.

Copiar ese ejemplo sería el error más caro de los 12 ítems. Si se implementa, la posición
correcta para un B2B que quiere presencia en respuestas de asistentes es:

```
Content-Signal: ai-train=no, search=yes, ai-input=yes
```

Permitir entrada, denegar entrenamiento. Es la postura estándar del sector y no contradice nada
de lo que ya está construido.

### #5, #6, #7, #8 — No. Publicar metadata de auth que no existe es peor que 404

Este es el grupo que más me preocupa, y la razón es técnica, no de alcance.

`isAdminRequest` (`src/lib/auth-server.ts:44-55`) no es OAuth. Es:

1. Cookie `gm_session` con longitud ≥ 16 caracteres → `true`.
2. O `X-Admin-Token` / `Authorization: Bearer` igual a `DENUNCIAS_ADMIN_TOKEN` (un secreto
   estático compartido).

**No existe `authorization_endpoint`. No existe `token_endpoint` de RFC 6749. No existe flujo de
consentimiento. No hay emisor de tokens de terceros.** El login emite un JWT HS256 propio para
el panel interno.

Si se publica `/.well-known/openid-configuration` con los campos que pide el reporte:

- Un agente **compatible con la spec** lo leerá, intentará el flujo, y fallará. Un 404 es un
  "no hay nada aquí"; un `openid-configuration` válido con un endpoint 404 al otro lado es un
  contrato roto.
- El ítem 7 (`oauth-protected-resource`) exige un `authorization_servers` con la URL del emisor.
  La única URL posible es `/api/login`, que es un endpoint de sesión por cookie para un humano.
  Un agente lo trataría como un authorization server RFC 8414. Enviaría un `client_credentials`
  request a un handler que espera email y password.

El ítem 8 (`auth.md`) va más lejos: es un programa de registro de agentes con identidad
verificada y aprobación humana, de origen WorkOS. Implementarlo en GuardMan significaría
construir un proveedor de identidad para agentes. No corresponde a un sitio de seguridad privada
con 8 servicios y un CRM.

Los cuatro ítems comparten el mismo error de fondo: **el reporte corresponde a sitios que
tienen una API como producto. GuardMan no la tiene.** Los únicos endpoints son handlers de sus
propios formularios (`/api/leads/capture`, `/api/denuncias`, 10/24h y 5/24h de rate limit por
IP-hash) y un panel interno. No hay consumidor para un catálogo.

### #9, #10 — MCP Server Card y skills index: no son configuración

Ambos aparecen en el reporte como "publicar un archivo". En realidad son el punto medio de una
decisión de producto que todavía no se ha tomado.

- El ítem 9 exige `serverInfo`, `transport endpoint` y `capabilities` de un servidor MCP.
  GuardMan no tiene servidor MCP. Publicar la card crea una promesa rota hacia un endpoint
  inexistente.
- El ítem 10 exige un array de skills con `name`, `type`, `description`, `url` y **sha256
  digest**. Cada skill es un documento que hay que escribir, publicar y versionar.

El orden correcto es inverso al del reporte: primero decidir si GuardMan expone alguna capacidad
a agentes, después construirla, y solo entonces publicarla. Si algún día se decide que sí (por
ejemplo, un tool de "cotizar guardia de seguridad para una comuna y un turno"), entonces el
Server Card es el discovers de esa decisión, no el punto de partida.

### #11 — WebMCP: el de mejor relación valor/costo, con una exclusión obligatoria

Verificado: 3 forms públicos, 19 inputs en total, **0** referencias a WebMCP.

| Ruta | Forms | Inputs | WebMCP |
|---|---|---|---|
| `/cotizacion` | 1 | 4 | 0 |
| `/contacto` | 1 | 4 | 0 |
| `/canal-de-denuncias` | 1 | 11 | 0 |

La API declarativa son atributos: `toolname` y `tooldescription` en el `<form>`,
`toolparamdescription` en los inputs. `LeadForm.astro` ya centraliza los 3 forms con una
estructura de datos `sections[].fields[]` (`LeadForm.astro:34-56`). Agregar esas tres propiedades
al tipo `Field` y emitirlas en los tags es trabajo de una tarde, en un solo archivo, y cubre los
tres forms a la vez. Es el ítem con mejor retorno del reporte completo.

**La exclusión:** `/canal-de-denuncias` **no** se expone como tool. Es el canal de denuncias
anónimas y reporte de conflictos de interés (acoso laboral o sexual, potencial delito, falla de
seguridad). Exponerlo a un agente automatizado degrada un canal de cumplimiento: las denuncias
deben tener un autor humano y verificable detrás. El endpoint además tiene rate limit de 5/24h
por IP-hash, que un agente disparando en bucle agotaría.

### #12 — ARD `ai-catalog.json`: el que justifica el resto

Es el ítem mejor planteado, y el que resuelve el problema de fondo: **falta un índice legible por
máquina que diga qué es este sitio**. Requiere `specVersion`, `host`, `entries[]` con
identificadores `urn:air:`, y 2-5 `representativeQueries` por entrada.

Dos razones por las que sale barato acá:

1. **Mismo origen de datos.** Todo lo que necesita — servicios, cobertura, contacto, FAQ,
   horario — ya está en `constants.ts` alimentando `llms.txt` y el JSON-LD. El archivo se escribe
   una vez y no se desincroniza, que es exactamente la clase de bug que `llms.txt.ts:4-14`
   documenta como razón de su reescritura.
2. **Es la condición de entrada a casi todo lo demás.** Con un `ai-catalog` en su lugar, el ítem 1
   puede linkear a algo real, y si más adelante hay MCP, la card cuelga de ahí.

---

## El hallazgo que pesa más que los 12 ítems

Fuera del alcance pedido, pero es la consecuencia directa de leer el código de auth que los ítems
6-8 quieren extender, y no lo puedo no reportar.

**`isAdminRequest` valida la cookie solo por longitud. En 9 endpoints.**

`src/lib/auth-server.ts:44-55`:

```ts
if (sessionMatch && sessionMatch[1].length >= MIN_TOKEN_LEN) {
  return true;   // ← 16 caracteres cualesquiera
}
```

Lo mismo en `src/middleware.ts:89` para las páginas de `/admin/*`.

`verifyJwt` **existe, está implementado con WebCrypto HS256, valida `iss`, `aud` y `exp`, y está
exportado en la línea 405 del mismo archivo** — pero solo lo usan `/api/refresh.ts:38` y
`/api/logout.ts:39`. Nunca se usa para validar una sesión en un endpoint de datos.

Consecuencia: cualquier request que lleve `Cookie: gm_session=aaaaaaaaaaaaaaaa` pasa el control de
acceso a:

- `GET /api/leads` — nombres, teléfonos, correos de prospectos
- `GET /api/leads/[id]`
- `GET /api/denuncias` y `GET /api/denuncias/[id]` — denuncias anónimas de acoso y conflicto de
  interés
- `GET /api/guardpod/session`, `/progress`, `/answer`, `/answer/batch`, `/export`

El comentario en `middleware.ts:87-88` justifica la validación mínima con "la verificación real
del token la hace el Worker API externo". Ese worker **ya no existe**: `auth-server.ts:5-8`
documenta la consolidación del 2026-09-22 precisamente porque `guardman.oficinadesarrollo33.workers.dev`
estaba muerto. La justificación quedó obsoleta y la verificación real ya no ocurre en ningún
lado.

La corrección no requiere OAuth, ni metadata de descubrimiento, ni ningún ítem de este reporte.
Requiere llamar al `verifyJwt` que ya está ahí.

Un reporte de "agent readiness" que recomienda publicar `oauth-protected-resource` mientras el
backend acepta un bearer estático y una cookie de longitud arbitraria como credencial válida no
llegó al problema que importa.

---

## Orden que propongo (si se decide hacer algo)

| Prioridad | Acción | Costo | Por qué |
|---|---|---|---|
| 0 | Corregir `isAdminRequest` para usar `verifyJwt` | Bajo | Es un bug activo, no una mejora de posicionamiento |
| 0 | Actualizar `AGENTS.md`: el dominio custom ya está conectado | 1 línea | El bloqueo lleva ~3 meses "pendiente" y es falso |
| 1 | `/.well-known/ai-catalog.json` desde `constants.ts` | Bajo | Resuelve el problema de fondo; habilita el resto |
| 2 | `Link:` headers en `middleware.ts` apuntando a lo que existe | Bajo | ~10 líneas |
| 3 | WebMCP en `/cotizacion` y `/contacto` | Medio | Mejor ROI del reporte; un archivo |
| 4 | Content Signals con `ai-input=yes` | Bajo | Solo después de decidir la postura |
| 5 | Markdown for Agents (toggle de zona) | Bajo, reversible | Requiere medición previa de calidad del markdown |
| — | #2, #5, #6, #7, #8, #9, #10 | — | No implementar tal como están escritos |

Si el objetivo detrás de este reporte era que los asistentes de IA puedan responder "GuardMan
cubre mi comuna" o "cuánto cuesta un guardia", entonces el #1 real no es ninguno de los 12: es que
`llms.txt` ya lo resuelve, y el trabajo es que un crawler lo encuentre sin adivinar la URL.

---

## Nota sobre la medición

No ejecuté Lighthouse ni comparé pesos: no hubo cambios, no hay before/after que medir. Todo lo
reportado arriba es o bien verificación directa de archivos y responses, o bien lectura de código.
Los conteos (202 URLs, 3 forms, 19 inputs, 0 WebMCP, 404s) provienen de las fuentes citadas y son
reproducibles.
