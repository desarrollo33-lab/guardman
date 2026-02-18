import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// === QUERIES ===

export const getAllStats = query({
  handler: async (ctx) => {
    return await ctx.db.query('stats').collect();
  },
});

export const getStatsByPage = query({
  args: { page_slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('stats')
      .withIndex('by_page_slug', (q) => q.eq('page_slug', args.page_slug))
      .order('asc')
      .collect();
  },
});

// === CRUD MUTATIONS ===

export const createStat = mutation({
  args: {
    page_slug: v.string(),
    value: v.string(),
    label: v.string(),
    icon: v.optional(v.string()),
    order: v.number(),
  },
  returns: v.id('stats'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('stats', args);
  },
});

export const updateStat = mutation({
  args: {
    id: v.id('stats'),
    page_slug: v.optional(v.string()),
    value: v.optional(v.string()),
    label: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
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

export const deleteStat = mutation({
  args: { id: v.id('stats') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderStats = mutation({
  args: {
    stats: v.array(
      v.object({
        id: v.id('stats'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const stat of args.stats) {
      await ctx.db.patch(stat.id, { order: stat.order });
    }
  },
});
