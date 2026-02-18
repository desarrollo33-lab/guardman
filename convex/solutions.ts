import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Seed data — mirrors src/data/solutions.ts
const SOLUTIONS_SEED_DATA = [
    {
        id: 'condominios',
        slug: 'condominios',
        name: 'Condominios Residenciales',
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
        meta_title: 'Seguridad para Condominios y Edificios Residenciales | Guardman',
        meta_description:
            'Protección integral para comunidades. Guardias OS10, control de acceso y tecnología de seguridad diseñada para condominios y edificios.',
    },
    {
        id: 'mineria',
        slug: 'mineria',
        name: 'Minería e Industria',
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
    },
    {
        id: 'retail',
        slug: 'retail',
        name: 'Retail y Comercio',
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
    },
    {
        id: 'construccion',
        slug: 'construccion',
        name: 'Construcción y Obras',
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
    },
    {
        id: 'hoteleria',
        slug: 'hoteleria',
        name: 'Hotelería y Turismo',
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
    },
    {
        id: 'inmobiliaria',
        slug: 'inmobiliaria',
        name: 'Inmobiliaria y Propiedades',
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
    },
    {
        id: 'eventos',
        slug: 'eventos',
        name: 'Eventos y Espectáculos',
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
    },
    {
        id: 'corporativo',
        slug: 'corporativo',
        name: 'Corporativo y Oficinas',
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

// Mutations

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
