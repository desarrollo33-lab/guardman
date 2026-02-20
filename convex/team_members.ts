import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getAllTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('team_members')
      .withIndex('by_order')
      .order('asc')
      .collect();
  },
});

export const getTeamMemberById = query({
  args: { id: v.id('team_members') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// === CRUD MUTATIONS ===

export const createTeamMember = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    order: v.number(),
    is_active: v.optional(v.boolean()),
  },
  returns: v.id('team_members'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('team_members', args);
  },
});

export const updateTeamMember = mutation({
  args: {
    id: v.id('team_members'),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    bio: v.optional(v.string()),
    order: v.optional(v.number()),
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

export const deleteTeamMember = mutation({
  args: { id: v.id('team_members') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderTeamMembers = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('team_members'),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});
