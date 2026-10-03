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

  it('todo "N comunas" sin calificar dice el total real', () => {
    // El test de arriba solo miraba la forma "N comunas de la Región
    // Metropolitana". Por ese hueco pasaron seis textos vivos que publicaban
    // el número equivocado, entre ellos la meta description de las diez
    // páginas de servicio, el párrafo del hero de /servicios y el encabezado
    // que anuncia el mapa de /ubicaciones (con 16 marcadores debajo).
    //
    // "14" es correcto cuando se refiere a la RM y falso cuando habla del
    // total, así que la regla tiene que mirar el contexto de la misma línea.
    const offenders: string[] = [];
    const re = /(\d{1,2})\s+comunas/gi;
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (isComment(line)) return;
        for (const m of line.matchAll(re)) {
          const n = Number(m[1]);
          const after = line.slice(m.index + m[0].length);
          // "14 comunas de la RM" y "2 en Valparaíso" son correctos: se
          // comparan contra su propia constante, no contra el total.
          if (/^\s*(de la (Región Metropolitana|RM)|en Valparaíso)/i.test(after)) continue;
          if (n === COVERAGE_TOTAL) continue;
          offenders.push(
            `${file}:${i + 1} dice "${m[0]}" sin calificar (total real: ${COVERAGE_TOTAL})`,
          );
        }
      });
    }
    expect(offenders.join('\n')).toBe('');
  });

  it('ninguna constante de cobertura queda con el número escrito a mano', () => {
    // Una constante muerta con un número viejo no la ve ningún test de copy:
    // `STATS.COMUNAS = '14'` convivió meses con 16 comunas reales sin que
    // nada fallara, porque no se renderizaba. Ya no existe, y este test
    // falla si alguien la reintroduce para "usarla más adelante".
    const src = readFileSync('src/lib/constants.ts', 'utf8');
    expect(src).not.toMatch(/export const STATS\b/);
  });

  it('las constantes de cobertura cuadran entre sí', () => {
    // Si alguien agrega una comuna a la lista y olvida el total, el mismo bug
    // reaparece por otra vía.
    expect(COVERAGE_TOTAL).toBe(COVERAGE_RM.length + COVERAGE_VS.length);
    expect(COVERAGE_RM.length).toBe(14);
    expect(COVERAGE_VS.length).toBe(2);
  });
});
