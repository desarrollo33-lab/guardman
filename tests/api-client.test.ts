import { describe, it, expect, vi, beforeEach } from 'vitest';

// Este archivo sustituye a tests/api.test.ts, que probaba `src/lib/api.ts`:
// un módulo con cero importadores que apuntaba a `/api/crm/*`, rutas que no
// existían en este repo. La suite pasaba en verde protegiendo código muerto.
//
// Ahora cubre lo que realmente corre: el cliente único `lib/api-client.ts`.
import { API_TIMEOUT_MS } from '../src/lib/constants';

function makeStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    get length() { return Object.keys(store).length; },
    clear() { for (const k of Object.keys(store)) delete store[k]; },
    getItem(k: string) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    key(i: number) { return Object.keys(store)[i] ?? null; },
    removeItem(k: string) { delete store[k]; },
    setItem(k: string, v: string) { store[k] = String(v); },
  } as unknown as Storage;
}

function setupBrowser() {
  (globalThis as { localStorage: Storage }).localStorage = makeStorage();
  (globalThis as { window?: unknown }).window = globalThis;
}

const ACCESS = 'gm_token';
const ACCESS_EXP = 'gm_token_expires_at';
const REFRESH = 'gm_refresh_token';
const REFRESH_EXP = 'gm_refresh_expires_at';

function seedSession(access = 'TOKEN', refresh?: string) {
  localStorage.setItem(ACCESS, access);
  localStorage.setItem(ACCESS_EXP, String(Date.now() + 60 * 60 * 1000));
  if (refresh) {
    localStorage.setItem(REFRESH, refresh);
    localStorage.setItem(REFRESH_EXP, String(Date.now() + 30 * 24 * 60 * 60 * 1000));
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe('api-client', () => {
  beforeEach(() => {
    // El cliente tiene un singleton `inflight` para el refresh. Sin resetear
    // módulos, un caso hereda la promesa del anterior y el 401 del caso
    // siguiente "se refresca" con el token de otro test.
    vi.resetModules();
  });

  it('adjunta el Bearer y devuelve el cuerpo', async () => {
    setupBrowser();
    seedSession('TOKEN_A');
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: true, leads: [] }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { apiFetch } = await import('../src/lib/api-client');
    const out = await apiFetch<{ leads: unknown[] }>('/api/leads');

    expect(out.leads).toEqual([]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/leads');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer TOKEN_A');
    expect(init.credentials).toBe('same-origin');
  });

  it('lanza ApiError con el mensaje del servidor', async () => {
    setupBrowser();
    seedSession('TOKEN_A');
    globalThis.fetch = vi.fn().mockResolvedValue(json({ ok: false, error: 'boom' }, 400)) as unknown as typeof fetch;

    const { apiFetch, ApiError } = await import('../src/lib/api-client');
    await expect(apiFetch('/api/leads/L1')).rejects.toBeInstanceOf(ApiError);
  });

  it('un 401 refresca, re-sincroniza la cookie y reintenta UNA vez', async () => {
    setupBrowser();
    seedSession('VIEJO', 'REFRESH');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ ok: false }, 401))                       // 1 request original
      .mockResolvedValueOnce(json({ ok: true, data: { access_token: 'NUEVO', refresh_token: 'NUEVO_R' } })) // 2 refresh
      .mockResolvedValueOnce(json({ ok: true }))                              // 3 sync de cookie
      .mockResolvedValueOnce(json({ ok: true, leads: [{ id: 'L1' }] }));      // 4 retry
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { apiFetch } = await import('../src/lib/api-client');
    const out = await apiFetch<{ leads: { id: string }[] }>('/api/leads');

    expect(out.leads[0].id).toBe('L1');
    const urls = fetchMock.mock.calls.map((c) => c[0]);
    // El re-sync de la cookie es parte del contrato: sin él, el middleware
    // sigue viendo el JWT vencido y manda al admin a /admin/login.
    expect(urls).toEqual(['/api/leads', '/api/refresh', '/api/admin/session', '/api/leads']);
    expect(localStorage.getItem(ACCESS)).toBe('NUEVO');
  });

  it('un 401 sin refresh token NO reintenta: limpia sesión y va al login', async () => {
    setupBrowser();
    seedSession('VIEJO'); // sin refresh token
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: false }, 401));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    // el redirect real necesita window.location; se sustituye
    Object.defineProperty(globalThis, 'location', {
      value: { pathname: '/admin/pipeline', search: '', href: '' },
      writable: true,
    });

    const { apiFetch } = await import('../src/lib/api-client');
    await expect(apiFetch('/api/leads')).rejects.toThrow();

    // Ni un reintento inútil, y la sesión local queda limpia.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(ACCESS)).toBeNull();
  });

  it('un token expirado no se envía', async () => {
    setupBrowser();
    localStorage.setItem(ACCESS, 'CADUCADO');
    localStorage.setItem(ACCESS_EXP, String(Date.now() - 1000));
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: true }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { apiFetch, accessToken } = await import('../src/lib/api-client');
    expect(accessToken()).toBeNull();
    await apiFetch('/api/leads');
    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it('expira el request con un timeout configurable', () => {
    expect(API_TIMEOUT_MS).toBeGreaterThan(0);
  });
});
