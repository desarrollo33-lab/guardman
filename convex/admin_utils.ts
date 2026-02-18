import { mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Promotes a user to 'admin' role by their email address.
 * Use this to grant administrative access to a registered user.
 */
export const promoteToAdminByEmail = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_email', (q) => q.eq('email', args.email))
            .first();

        if (!user) {
            throw new Error(`User with email ${args.email} not found.`);
        }

        await ctx.db.patch(user._id, { role: 'admin' });
        console.log(`✅ User ${args.email} promoted to admin.`);
        return { success: true, userId: user._id };
    },
});

/**
 * Creates a user directly in the users table and assigns the 'admin' role.
 * Note: This does not create an authentication account (password).
 * The user will still need to sign up via the UI to set their password,
 * or this record will be matched if they use the same email.
 */
export const createAdminUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('users')
            .withIndex('by_email', (q) => q.eq('email', args.email))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { role: 'admin', name: args.name });
            return { id: existing._id, status: 'updated' };
        }

        const userId = await ctx.db.insert('users', {
            name: args.name,
            email: args.email,
            role: 'admin',
        });

        return { id: userId, status: 'created' };
    },
});
