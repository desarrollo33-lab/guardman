import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Match validators from schema.ts
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
  v.literal('content_rich'),
  v.literal('image_gallery'),
  v.literal('video_section'),
  v.literal('guardpod_feature')
);

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
  services: v.optional(v.array(v.string())),
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
  video_id: v.optional(v.string()),
  autoplay: v.optional(v.boolean()),
  muted: v.optional(v.boolean()),
});

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

export const getAll = query({
    handler: async (ctx) => {
        return await ctx.db.query('content_blocks').collect();
    },
});

export const getContentBlockById = query({
    args: { id: v.id('content_blocks') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByPage = query({
    args: { page_slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('content_blocks')
            .withIndex('by_page_order', (q) => q.eq('page_slug', args.page_slug))
            .collect();
    },
});

// === CRUD MUTATIONS ===

export const createContentBlock = mutation({
    args: {
        page_slug: v.string(),
        type: contentBlockTypes,
        order: v.number(),
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        content: v.optional(v.string()),
        data: v.optional(contentBlockData),
        is_visible: v.boolean(),
        is_active: v.optional(v.boolean()),
    },
    returns: v.id('content_blocks'),
    handler: async (ctx, args) => {
        return await ctx.db.insert('content_blocks', {
            ...args,
            is_active: args.is_active ?? true,
        });
    },
});

export const updateContentBlock = mutation({
    args: {
        id: v.id('content_blocks'),
        page_slug: v.optional(v.string()),
        type: v.optional(contentBlockTypes),
        order: v.optional(v.number()),
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        content: v.optional(v.string()),
        data: v.optional(contentBlockData),
        is_visible: v.optional(v.boolean()),
        is_active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined)
        );
        await ctx.db.patch(id, cleanUpdates);
    },
});

export const deleteContentBlock = mutation({
    args: { id: v.id('content_blocks') },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
