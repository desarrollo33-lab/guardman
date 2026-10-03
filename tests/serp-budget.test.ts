// Presupuesto de SERP y signals de descubrimiento.
//
// Existen porque el 2026-10-03, con 242 URLs en producción, 164 titles pasaban
// de 60 caracteres y 225 meta descriptions de 160. Google recorta el title
// alrededor de los 580px y la description alrededor de los 920px: no es una
// penalización, es pérdida directa de CTR, y era la corrección más barata de
// toda la auditoría. La causa era estructural — `BaseLayout` concatenaba la
// marca al title a ciegas y cada página sumaba su propio texto encima — así que
// el arreglo es un presupuesto en código, no 389 ediciones manuales.
//
// Estos tests fijan el presupuesto para que no vuelva a pasar por descuido: si
// alguien agrega un nombre de comuna más largo o un sufijo de marca nuevo, el
// recorte se encarga solo y el test sigue verde.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { composeTitle, fitDescription, TITLE_MAX, DESC_MAX } from '../src/lib/seo';
import {
  SITE,
  LOCATIONS,
  SERVICE_NAMES,
  SERVICE_TITLE_NAMES,
  serviceTitleName,
  COVERAGE_RM,
  COVERAGE_VS,
  COVERAGE_TOTAL,
  CONTENT_SIGNALS,
} from '../src/lib/constants';
import { SERVICES } from '../src/lib/content';

// ── El presupuesto, con los datos más largos que existen hoy ──────

describe('composeTitle', () => {
  it('respeta el presupuesto y conserva la marca', () => {
    const out = composeTitle('Guardias de Seguridad en Santiago Centro con Certificación OS-10', SITE.NAME);
    expect(out.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(out).toContain(SITE.NAME);
  });

  it('no toca un title que ya cabe', () => {
    const short = 'Guardpod en Lampa';
    expect(composeTitle(short, SITE.NAME)).toBe(`${short} ${SITE.NAME}`);
  });

  it('no duplica la marca si la página ya la trae', () => {
    const once = composeTitle(`Guardias en Lampa ${SITE.NAME}`, SITE.NAME);
    expect(once.split(SITE.NAME).length - 1).toBe(1);
  });

  it('nunca deja una preposición colgando al final', () => {
    // El corte por límite de palabra deja la última palabra partida. "con" o
    // "de" al final de un title se leen como error de redacción.
    const out = composeTitle('Auditoría de Seguridad en Santiago Centro con Certificación OS-10', SITE.NAME);
    expect(out).not.toMatch(/\b(con|de|en|para|por|y|o|la|el|a|un|una)\s+GuardMan$/);
  });

  it('corta la cola, no la cabeza: la keyword principal sobrevive', () => {
    // El nombre de la comuna es lo que trae la búsqueda local. Si el recorte
    // llegara asacarla, la página pasa a competir por un término que no es suyo.
    const out = composeTitle('Escoltas PPI en Las Condes con Certificación OS-10', SITE.NAME);
    expect(out).toContain('Las Condes');
  });

  it('aguanta el caso más largo del sitio: todos los servicios en todas las comunas', () => {
    for (const slug of Object.keys(SERVICE_NAMES)) {
      for (const loc of LOCATIONS) {
        const page = `${serviceTitleName(slug)} en ${loc.name} OS-10`;
        const out = composeTitle(page, SITE.NAME);
        expect(out.length, `${page} → "${out}" (${out.length})`).toBeLessThanOrEqual(TITLE_MAX);
        expect(out).toContain(loc.name);
      }
    }
  });
});

describe('fitDescription', () => {
  it('respeta el presupuesto cortando en límite de palabra', () => {
    const long = 'Guardias de Seguridad en Santiago Centro con certificación OS-10. Personal propio, central de monitoreo 24/7 y unidades Guardpod disponibles para esta comuna de la zona Centro. Cotización en 24 horas.';
    const out = fitDescription(long);
    expect(out.length).toBeLessThanOrEqual(DESC_MAX);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/\s(con|de|en|la|el|un|una)\s*…$/);
  });

  it('no toca una description que ya cabe', () => {
    const short = 'Guardias OS-10 en Las Condes. Cotización en 24 horas.';
    expect(fitDescription(short)).toBe(short);
  });
});

// ── La marca no se corta nunca ───────────────────────────────────

describe('nombres cortos de title', () => {
  it('todo servicio tiene nombre corto y el nombre por defecto es el completo', () => {
    for (const slug of Object.keys(SERVICE_NAMES)) {
      expect(serviceTitleName(slug)).toBeTruthy();
      expect(serviceTitleName(slug).length).toBeLessThanOrEqual(SERVICE_NAMES[slug].length);
    }
  });

  it('el nombre corto se usa solo en el title; H1 y schema conservan el completo', () => {
    // La keyword larga ("PPI (Protección de Personas Importantes)") tiene que
    // seguir indexándose en el H1 y en el JSON-LD. Acortar el title no puede
    //代价ar la entidad.
    expect(serviceTitleName('escoltas-privados')).toBe('Escoltas PPI');
    expect(SERVICES['escoltas-privados'].name).toBe('PPI (Protección de Personas Importantes)');
    expect(SERVICE_NAMES['escoltas-privados']).toBe('PPI (Protección de Personas Importantes)');
  });
});

// ── La agencia no aparece en los artefactos que leen las IAs ──────

describe('llms.txt no nombra a la agencia', () => {
  const files = ['src/pages/llms.txt.ts', 'src/lib/llms-docs.ts', 'src/lib/ai-catalog.ts', 'src/lib/constants.ts'];

  it('ningún artefacto de descubrimiento declara otro operador', () => {
    // /llms.txt es el resumen autoritativo de la marca frente a asistentes. La
    // línea "Operador del sitio: Millalobo Agencia (DEV33)" hacía que un modelo
    // atribuyera los datos de GuardMan a la agencia. Es la misma fuga que
    // cerró el hostname workers.dev, por el canal que las IAs leen.
    const offenders: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8').split(/\r?\n/);
      src.forEach((line, i) => {
        const code = line.replace(/\/\/.*$/, '').replace(/^\s*#.*$/, '');
        if (code.trim().length === 0) return;
        if (/millalobo|dev33|oficinadesarrollo/i.test(line)) offenders.push(`${f}:${i + 1} → ${line.trim().slice(0, 80)}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});

// ── security.txt ────────────────────────────────────────────────

describe('/.well-known/security.txt', () => {
  it('Expires es una fecha futura, no la del epoch', async () => {
    // La primera versión calculaba la fecha en el scope del módulo, donde el
    // runtime de Workers congela `Date.now()` en 0: el archivo salía con
    // `Expires: 1970-06-30`, que es peor que no emitir el campo, porque el
    // parser de RFC 9116 descarta el archivo entero si venció.
    const { GET } = await import('../src/pages/.well-known/security.txt');
    const body = await GET().text();
    const expires = new Date(body.match(/^Expires: (.+)$/m)![1]);
    expect(Number.isNaN(expires.getTime())).toBe(false);
    expect(expires.getTime()).toBeGreaterThan(Date.now());
  });

  it('trae los campos que exige RFC 9116 y no anuncia claves inexistentes', async () => {
    const { GET } = await import('../src/pages/.well-known/security.txt');
    const body = await GET().text();
    expect(body).toMatch(/^Contact: mailto:.+@guardman\.cl$/m);
    expect(body).toMatch(/^Canonical: https:\/\/guardman\.cl\/\.well-known\/security\.txt$/m);
    // `Encryption` apuntaría a /pgp-key.asc, que no existe. Anunciar una clave
    // que no se puede descargar destruye la confianza en todo el archivo.
    expect(body).not.toMatch(/^Encryption:/m);
  });
});

// ── Content-Signal definido una sola vez ─────────────────────────

describe('CONTENT_SIGNALS', () => {
  it('es la política declarada: sin entrenamiento, sí búsqueda, sí cita', () => {
    expect(CONTENT_SIGNALS).toBe('ai-train=no, search=yes, ai-input=yes');
  });

  it('robots.txt y middleware leen la misma constante', () => {
    const robots = readFileSync('src/pages/robots.txt.ts', 'utf8');
    expect(robots).toContain('${CONTENT_SIGNALS}');
    expect(robots).not.toMatch(/Content-Signal: ai-train/);

    const mw = readFileSync('src/middleware.ts', 'utf8');
    expect(mw).toContain("headers.set('Content-Signal', CONTENT_SIGNALS)");
  });
});

// ── Cobertura: una sola verdad, en todos los artefactos ─────────

describe('cifras de cobertura', () => {
  it('el total es la suma de las regiones', () => {
    expect(COVERAGE_TOTAL).toBe(COVERAGE_RM.length + COVERAGE_VS.length);
  });

  it('llms.txt declara el total junto con el desglose', () => {
    // La auditoría del 2026-10-03 encontró que /llms.txt decía "16 communes en
    // total" sin el desglose, mientras las páginas profundas solo decían
    // "14 communes de la RM". Un asistente que citaba la página profunda se
    // llevaba la mitad. El desglose va en la misma línea que el total.
    const src = readFileSync('src/pages/llms.txt.ts', 'utf8');
    expect(src).toContain('comunas en total (${COVERAGE_RM.length} en Región Metropolitana, ${COVERAGE_VS.length} en Valparaíso)');
  });
});
