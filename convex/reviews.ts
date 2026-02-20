/**
 * Reviews - Customer reviews for SEO pages
 * 
 * Stores reviews that can be associated with services and/or communes.
 */

import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Queries

export const getAllReviews = query({
  args: {
    serviceSlug: v.optional(v.string()),
    communeSlug: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db.query('reviews').collect();
    
    // Filter by service_slug if specified
    if (args.serviceSlug) {
      results = results.filter(r => r.service_slug === args.serviceSlug);
    }
    
    // Filter by commune_slug if specified
    if (args.communeSlug) {
      results = results.filter(r => r.commune_slug === args.communeSlug);
    }
    
    // Filter by is_active if specified
    if (args.isActive !== undefined) {
      results = results.filter(r => r.is_active === args.isActive);
    }
    
    // Filter by is_featured if specified
    if (args.isFeatured !== undefined) {
      results = results.filter(r => r.is_featured === args.isFeatured);
    }
    
    // Sort by rating descending, then by createdAt descending
    results.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    // Apply limit
    if (args.limit) {
      results = results.slice(0, args.limit);
    }
    
    return results;
  },
});

export const getReviewById = query({
  args: { id: v.id('reviews') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAverageRating = query({
  args: {
    serviceSlug: v.optional(v.string()),
    communeSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('reviews').filter((q) => q.eq(q.field('is_active'), true));
    
    const results = await q.collect();
    
    const filtered = results.filter(r => {
      if (args.serviceSlug && r.service_slug !== args.serviceSlug) return false;
      if (args.communeSlug && r.commune_slug !== args.communeSlug) return false;
      return true;
    });
    
    if (filtered.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: sum / filtered.length,
      count: filtered.length,
    };
  },
});

// Mutations

export const createReview = mutation({
  args: {
    service_slug: v.optional(v.string()),
    commune_slug: v.optional(v.string()),
    author_name: v.string(),
    author_role: v.optional(v.string()),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.string(),
    is_verified: v.optional(v.boolean()),
    is_featured: v.optional(v.boolean()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    return await ctx.db.insert('reviews', {
      ...args,
      is_active: args.is_active ?? true,
      is_verified: args.is_verified ?? false,
      is_featured: args.is_featured ?? false,
      createdAt: Date.now(),
    });
  },
});

export const updateReview = mutation({
  args: {
    id: v.id('reviews'),
    service_slug: v.optional(v.string()),
    commune_slug: v.optional(v.string()),
    author_name: v.optional(v.string()),
    author_role: v.optional(v.string()),
    rating: v.optional(v.number()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    is_verified: v.optional(v.boolean()),
    is_featured: v.optional(v.boolean()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Validate rating if provided
    if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteReview = mutation({
  args: { id: v.id('reviews') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
