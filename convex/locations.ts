import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Seed data - todas las comunas de la RM
const RM_COMMUNES = [
  // CENTRO - Central Santiago area
  { name: 'Santiago', slug: 'santiago', zone: 'centro' },
  { name: 'Providencia', slug: 'providencia', zone: 'centro' },
  { name: 'Ñuñoa', slug: 'nunoa', zone: 'centro' },
  { name: 'Recoleta', slug: 'recoleta', zone: 'centro' },
  { name: 'Independencia', slug: 'independencia', zone: 'centro' },
  { name: 'Quinta Normal', slug: 'quinta-normal', zone: 'centro' },
  { name: 'Estación Central', slug: 'estacion-central', zone: 'centro' },
  { name: 'Pedro Aguirre Cerda', slug: 'pedro-aguirre-cerda', zone: 'centro' },
  { name: 'San Miguel', slug: 'san-miguel', zone: 'centro' },

  // NORTE - Northern RM
  { name: 'Colina', slug: 'colina', zone: 'norte' },
  { name: 'Tiltil', slug: 'tiltil', zone: 'norte' },
  { name: 'Lampa', slug: 'lampa', zone: 'norte' },
  { name: 'Quilicura', slug: 'quilicura', zone: 'norte' },
  { name: 'Conchalí', slug: 'conchali', zone: 'norte' },
  { name: 'Huechuraba', slug: 'huechuraba', zone: 'norte' },
  { name: 'Renca', slug: 'renca', zone: 'norte' },

  // SUR - Southern RM
  { name: 'San Bernardo', slug: 'san-bernardo', zone: 'sur' },
  { name: 'Puente Alto', slug: 'puente-alto', zone: 'sur' },
  { name: 'Pirque', slug: 'pirque', zone: 'sur' },
  { name: 'San José de Maipo', slug: 'san-jose-de-maipo', zone: 'sur' },
  { name: 'Calera de Tango', slug: 'calera-de-tango', zone: 'sur' },
  { name: 'La Cisterna', slug: 'la-cisterna', zone: 'sur' },
  { name: 'El Bosque', slug: 'el-bosque', zone: 'sur' },
  { name: 'La Granja', slug: 'la-granja', zone: 'sur' },
  { name: 'La Pintana', slug: 'la-pintana', zone: 'sur' },
  { name: 'San Ramón', slug: 'san-ramon', zone: 'sur' },
  { name: 'San Joaquín', slug: 'san-joaquin', zone: 'sur' },
  { name: 'Lo Espejo', slug: 'lo-espejo', zone: 'sur' },
  { name: 'Cerrillos', slug: 'cerrillos', zone: 'sur' },
  { name: 'Buin', slug: 'buin', zone: 'sur' },
  { name: 'Paine', slug: 'paine', zone: 'sur' },
  { name: 'La Florida', slug: 'la-florida', zone: 'sur' },

  // ORIENTE - Eastern RM (Andes side)
  { name: 'Las Condes', slug: 'las-condes', zone: 'oriente' },
  { name: 'Vitacura', slug: 'vitacura', zone: 'oriente' },
  { name: 'Lo Barnechea', slug: 'lo-barnechea', zone: 'oriente' },
  { name: 'La Reina', slug: 'la-reina', zone: 'oriente' },
  { name: 'Peñalolén', slug: 'penalolen', zone: 'oriente' },
  { name: 'Macul', slug: 'macul', zone: 'oriente' },

  // PONIENTE - Western RM
  { name: 'Maipú', slug: 'maipu', zone: 'poniente' },
  { name: 'Pudahuel', slug: 'pudahuel', zone: 'poniente' },
  { name: 'Cerro Navia', slug: 'cerro-navia', zone: 'poniente' },
  { name: 'Lo Prado', slug: 'lo-prado', zone: 'poniente' },
  { name: 'Curacaví', slug: 'curacavi', zone: 'poniente' },
  { name: 'María Pinto', slug: 'maria-pinto', zone: 'poniente' },
  { name: 'Melipilla', slug: 'melipilla', zone: 'poniente' },
  { name: 'Padre Hurtado', slug: 'padre-hurtado', zone: 'poniente' },
  { name: 'Peñaflor', slug: 'penaflor', zone: 'poniente' },
  { name: 'Talagante', slug: 'talagante', zone: 'poniente' },
  { name: 'Isla de Maipo', slug: 'isla-de-maipo', zone: 'poniente' },
  { name: 'El Monte', slug: 'el-monte', zone: 'poniente' },
  { name: 'Alhué', slug: 'alhue', zone: 'poniente' },
  { name: 'San Pedro', slug: 'san-pedro', zone: 'poniente' },
];

// Ciudades principales fuera de la RM
const OTHER_CITIES = [
  { name: 'Valparaíso', slug: 'valparaiso' },
  { name: 'Viña del Mar', slug: 'vina-del-mar' },
  { name: 'Concepción', slug: 'concepcion' },
  { name: 'Antofagasta', slug: 'antofagasta' },
  { name: 'Temuco', slug: 'temuco' },
];

/**
 * Obtener todas las comunas de la RM
 */
export const getAllCommunes = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('communes')
      .filter((q) => q.eq(q.field('isOtherCity'), undefined))
      .collect();
  },
});

/**
 * Obtener una comuna por su slug
 */
export const getCommuneBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('communes')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

/**
 * Obtener comunas por zona
 */
export const getCommunesByZone = query({
  args: {
    zone: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('communes')
      .withIndex('by_zone', (q) => q.eq('zone', args.zone))
      .collect();
  },
});

/**
 * Obtener ciudades principales fuera de la RM
 */
export const getOtherCities = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('communes')
      .withIndex('by_isOtherCity', (q) => q.eq('isOtherCity', true))
      .collect();
  },
});

/**
 * Obtener todas las ubicaciones (comunas + ciudades)
 */
export const getAllLocations = query({
  handler: async (ctx) => {
    const all = await ctx.db.query('communes').collect();
    return {
      communes: all.filter((c) => !c.isOtherCity),
      otherCities: all.filter((c) => c.isOtherCity),
    };
  },
});

/**
 * Seed de comunas y ciudades - idempotente
 * Solo inserta si no existe (verifica por slug)
 */
export const seedCommunes = mutation({
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;

    // Insertar comunas de la RM
    for (const commune of RM_COMMUNES) {
      const existing = await ctx.db
        .query('communes')
        .withIndex('by_slug', (q) => q.eq('slug', commune.slug))
        .first();

      const meta_title = `Guardias de Seguridad en ${commune.name} | Guardman`;
      const meta_description = `Servicios de seguridad privada en ${commune.name}. Guardias OS10, patrullaje y alarmas. Cobertura total en ${commune.name} y alrededores.`;

      if (!existing) {
        await ctx.db.insert('communes', {
          name: commune.name,
          slug: commune.slug,
          zone: commune.zone,
          isOtherCity: undefined,
          meta_title,
          meta_description,
        });
        inserted++;
      } else {
        // Update existing records
        await ctx.db.patch(existing._id, {
          meta_title,
          meta_description,
        });
        skipped++;
      }
    }

    // Insertar ciudades fuera de la RM
    for (const city of OTHER_CITIES) {
      const existing = await ctx.db
        .query('communes')
        .withIndex('by_slug', (q) => q.eq('slug', city.slug))
        .first();

      const meta_title = `Empresas de Seguridad en ${city.name} | Guardman`;
      const meta_description = `Servicios de guardias de seguridad y vigilancia en ${city.name}. Protección profesional para empresas y condominios en ${city.name}.`;

      if (!existing) {
        await ctx.db.insert('communes', {
          name: city.name,
          slug: city.slug,
          zone: undefined,
          isOtherCity: true,
          meta_title,
          meta_description,
        });
        inserted++;
      } else {
        await ctx.db.patch(existing._id, {
          meta_title,
          meta_description,
        });
        skipped++;
      }
    }

    return {
      success: true,
      inserted,
      skipped,
      total: RM_COMMUNES.length + OTHER_CITIES.length,
    };
  },
});

/**
 * Limpiar todas las comunas (solo para desarrollo)
 */
export const clearCommunes = mutation({
  handler: async (ctx) => {
    const all = await ctx.db.query('communes').collect();
    for (const item of all) {
      await ctx.db.delete(item._id);
    }
    return { deleted: all.length };
  },
});
