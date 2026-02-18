import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { convexServer } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { readFileSync } from 'fs';
import { join } from 'path';
import { OGTemplate } from '@/components/og/Template';

// Load fonts (must be in public or loaded as buffer)
// Load fonts logic moved inside handler
export const GET: APIRoute = async ({ params, request }) => {
    // Load fonts (must be in public or loaded as buffer)
    const fontFile = await fetch('https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf').then(res => res.arrayBuffer());

    const { collection, slug } = params;

    let title = 'Guardman';
    let description = 'Seguridad Privada';
    let type = 'Sitio Web';

    // Fetch data based on collection
    if (collection === 'services') {
        const data = await convexServer.query(api.services.getServiceBySlug, { slug: slug! });
        if (data) {
            title = data.title;
            description = data.description;
            type = 'Servicio';
        }
    } else if (collection === 'solutions') {
        const data = await convexServer.query(api.solutions.getSolutionBySlug, { slug: slug! });
        if (data) {
            title = `Seguridad para ${data.name}`;
            description = data.description;
            type = 'Solución';
        }
    } else if (collection === 'communes') {
        const data = await convexServer.query(api.locations.getCommuneBySlug, { slug: slug! });
        if (data) {
            title = `Seguridad en ${data.name}`;
            description = `Guardias y tecnología en ${data.name}`;
            type = 'Cobertura';
        }
    }

    // Load logo
    const logoPath = join(process.cwd(), 'public/images/guardman_logo.png');

    let logoSrc = '';
    try {
        const logoBuffer = readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString('base64');
        logoSrc = `data:image/png;base64,${logoBase64}`;
    } catch (e) {
        console.error('Failed to load logo:', e);
    }

    // Satori Template
    const element = OGTemplate({ type, title, description, logoSrc });

    const svg = await satori(element as any, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: 'Inter',
                data: fontFile,
                weight: 700,
                style: 'normal',
            },
        ],
    }
    );

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer as any, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
};

export function getStaticPaths() {
    return [
        { params: { collection: 'services', slug: 'guardias-seguridad' } }
    ]
}
