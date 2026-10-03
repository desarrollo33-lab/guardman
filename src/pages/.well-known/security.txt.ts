// /.well-known/security.txt — RFC 9116.
//
// En una empresa de seguridad privada el contacto de seguridad tiene que existir
// en un formato que un researcher pueda parsear sin escribir un scraper. Google
// no lo usa como señal de ranking: es una señal de credibilidad, y en esta
// vertical aparece justo en el tipo de revisión que un cliente hace antes de
// contratar. El archivo no estaba en ninguna de las dos rutas que revisa la
// convención (auditado 2026-10-03: ambas devolvían 404).
//
// Dos campos que la spec permite y acá NO se emiten a propósito:
//
//   Encryption — no hay clave PGP publicada. Anunciar `pgp-key.asc` sin que el
//     archivo exista es peor que omitir el campo: el researcher descarga, no
//     encuentra nada y pierde confianza en el resto. Si algún día se publica
//     una clave, se agrega acá junto con el archivo.
//   Acknowledgments — implica que hay un proceso de reporte con SLA. No hay.
//
// `Expires` se calcula en cada request en vez de escribir una fecha en el
// archivo: una fecha escrita a mano es la vía clásica para que un security.txt
// quede vencido sin que nadie lo note. 180 días.
import { SITE } from '../../lib/constants';

export const prerender = false;

export const GET = () => {
  // Se calcula DENTRO del handler, no en el scope del módulo. En el scope del
  // módulo la fecha se congela al inicializar el bundle y en el runtime de
  // Workers `Date.now()` puede dar 0 en ese momento: la primera versión de este
  // archivo emitía `Expires: 1970-06-30` en el build local. Un `Expires` en el
  // pasado es peor que no emitirlo, porque el parser descarta el archivo entero.
  const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace(/\.\d+Z$/, 'Z');

  const body = `Contact: mailto:${SITE.EMAIL_INFO}
Expires: ${expires}
Preferred-Languages: es
Canonical: ${SITE.URL}/.well-known/security.txt
Policy: ${SITE.URL}/privacidad/
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
