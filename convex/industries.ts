import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Queries

export const getAllIndustries = query({
  handler: async (ctx) => {
    return await ctx.db.query('industries').order('asc').collect();
  },
});

export const getActiveIndustries = query({
  handler: async (ctx) => {
    const all = await ctx.db.query('industries').collect();
    return all
      .filter((i) => i.is_active !== false)
      .sort((a, b) => a.order - b.order);
  },
});

export const getIndustryBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('industries')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

// Mutations

export const createIndustry = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  },
  returns: v.id('industries'),
  handler: async (ctx, args) => {
    // Check slug uniqueness
    const existing = await ctx.db
      .query('industries')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (existing) throw new Error('Industry with this slug already exists');

    return await ctx.db.insert('industries', {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateIndustry = mutation({
  args: {
    id: v.id('industries'),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteIndustry = mutation({
  args: { id: v.id('industries') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderIndustries = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('industries'),
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
