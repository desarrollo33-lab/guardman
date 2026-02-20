import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const page = await ctx.db
            .query('pages')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .first();
        return page;
    },
});

export const getPageById = query({
    args: { id: v.id('pages') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query('pages').collect();
  },
});

// === CRUD MUTATIONS ===

export const createPage = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    seo_title: v.string(),
    seo_description: v.string(),
    seo_keywords: v.optional(v.array(v.string())),
    og_image: v.optional(v.string()),
    is_published: v.boolean(),
    is_active: v.optional(v.boolean()),
  },
  returns: v.id('pages'),
  handler: async (ctx, args) => {
    // Check slug uniqueness
    const existing = await ctx.db
      .query('pages')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (existing) throw new Error('Page with this slug already exists');

    return await ctx.db.insert('pages', {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updatePage = mutation({
  args: {
    id: v.id('pages'),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    seo_title: v.optional(v.string()),
    seo_description: v.optional(v.string()),
    seo_keywords: v.optional(v.array(v.string())),
    og_image: v.optional(v.string()),
    is_published: v.optional(v.boolean()),
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

export const deletePage = mutation({
  args: { id: v.id('pages') },
  handler: async (ctx, args) => {
    // Soft delete - set is_active to false
    await ctx.db.patch(args.id, { is_active: false });
  },
});
