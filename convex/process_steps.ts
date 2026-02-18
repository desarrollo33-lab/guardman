import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Queries

export const getByPage = query({
  args: {
    page_slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('process_steps')
      .withIndex('by_page_slug', (q) => q.eq('page_slug', args.page_slug))
      .order('asc')
      .collect();
  },
});

export const getAllProcessSteps = query({
  handler: async (ctx) => {
    return await ctx.db.query('process_steps').order('asc').collect();
  },
});

// Mutations

export const createProcessStep = mutation({
  args: {
    page_slug: v.string(),
    number: v.number(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  },
  returns: v.id('process_steps'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('process_steps', args);
  },
});

export const updateProcessStep = mutation({
  args: {
    id: v.id('process_steps'),
    page_slug: v.optional(v.string()),
    number: v.optional(v.number()),
    title: v.optional(v.string()),
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

export const deleteProcessStep = mutation({
  args: { id: v.id('process_steps') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
