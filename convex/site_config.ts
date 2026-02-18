import { query } from './_generated/server';

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('site_config')
            .filter((q) => q.eq(q.field('is_active'), true))
            .first();
    },
});
