// ════════════════════════════════════════════════════════════════
// GuardMan — Host canónico
//
// El worker responde en tres hostnames públicos, no en uno:
//
//   guardman.cl                                          ← el canónico
//   www.guardman.cl                                      ← alias
//   *.oficinadesarrollo33.workers.dev                    ← el worker y sus previews
//
// Los tres servían una copia completa del sitio con 200. El canonical sí
// apuntaba a `https://guardman.cl/` en las tres, pero canonical es una
// *sugerencia* para Google, no una orden: cuando la URL de `workers.dev`
// ganaba la indexación, aparecía en los resultados. Y el nombre del host
// publica el de la cuenta que hospeda el proyecto (`oficinadesarrollo33`),
// que es información que ningún prospecto de GuardMan debería leer en una
// URL.
//
// Acá vive la decisión: **un host público, el canónico.** Los demás no
// sirven contenido, responden 301 conservando path y query. El dominio
// `workers.dev` además se apaga por config (`workers_dev: false` en
// `wrangler.jsonc`), así que este 301 es la red de seguridad que evita
// que un reaparecimiento del dominio quede sirviendo un clon indexable.
// ════════════════════════════════════════════════════════════════

import { SITE } from './constants';

const canonical = new URL(SITE.URL);

export const CANONICAL_HOST = canonical.hostname;
export const CANONICAL_ORIGIN = canonical.origin;

/**
 * ¿Este hostname es una dirección de servicio y no la dirección del sitio?
 *
 * Deliberadamente una lista corta y explícita, no una allowlist estricta: una
 * allowlist mandaría a `localhost` y a `127.0.0.1` (dev y E2E) a un 301 de
 * producción, y un dominio nuevo quedaría sirviendo un clon sin que nadie lo
 * notara. Con esta forma, agregar un dominio es una decisión consciente.
 */
export const isNonCanonicalHost = (hostname: string): boolean =>
  hostname.endsWith('.workers.dev') ||
  hostname === `www.${CANONICAL_HOST}`;

/**
 * Una sola forma canónica de URL: barra final salvo la raíz, y sin tocar
 * assets ni API.
 *
 * Antes las páginas de ruta dinámica ya redirigían solas (307) pero las
 * planas (`/contacto`) servían 200 con barra y sin ella, cada una declarando
 * un canonical distinto: 13 URLs duplicadas.
 */
export const needsTrailingSlash = (pathname: string): boolean => {
  const hasExtension = /\.[a-z0-9]+$/i.test(pathname);
  return (
    pathname !== '/' &&
    !pathname.endsWith('/') &&
    !hasExtension &&
    // Los assets de /_astro y las rutas de API se sirven tal cual.
    !pathname.startsWith('/_astro/') &&
    !pathname.startsWith('/api/')
  );
};

/**
 * Destino del 301 para un host no canónico, o `null` si el host ya es el
 * canónico (en cuyo caso la request sigue su curso normal).
 *
 * Aplica la barra final en el mismo salto: un enlace a
 * `www.guardman.cl/contacto` debe llegar en un solo 301 a
 * `https://guardman.cl/contacto/`, no encadenar dos redirecciones.
 */
export const canonicalRedirect = (url: URL): string | null => {
  if (!isNonCanonicalHost(url.hostname)) return null;
  const path = needsTrailingSlash(url.pathname) ? `${url.pathname}/` : url.pathname;
  return `${CANONICAL_ORIGIN}${path}${url.search}`;
};
