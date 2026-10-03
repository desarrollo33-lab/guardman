// Integridad del linking interno.
//
// Estos tests existen porque el sitio ya rompió enlaces dos veces y ninguna de
// las dos se detectó a tiempo:
//
//   1. `/seguridad-privada/como-elegir-empresa-de-seguridad` estaba enlazado
//      desde las 4 guías y respondía 404 (la guía vive en `/guias/...`).
//   2. El botón "Consultar estado de mi denuncia" apuntaba a
//      `/canal-de-denuncias/estado/`, que sin ID es 404, y el JS que debía
//      reescribir el href buscaba un `id` que `LeadForm` nunca emitía.
//
// Un href mal escrito en un sidebar es invisible en revisión visual: la página
// se ve bien, el texto está donde debe, y el 404 solo aparece si alguien hace
// clic. Estos tests convierten esa dependencia del clic en un fallo de build.
//
// El segundo bloque cubre el problema estructural que dejó aislada la capa
// editorial: las guías, el marco legal y las soluciones se enlazaban entre sí
// pero no llegaban a ninguna página comercial, así que un lector que terminaba
// una guía no tenía camino visible hacia un servicio.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SERVICE_NAMES, SECTOR_NAMES, LOCATIONS } from '../src/lib/constants';
import { AUTHORITY_PAGES } from '../src/lib/authority';
import { GUIDES } from '../src/lib/guias';
import { SOLUTIONS } from '../src/lib/soluciones';
import {
  EDITORIAL_BRIDGE,
  SERVICE_BRIDGE,
  SECTOR_BRIDGE,
  bridgeItems,
} from '../src/lib/internal-links';

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
const isComment = (line: string) => /^\s*(\/\/|\/\*|\*|<!--)/.test(line);

/** Rutas reales del sitio. `src/data` no existe; todo sale de `src/lib`. */
const STATIC_ROUTES = [
  '/', '/servicios', '/ubicaciones', '/sectores', '/nosotros', '/guard-pod',
  '/ajax-systems', '/contacto', '/cotizacion', '/canal-de-denuncias', '/gracias',
  '/privacidad', '/terminos', '/guias', '/seguridad-privada', '/soluciones',
];

/** Prefijos que matchean rutas dinámicas (su contenido no se puede enumerar). */
const DYNAMIC_PREFIXES = ['/canal-de-denuncias/estado/'];

function knownRoutes(): Set<string> {
  const r = new Set(STATIC_ROUTES);
  for (const slug of Object.keys(SERVICE_NAMES)) {
    r.add(`/servicios/${slug}`);
    for (const loc of LOCATIONS) r.add(`/servicios/${slug}/${loc.slug}`);
  }
  for (const slug of Object.keys(SECTOR_NAMES)) r.add(`/sectores/${slug}`);
  for (const loc of LOCATIONS) r.add(`/ubicaciones/${loc.slug}`);
  for (const g of GUIDES) r.add(`/guias/${g.slug}`);
  for (const p of AUTHORITY_PAGES) r.add(`/seguridad-privada/${p.slug}`);
  for (const s of SOLUTIONS) r.add(`/soluciones/${s.slug}`);
  return r;
}

const norm = (href: string) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  const p = clean.replace(/\/+$/, '');
  return p || '/';
};

describe('integridad de enlaces internos', () => {
  const routes = knownRoutes();
  const offenders: string[] = [];

  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (isComment(line)) return;
      for (const m of line.matchAll(/href\s*=\s*["'`]([^"'`]+)["'`]/g)) {
        const raw = m[1];
        if (raw.startsWith('http') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
        if (raw.startsWith('/_astro') || raw.startsWith('/images') || raw.startsWith('/videos')) continue;
        // Archivos estáticos servidos desde public/ (favicon, .webm, .json…), no rutas.
        if (/\.(svg|png|jpe?g|webp|gif|ico|css|js|xml|txt|json|webm|mp4|pdf|woff2?)$/i.test(raw)) continue;
        // El panel admin es noindex y no entra al sitemap: su navegación no es
        // linking interno público y sus rutas son dynamics con sus propias rutas.
        if (raw.startsWith('/admin') || raw.startsWith('/api')) continue;
        if (raw.includes('${') || raw.includes('<')) continue; // interpolado, se valida en runtime
        const p = norm(raw);
        if (p === null) continue;
        if (DYNAMIC_PREFIXES.some((pre) => p.startsWith(pre))) continue;
        if (!routes.has(p)) offenders.push(`${file}:${i + 1} → "${raw}"`);
      }
    });
  }

  it('ningún href estático apunta a una ruta que el sitio no genera', () => {
    expect(offenders).toEqual([]);
  });

  it('ningún enlace al estado de denuncia apunta a la ruta sin ID', () => {
    const bad: string[] = [];
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (isComment(line)) return;
        // Sin ID la ruta responde 404: el ID lo inyecta el JS tras enviar.
        if (/href\s*[:=]\s*["'`]\/canal-de-denuncias\/estado\/?["'`]/.test(line)) {
          bad.push(`${file}:${i + 1}`);
        }
      });
    }
    expect(bad).toEqual([]);
  });

  it('la acción de estado de denuncia conserva el id que el JS reescribe', () => {
    const page = readFileSync('src/pages/canal-de-denuncias.astro', 'utf8');
    const form = readFileSync('src/components/LeadForm.astro', 'utf8');
    expect(page).toContain('id: \'denuncia-status-link\'');
    // Si LeadForm no emite el id, el getElementById del JS devuelve null y el
    // href queda apuntando al fallback para siempre.
    expect(form).toMatch(/id=\{a\.id\}/);
  });
});

describe('puentes entre la capa editorial y la comercial', () => {
  const routeSet = knownRoutes();

  const allEditorial = [
    ...GUIDES.map((g) => ({ slug: g.slug, url: `/guias/${g.slug}` })),
    ...AUTHORITY_PAGES.map((p) => ({ slug: p.slug, url: `/seguridad-privada/${p.slug}` })),
    ...SOLUTIONS.map((s) => ({ slug: s.slug, url: `/soluciones/${s.slug}` })),
  ];

  it('todo artículo editorial declara sus enlaces comerciales', () => {
    const missing = allEditorial
      .filter((p) => !EDITORIAL_BRIDGE[p.slug] || EDITORIAL_BRIDGE[p.slug].length === 0)
      .map((p) => p.url);
    expect(missing).toEqual([]);
  });

  it('cada enlace del puente editorial apunta a una ruta real', () => {
    const bad: string[] = [];
    for (const [slug, links] of Object.entries(EDITORIAL_BRIDGE)) {
      for (const l of links) {
        if (!routeSet.has(norm(l.href) ?? '')) bad.push(`${slug} → ${l.href}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('cada puente comercial enlaza al menos a un servicio o sector', () => {
    const isComercial = (href: string) =>
      ['/servicios', '/sectores'].includes(href) ||
      href.startsWith('/servicios/') ||
      href.startsWith('/sectores/');
    const bad = Object.entries(EDITORIAL_BRIDGE)
      .filter(([, links]) => !links.some((l) => isComercial(l.href)))
      .map(([slug]) => slug);
    expect(bad).toEqual([]);
  });

  it('todo servicio declara sus enlaces a contenido editorial', () => {
    const bad = Object.keys(SERVICE_NAMES).filter((slug) => !(SERVICE_BRIDGE[slug]?.length > 0));
    expect(bad).toEqual([]);
  });

  it('todo sector declara sus enlaces a contenido editorial', () => {
    const bad = Object.keys(SECTOR_NAMES).filter((slug) => !(SECTOR_BRIDGE[slug]?.length > 0));
    expect(bad).toEqual([]);
  });

  it('los puentes de servicio y sector apuntan a rutas reales', () => {
    const bad: string[] = [];
    for (const [slug, links] of [...Object.entries(SERVICE_BRIDGE), ...Object.entries(SECTOR_BRIDGE)]) {
      for (const l of links) {
        if (!routeSet.has(norm(l.href) ?? '')) bad.push(`${slug} → ${l.href}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('ningún artículo editorial queda huérfano', () => {
  // Los tests de arriba verifican dirección SALIENTE: que cada artículo
  // declare a dónde lleva. Nada verificaba que algo lo llevara a él, y por
  // eso dos artículosconvivieron con la capa editorial sin ninguna entrada
  // más que el índice de su sección:
  //
  //   /guias/cuantos-guardias-para-mi-edificio
  //   /seguridad-privada/funciones-guardia-en-condominio
  //
  // Declaraban sus propios puentes, pasaban la suite entera, y no eran
  // alcanzables desde ningún servicio ni sector: las dos cosas que un lector
  // de un servicio está buscando justo antes de cotizar.
  //
  // La entrada mínima es 1 (el índice de sección cuenta): el objetivo no es
  // repartir PageRank, es que ninguna página exista sólo para Google.
  const allBridges = [
    ...Object.values(EDITORIAL_BRIDGE),
    ...Object.values(SERVICE_BRIDGE),
    ...Object.values(SECTOR_BRIDGE),
  ].flat();

  const editorial = [
    ...GUIDES.map((g) => `/guias/${g.slug}`),
    ...AUTHORITY_PAGES.map((p) => `/seguridad-privada/${p.slug}`),
    ...SOLUTIONS.map((s) => `/soluciones/${s.slug}`),
  ];

  it('cada artículo editorial es destino de al menos un enlace del sitio', () => {
    // El índice de cada sección ya los enlaza a todos con un `.map` sobre el
    // catálogo, así que "reachable desde el índice" no distingue nada: sería
    // una prueba que siempre pasa. Lo que faltaba y faltaba es el enlace
    // desde la capa comercial. Por eso el criterio es "destino de al menos un
    // puente": un artículo que solo aparece en su índice no tiene camino
    // desde el servicio que lojustify.
    const orphans = editorial.filter(
      (url) => !allBridges.some((l) => norm(l.href) === url),
    );
    expect(orphans).toEqual([]);
  });

  it('los dos artículos que estaban huérfanos ya tienen entrada desde un puente', () => {
    // Fijados por nombre: son el caso concreto que motivó este bloque, y un
    // test genérico que ya no falla no deja ver que volvió a pasar.
    const mustBeLinked = [
      '/guias/cuantos-guardias-para-mi-edificio',
      '/seguridad-privada/funciones-guardia-en-condominio',
    ];
    const missing = mustBeLinked.filter(
      (url) => !allBridges.some((l) => norm(l.href) === url),
    );
    expect(missing).toEqual([]);
  });

  it('ningún artículo editorial se enlaza a sí mismo', () => {
    const selfLinks: string[] = [];
    for (const [slug, links] of Object.entries(EDITORIAL_BRIDGE)) {
      for (const l of links) {
        if (
          norm(l.href) === `/guias/${slug}` ||
          norm(l.href) === `/seguridad-privada/${slug}` ||
          norm(l.href) === `/soluciones/${slug}`
        ) {
          selfLinks.push(`${slug} → ${l.href}`);
        }
      }
    }
    expect(selfLinks).toEqual([]);
  });
});

describe('el grafo entre servicios y comunas es simétrico', () => {
  // Hay 160 páginas de servicio × comuna. Durante un tiempo el único camino
  // hacia ellas era /ubicaciones/{comuna}, así que cada comuna llegaba a sus
  // diez servicios pero ningún servicio bajaba a sus dieciséis comunas:
  // /servicios/{svc} quedaba como un callejón sin salida hacia abajo, y el
  // lector que estaba en "Guardias de Seguridad" y elegía su comuna caía en la
  // cobertura general, perdiendo el servicio que estaba mirando.
  //
  // Se comprueba sobre las plantillas, que es donde el enlace se declara. Un
  // grafo que se rompe por un cambio de href es invisible en revisión visual.
  const serviceTemplate = readFileSync('src/pages/servicios/[slug].astro', 'utf8');
  const comboTemplate = readFileSync(
    'src/pages/servicios/[service]/[location].astro',
    'utf8',
  );
  const locationTemplate = readFileSync('src/pages/ubicaciones/[slug].astro', 'utf8');

  it('la página de servicio baja a sus variantes por comuna', () => {
    // El href tiene que llevar el slug del SERVICIO, no solo el de la comuna.
    expect(serviceTemplate).toMatch(/href=\{`\/servicios\/\$\{slug\}\/\$\{l\.slug\}`\}/);
  });

  it('la página de comuna sube a sus variantes por servicio', () => {
    expect(locationTemplate).toMatch(/href=\{`\/servicios\/\$\{s\}\/\$\{slug\}`\}/);
  });

  it('el combo devuelve el camino a la comuna y a sus hermanas', () => {
    // El breadcrumb ya no mete /ubicaciones/{comuna} (era un salto de rama
    // cruzada), pero el cuerpo sí tiene que ofrecerlo: es lo que mantiene viva
    // la entrada desde la capa de servicios hacia la capa de cobertura.
    expect(comboTemplate).toMatch(/href=\{`\/ubicaciones\/\$\{locationSlug\}`\}/);
    expect(comboTemplate).toMatch(/href=\{`\/servicios\/\$\{serviceSlug\}\/\$\{l\.slug\}`\}/);
  });

  it('ninguna plantilla de servicio vuelve a apuntar solo a la comuna genérica', () => {
    // Si alguien revierte el href a /ubicaciones/{l.slug}, la asimetría
    // regresa sin que ninguna otra prueba se entere. El patrón mira el href,
    // no la clase: `class="loc-tag">{l.name}` es idéntico en las dos
    // versiones y no distingue nada.
    expect(serviceTemplate).not.toMatch(/href=\{`\/ubicaciones\/\$\{l\.slug\}`\}[^>]*class="loc-tag"/);
  });
});

describe('los puentes se renderizan con el widget canónico', () => {
  // El sitio tiene un widget para esto: RelatedLinks. Una versión paralela del
  // mismo markup ya se construyó una vez (`EditorialBridge`) y terminó siendo
  // el segundo componente con el mismo encabezado y las mismas clases, que es
  // exactamente lo que después hay que mantener en dos lugares. Estos tests
  // hacen que la próxima sección nueva pase por el widget en vez de copiarlo.
  it('no existe un componente de cluster paralelo a RelatedLinks', () => {
    expect(existsSync('src/components/EditorialBridge.astro')).toBe(false);
  });

  const templates = [
    'src/pages/guias/[slug].astro',
    'src/pages/seguridad-privada/[slug].astro',
    'src/pages/soluciones/[slug].astro',
    'src/pages/servicios/[slug].astro',
    'src/pages/sectores/[slug].astro',
    'src/pages/servicios/[service]/[location].astro',
  ];

  it('las seis plantillas montan el puente con RelatedLinks', () => {
    const bad = templates.filter((f) => !readFileSync(f, 'utf8').includes('<RelatedLinks'));
    expect(bad).toEqual([]);
  });

  it('ninguna plantilla define su propio markup de cluster', () => {
    const bad: string[] = [];
    for (const f of templates) {
      const src = readFileSync(f, 'utf8');
      // Un cluster propio se delata por repetir las clases del widget.
      if (/class="cluster-(grid|card|header)"/.test(src)) bad.push(f);
    }
    expect(bad).toEqual([]);
  });

  it('la home monta su bloque editorial con RelatedLinks, no con un grid propio', () => {
    const src = readFileSync('src/pages/index.astro', 'utf8');
    expect(src).toContain('<RelatedLinks');
    const own = src.match(/<div class="card-grid"[^>]*>\s*\{home/g);
    expect(own).toBeNull();
  });
});

describe('iconos de los puentes', () => {
  // `bridgeItems` deriva el icono de la ruta. Un nombre inventado no rompe el
  // build: Astro renderiza el <svg> vacío y la tarjeta sale sin icono, que es
  // un defecto visual que ningún otro test ve.
  it('todo icono de puente existe en el catálogo de Icon', () => {
    const icons = readFileSync('src/lib/icons.ts', 'utf8');
    const known = new Set(
      [...icons.matchAll(/^\s{2}([a-zA-Z0-9]+):/gm)].map((m) => m[1]),
    );
    expect(known.size).toBeGreaterThan(20);
    const bad = new Set<string>();
    for (const map of [EDITORIAL_BRIDGE, SERVICE_BRIDGE, SECTOR_BRIDGE]) {
      for (const links of Object.values(map)) {
        for (const it of bridgeItems(links)) {
          if (!known.has(it.icon)) bad.add(`${it.url} → ${it.icon}`);
        }
      }
    }
    expect([...bad]).toEqual([]);
  });
});
