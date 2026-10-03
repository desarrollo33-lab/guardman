// El sitio se publicaba en TRES hostnames públicos, no en uno.
//
//   guardman.cl                                        ← canónico
//   www.guardman.cl                                    ← alias, servía 200 duplicado
//   *.oficinadesarrollo33.workers.dev                  ← el worker, servía 200 duplicado
//
// Los tres entregaban el sitio completo con canonical a `guardman.cl`. Pero
// canonical es una sugerencia para Google, no una orden: cuando la URL de
// `workers.dev` ganaba la indexación aparecía en los resultados — que es lo
// que reportó el cliente. Y el hostname publica el nombre de la cuenta que
// hospeda el proyecto, que es información que un prospecto no debería leer.
//
// Estos tests fijan la invariante: **solo `guardman.cl` sirve contenido**, y
// los demás hosts responden 301 sin llegar a renderizar.
//
// El bloque del middleware importa el archivo real y verifica además que la
// redirección corta ANTES de `next()`. Un test que solo mirara la función
// pasaría en verde aunque el middleware no la llamara, que es exactamente el
// modo de fallo por el que este bug vivió meses sin detección.
import { describe, it, expect } from 'vitest';
import { onRequest } from '../src/middleware';
import {
  CANONICAL_HOST,
  CANONICAL_ORIGIN,
  canonicalRedirect,
  isNonCanonicalHost,
  needsTrailingSlash,
} from '../src/lib/canonical-host';
import { SITE } from '../src/lib/constants';

// ── Helpers ────────────────────────────────────────────────────

const runMiddleware = async (rawUrl: string) => {
  let nextCalled = false;

  const context = {
    request: new Request(rawUrl),
    url: new URL(rawUrl),
    cookies: { get: () => undefined },
    redirect: (path: string, status?: number) =>
      new Response(null, { status: status ?? 302, headers: { Location: path } }),
  } as unknown as Parameters<typeof onRequest>[0];

  const response = await onRequest(context, async () => {
    nextCalled = true;
    return new Response('<html>ok</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  return { status: response.status, location: response.headers.get('Location'), nextCalled };
};

// ── El origen canónico viene de una sola fuente ────────────────

describe('host canónico: origen único', () => {
  it('deriva el canónico de SITE.URL, no de una constante propia', () => {
    expect(CANONICAL_ORIGIN).toBe(new URL(SITE.URL).origin);
    expect(CANONICAL_HOST).toBe(new URL(SITE.URL).hostname);
  });

  it('el canónico es guardman.cl', () => {
    expect(CANONICAL_ORIGIN).toBe('https://guardman.cl');
    expect(CANONICAL_HOST).toBe('guardman.cl');
  });
});

// ── Qué hosts son no canónicos ─────────────────────────────────

describe('isNonCanonicalHost', () => {
  it('marca el alias www y el dominio workers.dev', () => {
    expect(isNonCanonicalHost('www.guardman.cl')).toBe(true);
    expect(isNonCanonicalHost('guardman-astro.oficinadesarrollo33.workers.dev')).toBe(true);
  });

  it('marca las URLs de preview, que también son públicas', () => {
    expect(isNonCanonicalHost('*-guardman-astro.oficinadesarrollo33.workers.dev')).toBe(true);
    expect(isNonCanonicalHost('abc123.guardman-astro.oficinadesarrollo33.workers.dev')).toBe(true);
  });

  it('deja pasar el canónico, localhost y 127.0.0.1 (dev y E2E)', () => {
    expect(isNonCanonicalHost('guardman.cl')).toBe(false);
    expect(isNonCanonicalHost('localhost')).toBe(false);
    expect(isNonCanonicalHost('127.0.0.1')).toBe(false);
  });

  it('no confunde host parecidos: un redirect por sufijo sería un open redirect', () => {
    expect(isNonCanonicalHost('guardman.cl.evil.example')).toBe(false);
    expect(isNonCanonicalHost('notguardman.cl')).toBe(false);
    expect(isNonCanonicalHost('guardman.cl.attacker.dev')).toBe(false);
    expect(isNonCanonicalHost('workers.dev')).toBe(false);
    expect(isNonCanonicalHost('xworkers.dev')).toBe(false);
  });
});

// ── Normalización de path ──────────────────────────────────────

describe('needsTrailingSlash', () => {
  it('exige barra final salvo en la raíz', () => {
    expect(needsTrailingSlash('/contacto')).toBe(true);
    expect(needsTrailingSlash('/')).toBe(false);
    expect(needsTrailingSlash('/servicios/')).toBe(false);
  });

  it('no toca assets, API ni archivos con extensión', () => {
    expect(needsTrailingSlash('/_astro/client.js')).toBe(false);
    expect(needsTrailingSlash('/api/health')).toBe(false);
    expect(needsTrailingSlash('/robots.txt')).toBe(false);
  });
});

describe('canonicalRedirect', () => {
  it('devuelve null para el host canónico', () => {
    expect(canonicalRedirect(new URL('https://guardman.cl/contacto'))).toBeNull();
  });

  it('aplica host y barra final en un solo salto', () => {
    expect(canonicalRedirect(new URL('https://www.guardman.cl/contacto')))
      .toBe('https://guardman.cl/contacto/');
  });

  it('conserva la query', () => {
    expect(canonicalRedirect(new URL('https://www.guardman.cl/servicios?g=seguridad')))
      .toBe('https://guardman.cl/servicios/?g=seguridad');
  });

  it('no toca paths que ya están normalizados', () => {
    expect(canonicalRedirect(new URL('https://www.guardman.cl/')))
      .toBe('https://guardman.cl/');
    expect(canonicalRedirect(new URL('https://guardman-astro.oficinadesarrollo33.workers.dev/robots.txt')))
      .toBe('https://guardman.cl/robots.txt');
  });
});

// ── El middleware real, no solo la función ─────────────────────

describe('middleware: host canónico', () => {
  it('www recibe 301 al canónico y NO renderiza', async () => {
    const r = await runMiddleware('https://www.guardman.cl/contacto');
    expect(r.status).toBe(301);
    expect(r.location).toBe('https://guardman.cl/contacto/');
    // La prueba anti-vacuo: si `next()` llegara a correr, el host no canónico
    // estaría entregando contenido indexable.
    expect(r.nextCalled).toBe(false);
  });

  it('workers.dev recibe 301 al canónico y NO renderiza', async () => {
    const r = await runMiddleware('https://guardman-astro.oficinadesarrollo33.workers.dev/servicios/');
    expect(r.status).toBe(301);
    expect(r.location).toBe('https://guardman.cl/servicios/');
    expect(r.nextCalled).toBe(false);
  });

  it('workers.dev también normaliza el path, sin encadenar dos 301', async () => {
    const r = await runMiddleware('https://guardman-astro.oficinadesarrollo33.workers.dev/contacto?a=1');
    expect(r.status).toBe(301);
    expect(r.location).toBe('https://guardman.cl/contacto/?a=1');
  });

  it('el canónico sigue sirviendo con 200', async () => {
    const r = await runMiddleware('https://guardman.cl/');
    expect(r.status).toBe(200);
    expect(r.location).toBeNull();
    expect(r.nextCalled).toBe(true);
  });

  it('la barra final en el canónico se sigue resolviendo, con Location relativa', async () => {
    const r = await runMiddleware('https://guardman.cl/contacto');
    expect(r.status).toBe(301);
    // Relativa: el guard de host no debe interceptar el apex.
    expect(r.location).toBe('/contacto/');
  });

  it('dev y E2E no se redirigen a producción', async () => {
    const dev = await runMiddleware('http://localhost:4321/contacto');
    expect(dev.location).toBe('/contacto/');

    const e2e = await runMiddleware('http://127.0.0.1:8788/contacto');
    expect(e2e.location).toBe('/contacto/');
  });
});
