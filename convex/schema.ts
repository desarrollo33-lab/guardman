import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

// Content block types
const contentBlockTypes = v.union(
  v.literal('hero_ajax'),
  v.literal('hero_video'),
  v.literal('cta_dual'),
  v.literal('services_grid'),
  v.literal('services_grid_ajax'),
  v.literal('stats_row'),
  v.literal('stats_section'),
  v.literal('process_steps'),
  v.literal('testimonials_slider'),
  v.literal('partners_grid'),
  v.literal('values_section'),
  v.literal('industries_grid'),
  v.literal('faqs_accordion'),
  v.literal('location_map'),
  v.literal('contact_form'),
  v.literal('content_rich'), // Rich text content block
  v.literal('image_gallery'),
  v.literal('video_section'),
  v.literal('guardpod_feature')
);

// Common data shapes for content blocks
const heroData = v.object({
  // New typed fields
  background_type: v.optional(v.union(v.literal('youtube'), v.literal('image'), v.literal('gradient'), v.literal('none'))),
  youtube_id: v.optional(v.string()),
  image_url: v.optional(v.string()),
  mobile_image_url: v.optional(v.string()),
  ctas: v.optional(v.array(v.object({
    text: v.string(),
    href: v.string(),
    variant: v.optional(v.string()),
  }))),
  badges: v.optional(v.array(v.object({
    text: v.string(),
    icon: v.optional(v.string()),
  }))),
  // Legacy fields for backward compatibility
  video_id: v.optional(v.string()),
  primary_cta: v.optional(v.object({
    text: v.string(),
    href: v.string(),
  })),
  secondary_ctas: v.optional(v.array(v.object({
    text: v.string(),
    href: v.string(),
    variant: v.optional(v.string()),
  }))),
  trust_badges: v.optional(v.array(v.object({
    text: v.string(),
    icon: v.optional(v.string()),
  }))),
  // Additional legacy fields
  features: v.optional(v.array(v.object({
    title: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
  }))),
  stats: v.optional(v.array(v.object({
    value: v.string(),
    label: v.string(),
  }))),
});

const ctaData = v.object({
  // New typed fields
  buttons: v.optional(v.array(v.object({
    text: v.string(),
    href: v.string(),
    variant: v.optional(v.string()),
  }))),
  badges: v.optional(v.array(v.string())),
  background_type: v.optional(v.union(v.literal('image'), v.literal('gradient'))),
  background_value: v.optional(v.string()),
  // Legacy fields for backward compatibility
  leftCta: v.optional(v.object({
    title: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    buttonText: v.string(),
    buttonHref: v.string(),
  })),
  rightCta: v.optional(v.object({
    title: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    buttonText: v.string(),
    buttonHref: v.string(),
  })),
});

const servicesGridData = v.object({
  columns: v.optional(v.number()),
  service_slugs: v.optional(v.array(v.string())),
  show_all: v.optional(v.boolean()),
  // Legacy fields for backward compatibility
  services: v.optional(v.array(v.object({
    title: v.string(),
    description: v.string(),
    href: v.string(),
    image: v.optional(v.string()),
    badge: v.optional(v.string()),
  }))),
  showAllLink: v.optional(v.boolean()),
});

const statsRowData = v.object({
  stat_ids: v.optional(v.array(v.id('stats'))),
  show_all: v.optional(v.boolean()),
  layout: v.optional(v.union(v.literal('grid'), v.literal('flex'))),
  // Legacy fields for backward compatibility
  background: v.optional(v.union(v.literal('dark'), v.literal('light'), v.literal('transparent'))),
  stats: v.optional(v.array(v.object({
    value: v.string(),
    label: v.string(),
  }))),
});

const processStepsData = v.object({
  step_ids: v.optional(v.array(v.id('process_steps'))),
  show_all: v.optional(v.boolean()),
});

const testimonialsData = v.object({
  show_all: v.optional(v.boolean()),
  max_display: v.optional(v.number()),
  autoplay: v.optional(v.boolean()),
});

const partnersData = v.object({
  show_all: v.optional(v.boolean()),
  partner_type: v.optional(v.union(v.literal('clients'), v.literal('certifications'), v.literal('tech'))),
});

const valuesData = v.object({
  show_all: v.optional(v.boolean()),
  columns: v.optional(v.number()),
});

const industriesData = v.object({
  show_all: v.optional(v.boolean()),
  industry_slugs: v.optional(v.array(v.string())),
  columns: v.optional(v.number()),
});

const faqsData = v.object({
  category: v.optional(v.string()),
  show_all: v.optional(v.boolean()),
});

const locationMapData = v.object({
  center_lat: v.optional(v.number()),
  center_lng: v.optional(v.number()),
  zoom: v.optional(v.number()),
  show_communes: v.optional(v.boolean()),
  commune_slugs: v.optional(v.array(v.string())),
});

const contactFormData = v.object({
  form_type: v.optional(v.union(v.literal('lead'), v.literal('general'))),
  services: v.optional(v.array(v.string())), // Available service options
  show_map: v.optional(v.boolean()),
});

const contentRichData = v.object({
  html: v.optional(v.string()),
  alignment: v.optional(v.union(v.literal('left'), v.literal('center'), v.literal('right'))),
  max_width: v.optional(v.string()),
  // Legacy fields for backward compatibility
  align: v.optional(v.union(v.literal('left'), v.literal('center'), v.literal('right'))),
  backgroundImage: v.optional(v.string()),
  size: v.optional(v.union(v.literal('sm'), v.literal('md'), v.literal('lg'))),
});

const imageGalleryData = v.object({
  images: v.optional(v.array(v.object({
    url: v.string(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
  }))),
  columns: v.optional(v.number()),
  lightbox: v.optional(v.boolean()),
});

const videoSectionData = v.object({
  video_url: v.optional(v.string()),
  video_id: v.optional(v.string()), // YouTube ID
  autoplay: v.optional(v.boolean()),
  muted: v.optional(v.boolean()),
});

// Union of all content block data types
const contentBlockData = v.union(
  heroData,
  ctaData,
  servicesGridData,
  statsRowData,
  processStepsData,
  testimonialsData,
  partnersData,
  valuesData,
  industriesData,
  faqsData,
  locationMapData,
  contactFormData,
  contentRichData,
  imageGalleryData,
  videoSectionData
);

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()), // 'admin' or 'user'
  }).index('by_email', ['email']),
  // Force rebuild 1
  leads: defineTable({
    nombre: v.string(),
    telefono: v.string(),
    email: v.optional(v.string()),
    servicio: v.string(),
    ciudad: v.optional(v.string()),
    mensaje: v.optional(v.string()),
    source: v.optional(v.string()),
    utm_source: v.optional(v.string()),
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
    status: v.optional(v.string()),
    createdAt: v.number(),
    is_active: v.optional(v.boolean()),
  })
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  services: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    tagline: v.optional(v.string()),
    icon: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    cta: v.optional(v.string()),
    solutions: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    image: v.optional(v.string()),
    image_alt: v.optional(v.string()),
    image_storage_id: v.optional(v.id('_storage')),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
    order: v.optional(v.number()),
    // Legacy field for backward compatibility
    id: v.optional(v.string()),
  }).index('by_slug', ['slug']),

  communes: defineTable({
    name: v.string(),
    slug: v.string(),
    zone: v.optional(v.string()),
    isOtherCity: v.optional(v.boolean()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    hero_title: v.optional(v.string()),
    hero_subtitle: v.optional(v.string()),
    intro_content: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
    order: v.optional(v.number()),
    is_published: v.optional(v.boolean()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    population: v.optional(v.number()),
    unique_content: v.optional(v.string()),
  })
    .index('by_slug', ['slug'])
    .index('by_zone', ['zone'])
    .index('by_isOtherCity', ['isOtherCity']),

  solutions: defineTable({
    slug: v.string(),
    title: v.optional(v.string()),
    description: v.string(),
    icon: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    cta: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    og_image: v.optional(v.string()),
    image: v.optional(v.string()),
    image_alt: v.optional(v.string()),
    image_storage_id: v.optional(v.id('_storage')),
    challenges: v.optional(v.array(v.string())),
    relatedServices: v.optional(v.array(v.string())),
    is_active: v.optional(v.boolean()),
    order: v.optional(v.number()),
    // Legacy fields for backward compatibility
    id: v.optional(v.string()),
    solutions: v.optional(v.array(v.string())),
  })
    .index('by_slug', ['slug']),

  faqs: defineTable({
    id: v.optional(v.string()),
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  })
    .index('by_category', ['category'])
    .index('by_order', ['order']),

  // --- NEW TABLES FOR DATA-DRIVEN ARCHITECTURE ---

  site_config: defineTable({
    is_active: v.boolean(), // Singleton check
    brand_name: v.string(),
    phone_primary: v.string(),
    phone_secondary: v.optional(v.string()),
    whatsapp_number: v.string(),
    email_contact: v.string(),
    address_main: v.optional(v.string()),
    social_links: v.object({
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      facebook: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    navbar_items: v.array(
      v.object({
        label: v.string(),
        href: v.optional(v.string()),
        is_button: v.optional(v.boolean()),
        children: v.optional(
          v.array(
            v.object({
              label: v.string(),
              href: v.string(),
            })
          )
        ),
      })
    ),
  }).index('by_active', ['is_active']),

  pages: defineTable({
    slug: v.string(), // e.g. "/", "/servicios", "/contacto"
    title: v.string(), // Internal name
    seo_title: v.string(),
    seo_description: v.string(),
    seo_keywords: v.optional(v.array(v.string())),
    og_image: v.optional(v.string()),
    is_published: v.boolean(),
    is_active: v.optional(v.boolean()),
  }).index('by_slug', ['slug']),

  content_blocks: defineTable({
    page_slug: v.string(), // Foreign key to pages.slug
    type: contentBlockTypes, // Typed block type
    order: v.number(), // Render order
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    content: v.optional(v.string()), // Markdown or HTML body
    data: v.optional(contentBlockData), // Typed data based on block type
    is_visible: v.boolean(),
    is_active: v.optional(v.boolean()),
  }).index('by_page_order', ['page_slug', 'order']),

  testimonials: defineTable({
    author: v.string(),
    role: v.optional(v.string()),
    company: v.optional(v.string()),
    quote: v.string(),
    rating: v.number(), // 1-5
    image_url: v.optional(v.string()),
    verified: v.boolean(),
    order: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  }).index('by_order', ['order']),

  partners: defineTable({
    name: v.string(),
    logo_url: v.string(),
    type: v.string(), // "certification", "client", "tech_partner"
    url: v.optional(v.string()),
    order: v.number(),
    quote: v.optional(v.string()), // New
    industry: v.optional(v.string()), // New
    icon: v.optional(v.string()), // New
    is_active: v.optional(v.boolean()),
  }).index('by_type', ['type']),

  blog_posts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    cover_image: v.string(),
    author: v.string(),
    author_id: v.optional(v.id('authors')),
    published_at: v.number(),
    read_time: v.number(), // minutes
    tags: v.array(v.string()),
    is_featured: v.boolean(),
    is_published: v.optional(v.boolean()),
    content: v.array(
      v.object({
        // Sections
        type: v.string(), // "text", "image", "video", "quote", "h2", "list"
        content: v.string(), // Text content or URL
        alt: v.optional(v.string()), // For images
        caption: v.optional(v.string()), // For images/videos
        items: v.optional(v.array(v.string())), // For lists
      })
    ),
    seo_title: v.optional(v.string()),
    seo_description: v.optional(v.string()),
  }).index('by_slug', ['slug']),

  // --- FILE STORAGE ---

  files: defineTable({
    storageId: v.id('_storage'),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.optional(v.string()), // User ID when auth is ready
    createdAt: v.number(),
    is_active: v.optional(v.boolean()),
  }).index('by_storageId', ['storageId']),

  // --- NEW CMS TABLES ---

  heroes: defineTable({
    page_slug: v.string(), // e.g. "home", "servicios"
    title: v.string(),
    subtitle: v.optional(v.string()),
    background_type: v.union(v.literal('youtube'), v.literal('image')),
    youtube_id: v.optional(v.string()),
    image_url: v.optional(v.string()),
    mobile_image_url: v.optional(v.string()),
    ctas: v.optional(
      v.array(
        v.object({
          text: v.string(),
          href: v.string(),
          variant: v.optional(v.string()),
        })
      )
    ),
    badges: v.optional(
      v.array(
        v.object({
          text: v.string(),
          icon: v.optional(v.string()),
        })
      )
    ),
    is_active: v.optional(v.boolean()),
  }).index('by_page_slug', ['page_slug']),

  team_members: defineTable({
    name: v.string(),
    role: v.string(),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  }).index('by_order', ['order']),

  company_values: defineTable({
    title: v.string(),
    icon: v.optional(v.string()),
    description: v.string(),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  }).index('by_order', ['order']),

  process_steps: defineTable({
    page_slug: v.string(),
    number: v.number(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  }).index('by_page_slug', ['page_slug']),

  stats: defineTable({
    page_slug: v.string(),
    value: v.string(), // "500+", "15+"
    label: v.string(), // "Clientes", "Años"
    icon: v.optional(v.string()),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  }).index('by_page_slug', ['page_slug']),

  industries: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
    // SEO image fields
    image: v.optional(v.string()),
    image_alt: v.optional(v.string()),
    image_storage_id: v.optional(v.id('_storage')),
    // Typed arrays (previously v.any())
    challenges: v.optional(v.array(v.string())),
    relatedServices: v.optional(v.array(v.string())),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
  })
    .index('by_slug', ['slug'])
    .index('by_order', ['order']),

  ctas: defineTable({
    page_slug: v.string(),
    headline: v.string(),
    subheadline: v.optional(v.string()),
    buttons: v.array(
      v.object({
        text: v.string(),
        href: v.string(),
        variant: v.optional(v.string()),
      })
    ),
    badges: v.optional(v.array(v.string())),
    background_type: v.optional(
      v.union(v.literal('image'), v.literal('gradient'))
    ),
    background_value: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  }).index('by_page_slug', ['page_slug']),

  authors: defineTable({
    name: v.string(),
    slug: v.string(),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  }).index('by_slug', ['slug']),

  // === SEO TABLES ===
  
  // Service × Commune combinations for SEO pages
  service_locations: defineTable({
    service_slug: v.string(),
    commune_slug: v.string(),
    meta_title: v.string(),
    meta_description: v.string(),
    intro_content: v.optional(v.string()), // AI-generated content
    is_active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_service_commune', ['service_slug', 'commune_slug'])
    .index('by_service', ['service_slug'])
    .index('by_commune', ['commune_slug']),

  // === REVIEW TABLES ===
  
  reviews: defineTable({
    service_slug: v.optional(v.string()),
    commune_slug: v.optional(v.string()),
    author_name: v.string(),
    author_role: v.optional(v.string()),
    rating: v.number(), // 1-5
    title: v.optional(v.string()),
    content: v.string(),
    is_verified: v.optional(v.boolean()),
    is_featured: v.optional(v.boolean()),
    is_active: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_service', ['service_slug'])
    .index('by_commune', ['commune_slug'])
    .index('by_rating', ['rating']),

  // === CAREERS TABLES ===
  
  careers: defineTable({
    title: v.string(),
    slug: v.string(),
    department: v.string(), // "operaciones", "administracion", "ventas", "tecnologia"
    location: v.string(),
    type: v.string(), // "full-time", "part-time", "contract"
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    salary_range: v.optional(v.string()),
    is_remote: v.optional(v.boolean()),
    is_active: v.boolean(),
    published_at: v.optional(v.number()),
    expires_at: v.optional(v.number()),
  })
    .index('by_slug', ['slug'])
    .index('by_department', ['department'])
    .index('by_is_active', ['is_active']),

  career_benefits: defineTable({
    title: v.string(),
    icon: v.optional(v.string()),
    description: v.string(),
    order: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  }).index('by_order', ['order']),

  // === SEO METADATA TABLE ===

  seo_metadata: defineTable({
    page_slug: v.string(),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.array(v.string())),
    og_image: v.optional(v.string()),
    canonical_url: v.optional(v.string()),
    is_active: v.boolean(),
  })
    .index('by_page_slug', ['page_slug'])
    .index('by_is_active', ['is_active']),

  // === REDIRECTS TABLE ===

  redirects: defineTable({
    source_url: v.string(),
    target_url: v.string(),
    status_code: v.union(v.literal(301), v.literal(302)),
    is_active: v.boolean(),
  })
    .index('by_source_url', ['source_url'])
    .index('by_is_active', ['is_active']),
});
