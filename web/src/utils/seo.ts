/**
 * SEO Utilities for Guardman
 * Helper functions for generating SEO metadata
 */

const SITE_URL = import.meta.env.SITE || 'https://guardman.cl';

/**
 * Generates an SEO-optimized title for a commune page
 */
export function generateCommuneTitle(commune: string): string {
  return `Seguridad Privada en ${commune} | Guardman Chile`;
}

/**
 * Generates an SEO-optimized description for a commune page
 */
export function generateCommuneDescription(commune: string): string {
  return `Servicios de seguridad privada en ${commune}, Región Metropolitana. Guardias de seguridad, vigilancia, monitoreo y protección profesional para empresas. Cotiza hoy con Guardman.`;
}

// Keep old functions as aliases for backward compatibility
export const generateCityTitle = generateCommuneTitle;
export const generateCityDescription = (city: string, _region?: string) =>
  generateCommuneDescription(city);

/**
 * Generates a canonical URL from a path
 */
export function generateCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

/**
 * Generates a service page title
 */
export function generateServiceTitle(serviceName: string): string {
  return `${serviceName} | Servicios de Seguridad Guardman`;
}

/**
 * Generates a service page description
 */
export function generateServiceDescription(
  serviceName: string,
  description: string
): string {
  return `${serviceName}: ${description} Guardman Chile - Expertos en seguridad privada con más de 10 años de experiencia.`;
}

/**
 * Truncates text to a maximum length for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Generates Open Graph metadata object
 */
export function generateOpenGraph({
  title,
  description,
  url,
  image = '/og-image.png',
  type = 'website',
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}) {
  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': generateCanonicalUrl(image),
    'og:type': type,
    'og:site_name': 'Guardman Chile',
    'og:locale': 'es_CL',
  };
}

/**
 * Generates Twitter Card metadata object
 */
export function generateTwitterCard({
  title,
  description,
  image = '/og-image.png',
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': generateCanonicalUrl(image),
  };
}

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: generateCanonicalUrl(item.url),
    })),
  };
}
