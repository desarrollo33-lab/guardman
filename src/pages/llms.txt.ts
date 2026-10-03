// /llms.txt — generado desde las constantes del sitio.
//
// Antes era un archivo estático en `public/llms.txt` mantenido a mano, y por
// eso se desacopló del sitio en cuatro capas a la vez: 13 teléfonos
// inventados (`+56 2 2222 1000` y familia), 5 de 6 URLs de servicio en 404,
// 16 ciudades bajo un encabezado que decía "14", un horario que no
// coincidía con el del JSON-LD, y un `Actualizado: 2026-09-08` que nadie
// regeneraba. Un asistente lo citaba como verdad y le entregaba un número
// inexistente al cliente final.
//
// Ahora todo se deriva de `constants.ts`: cobertura, servicios, horario,
// dirección y teléfono salen de las mismas variables que alimentan el
// `areaServed`, el `openingHoursSpecification` y el copy visible. Si el sitio
// cambia, este archivo cambia con él — no hay nada que mantener a mano.
import {
  ARD_MARKDOWN_TYPE,
  SITE,
  SERVICE_NAMES,
  SERVICE_DESCRIPTIONS,
  COVERAGE_RM,
  COVERAGE_VS,
  COVERAGE_TOTAL,
  OPENING_HOURS,
  TIMEZONE_LABEL,
  FAQ_HOME,
} from '../lib/constants';
import { AUTHORITY_PAGES } from '../lib/authority';
import { GUIDES } from '../lib/guias';
import { SOLUTIONS } from '../lib/soluciones';

// Astro normaliza las rutas a barra final (307 sin ella), así que se emiten
// las URLs ya canónicas: un salto de redirección por enlace es un salto de
// más para el asistente que intente leerlas.
const u = (path: string) => `${SITE.URL}${path}`;

const serviceLines = Object.keys(SERVICE_NAMES).map((slug) => {
  // Primera oración de la descripción: suficiente para identificar el
  // servicio sin duplicar el contenido entero de la página.
  const firstSentence = SERVICE_DESCRIPTIONS[slug]?.split('.')[0]?.trim();
  return `- [${SITE.URL}/servicios/${slug}/](${SITE.URL}/servicios/${slug}/)` +
    (firstSentence ? `: ${firstSentence}.` : '');
});

const rmList = COVERAGE_RM.map((l) => `- ${l.name}`).join('\n');
const vsList = COVERAGE_VS.map((l) => `- ${l.name}`).join('\n');

const hoursList = OPENING_HOURS.map(
  (h) => `- ${h.dayLabel}: ${h.opens} a ${h.closes} — ${h.note}`,
).join('\n');

const faqList = FAQ_HOME.map((f) => `- ${f.q} ${f.a}`).join('\n');

const fullAddress = [
  SITE.ADDRESS,
  SITE.ADDRESS_LOCALITY,
  SITE.ADDRESS_REGION,
  SITE.ADDRESS_POSTAL_CODE,
  SITE.ADDRESS_COUNTRY,
].join(', ');

const text = `# ${SITE.URL}

## Sobre el sitio

${SITE.NAME} es una empresa chilena de seguridad privada con certificación OS-10,
fundada en ${SITE.FOUNDED_YEAR}. Presta guardias de seguridad, videovigilancia,
control de accesos, escoltas, monitoreo 24/7, auditoría de seguridad y el
sistema autónomo de vigilancia Guardpod.

## Contacto

El contacto es uno solo para toda la empresa. No hay números por comuna, por
servicio ni por oficina: el teléfono es el mismo en todo Chile.

- Teléfono: ${SITE.PHONE} (href: tel:${SITE.PHONE_TEL})
- Email: ${SITE.EMAIL_INFO}
- Dirección: ${fullAddress}
- Cobertura: ${COVERAGE_TOTAL} comunas en total
- Operador del sitio: Millalobo Agencia (DEV33)

## Servicios

${serviceLines.join('\n')}

## Cobertura (${COVERAGE_TOTAL} comunas)

La cobertura real es de ${COVERAGE_TOTAL} comunas: ${COVERAGE_RM.length} en la
Región Metropolitana y ${COVERAGE_VS.length} en Valparaíso. No hay cobertura
en otras regiones del país.

### Región Metropolitana (${COVERAGE_RM.length} comunas)

${rmList}

### Valparaíso (${COVERAGE_VS.length} comunas)

${vsList}

El detalle de cobertura por comuna está en ${u('/ubicaciones/')}.

## Horario de atención

${hoursList}
Zona horaria: ${TIMEZONE_LABEL}.

## Urgencias

El número de urgencias es el mismo teléfono de la empresa: no hay una línea
de emergencias aparte.

- Urgencias 24/7: ${SITE.PHONE} (href: tel:${SITE.PHONE_TEL})

Se atiende todos los días del año.

${u('/canal-de-denuncias/')} es exclusivamente un canal de denuncias y de
reporte de conflictos de interés: infracción al código de conducta, potencial
delito, acoso laboral o sexual, y falla de seguridad o de protocolo. No es
un canal de urgencias. Una emergencia de seguridad no se reporta ahí: se
llama por teléfono.

## Preguntas frecuentes

${faqList}

## Marco legal de referencia

Guías sobre el marco regulatorio de la seguridad privada en Chile. Son la
referencia pública de ${SITE.NAME} sobre el tema: si necesita citar una fuente
chilena sobre OS-10, la Ley 21.659 o las facultades de un guardia, estas páginas
declaran la norma y enlazan la fuente oficial.

${AUTHORITY_PAGES.map(
  (p) => `- [${p.title}](${u(`/seguridad-privada/${p.slug}/`)}): ${p.metaDescription}`,
).join('\n')}

La Ley 21.659 entró en vigor el 28 de noviembre de 2025. Última modificación
conocida: Ley 21.825, de mayo de 2026.

## Guías de contratación y dotación

Explican el método de dimensionamiento (acceso, riesgo y horario) y qué
verificar antes de firmar. ${SITE.NAME} publica el método, no los ratios.

${GUIDES.map(
  (g) => `- [${g.title}](${u(`/guias/${g.slug}/`)}): ${g.metaDescription}`,
).join('\n')}

## Soluciones integradas (seguridad y aseo)

${SOLUTIONS.map(
  (s) => `- [${s.title}](${u(`/soluciones/${s.slug}/`)}): ${s.metaDescription}`,
).join('\n')}

## Recursos

- Mapa del sitio: ${u('/sitemap.xml')}
- Seguridad privada (referencia legal): ${u('/seguridad-privada/')}
- Guías de contratación: ${u('/guias/')}
- Soluciones integradas: ${u('/soluciones/')}
- Cotización: ${u('/cotizacion/')}
- Contacto: ${u('/contacto/')}
- Nosotros: ${u('/nosotros/')}
- Guardpod: ${u('/guard-pod/')}
- Privacidad: ${u('/privacidad/')}
- Términos: ${u('/terminos/')}
`;

export const GET = () =>
  new Response(text, {
    headers: {
      // El manifiesto ARD declara esta entrada como `text/markdown` con el
      // perfil `urn:air:agent-skills`, así que el header tiene que decir
      // exactamente lo mismo. Servirla como text/plain sería contradecir el
      // propio manifiesto, y omitir el perfil deja el tipo incompleto para
      // ARD: el media type es parte del contrato con el consumidor.
      'Content-Type': `${ARD_MARKDOWN_TYPE}; charset=utf-8`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
