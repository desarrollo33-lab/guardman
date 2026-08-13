// ════════════════════════════════════════════════════════════════
// GuardMan — Middleware SSR
//   1. Auth server-side para rutas /admin/* (excepto /admin/login)
//      Verifica cookie httpOnly `gm_session`. Sin cookie → 302 a /admin/login.
//   2. Headers de seguridad en TODAS las respuestas.
// ════════════════════════════════════════════════════════════════

import { defineMiddleware } from 'astro:middleware';

const SESSION_COOKIE = 'gm_session';

// Rutas admin que NO requieren sesión (página de login y assets de login).
const ADMIN_PUBLIC = new Set(['/admin/login']);

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
      // Acepta JWT (3 segmentos) o token opaco (base64url alfanumérico).
      // Mínimo 16 chars para reducir tokens triviales.
      const SESSION_RE = /^[A-Za-z0-9_.\-]{16,}$/;
      if (!cookie || !cookie.value || !SESSION_RE.test(cookie.value)) {
        // Redirigir a /admin/login con el path original como query param.
        const redirect = encodeURIComponent(pathname + url.search);
        return context.redirect(`/admin/login?redirect=${redirect}`, 302);
      }
    }
  }

  // ── Continuar con la request ───────────────────────────────────
  const response = await next();

  // ── Agregar headers de seguridad a la respuesta ────────────────
  return addSecurityHeaders(response, response.headers.get('Content-Type'));
});
