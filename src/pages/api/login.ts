// ════════════════════════════════════════════════════════════════
// /api/login — POST { email, password } → { access_token, refresh_token, user }
//
// Consolidado 2026-09-22. Antes vivía en un worker separado
// (`guardman.oficinadesarrollo33.workers.dev`) que ya no existe.
//
// El frontend espera el shape { ok, data: { access_token, refresh_token,
// expires_in, user } } o { ok: false, error }. Ver:
//   src/pages/admin/login.astro líneas 207-220
//   src/lib/api-client.ts (cliente HTTP único del panel)
//
// Rate-limit server-side (5 intentos fallidos → 15 min lockout) se aplica
// vía `failed_attempts` + `locked_until` en `admin_users`. El lockout
// client-side (localStorage) sigue activo como primera barrera.
// ════════════════════════════════════════════════════════════════

// Hash Argon2id descartable, con los mismos parámetros que los hashes reales
// del panel (m=64MiB, t=3, p=4) para que el tiempo de respuesta sea
// equivalente. No corresponde a ninguna contraseña: solo iguala el costo.
const DUMMY_PHC =
  '$argon2id$v=19$m=65536,t=3,p=4$zJzVTgRX9xkSmy46bJzqjg$ZLZVsO-WxF6RFD5RQEcpOU4BvxncCxzmkg6CGQiZVlE';

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
    return errJson('El correo electrónico y la contraseña son obligatorios.', 400);
  }
  if (password.length > 256 || email.length > 320) {
    return errJson('Credenciales fuera de rango.', 400);
  }

  const admin = await loadAdminByEmail(email);
  // Mensaje genérico para no filtrar si el email existe.
  const genericInvalid = () => errJson('Credenciales inválidas.', 401);

  if (!admin) {
    // Se verifica igual contra un hash descartable para que la respuesta
    // tarde lo mismo que con un email existente. Antes esto devolvía de
    // inmediato: postprobing emails candidatos y midiendo, todo admin
    // válido respondía ~100ms más lento — justo lo que después acota el
    // objetivo del ataque de fuerza bruta contra el lockout.
    //
    // verifyPassword ya valida el formato PHC y devuelve false ante
    // cualquier cosa rara, así que un hash inválido no puede tirar.
    await verifyPassword(password, DUMMY_PHC).catch(() => false);
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

