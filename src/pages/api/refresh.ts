// ════════════════════════════════════════════════════════════════
// /api/refresh — POST { refresh_token } → { access_token, refresh_token }
//
// Implementa refresh-token rotation: el refresh presentado se marca
// como consumido y se emite un par nuevo. Si el refresh ya estaba
// revocado o expirado, se devuelve 401.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import {
  consumeRefreshToken,
  errJson,
  issueTokenPair,
  jsonResponse,
  revokeRefreshTokenByHash,
  sha256Hex,
  verifyJwt,
  type RefreshTokenPayload,
} from '../../lib/auth-server';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface RefreshBody {
  refresh_token?: unknown;
}

export const POST: APIRoute = async ({ request }) => {
  let body: RefreshBody;
  try {
    body = (await request.json()) as RefreshBody;
  } catch {
    return errJson('JSON inválido.', 400);
  }
  const token = typeof body.refresh_token === 'string' ? body.refresh_token : '';
  if (!token) return errJson('refresh_token requerido.', 400);

  const payload = await verifyJwt<RefreshTokenPayload>(token);
  if (!payload || payload.type !== 'refresh') {
    return errJson('Refresh token inválido.', 401);
  }

  const adminId = Number(payload.sub);
  if (!Number.isInteger(adminId) || adminId <= 0) {
    return errJson('Refresh token inválido.', 401);
  }

  const tokenHash = await sha256Hex(token);
  const stillValid = await consumeRefreshToken(tokenHash, adminId);
  if (!stillValid) {
    return errJson('Refresh token expirado o revocado.', 401);
  }

  // Cargar user para emitir el par nuevo.
  const admin = await env.DB.prepare(
    `SELECT id, email, role, first_name, last_name
       FROM admin_users
      WHERE id = ?1 AND deleted_at IS NULL AND is_active = 1
      LIMIT 1`,
  )
    .bind(adminId)
    .first<{ id: number; email: string; role: string; first_name: string; last_name: string }>();
  if (!admin) {
    await revokeRefreshTokenByHash(tokenHash);
    return errJson('Cuenta deshabilitada.', 403);
  }

  // Rotation: revocar el viejo y emitir uno nuevo.
  await revokeRefreshTokenByHash(tokenHash);
  const tokens = await issueTokenPair(admin);
  return jsonResponse({ ok: true, data: tokens });
};
