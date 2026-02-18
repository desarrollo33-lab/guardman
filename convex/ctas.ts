import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// === QUERIES ===

export const getAllCtas = query({
  handler: async (ctx) => {
    return await ctx.db.query('ctas').collect();
  },
});

export const getCtaByPage = query({
  args: { page_slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('ctas')
      .withIndex('by_page_slug', (q) => q.eq('page_slug', args.page_slug))
      .first();
  },
});

// === CRUD MUTATIONS ===

export const createCta = mutation({
  args: {
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
  },
  returns: v.id('ctas'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('ctas', args);
  },
});

export const updateCta = mutation({
  args: {
    id: v.id('ctas'),
    page_slug: v.optional(v.string()),
    headline: v.optional(v.string()),
    subheadline: v.optional(v.string()),
    buttons: v.optional(
      v.array(
        v.object({
          text: v.string(),
          href: v.string(),
          variant: v.optional(v.string()),
        })
      )
    ),
    badges: v.optional(v.array(v.string())),
    background_type: v.optional(
      v.union(v.literal('image'), v.literal('gradient'))
    ),
    background_value: v.optional(v.string()),
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

export const deleteCta = mutation({
  args: { id: v.id('ctas') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
