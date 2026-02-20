/**
 * Service Locations - SEO Page Cross-Reference
 * 
 * Links services to communes for programmatic SEO pages.
 */

import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Top 15 comunas for SEO (matching .sisyphus/drafts/comuna-keywords.csv)
const TOP_COMUNAS = [
  { slug: 'las-condes', name: 'Las Condes' },
  { slug: 'santiago-centro', name: 'Santiago Centro' },
  { slug: 'providencia', name: 'Providencia' },
  { slug: 'la-florida', name: 'La Florida' },
  { slug: 'maipu', name: 'Maipú' },
  { slug: 'nunoa', name: 'Ñuñoa' },
  { slug: 'vitacura', name: 'Vitacura' },
  { slug: 'san-bernardo', name: 'San Bernardo' },
  { slug: 'penalolen', name: 'Peñalolén' },
  { slug: 'pudahuel', name: 'Pudahuel' },
  { slug: 'quilicura', name: 'Quilicura' },
  { slug: 'quinde', name: 'Quinde' },
  { slug: 'san-miguel', name: 'San Miguel' },
  { slug: 'la-reina', name: 'La Reina' },
  { slug: 'cerro-navia', name: 'Cerro Navia' },
];

// Queries

export const getServiceLocations = query({
  args: {
    serviceSlug: v.optional(v.string()),
    communeSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('service_locations');
    
    if (args.serviceSlug && args.communeSlug) {
      return await query
        .withIndex('by_service_commune', (q) => 
          q.eq('service_slug', args.serviceSlug!).eq('commune_slug', args.communeSlug!)
        )
        .collect();
    }
    
    if (args.serviceSlug) {
      return await query
        .withIndex('by_service', (q) => q.eq('service_slug', args.serviceSlug!))
        .collect();
    }
    
    if (args.communeSlug) {
      return await query
        .withIndex('by_commune', (q) => q.eq('commune_slug', args.communeSlug!))
        .collect();
    }
    
    return await query.collect();
  },
});

export const getServiceLocation = query({
  args: {
    serviceSlug: v.string(),
    communeSlug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('service_locations')
      .withIndex('by_service_commune', (q) => 
        q.eq('service_slug', args.serviceSlug).eq('commune_slug', args.communeSlug)
      )
      .first();
  },
});

// Mutations

export const createServiceLocation = mutation({
  args: {
    service_slug: v.string(),
    commune_slug: v.string(),
    meta_title: v.string(),
    meta_description: v.string(),
    intro_content: v.optional(v.string()),
    is_active: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query('service_locations')
      .withIndex('by_service_commune', (q) => 
        q.eq('service_slug', args.service_slug).eq('commune_slug', args.commune_slug)
      )
      .first();
    
    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    
    // Create new
    return await ctx.db.insert('service_locations', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateServiceLocation = mutation({
  args: {
    id: v.id('service_locations'),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    intro_content: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...cleanUpdates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const deleteServiceLocation = mutation({
  args: { id: v.id('service_locations') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed function to create all 90 pages (6 services × 15 comunas)
export const seedServiceLocations = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all active services
    const services = await ctx.db
      .query('services')
      .filter((q) => q.eq(q.field('is_active'), true))
      .collect();
    
    let created = 0;
    let skipped = 0;
    
    for (const service of services) {
      for (const commune of TOP_COMUNAS) {
        // Check if exists
        const existing = await ctx.db
          .query('service_locations')
          .withIndex('by_service_commune', (q) => 
            q.eq('service_slug', service.slug).eq('commune_slug', commune.slug)
          )
          .first();
        
        if (existing) {
          skipped++;
          continue;
        }
        
        // Generate meta title/description
        const metaTitle = `${service.title} en ${commune.name} | Guardman Chile`;
        const metaDescription = `Contrata ${service.title.toLowerCase()} en ${commune.name}. ${service.description?.slice(0, 80)}...`;
        
        await ctx.db.insert('service_locations', {
          service_slug: service.slug,
          commune_slug: commune.slug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          intro_content: '', // Empty for now - AI generation task
          is_active: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        
        created++;
      }
    }
    
    return { created, skipped, totalServices: services.length, totalComunas: TOP_COMUNAS.length };
  },
});
