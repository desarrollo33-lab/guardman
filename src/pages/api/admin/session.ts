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

const isValidJwtShape = (t: string): boolean =>
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(t);

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

  if (!body.token || !isValidJwtShape(body.token)) {
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
