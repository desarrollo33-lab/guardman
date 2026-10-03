// Guardián contra el número de cobertura escrito a mano en copy público.
//
// Ya pasó dos veces: `content.ts` traía "12 comunas de la Región Metropolitana"
// cuando la RM tiene 14, y el mismo "12" sobrevivencia en el `toolparamdescription`
// del formulario de cotización y en la meta description de /ubicaciones. Los tres
// son textos que leen asistentes: un número falso ahí se repite como verdad.
//
// La regla del repo es que todo dato de cobertura salga de `constants.ts`. Este
// test la hace verificable en vez de confiar en la buena voluntad del siguiente
// que edite una description.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { COVERAGE_RM, COVERAGE_VS, COVERAGE_TOTAL } from '../src/lib/constants';

const SOURCE_DIRS = ['src/pages', 'src/components', 'src/lib'];
const EXTS = ['.astro', '.ts', '.tsx'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTS.some((e) => name.endsWith(e)) ? [full] : [];
  });
}

const files = SOURCE_DIRS.flatMap((d) => walk(d));

/** Las líneas de comentario no se renderizan: el test mira copy, no historia. */
const isComment = (line: string) => /^\s*(\/\/|\/\*|\*|<!--)/.test(line);

describe('cobertura: ningún número escrito a mano', () => {
  it('no hay "N comunas de la Región Metropolitana" con un N equivocado', () => {
    const offenders: string[] = [];
    // Criterio "distinto del real", no "presente": un comentario que documenta
    // el número correcto (o el error histórico) no es un bug.
    const re = /(\d{1,2})\s+comunas de la Región Metropolitana/g;
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (isComment(line)) return;
        for (const m of line.matchAll(re)) {
          if (Number(m[1]) === COVERAGE_RM.length) continue;
          offenders.push(`${file}:${i + 1} dice "${m[0]}" (real: ${COVERAGE_RM.length})`);
        }
      });
    }
    expect(offenders.join('\n')).toBe('');
  });

  it('las constantes de cobertura cuadran entre sí', () => {
    // Si alguien agrega una comuna a la lista y olvida el total, el mismo bug
    // reaparece por otra vía.
    expect(COVERAGE_TOTAL).toBe(COVERAGE_RM.length + COVERAGE_VS.length);
    expect(COVERAGE_RM.length).toBe(14);
    expect(COVERAGE_VS.length).toBe(2);
  });
});
