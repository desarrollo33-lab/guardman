import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// === QUERIES ===

export const getAllAuthors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('authors').collect();
  },
});

export const getAuthorBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('authors')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

// === CRUD MUTATIONS ===

export const createAuthor = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  returns: v.id('authors'),
  handler: async (ctx, args) => {
    // Check slug uniqueness
    const existing = await ctx.db
      .query('authors')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (existing) {
      throw new Error('Author with this slug already exists');
    }

    return await ctx.db.insert('authors', args);
  },
});

export const updateAuthor = mutation({
  args: {
    id: v.id('authors'),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Check slug uniqueness if updating slug
    if (updates.slug) {
      const existing = await ctx.db
        .query('authors')
        .withIndex('by_slug', (q) => q.eq('slug', updates.slug!))
        .first();
      if (existing && existing._id !== id) {
        throw new Error('Author with this slug already exists');
      }
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteAuthor = mutation({
  args: { id: v.id('authors') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
