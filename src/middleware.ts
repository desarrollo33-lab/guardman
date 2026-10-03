// ════════════════════════════════════════════════════════════════
// GuardMan — Middleware SSR
//   1. Host canónico: todo hostname que no sea `guardman.cl` (el alias
//      `www.` y `*.workers.dev`) responde 301 al canónico, sin servir
//      contenido. Ver `src/lib/canonical-host.ts` para el porqué.
//   2. Auth server-side para rutas /admin/* (excepto /admin/login).
//      Verifica la firma del access token JWT en la cookie httpOnly
//      `gm_session`. Sin sesión válida → 302 a /admin/login.
//   3. NO comprimimos en el worker. Cloudflare Workers runtime YA hace
//      auto-compression en el edge de forma nativa (gzip/brotli según
//      `Accept-Encoding` del cliente) y agrega `Content-Encoding` correctamente.
//      Comprimir acá causa DOBLE compression: el browser descomprime UNA
//      capa y queda single-gzip sin header → garbage en pantalla.
//   4. Headers de seguridad en TODAS las respuestas.
//   5. Vary: Accept-Encoding para que el edge cache respete la codificación.
//   6. Link headers (RFC 8288) apuntando al manifiesto ARD y a /llms.txt.
// ════════════════════════════════════════════════════════════════

import { defineMiddleware } from 'astro:middleware';
import { verifyJwt } from './lib/auth-server';
import { canonicalRedirect, needsTrailingSlash } from './lib/canonical-host';
import { CONTENT_SIGNALS } from './lib/constants';

const SESSION_COOKIE = 'gm_session';

// Rutas admin que NO requieren sesión (página de login y assets de login).
const ADMIN_PUBLIC = new Set(['/admin/login']);

// Helper: agregar headers de seguridad + Vary a una Response.
const addSecurityHeaders = (
  response: Response,
  contentType: string | null,
  origin: string,
): Response => {
  const headers = new Headers(response.headers);

  // Charset a nivel HTTP para todo el texto. El sitio es UTF-8 y las páginas
  // ya lo declaran con <meta charset>, pero según el estándar la cabecera
  // gana sobre el meta: si el meta se moviera, o una respuesta se sirviera
  // sin él, los acentos y la ñ se verían rotos. Con `nosniff` ya activo, el
  // navegador no puede deducirlo, así que conviene declararlo una vez y
  // listo. El sitio entero es español, no hay variantes con otro charset.
  if (contentType && !/charset=/i.test(contentType)) {
    if (/^text\//i.test(contentType) || /^application\/(json|javascript|xml|ld\+json)/i.test(contentType)) {
      headers.set('Content-Type', `${contentType}; charset=utf-8`);
    }
  }

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

  // Content Signals (spec de Cloudflare/Akamai). La directiva ya estaba en el
  // cuerpo de robots.txt, pero el header es lo que un crawler lee en la página
  // concreta: sin él la política `ai-train=no` solo regía el archivo, no el
  // documento. `search=yes, ai-input=yes` mantiene abierta la citación por
  // asistentes, que es lo que el cliente pidió; `ai-train=no` cierra el uso para
  // entrenamiento. Medido 2026-10-03.
  if (contentType && contentType.includes('text/html')) {
    headers.set('Content-Signal', CONTENT_SIGNALS);
  }

  // CSP + Link: solo para respuestas HTML.
  if (contentType && contentType.includes('text/html')) {
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://static.cloudflareinsights.com",
        "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    );

    // Punteros de descubrimiento para agentes (RFC 8288). Un `Link` con
    // relaciones registradas y verificables: el sitio ya publica
    // /llms.txt y el manifiesto ARD, y antes nada apuntaba a ellos, así que
    // un crawler no tenía forma de saber que existían.
    //
    // Este bloque va en el middleware y no en `public/_headers` a propósito:
    // ese archivo sólo aplica a assets estáticos en Cloudflare y nunca
    // aparecería en una página SSR.
    headers.set('Link', [
      `<${origin}/.well-known/ard.json>; rel="ard"; type="application/ai-catalog+json"`,
      `<${origin}/llms.txt>; rel="describedby"; type="text/markdown"`,
    ].join(', '));
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

  // ── Host canónico: 301 sin servir contenido ───────────────────
  // Va PRIMERO, antes de la barra final, para que un enlace a un host no
  // canónico llegue al canónico en un solo salto en vez de encadenar dos
  // 301. La normalización de path la hace `canonicalRedirect` con la misma
  // regla que el bloque siguiente.
  const redirect = canonicalRedirect(url);
  if (redirect) {
    return context.redirect(redirect, 301);
  }

  // ── Trailing slash: una sola forma canónica ─────────────────────
  // El sitio declara barra final salvo la raíz. Las páginas de ruta dinámica ya
  // redirigían solas (307), pero las planas (`/contacto`) servían 200 tanto con
  // barra como sin ella, cada una declarando un canonical distinto. Esto
  // duplicaba 13 URLs. Se normaliza antes de cualquier otra lógica.
  // Verificado contra producción 2026-10-02.
  if (needsTrailingSlash(pathname)) {
    return context.redirect(`${pathname}/${url.search}`, 301);
  }

  // ── Auth check para rutas /admin/* ─────────────────────────────
  if (pathname.startsWith('/admin/') || pathname === '/admin') {
    const isPublic = ADMIN_PUBLIC.has(pathname.replace(/\/$/, '') || '/');
    if (!isPublic) {
      const cookie = context.cookies.get(SESSION_COOKIE);
      // La cookie transporta el access token JWT. Se verifica la firma con la
      // misma clave HMAC que lo emitió, con la misma validación que aplican
      // los endpoints de datos. Antes solo se miraba la longitud, así que
      // `/admin/*` se desbloqueaba con cualquier string de 16+ caracteres.
      const session = cookie?.value
        ? await verifyJwt<{ type?: string }>(cookie.value)
        : null;
      if (session?.type !== 'access') {
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
  return addSecurityHeaders(response, response.headers.get('Content-Type'), url.origin);
});
