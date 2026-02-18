import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// === QUERIES ===

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('communes').collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('communes')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

// === CRUD MUTATIONS ===

export const createCommune = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    zone: v.optional(v.string()),
    isOtherCity: v.optional(v.boolean()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    hero_title: v.optional(v.string()),
    hero_subtitle: v.optional(v.string()),
    intro_content: v.optional(v.string()),
  },
  returns: v.id('communes'),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('communes')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (existing) throw new Error('Commune with this slug already exists');

    return await ctx.db.insert('communes', args);
  },
});

export const updateCommune = mutation({
  args: {
    id: v.id('communes'),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    zone: v.optional(v.string()),
    isOtherCity: v.optional(v.boolean()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    hero_title: v.optional(v.string()),
    hero_subtitle: v.optional(v.string()),
    intro_content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const updateCommuneSEO = mutation({
  args: {
    id: v.id('communes'),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    hero_title: v.optional(v.string()),
    hero_subtitle: v.optional(v.string()),
    intro_content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...seoFields } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(seoFields).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteCommune = mutation({
  args: { id: v.id('communes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderCommunes = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('communes'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Note: communes table doesn't have an order field currently
    // This mutation is a placeholder for future ordering functionality
    // Can be extended when order field is added to schema
    for (const item of args.orders) {
      // Reserved for future implementation
    }
  },
});
