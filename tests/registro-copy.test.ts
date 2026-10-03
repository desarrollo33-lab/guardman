// Registro del copy: espanol neutro, sin voseo, tuteo formal (usted).
//
// El sitio ya usaba "usted" en casi todo ("Seleccione", "Reciba", "Solicite")
// pero tenia casi cien marcas de tuteo y voseo dispersas entre 31 archivos:
// el mismo formulario de denuncia escribia "Describa el hecho" y tres lineas
// mas abajo "puedes denunciar"; /privacidad y /terminos estaban enteros en
// tuteo mientras el resto del sitio hablaba de "su".
//
// Dos decisiones de este test:
//
// 1. Limites de palabra UNICODE, no \b de ASCII. En JS, \b se define sobre
//    [A-Za-z0-9_], asi que en "teorico" con tilde la "o" abre un limite y el
//    patron /te/ matchea dentro de la palabra. Con /u y lookarounds sobre
//    \p{L} se evita. Ese falso positivo hacia que "no es teórico" apareciera
//    como problema de registro en dos paginas que estaban bien.
//
// 2. Lista de marcadores CURADA, noderivada, y solo con formas que se
//    distinguen léxicamente. Hay dos trampas:
//
//    a) "Cuéntenos" ya es la forma de usted, "Hablemos" es primera persona
//    del plural y vale igual en tuteo y en voseo, "Recibe un ID" es la
//    conjugación correcta de usted, y "quien ingresa al sitio" no es un
//    pronombre.
//
//    b) La forma de tú de un verbo en presente ("ingresa", "selecciona",
//    "describe") es IDENTICA a la tercera persona y al sustantivo. No se
//    puede distinguir sin contexto, así que no son marcadores válidos: un
//    guard que las marque obliga a revisarlas a mano y termina reportando
//    falsos positivos. El pronombre es la señal fiable: "Ingresa tu nombre"
//    se caza por "tu", no por "ingresa".
//
//    El voseo sí se marca por terminación, porque la vocal final lo separa
//    de la forma de usted: tenés/tiene, podés/puede, sabés/sabe.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(astro|ts|tsx)$/.test(name) ? [full] : [];
  });
}

/**
 * Limite de palabra que entiende acentos: no matchea dentro de "teórico".
 *
 * El `(?:…)` alrededor de la alternacion NO es opcional. `|` tiene la
 * precedencia mas baja, asi que `(?<!W)tu|tú(?!W)` se parsea como
 * `(?<!W)tu` OR `tú(?!W)`: los lookarounds se quedan pegados a una sola
 * rama y "turísticas" matchea "tu" sin mirar lo que sigue. Ese bug marco
 * cuarenta palabras de copy que estaban bien.
 */
const W = '[\\p{L}\\p{N}_]';
const word = (w: string) => new RegExp(`(?<!${W})(?:${w})(?!${W})`, 'giu');

/** Marcadores queembledran: [regex, forma neutra] */
const VOSEO: [RegExp, string][] = [
  [word('tenés|teneis'), 'tiene'],
  [word('querés|quereis'), 'quiere'],
  [word('podés|podeis'), 'puede'],
  [word('preferís|preferis'), 'prefiere'],
  [word('sabés|sabeis'), 'sabe'],
  [word('necesitás|necesitas'), 'necesita'],
  [word('quedás|quedas'), 'queda'],
  [word('buscás|buscas'), 'busca'],
  [word('pensás|pensas'), 'piensa'],
  [word('trabajás|trabajas'), 'trabaja'],
  [word('hacés|haces'), 'hace'],
  [word('elegí|elegi'), 'elija'],
  [word('dejás|dejas'), 'deja'],
  [word('mirás|miras'), 'mira'],
  [word('escribinos'), 'escríbanos'],
  [word('llámanos'), 'llámenos'],
  [word('contáctanos'), 'comuníquese con nosotros'],
  [word('avísanos'), 'avísenos'],
  [word('hablemos'), '—'],
];

const TUTEO: [RegExp, string][] = [
  [word('tu|tú'), 'su'],
  [word('tus|túes'), 'sus'],
  [word('necesitas'), 'necesita'],
  [word('puedes'), 'puede'],
  [word('quieres'), 'quiere'],
  [word('dejas'), 'deja'],
  [word('seleccionas'), 'seleccione'],
  [word('ingresas'), 'ingrese'],
  // Verbos en presente terminados en -s: la -s es la marca del tú, porque la
  // forma de usted la pierde. "deseas" se coló en /privacidad con la frase
  // "el derecho que deseas ejercer" y el guard original no lo miraba.
  [word('deseas'), 'desea'],
  [word('esperas'), 'espera'],
  [word('requieres'), 'requiere'],
  [word('tienes'), 'tiene'],
  [word('haces'), 'hace'],
  [word('entiendes'), 'entiende'],
  [word('comprendes'), 'comprende'],
  [word('aceptas'), 'acepta'],
  [word('cambias'), 'cambia'],
  [word('te avisaremos'), 'le avisaremos'],
  [word('te contactaremos'), 'lo contactaremos'],
  [word('te contactará'), 'lo contactará'],
  [word('te llamará'), 'lo llamará'],
  [word('te diremos'), 'le diremos'],
  [word('te responderemos'), 'le responderemos'],
  [word('te'), 'lo'],
];

/**
 * Regionalismos y voseo explicitamente brasileiro/rioplatense.
 *
 * "acá" y "ahí" NO van acá: son espanol estandar en toda la peninsula y en
 * America. Marcarlos daba cinco falsos positivos en copy que estaba bien
 * escrito. Lo que si es marcado es "vosotros" (solo Espana) y el calo
 * rioplatense.
 */
const REGIONAL: [RegExp, string][] = [
  [word('vosotros'), 'ustedes'],
  [word('che'), '—'],
  [word('boludo|boluda'), '—'],
  [word('guita'), '—'],
  [word('quilombo'), '—'],
  [word('al toque'), '—'],
];

const ALL = [...VOSEO, ...TUTEO, ...REGIONAL];

const SKIP = /https?:\/\/|mailto:|tel:|\.astro['"`]|from '|import |@param|\.test\(|\.match\(/;

/**
 * Saca los comentarios de una línea y deja el resto.
 *
 * Hace falta porque el copy vive en strings y la documentación técnica en
 * comentarios, y los dos están en el mismo archivo. Antes el filtro solo
 * miraba si la línea EMPEZABA por `//`, así que un comentario de varias
 * líneas en su segunda o tercera línea contaba como copy, y aparecía
 * "Bumpear acá" y el ejemplo `// "Tu ID de seguimiento"` como problemas de
 * registro. Son notas internas, no lo que ve el visitante.
 */
function sinComentarios(linea: string): string {
  let out = '';
  let i = 0;
  let quote: string | null = null;
  while (i < linea.length) {
    const c = linea[i];
    if (quote) {
      if (c === '\\') { out += c + (linea[i + 1] ?? ''); i += 2; continue; }
      out += c;
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; out += c; i++; continue; }
    if (c === '/' && linea[i + 1] === '/') break;
    if (c === '/' && linea[i + 1] === '*') break;
    if (c === '<' && linea.startsWith('<!--', i)) break;
    out += c;
    i++;
  }
  return out;
}

/** ¿La línea está dentro de un bloque `/* … *\/`? */
function enBloqueComentario(lineas: string[]): boolean[] {
  const dentro: boolean[] = [];
  let abierto = false;
  for (const l of lineas) {
    const abre = l.includes('/*');
    const cierra = l.includes('*/');
    dentro.push(abierto || abre);
    if (abre && !cierra) abierto = true;
    if (cierra) abierto = false;
  }
  return dentro;
}

const files = walk('src');

const offenders: string[] = [];

for (const file of files) {
  const rel = file.replace(/\\/g, '/');
  const lineas = readFileSync(file, 'utf8').split(/\r?\n/);
  const enBloque = enBloqueComentario(lineas);
  lineas.forEach((raw, i) => {
    if (enBloque[i]) return;
    const line = sinComentarios(raw);
    if (SKIP.test(line)) return;
    for (const [re, good] of ALL) {
      re.lastIndex = 0;
      for (const m of line.matchAll(re)) {
        if (good === '—') continue;
        offenders.push(
          `${rel}:${i + 1}  "${m[0]}" → ${good}   …${line.trim().slice(Math.max(0, m.index - 45), m.index + m[0].length + 45)}…`,
        );
      }
    }
  });
}

describe('registro del copy: espanol neutro, sin voseo', () => {
  it('ningún texto usa tuteo ni voseo', () => {
    expect(offenders).toEqual([]);
  });

  it('el límite de palabra entiende los acentos', () => {
    // Si este test falla, el guard de arriba marca palabras que terminán en
    // "te" o "tu" seguidas de vocal acentuada, y hay que revisarlas a mano.
    const accent = 'La normativa no es teórico: son puntos concretos.';
    for (const [re] of ALL) {
      re.lastIndex = 0;
      expect(accent.match(re)).toBeNull();
    }
  });

  it('no marca las formas que ya son correctas', () => {
    // "Cuéntenos" y "Recibe" son la conjugación de usted. "Hablemos" es
    // primera persona del plural y no distingue tuteo de voseo. Marcarlas
    // haría que el guard se ignorara en la primera pasada.
    const correctas = [
      'Cuéntenos qué necesita proteger.',
      'Recibe un ID de seguimiento y le avisamos.',
      'Hablemos de su seguridad.',
      'La requisición solo puede verificar la identidad de quien ingresa.',
    ];
    for (const frase of correctas) {
      for (const [re, good] of ALL) {
        if (good === '—') continue;
        re.lastIndex = 0;
        expect(frase.match(re)).toBeNull();
      }
    }
  });
});
