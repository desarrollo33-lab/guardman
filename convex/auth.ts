import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    // Link new auth accounts to existing users by email
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }

      // Check if user with this email already exists
      const existingUser = await ctx.db
        .query('users')
        .filter((q) => q.eq(q.field('email'), args.profile.email))
        .first();

      if (existingUser) {
        return existingUser._id;
      }

      // Create new user if doesn't exist
      return ctx.db.insert('users', {
        email: args.profile.email,
        name: args.profile.name,
        role: 'user',
      });
    },
  },
});
