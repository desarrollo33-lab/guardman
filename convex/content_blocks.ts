import { query } from './_generated/server';
import { v } from 'convex/values';

export const getByPage = query({
    args: { page_slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('content_blocks')
            .withIndex('by_page_order', (q) => q.eq('page_slug', args.page_slug))
            .collect();
    },
});
