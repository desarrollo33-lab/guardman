import { convexServer } from '@/lib/convex';
import { api } from '@convex/_generated/api';

const SITE_URL = 'https://guardman.cl';

/**
 * Generates the full XML sitemap for the site.
 * Fetches dynamic routes (services, industries, communes) from Convex.
 */
export async function GET() {
    // 1. Define static routes
    const staticRoutes = [
        '',
        '/nosotros',
        '/contacto',
        '/cotizar',
        '/servicios',
        '/industrias',
        '/cobertura',
        '/blog', // Blog index is static
        '/terminos',
        '/privacidad',
        '/carreras',
        '/admin/login',
    ];

    // 2. Fetch dynamic data from Convex
    const [services, industries, communes, faqs] = await Promise.all([
        convexServer.query(api.services.getAllServices),
        convexServer.query(api.industries.getAllIndustries),
        convexServer.query(api.locations.getAllCommunes),
        convexServer.query(api.faqs.getAllFaqs), // FAQs might have their own pages later, currently on home
    ]);

    // 3. Build dynamic URLs
    const serviceUrls = services.map((s) => `/servicios/${s.slug}`);
    const industryUrls = industries.map((i) => `/industrias/${i.slug}`);
    const communeUrls = communes.map((c) => `/cobertura/${c.slug}`);

    // 4. Combine all URLs
    const allUrls = [
        ...staticRoutes,
        ...serviceUrls,
        ...industryUrls,
        ...communeUrls,
    ];

    // 5. Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
            .map((url) => {
                return `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`;
            })
            .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
    });
}
