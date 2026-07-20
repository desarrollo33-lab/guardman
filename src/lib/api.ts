// ════════════════════════════════════════════════════════════════
// GuardMan — Cliente HTTP unificado para el Worker API (v4.0 — CRM-only).
// Maneja access token JWT (2h) + refresh token automático en 401.
// Solo endpoints CRM de leads. Sin cms/media/clients/proposals.
// ════════════════════════════════════════════════════════════════

import { SITE, API_TIMEOUT_MS } from './constants';
import { getToken, getRefreshToken, setToken, clearToken, needsRefresh } from './auth';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let refreshInflight: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshInflight) return refreshInflight;
  const rt = getRefreshToken();
  if (!rt) return null;
  refreshInflight = (async () => {
    try {
      const res = await fetch(`${SITE.API_URL}/api/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: rt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        clearToken();
        return null;
      }
      const payload = (data.data ?? data) as {
        access_token?: string;
        refresh_token?: string;
        token?: string;
      };
      const access = payload.access_token ?? payload.token;
      const refresh = payload.refresh_token ?? rt;
      if (!access) {
        clearToken();
        return null;
      }
      setToken(access, refresh);
      return access;
    } catch {
      return null;
    } finally {
      setTimeout(() => { refreshInflight = null; }, 0);
    }
  })();
  return refreshInflight;
}

async function ensureFreshToken(): Promise<string | null> {
  const cur = getToken();
  if (!cur) return null;
  if (needsRefresh()) {
    const refreshed = await tryRefresh();
    return refreshed ?? cur;
  }
  return cur;
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = await ensureFreshToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(`${SITE.API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (res.status === 401 && retry) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return request<T>(path, options, false);
      }
      clearToken();
      throw new ApiError('Sesión expirada. Vuelve a iniciar sesión.', 401, path);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new ApiError(
        data.error ?? `Error ${res.status} en ${path}`,
        res.status,
        path,
      );
    }
    return unwrapResponse(data) as T;
  } finally {
    clearTimeout(timeout);
  }
}

// Unwrap genérico para cualquier envelope del backend.
function unwrapResponse<T = unknown>(r: unknown): T {
  if (!r || typeof r !== 'object') return r as T;
  const obj = r as Record<string, unknown>;
  if ('ok' in obj) {
    const { ok, ...rest } = obj;
    const keys = Object.keys(rest);
    if (keys.length === 1) return rest[keys[0]] as T;
    return rest as T;
  }
  return r as T;
}

export const auth = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token?: string; refresh_token?: string; user: { email: string } }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => clearToken(),
  refresh: () => tryRefresh(),
};

// CRM — solo gestión de leads (sin clients, proposals, quotes).
export const crm = {
  dashboard: () => request('/api/crm/dashboard'),
  pipeline: () => request('/api/crm/pipeline'),
  leads: {
    list: () => request('/api/crm/leads'),
    get: (id: string) => request(`/api/crm/leads/${id}`),
    create: (data: unknown) =>
      request('/api/crm/leads', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      request(`/api/crm/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/api/crm/leads/${id}`, { method: 'DELETE' }),
    capture: (data: unknown) =>
      request('/api/crm/leads/capture', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export const imageUrl = (key: string) => `${SITE.API_URL}/api/images/${key}`;
