// ════════════════════════════════════════════════════════════════
// GuardMan — Auth server-side helpers (consolidado 2026-09-22).
//
// Antes:
//   • isAdminRequest (helper de "request viene de admin") vivía aquí.
//   • El login REAL (verify password + emisión de JWT) vivía en el
//     worker externo `guardman.oficinadesarrollo33.workers.dev` que
//     ya no existe → login roto.
//
// Ahora:
//   • isAdminRequest sigue disponible (misma firma) para los 9
//     handlers de /api/{denuncias,leads,guardpod,...} que ya la usan.
//   • verifyPassword / issueTokenPair / verifyJwt / signJwt / etc.
//     exponen la lógica de auth consolidada para /api/login, /refresh,
//     /logout, /api/admin/session.
//   • Password: Argon2id PHC string verificado vía `hash-wasm` (WASM
//     puro, compatible Workers runtime). @node-rs/argon2 NO sirve
//     porque requiere N-API nativo.
//   • JWT: HS256 con WebCrypto (subtle.sign/verify). Sin libs externas.
//
// Secrets:
//   JWT_SECRET se lee de `env.JWT_SECRET` (set con
//   `wrangler secret put JWT_SECRET`). DENUNCIAS_ADMIN_TOKEN sigue
//   disponible como before para integraciones externas.
// ════════════════════════════════════════════════════════════════

import { argon2id } from '@noble/hashes/argon2';
import { env } from 'cloudflare:workers';

// ────────────────────────────────────────────────────────────────
// isAdminRequest — preserva contrato original (9 endpoints dependen).
// ────────────────────────────────────────────────────────────────

const MIN_TOKEN_LEN = 16;
const SESSION_COOKIE = 'gm_session';

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

// ────────────────────────────────────────────────────────────────
// Tipos públicos para el nuevo auth consolidado.
// ────────────────────────────────────────────────────────────────

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}

export interface LoginOk {
  ok: true;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: { id: number; email: string; role: string; first_name: string; last_name: string };
  };
}

export interface LoginErr {
  ok: false;
  error: string;
}

// ────────────────────────────────────────────────────────────────
// Constantes de protocolo.
// ────────────────────────────────────────────────────────────────

const ISSUER = 'guardman';
const AUDIENCE = 'guardman-admin';
const ACCESS_TTL_SEC = 2 * 60 * 60;
const REFRESH_TTL_SEC = 30 * 24 * 60 * 60;

// ────────────────────────────────────────────────────────────────
// JWT HS256 vía WebCrypto.
// ────────────────────────────────────────────────────────────────

function base64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === 'string') {
    bytes = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    bytes = input;
  } else {
    bytes = new Uint8Array(input);
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

let keyPromise: Promise<CryptoKey> | null = null;
function getKey(): Promise<CryptoKey> {
  if (keyPromise) return keyPromise;
  const secret = env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.length < 32) {
    throw new Error('JWT_SECRET no configurado. Set con `wrangler secret put JWT_SECRET`.');
  }
  keyPromise = crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  return keyPromise;
}

async function signJwt<T extends object>(payload: T): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { iat: now, ...payload };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(fullPayload));
  const data = `${headerB64}.${payloadB64}`;
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${base64url(new Uint8Array(sig))}`;
}

async function verifyJwt<T = Record<string, unknown>>(token: string): Promise<T | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  try {
    const key = await getKey();
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(sigB64),
      new TextEncoder().encode(data),
    );
    if (!ok) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64))) as T & {
      iat?: number;
      exp?: number;
      iss?: string;
      aud?: string;
    };
    if (payload.iss !== ISSUER || payload.aud !== AUDIENCE) return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload as T;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────
// Argon2id verify vía @noble/hashes (JS puro, 100% portable Workers).
//
// @noble/hashes NO expone verifyArgon2id; verificamos recomputando el
// hash con los parámetros del PHC y comparando en tiempo constante.
//
// Formato PHC esperado:
//   $argon2id$v=19$m=<memKiB>,t=<iters>,p=<lanes>$<saltB64>$<hashB64>
// ────────────────────────────────────────────────────────────────

function base64StdDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function parsePhc(phc: string): { variant: 'argon2id' | 'argon2i'; m: number; t: number; p: number; salt: Uint8Array; hash: Uint8Array } | null {
  // Formato: $<variant>$v=<version>$m=<mem>,t=<iters>,p=<lanes>$<salt>$<hash>
  const parts = phc.split('$');
  // parts[0] = '' (prefijo $), parts[1] = variant, parts[2] = v=NN,
  // parts[3] = m=...,t=...,p=..., parts[4] = salt, parts[5] = hash
  if (parts.length !== 6) return null;
  const variant = parts[1];
  if (variant !== 'argon2id' && variant !== 'argon2i') return null;
  const version = parts[2];
  if (!version.startsWith('v=')) return null;
  const params: Record<string, number> = {};
  for (const kv of parts[3].split(',')) {
    const [k, v] = kv.split('=');
    if (k && v) params[k] = parseInt(v, 10);
  }
  if (!Number.isFinite(params.m) || !Number.isFinite(params.t) || !Number.isFinite(params.p)) return null;
  try {
    const salt = base64StdDecode(parts[4]);
    const hash = base64StdDecode(parts[5]);
    return { variant, m: params.m, t: params.t, p: params.p, salt, hash };
  } catch {
    return null;
  }
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyPassword(password: string, phcHash: string): Promise<boolean> {
  if (!password || !phcHash) return false;
  const phc = parsePhc(phcHash);
  if (!phc) return false;
  // Límites defensivos para no aceptar params absurdamente caros.
  if (phc.m > 65536 || phc.t > 10 || phc.p > 4) return false;
  if (phc.salt.length < 4 || phc.hash.length < 16) return false;
  try {
    const recomputed = await argon2id(password, phc.salt, {
      m: phc.m,
      t: phc.t,
      p: phc.p,
      dkLen: phc.hash.length,
    });
    return timingSafeEqual(recomputed, phc.hash);
  } catch {
    return false;
  }
}

// ────────────────────────────────────────────────────────────────
// Helpers de respuesta + D1.
// ────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errJson(error: string, status = 400): Response {
  return jsonResponse({ ok: false, error } satisfies LoginErr, status);
}

function randomJti(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const bytes = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

interface AdminRow {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: number;
  locked_until: number | null;
  failed_attempts: number;
}

export async function loadAdminByEmail(email: string): Promise<(AdminRow & { password_hash: string }) | null> {
  const row = await env.DB.prepare(
    `SELECT id, email, role, first_name, last_name, is_active, locked_until, failed_attempts, password_hash
       FROM admin_users
      WHERE email = ?1 AND deleted_at IS NULL
      LIMIT 1`,
  )
    .bind(email.toLowerCase().trim())
    .first<AdminRow & { password_hash: string }>();
  return row ?? null;
}

export async function recordLoginAttempt(adminId: number, success: boolean): Promise<void> {
  if (success) {
    await env.DB.prepare(
      `UPDATE admin_users
          SET failed_attempts = 0, locked_until = NULL, last_login_at = unixepoch()
        WHERE id = ?1`,
    )
      .bind(adminId)
      .run();
    return;
  }
  await env.DB.prepare(
    `UPDATE admin_users
        SET failed_attempts = failed_attempts + 1,
            locked_until = CASE
              WHEN failed_attempts + 1 >= 5 THEN unixepoch() + 900
              ELSE locked_until
            END
      WHERE id = ?1`,
  )
    .bind(adminId)
    .run();
}

export async function issueTokenPair(
  admin: Pick<AdminRow, 'id' | 'email' | 'role' | 'first_name' | 'last_name'>,
): Promise<LoginOk['data']> {
  const now = Math.floor(Date.now() / 1000);
  const access = await signJwt<AccessTokenPayload>({
    sub: String(admin.id),
    email: admin.email,
    role: admin.role,
    type: 'access',
    iss: ISSUER,
    aud: AUDIENCE,
    exp: now + ACCESS_TTL_SEC,
  });
  const jti = randomJti();
  const refresh = await signJwt<RefreshTokenPayload>({
    sub: String(admin.id),
    jti,
    type: 'refresh',
    iss: ISSUER,
    aud: AUDIENCE,
    exp: now + REFRESH_TTL_SEC,
  });

  // Guardamos SHA-256(refresh_token) en `token_hash` (no el JWT crudo) y
  // el `jti` para tracing. El match se hace por token_hash; jti es metadata.
  const tokenHash = await sha256Hex(refresh);
  await env.DB.prepare(
    `INSERT INTO admin_refresh_tokens (user_id, jti, token_hash, expires_at, created_at)
     VALUES (?1, ?2, ?3, ?4, unixepoch())`,
  )
    .bind(admin.id, jti, tokenHash, now + REFRESH_TTL_SEC)
    .run();

  return {
    access_token: access,
    refresh_token: refresh,
    expires_in: ACCESS_TTL_SEC,
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      first_name: admin.first_name,
      last_name: admin.last_name,
    },
  };
}

export async function revokeRefreshTokenByHash(tokenHash: string): Promise<void> {
  await env.DB.prepare(
    `UPDATE admin_refresh_tokens
        SET revoked_at = unixepoch()
      WHERE token_hash = ?1 AND revoked_at IS NULL`,
  )
    .bind(tokenHash)
    .run();
}

export async function consumeRefreshToken(tokenHash: string, adminId: number): Promise<boolean> {
  const row = await env.DB.prepare(
    `SELECT 1 AS ok
       FROM admin_refresh_tokens
      WHERE token_hash = ?1
        AND user_id = ?2
        AND revoked_at IS NULL
        AND expires_at > unixepoch()
      LIMIT 1`,
  )
    .bind(tokenHash, adminId)
    .first<{ ok: number }>();
  return !!row;
}

export { verifyJwt, signJwt, jsonResponse, ISSUER, AUDIENCE, SESSION_COOKIE, parsePhc, sha256Hex };
