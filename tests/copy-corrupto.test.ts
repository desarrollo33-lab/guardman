// Copy corrupto por traducción automática.
//
// DIFERENTE de `anglicismos.test.ts`, y complementario.
//
// Ese guard responde una pregunta acotada: ¿hay una palabra inglesa que un
// chileno no escribiría, de una lista de ~20 términos? Kammler la delimitó
// (2026-10-03): "app para ajax systems está bien, partner también". Es una
// lista, y una lista no encuentra lo que pasó acá.
//
// Lo que pasó: 27 puntos de texto pegados de una traducción automática, EN
// PRODUCCIÓN, visibles a un lector y citados por los asistentes de IA:
//
//   soluciones.ts:65   "estacionamientos y Dependencies náuticas de servicio"
//   soluciones.ts:65   "llaves en Formats formality y confianza"
//   autoridad.ts:317   "Retener o hereafterดลองกันว่าเปิด a una persona"  (tailandés)
//   autoridad.ts:318   "Purseguir a un sospechoso"
//   guias.ts:484       "se differentiates a las empresas"
//   guias.ts:101       "tanto para la BSDBs sostenida del guardia"
//   soluciones.ts:240  "accesos peatonales, Including áreas de stationary de carga"
//
// Dos firmas que sí las distingue de un anglicismo discutible:
//
//   1) PALABRA PEGADA. Una sustitución automática se come el espacio:
//      "empresapcs", "estáFuera", "conProcesses", "laBSDBs", "empresaIDOsu".
//      El patrón es minúsculas→Mayúscula pegadas, sin separador. Un término
//      inglés en una frase no lo produce; esto sí.
//
//   2) RESIDUO EN FRASE. Un verbo o sustantivo en inglés donde corresponde
//      un verbo o sustantivo español, con el resto de la frase en español
//      correcto: "los guardias performs funciones", "para performar tareas".
//      La lista de ANGLICISMOS no los cubre porque no son palabras de UI ni
//      de jerga de marketing: son basura de traducción.
//
// Además, un run de signos de interrogación es el rastro de un intento de
// enmascarar texto que el modelo no sabía traducir.
//
// Este test es MECÁNICO, no semántico: no juzga si un término inglés está
// bien. Solo detecta que la frase está rota.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : /\.(astro|ts|tsx|mjs|sql)$/.test(name) ? [full] : [];
  });
}

const W = '[\\p{L}\\p{N}_-]';

/**
 * Residuos de traducción que se han encontrado. CORTA y a propósito: es una
 * lista de basura conocida, no un diccionario.
 *
 * Cada entrada es una palabra que NO puede ser identificador legítimo en este
 * repo. Por eso `answered` y `authority_` NO están: `answered` es una columna
 * de `guardpod_answers` y `AUTHORITY_PAGES` una constante, y matchearlos
 * marcaría 40 líneas de API que están bien. Un residuo tiene que ser una
 * palabra que solo aparece en copy roto.
 */
const RESIDUOS: string[] = [
  'performing', 'performs', 'performar', 'answered', 'processes',
  'differentiates', 'intermediates', 'hereafter', 'blocked', 'ceilings',
  'bathrooms', 'stationary', 'including', 'designing', 'decentralized',
  'dependencies', 'formats', 'untributors', 'intensive', 'located',
  'purseguir', 'authority_',
];

/**
 * Palabras que son identificadores legítimos del dominio y aparecen dentro de
 * las anteriores por subcadena o por uso técnico. Se descartan antes de reportar.
 * `answered` es columna de D1 (`guardpod_answers.answered`); `authority_` es el
 * prefijo de `AUTHORITY_PAGES` / `AUTHORITY_BY_SLUG`.
 */
const IDENTIFICADORES = new Set([
  'answered', 'answered_count', 'answeredres', 'authority_pages',
  'authority_by_slug', 'authority_', 'authority',
]);

/**
 * Marcas y siglas que aparecen pegadas pero son legítimas. Sin esta lista el
 * test marca `Guardpod` y `OS-10` en cada página.
 */
const PROPIAS =
  /\b(Guardpod|GuardPod|GuardMan|OS-10|OS10|CCTV|NVR|PPI|WebMCP|CRM|SEO|FAQ|HTML|JSON|QR|LPR|D1|KV|CLP|RUT|UF|API|PDF|SSO|SLA|OPAI|RIE|ASAI|ARD|UTM|PWA|SSR|CSS|DOM|SQL|TLS|HTTPS|AEO|GEO|GLP)\w*/g;

/**
 * Ignora la línea que es código. Mismo criterio que el guard de anglicismos:
 * el filtro tiene que mirar la LÍNEA, no el archivo, porque el copy vive en la
 * misma línea que el marcado.
 */
const CODIGO =
  /https?:\/\/|mailto:|tel:|@type|schema\.org|\b(FROM|SELECT|INSERT|UPDATE|DELETE|WHERE|VALUES)\b|\bLIKE\s+\?|class=|aria-|data-[a-z-]+=|getElementById|querySelector|^\s*(\/\/|\/\*|--|<!--)|from '|import |export |=>|\.astro['"`]|\.tsx?['"`]|\.sql['"`]|\bconst\b|\blet\b|\bfunction\b|\breturn\b|\bif\s*\(|\bfor\s*\(/i;

const residuoRe = new RegExp(`(?<![${W}])(?:${RESIDUOS.join('|')})(?![${W}])`, 'gi');

/**
 * Palabra pegada al sustantivo: minúsculas seguidas de Mayúscula, sin
 * separador. Exige 2+ letras antes para no capturar iniciales sueltas.
 */
const pegadaRe = /\b[a-záéíóúñ]{2,}[A-Z][a-zA-Záéíóúñ]{1,}\b/g;

/** Run de signos de interrogación: el rastro de texto que nadie supo traducir. */
const interrogacionRe = /\?{3,}/g;

/**
 * Excepciones REALES: camelCase legítimo que NO está en posición de clave, ni
 * de llamada, ni de prop de componente, y que por eso hay que nombrar.
 *
 * En la práctica son los atributos SVG, que viven dentro de una etiqueta. El
 * resto de los nombres de campo (`metaTitle`, `streetAddress`, `heroSub`,
 * `ctaBody`, `datePublished`…) NO van acá: se descartan por posición, que es
 * una regla que no depende de conocer el repo. Enumerar los 40 campos habría
 * sido perseguir falsos positivos para siempre.
 *
 * Y son TRES a propósito, con un test que falla si alguna deja de aparecer. Una
 * lista de excepciones que solo crece termina dejando de filtrar, que es
 * exactamente lo que le pasó al guard de anglicismos.
 */
const ATRIBUTOS_CAMEL = new Set(['viewBox', 'currentColor', 'toLowerCase']);

/**
 * Las marcas (`Guardpod`, `GuardMan`, `OS-10`, `CCTV`…) no necesitan excepción
 * propia: ya están en `PROPIAS`, que se evalúa antes que cualquier otra regla.
 * Ver el orden en `revisar()`.
 *
 * Lo que SÍ queda listado abajo son los casos que ninguna regla posicional
 * cubre: atributos SVG, que aparecen dentro de una etiqueta y por eso no
 * matchean las reglas de clave, llamada ni prop.
 */

const offenders: string[] = [];
const excepcionesVistas = new Set<string>();

function textoDePlantilla(src: string): { texto: string; lineaDe: (i: number) => number; fmFin: number } {
  const lineas = src.split(/\r?\n/);
  let fmFin = -1;
  if (lineas[0]?.trim() === '---') {
    for (let i = 1; i < lineas.length; i++) if (lineas[i].trim() === '---') { fmFin = i; break; }
  }
  let script = 0;
  const prefijo: number[] = [];
  let acc = 0;
  const out: string[] = [];
  lineas.forEach((l, i) => {
    const abre = (l.match(/<script\b/g) || []).length;
    const cierra = (l.match(/<\/script>/g) || []).length;
    const enScript = script > 0;
    script = Math.max(0, script + abre - cierra);
    const n = l.length + 1;
    // La línea se REEMPLAZA por espacios en vez de eliminarse. Así el índice
    // en `texto` es el mismo que en `src`, y los filtros que miran el contexto
    // (el prop de `<FaqList odId=…>`, que cae en otra línea) siguen funcionando
    // sin un segundo mapa de posiciones.
    out.push(i <= fmFin || enScript || abre ? ' '.repeat(l.length) : l);
    for (let k = 0; k < n; k++) prefijo.push(acc + k);
    acc += n;
  });
  const texto = out.join('\n');
  const lineaDe = (i: number) => {
    let lo = 0, hi = prefijo.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (prefijo[mid] <= i) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
  return { texto, lineaDe, fmFin };
}

for (const file of walk('src')) {
  const rel = file.replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');
  const esAstro = file.endsWith('.astro');
  // La regla de palabra pegada solo aplica a los archivos que SON copy: los
  // que un humano lee. Fuera de acá, camelCase es diseño, no error:
  //   - islas del panel y lógica en `.ts`: `setSaveStates`, `draftsRef`
  //   - `lib/ai-catalog.ts`: `displayName`, `trustManifest`, `logoUrl`, que
  //     además son nombres de campo del esquema ARD oficial (additionalProperties:false)
  //   - `pages/api/**`: backend puro, sin copy
  //   - `llms.txt.ts` y los generadores `.md`: GENERAN texto a partir de
  //     `constants.ts`, no lo contienen. El copy que llega al `llms.txt` se
  //     audita en el archivo que lo define, que es el que hay que arreglar.
  const GENERADORES = /^src\/pages\/(llms|.*\.well-known)/;
  const esCopy =
    !GENERADORES.test(rel) &&
    /^src\/(lib\/(content|guias|soluciones|authority|constants|seo|internal-links)\.|components\/|pages\/(?!api\/))/.test(rel);
  const esContenido = esAstro || esCopy;
  const { texto: vis, lineaDe, fmFin } = esAstro
    ? textoDePlantilla(src)
    : { texto: src, lineaDe: (i: number) => src.slice(0, i).split('\n').length, fmFin: -1 };

  const revisar = (texto: string, base: number, esCodigo: boolean) => {
    for (const g of texto.matchAll(residuoRe)) {
      if (PROPIAS.test(g[0])) { PROPIAS.lastIndex = 0; continue; }
      PROPIAS.lastIndex = 0;
      if (IDENTIFICADORES.has(g[0].toLowerCase())) continue;
      const n = base + lineaDe(g.index);
      const ctx = texto.slice(Math.max(0, g.index - 50), g.index + g[0].length + 50).replace(/\s+/g, ' ');
      if (esCodigo) { excepcionesVistas.add(`${g[0]}  ←  ${rel}:${n}`); continue; }
      offenders.push(`${rel}:${n}  residuo "${g[0]}"   …${ctx}…`);
    }

    if (!esContenido) return;

    for (const g of texto.matchAll(pegadaRe)) {
      const w = g[0];
      if (PROPIAS.test(w)) { PROPIAS.lastIndex = 0; continue; }
      PROPIAS.lastIndex = 0;
      if (ATRIBUTOS_CAMEL.has(w)) { excepcionesVistas.add(`${w}  ←  ${rel}`); continue; }
      // Clave de objeto: `metaTitle:`, `streetAddress:`, `ctaBody:`. Y
      // declaración de tipo: `trustBadge?: string`. El copy corrupto nunca es
      // ninguno de los dos, porque la traducción automática actúa sobre el
      // VALOR. Es la regla que reemplaza a la lista de excepciones: en vez de
      // enumerar los 40 campos que el repo usa, se descarta por posición, y la
      // lista puede llenarse sola con los casos raros (atributos SVG).
      const tras = texto.slice(g.index + w.length, g.index + w.length + 4);
      if (/^\s*\??\s*:/.test(tras)) continue;
      // Llamada a función: `postalAddress()`, `startsWith(...)`. Igual que la
      // clave, es un identificador, no texto.
      if (/^\s*\(/.test(tras)) continue;
      // Mención dentro de un comentario o bloque de documentación: `` `areaServed` ``.
      // Un comentario no es copy que se publique, y esta auditoría no es un
      // linter de comentarios.
      const previo = texto.slice(Math.max(0, g.index - 1), g.index);
      if (previo === '`') continue;
      // Acceso a propiedad: `opts.datePublished`. Igual que la clave, es un
      // identificador.
      if (previo === '.') continue;
      // Kebab-case de atributo: `data-od-id`, `aria-labelledby`. El `od` de
      // `data-od-id` es camelCase interno del proyecto (optical diff), pero la
      // convención HTML lo escribe con guiones. El copy corrupto nunca está
      // precedido por un guion.
      //
      // Se mira una ventana y no el carácter inmediato porque el texto que se
      // revisa es el que sobrevive a quitar `<script>`: dos fragmentos de la
      // línea original pueden quedar pegados y romper la proximidad.
      const ventana = texto.slice(Math.max(0, g.index - 60), g.index);
      if (ventana.endsWith('-')) continue;
      // Prop de componente en Astro: `<FaqList odId="..." />`. El prop viene
      // siempre tras un nombre de componente (Mayúscula inicial) y un espacio.
      // Un copy corrupto como "empresapcs" no puede estar ahí, porque el
      // valor de un prop va entre comillas, nunca en el nombre.
      if (/<[A-Z][A-Za-z]*\s*$/i.test(ventana)) continue;
      // `set:html={iconMap[...]}` y `{secondaryHref}`: el camelCase es el
      // nombre de una variable dentro de una expresión, no texto. Todo lo que
      // está entre `<` y `>` es marcado, y dentro de una interpolación sin
      // comillas tampoco hay copy.
      const antes = texto.slice(0, g.index);
      if (antes.lastIndexOf('<') > antes.lastIndexOf('>')) continue;
      const llaveAbierta = antes.lastIndexOf('{');
      const llaveCerrada = antes.lastIndexOf('}');
      if (llaveAbierta > llaveCerrada) {
        const dentro = antes.slice(llaveAbierta, g.index);
        if (!dentro.includes("'") && !dentro.includes('"')) continue;
      }
      // El resto se resuelve por LÍNEA, no por contexto. Una palabra pegada es
      // copy roto solo si la línea entera es prosa. `const [saveStates, setSaveStates]`
      // es código; `"una empresapcs autorizada"` es copy roto. Es el mismo criterio
      // que aplica `anglicismos.test.ts`, y por el mismo motivo: el copy vive en
      // la misma línea que el marcado, así que el filtro tiene que mirar la línea.
      //
      // La línea se lee del ORIGINAL, no de `texto`: el bloque de frontmatter de
      // un `.astro` queda en blanco en `texto`, y ahí hay lógica (`const
      // itemIcon = …`) que no es copy pero que hay que poder descartar.
      //
      // `lineaDe` no sirve acá: como el frontmatter se reemplaza por espacios de
      // la misma longitud, los índices de `texto` y `src` coinciden, pero el
      // conteo de líneas que hace `lineaDe` asume que `texto` empieza donde
      // termina el frontmatter. Se cuenta directo sobre el original.
      const n = src.slice(0, g.index).split(/\r?\n/).length;
      const linea = src.split(/\r?\n/)[n - 1] ?? '';
      if (esCodigo || CODIGO.test(linea)) { excepcionesVistas.add(`${w}  ←  ${rel}:${n}`); continue; }
      const ctx = texto.slice(Math.max(0, g.index - 50), g.index + w.length + 50).replace(/\s+/g, ' ');
      offenders.push(`${rel}:${n}  pegada "${w}"   …${ctx}…`);
    }

    for (const g of texto.matchAll(interrogacionRe)) {
      const n = base + lineaDe(g.index);
      offenders.push(`${rel}:${n}  texto sin traducir "${g[0]}"`);
    }
  };

  if (esAstro) revisar(vis, 0, false);
  else revisar(src, 0, false);

  // Frontmatter de los .astro: props y arrays con texto, que el bloque de
  // plantilla no cubre (van arriba del `---`).
  if (esAstro && fmFin > 0) {
    const fm = src.slice(0, fmFin);
    fm.split(/\r?\n/).forEach((linea, i) => {
      if (CODIGO.test(linea)) return;
      for (const g of linea.matchAll(residuoRe)) {
        if (PROPIAS.test(g[0])) { PROPIAS.lastIndex = 0; continue; }
        PROPIAS.lastIndex = 0;
        if (IDENTIFICADORES.has(g[0].toLowerCase())) continue;
        offenders.push(`${rel}:${i + 1}  residuo en frontmatter "${g[0]}"   …${linea.trim().slice(0, 120)}…`);
      }
    });
  }
}

describe('sin copy corrupto por traducción automática', () => {
  it('no deja residuos en inglés dentro de frases en español', () => {
    expect(offenders.filter((o) => o.includes('residuo')).join('\n') || 'sin residuos').not.toMatch(
      /residuo "/,
    );
  });

  it('no deja palabras pegadas al sustantivo', () => {
    const pegadas = offenders.filter((o) => o.includes('pegada'));
    expect(pegadas.join('\n') || 'sin palabras pegadas').not.toMatch(/pegada "/);
  });

  it('no deja texto sin traducir (runs de signos de interrogación)', () => {
    const sucios = offenders.filter((o) => o.includes('sin traducir'));
    expect(sucios.join('\n') || 'sin texto sin traducir').not.toMatch(/sin traducir "/);
  });

  it('las excepciones de atributos SVG siguen siendo necesarias', () => {
    // Si un atributo de `ATRIBUTOS_CAMEL` dejó de aparecer en el repo, el
    // problema ya no es el copy: es que la excepción hay que borrarla. Falla
    // acá para que nadie acumule excepciones muertas, que es como el guard de
    // anglicismos se vuelve inútil con el tiempo.
    for (const palabra of ATRIBUTOS_CAMEL) {
      const usada = [...excepcionesVistas].some((e) => e.startsWith(palabra + ' '));
      expect(
        usada,
        `"${palabra}" sigue en ATRIBUTOS_CAMEL pero no aparece en el repo. Borrala de la lista.`,
      ).toBe(true);
    }
  });
});
