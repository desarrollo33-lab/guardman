/**
 * Careers - Job listings
 * 
 * Manages job postings for Guardman's career page.
 */

import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Queries

export const getAllCareers = query({
  args: {
    department: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results;
    
    if (args.department) {
      results = await ctx.db
        .query('careers')
        .withIndex('by_department', (q) => q.eq('department', args.department!))
        .collect();
    } else if (args.isActive !== undefined) {
      results = await ctx.db
        .query('careers')
        .withIndex('by_is_active', (q) => q.eq('is_active', args.isActive!))
        .collect();
    } else {
      results = await ctx.db.query('careers').collect();
    }
    
    // Sort by published_at descending, then by title
    results.sort((a, b) => {
      const aTime = a.published_at || 0;
      const bTime = b.published_at || 0;
      if (bTime !== aTime) return bTime - aTime;
      return a.title.localeCompare(b.title);
    });
    
    return results;
  },
});

export const getCareerById = query({
  args: { id: v.id('careers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCareerBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('careers')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

export const getActiveCareersCount = query({
  handler: async (ctx) => {
    const results = await ctx.db
      .query('careers')
      .withIndex('by_is_active', (q) => q.eq('is_active', true))
      .collect();
    return results.length;
  },
});

// Mutations

export const createCareer = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    department: v.string(),
    location: v.string(),
    type: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    salary_range: v.optional(v.string()),
    is_remote: v.optional(v.boolean()),
    is_active: v.boolean(),
    published_at: v.optional(v.number()),
    expires_at: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query('careers')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    
    if (existing) {
      throw new Error('A career with this slug already exists');
    }
    
    return await ctx.db.insert('careers', {
      ...args,
      published_at: args.published_at ?? Date.now(),
    });
  },
});

export const updateCareer = mutation({
  args: {
    id: v.id('careers'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    department: v.optional(v.string()),
    location: v.optional(v.string()),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    responsibilities: v.optional(v.array(v.string())),
    salary_range: v.optional(v.string()),
    is_remote: v.optional(v.boolean()),
    is_active: v.optional(v.boolean()),
    published_at: v.optional(v.number()),
    expires_at: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check slug uniqueness if being updated
    if (updates.slug) {
      const existing = await ctx.db
        .query('careers')
        .withIndex('by_slug', (q) => q.eq('slug', updates.slug!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error('A career with this slug already exists');
      }
    }
    
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteCareer = mutation({
  args: { id: v.id('careers') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed default careers
export const seedCareers = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('careers').collect();
    if (existing.length > 0) {
      return { skipped: true, message: 'Careers already exist' };
    }
    
    const defaultCareers = [
      {
        title: 'Jefe de Operaciones de Seguridad',
        slug: 'jefe-operaciones-seguridad',
        department: 'operaciones',
        location: 'Santiago Centro',
        type: 'full-time',
        description: 'Lidera y coordina equipos de seguridad en terreno, asegurando la excelencia operativa.',
        requirements: ['Experiencia mínima 5 años en seguridad', 'Estudios relacionados ( deseable)', 'Licencia de conducir vigente', 'Excelentes habilidades de liderazgo'],
        responsibilities: ['Coordinar equipos de vigilantes', 'Gestionar incidencias', 'Reportes de productividad', 'Capacitación de personal'],
        salary_range: '$1.500.000 - $2.000.000',
        is_remote: false,
        is_active: true,
      },
      {
        title: 'Vigilante de Seguridad',
        slug: 'vigilante-seguridad',
        department: 'operaciones',
        location: 'Santiago',
        type: 'full-time',
        description: 'Brinda servicios de vigilancia y seguridad en instalaciones comerciales y residenciales.',
        requirements: ['Curso de Vigilante vigente', 'Carnet de identidad vigente', 'Disponibilidad para turnos rotativos', 'Sin antecedentes'],
        responsibilities: ['Control de acceso', 'Rondas de vigilancia', 'Reportes de incidentes', 'Atención al cliente'],
        salary_range: '$500.000 - $700.000',
        is_remote: false,
        is_active: true,
      },
      {
        title: 'Ejecutivo de Ventas',
        slug: 'ejecutivo-ventas',
        department: 'ventas',
        location: 'Santiago Centro',
        type: 'full-time',
        description: 'Prospecta y cierra nuevos clientes para servicios de seguridad empresarial.',
        requirements: ['Experiencia en ventas B2B', 'Excelentes habilidades de comunicación', 'Conocimientos de CRM', 'Licencia de conducir'],
        responsibilities: ['Prospección de clientes', 'Presentaciones comerciales', 'Seguimiento de oportunidades', 'Cumplimiento de metas'],
        salary_range: '$800.000 + comisiones',
        is_remote: false,
        is_active: true,
      },
      {
        title: 'Administrativo Contable',
        slug: 'administrativo-contable',
        department: 'administracion',
        location: 'Santiago Centro',
        type: 'full-time',
        description: 'Gestiona procesos contables y administrativos de la empresa.',
        requirements: ['Técnico o profesional en contabilidad', 'Experiencia en roles similares', 'Manejo de Excel avanzado', 'Conocimiento de normativas laborales'],
        responsibilities: ['Gestión de facturación', 'Control de proveedores', 'Nóminas', 'Reportes contables'],
        salary_range: '$700.000 - $1.000.000',
        is_remote: false,
        is_active: true,
      },
    ];
    
    const created = [];
    for (const career of defaultCareers) {
      const id = await ctx.db.insert('careers', {
        ...career,
        published_at: Date.now(),
      });
      created.push(id);
    }
    
    return { created: created.length, careers: defaultCareers.map(c => c.title) };
  },
});
