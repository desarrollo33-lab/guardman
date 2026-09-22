// ════════════════════════════════════════════════════════════════
// /api/logout — POST { refresh_token? } → { ok: true }
//
// Marca el refresh_token como revocado en D1. Es idempotente: si
// el token no existe o ya estaba revocado, devuelve ok igualmente.
// El cookie httpOnly lo limpia el frontend llamando a /api/admin/session
// con method DELETE.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import {
  errJson,
  jsonResponse,
  revokeRefreshTokenByHash,
  sha256Hex,
  verifyJwt,
  type RefreshTokenPayload,
} from '../../lib/auth-server';

export const prerender = false;

interface LogoutBody {
  refresh_token?: unknown;
}

export const POST: APIRoute = async ({ request }) => {
  let body: LogoutBody = {};
  try {
    if (request.headers.get('content-length') && request.headers.get('content-length') !== '0') {
      body = (await request.json()) as LogoutBody;
    }
  } catch {
    return errJson('JSON inválido.', 400);
  }

  const token = typeof body.refresh_token === 'string' ? body.refresh_token : '';
  if (!token) return jsonResponse({ ok: true });

  const payload = await verifyJwt<RefreshTokenPayload>(token);
  if (payload && payload.type === 'refresh') {
    const tokenHash = await sha256Hex(token);
    await revokeRefreshTokenByHash(tokenHash);
  }
  return jsonResponse({ ok: true });
};
