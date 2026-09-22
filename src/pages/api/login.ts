// ════════════════════════════════════════════════════════════════
// /api/login — POST { email, password } → { access_token, refresh_token, user }
//
// Consolidado 2026-09-22. Antes vivía en un worker separado
// (`guardman.oficinadesarrollo33.workers.dev`) que ya no existe.
//
// El frontend espera el shape { ok, data: { access_token, refresh_token,
// expires_in, user } } o { ok: false, error }. Ver:
//   src/pages/admin/login.astro líneas 207-220
//   src/lib/api.ts líneas 130-140
//
// Rate-limit server-side (5 intentos fallidos → 15 min lockout) se aplica
// vía `failed_attempts` + `locked_until` en `admin_users`. El lockout
// client-side (localStorage) sigue activo como primera barrera.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';
import {
  issueTokenPair,
  loadAdminByEmail,
  recordLoginAttempt,
  verifyPassword,
  errJson,
  jsonResponse,
} from '../../lib/auth-server';

export const prerender = false;

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

export const POST: APIRoute = async ({ request }) => {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return errJson('JSON inválido.', 400);
  }

  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) {
    return errJson('Email y password son obligatorios.', 400);
  }
  if (password.length > 256 || email.length > 320) {
    return errJson('Credenciales fuera de rango.', 400);
  }

  const admin = await loadAdminByEmail(email);
  // Mensaje genérico para no filtrar si el email existe.
  const genericInvalid = () => errJson('Credenciales inválidas.', 401);

  if (!admin) {
    // Nota: timing-attack mitigation se delega al lockout client-side
    // (5 intentos/min, src/pages/admin/login.astro). Hacer un dummy
    // verify aquí puede tirar excepciones no capturables en Workers
    // runtime si el hash dummy no es PHC-válido.
    return genericInvalid();
  }

  if (admin.is_active !== 1) {
    return errJson('Cuenta deshabilitada. Contacta al administrador.', 403);
  }

  const now = Math.floor(Date.now() / 1000);
  if (admin.locked_until && admin.locked_until > now) {
    const mins = Math.ceil((admin.locked_until - now) / 60);
    return errJson(`Cuenta bloqueada por seguridad. Intenta en ${mins} min.`, 429);
  }

  const ok = await verifyPassword(password, admin.password_hash);
  if (!ok) {
    await recordLoginAttempt(admin.id, false);
    return genericInvalid();
  }

  await recordLoginAttempt(admin.id, true);
  const tokens = await issueTokenPair({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    first_name: admin.first_name,
    last_name: admin.last_name,
  });
  return jsonResponse({ ok: true, data: tokens });
};

