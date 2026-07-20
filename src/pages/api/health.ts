// /api/health — healthcheck. CORS restrictivo: solo guardman.cl + dev.
const ALLOWED_ORIGINS = new Set([
  'https://guardman.cl',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

const corsHeaders = (origin: string | null): HeadersInit => {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://guardman.cl';
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
};

export const GET = ({ request }: { request: Request }) => {
  const origin = request.headers.get('Origin');
    return new Response(
    JSON.stringify(
      {
        ok: true,
        service: 'guardman-astro',
        version: '4.5.0',
        hosting: 'cloudflare-workers',
        features: ['crm-only-admin', 'lead-capture-optimized', 'seo-geo-ready', 'hreflang', 'structured-data', 'canal-denuncias-anonimo', 'd1-bound'],
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
    { status: 200, headers: corsHeaders(origin) },
  );
};

export const OPTIONS = ({ request }: { request: Request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};
