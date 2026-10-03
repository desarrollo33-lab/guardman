// Contrato del breadcrumb.
//
// Antes el sitio tenía dos props distintos para lo mismo: `breadcrumb`, una
// etiqueta suelta que pintaba `Inicio / X` en el <nav>, y `breadcrumbs`, la
// lista que alimentaba el JSON-LD. El resultado en producción era markup que
// no describía nada visible: /servicios/guardias-de-seguridad declaraba tres
// niveles (Inicio / Servicios / Guardias) y mostraba dos. Google descarta
// structured data que no corresponde a contenido visible, así que los niveles
// intermedios —que además son hubs reales del sitio— no rendaban nada.
//
// Estos tests fijan las tres propiedades que hacen que el rastro sea correcto:
// una sola fuente de verdad, cadena de ancestros reales, y último nivel sin
// enlace.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LAYOUT = 'src/layouts/BaseLayout.astro';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return name.endsWith('.astro') ? [full] : [];
  });
}

const layout = readFileSync(LAYOUT, 'utf8');

/** Plantillas públicas con BaseLayout. El panel admin usa otro layout. */
const pages = walk('src/pages')
  .filter((f) => !f.replace(/\\/g, '/').startsWith('src/pages/admin'))
  .filter((f) => readFileSync(f, 'utf8').includes('<BaseLayout'));

/** Props de la etiqueta de apertura <BaseLayout ...>. */
function layoutProps(src: string): string {
  const start = src.indexOf('<BaseLayout');
  if (start < 0) return '';
  let depth = 0;
  for (let i = start + '<BaseLayout'.length; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0) return src.slice(start, i);
  }
  return '';
}

/** Lee el valor de una prop Astro a partir de `pos`, con `${}` balanceados. */
function readValue(src: string, pos: number): { value: string; end: number } {
  let i = pos;
  while (i < src.length && /\s/.test(src[i])) i++;
  const q = src[i];
  if (q === "'" || q === '"' || q === '`') {
    i++;
    let out = '';
    while (i < src.length) {
      if (src[i] === '\\') { out += src[i + 1]; i += 2; continue; }
      if (src[i] === q) { i++; break; }
      if (src[i] === '$' && src[i + 1] === '{') {
        // `${rawId || ''}` trae comillas y llaves propias: sin contarlas, el
        // cierre del string se confunde con el del template.
        let d = 0;
        let j = i + 1;
        for (; j < src.length; j++) {
          if (src[j] === '{') d++;
          else if (src[j] === '}') { d--; if (d === 0) { j++; break; } }
        }
        out += '${…}'; // un token por interpolación, para no perder el nivel
        i = j;
        continue;
      }
      out += src[i];
      i++;
    }
    return { value: out, end: i };
  }
  let out = '';
  while (i < src.length && src[i] !== ',' && src[i] !== '}') { out += src[i]; i++; }
  return { value: out.trim(), end: i };
}

/** Una entrada por segmento de ruta; `${…}` ya viene normalizado. */
const segments = (url: string): string[] =>
  url.split('#')[0].split('?')[0].split('/').filter(Boolean);

/** Indices de los `{…}` de primer nivel dentro de un cuerpo de array. */
function topLevelObjects(body: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        out.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return out;
}

/**
 * Extrae los `url` del array `breadcrumbs={[…]}`.
 *
 * Se parte por llaves balanceadas y no con una regex sobre `name:…, url:…`:
 * con regex, una entrada cuyo `name` es una expresión con `}` —`{ name:
 * loc.name, url: \`/x/${slug}\` }`— hacía que el patrón se comiera el cierre
 * equivocado y la entrada desapareciera del análisis en silencio. Un test que
 * se salta casos no es un test: el bug del salto de rama cruzada pasaba con
 * la regex puesta.
 */
function declaredTrail(props: string): { name: string; url: string }[] {
  const at = props.indexOf('breadcrumbs={[');
  if (at < 0) return [];
  const end = props.indexOf(']}', at);
  // Se salta el `breadcrumbs={` de apertura: si se deja, su `{` desalinea el
  // conteo de profundidad y ninguna entrada cierra a nivel cero, o sea que
  // topLevelObjects devuelve cero entradas y el trail completo se analiza como
  // vacío. El bug se hacía invisible justo así.
  const body = props.slice(at + 'breadcrumbs={['.length, end);

  return topLevelObjects(body).flatMap((entry) => {
    const u = entry.indexOf('url:');
    if (u < 0) return [];
    const { value } = readValue(entry, u + 'url:'.length);
    const n = entry.indexOf('name:');
    const name = n < 0 ? '' : readValue(entry, n + 'name:'.length).value;
    return [{ name, url: value }];
  });
}

describe('breadcrumb: una sola fuente de verdad', () => {
  it('el layout dibuja el rastro a partir de `breadcrumbs`, no de un prop aparte', () => {
    // Si el <nav> vuelve a hardcodear "Inicio", la deriva entre lo visible y
    // el JSON-LD regresa sin que ninguna otra prueba lo note.
    expect(layout).toMatch(/breadcrumbItems\.map\(/);
    expect(layout).not.toMatch(/<a href="\/">Inicio<\/a>/);
  });

  it('el prop `breadcrumb` (string) ya no existe en el layout', () => {
    expect(layout).not.toMatch(/^\s*breadcrumb\?:/m);
  });

  it('ninguna plantilla pasa el prop `breadcrumb`', () => {
    const offenders = pages.filter((f) => /^\s*breadcrumb=(?!s)/m.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('el <nav> se renderiza aunque el trail tenga un solo nivel', () => {
    // La home no declara breadcrumbs y no debe pintar rastro. Las demás, sí.
    const home = readFileSync('src/pages/index.astro', 'utf8');
    expect(layoutProps(home)).not.toMatch(/breadcrumbs=/);
  });
});

describe('breadcrumb: el trail declara una jerarquía real', () => {
  const offenders: string[] = [];

  for (const file of pages) {
    const trail = declaredTrail(layoutProps(readFileSync(file, 'utf8')));
    if (trail.length === 0) continue;

    if (trail.length < 2) {
      // Google exige al menos dos ListItem: una sola entrada no es jerarquía.
      offenders.push(`${file}: declara ${trail.length} nivel(es)`);
      continue;
    }
    if (trail[0].url !== '/') {
      offenders.push(`${file}: el primer nivel no es la home (${trail[0].url})`);
    }
    for (let i = 1; i < trail.length; i++) {
      const parent = segments(trail[i - 1].url);
      const child = segments(trail[i].url);
      const isAncestor =
        child.length > parent.length && parent.every((s, k) => s === child[k]);
      if (!isAncestor) {
        // El bug que esto cubre: el trail de /servicios/{svc}/{loc} metía
        // `/ubicaciones/{loc}` entre el servicio y la página. Un nivel sin
        // padre en la ruta rompe el "subir un nivel" del breadcrumb.
        offenders.push(
          `${file}: "${trail[i - 1].url}" no es ancestro de "${trail[i].url}"`,
        );
      }
    }
  }

  it('cada nivel es ancestro del siguiente, en todas las plantillas', () => {
    expect(offenders).toEqual([]);
  });
});

describe('breadcrumb: markup', () => {
  it('el último nivel no es un enlace', () => {
    // El usuario ya está en esa página: enlazarla no aporta nada y Google
    // espera que el último ListItem sea el actual.
    expect(layout).toMatch(/aria-current="page"/);
    expect(layout).toMatch(/isLast\s*\?/);
  });

  it('el trail es una lista ordenada, no un div de hijos fijos', () => {
    expect(layout).toMatch(/<ol class="breadcrumb-list">/);
  });

  it('el CSS que da estilo al trail existe y cubre la lista nueva', () => {
    const css = readFileSync('src/styles/components.css', 'utf8');
    expect(css).toMatch(/\.breadcrumb-list\s*\{/);
    // La clase vieja desapareció con el <div>: si vuelve, hay dos reglas
    // compitiendo por el mismo trail.
    expect(css).not.toMatch(/\.breadcrumb-inner\s*\{/);
  });

  it('la hoja oscura sigue cubriendo la lista nueva con el contraste medido', () => {
    // dark.css fijó 65% de blanco por una razón de WCAG AA documentada en el
    // archivo. Si el selector vuelve a `.breadcrumb-inner`, el trail se queda
    // sin esa regla y cambia de contraste en /guard-pod y /ajax-systems.
    const dark = readFileSync('public/styles/dark.css', 'utf8');
    expect(dark).toMatch(/\.breadcrumb-list\{/);
    expect(dark).not.toMatch(/\.breadcrumb-inner\{/);
  });
});

describe('Astro: los comentarios dentro de una etiqueta no llevan corchetes', () => {
  // Este guard no es sobre breadcrumbs: es la restricción del parser de Astro
  // que rompió 160 de estas páginas.
  //
  // Dentro de `<Componente ... >` un `//` es comentario para JS pero NO para
  // el parser de la etiqueta, que sigue contando llaves y ángulos. Con una
  // llave el build muere ("Expected ) but found }"). Con un ángulo el build
  // pasa y el parser se come la prop siguiente en silencio: en este repo
  // `breadcrumbs` desapareció de las 160 páginas de servicio × comuna, sin
  // breadcrumb visible ni JSON-LD, y ningún test lo notó.
  //
  // Regla: comentarios en prosa dentro de la etiqueta, sin `{ } < >`.

  const offenders: string[] = [];

  /**
   * Recorre una etiqueta de apertura desde `<Name` y devuelve los comentarios
   * que hay dentro, hasta el `>` que la cierra.
   *
   * No se puede hacer con una regex: el contenido de la etiqueta contiene
   * `<` y `>` (justo lo que buscamos en los comentarios), así que cualquier
   * patrón que los excluya termina ANTES de llegar al comentario y no ve nada.
   * Eso fue exactamente el primer intento: el guard pasaba en verde con el bug
   * presente. Hay que recorrer a mano carries de estado.
   */
  function commentsInsideTag(src: string, start: number): { line: string }[] {
    const found: { line: string }[] = [];
    let i = start;
    let depth = 0;
    // `inComment` tiene que ser un booleano explícito. Usar el propio texto
    // acumulador como bandera no funciona: arranca vacío, y vacío es falsy,
    // así que la rama que acumula nunca se ejecuta y el scanner no reporta
    // NUNCA un comentario. El guard pasaba en verde por segunda vez.
    let inComment = false;
    let comment = '';
    let quote: string | null = null;

    while (i < src.length) {
      const c = src[i];

      if (quote) {
        if (c === '\\') { i += 2; continue; }
        if (c === quote) quote = null;
        i++;
        continue;
      }
      if (inComment) {
        if (c === '\n') {
          if (comment.trim()) found.push({ line: comment });
          comment = '';
          inComment = false;
        } else comment += c;
        i++;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { quote = c; i++; continue; }
      if (c === '/' && src[i + 1] === '/') { inComment = true; comment = ''; i += 2; continue; }
      if (c === '{') { depth++; i++; continue; }
      if (c === '}') { if (depth > 0) depth--; i++; continue; }
      if (c === '>' && depth === 0) break;
      i++;
    }
    if (comment.trim()) found.push({ line: comment });
    return found;
  }

  for (const file of walk('src').filter((f) => f.endsWith('.astro'))) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/<([A-Z][A-Za-z0-9_.]*)/g)) {
      // Si el `<Nombre` está precedido por `//` en su línea, no es una
      // etiqueta real: es un ejemplo de API documentado (LeadForm.astro abre
      // su bloque de uso con `//   <LeadForm`). Ahí los corchetes son
      // legítimos y buscarlos daría falsos positivos.
      const lineStart = src.lastIndexOf('\n', m.index) + 1;
      if (src.slice(lineStart, m.index).trim().startsWith('//')) continue;

      for (const { line } of commentsInsideTag(src, m.index + m[0].length)) {
        // El scanner salta los `//` al entrar, así que `line` es el texto del
        // comentario SIN la marca. No se vuelve a chequear el prefijo: es lo
        // que hacía que el guard se saltara todos los comentarios y pasara
        // en verde. Acá solo llegan comentarios.
        const t = line.trim();
        if (!t) continue;
        // Una expresión entre llaves es sintaxis válida, no texto del
        // comentario: se permite. Lo peligroso es un corchete SUELTO, que
        // desalinea el conteo del parser.
        const text = t.replace(/`/g, '').replace(/\{[^{}]*\}/g, '');
        if (/[<>{}]/.test(text)) offenders.push(`${file}: "// ${t.slice(0, 88)}"`);
      }
    }
  }

  it('ningún comentario dentro de una etiqueta de componente tiene corchetes', () => {
    expect(offenders).toEqual([]);
  });

  it('el guard distingue una etiqueta real de un ejemplo documentado', () => {
    // Si este test empieza a marcar `//   <LeadForm ... sections={[…]}`,
    // el guard se volvió inútil: los bloques de uso de LeadForm llevan
    // corchetes legítimos y hay que distinguirlos de un comentario real.
    const lead = readFileSync('src/components/LeadForm.astro', 'utf8');
    expect(lead).toMatch(/^\/\/\s+<LeadForm/m);
    expect(offenders.some((o) => o.includes('LeadForm'))).toBe(false);
  });
});
