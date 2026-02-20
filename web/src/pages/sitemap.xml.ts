import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

const convexUrl = import.meta.env.PUBLIC_CONVEX_URL || '';
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const baseUrl = 'https://guardman.cl';

// Static pages that always exist
const staticPages = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/servicios', changefreq: 'weekly', priority: 0.9 },
  { loc: '/soluciones', changefreq: 'weekly', priority: 0.9 },
  { loc: '/nosotros', changefreq: 'monthly', priority: 0.7 },
  { loc: '/contacto', changefreq: 'monthly', priority: 0.8 },
  { loc: '/blog', changefreq: 'daily', priority: 0.8 },
];

export const GET: APIRoute = async () => {
  const urls: Array<{ loc: string; changefreq: string; priority: number }> = [
    ...staticPages,
  ];

  try {
    if (convex) {
      // Fetch services
      const services = await convex.query(api.services.getAllServices);
      if (services) {
        for (const service of services) {
          urls.push({
            loc: `/servicios/${service.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
          });
        }
      }

      // Fetch solutions
      const solutions = await convex.query(api.solutions.getAllSolutions);
      if (solutions) {
        for (const solution of solutions) {
          urls.push({
            loc: `/soluciones/${solution.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
          });
        }
      }

      // Fetch blog posts
      const blogPosts = await convex.query(api.blog_posts.getPublishedPosts);
      if (blogPosts) {
        for (const post of blogPosts) {
          urls.push({
            loc: `/blog/${post.slug}`,
            changefreq: 'weekly',
            priority: 0.7,
          });
        }
      }

      // Fetch communes
      const communes = await convex.query(api.locations.getAllCommunes);
      if (communes) {
        for (const commune of communes) {
          urls.push({
            loc: `/cobertura/${commune.slug}`,
            changefreq: 'weekly',
            priority: 0.7,
          });
        }
      }

      // Fetch service locations (SEO pages: service + commune combinations)
      const serviceLocations = await convex.query(api.service_locations.getServiceLocations);
      if (serviceLocations) {
        for (const sl of serviceLocations) {
          urls.push({
            loc: `/servicios/${sl.service_slug}/${sl.commune_slug}`,
            changefreq: 'weekly',
            priority: 0.7,
          });
        }
      }

      // Fetch industries
      const industries = await convex.query(api.industries.getAllIndustries);
      if (industries) {
        for (const industry of industries) {
          urls.push({
            loc: `/soluciones/${industry.slug}`,
            changefreq: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching sitemap data from Convex:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
