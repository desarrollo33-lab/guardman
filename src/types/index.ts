// Tipos compartidos del frontend.

export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  og_image?: string;
  keywords?: string[];
}

export interface HeroSection {
  heading: string;
  subheading?: string;
  image?: string;
  cta_text?: string;
  cta_href?: string;
  badge?: string;
}

export interface IntroSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
}

export interface FeaturesSection {
  heading: string;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqsSection {
  heading: string;
  items: FaqItem[];
}

export interface StatsItem {
  label: string;
  value: string;
}

export interface StatsSection {
  heading: string;
  items: StatsItem[];
}

export interface CtaSection {
  heading: string;
  subheading?: string;
  button: string;
  image?: string;
}

export interface GeneratedContent {
  sections: {
    hero?: HeroSection;
    intro?: IntroSection;
    features?: FeaturesSection;
    issues?: FeaturesSection;
    stats?: StatsSection;
    faqs?: FaqsSection;
    cta?: CtaSection;
    coverage?: FeaturesSection;
    meta?: { title: string; description: string };
  };
  _meta?: {
    serper_queries?: string[];
    serper_competitors?: string[];
    keywords?: string[];
    content_gaps?: string[];
    generated_at?: string;
    generated_by?: 'ai' | 'fallback' | 'build_site';
  };
}

export interface PageData {
  type: 'service' | 'location' | 'sector' | 'combo' | 'static_page';
  slug: string;
  name: string;
  content: GeneratedContent;
  seo: SeoMeta;
  version?: number;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  size?: number;
  uploaded_at: string;
  tags?: string[];
  assigned_to?: { type: string; slug: string }[];
}
