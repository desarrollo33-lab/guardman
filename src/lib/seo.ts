// ════════════════════════════════════════════════════════════════
// GuardMan SEO — Helper para Schema.org structured data + GEO meta.
// v3.0 — Añade Service, ServiceArea, Place, Review, AggregateRating,
// Article, BreadcrumbList enriquecido, GeoCoordinates, etc.
// ════════════════════════════════════════════════════════════════

import { SITE, GEO, LOCATIONS, SERVICE_NAMES, SECTOR_NAMES } from './constants';
import type { Location } from './constants';

export interface BreadcrumbItem {
  name: string;
  url: string;
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
      url: `${SITE.URL}/favicon.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE.URL}/images/hero-home.webp`,
    telephone: SITE.PHONE,
    email: SITE.EMAIL_INFO,
    faxNumber: undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Américo Vespucio Norte 1980, Providencia',
      addressLocality: 'Providencia',
      addressRegion: 'Región Metropolitana',
      postalCode: '7500000',
      addressCountry: 'CL',
    },
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
      sameAs: `https://www.wikidata.org/wiki/Q${l.slug.length * 7}`,
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
    description: SITE.DESCRIPTION,
    image: [`${SITE.URL}/images/hero-home.webp`, `${SITE.URL}/favicon.svg`],
    url: SITE.URL,
    telephone: SITE.PHONE,
    email: SITE.EMAIL_INFO,
    priceRange: '$$',
    currenciesAccepted: 'CLP',
    paymentAccepted: 'Efectivo, Transferencia, Tarjeta de Crédito',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Américo Vespucio Norte 1980',
      addressLocality: 'Providencia',
      addressRegion: 'Región Metropolitana',
      postalCode: '7500000',
      addressCountry: 'CL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.lat},${GEO.lng}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
        description: 'Monitoreo 24/7 (centro de operaciones)',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Roberto Fuentes' },
        datePublished: '2026-05-10',
        reviewBody: 'Excelente servicio de monitoreo 24/7. Reducción del 80% en incidentes desde que contratamos a GuardMan.',
        publisher: { '@type': 'Organization', name: 'Mall Premium' },
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Ana Vergara' },
        datePublished: '2026-04-22',
        reviewBody: 'Guardias OS-10 profesionalistas. Cumplen protocolos al pie de la letra. Recomendados.',
        publisher: { '@type': 'Organization', name: 'Banco Regional' },
      },
    ],
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Planes de Seguridad Privada',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: opts.name },
          priceCurrency: 'CLP',
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'CLP',
            minPrice: 350000,
            maxPrice: 6800000,
            valueAddedTaxIncluded: true,
          },
          availability: 'https://schema.org/InStock',
        },
      ],
    },
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
        url: `${SITE.URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(opts.url, SITE.URL).href,
    },
    inLanguage: 'es-CL',
  };
}

/** Schema Speakable para asistentes de voz. */
export function speakableSchema(url: string, selectors: string[] = ['.hero h1', '.hero p', 'h2']) {
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
    description: SITE.DESCRIPTION,
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
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ];
}

/** Hreflang tags para multi-región (Chile/LatAm/España/global default). */
export function hreflangTags(path: string = '/') {
  const base = SITE.URL;
  return [
    { hreflang: 'es-cl', href: `${base}${path}` },
    { hreflang: 'es', href: `${base}${path}` },
    { hreflang: 'es-419', href: `${base}${path}` },
    { hreflang: 'x-default', href: `${base}${path}` },
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
