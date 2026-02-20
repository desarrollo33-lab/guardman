import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Seed data — mirrors src/data/solutions.ts
const SOLUTIONS_SEED_DATA = [
  {
    id: 'condominios',
    slug: 'condominios',
    title: 'Condominios Residenciales',
    description:
      'Protección integral para comunidades residenciales. Guardias, patrullaje y alarmas diseñados para condominios.',
    icon: 'home',
    challenges: [
      'Robos a viviendas desocupadas',
      'Acceso no autorizado de vehículos',
      'Vandalismo en áreas comunes',
      'Conflictos entre residentes',
      'Falta de presupuesto para seguridad privada',
    ],
    solutions: [
      'Guardias OS10 en portería y rondas',
      'Patrullaje nocturno compartido',
      'Alarmas Ajax en casas y bodegas',
      'Control de acceso vehicular',
      'CCTV en áreas comunes',
    ],
    relatedServices: [
      'guardias-seguridad',
      'patrullaje-condominios',
      'alarmas-ajax',
    ],
    meta_title:
      'Seguridad para Condominios y Edificios Residenciales | Guardman',
    meta_description:
      'Protección integral para comunidades. Guardias OS10, control de acceso y tecnología de seguridad diseñada para condominios y edificios.',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mineria',
    slug: 'mineria',
    title: 'Minería e Industria',
    description:
      'Soluciones de seguridad para faenas mineras e industriales. Cumplimiento normativo SERNAGEOMIN y protección de activos.',
    icon: 'mountain',
    challenges: [
      'Robo de materiales y equipos',
      'Acceso no autorizado a faenas',
      'Seguridad del personal en turnos',
      'Cumplimiento normativo SERNAGEOMIN',
      'Vigilancia de grandes extensiones',
    ],
    solutions: [
      'Guardias certificados para minería',
      'GuardPod con baño y equipamiento',
      'Control de acceso biométrico',
      'Drones para vigilancia perimetral',
      'Monitoreo CCTV 24/7',
    ],
    relatedServices: [
      'guardias-seguridad',
      'guardpod',
      'control-acceso',
      'drones-seguridad',
    ],
    meta_title: 'Seguridad para Minería y Faenas Industriales | Guardman',
    meta_description:
      'Seguridad especializada para minería e industrias. Cumplimiento normativo, control de acceso y protección de activos críticos.',
    image:
      'https://images.unsplash.com/photo-1599829567931-18c738e4df5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'retail',
    slug: 'retail',
    title: 'Retail y Comercio',
    description:
      'Seguridad para tiendas, malls y centros comerciales. Prevención de pérdidas y protección de clientes.',
    icon: 'shopping-bag',
    challenges: [
      'Robo hormiga y hurto interno',
      'Falsos accidentes de clientes',
      'Movimiento de mercadería',
      'Horarios extendidos de operación',
      'Alto flujo de visitantes',
    ],
    solutions: [
      'Guardias de uniforme y civil',
      'Control de acceso para personal',
      'CCTV con análisis de video IA',
      'Alarmas Ajax antirrobo',
      'Protocolos de cierre y apertura',
    ],
    relatedServices: ['guardias-seguridad', 'control-acceso', 'alarmas-ajax'],
    meta_title: 'Seguridad para Retail, Malls y Comercio | Guardman',
    meta_description:
      'Prevención de pérdidas y seguridad para retail. Guardias, CCTV y alarmas para tiendas, supermercados y centros comerciales.',
    image:
      'https://images.unsplash.com/photo-1555465089-0ae6b7e80d46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'construccion',
    slug: 'construccion',
    title: 'Construcción y Obras',
    description:
      'Protección de obras en construcción. GuardPod, vigilancia perimetral y control de herramientas.',
    icon: 'hard-hat',
    challenges: [
      'Robo de herramientas y materiales',
      'Vandalismo en obras abandonadas',
      'Acceso de personas ajenas',
      'Responsabilidad por accidentes',
      'Faenas temporales sin infraestructura',
    ],
    solutions: [
      'GuardPod módulo de seguridad',
      'Guardias con portería móvil',
      'Alarmas perimetrales Ajax',
      'Control de acceso para contratistas',
      'Drones para vigilancia de obra',
    ],
    relatedServices: [
      'guardias-seguridad',
      'guardpod',
      'alarmas-ajax',
      'drones-seguridad',
    ],
    meta_title: 'Seguridad para Construcción y Obras | Guardman',
    meta_description:
      'Protección de obras y faenas de construcción. Módulos GuardPod, vigilancia perimetral y control de acceso para evitar robos.',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'hoteleria',
    slug: 'hoteleria',
    title: 'Hotelería y Turismo',
    description:
      'Seguridad para hoteles, resorts y centros turísticos. Experiencia premium sin comprometer la protección.',
    icon: 'bed',
    challenges: [
      'Robo de equipaje y pertenencias',
      'Acceso no autorizado a habitaciones',
      'Seguridad de huéspedes VIP',
      'Eventos masivos en instalaciones',
      'Balance seguridad vs experiencia',
    ],
    solutions: [
      'Guardias con formación en servicio',
      'Control de acceso discreto',
      'CCTV en pasillos y áreas comunes',
      'Alarmas Ajax en suites ejecutivas',
      'Protocolos para eventos',
    ],
    relatedServices: ['guardias-seguridad', 'control-acceso', 'alarmas-ajax'],
    meta_title: 'Seguridad para Hoteles y Turismo | Guardman',
    meta_description:
      'Seguridad hotelera y turística. Protección discreta para huéspedes, control de acceso y monitoreo 24/7 sin afectar la experiencia.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'inmobiliaria',
    slug: 'inmobiliaria',
    title: 'Inmobiliaria y Propiedades',
    description:
      'Seguridad para proyectos inmobiliarios, propiedades desocupadas y visitas guiadas. Protección de activos en venta y arriendo.',
    icon: 'home',
    challenges: [
      'Robo de propiedades desocupadas',
      'Acceso no autorizado a instalaciones',
      'Vandalismo en proyectos en venta',
      'Seguridad en visitas guiadas',
      'Protección de materiales de construcción',
    ],
    solutions: [
      'Guardias en proyectos inmobiliarios',
      'Alarmas Ajax en propiedades',
      'Control de acceso para visitas',
      'Monitoreo CCTV 24/7',
      'Patrullaje preventivo',
    ],
    relatedServices: ['guardias-seguridad', 'alarmas-ajax', 'control-acceso'],
    meta_title: 'Seguridad para Inmobiliarias y Propiedades | Guardman',
    meta_description:
      'Protección de proyectos inmobiliarios y propiedades piloto. Guardias, alarmas y control de acceso para evitar usurpaciones y robos.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'eventos',
    slug: 'eventos',
    title: 'Eventos y Espectáculos',
    description:
      'Seguridad especializada para eventos masivos, conciertos, ferias y espectáculos. Control de multitudes y protección VIP.',
    icon: 'shopping-bag',
    challenges: [
      'Control de multitudes',
      'Acceso no autorizado',
      'Emergencias masivas',
      'Protección VIP',
      'Coordinación con carabineros',
    ],
    solutions: [
      'Guardias para eventos',
      'Control de accesos',
      'Patrullaje preventivo',
      'Coordinación con carabineros',
      'Protocolos de emergencia',
    ],
    relatedServices: ['guardias-seguridad', 'control-acceso'],
    meta_title: 'Seguridad Privada para Eventos Masivos | Guardman',
    meta_description:
      'Guardias de seguridad para eventos, conciertos y ferias. Control de acceso, manejo de multitudes y protección VIP.',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'corporativo',
    slug: 'corporativo',
    title: 'Corporativo y Oficinas',
    description:
      'Seguridad integral para edificios corporativos, oficinas y centros de negocios. Protección de personal e información.',
    icon: 'building',
    challenges: [
      'Acceso de personal no autorizado',
      'Robo de equipos',
      'Información confidencial expuesta',
      'Visitas sin control',
      'Seguridad en estacionamientos',
    ],
    solutions: [
      'Control de acceso biométrico',
      'Guardias en recepción',
      'CCTV en pasillos y áreas comunes',
      'Alarmas en oficinas',
      'Protocolos de visitantes',
    ],
    relatedServices: ['guardias-seguridad', 'control-acceso', 'alarmas-ajax'],
    meta_title: 'Seguridad para Oficinas y Edificios Corporativos | Guardman',
    meta_description:
      'Servicios de seguridad para empresas y oficinas. Control de acceso, recepción y vigilancia 24/7 para proteger su negocio.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
];

// Queries

export const getAllSolutions = query({
  handler: async (_ctx) => {
    return await _ctx.db.query('solutions').collect();
  },
});

export const getSolutionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('solutions')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

export const getSolutionById = query({
  args: { id: v.id('solutions') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// === CRUD MUTATIONS ===

export const createSolution = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    cta: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    og_image: v.optional(v.string()),
    solutions: v.optional(v.array(v.string())),
    image: v.optional(v.string()),
    challenges: v.optional(v.array(v.string())),
    relatedServices: v.optional(v.array(v.string())),
    is_active: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  returns: v.id('solutions'),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('solutions')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (existing) {
      throw new Error('Solution with this slug already exists');
    }

    return await ctx.db.insert('solutions', {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateSolution = mutation({
  args: {
    id: v.id('solutions'),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    cta: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    og_image: v.optional(v.string()),
    solutions: v.optional(v.array(v.string())),
    image: v.optional(v.string()),
    challenges: v.optional(v.array(v.string())),
    relatedServices: v.optional(v.array(v.string())),
    is_active: v.optional(v.boolean()),
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

export const deleteSolution = mutation({
  args: { id: v.id('solutions') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { is_active: false });
  },
});

export const reorderSolutions = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('solutions'),
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

// === SEED MUTATION ===

export const seedSolutions = mutation({
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;

    for (const data of SOLUTIONS_SEED_DATA) {
      const existing = await ctx.db
        .query('solutions')
        .withIndex('by_slug', (q) => q.eq('slug', data.slug))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          image: data.image,
        });
        skipped++;
        continue;
      }

      await ctx.db.insert('solutions', data);
      inserted++;
    }

    return { inserted, skipped, total: SOLUTIONS_SEED_DATA.length };
  },
});
