// /robots.txt v3.1 — crawl-delay, sitemap multi-región y Content Signals.
//
// ARD (descubrimiento para agentes) NO se anuncia con la directiva `Agentmap`
// de robots.txt, aunque el spec la permita: Googlebot no la implementa y la
// reporta como Error en GSC. Iba además antes de los grupos que bloquean
// Semrush/Ahrefs/DotBot/MJ12 y antes del `Sitemap:`. Google sigue parseando
// igual, pero un parser estricto de terceros puede abortar en esa línea y
// perder todo lo que viene después. El descubrimiento ya está anunciado por
// tres vías que Googlebot sí entiende: /.well-known/ard.json (el well-known
// URI, que es el mecanismo primario del spec), <link rel="ard"> en BaseLayout
// y el header `Link: rel="ard"` en middleware.ts.
//
// No reintroducir `Agentmap` para "quedarse a mano" con ARD: el mecanismo
// primario ya está cubierto y la línea solo aporta error en Search Console.
//
// `Content-Signal` tiene el mismo problema y no se puede borrar: es el draft
// IETF draft-romm-aipref-contentsignals que Cloudflare ya aplica de verdad — su
// endpoint /crawl devuelve HTTP 400 si el sitio declara ai-train=no y el cliente
// no lo respeta. Sacarlo delega el permiso en la palabra del crawler.
// Pero el parser de robots.txt de Lighthouse implementa solo RFC 9309, donde
// cualquier directiva desconocida es un error, y eso tumba el audit SEO (weight
// 1): el score se va de 100 a 92 y PageSpeed lo muestra como "SEO 3/4".
//
// Solución: la directiva se sirve SOLO a crawlers de IA. Navegadores,
// Lighthouse y los buscadores de Search Console reciben un robots.txt que
// cumple RFC 9309 estricto (mismos Disallow, mismo Sitemap, sin la directiva
// desconocida). Es legal y es justamente para lo que existe el matching por
// User-Agent: cada crawler recibe el archivo que puede cumplir.
import { SITE, CONTENT_SIGNALS } from '../lib/constants';

// Quién recibe el archivo con `Content-Signal` y quién recibe el limpio.
//
// El default es fail-safe: cualquier cliente automatizado que NO sea un
// navegador ni un buscador conocido recibe la directiva. Así un crawler de IA
// que todavía no conhecemos (o el de Cloudflare Browser Run, que no anuncia un
// UA reconocible) igual ve `ai-train=no`. La alternativa —allowlist de UAs de
// IA— deja sin señal justo a los agentes nuevos, que son el caso que importa.
//
// Navegadores (Chrome, Safari, Firefox, y el HeadlessChrome de Lighthouse) y
// buscadores (Googlebot, Bingbot, Baiduspider…) reciben el archivo RFC 9309.
const BROWSER_UA = /chrome\/|chromium\/|safari\/|firefox\/|edg\/|opr\//i;
const CRAWLER_HINT = /bot|crawler|spider|scrap|crawl|fetch|curl|wget|python|java|go-http|okhttp|libwww|headlessphantom/i;
const SEARCH_ENGINE_UA = /googlebot|google-inspectiontool|googleother|bingbot|bingpreview|baiduspider|duckduckbot|slurp|yandex|seznambot|exabot|petalbot|applebot|ia_archiver|facebot|adsbot|mediapartners|googlewebcache|duckduckgo|qwant|yandexbot/i;

const contentSignal = (ua: string) => {
  const isBrowser = BROWSER_UA.test(ua) && !CRAWLER_HINT.test(ua);
  const isSearchEngine = SEARCH_ENGINE_UA.test(ua);
  return !isBrowser && !isSearchEngine;
};

const robotsFor = (ua: string) => `# GuardMan Chile — robots.txt v3.1
# https://guardman.cl

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api
Disallow: /api/
Disallow: /*?utm_
Disallow: /cotizacion?*
Disallow: /contacto?*
Crawl-delay: 1
${contentSignal(ua) ? `
# Preferencias de uso del contenido por parte de sistemas de IA.
# ai-input=yes: los asistentes SÍ pueden leer y citar el contenido. Es la
# intención del sitio — de hecho /llms.txt existe justo para eso.
# ai-train=no: no se autoriza usar el contenido para entrenar modelos.
# search=yes: los buscadores tradicionales siguen/indexando normal.
Content-Signal: ${CONTENT_SIGNALS}
` : ''}
# Bots específicos
User-agent: Googlebot
Allow: /
Allow: /images/
Disallow: /admin
Disallow: /api

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /api
Crawl-delay: 2

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /
Crawl-delay: 5

# Bloquear bots de scraping agresivos
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemaps
Sitemap: ${SITE.URL}/sitemap.xml
`;

export const GET = ({ request }: { request: Request }) =>
  new Response(robotsFor(request.headers.get('user-agent') ?? ''), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      // El archivo ahora tiene dos variantes. Sin Vary, cualquier cache
      // intermedia puede servirle el robots.txt con Content-Signal a
      // Googlebot (que lo reporta como error) o el limpio a un crawler de IA.
      'Vary': 'User-Agent',
    },
  });
