// ════════════════════════════════════════════════════════════════
// GuardMan — Middleware SSR
//   1. Auth server-side para rutas /admin/* (excepto /admin/login).
//      Verifica cookie httpOnly `gm_session`. Sin cookie → 302 a /admin/login.
//   2. NO comprimimos en el worker. Cloudflare Workers runtime YA hace
//      auto-compression en el edge de forma nativa (gzip/brotli según
//      `Accept-Encoding` del cliente) y agrega `Content-Encoding` correctamente.
//      Comprimir acá causa DOBLE compression: el browser descomprime UNA
//      capa y queda single-gzip sin header → garbage en pantalla.
//   3. Headers de seguridad en TODAS las respuestas.
//   4. Vary: Accept-Encoding para que el edge cache respete la codificación.
// ════════════════════════════════════════════════════════════════

import { defineMiddleware } from 'astro:middleware';

const SESSION_COOKIE = 'gm_session';

// Rutas admin que NO requieren sesión (página de login y assets de login).
const ADMIN_PUBLIC = new Set(['/admin/login']);

// Helper: agregar headers de seguridad + Vary a una Response.
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

  // Vary: Accept-Encoding — necesario para que el edge cache de Cloudflare
  // guarde variantes separadas (gzip vs brotli vs identity) y no sirva la
  // versión equivocada cuando el cliente cambia su Accept-Encoding.
  const existingVary = headers.get('Vary') ?? '';
  if (!existingVary.toLowerCase().includes('accept-encoding')) {
    headers.set('Vary', existingVary ? `${existingVary}, Accept-Encoding` : 'Accept-Encoding');
  }

  // CSP: solo para respuestas HTML. Permite inline styles y scripts propios.
  if (contentType && contentType.includes('text/html')) {
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://guardman.oficinadesarrollo33.workers.dev https://static.cloudflareinsights.com",
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
  // Cloudflare runtime wrappea el response con auto-compression nativa
  // (gzip/brotli) según `Accept-Encoding` del cliente, agregando
  // `Content-Encoding` correctamente. NO comprimimos acá para evitar
  // doble compression → garbage en el browser.
  const response = await next();

  // ── Agregar headers de seguridad + Vary ────────────────────────
  return addSecurityHeaders(response, response.headers.get('Content-Type'));
});
