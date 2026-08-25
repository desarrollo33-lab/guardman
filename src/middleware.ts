// ════════════════════════════════════════════════════════════════
// GuardMan — Middleware SSR
//   1. Auth server-side para rutas /admin/* (excepto /admin/login)
//      Verifica cookie httpOnly `gm_session`. Sin cookie → 302 a /admin/login.
//   2. Compresión Brotli/gzip de respuestas de texto (HTML, JS, CSS, JSON).
//      Cloudflare Workers NO auto-comprime (a diferencia de Pages). Sin esto,
//      el HTML sale a 189 KB sin comprimir → FCP/LCP suben 1-2s en lab.
//   3. Headers de seguridad en TODAS las respuestas.
// ════════════════════════════════════════════════════════════════

import { defineMiddleware } from 'astro:middleware';

const SESSION_COOKIE = 'gm_session';

// Rutas admin que NO requieren sesión (página de login y assets de login).
const ADMIN_PUBLIC = new Set(['/admin/login']);

// Content types que SÍ vale la pena comprimir (texto). Imágenes/woff2 ya están
// comprimidos; comprimir más solo agrega CPU sin reducir tamaño.
const COMPRESSIBLE_TYPES = [
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'application/json',
  'application/xml',
  'image/svg+xml',
];

// Helper: comprimir el body de una Response con Brotli o gzip según
// `Accept-Encoding` del cliente. Retorna la misma Response con el body
// comprimido y los headers `Content-Encoding` + `Vary` correctos.
const compressResponse = async (
  response: Response,
  acceptEncoding: string | null,
): Promise<Response> => {
  const contentType = response.headers.get('Content-Type') ?? '';
  const isCompressible = COMPRESSIBLE_TYPES.some((t) => contentType.includes(t));
  if (!isCompressible || !response.body) return response;

  // Si ya viene comprimido (caso edge cache o re-entrega), no re-comprimir.
  if (response.headers.get('Content-Encoding')) return response;

  // Brotli primero (mejor ratio). Fallback a gzip si el cliente no lo soporta.
  const supportsBrotli = acceptEncoding?.includes('br') ?? false;
  const supportsGzip = acceptEncoding?.includes('gzip') ?? false;
  if (!supportsBrotli && !supportsGzip) return response;

  const format: 'gzip' | 'deflate' = supportsBrotli ? 'gzip' : 'gzip';
  // CompressionStream solo soporta 'gzip' | 'deflate' | 'deflate-raw' en runtime
  // de Cloudflare Workers. Brotli nativo no está en CompressionStream, pero
  // podemos usar 'gzip' que tiene soporte universal y reduce HTML 5-10x.
  void supportsBrotli;
  const encoding = supportsGzip ? 'gzip' : 'identity';
  if (encoding === 'identity') return response;

  const compressed = response.body.pipeThrough(new CompressionStream(format));
  const headers = new Headers(response.headers);
  headers.set('Content-Encoding', encoding);
  headers.set('Vary', 'Accept-Encoding');
  // Quitar Content-Length (cambia con la compresión) para que el runtime
  // calcule el nuevo tamaño al enviar.
  headers.delete('Content-Length');
  return new Response(compressed, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

// Helper: agregar headers de seguridad a una Response.
const addSecurityHeaders = (response: Response, contentType: string | null): Response => {
  const headers = new Headers(response.headers);

  // X-Content-Type-Options: previene MIME sniffing.
  headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy: solo enviar origen en cross-origin.
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // X-Frame-Options: anti-clickjacking. SAMEORIGIN permite iframes internos.
  headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Permissions-Policy: deshabilitar APIs sensibles que no usamos.
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)',
  );

  // HSTS: solo si la respuesta es HTTPS. Cloudflare inyecta el request, así
  // que el worker ve https. Activar 1 año + subdominios.
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // CSP: solo para respuestas HTML. Permite inline styles y scripts propios.
  if (contentType && contentType.includes('text/html')) {
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://guardman.oficinadesarrollo33.workers.dev",
        "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // ── Auth check para rutas /admin/* ─────────────────────────────
  if (pathname.startsWith('/admin/') || pathname === '/admin') {
    const isPublic = ADMIN_PUBLIC.has(pathname.replace(/\/$/, '') || '/');
    if (!isPublic) {
      const cookie = context.cookies.get(SESSION_COOKIE);
      // Validación mínima: solo longitud. La cookie es httpOnly + Secure,
      // y la verificación real del token la hace el Worker API externo.
      if (!cookie || !cookie.value || cookie.value.length < 16) {
        const redirect = encodeURIComponent(pathname + url.search);
        return context.redirect(`/admin/login?redirect=${redirect}`, 302);
      }
    }
  }

  // ── Continuar con la request ───────────────────────────────────
  const response = await next();

  // ── Comprimir respuesta (gzip para text/html, text/css, JS, JSON) ──
  const acceptEncoding = context.request.headers.get('Accept-Encoding');
  const compressed = await compressResponse(response, acceptEncoding);

  // ── Agregar headers de seguridad a la respuesta ────────────────
  return addSecurityHeaders(compressed, response.headers.get('Content-Type'));
});
