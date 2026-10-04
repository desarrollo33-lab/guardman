import { describe, it, expect } from 'vitest';
import { LOCATIONS, SERVICES } from '../src/lib/content';
import {
  coverageDe,
  faqsDe,
  metodoDe,
  cierreDe,
  problemasDe,
  nombreEnOracion,
  dedupeFaqs,
} from '../src/lib/combo-copy';

/**
 * El copy de las 187 páginas servicio × comuna.
 *
 * La auditoría del 2026-10-03 midió que el 52,4% del texto visible de esas
 * páginas se repetía entre communes del mismo servicio. La causa no era falta
 * de datos: `LOCATIONS[slug]` ya tenía, por comuna, 6 features y 3 FAQs
 * escritas para ese lugar, y el template solo usaba 4 bullets con un filtro por
 * palabra en común y 1 FAQ del SERVICIO con un `replace` del nombre de la
 * comuna. El mismo texto, 16 veces.
 *
 * Estos tests blinda lo que se arregló, y sobre todo dos cosas que se pueden
 * volver a romper sin que nadie lo note:
 *
 *   1. Que dos communes del mismo servicio no produzcan el mismo bloque de
 *      cobertura. Si `coverageDe` vuelve a filtrar por palabras en común y cae
 *      al fallback para todas, el test falla.
 *   2. Que la FAQ de la página sea distinta entre communes. Es lo que hace que
 *      estas URLs Respondan algo y no repitan el catálogo del servicio.
 */

const slugsLoc = Object.keys(LOCATIONS);
const slugsSvc = Object.keys(SERVICES);

describe('copy único por comuna', () => {
  it('cada comuna produce un bloque de cobertura distinto de sus hermanas', () => {
    for (const svc of slugsSvc) {
      const bloques = slugsLoc.map((l) => JSON.stringify(coverageDe(LOCATIONS[l], svc).puntos));
      // Tolerance de 1: dos communes muy parecidas pueden compartir 1 bullet.
      // Lo que no puede pasar es que las 16 tengan el mismo bloque.
      const unicos = new Set(bloques).size;
      expect(
        unicos,
        `${svc}: las ${slugsLoc.length} communes producen solo ${unicos} bloques de cobertura distintos`,
      ).toBeGreaterThanOrEqual(Math.ceil(slugsLoc.length / 2));
    }
  });

  it('la FAQ de cada comuna es distinta de sus hermanas', () => {
    for (const svc of slugsSvc) {
      const primers = slugsLoc.map((l) => faqsDe(LOCATIONS[l], svc)[0]?.q ?? '');
      const unicos = new Set(primers).size;
      expect(
        unicos,
        `${svc}: ${unicos} primeras preguntas distintas entre ${slugsLoc.length} communes`,
      ).toBeGreaterThanOrEqual(Math.ceil(slugsLoc.length / 2));
    }
  });

  it('la FAQ empieza con las preguntas de la comuna, no con las del servicio', () => {
    // Es el orden que hace la diferencia: las 3 primeras son las que
    // distinguen esta URL de sus 15 hermanas.
    for (const svc of slugsSvc) {
      for (const loc of slugsLoc) {
        const deLoc = faqsDe(LOCATIONS[loc], svc).slice(0, 3);
        const esperadas = LOCATIONS[loc].faqs.map((f) => f.q);
        const coincide = deLoc.length === esperadas.length &&
          deLoc.every((f, i) => f.q === esperadas[i]);
        expect(
          coincide,
          `${svc}/${loc}: las 3 primeras preguntas no son las de la comuna`,
        ).toBe(true);
      }
    }
  });

  it('ninguna comuna repite su FAQ dentro de la misma página', () => {
    for (const svc of slugsSvc) {
      for (const loc of slugsLoc) {
        const faqs = faqsDe(LOCATIONS[loc], svc);
        const claves = faqs.map((f) => f.q.toLowerCase().replace(/[¿?.,]/g, '').trim());
        expect(
          new Set(claves).size,
          `${svc}/${loc}: hay preguntas repetidas en ${claves.join(' | ')}`,
        ).toBe(claves.length);
      }
    }
  });

  it('el bloque de cobertura nunca queda vacío', () => {
    for (const svc of slugsSvc) {
      for (const loc of slugsLoc) {
        const c = coverageDe(LOCATIONS[loc], svc);
        expect(c.puntos.length, `${svc}/${loc}: cobertura sin puntos`).toBeGreaterThan(0);
        expect(c.intro, `${svc}/${loc}: intro vacía`).toContain(LOCATIONS[loc].name);
      }
    }
  });

  it('el método y el cierre nombran la comuna', () => {
    for (const svc of slugsSvc) {
      for (const loc of slugsLoc) {
        const nombre = LOCATIONS[loc].name;
        expect(metodoDe(LOCATIONS[loc], svc), `${svc}/${loc}`).toContain(nombre);
        expect(cierreDe(LOCATIONS[loc], svc), `${svc}/${loc}`).toContain(nombre);
      }
    }
  });

  it('los problemas empiezan por los de la comuna, no por los del servicio', () => {
    for (const svc of slugsSvc) {
      for (const loc of slugsLoc) {
        const probs = problemasDe(LOCATIONS[loc], svc);
        const primerosDeLoc = LOCATIONS[loc].problems;
        expect(
          probs[0],
          `${svc}/${loc}: el primer problema no es de la comuna`,
        ).toBe(primerosDeLoc[0]);
      }
    }
  });
});

describe('nombre del servicio dentro de una oración', () => {
  it('baja todas las palabras menos la primera y las siglas', () => {
    expect(nombreEnOracion('guardias-de-seguridad', 'Guardias de Seguridad'))
      .toBe('Guardias de seguridad');
    expect(nombreEnOracion('cctv-videovigilancia', 'CCTV y Videovigilancia'))
      .toBe('CCTV y videovigilancia');
    expect(nombreEnOracion('escoltas-privados', 'Escoltas PPI'))
      .toBe('Escoltas PPI');
  });

  it('no deja mayúsculas en medio de la frase', () => {
    // El bug que motivó la función: "Preguntas sobre guardias de Seguridad",
    // con la S en mayúscula en medio de la oración.
    for (const svc of slugsSvc) {
      const n = nombreEnOracion(svc, SERVICES[svc].name);
      const palabras = n.split(' ').slice(1);
      for (const p of palabras) {
        if (/^(PPI|CCTV|OS-10)$/.test(p)) continue;
        expect(
          p,
          `${svc}: "${p}" queda con mayúscula en medio de la frase`,
        ).toBe(p.toLowerCase());
      }
    }
  });
});

describe('dedupe de FAQ', () => {
  it('compara sin tildes, mayúsculas ni signos', () => {
    const r = dedupeFaqs([
      { question: '¿Cuál es el tiempo de respuesta?' },
      { question: 'Cual es el tiempo de respuesta' },
      { question: '¿Otro tema?' },
    ]);
    expect(r).toHaveLength(2);
  });

  it('acepta las dos formas del campo, question y q', () => {
    const r = dedupeFaqs([{ q: '¿A?' }, { question: '¿A?' }]);
    expect(r).toHaveLength(1);
  });
});
