import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// === QUERIES ===

export const getAllPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query('blog_posts').collect();
  },
});

export const getPostById = query({
  args: { id: v.id('blog_posts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPublishedPosts = query({
  handler: async (ctx) => {
    const allPosts = await ctx.db.query('blog_posts').collect();
    return allPosts.filter((post) => post.is_published === true);
  },
});

export const getPostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('blog_posts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

export const getFeaturedPosts = query({
  handler: async (ctx) => {
    const allPosts = await ctx.db.query('blog_posts').collect();
    return allPosts.filter(
      (post) => post.is_featured === true && post.is_published === true
    );
  },
});

// === MUTATIONS ===

export const createPost = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    cover_image: v.string(),
    author: v.string(),
    author_id: v.optional(v.id('authors')),
    published_at: v.number(),
    read_time: v.number(),
    tags: v.array(v.string()),
    is_featured: v.boolean(),
    is_published: v.optional(v.boolean()),
    content: v.array(
      v.object({
        type: v.string(),
        content: v.string(),
        alt: v.optional(v.string()),
        caption: v.optional(v.string()),
        items: v.optional(v.array(v.string())),
      })
    ),
  },
  returns: v.id('blog_posts'),
  handler: async (ctx, args) => {
    // Check slug uniqueness
    const existing = await ctx.db
      .query('blog_posts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (existing) {
      throw new Error('Post with this slug already exists');
    }

    return await ctx.db.insert('blog_posts', {
      ...args,
      is_published: args.is_published ?? false,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id('blog_posts'),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    cover_image: v.optional(v.string()),
    author: v.optional(v.string()),
    author_id: v.optional(v.id('authors')),
    published_at: v.optional(v.number()),
    read_time: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    is_featured: v.optional(v.boolean()),
    is_published: v.optional(v.boolean()),
    content: v.optional(
      v.array(
        v.object({
          type: v.string(),
          content: v.string(),
          alt: v.optional(v.string()),
          caption: v.optional(v.string()),
          items: v.optional(v.array(v.string())),
        })
      )
    ),
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

export const deletePost = mutation({
  args: { id: v.id('blog_posts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const publishPost = mutation({
  args: { id: v.id('blog_posts') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      is_published: true,
      published_at: Date.now(),
    });
    return await ctx.db.get(args.id);
  },
});

export const unpublishPost = mutation({
  args: { id: v.id('blog_posts') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      is_published: false,
    });
    return await ctx.db.get(args.id);
  },
});
