import { query } from './_generated/server';
import { v } from 'convex/values';

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
