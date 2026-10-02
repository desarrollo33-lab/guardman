// /sitemap.xml — sitemap enriquecido v3.0 con lastmod, alternates hreflang, imágenes.
// Excluye /admin/* y /api/*.
import { SERVICE_NAMES, LOCATIONS, SECTOR_NAMES, SITE, HREFLANG } from '../lib/constants';
import { AUTHORITY_PAGES } from '../lib/authority';
import { GUIDES } from '../lib/guias';
import { SOLUTIONS } from '../lib/soluciones';

const SERVICE_SLUGS = Object.keys(SERVICE_NAMES);
const SECTOR_SLUGS = Object.keys(SECTOR_NAMES);
const LOC_SLUGS = LOCATIONS.map((l) => l.slug);

const isExcluded = (path: string) =>
  path === '/admin' || path.startsWith('/admin/') ||
  path === '/api' || path.startsWith('/api/');

type ChangeFreq = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapUrl {
  loc: string;
  changefreq: ChangeFreq;
  priority: number;
  lastmod?: string;
  images?: string[];
}

const cf = (s: string): ChangeFreq => s as ChangeFreq;

const buildUrls = (today: string): SitemapUrl[] => [
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

  // Capa de autoridad — objetivo: que las IAs citen a GuardMan como fuente
  // del marco legal del rubro. Prioridad alta pese al bajo volumen.
  { loc: '/seguridad-privada', changefreq: cf('monthly'), priority: 0.8, lastmod: today },
  ...AUTHORITY_PAGES.map<SitemapUrl>((p) => ({
    loc: `/seguridad-privada/${p.slug}`,
    changefreq: cf('monthly'),
    priority: 0.8,
    lastmod: p.updatedISO,
  })),

  // Guías de dotación — llevan a conversión con contexto declarado.
  { loc: '/guias', changefreq: cf('monthly'), priority: 0.8, lastmod: today },
  ...GUIDES.map<SitemapUrl>((g) => ({
    loc: `/guias/${g.slug}`,
    changefreq: cf('monthly'),
    priority: 0.8,
    lastmod: g.updatedISO,
  })),

  // Soluciones integradas — nicho aseo + seguridad, sin competencia editorial.
  { loc: '/soluciones', changefreq: cf('monthly'), priority: 0.9, lastmod: today },
  ...SOLUTIONS.map<SitemapUrl>((s) => ({
    loc: `/soluciones/${s.slug}`,
    changefreq: cf('monthly'),
    priority: 0.9,
    lastmod: s.updatedISO,
  })),

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

  // Combos (servicio × ubicación) — 11 servicios × 14 ubicaciones = 154
  ...SERVICE_SLUGS.flatMap<SitemapUrl>((svc) =>
    LOC_SLUGS.map<SitemapUrl>((loc) => ({
      loc: `/servicios/${svc}/${loc}`,
      changefreq: cf('weekly'),
      priority: 0.8,
      lastmod: today,
    })),
  ),
].filter((u) => !isExcluded(u.loc));

// Forma canónica única del sitio: barra final, excepto la raíz.
// Sin esto el sitemap emitía 189 <loc> que responden 307 hacia la versión con
// barra, y las páginas planas quedaban duplicadas (200 en ambas variantes con
// canonical distinto). Verificado contra producción 2026-10-02.
const canonicalLoc = (loc: string): string => (loc === '/' ? loc : `${loc}/`);

const hreflangs = HREFLANG;

const buildXml = (today: string): string => {
  const urls = buildUrls(today);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((u) => {
    const fullLoc = `${SITE.URL}${canonicalLoc(u.loc)}`;
    // hreflang debe apuntar a la misma URL canónica que el <loc>: si difieren,
    // Google descarta el par completo.
    const alternates = hreflangs
      .map(
        (h) =>
          `    <xhtml:link rel="alternate" hreflang="${h.hreflang}" href="${SITE.URL}${canonicalLoc(u.loc)}"/>`,
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
};

export const GET = () => {
  // Computar `today` en cada request, no al cargar el módulo. Cloudflare
  // Workers mantiene isolates por horas, lo que congela constantes top-level.
  const today = new Date().toISOString().slice(0, 10);
  return new Response(buildXml(today), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
