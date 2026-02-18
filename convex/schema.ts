import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

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
  })
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  services: defineTable({
    id: v.optional(v.string()),
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
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
    order: v.optional(v.number()),
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
  })
    .index('by_slug', ['slug'])
    .index('by_zone', ['zone'])
    .index('by_isOtherCity', ['isOtherCity']),

  solutions: defineTable({
    id: v.optional(v.string()),
    slug: v.string(),
    title: v.optional(v.string()), // Changed from name to title for consistency
    name: v.optional(v.string()), // Legacy field
    description: v.string(),
    icon: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    cta: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    og_image: v.optional(v.string()),
    solutions: v.optional(v.array(v.string())),
    image: v.optional(v.string()),
    challenges: v.optional(v.array(v.string())),
    relatedServices: v.optional(v.array(v.string())),
    is_active: v.optional(v.boolean()),
    order: v.optional(v.number()),
  })
    .index('by_slug', ['slug'])
    .index('by_solutions', ['solutions']),

  faqs: defineTable({
    id: v.optional(v.string()),
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
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
        href: v.optional(v.string()), // Changed from path to href
        path: v.optional(v.string()), // Legacy field
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
    footer_config: v.optional(v.any()), // JSON structured footer columns
  }).index('by_active', ['is_active']),

  pages: defineTable({
    slug: v.string(), // e.g. "/", "/servicios", "/contacto"
    title: v.string(), // Internal name
    seo_title: v.string(),
    seo_description: v.string(),
    seo_keywords: v.optional(v.array(v.string())),
    og_image: v.optional(v.string()),
    is_published: v.boolean(),
  }).index('by_slug', ['slug']),

  content_blocks: defineTable({
    page_slug: v.string(), // Foreign key to pages.slug
    type: v.string(), // e.g. "hero_ajax", "services_grid", "cta_dual"
    order: v.number(), // Render order
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    content: v.optional(v.string()), // Markdown or HTML body
    data: v.any(), // Flexible JSON for component-specific props (images, CTAs, specific IDs)
    is_visible: v.boolean(),
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
  }).index('by_type', ['type']),

  blog_posts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    cover_image: v.string(),
    author: v.string(),
    author_id: v.optional(v.string()),
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
  }).index('by_slug', ['slug']),

  // --- FILE STORAGE ---

  files: defineTable({
    storageId: v.id('_storage'),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.optional(v.string()), // User ID when auth is ready
    createdAt: v.number(),
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
  }).index('by_order', ['order']),

  process_steps: defineTable({
    page_slug: v.string(),
    number: v.number(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  }).index('by_page_slug', ['page_slug']),

  stats: defineTable({
    page_slug: v.string(),
    value: v.string(), // "500+", "15+"
    label: v.string(), // "Clientes", "Años"
    icon: v.optional(v.string()),
    order: v.number(),
  }).index('by_page_slug', ['page_slug']),

  industries: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
    // Allow legacy fields during migration
    id: v.optional(v.string()),
    challenges: v.optional(v.any()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    relatedServices: v.optional(v.any()),
    solutions: v.optional(v.any()),
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
  }).index('by_page_slug', ['page_slug']),

  authors: defineTable({
    name: v.string(),
    slug: v.string(),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
  }).index('by_slug', ['slug']),
});
