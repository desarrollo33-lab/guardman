import { describe, it, expect, beforeEach, vi } from 'vitest';

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
  globalThis.fetch = vi.fn();
});

describe('api', () => {
  it('attaches Bearer token and parses response data', async () => {
    const { setToken } = await import('../src/lib/auth');
    setToken('TEST_TOKEN');
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true, data: { foo: 'bar' } }), { status: 200 }),
    );
    const { crm } = await import('../src/lib/api');
    const out = await crm.leads.get('L001');
    expect(out).toEqual({ foo: 'bar' });
    const call = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toMatch(/\/api\/crm\/leads\/L001$/);
    expect(call[1].headers.Authorization).toBe('Bearer TEST_TOKEN');
  });

  it('throws ApiError on non-2xx', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'boom' }), { status: 400 }),
    );
    const { crm, ApiError } = await import('../src/lib/api');
    await expect(crm.leads.get('L999')).rejects.toBeInstanceOf(ApiError);
  });

  it('attempts refresh on 401 once and retries', async () => {
    const { setToken } = await import('../src/lib/auth');
    setToken('OLD', 'REFRESH_TOKEN');
    (fetch as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: false }), { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, data: { access_token: 'NEW', refresh_token: 'NEW_R' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, data: { ok: true } }), { status: 200 }));
    const { crm } = await import('../src/lib/api');
    const out = await crm.leads.list();
    expect(out).toEqual({ ok: true });
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(3);
  });

  it('exports a helper to build image URLs from the API origin', async () => {
    const { imageUrl } = await import('../src/lib/api');
    expect(imageUrl('foo/bar.jpg')).toMatch(/\/api\/images\/foo\/bar\.jpg$/);
  });
});
