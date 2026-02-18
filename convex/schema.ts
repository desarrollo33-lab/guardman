import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
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
    id: v.string(),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    tagline: v.string(),
    icon: v.string(),
    features: v.array(v.string()),
    benefits: v.array(v.string()),
    cta: v.string(),
    industries: v.optional(v.array(v.string())),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    og_image: v.optional(v.string()),
    solutions: v.optional(v.array(v.string())),
  })
    .index('by_slug', ['slug'])
    .index('by_solutions', ['solutions']),

  communes: defineTable({
    name: v.string(),
    slug: v.string(),
    zone: v.optional(v.string()),
    isOtherCity: v.optional(v.boolean()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
  })
    .index('by_slug', ['slug'])
    .index('by_zone', ['zone'])
    .index('by_isOtherCity', ['isOtherCity']),

  solutions: defineTable({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    challenges: v.array(v.string()),
    solutions: v.optional(v.array(v.string())),
    relatedServices: v.optional(v.array(v.string())),
  })
    .index('by_slug', ['slug']),

  faqs: defineTable({
    id: v.string(),
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_order', ['order']),
});
