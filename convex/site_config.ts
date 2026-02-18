import { query } from './_generated/server';
import { v } from 'convex/values';

export const getActive = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db
            .query('site_config')
            .withIndex('by_active', (q) => q.eq('is_active', true))
            .first();
        return config;
    },
});
