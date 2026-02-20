import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// === QUERIES ===

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('testimonials')
      .withIndex('by_order')
      .order('asc')
      .collect();
  },
});

export const getTestimonialById = query({
  args: { id: v.id('testimonials') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// === CRUD MUTATIONS ===

export const createTestimonial = mutation({
  args: {
    author: v.string(),
    role: v.optional(v.string()),
    company: v.optional(v.string()),
    quote: v.string(),
    rating: v.number(),
    image_url: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  returns: v.id('testimonials'),
  handler: async (ctx, args) => {
    // Rating validation (1-5 range)
    if (args.rating < 1 || args.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return await ctx.db.insert('testimonials', {
      author: args.author,
      role: args.role,
      company: args.company,
      quote: args.quote,
      rating: args.rating,
      image_url: args.image_url,
      verified: args.verified ?? false,
      order: args.order,
    });
  },
});

export const updateTestimonial = mutation({
  args: {
    id: v.id('testimonials'),
    author: v.optional(v.string()),
    role: v.optional(v.string()),
    company: v.optional(v.string()),
    quote: v.optional(v.string()),
    rating: v.optional(v.number()),
    image_url: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Rating validation (1-5 range) if rating is being updated
    if (
      updates.rating !== undefined &&
      (updates.rating < 1 || updates.rating > 5)
    ) {
      throw new Error('Rating must be between 1 and 5');
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteTestimonial = mutation({
  args: { id: v.id('testimonials') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderTestimonials = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('testimonials'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});
