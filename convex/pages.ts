import { query } from './_generated/server';
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
