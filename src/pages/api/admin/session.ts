// ════════════════════════════════════════════════════════════════
// /api/admin/session — gestión de cookie de sesión server-side
//   POST   : recibe { token, refresh? } y setea cookie httpOnly gm_session
//   DELETE : limpia la cookie
//
// La cookie NO firma el JWT. Solo transporta la presencia de un token
// válido. La verificación real de la firma la hace el Worker API externo
// (`guardman.oficinadesarrollo33.workers.dev`) en cada llamada.
// Esto bloquea el acceso SSR a /admin/* sin cookie, pero NO convierte
// al worker astro en validador de tokens del worker API.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';

export const prerender = false;

const SESSION_COOKIE = 'gm_session';
// 2h, igual que el access token en src/lib/auth.ts.
const SESSION_MAX_AGE = 2 * 60 * 60;

// Validación mínima: solo longitud. El token real lo verifica el Worker API
// externo en cada llamada. Aceptar cualquier string de 16+ chars (incluso
// con caracteres especiales) es seguro porque:
//   1. La cookie es httpOnly + Secure + SameSite=Lax.
//   2. La verificación real del token (firma, expiración) la hace el
//      Worker API externo al hacer fetch con Authorization: Bearer.
//   3. El panel admin no llama al Worker API externo para nada (todo es
//      local en este worker); la cookie solo desbloquea el SSR.
const MIN_TOKEN_LEN = 16;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { token?: string; refresh?: string };
  try {
    body = (await request.json()) as { token?: string; refresh?: string };
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'JSON inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.token || typeof body.token !== 'string' || body.token.length < MIN_TOKEN_LEN) {
    return new Response(JSON.stringify({ ok: false, error: 'Token inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cookies.set(SESSION_COOKIE, body.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
