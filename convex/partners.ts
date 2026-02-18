import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('partners')
      .withIndex('by_type')
      .order('asc')
      .collect();
  },
});

export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('partners')
      .withIndex('by_type', (q) => q.eq('type', args.type))
      .order('asc') // Assuming insertion order or add order field sort
      .collect();
  },
});

// === CRUD MUTATIONS ===

export const createPartner = mutation({
  args: {
    name: v.string(),
    logo_url: v.string(),
    type: v.string(), // "certification", "client", "tech_partner"
    url: v.optional(v.string()),
    order: v.number(),
    quote: v.optional(v.string()),
    industry: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  returns: v.id('partners'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('partners', args);
  },
});

export const updatePartner = mutation({
  args: {
    id: v.id('partners'),
    name: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    type: v.optional(v.string()),
    url: v.optional(v.string()),
    order: v.optional(v.number()),
    quote: v.optional(v.string()),
    industry: v.optional(v.string()),
    icon: v.optional(v.string()),
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

export const deletePartner = mutation({
  args: { id: v.id('partners') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderPartners = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('partners'),
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
