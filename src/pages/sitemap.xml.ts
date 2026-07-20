// /sitemap.xml — sitemap enriquecido v3.0 con lastmod, alternates hreflang, imágenes.
// Excluye /admin/* y /api/*.
import { SERVICE_NAMES, LOCATIONS, SECTOR_NAMES, SITE, HREFLANG } from '../lib/constants';

const SERVICE_SLUGS = Object.keys(SERVICE_NAMES);
const SECTOR_SLUGS = Object.keys(SECTOR_NAMES);
const LOC_SLUGS = LOCATIONS.map((l) => l.slug);

const isExcluded = (path: string) =>
  path === '/admin' || path.startsWith('/admin/') ||
  path === '/api' || path.startsWith('/api/');

const today = new Date().toISOString().slice(0, 10);

type ChangeFreq = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapUrl {
  loc: string;
  changefreq: ChangeFreq;
  priority: number;
  lastmod?: string;
  images?: string[];
}

const cf = (s: string): ChangeFreq => s as ChangeFreq;

const urls: SitemapUrl[] = [
  { loc: '/', changefreq: cf('weekly'), priority: 1.0, lastmod: today, images: [`${SITE.URL}/images/hero-home.webp`] },
  { loc: '/servicios', changefreq: cf('weekly'), priority: 0.9, lastmod: today },
  { loc: '/ubicaciones', changefreq: cf('weekly'), priority: 0.8, lastmod: today },
  { loc: '/sectores', changefreq: cf('weekly'), priority: 0.7, lastmod: today },
  { loc: '/nosotros', changefreq: cf('monthly'), priority: 0.6, lastmod: today },
  { loc: '/guard-pod', changefreq: cf('monthly'), priority: 0.8, lastmod: today },
  { loc: '/ajax-systems', changefreq: cf('monthly'), priority: 0.8, lastmod: today },
  { loc: '/contacto', changefreq: cf('monthly'), priority: 0.6, lastmod: today },
  { loc: '/cotizacion', changefreq: cf('monthly'), priority: 0.6, lastmod: today },
  { loc: '/canal-de-denuncias', changefreq: cf('monthly'), priority: 0.7, lastmod: today },
  { loc: '/gracias', changefreq: cf('never'), priority: 0.1 },
  { loc: '/privacidad', changefreq: cf('yearly'), priority: 0.3, lastmod: today },
  { loc: '/terminos', changefreq: cf('yearly'), priority: 0.3, lastmod: today },

  // Servicios
  ...SERVICE_SLUGS.map<SitemapUrl>((slug) => ({
    loc: `/servicios/${slug}`,
    changefreq: cf('weekly'),
    priority: 0.9,
    lastmod: today,
    images: [`${SITE.URL}/images/hero-home.webp`],
  })),

  // Ubicaciones
  ...LOC_SLUGS.map<SitemapUrl>((slug) => ({
    loc: `/ubicaciones/${slug}`,
    changefreq: cf('weekly'),
    priority: 0.7,
    lastmod: today,
  })),

  // Sectores
  ...SECTOR_SLUGS.map<SitemapUrl>((slug) => ({
    loc: `/sectores/${slug}`,
    changefreq: cf('weekly'),
    priority: 0.6,
    lastmod: today,
  })),

  // Combos (servicio × ubicación) — 9 × 14 = 126
  ...SERVICE_SLUGS.flatMap<SitemapUrl>((svc) =>
    LOC_SLUGS.map<SitemapUrl>((loc) => ({
      loc: `/servicios/${svc}/${loc}`,
      changefreq: cf('weekly'),
      priority: 0.8,
      lastmod: today,
    })),
  ),
].filter((u) => !isExcluded(u.loc));

const hreflangs = HREFLANG;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((u) => {
    const fullLoc = `${SITE.URL}${u.loc}`;
    const alternates = hreflangs
      .map(
        (h) =>
          `    <xhtml:link rel="alternate" hreflang="${h.hreflang}" href="${SITE.URL}${u.loc}"/>`,
      )
      .join('\n');
    const images = (u.images ?? [])
      .map((img) => `    <image:image><image:loc>${img}</image:loc></image:image>`)
      .join('\n');
    return `  <url>
    <loc>${fullLoc}</loc>
    <lastmod>${u.lastmod ?? today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
${alternates}
${images}
  </url>`;
  })
  .join('\n')}
</urlset>`;

export const GET = () =>
  new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
