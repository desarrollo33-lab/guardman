import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// === QUERIES ===

export const getAllHeroes = query({
  handler: async (ctx) => {
    return await ctx.db.query('heroes').collect();
  },
});

export const getHeroById = query({
  args: { id: v.id('heroes') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getHeroByPage = query({
  args: { page_slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('heroes')
      .withIndex('by_page_slug', (q) => q.eq('page_slug', args.page_slug))
      .filter((q) => q.eq(q.field('is_active'), true))
      .first();
  },
});

export const getActiveHeroes = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('heroes')
      .filter((q) => q.eq(q.field('is_active'), true))
      .collect();
  },
});

// === CRUD MUTATIONS ===

export const createHero = mutation({
  args: {
    page_slug: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    background_type: v.union(v.literal('youtube'), v.literal('image')),
    youtube_id: v.optional(v.string()),
    image_url: v.optional(v.string()),
    mobile_image_url: v.optional(v.string()),
    ctas: v.optional(
      v.array(
        v.object({
          text: v.string(),
          href: v.string(),
          variant: v.optional(v.string()),
        })
      )
    ),
    badges: v.optional(
      v.array(
        v.object({
          text: v.string(),
          icon: v.optional(v.string()),
        })
      )
    ),
    is_active: v.optional(v.boolean()),
  },
  returns: v.id('heroes'),
  handler: async (ctx, args) => {
    // Validate: youtube_id required if youtube type
    if (args.background_type === 'youtube' && !args.youtube_id) {
      throw new Error('youtube_id is required for youtube background type');
    }
    // Validate: image_url required if image type
    if (args.background_type === 'image' && !args.image_url) {
      throw new Error('image_url is required for image background type');
    }

    return await ctx.db.insert('heroes', {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateHero = mutation({
  args: {
    id: v.id('heroes'),
    page_slug: v.optional(v.string()),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    background_type: v.optional(
      v.union(v.literal('youtube'), v.literal('image'))
    ),
    youtube_id: v.optional(v.string()),
    image_url: v.optional(v.string()),
    mobile_image_url: v.optional(v.string()),
    ctas: v.optional(
      v.array(
        v.object({
          text: v.string(),
          href: v.string(),
          variant: v.optional(v.string()),
        })
      )
    ),
    badges: v.optional(
      v.array(
        v.object({
          text: v.string(),
          icon: v.optional(v.string()),
        })
      )
    ),
    is_active: v.optional(v.boolean()),
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

export const deleteHero = mutation({
  args: { id: v.id('heroes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
