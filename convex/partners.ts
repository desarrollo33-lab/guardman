import { query } from './_generated/server';
import { v } from 'convex/values';

export const getByType = query({
    args: { type: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('partners')
            .withIndex('by_type', (q) => q.eq('type', args.type))
            .collect();
    }
});
