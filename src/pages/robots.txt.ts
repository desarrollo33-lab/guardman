// /robots.txt v3.0 — enriquecido con crawl-delay, sitemap multi-región.
import { SITE } from '../lib/constants';

const robots = `# GuardMan Chile — robots.txt v3.0
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
