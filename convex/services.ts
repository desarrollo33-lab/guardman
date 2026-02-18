import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Seed data for services
const SERVICES_SEED_DATA = [
  {
    id: 'guardias-seguridad',
    slug: 'guardias-seguridad',
    title: 'Guardias de Seguridad',
    description:
      'Guardias OS10 certificados para empresas, condominios e industrias. Personal altamente capacitado con supervisión continua y equipamiento profesional.',
    tagline: 'Protección profesional 24/7',
    icon: 'shield-check',
    features: [
      'Certificación OS10 vigente',
      'Supervisión 24/7 con GPS',
      'Equipamiento completo uniformado',
      'Turnos flexibles 4x4 o 7x7',
      'Capacitación continua mensual',
      'Reportes digitales en tiempo real',
    ],
    benefits: [
      'Reduce incidentes hasta 90%',
      'Personal auditado y confiable',
      'Respuesta inmediata ante emergencias',
      'Responsabilidad civil asegurada',
    ],
    cta: 'Cotizar Guardias',
    solutions: [
      'condominios',
      'mineria',
      'retail',
      'hoteleria',
      'construccion',
    ],
    image: 'https://images.unsplash.com/photo-1555529733-1e944b204e33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    meta_title: 'Guardias de Seguridad Privada OS10 en Chile | Guardman',
    meta_description:
      'Servicio de guardias de seguridad OS10 certificados para empresas y condominios. Protección 24/7 con supervisión en tiempo real y personal calificado.',
  },
  {
    id: 'patrullaje-condominios',
    slug: 'patrullaje-condominios',
    title: 'Patrullaje de Condominios',
    description:
      'Servicio de rondas móviles con vehículos identificados para condominios residenciales. Cobertura nocturna y diurna con monitoreo GPS.',
    tagline: 'Rondas inteligentes para tu comunidad',
    icon: 'car',
    features: [
      'Rondas programadas y aleatorias',
      'Vehículos identificados con GPS',
      'Sistema de check-in por QR',
      'Reportes automáticos a administración',
      'Cobertura 7 noches semanales',
      'Respuesta ante alarmas comunitarias',
    ],
    benefits: [
      'Prevención de robos y vandalismo',
      'Costo compartido entre residentes',
      'Presencia disuasiva visible',
      'Integración con alarmas Ajax',
    ],
    cta: 'Cotizar Patrullaje',
    solutions: ['condominios'],
    image: 'https://images.unsplash.com/photo-1541560052-7eec2fde978d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    meta_title: 'Patrullaje de Seguridad para Condominios | Guardman',
    meta_description:
      'Servicio de patrullaje móvil para condominios. Rondas de seguridad con vehículos identificados y monitoreo GPS para tu comunidad.',
  },
  {
    id: 'alarmas-ajax',
    slug: 'alarmas-ajax',
    title: 'Alarmas Ajax Systems',
    description:
      'Sistemas de alarma inalámbricos Ajax con monitoreo 24/7. Tecnología europea de última generación con notificaciones instantáneas.',
    tagline: 'Tecnología europea de protección',
    icon: 'bell',
    features: [
      'Sensores inalámbricos premium',
      'Monitoreo 24/7 incluido',
      'App móvil para control total',
      'Detección de intrusiones y fuego',
      'Batería de respaldo 16 horas',
      'Conexión GSM y Ethernet dual',
    ],
    benefits: [
      'Instalación en 1 día sin obras',
      'Notificaciones en 0.15 segundos',
      'Sin cables ni remodelaciones',
      'Certificación europea EN Grade 2',
    ],
    cta: 'Cotizar Alarmas',
    solutions: ['condominios', 'retail', 'hoteleria', 'construccion'],
    image: 'https://images.unsplash.com/photo-1558002038-1091a1661116?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    meta_title: 'Alarmas Ajax y Monitoreo Inteligente | Guardman',
    meta_description:
      'Instalación de alarmas Ajax con monitoreo sin contratos forzosos. Detectores de movimiento, incendio e inundación con control desde tu smartphone.',
  },
  {
    id: 'guardpod',
    slug: 'guardpod',
    title: 'Módulos GuardPod',
    description:
      'Casetas de seguridad blindadas y autónomas. Solución llave en mano con baño, aire acondicionado y tecnología de vigilancia integrada.',
    tagline: 'Seguridad portátil y autónoma',
    icon: 'cube',
    features: [
      'Estructura blindada y térmica',
      'Baño y kitchenette integrados',
      'Panel solar (opcional)',
      'CCTV perimetral incluido',
      'Instalación en 24 horas',
      'Climatización frío/calor',
    ],
    benefits: [
      'Dignidad para el personal',
      'Sin obras civiles',
      'Visibilidad 360 grados',
      '100% recuperable y trasladable',
    ],
    cta: 'Cotizar GuardPod',
    solutions: ['construccion', 'mineria', 'industria', 'eventos'],
    image: 'https://images.unsplash.com/photo-1496247749665-49cf5b102269?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    meta_title: 'Módulos de Seguridad GuardPod Blindados | Guardman',
    meta_description:
      'Casetas de seguridad GuardPod totalmente equipadas. Solución portátil con baño, blindaje y tecnología para obras, minería y eventos.',
  },
  {
    id: 'drones-seguridad',
    slug: 'drones-seguridad',
    title: 'Drones de Seguridad',
    description:
      'Vigilancia aérea autónoma con drones industriales. Cobertura de grandes extensiones con cámaras HD y térmicas.',
    tagline: 'Vigilancia aérea autónoma 24/7',
    icon: 'airplane',
    features: [
      'Vuelos autónomos programados',
      'Cámaras HD y térmicas',
      'Detección de movimiento IA',
      'Alertas en tiempo real',
      'Cobertura hasta 500 hectáreas',
      'Estación de carga automática',
    ],
    benefits: [
      'Vigilancia de perímetros extensos',
      'Respuesta visual inmediata',
      'Reducción de personal requerido',
      'Grabación de evidencias legales',
    ],
    cta: 'Cotizar Drones',
    solutions: ['mineria', 'construccion'],
    image: 'https://images.unsplash.com/photo-1508614589041-895b8c9d7e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'control-acceso',
    slug: 'control-acceso',
    title: 'Control de Acceso',
    description:
      'Sistemas de control de acceso con biometría, tarjetas y reconocimiento facial. Gestión integral de visitantes y personal.',
    tagline: 'Control total de ingresos',
    icon: 'key',
    features: [
      'Lectores biométricos huella facial',
      'Tarjetas NFC y códigos QR',
      'Tornos y barreras vehiculares',
      'Software de gestión web',
      'Integración con RRHH',
      'Reportes de asistencia automáticos',
    ],
    benefits: [
      'Registro completo de accesos',
      'Prevención de ingresos no autorizados',
      'Automatización de asistencia',
      'Cumplimiento normativo laboral',
    ],
    cta: 'Cotizar Control',
    solutions: ['mineria', 'retail', 'hoteleria', 'construccion'],
    image: 'https://images.unsplash.com/photo-1623941002345-0374e304859a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
];

// Queries

export const getAllServices = query({
  handler: async (ctx) => {
    return await ctx.db.query('services').collect();
  },
});

export const getServiceBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('services')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

export const getServicesBySolution = query({
  args: {
    solution: v.string(),
  },
  handler: async (ctx, args) => {
    const allServices = await ctx.db.query('services').collect();
    return allServices.filter(
      (service) =>
        service.solutions && service.solutions.includes(args.solution)
    );
  },
});

// Mutations

export const seedServices = mutation({
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;

    for (const serviceData of SERVICES_SEED_DATA) {
      // Check if service already exists by slug (idempotent)
      const existing = await ctx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', serviceData.slug))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          meta_title: serviceData.meta_title,
          meta_description: serviceData.meta_description,
          solutions: serviceData.solutions,
          image: serviceData.image,
        });
        skipped++;
        continue;
      }

      await ctx.db.insert('services', serviceData);
      inserted++;
    }

    return { inserted, skipped, total: SERVICES_SEED_DATA.length };
  },
});
