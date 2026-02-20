/**
 * Users queries for Convex Auth
 * 
 * Provides the currentUser query used by the frontend to get authenticated user info.
 */

import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const createAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (existing) {
      // Update role if exists
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: args.role ?? "user",
      });
      return existing._id;
    }
    
    // Create new user
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role ?? "user",
    });
  },
});
