import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Queries

export const getAllCompanyValues = query({
  handler: async (ctx) => {
    return await ctx.db.query('company_values').withIndex('by_order').collect();
  },
});

// Mutations

export const createCompanyValue = mutation({
  args: {
    title: v.string(),
    icon: v.optional(v.string()),
    description: v.string(),
    order: v.number(),
  },
  returns: v.id('company_values'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('company_values', args);
  },
});

export const updateCompanyValue = mutation({
  args: {
    id: v.id('company_values'),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
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

export const deleteCompanyValue = mutation({
  args: { id: v.id('company_values') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderCompanyValues = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('company_values'),
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
