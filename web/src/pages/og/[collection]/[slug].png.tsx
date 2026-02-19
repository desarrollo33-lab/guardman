import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { convexServer } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';

// Load fonts (must be in public or loaded as buffer)
const fontFile = await fetch('https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf').then(res => res.arrayBuffer());

export const GET: APIRoute = async ({ params, request }) => {
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

    // Load logo (white version for dark background)
    // Note: In deployed environments like Vercel, access to 'public' via fs might be restricted.
    // If this fails, we should use a public URL fetch or bundle the asset.
    const logoPath = join(process.cwd(), 'public/images/guardman_logo.png');

    let logoSrc = '';
    try {
        const logoBuffer = readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString('base64');
        logoSrc = `data:image/png;base64,${logoBase64}`;
    } catch (e) {
        console.error('Failed to load logo:', e);
        // Fallback or leave empty
    }

    // Satori Template (JSX)
    const svg = await satori(
        <div
            style={{
                display: 'flex',
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111827', // Gray-900
                color: 'white',
                backgroundImage: 'radial-gradient(circle at 25px 25px, #1f2937 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1f2937 2%, transparent 0%)',
                backgroundSize: '100px 100px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    height: '120px',
                }}
            >
                {logoSrc ? (
                    <img
                        src={logoSrc}
                        style={{
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <div style={{ fontSize: 60, fontWeight: 900, color: '#f59e0b' }}>GUARDMAN</div>
                )}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '40px',
                    maxWidth: '900px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div
                    style={{
                        fontSize: 24,
                        color: '#9ca3af',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                    }}
                >
                    {type}
                </div>
                <h1
                    style={{
                        fontSize: 72,
                        fontWeight: 800,
                        margin: '0 0 20px 0',
                        lineHeight: 1.1,
                        backgroundImage: 'linear-gradient(to bottom right, #ffffff, #9ca3af)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        fontSize: 32,
                        color: '#d1d5db',
                        margin: 0,
                        lineHeight: 1.5,
                        textWrap: 'balance',
                    }}
                >
                    {description.length > 120 ? description.substring(0, 120) + '...' : description}
                </p>
            </div>
        </div>,
        {
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
        // Placeholder for strict mode, though not needed for SSR
        { params: { collection: 'services', slug: 'guardias-seguridad' } }
    ]
}
