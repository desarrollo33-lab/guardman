import { describe, it, expect } from 'vitest';
import { ZONAS } from '../src/lib/content';
import { LOCATIONS, COVERAGE_TOTAL, RM_COMMUNES_LIST, VS_COMMUNES_LIST } from '../src/lib/constants';

/**
 * Cobertura derivada, no escrita a mano.
 *
 * El bloque de cobertura del home tenía su propia lista de communes, escrita a
 * mano, y `ZONAS` era otro array escrito a mano. Los dos se desincronizaron: el
 * home anunciaba 16 communes y enumeraba 14. Faltaban Providencia y Ñuñoa, que
 * sí tienen página propia, aparecen en la navegación y traen leads — el
 * comentario de `content.ts` deja registro de que a un lead de Providencia se le
 * dijo que no lo cubrían.
 *
 * El agravante era silencioso: como el mapa hace `ZONAS.find(...) ?? 'Centro'`,
 * esas dos communes se pintaban como Zona Centro. El `??` tapaba el dato
 * faltante en vez de delatarlo.
 *
 * Ahora `ZONAS` se deriva de `LOCATIONS` y el párrafo del home usa
 * `RM_COMMUNES_LIST` / `VS_COMMUNES_LIST`. Este test verifica que la derivación
 * no vuelva a desincronizarse.
 *
 * Complementa a `cobertura.test.ts`, que vigila los N written a mano en el copy.
 * Este vigila la estructura: que el array de zonas exista y sea coherente.
 */
describe('cobertura derivada de LOCATIONS', () => {
  it('toda comuna de LOCATIONS cae en exactamente una zona', () => {
    const zonas = ZONAS.flatMap((z) => z.locations);
    const nombres = LOCATIONS.map((l) => l.name);
    expect(zonas.filter((n) => !nombres.includes(n)), 'comunas que no existen en LOCATIONS').toEqual([]);
    expect(nombres.filter((n) => !zonas.includes(n)), 'comunas sin zona asignada').toEqual([]);
    expect(new Set(zonas).size, 'comuna repetida en dos zonas').toBe(zonas.length);
  });

  it('Providencia y Ñuñoa están en Zona Oriente, no en Centro', () => {
    const oriente = ZONAS.find((z) => z.name === 'Oriente');
    expect(oriente?.locations).toContain('Providencia');
    expect(oriente?.locations).toContain('Ñuñoa');
    const centro = ZONAS.find((z) => z.name === 'Centro');
    expect(centro?.locations).not.toContain('Providencia');
    expect(centro?.locations).not.toContain('Ñuñoa');
  });

  it('el conteo de cobertura coincide con la cantidad real de communes', () => {
    expect(COVERAGE_TOTAL).toBe(LOCATIONS.length);
  });

  it('los listados del home cubren todas las communes', () => {
    const enHome = `${RM_COMMUNES_LIST} ${VS_COMMUNES_LIST}`;
    for (const l of LOCATIONS) {
      expect(enHome, `"${l.name}" no aparece en el párrafo de cobertura del home`).toContain(l.name);
    }
  });

  it('ninguna comuna de Valparaíso aparece en la lista de la RM', () => {
    const rm = RM_COMMUNES_LIST;
    for (const l of LOCATIONS.filter((x) => x.zone === 'Valparaíso')) {
      expect(rm, `${l.name} es de Valparaíso y no debería estar en la lista de la RM`).not.toContain(l.name);
    }
  });
});
