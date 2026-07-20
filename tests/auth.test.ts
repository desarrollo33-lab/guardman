import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Provide a working localStorage on globalThis so the auth module's
// `localStorage.*` calls resolve to our in-memory store. This avoids
// relying on jsdom being properly wired in the worker process.
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

beforeEach(() => {
  (globalThis as { localStorage: Storage }).localStorage = makeStorage();
  (globalThis as { window?: unknown }).window = globalThis;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('auth', () => {
  it('returns null when no token is set', async () => {
    const { getToken } = await import('../src/lib/auth');
    expect(getToken()).toBeNull();
  });

  it('stores and retrieves access + refresh tokens with TTL', async () => {
    const { setToken, getToken, getRefreshToken, needsRefresh } = await import('../src/lib/auth');
    setToken('access-123', 'refresh-456');
    expect(getToken()).toBe('access-123');
    expect(getRefreshToken()).toBe('refresh-456');
    // 2h access + 5min buffer => needsRefresh false right after setting
    expect(needsRefresh()).toBe(false);
  });

  it('treats "undefined" / "null" strings as no token and cleans up', async () => {
    const { setToken, getToken, clearToken } = await import('../src/lib/auth');
    localStorage.setItem('gm_token', 'undefined');
    expect(getToken()).toBeNull();
    setToken('real-token');
    localStorage.setItem('gm_token', 'null');
    expect(getToken()).toBeNull();
    expect(localStorage.getItem('gm_token')).toBeNull();
    clearToken();
  });

  it('expires access token after 2h', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-13T10:00:00Z'));
    const { setToken, getToken, needsRefresh } = await import('../src/lib/auth');
    setToken('a', 'r');
    expect(getToken()).toBe('a');
    // 2h + 1 min => expired
    vi.setSystemTime(new Date('2026-07-13T12:01:00Z'));
    expect(getToken()).toBeNull();
    // 1h 55min => within buffer => needsRefresh true
    vi.setSystemTime(new Date('2026-07-13T10:00:00Z'));
    setToken('a2', 'r2');
    vi.setSystemTime(new Date('2026-07-13T11:56:00Z'));
    expect(getToken()).toBe('a2');
    expect(needsRefresh()).toBe(true);
  });

  it('clearToken wipes both access and refresh', async () => {
    const { setToken, clearToken, getToken, getRefreshToken } = await import('../src/lib/auth');
    setToken('a', 'r');
    clearToken();
    expect(getToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
