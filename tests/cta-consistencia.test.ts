import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Consistencia del CTA de conversión.
 *
 * El sitio tenía siete variantes para la misma acción:
 *
 *   "Cotizar" (5)  "Cotizar ahora" (1)  "Solicitar cotización" (5)
 *   "Hablar con un experto" (3)  "Contactar a un experto" (1)
 *   "Cotizar Ajax Systems" (2)  "Enviar mi solicitud" (1)
 *
 * "Cotizar" y "Cotizar ahora" y "Solicitar cotización" son el mismo botón con
 * tres redacciones, y ninguno dice qué recibe el cliente. "Hablar con un
 * experto" no dice experto en qué.
 *
 * Regla que se verifica acá: un CTA dice QUÉ hace el cliente y QUÉ recibe.
 * Las excepciones están nombradas abajo con su motivo, porque son
 * intencionales: "Denunciar ahora" no es comercial, "Solicitar evaluación"
 * pide una visita y no un precio, y "Cotizar solución integrada" ya nombra el
 * objeto.
 */

/** Texto que un CTA puede mostrar y está permitido. */
const PERMITIDOS = [
  'Cotizar para mi propiedad',
  'Enviar mi solicitud',
  'Enviar mi consulta',
  'Cotizar solución integrada',
  'Solicitar evaluación',
  'Denunciar ahora',
  'Hacer una nueva denuncia',
  'Cotizar Ajax Systems',
  'Ver las verificaciones antes de contratar',
  'Ver guía',
];

/** Motivos por los que un texto de CTA está permitido aunque no sea el canónico. */
const EXCEPCIONES: Record<string, string> = {
  'Denunciar ahora':
    'Canal de denuncias: la intención es evidente y no es comercial. Agregarle un objeto lo volvería falso.',
  'Hacer una nueva denuncia': 'Confirmación del canal de denuncias: no es un CTA comercial.',
  'Cotizar solución integrada': 'Soluciones: ya nombra el objeto.',
  'Cotizar Ajax Systems': 'Ajax: nombra el producto concreto, que es lo que el cliente está mirando.',
  'Ver las verificaciones antes de contratar':
    'Índice de guías: es navegación a contenido, no conversión.',
  'Ver guía': 'Navegación a contenido, no conversión.',
  'Enviar mi consulta': 'CTA de contacto/formulario. Dice lo que hace sin declararse experto en nada.',
  'Enviar mi solicitud': 'CTA del formulario de cotización.',
  'Enviar mensaje': 'Formulario de contacto: el objeto es literalmente un mensaje.',
  'Enviar denuncia de forma anónima':
    'Canal de denuncias: el requisito de anonimato es parte de la garantía legal, no decoración.',
  'Solicitar evaluación': 'Guías: pide visita a terreno, no precio. Distinto de cotizar.',
};

const CTA_RE = /<a\b[^>]*class\s*=\s*["'][^"']*\b(btn|cta|footer-see-all)\b[^"']*["'][^>]*>([\s\S]{0,400}?)<\/a>/g;

/** Limpia el interior del `<a>`: quita etiquetas, Icon, saltos. */
const textoDe = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const offenders: string[] = [];
const vistos = new Set<string>();

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(astro|ts|tsx)$/.test(name) ? [full] : [];
  });
}

for (const file of walk('src/pages').concat(walk('src/components'))) {
  const rel = file.replace(/\\/g, '/');
  // El panel admin no es público: sus CTAs ("Guardar", "Exportar") son de otra
  // naturaleza y no tienen por qué seguir la regla comercial.
  if (rel.includes('/admin/') || rel.includes('islands/')) continue;

  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(CTA_RE)) {
    // Grupo 1 = la clase, grupo 2 = el contenido del enlace.
    const texto = textoDe(m[2] ?? '');
    if (!texto || texto.length < 4) continue;
    // Solo el verbo principal del botón, no párrafos de CTA.
    if (texto.split(/\s+/).length > 6) continue;
    if (!/cotiz|solicit|habl|contact|contrat|agend|denunci|consult|enviar|ver guía/i.test(texto)) continue;
    vistos.add(texto);
    if (PERMITIDOS.includes(texto)) continue;
    if (EXCEPCIONES[texto]) continue;
    offenders.push(`${rel}  "${texto}"`);
  }

  // Los botones de formulario no son `<a>`: el texto viaja en un atributo
  // (`submitText="Enviar mi solicitud →"`). Mismo criterio, otra sintaxis.
  for (const m of src.matchAll(/submitText\s*=\s*["']([^"']{3,60})["']/g)) {
    // El texto del botón de formulario puede traer una flecha decorativa
    // ("Enviar mi solicitud →"): se compara sin ella.
    const texto = (m[1] ?? '').replace(/[→»›>]+$/, '').trim();
    vistos.add(texto);
    if (!texto || texto === '...') continue; // default del componente
    if (PERMITIDOS.includes(texto)) continue;
    if (EXCEPCIONES[texto]) continue;
    offenders.push(`${rel}  (submitText) "${texto}"`);
  }
}

describe('CTA de conversión', () => {
  it('todo CTA dice qué hace el cliente y qué recibe', () => {
    expect(
      offenders.join('\n') || `vistos: ${[...vistos].join(', ')}`,
    ).not.toMatch(/^src\//m);
  });

  it('no quedan las variantes débiles sin objeto', () => {
    const debiles = ['Cotizar', 'Cotizar ahora', 'Solicitar cotización', 'Hablar con un experto', 'Contactar a un experto'];
    const encontradas = [...vistos].filter((t) => debiles.includes(t));
    expect(
      encontradas.join(', '),
      `CTAs sin objeto: ${encontradas.join(', ')}. Usar "${PERMITIDOS[0]}" o declarar la excepción en EXCEPCIONES con su motivo.`,
    ).toBe('');
  });

  it('las excepciones declaradas siguen en uso', () => {
    // Si un CTA exception dejó de existir, la excepción hay que borrarla: una
    // lista que solo crece termina cubriendo todo y no vigila nada.
    for (const texto of Object.keys(EXCEPCIONES)) {
      if (texto === 'Consultar disponibilidad' || texto === 'Ver guía') continue; // opcionales
      expect(
        vistos.has(texto),
        `"${texto}" está en EXCEPCIONES pero ya no aparece en el sitio. Borrala.`,
      ).toBe(true);
    }
  });
});
