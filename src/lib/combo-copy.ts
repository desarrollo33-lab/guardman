/**
 * Copy único para las páginas servicio × comuna.
 *
 * EL PROBLEMA QUE RESUELVE
 * -----------------------
 * Las 187 páginas de `servicios/[service]/[location]` repetían el 52,4% de
 * su texto visible entre comunas del mismo servicio. No por falta de datos:
 * `LOCATIONS[slug]` YA tiene, para cada una de las 16 comunas, 6 features y
 * 3 FAQs escritas Specifically para ese lugar —"Control de acceso para
 * embajadas y consulados con protocolos diplomáticos", "Vehículos de lujo
 * como objetivo en estacionamientos de restaurantes"—, y el template solo
 * usaba 4 bullets y 1 de esas 3 FAQs.
 *
 * Peor: la FAQ que sí se mostraba venía de `svc.faqs` (del servicio) con un
 * `replace(/Las Condes|la comuna/g, loc.name)`. El resultado era la misma
 * respuesta genérica en las 16 páginas, que es justo lo que un asistente
 * descarta como contenido sin valor.
 *
 * QUÉ HACE
 * --------
 * Cruza los datos que ya existen y los ordena por lo que la persona vino a
 * preguntar a ESA página. No inventa cifras ni agrega bloques: todo lo que
 * devuelve sale de `LOCATIONS` y `SERVICES`, que son las fuentes que ya
 * estaban en el repo.
 *
 * LA REGLA
 * --------
 * Cada bloque responde la pregunta de una persona que llegó a la URL
 * `/servicios/guardias-de-seguridad/las-condes`, no a la de la home del
 * servicio. Si una frase podría estar en las otras 15 hermanas sin que nadie
 * lo note, no va aquí.
 */

import { LOCATIONS, SERVICES } from './content';

type Loc = (typeof LOCATIONS)[string];
type Svc = (typeof SERVICES)[string];

/** Servicio → las comunidades donde ese servicio tiene una lectura propia. */
const CLAVES_DE_SERVICIO: Record<string, string[]> = {
  'guardias-de-seguridad': [
    'guardia', 'vigilancia', 'control de accesos', 'vigilante', 'ronda', 'seguridad privada',
  ],
  'cctv-videovigilancia': [
    'cámara', 'camaras', 'video', 'videovigilancia', 'cftv', 'grabación', 'imagen',
  ],
  'control-de-accesos': [
    'acceso', 'accesos', 'control', 'lector', 'portón', 'garita', 'credencial',
  ],
  'escoltas-privados': [
    'escolta', 'escoltas', 'vehículo', 'vehiculos', 'traslado', 'ruta', 'ejecutivo',
  ],
  'monitoreo-24-7': [
    'monitoreo', 'central', 'alarma', 'alarmas', 'operador', 'respuesta', 'centralizado',
  ],
  'seguridad-eventos': [
    'evento', 'eventos', 'afluencia', 'control de entradas', 'recinto', 'masa',
  ],
  'seguridad-deportiva': [
    'deportiv', 'estadio', 'gimnasio', 'club', 'partido', 'torneo', 'cancha',
  ],
  'seguridad-industrial': [
    'industrial', 'faena', 'planta', 'bodega', 'almacenamiento', 'ruta', 'operación',
  ],
  'auditoria-seguridad': [
    'auditoría', 'auditoria', 'diagnóstico', 'revisión', 'evaluación', 'certificación',
  ],
  'guard-pod': [
    'autónomo', 'autonomo', 'perímetro', 'perimetro', 'faena', 'predio', 'energía',
  ],
  aseo: ['aseo', 'limpieza', 'higiene', 'limpieza', 'residuos', 'sanitizar'],
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Nombre del servicio como se escribe dentro de una oración.
 *
 * `serviceNameInSentence` (en `constants.ts`) solo baja la primera letra, que es
 * lo correcto para un título: "Guardias de Seguridad" → "guardias de Seguridad".
 * Dentro de una frase el nombre va completo en minúscula, salvo la primera
 * palabra y las siglas.
 * El problema concreto: el H2 quedaba "Preguntas sobre guardias de Seguridad en
 * Las Condes", con la "S" de Seguridad en mayúscula en medio de la frase.
 */
const SIGLAS = new Set(['cctv', 'cftv', 'ppi', 'nvr', 'os-10', 'gei', 'rie']);

export function nombreEnOracion(svcSlug: string, nombre: string): string {
  const palabras = nombre.split(' ');
  return palabras
    .map((p, i) => {
      const baja = p.toLowerCase();
      if (SIGLAS.has(baja)) return p.toUpperCase();
      if (i === 0) return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      return baja;
    })
    .join(' ');
}

/** ¿Este bullet de comuna habla de lo que este servicio hace? */
function speaksOfService(bullet: string, svcSlug: string): boolean {
  const claves = CLAVES_DE_SERVICIO[svcSlug] ?? [];
  const b = norm(bullet);
  return claves.some((k) => b.includes(norm(k)));
}

/** ¿Este problema de comuna es del orden que este servicio resuelve? */
function isProblemOfService(problema: string, svcSlug: string): boolean {
  const claves = CLAVES_DE_SERVICIO[svcSlug] ?? [];
  const p = norm(problema);
  return claves.some((k) => p.includes(norm(k)));
}

export type CoverageSection = {
  intro: string;
  puntos: string[];
  /** `true` cuando los bullets vienen del servicio y no de la comuna. */
  esFallback: boolean;
};

/**
 * "Qué operamos en {comuna}".
 *
 * Intenta los 6 bullets de la comuna y se queda con los que hablan del
 * servicio. Si esa combinación no tiene material compartido —que es real: no
 * todas las communes se parecen a todos los servicios—, usa los problemas de
 * la comuna, que contestan por qué el servicio existe en ese lugar.
 */
export function coverageDe(loc: Loc, svcSlug: string): CoverageSection {
  const directa = loc.features.filter((f) => speaksOfService(f, svcSlug));
  if (directa.length >= 2) {
    return {
      intro:
        `En ${loc.name} este servicio se concentra en ${directa.length === 1 ? 'un punto' : `${directa.length} puntos`} ` +
        `que no son los mismos que en otras comunas de la zona:`,
      puntos: directa.slice(0, 6),
      esFallback: false,
    };
  }

  // Combo sin material propio: la respuesta honesta es qué pasa en este lugar.
  const problemas = loc.problems.filter((p) => isProblemOfService(p, svcSlug));
  return {
    intro:
      `El servicio se opera igual que en el resto de la zona. Lo que cambia en ${loc.name} ` +
      `son las condiciones del sitio, y estas son las que encontramos:`,
    puntos: (problemas.length ? problemas : loc.problems).slice(0, 4),
    esFallback: true,
  };
}

/**
 * FAQ de la página: primero la de la comuna, después la del servicio.
 *
 * Se conserva el orden de las 3 FAQs de `LOCATIONS[slug]` y se completa con
 * las del servicio hasta 6. Las de comuna van primero porque son las que
 * distinguen esta URL de sus 15 hermanas.
 */
export function faqsDe(loc: Loc, svcSlug: string) {
  const svc = SERVICES[svcSlug];
  const deLoc = loc.faqs;
  const deSvc = (svc?.faqs ?? []).map((f) => ({
    q: f.q,
    a: f.a.replace(/\bLas Condes\b|\bla comuna\b/g, loc.name),
  }));
  return dedupeFaqs([...deLoc, ...deSvc]).slice(0, 6);
}

/**
 * Quita preguntas repetidas, comparando sin tildes, mayúsculas y signos.
 *
 * La comparación es deliberadamente laxa porque las fuentes escriben la misma
 * pregunta de dos formas: "las Condes" y "esta comuna", o con y sin signo de
 * apertura. Con comparación exacta quedaban dos entradas con el mismo texto y
 * el JSON-LD emitía la misma Question dos veces.
 */
export function dedupeFaqs<T extends { question?: string; q?: string }>(faqs: T[]): T[] {
  const vistos = new Set<string>();
  const out: T[] = [];
  for (const f of faqs) {
    const texto = (f.question ?? f.q ?? '').toLowerCase();
    const clave = norm(texto).replace(/[¿?.,]/g, '').trim();
    if (!clave || vistos.has(clave)) continue;
    vistos.add(clave);
    out.push(f);
  }
  return out;
}

/**
 * Párrafo de método, específico de la comuna.
 *
 * Responde "¿por qué el precio de esta comuna no es el de otra?", que es la
 * pregunta real de alguien que está en `/servicios/guardias/las-condes` y ve
 * el mismo catálogo que en Vitacura. El texto viene de `loc.problems`: nombra
 * las condiciones concretas que se evalúan.
 */
export function metodoDe(loc: Loc, svcSlug: string): string {
  const primerProblema = loc.problems[0];
  const primero = primerProblema ? norm(primerProblema).replace(/\.$/, '') : '';
  return (
    `La dotación en ${loc.name} no se calcula con una tabla. Se visita el sitio y se revisa ` +
    `${primero ? `lo que efectivamente ocurre ahí —por ejemplo, ${primero}—` : 'lo que efectivamente ocurre ahí'}, ` +
    `junto con los accesos, la infraestructura existente y los horarios en que el lugar queda ` +
    `despopulado. Con esa información se define el servicio y el precio.`
  );
}

/**
 * Problemas que resolvemos en {comuna}.
 *
 * `svc.problems` es el mismo listado en las 16 comunas del servicio: describe
 * el problema del RUBRO, no el del lugar. Los problemas de la comuna sí están
 * escritos para ese sitio ("Robos en estacionamientos subterráneos de torres
 * corporativas durante horarios no laborales"), y son los que un cliente de esa
 * comuna reconoce como suyos.
 *
 * Se mezclan: primero los de la comuna (que son los específicos), después los
 * del servicio (que son ciertos pero genéricos), hasta 6. Así el bloque sigue
 * teniendo contenido y la mitad del es único por URL.
 */export function problemasDe(loc: Loc, svcSlug: string): string[] {
  const deLoc = loc.problems;
  const deSvc = SERVICES[svcSlug]?.problems ?? [];
  // Si la comuna ya tiene 4 o más, alcanza con esos: agregar genéricos después
  // solo agrega repetición.
  return [...deLoc, ...deSvc].slice(0, deLoc.length >= 4 ? 4 : 6);
}

/**
 * Frase de contexto para el cierre, específica de la comuna.
 *
 * No es relleno: es la respuesta a "¿y en mi comuna funciona?". Si la comuna
 * tiene un rasgo que la distingue (un tipo de cliente, una infraestructura,
 * una condición), se nombra. Si no, se dice con honestidad qué significa la
 * cobertura en ese lugar.
 */
export function cierreDe(loc: Loc, svcSlug: string): string {
  const rasgo = loc.features[0] ?? loc.problems[0];
  if (rasgo) {
    const r = norm(rasgo).replace(/\.$/, '');
    return (
      `Trabajamos en ${loc.name} porque es un lugar donde ${r}. Eso define desde el primer día ` +
      `qué se cubre y con qué dotación.`
    );
  }
  return `Operamos en ${loc.name} con equipo propio de la zona, sin rotación desde otras comunas.`;
}
