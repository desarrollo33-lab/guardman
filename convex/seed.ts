import { mutation } from './_generated/server';

// --- CONSTANTS FOR CONSISTENCY ---
const IMAGES = {
    hero: {
        main: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=2000&q=80', // Control room
        secondary: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=2000&q=80', // Guard on duty
    },
    services: {
        guardias: 'https://images.unsplash.com/photo-1590422915838-8e6d23485ce0?auto=format&fit=crop&w=800&q=80', // Security Guard
        patrullaje: 'https://images.unsplash.com/photo-1548695602-9984e1b4db1b?auto=format&fit=crop&w=800&q=80', // Patrol Car
        alarmas: 'https://images.unsplash.com/photo-1558002038-1091a5756131?auto=format&fit=crop&w=800&q=80', // Smart Home/Alarm
        guardpod: 'https://plus.unsplash.com/premium_photo-1661962360677-22d765873730?auto=format&fit=crop&w=800&q=80', // Modern surveillance/tech
        drones: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80', // Drone
        acceso: 'https://images.unsplash.com/photo-1632213702844-1e0615781374?auto=format&fit=crop&w=800&q=80', // Access Control/Turnstile
    },
    solutions: {
        condominios: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', // Apartment building
        mineria: 'https://images.unsplash.com/photo-1581093588401-fbb07398e29c?auto=format&fit=crop&w=800&q=80', // Industry/Mining
        retail: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=800&q=80', // Mall/Retail
        enventos: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', // Concert/Event
        construccion: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', // Construction site
    },
    about: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80', // Team/Meeting
    blog: {
        ai: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        os10: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        home: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    }
};

export const seedInitialData = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Seed Site Config (Singleton)
        const existingConfig = await ctx.db
            .query('site_config')
            .filter((q) => q.eq(q.field('is_active'), true))
            .first();

        if (!existingConfig) {
            await ctx.db.insert('site_config', {
                is_active: true,
                brand_name: 'Guardman Chile',
                phone_primary: '600 006 1000',
                whatsapp_number: '+56900000000',
                email_contact: 'contacto@guardman.cl',
                address_main: 'Av. Providencia 1234, Oficina 505, Providencia, Santiago',
                social_links: {
                    instagram: 'https://instagram.com/guardman_chile',
                    linkedin: 'https://linkedin.com/company/guardman',
                    facebook: 'https://facebook.com/guardman',
                    youtube: 'https://youtube.com/guardman',
                },
                navbar_items: [
                    { label: 'Inicio', href: '/', is_button: false },
                    { label: 'Servicios', href: '/servicios', is_button: false },
                    { label: 'Soluciones', href: '/soluciones', is_button: false },
                    { label: 'Cobertura', href: '/cobertura', is_button: false },
                    { label: 'Contacto', href: '/contacto', is_button: true },
                ],
            });
            console.log('✅ Site Config seeded');
        }

        // 2. Seed Services (Source of Truth)
        // Check if services exist, if not insert
        const servicesData = [
            { slug: 'guardias-seguridad', title: 'Guardias de Seguridad', description: 'Personal certificado OS10 con entrenamiento táctico.', icon: 'shield-check', image: IMAGES.services.guardias },
            { slug: 'patrullaje-condominios', title: 'Patrullaje Preventivo', description: 'Móviles de seguridad con monitoreo GPS 24/7.', icon: 'car', image: IMAGES.services.patrullaje },
            { slug: 'alarmas-ajax', title: 'Alarmas Ajax', description: 'Tecnología de intrusión inalámbrica de grado 2.', icon: 'bell', image: IMAGES.services.alarmas },
            { slug: 'guardpod', title: 'GuardPod', description: 'Torres de vigilancia autónomas con IA.', icon: 'eye', image: IMAGES.services.guardpod },
            { slug: 'drones-seguridad', title: 'Vigilancia Aérea', description: 'Drones con cámaras térmicas para grandes perímetros.', icon: 'drone', image: IMAGES.services.drones },
            { slug: 'control-acceso', title: 'Control de Acceso', description: 'Gestión inteligente de entradas y salidas.', icon: 'lock', image: IMAGES.services.acceso },
        ];

        for (const s of servicesData) {
            const exists = await ctx.db.query('services').withIndex('by_slug', q => q.eq('slug', s.slug)).first();
            if (!exists) {
                await ctx.db.insert('services', {
                    ...s,
                    is_active: true,
                    features: [],
                    benefits: [],
                    solutions: [],
                    industries: []
                });
            } else {
                // Full patch to ensure schema compliance
                await ctx.db.patch(exists._id, {
                    title: s.title,
                    description: s.description,
                    icon: s.icon,
                    image: s.image,
                });
            }
        }
        console.log('✅ Services seeded');


        // 3. Seed Solutions
        const solutionsData = [
            { slug: 'condominios', title: 'Seguridad para Condominios', description: 'Protección integral para comunidades residenciales.', image: IMAGES.solutions.condominios },
            { slug: 'mineria', title: 'Seguridad Minera e Industrial', description: 'Protocolos estrictos para faenas críticas.', image: IMAGES.solutions.mineria },
            { slug: 'retail', title: 'Seguridad en Retail', description: 'Prevención de pérdidas y seguridad para clientes.', image: IMAGES.solutions.retail },
            { slug: 'eventos', title: 'Seguridad de Eventos', description: 'Control de masas y protección VIP.', image: IMAGES.solutions.enventos },
            { slug: 'construccion', title: 'Seguridad en Construcción', description: 'Vigilancia de obras y control de materiales.', image: IMAGES.solutions.construccion },
        ];

        for (const sol of solutionsData) {
            const exists = await ctx.db.query('solutions').withIndex('by_slug', q => q.eq('slug', sol.slug)).first();
            if (!exists) {
                await ctx.db.insert('solutions', { ...sol, is_active: true });
            } else {
                await ctx.db.patch(exists._id, {
                    title: sol.title,
                    description: sol.description,
                    image: sol.image
                });
            }
        }
        console.log('✅ Solutions seeded');



        // 4. Seed Partners (Clients)
        const clientsData = [
            { name: 'Marriott', industry: 'Hospitality & Events', type: 'client', order: 1, logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', quote: 'Seguridad impecable 24/7.', icon: 'building' },
            { name: 'Kavak', industry: 'Automotriz', type: 'client', order: 2, logo_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', quote: 'Control de acceso eficiente.', icon: 'car' },
            { name: 'Cencosud', industry: 'Retail', type: 'client', order: 3, logo_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', quote: 'Respuesta inmediata.', icon: 'shopping-bag' },
            { name: 'Walmart', industry: 'Logística', type: 'client', order: 4, logo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', quote: 'Tecnología de punta.', icon: 'truck' },
        ];

        for (const client of clientsData) {
            const exists = await ctx.db.query('partners').withIndex('by_type', q => q.eq('type', 'client')).filter(q => q.eq(q.field('name'), client.name)).first();
            if (!exists) {
                await ctx.db.insert('partners', client);
            }
        }
        console.log('✅ Clients seeded');

        // 5. Seed Pages & Content Blocks

        // Helper to seed a page if it doesn't exist
        const seedPage = async (slug: string, title: string, seoTitle: string, seoDesc: string) => {
            const exists = await ctx.db.query('pages').withIndex('by_slug', q => q.eq('slug', slug)).first();
            if (!exists) {
                console.log(`Creating page: ${slug}`);
                await ctx.db.insert('pages', {
                    slug,
                    title,
                    seo_title: seoTitle,
                    seo_description: seoDesc,
                    is_published: true,
                    og_image: IMAGES.hero.main
                });
            } else {
                console.log(`Page already exists: ${slug}`);
            }
        };

        // Helper to clear and seed blocks for a page (simple idempotency: delete all for page then insert)
        const seedBlocks = async (pageSlug: string, blocks: any[]) => {
            const existing = await ctx.db.query('content_blocks').withIndex('by_page_order', q => q.eq('page_slug', pageSlug)).collect();
            for (const block of existing) {
                await ctx.db.delete(block._id);
            }
            for (const block of blocks) {
                await ctx.db.insert('content_blocks', { ...block, page_slug: pageSlug, is_visible: true });
            }
        };

        // --- HOME PAGE ---
        await seedPage('/', 'Home', 'Guardman Chile - Seguridad Privada Experta', 'Líderes en seguridad OS10 y tecnología en Chile.');
        await seedBlocks('/', [
            {
                type: 'hero_video',
                order: 1,
                title: 'Seguridad Premium para tu Empresa',
                subtitle: 'Guardias certificados, tecnología de vanguardia y protección integral sin contratos forzosos',
                data: {
                    video_id: 'r6OSTXanzmI',
                    primary_cta: {
                        text: 'Cotizar',
                        href: '/cotizar',
                    },
                    secondary_ctas: [
                        { text: 'Servicios', href: '/servicios', variant: 'outline' },
                    ],
                    trust_badges: [
                        { text: 'Ley 21.659', icon: 'shield-check' },
                        { text: 'OS10 Certificado', icon: 'badge-check' },
                        { text: '+500 Clientes', icon: 'users' },
                    ],
                }
            },
            {
                type: 'guardpod_feature',
                order: 4,
                title: 'GuardPod',
                subtitle: 'Seguridad Modular Instantánea',
                content: 'Unidad de seguridad autónoma lista para operar en 24 horas.',
                data: {
                    video_id: 'M9kZNHoHcS4',
                    features: [
                        { icon: 'clock', title: 'Instalación Rápida', description: 'Operativo en 24 horas' },
                        { icon: 'signal', title: 'Conectividad 4G/5G', description: 'Internet satelital incluido' },
                        { icon: 'map-pin', title: 'Fácil Despliegue', description: 'Cualquier ubicación remota' },
                        { icon: 'shield-check', title: 'Blindaje Nivel 3', description: 'Protección certificada' },
                    ],
                    stats: [
                        { value: '24 hrs', label: 'Instalación' },
                        { value: '70%', label: 'Ahorro' },
                        { value: '98%', label: 'Satisfacción' },
                    ],
                    ctas: [
                        { text: 'Solicitar GuardPod', href: '/servicios/guardpod', variant: 'accent' },
                        { text: 'WhatsApp', href: 'https://wa.me/56930000010', variant: 'whatsapp' },
                    ],
                }
            },
            {
                type: 'services_grid_ajax',
                order: 2,
                title: 'Nuestros Servicios',
                subtitle: 'Soluciones operativas para cada necesidad.',
                data: {
                    services: servicesData.map(s => ({
                        title: s.title,
                        description: s.description,
                        href: `/servicios/${s.slug}`,
                        image: s.image,
                        badge: s.slug === 'alarmas-ajax' ? 'Partner Oficial' : undefined
                    })),
                    columns: 3,
                    showAllLink: true
                }
            },
            {
                type: 'stats_section',
                order: 3,
                data: {
                    stats: [
                        { value: '15+', label: 'Años de Experiencia' },
                        { value: '300+', label: 'Clientes Satisfechos' },
                        { value: '100%', label: 'Certificación OS10' },
                        { value: '24/7', label: 'Soporte Operativo' }
                    ],
                    background: 'dark'
                }
            },
            {
                type: 'cta_dual',
                order: 4,
                data: {
                    leftCta: {
                        title: 'Emergencias 24/7',
                        description: 'Respuesta inmediata ante incidentes de seguridad.',
                        buttonText: 'Llamar Ahora',
                        buttonHref: 'tel:+56900000000',
                        icon: 'phone'
                    },
                    rightCta: {
                        title: 'Únete al equipo',
                        description: 'Buscamos los mejores guardias de seguridad de Chile.',
                        buttonText: 'Trabaja con Nosotros',
                        buttonHref: '/trabaja-con-nosotros',
                        icon: 'shield'
                    }
                }
            }
        ]);

        // --- SERVICIOS LANDING ---
        await seedPage('/servicios', 'Servicios', 'Servicios de Seguridad - Guardman Chile', 'Explora nuestra gama completa de servicios de seguridad.');
        await seedBlocks('/servicios', [
            {
                type: 'hero_ajax',
                order: 1,
                title: 'Nuestros Servicios',
                subtitle: 'Excelencia operativa en cada misión.',
                data: {
                    backgroundImage: IMAGES.services.patrullaje,
                    size: 'md',
                    align: 'center'
                }
            },
            {
                type: 'services_grid_ajax',
                order: 2,
                title: 'Catálogo de Servicios',
                data: {
                    services: servicesData.map(s => ({
                        title: s.title,
                        description: s.description,
                        href: `/servicios/${s.slug}`,
                        image: s.image
                    })),
                    columns: 3
                }
            }
        ]);

        // --- SOLUCIONES LANDING ---
        await seedPage('/soluciones', 'Soluciones', 'Soluciones por Industria - Guardman Chile', 'Seguridad adaptada a su industria.');
        await seedBlocks('/soluciones', [
            {
                type: 'hero_ajax',
                order: 1,
                title: 'Soluciones por Industria',
                subtitle: 'Entendemos los desafíos únicos de su sector.',
                data: {
                    backgroundImage: IMAGES.solutions.mineria,
                    size: 'md',
                    align: 'center'
                }
            },
            {
                type: 'services_grid_ajax', // Reusing grid for solutions
                order: 2,
                title: 'Sectores que Protegemos',
                data: {
                    services: solutionsData.map(s => ({
                        title: s.title,
                        description: s.description,
                        href: `/soluciones/${s.slug}`,
                        image: s.image
                    })),
                    columns: 3
                }
            }
        ]);

        console.log('✅ Content Blocks seeded for Home, Services, and Solutions');

        // 5. Seed Partners/Certs
        const existingCerts = await ctx.db.query('partners').filter(q => q.eq(q.field('type'), 'certification')).collect();
        if (existingCerts.length === 0) {
            await ctx.db.insert('partners', { name: 'OS10 Carabineros', logo_url: '/logos/os10.png', type: 'certification', order: 1 });
            await ctx.db.insert('partners', { name: 'ISO 9001', logo_url: '/logos/iso9001.png', type: 'certification', order: 2 });
            console.log('✅ Certifications seeded');
        }

        // 7. Seed Blog Posts
        const blogPosts = [
            {
                slug: 'futuro-seguridad-ia',
                title: 'El Futuro de la Seguridad Privada: IA y Drones',
                excerpt: 'Descubre cómo la inteligencia artificial y la vigilancia aérea están revolucionando la protección de activos en Chile.',
                cover_image: IMAGES.blog.ai,
                author: 'Carlos Ruiz',
                published_at: Date.now(),
                read_time: 5,
                tags: ['Tecnología', 'Innovación', 'Drones'],
                is_featured: true,
                content: [
                    { type: 'text', content: 'La seguridad privada está experimentando una transformación radical gracias a la incorporación de nuevas tecnologías.' },
                    { type: 'h2', content: 'Vigilancia Aérea Autónoma' },
                    { type: 'image', content: IMAGES.services.drones, alt: 'Drone vigilancia', caption: 'Drones patrullando.' },
                    { type: 'text', content: 'Los drones permiten cubrir grandes extensiones de terreno en minutos.' },
                    { type: 'video', content: 'https://www.youtube.com/watch?v=J5jZ15z-r_g', caption: 'Demo drones.' }
                ]
            },
            {
                slug: 'normativa-os10',
                title: 'Certificación OS10: Guía Completa',
                excerpt: 'Normativa esencial para la seguridad privada en Chile.',
                cover_image: IMAGES.blog.os10,
                author: 'Ana Morales',
                published_at: Date.now() - 86400000 * 5,
                read_time: 8,
                tags: ['Legales', 'OS10'],
                is_featured: false,
                content: [
                    { type: 'text', content: 'La certificación OS10 es la garantía de personal capacitado.' },
                    { type: 'list', content: '', items: ['Legislación', 'Prevención', 'Emergencias'] }
                ]
            },
            {
                slug: 'seguridad-condominios',
                title: 'Seguridad en Condominios en Verano',
                excerpt: 'Consejos para proteger tu hogar en vacaciones.',
                cover_image: IMAGES.blog.home,
                author: 'Roberto Gomez',
                published_at: Date.now() - 86400000 * 10,
                read_time: 4,
                tags: ['Hogar', 'Consejos'],
                is_featured: false,
                content: [
                    { type: 'text', content: 'El verano es crítico para la seguridad del hogar.' },
                    { type: 'quote', content: 'La prevención es clave.' }
                ]
            }
        ];

        for (const post of blogPosts) {
            const exists = await ctx.db.query('blog_posts').withIndex('by_slug', q => q.eq('slug', post.slug)).first();
            if (!exists) {
                await ctx.db.insert('blog_posts', post);
            }
        }
        console.log('✅ Blog Posts seeded');

        // 6. Seed Communes (PSEO)
        const communesData = [
            // Sector Oriente
            { name: 'Las Condes', slug: 'las-condes', zone: 'oriente', isOtherCity: false },
            { name: 'Vitacura', slug: 'vitacura', zone: 'oriente', isOtherCity: false },
            { name: 'Lo Barnechea', slug: 'lo-barnechea', zone: 'oriente', isOtherCity: false },
            { name: 'Providencia', slug: 'providencia', zone: 'oriente', isOtherCity: false },
            { name: 'La Reina', slug: 'la-reina', zone: 'oriente', isOtherCity: false },
            { name: 'Ñuñoa', slug: 'nunoa', zone: 'oriente', isOtherCity: false },

            // Sector Centro
            { name: 'Santiago Centro', slug: 'santiago-centro', zone: 'centro', isOtherCity: false },

            // Sector Norte
            { name: 'Huechuraba', slug: 'huechuraba', zone: 'norte', isOtherCity: false },
            { name: 'Recoleta', slug: 'recoleta', zone: 'norte', isOtherCity: false },
            { name: 'Independencia', slug: 'independencia', zone: 'norte', isOtherCity: false },
            { name: 'Conchalí', slug: 'conchali', zone: 'norte', isOtherCity: false },
            { name: 'Quilicura', slug: 'quilicura', zone: 'norte', isOtherCity: false },
            { name: 'Renca', slug: 'renca', zone: 'norte', isOtherCity: false },
            { name: 'Colina', slug: 'colina', zone: 'norte', isOtherCity: false }, // Chicureo area
            { name: 'Lampa', slug: 'lampa', zone: 'norte', isOtherCity: false },

            // Sector Poniente
            { name: 'Estación Central', slug: 'estacion-central', zone: 'poniente', isOtherCity: false },
            { name: 'Maipú', slug: 'maipu', zone: 'poniente', isOtherCity: false },
            { name: 'Cerrillos', slug: 'cerrillos', zone: 'poniente', isOtherCity: false },
            { name: 'Pudahuel', slug: 'pudahuel', zone: 'poniente', isOtherCity: false },
            { name: 'Lo Prado', slug: 'lo-prado', zone: 'poniente', isOtherCity: false },
            { name: 'Cerro Navia', slug: 'cerro-navia', zone: 'poniente', isOtherCity: false },
            { name: 'Quinta Normal', slug: 'quinta-normal', zone: 'poniente', isOtherCity: false },
            { name: 'Padre Hurtado', slug: 'padre-hurtado', zone: 'poniente', isOtherCity: false },

            // Sector Sur
            { name: 'San Miguel', slug: 'san-miguel', zone: 'sur', isOtherCity: false },
            { name: 'La Cisterna', slug: 'la-cisterna', zone: 'sur', isOtherCity: false },
            { name: 'La Florida', slug: 'la-florida', zone: 'sur', isOtherCity: false },
            { name: 'Puente Alto', slug: 'puente-alto', zone: 'sur', isOtherCity: false },
            { name: 'San Bernardo', slug: 'san-bernardo', zone: 'sur', isOtherCity: false },
            { name: 'Macul', slug: 'macul', zone: 'sur', isOtherCity: false },
            { name: 'Peñalolén', slug: 'penalolen', zone: 'sur', isOtherCity: false },
            { name: 'San Joaquín', slug: 'san-joaquin', zone: 'sur', isOtherCity: false },
            { name: 'La Granja', slug: 'la-granja', zone: 'sur', isOtherCity: false },
            { name: 'El Bosque', slug: 'el-bosque', zone: 'sur', isOtherCity: false },
            { name: 'La Pintana', slug: 'la-pintana', zone: 'sur', isOtherCity: false },
            { name: 'Lo Espejo', slug: 'lo-espejo', zone: 'sur', isOtherCity: false },
            { name: 'Pedro Aguirre Cerda', slug: 'pedro-aguirre-cerda', zone: 'sur', isOtherCity: false },
            { name: 'San Ramón', slug: 'san-ramon', zone: 'sur', isOtherCity: false },
        ];

        for (const c of communesData) {
            const exists = await ctx.db.query('communes').withIndex('by_slug', q => q.eq('slug', c.slug)).first();
            if (!exists) {
                await ctx.db.insert('communes', {
                    ...c,
                    meta_title: `Seguridad Privada en ${c.name} - Guardias y Vigilancia`,
                    meta_description: `Servicios de seguridad en ${c.name}. Guardias OS10, patrullaje móvil y alarmas monitoreadas para empresas y condominios en ${c.name}, RM.`
                });
            }
        }
        console.log('✅ Communes seeded for PSEO');

    },
});

