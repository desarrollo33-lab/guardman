// ════════════════════════════════════════════════════════════════
// GuardMan SEO — Helper para Schema.org structured data + GEO meta.
// v3.0 — Añade Service, ServiceArea, Place, Review, AggregateRating,
// Article, BreadcrumbList enriquecido, GeoCoordinates, etc.
// ════════════════════════════════════════════════════════════════

import { SITE, GEO, LOCATIONS, SERVICE_NAMES, SECTOR_NAMES, SITE_DESCRIPTION, OPENING_HOURS } from './constants';
import type { Location } from './constants';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ───────────────────────────────────────────────────────────────
// Presupuesto de SERP
//
// Google recorta el title alrededor de los 580px (≈60 caracteres) y la meta
// description alrededor de los 920px (≈160). Medido contra producción el
// 2026-10-03: 164 de 242 titles pasaban de 60 y 225 de 244 descriptions de
// 160, porque el nombre de la comuna, el de la comuna larga y el sufijo de marca
// se acumulaban sin que nadie lo midiera. Ninguna de las dos cosas es una
// penalización: es pérdida directa de CTR, y es la más barata de arreglar.
//
// Los dos helpers de abajo hacen que el presupuesto se respete siempre, sin
// depender de que quien escribe la página haga la cuenta. Recortan en el
// límite de palabra y limpian la palabra colgante, porque un corte a media
// palabra deja cola ("... con GuardMan Chile") que se lee como error.
// ───────────────────────────────────────────────────────────────

export const TITLE_MAX = 60;
export const DESC_MAX = 160;

/** Palabras que no pueden cerrar un título o una descripción. */
const DANGLING = /\s(?:con|de|del|en|para|por|al|y|o|la|el|los|las|un|una|a|sin|que|cada)\s*$/i;

/** Quita la palabra colgante y la puntuación del final. */
const tidy = (s: string) => s.replace(/[\s,.;:·—–-]+$/, '').replace(DANGLING, '').replace(/[\s,.;:·—–-]+$/, '');

/**
 * Compone el title final, con la marca, dentro del presupuesto.
 *
 * La marca nunca se recorta: es la señal de entidad, y un title como
 * "Guardias de Seguridad en Las Condes GuardMan Chile" le dice a Google qué
 * empresa es. Lo que se cae es el calificador de la cola.
 */
export function composeTitle(pageTitle: string, brand: string, max: number = TITLE_MAX): string {
  const full = pageTitle.includes(brand) ? pageTitle : `${pageTitle} ${brand}`;
  if (full.length <= max) return full;

  const budget = max - brand.length - 1;
  const cut = tidy(pageTitle.slice(0, Math.max(0, budget)));
  const lastSpace = cut.lastIndexOf(' ');
  const body = lastSpace > 0 ? tidy(cut.slice(0, lastSpace)) : cut;
  return `${body} ${brand}`;
}

/**
 * Meta description dentro del presupuesto, cortada en límite de palabra.
 *
 * La información se ordena con lo importante primero en la plantilla de cada
 * página; acá solo se garantiza que no se pase. Un `…` al final avisa de que
 * el texto sigue en la página, que es mejor que un corte seco.
 */
export function fitDescription(text: string, max: number = DESC_MAX): string {
  if (text.length <= max) return text;
  const cut = tidy(text.slice(0, max - 1));
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

/**
 * PostalAddress única. Estaba duplicada literal en `organizationSchema` y
 * `localBusinessSchema`; cualquier corrección had que hacerse dos veces y
 * es exactamente el tipo de valor que se desincroniza del resto.
 */
function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: SITE.ADDRESS,
    addressLocality: SITE.ADDRESS_LOCALITY,
    addressRegion: SITE.ADDRESS_REGION,
    postalCode: SITE.ADDRESS_POSTAL_CODE,
    addressCountry: SITE.ADDRESS_COUNTRY,
  };
}

/** Schema Organization base, enriquecido con geo + sameAs. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.URL}/#organization`,
    name: SITE.NAME,
    legalName: SITE.LEGAL_NAME,
    url: SITE.URL,
    logo: {
      '@type': 'ImageObject',
      // PNG, no el favicon SVG. Google procesa `logo` como ImageObject y el
      // SVG no rinde en el panel de conocimiento ni en los resultados con
      // imagen: el sitio ya tenía `logo-byn.png` (681×250) y no se usaba.
      // Medido 2026-10-03 en producción.
      url: `${SITE.URL}/images/logo-byn.png`,
      width: 681,
      height: 250,
    },
    image: `${SITE.URL}/images/hero-home.webp`,
    telephone: SITE.PHONE,
    email: SITE.EMAIL_INFO,
    faxNumber: undefined,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    foundingDate: String(SITE.FOUNDED_YEAR),
    foundingLocation: {
      '@type': 'Place',
      name: 'Santiago',
      address: { '@type': 'PostalAddress', addressCountry: 'CL' },
    },
    areaServed: LOCATIONS.map((l) => ({
      '@type': 'City',
      name: l.name,
      // QID verificado contra la API de Wikidata (P31=Q1840161, "comuna de
      // Chile"). Antes se calculaba como `Q${slug.length * 7}`, que repetía
      // Q56 en cuatro comunas y Q70 en otras tres: un modelo no podía
      // distinguir las entidades. `l.qid` es dato curado, no derivado.
      sameAs: `https://www.wikidata.org/wiki/${l.qid}`,
    })),
    knowsAbout: [
      'Seguridad Privada',
      'Guardias de Seguridad',
      'CCTV Videovigilancia',
      'Control de Accesos',
      'PPI (Protección de Personas Importantes)',
      'Monitoreo 24/7',
      'Ajax Systems',
      'Certificación OS-10',
    ],
    sameAs: [SITE.INSTAGRAM_URL, SITE.YOUTUBE_URL],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: SITE.PHONE_TEL,
        email: SITE.EMAIL_VENTAS,
        areaServed: 'CL',
        availableLanguage: ['Spanish'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: SITE.PHONE_TEL,
        email: SITE.EMAIL_INFO,
        areaServed: 'CL',
        availableLanguage: ['Spanish'],
      },
    ],
  };
}

/** Schema LocalBusiness con aggregateRating, openingHours y geo. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.URL}/#localbusiness`,
    name: SITE.NAME,
    legalName: SITE.LEGAL_NAME,
    description: SITE_DESCRIPTION,
    image: [`${SITE.URL}/images/hero-home.webp`, `${SITE.URL}/images/logo-byn.png`],
    url: SITE.URL,
    telephone: SITE.PHONE,
    email: SITE.EMAIL_INFO,
    priceRange: '$$',
    currenciesAccepted: 'CLP',
    paymentAccepted: 'Efectivo, Transferencia, Tarjeta de Crédito',
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.lat},${GEO.lng}`,
    openingHoursSpecification: OPENING_HOURS.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...h.days],
      opens: h.opens,
      closes: h.closes,
      ...(h.note ? { description: h.note } : {}),
    })),
    // Sin `aggregateRating` ni `review`.
    //
    // El markup declaraba 4,9/5 sobre 127 reseñas y dos reseñas firmadas
    // ("Roberto Fuentes" / "Mall Premium", "Ana Vergara" / "Banco Regional")
    // que no existen en ninguna plataforma de reseñas verificable y no están
    // visibles en la página. Eso es dos cosas a la vez: una acción manual de
    // Google por structured data no confiable, y un riesgo legal por reseñas
    // embebidas que la empresa no puede respaldar. No se reemplaza con un
    // número inventado: se elimina. Para volver a declararlo hace falta una
    // fuente real y verificable.
    sameAs: [SITE.INSTAGRAM_URL, SITE.YOUTUBE_URL],
    parentOrganization: { '@type': 'Organization', name: SITE.LEGAL_NAME, '@id': `${SITE.URL}/#organization` },
  };
}

/** Schema Service con areaServed + provider + offers. */
export function serviceSchema(opts: {
  slug: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.URL}${opts.url}/#service`,
    name: opts.name,
    description: opts.description,
    image: opts.image ? new URL(opts.image, SITE.URL).href : `${SITE.URL}/images/hero-home.webp`,
    url: new URL(opts.url, SITE.URL).href,
    category: opts.category ?? 'Seguridad Privada',
    serviceType: opts.name,
    provider: {
      '@type': 'Organization',
      name: SITE.NAME,
      '@id': `${SITE.URL}/#organization`,
      url: SITE.URL,
      telephone: SITE.PHONE,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Santiago',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Región Metropolitana de Santiago',
      },
      {
        '@type': 'Country',
        name: 'Chile',
      },
    ],
    // SIN `hasOfferCatalog`.
    //
    // Se eliminó el 2026-10-03 por decisión del cliente. Publicaba
    // `minPrice: 350000 / maxPrice: 6800000`, y eso rompía dos cosas a la vez:
    //
    //   1. Contradecía la regla del repo (authority.ts:12): "Prohibido publicar
    //      ratios de dotación, tarifas ni operativas sensibles". El precio de
    //      un contrato de seguridad privada es exactamente eso.
    //   2. Los precios no estaban visibles en la página. La guía de datos
    //      estructurados de Google exige que el marcado describa contenido
    //      visible: un `Offer` con precio que no aparece en el HTML es un
    //      enriquecimiento que el buscador no puede verificar, y es la forma
    //      más común de disparar una acción manual por discrepancia de precio.
    //
    // Un `Offer` sin precio tampoco sirve: schema.org lo trata como oferta sin
    // información de compra, que es peor que no declarar oferta. Si alguna vez
    // se publican tarifas, el bloque vuelve CON el precio visible en la misma
    // página, y no antes.
    audience: { '@type': 'BusinessAudience', audienceType: 'Empresas y residencias en Chile' },
  };
}

/** Schema ServiceArea + Place para páginas de ubicación. */
export function locationSchema(opts: { location: Location; service?: string }) {
  const { location: loc, service } = opts;
  const base = {
    '@context': 'https://schema.org',
    '@type': 'ServiceArea',
    '@id': `${SITE.URL}/ubicaciones/${loc.slug}/#servicearea`,
    name: `Cobertura de seguridad privada en ${loc.name}`,
    description: `Servicios de seguridad privada con certificación OS-10 en ${loc.name}. GuardMan Chile cubre ${loc.name} y alrededores con guardias, CCTV, monitoreo 24/7 y más.`,
    url: `${SITE.URL}/ubicaciones/${loc.slug}`,
    provider: {
      '@type': 'Organization',
      name: SITE.NAME,
      '@id': `${SITE.URL}/#organization`,
    },
    areaServed: {
      '@type': 'City',
      name: loc.name,
      '@id': `${SITE.URL}/ubicaciones/${loc.slug}/#place`,
    },
  };

  const place = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${SITE.URL}/ubicaciones/${loc.slug}/#place`,
    name: loc.name,
    description: `${loc.name}, zona ${loc.zone}, Región Metropolitana. Área de cobertura de GuardMan Chile.`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.lat,
      longitude: loc.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: loc.name,
      addressRegion: 'Región Metropolitana',
      addressCountry: 'CL',
    },
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Región Metropolitana de Santiago',
      '@id': `${SITE.URL}/#rm`,
    },
  };

  const serviceSchema = service
    ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE.URL}/servicios/${service}/${loc.slug}/#service`,
        name: `${SERVICE_NAMES[service] ?? service} en ${loc.name}`,
        provider: { '@type': 'Organization', name: SITE.NAME, '@id': `${SITE.URL}/#organization` },
        areaServed: { '@type': 'City', name: loc.name, '@id': `${SITE.URL}/ubicaciones/${loc.slug}/#place` },
      }
    : null;

  return [base, place, serviceSchema].filter(Boolean);
}

/**
 * Schema LocalBusiness por comuna.
 *
 * El `localBusinessSchema()` de la home describe la empresa, y por eso lleva un
 * `@id` único. Reusarlo en las 16 páginas de comuna publicaría 16 nodos con el
 * mismo `@id` y el mismo nombre: Google no puede saber si son 16 locales o 16
 * copias de la misma, que es el error clásico del multi-local.
 *
 * La forma correcta es un nodo por comuna, con `@id` propio, `areaServed`
 * apuntando a esa comuna y `parentOrganization` colgando de la Organization
 * principal. Se emite SOLO en `/ubicaciones/[slug]`, que es la página canónica
 * de cada comuna: las 176 páginas servicio×comuna ya declaran `Service` +
 * `areaServed`, y sumarles el mismo LocalBusiness diluiría la señal en vez de
 * reforzarla.
 */
export function localBusinessAtLocation(loc: Location) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.URL}/ubicaciones/${loc.slug}/#localbusiness`,
    name: `${SITE.NAME} en ${loc.name}`,
    url: `${SITE.URL}/ubicaciones/${loc.slug}/`,
    telephone: SITE.PHONE,
    email: SITE.EMAIL_INFO,
    image: `${SITE.URL}/images/hero-home.webp`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: loc.name,
      addressRegion: loc.region === 'VS' ? 'Región de Valparaíso' : 'Región Metropolitana',
      addressCountry: SITE.ADDRESS_COUNTRY,
    },
    geo: { '@type': 'GeoCoordinates', latitude: loc.lat, longitude: loc.lng },
    areaServed: {
      '@type': 'City',
      name: loc.name,
      sameAs: `https://www.wikidata.org/wiki/${loc.qid}`,
    },
    parentOrganization: { '@type': 'Organization', name: SITE.LEGAL_NAME, '@id': `${SITE.URL}/#organization` },
  };
}

/** Schema BreadcrumbList enriquecido. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url.startsWith('http') ? b.url : new URL(b.url, SITE.URL).href,
    })),
  };
}

/** Schema FAQPage. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Schema Article para contenido editorial. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: opts.image ? new URL(opts.image, SITE.URL).href : `${SITE.URL}/images/hero-home.webp`,
    datePublished: opts.datePublished ?? '2024-01-01',
    dateModified: opts.dateModified ?? new Date().toISOString().slice(0, 10),
    author: {
      '@type': 'Organization',
      name: SITE.NAME,
      '@id': `${SITE.URL}/#organization`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.NAME,
      '@id': `${SITE.URL}/#organization`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.URL}/images/logo-byn.png`,
        width: 681,
        height: 250,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(opts.url, SITE.URL).href,
    },
    inLanguage: 'es-CL',
  };
}

/**
 * Schema Speakable para asistentes de voz.
 *
 * El default anterior era `['.hero h1', '.hero p', 'h2']`. Un `h2` pelado
 * selecciona TODOS los encabezados de nivel 2 del documento — no es un bloque
 * hablable, es el esqueleto de la página. Los asistentes de voz terminarían
 * leyendo la lista de sections en vez del mensaje principal. Se acota a la
 * prosa del hero: el titular y su párrafo de entrada.
 */
export function speakableSchema(
  url: string,
  selectors: string[] = ['.hero h1', '.hero .hero-lead'],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: new URL(url, SITE.URL).href,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selectors,
    },
  };
}

/** Schema WebSite con SearchAction (para sitelinks search box). */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.URL}/#website`,
    url: SITE.URL,
    name: SITE.NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@type': 'Organization', '@id': `${SITE.URL}/#organization` },
    inLanguage: 'es-CL',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Genera <meta> geo tags + hreflang para inyectar en <head>. */
export function geoMetaTags() {
  return [
    { name: 'geo.region', content: GEO.region },
    { name: 'geo.placename', content: GEO.placeName },
    { name: 'geo.position', content: `${GEO.lat};${GEO.lng}` },
    { name: 'ICBM', content: GEO.icbm },
    { name: 'theme-color', content: '#1A2744' },
    { name: 'format-detection', content: 'telephone=yes' },
  ];
}

/**
 * Hreflang. Sólo `es-cl` (el idioma real del sitio) y `x-default`.
 *
 * Antes declaraba además `es` y `es-419`. No existe ninguna página /en/ ni
 * /es/, así que los cuatro alternates apuntaban a la misma URL: Google
 * recibe "esta página es la versión es, es-419, es-cl y x-default a la vez",
 * que es hreflang contradictorio y una fuga de signals. El sitemap emite
 * los mismos alternates por URL, así que el duplicado iba a 190 páginas.
 */
export function hreflangTags(path: string = '/') {
  const base = SITE.URL;
  // Forma canónica única: barra final salvo la raíz. Debe coincidir con el
  // <loc> del sitemap y con el canonical del head; si difieren, Google
  // descarta el par hreflang. Verificado contra producción 2026-10-02.
  const canonicalPath = path === '/' ? path : path.endsWith('/') ? path : `${path}/`;
  return [
    { hreflang: 'es-cl', href: `${base}${canonicalPath}` },
    { hreflang: 'x-default', href: `${base}${canonicalPath}` },
  ];
}

/** Lista de servicios para clusters de contenido. */
export function contentCluster() {
  const services = Object.entries(SERVICE_NAMES).map(([slug, name]) => ({
    slug,
    name,
    url: `/servicios/${slug}`,
  }));
  const locations = LOCATIONS.map((l) => ({
    slug: l.slug,
    name: l.name,
    url: `/ubicaciones/${l.slug}`,
  }));
  const sectors = Object.entries(SECTOR_NAMES).map(([slug, name]) => ({
    slug,
    name,
    url: `/sectores/${slug}`,
  }));
  return { services, locations, sectors };
}
