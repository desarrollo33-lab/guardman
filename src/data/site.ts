export interface SocialLinks {
  instagram: string;
  youtube: string;
  linkedin: string;
}

export interface SiteColors {
  primary: string;
  accent: string;
  secondary: string;
  dark: string;
  light: string;
}

export interface BusinessHours {
  days: string;
  open: string;
  close: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  url: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
  };
  social: SocialLinks;
  colors: SiteColors;
  hours: BusinessHours;
  founded: number;
  clients: number;
  guards: number;
}

export const site: SiteConfig = {
  name: 'Guardman Chile',
  legalName: 'Grupo Guardman SpA',
  url: 'https://guardman.cl',
  description:
    'Empresa de seguridad privada en Chile. Guardias OS10 certificados, alarmas Ajax, patrullaje de condominios, módulos GuardPod y control de acceso. Cobertura en toda la Región Metropolitana.',
  phone: '+56 9 3000 0010',
  whatsapp: '+56930000010',
  email: 'info@guardman.cl',
  address: {
    street: 'Av. El Bosque 0123',
    city: 'Santiago',
    region: 'Región Metropolitana',
    country: 'Chile',
    postalCode: '7550000',
  },
  social: {
    instagram: 'https://instagram.com/grupo_guardman',
    youtube: 'https://youtube.com/@guardman',
    linkedin: 'https://linkedin.com/company/guardman-chile',
  },
  colors: {
    primary: '#1E40AF',
    accent: '#F59E0B',
    secondary: '#1E3A8A',
    dark: '#111827',
    light: '#F9FAFB',
  },
  hours: {
    days: 'Lunes a Domingo',
    open: '00:00',
    close: '23:59',
  },
  founded: 2015,
  clients: 500,
  guards: 850,
};

// Helper functions
export function getWhatsAppUrl(message?: string): string {
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${site.whatsapp.replace(/\+/g, '')}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

export function getPhoneLink(): string {
  return `tel:${site.phone.replace(/\s/g, '')}`;
}

export function getEmailLink(subject?: string): string {
  const encodedSubject = subject ? encodeURIComponent(subject) : '';
  return `mailto:${site.email}${encodedSubject ? `?subject=${encodedSubject}` : ''}`;
}

export function getGoogleMapsUrl(): string {
  const query = encodeURIComponent(
    `${site.address.street}, ${site.address.city}, ${site.address.country}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
