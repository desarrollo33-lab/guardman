import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Seed data — mirrors src/data/faqs.ts
const FAQS_SEED_DATA = [
  {
    id: 'que-es-os10',
    question: '¿Qué es la certificación OS10?',
    answer:
      'OS10 es la certificación obligatoria que otorga el Estado de Chile a través de Carabineros para ejercer como guardia de seguridad privada. Todos nuestros guardias cuentan con esta certificación vigente, además de capacitación continua en primeros auxilios, manejo de crisis y protocolos de seguridad. Un guardia sin OS10 no puede ejercer legalmente en Chile.',
    category: 'guardias',
    order: 1,
  },
  {
    id: 'cuanto-cuesta-guardia',
    question: '¿Cuánto cuesta un guardia de seguridad?',
    answer:
      'El valor depende del tipo de servicio, ubicación, horario y equipo requerido. Ofrecemos planes desde UF mensuales con todo incluido: guardia certificado, uniforme, equipamiento, supervisión y seguros. Solicita una cotización personalizada sin compromiso y en menos de 24 horas tendrás una propuesta detallada.',
    category: 'precios',
    order: 2,
  },
  {
    id: 'cobertura-nacional',
    question: '¿En qué zonas tienen cobertura?',
    answer:
      'Operamos exclusivamente en la Región Metropolitana, cubriendo las 52 comunas del área metropolitana. Nuestra infraestructura propia y equipos especializados nos permiten brindar servicio de calidad en toda la RM con tiempos de respuesta optimizados.',
    category: 'general',
    order: 3,
  },
  {
    id: 'contrato-minimo',
    question: '¿Cuál es el mínimo de contrato?',
    answer:
      'Ofrecemos contratos flexibles desde 3 meses para servicios de guardias. Para alarmas Ajax, no hay permanencia mínima en el monitoreo. El patrullaje de condominios requiere compromiso mínimo de 6 meses para optimizar rutas. También tenemos opciones de servicio temporal para eventos y situaciones especiales.',
    category: 'contratos',
    order: 4,
  },
  {
    id: 'alarmas-ajax-diferencia',
    question: '¿Por qué elegir alarmas Ajax sobre otras marcas?',
    answer:
      'Ajax Systems es tecnología europea con certificación EN Grade 2, el estándar más alto para alarmas residenciales. Sus sensores tienen alcance de hasta 2km sin cables, baterías de 7 años, y la alarma principal notifica en solo 0.15 segundos. A diferencia de marcas chinas, Ajax ofrece fiabilidad comprobada en más de 100 países.',
    category: 'alarmas',
    order: 5,
  },
  {
    id: 'guardpod-que-es',
    question: '¿Qué incluye el módulo GuardPod?',
    answer:
      'GuardPod es un módulo prefabricado de 2.4m x 2.4m que incluye: baño completo con agua corriente, kitchenette, aire acondicionado, iluminación LED, circuito cerrado de TV, escritorio y silla ergonómica. Se instala en 24 horas con solo conexión eléctrica. Ideal para obras, faenas y puntos remotos que requieren infraestructura rápida.',
    category: 'guardpod',
    order: 6,
  },
  {
    id: 'supervision-guardias',
    question: '¿Cómo supervisan a los guardias?',
    answer:
      'Utilizamos un sistema integral de supervisión: checkpoints GPS con escaneo QR, rondas sorpresa de inspectores, cámaras body-cam opcionales, y central de monitoreo 24/7. Cada guardia tiene un dispositivo con botón de pánico y reporta novedades en tiempo real a nuestra plataforma. Tienes acceso a reportes digitales desde tu celular.',
    category: 'guardias',
    order: 7,
  },
  {
    id: 'que-pasa-alarma',
    question: '¿Qué pasa cuando se activa la alarma Ajax?',
    answer:
      'Al detectar una intrusión, la alarma envía notificaciones a tu celular en 0.15 segundos. Si tienes monitoreo, nuestra central recibe la alerta simultáneamente y despacha patrulla de respuesta. La sirena de 113dB activa disuasión inmediata. Puedes ver en vivo desde la app y dar falsa alarma si es necesario, todo desde tu teléfono.',
    category: 'alarmas',
    order: 8,
  },
  {
    id: 'patrullaje-compartido',
    question: '¿Cómo funciona el patrullaje compartido para condominios?',
    answer:
      'El patrullaje compartido permite que varios condominios cercanos dividan el costo de un vehículo de seguridad. La ruta incluye rondas programadas y aleatorias a cada comunidad, con check-in por código QR y reportes automáticos. El costo se divide entre todos los residentes, haciendo accesible la seguridad privada para comunidades pequeñas.',
    category: 'guardias',
    order: 9,
  },
  {
    id: 'tiempo-instalacion',
    question: '¿Cuánto demora la instalación?',
    answer:
      'Alarmas Ajax se instalan en 1 día sin obras ni cables. Un sistema completo para casa toma 2-4 horas. Para guardias, podemos iniciar servicio en 48-72 horas después de firma de contrato. GuardPod se instala en 24 horas con previa coordinación de transporte. El control de acceso requiere 3-5 días según complejidad del sitio.',
    category: 'general',
    order: 10,
  },
];

// Queries

export const getAllFaqs = query({
  handler: async (ctx) => {
    return await ctx.db.query('faqs').withIndex('by_order').collect();
  },
});

export const getFaqById = query({
  args: { id: v.id('faqs') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFaqsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('faqs')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .collect();
  },
});

// Mutations

export const seedFaqs = mutation({
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;

    for (const data of FAQS_SEED_DATA) {
      const existing = await ctx.db
        .query('faqs')
        .filter((q) => q.eq(q.field('id'), data.id))
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert('faqs', data);
      inserted++;
    }

    return { inserted, skipped, total: FAQS_SEED_DATA.length };
  },
});

// === CRUD MUTATIONS ===

export const createFaq = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
  },
  returns: v.id('faqs'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('faqs', args);
  },
});

export const updateFaq = mutation({
  args: {
    id: v.id('faqs'),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    category: v.optional(v.string()),
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

export const deleteFaq = mutation({
  args: { id: v.id('faqs') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderFaqs = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id('faqs'),
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
