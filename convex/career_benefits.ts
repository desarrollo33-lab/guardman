/**
 * Career Benefits - Employee benefits showcase
 * 
 * Displays benefits on the careers page.
 */

import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Queries

export const getAllBenefits = query({
  args: {
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results;
    
    if (args.isActive !== undefined) {
      results = await ctx.db
        .query('career_benefits')
        .filter((q) => q.eq(q.field('is_active'), args.isActive))
        .collect();
    } else {
      results = await ctx.db.query('career_benefits').collect();
    }
    
    // Sort by order
    results.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return results;
  },
});

export const getBenefitById = query({
  args: { id: v.id('career_benefits') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutations

export const createBenefit = mutation({
  args: {
    title: v.string(),
    icon: v.optional(v.string()),
    description: v.string(),
    order: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('career_benefits', {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateBenefit = mutation({
  args: {
    id: v.id('career_benefits'),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
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

export const deleteBenefit = mutation({
  args: { id: v.id('career_benefits') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed default benefits
export const seedBenefits = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('career_benefits').collect();
    if (existing.length > 0) {
      return { skipped: true, message: 'Benefits already exist' };
    }
    
    const defaultBenefits = [
      { title: 'Seguro de Vida', icon: 'shield', description: 'Cobertura completa para ti y tu familia', order: 1 },
      { title: 'Previsión de Salud', icon: 'heart', description: 'Plan de salud integral con topes preferenciales', order: 2 },
      { title: 'Bono de Antigüedad', icon: 'award', description: 'Incremento salarial por años de servicio', order: 3 },
      { title: 'Uniformes y Equipamiento', icon: 'shirt', description: 'Todo el equipo de trabajo incluido', order: 4 },
      { title: 'Capacitación Continua', icon: 'graduation-cap', description: 'Cursos de formación y desarrollo profesional', order: 5 },
      { title: 'Días de Permiso', icon: 'calendar', description: 'Licencias remuneradas y días de descanso', order: 6 },
      { title: 'Sistema de Escalafón', icon: 'trending-up', description: 'Plan de carrera y promoción interna', order: 7 },
      { title: 'Bonificaciones', icon: 'gift', description: 'Bonos por desempeño y metas cumplidas', order: 8 },
    ];
    
    const created = [];
    for (const benefit of defaultBenefits) {
      const id = await ctx.db.insert('career_benefits', {
        ...benefit,
        is_active: true,
      });
      created.push(id);
    }
    
    return { created: created.length };
  },
});
