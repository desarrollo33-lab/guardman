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
import { SITE } from '../lib/constants';

const robots = `# GuardMan Chile — robots.txt v3.1
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

# Preferencias de uso del contenido por parte de sistemas de IA.
# ai-input=yes: los asistentes SÍ pueden leer y citar el contenido. Es la
# intención del sitio — de hecho /llms.txt existe justo para eso.
# ai-train=no: no se autoriza usar el contenido para entrenar modelos.
# search=yes: los buscadores tradicionales siguen/indexando normal.
Content-Signal: ai-train=no, search=yes, ai-input=yes

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

export const GET = () =>
  new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
