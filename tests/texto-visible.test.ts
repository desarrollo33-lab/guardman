// Texto visible corrupto: markup y sintaxis de template que se renderizan
// literalmente.
//
// Dos bugs reales del mismo tipo, ambos visibles para el usuario y ninguno
// detectado por un test de source:
//
// 1. `/ubicaciones` escribía el subtítulo como `Presencia directa en
//    ${COVERAGE_PHRASE_RM}`. En Astro la interpolación es `{expr}`, sin `$`:
//    el compilador interpola la expresión y deja el `$` como texto, así que la
//    página decía "$14 comunas" y "$Los Andes". El `$` es un residuo de leer
//    un template literal de JavaScript.
//
// 2. `/canal-de-denencias` pasaba `subtitle='... <span class="required">*</span>
//    ...'`, pero `LeadForm` renderiza el subtítulo con `{subtitle}`, que
//    escapa. El usuario veía el HTML crudo. El mismo componente sí usa
//    `set:html` para `acceptLabel`, que es donde el markup sí es intentional.
//
// Estos tests atacan el SOURCE porque es lo que se puede fijar en una suite.
// La verificación de que el texto renderizado está limpio se hace sobre el
// HTML construido, no acá.
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

const files = walk('src');
const rel = (f: string) => f.replace(/\\/g, '/');

/**
 * Reparte las líneas de un .astro en "código" y "plantilla".
 *
 * Hace falta estado, no heurística: el frontmatter es todo lo que va entre
 * el primer `---` y el segundo, y ahí los template literals de JavaScript son
 * correctos (`<Icon> "${name}" no existe` es un mensaje de error, no markup).
 * Lo mismo con `<script>`. Adivinar por "tiene backtick" dejó pasar ese
 * falso positivo y hacía el test inservible.
 */
function splitRegions(src: string): { line: number; text: string; inTemplate: boolean }[] {
  const lines = src.split(/\r?\n/);
  const out: { line: number; text: string; inTemplate: boolean }[] = [];

  let fmEnd = -1;
  if (lines[0].trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') { fmEnd = i; break; }
    }
  }

  let scriptDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const inTemplate = i > fmEnd && scriptDepth === 0;
    out.push({ line: i + 1, text, inTemplate });
    const opens = (text.match(/<script\b/g) || []).length;
    const closes = (text.match(/<\/script>/g) || []).length;
    scriptDepth += opens - closes;
    if (scriptDepth < 0) scriptDepth = 0;
  }
  return out;
}

describe('sin sintaxis de template renderizada como texto', () => {
  const offenders: string[] = [];

  for (const file of files.filter((f) => f.endsWith('.astro'))) {
    for (const { line, text, inTemplate } of splitRegions(readFileSync(file, 'utf8'))) {
      const t = text.trim();
      if (!inTemplate) continue;
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('<!--')) continue;
      if (!/>[^<>]*\$\{/.test(text)) continue;
      offenders.push(`${rel(file)}:${line}  ${t.slice(0, 90)}`);
    }
  }

  it('ninguna línea de markup usa ${...} donde Astro espera {…}', () => {
    // Interpolar en Astro es {expr}. El $ pertenece a los template literals
    // de JavaScript y ahí sí es necesario; en el cuerpo de la plantilla es
    // un carácter suelto que se imprime.
    expect(offenders).toEqual([]);
  });

  it('el detector no confunde frontmatter ni <script> con markup', () => {
    // Si este test falla, el guard de arriba se volvió inútil por falsos
    // positivos: `Icon.astro` tiene un mensaje de error con `<Icon>` y `${}`.
    expect(offenders.some((o) => o.includes('Icon.astro'))).toBe(false);
  });
});

describe('los props de texto no llevan markup', () => {
  // `subtitle` se renderiza con {subtitle} (escapa). `acceptLabel` sí se
  // renderiza con set:html. Poner HTML en un prop de texto hace que el
  // usuario vea las etiquetas en pantalla.
  const TEXT_ONLY_PROPS = ['subtitle', 'footNote', 'errorText', 'headerTitle', 'headerLabel'];
  const offenders: string[] = [];

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    src.split(/\r?\n/).forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('<!--')) return;
      for (const prop of TEXT_ONLY_PROPS) {
        const re = new RegExp(`${prop}\\s*=\\s*(?:'([^']*)'|"([^"]*)")`);
        const m = re.exec(line);
        if (!m) continue;
        const value = m[1] ?? m[2] ?? '';
        if (/<\/?[a-zA-Z][^>]*>/.test(value)) {
          offenders.push(`${rel(file)}:${i + 1}  ${prop} lleva HTML: "${value.slice(0, 80)}"`);
        }
      }
    });
  }

  it('ningún prop de texto se pasa con etiquetas dentro', () => {
    expect(offenders).toEqual([]);
  });
});

describe('el HTML embebido en datos viene de un prop que sí acepta markup', () => {
  // El inverso del test anterior, para no "arreglar" un caso que sí es
  // intencional: `acceptLabel` lleva <a> y <span> y se renderiza con
  // set:html, así que debe seguir permitiéndolo.
  it('acceptLabel sigue pudiendo llevar HTML', () => {
    const src = readFileSync('src/components/LeadForm.astro', 'utf8');
    expect(src).toMatch(/set:html=\{f\.acceptLabel\}/);
  });
});
