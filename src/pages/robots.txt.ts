// /robots.txt v3.1 — crawl-delay, sitemap multi-región, Content Signals y
// puntero de descubrimiento para agentes (Agentmap, ARD §"Publishing").
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
# search=yes: los buscadores traditional siguen\indexando normal.
Content-Signal: ai-train=no, search=yes, ai-input=yes

# Manifiesto de capacidades para agentes (ARD). Un consumidor debe ir a
# /.well-known/ard.json; la ruta /ai-catalog.json se sirve como cortesía
# de la versión previa del data model.
Agentmap: ${SITE.URL}/.well-known/ard.json

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
