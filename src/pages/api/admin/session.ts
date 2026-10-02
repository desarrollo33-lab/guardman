// ════════════════════════════════════════════════════════════════
// /api/admin/session — gestión de cookie de sesión server-side
//   POST   : recibe { token, refresh? } y setea cookie httpOnly gm_session
//   DELETE : limpia la cookie
//
// La cookie transporta el access token JWT. El token se valida acá antes de
// emitir la cookie: si no fuera un access token firmado por este worker
// (firma, iss, aud, exp), no hay razón para abrir una sesión.
//
// Hasta 2026-10-02 el POST solo exigía longitud >= 16, lo que permitía emitir
// una cookie de sesión a partir de cualquier string. La cookie es httpOnly +
// Secure + SameSite=Lax, así que el daño se limitaba al panel; aun así, la
// verificación real ocurre en `isAdminRequest` en cada request a /api/*.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import { verifyJwt } from '../../../lib/auth-server';
import type { AccessTokenPayload } from '../../../lib/auth-server';

export const prerender = false;

const SESSION_COOKIE = 'gm_session';
// 2h, igual que el access token en src/lib/auth.ts.
const SESSION_MAX_AGE = 2 * 60 * 60;

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

  if (!body.token || typeof body.token !== 'string') {
    return new Response(JSON.stringify({ ok: false, error: 'Token inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Solo se abre sesión con un access token firmado por este worker.
  const payload = await verifyJwt<AccessTokenPayload>(body.token);
  if (payload?.type !== 'access') {
    return new Response(JSON.stringify({ ok: false, error: 'Token inválido.' }), {
      status: 401,
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
