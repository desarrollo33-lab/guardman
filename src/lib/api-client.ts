// ════════════════════════════════════════════════════════════════
// GuardMan — Cliente HTTP único del panel admin.
//
// Reemplaza a los `fetch` sueltos que cada isla repetía y al módulo
// `api.ts` que existía para esto pero quedó muerto (cero importadores).
//
// Por qué este módulo existe — el problema que resuelve:
//   La cookie `gm_session` y el access token expiran a las 2h. Cuando eso
//   pasaba, cada isla hacía `fetch('/api/leads')`, recibía 401 y lo pintaba
//   como `Error 401` en un cartel, con un botón "Reintentar" que repetía
//   exactamente la misma llamada. El Dashboard incluso reintentaba cada 30s,
//   para siempre. El admin tenía que dejar el panel y volver a /admin/login
//   a mano. El único código que refrescaba el token y re-sincronizaba la
//   cookie (`tryRefresh` + `syncSessionCookie` del viejo `api.ts`) no lo
//   llamaba nadie.
//
// La interfaz es deliberadamente chica: una función. Todo lo demás —token,
// refresh con single-flight, re-sync de la cookie, timeout, redirección al
// login— vive detrás.
// ════════════════════════════════════════════════════════════════

import { API_TIMEOUT_MS } from './constants';

const ACCESS_TOKEN_KEY = 'gm_token';
const ACCESS_EXPIRY_KEY = 'gm_token_expires_at';
const REFRESH_TOKEN_KEY = 'gm_refresh_token';
const REFRESH_EXPIRY_KEY = 'gm_refresh_expires_at';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Almacenamiento de token ─────────────────────────────────────
// Las claves viven acá y en `login.astro`. Si cambian, cambian las dos.

function readToken(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(key);
  return !v || v === 'undefined' || v === 'null' ? null : v;
}

export function accessToken(): string | null {
  const t = readToken(ACCESS_TOKEN_KEY);
  if (!t) return null;
  const exp = Number(localStorage.getItem(ACCESS_EXPIRY_KEY) ?? 0);
  if (exp && Date.now() > exp) return null;
  return t;
}

function refreshToken(): string | null {
  const t = readToken(REFRESH_TOKEN_KEY);
  if (!t) return null;
  const exp = Number(localStorage.getItem(REFRESH_EXPIRY_KEY) ?? 0);
  if (exp && Date.now() > exp) return null;
  return t;
}

/** Vacia la sesión local. No toca el servidor: para eso está `logout()`. */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  for (const k of [ACCESS_TOKEN_KEY, ACCESS_EXPIRY_KEY, REFRESH_TOKEN_KEY, REFRESH_EXPIRY_KEY]) {
    localStorage.removeItem(k);
  }
}

// ── Refresh con single-flight ───────────────────────────────────
// Varias islas hacen fetch a la vez (Dashboard refresca cada 30s, Inbox
// y LeadsList al montar). Sin este candado serían N POST a /api/refresh
// simultáneos y, con rotación de tokens, el primero ganaría y los otros
// N-1 serían rechazados por token ya consumido → cierre de sesión.
let inflight: Promise<string | null> | null = null;

async function refresh(): Promise<string | null> {
  if (inflight) return inflight;
  const rt = refreshToken();
  if (!rt) return null;

  inflight = (async () => {
    try {
      const res = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ refresh_token: rt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) return null;

      const p = (data.data ?? data) as { access_token?: string; refresh_token?: string };
      if (!p.access_token) return null;

      const now = Date.now();
      localStorage.setItem(ACCESS_TOKEN_KEY, p.access_token);
      localStorage.setItem(ACCESS_EXPIRY_KEY, String(now + 2 * 60 * 60 * 1000));
      if (p.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, p.refresh_token);
        localStorage.setItem(REFRESH_EXPIRY_KEY, String(now + 30 * 24 * 60 * 60 * 1000));
      }

      // La cookie `gm_session` lleva el access token y la valida el
      // middleware en cada navegación a /admin/*. Si refrescamos el token y
      // no la re-emitimos, la cookie queda con el JWT vencido: el panel sigue
      // funcionando por API (va el Bearer) pero cualquier carga de página
      // manda al login. Fire-and-forget, igual que tras el login.
      void fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ token: p.access_token }),
      }).catch(() => {});

      return p.access_token;
    } catch {
      return null;
    } finally {
      setTimeout(() => { inflight = null; }, 0);
    }
  })();

  return inflight;
}

// ── Sesión terminada ───────────────────────────────────────────
// Un 401 que no se puede refrescar significa que la sesión murió de verdad.
// Antes cada isla lo pintaba como error y ofrecía reintentar. Lo correcto es
// limpiar y llevar al login, que es el único camino que arregla algo.
function sessionExpired(): never {
  clearSession();
  if (typeof window !== 'undefined') {
    const back = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/admin/login?redirect=${back}`;
  }
  throw new ApiError('Sesión expirada. Vuelve a iniciar sesión.', 401);
}

// ── Interfaz pública ───────────────────────────────────────────

/**
 * Pide al API del panel con la sesión del admin.
 * Reintenta una vez tras refrescar; si tampoco, cierra la sesión y redirige.
 * Lanza `ApiError` con el mensaje del servidor.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = accessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(path, {
      ...options,
      credentials: 'same-origin',
      headers,
      signal: controller.signal,
    });

    if (res.status === 401 && retry) {
      const fresh = await refresh();
      if (fresh) return apiFetch<T>(path, options, false);
      sessionExpired();
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data as { ok?: boolean }).ok === false) {
      throw new ApiError(
        (data as { error?: string }).error ?? `Error ${res.status} en ${path}`,
        res.status,
        path,
      );
    }
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}
