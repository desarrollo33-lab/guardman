// ════════════════════════════════════════════════════════════════
// GuardMan — Auth server-side helpers
//   Helpers para verificar que una request viene de un admin logueado.
//   La verificación REAL del token (firma, expiración) la hace el
//   Worker API externo al hacer fetch con Authorization: Bearer.
//   Este worker solo valida que el token tenga una forma razonable.
// ════════════════════════════════════════════════════════════════

import { env } from 'cloudflare:workers';

const MIN_TOKEN_LEN = 16;
const SESSION_COOKIE = 'gm_session';

interface D1Database { /* placeholder, no usado en este helper */ }

/**
 * Verifica que una request viene de un admin autenticado.
 * Acepta:
 *   1. Cookie gm_session con un token de 16+ chars (validación de longitud).
 *   2. Header X-Admin-Token o Authorization: Bearer con DENUNCIAS_ADMIN_TOKEN
 *      (para integraciones externas / scripts CLI).
 */
export function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const sessionMatch = /(?:^|;\s*)gm_session=([^;]+)/.exec(cookieHeader);
  if (sessionMatch && sessionMatch[1].length >= MIN_TOKEN_LEN) {
    return true;
  }
  const adminToken = (env as { DENUNCIAS_ADMIN_TOKEN?: string }).DENUNCIAS_ADMIN_TOKEN;
  const headerToken = request.headers.get('x-admin-token') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (adminToken && headerToken === adminToken) return true;
  return false;
}
