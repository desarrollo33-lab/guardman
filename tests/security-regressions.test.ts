import { describe, it, expect } from 'vitest';
import { validateLead, readNullableText } from '../src/lib/validation';

// Regresión de los dos críticos del panel admin.
//
// C1: `POST /api/leads/capture` es público y sin auth. La validación dejaba
//     pasar `<img src=x onerror=...>` como nombre, y el buscador global del
//     admin lo inyectaba con innerHTML (AdminTopbar.astro). Cualquiera podía
//     ejecutar script en el origen del admin con la cookie de sesión puesta.
//     El sink ahora se construye con textContent, y además el nombre —que
//     nunca lleva markup— se rechaza en la frontera.
//
// F0.4: `String(body.admin_notes)` convertía un `null` explícito en la CADENA
//     "null", que pasaba los guards `!== undefined` y terminaba en D1. Con eso
//     el admin veía la palabra `null` en el textarea y, si el GET de detalle
//     había fallado, perdía las notas reales. No había forma de limpiar nada.

const valid = {
  name: 'María González',
  email: 'maria@example.cl',
  phone: '+56 9 3000 0010',
  service: 'Guardias',
};

describe('validateLead — markup en el nombre', () => {
  it('rechaza un payload XSS en el nombre', () => {
    const r = validateLead({ ...valid, name: '<img src=x onerror=fetch("/api/leads")>' });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
  });

  it('rechaza aunque el payload traiga ángulos sueltos', () => {
    const r = validateLead({ ...valid, name: 'Juan <b>' });
    expect(r.ok).toBe(false);
  });

  it('acepta un nombre normal con acentos y apóstrofos', () => {
    const r = validateLead({ ...valid, name: "María O'Ryan-González" });
    expect(r.ok).toBe(true);
  });

  it('NO toca el mensaje libre: ahí los < son legítimos', () => {
    const r = validateLead({ ...valid, message: 'Comparamos con <option> y <script> de la competencia' });
    expect(r.ok).toBe(true);
    expect(r.sanitized?.message).toContain('<option>');
  });
});

describe('readNullableText — distinguir ausente de limpiar', () => {
  it('clave ausente -> undefined (no tocar la columna)', () => {
    expect(readNullableText({}, 'admin_notes', 4000)).toBeUndefined();
  });

  it('null explícito -> null (limpiar)', () => {
    expect(readNullableText({ admin_notes: null }, 'admin_notes', 4000)).toBeNull();
  });

  it('string vacío -> null (limpiar)', () => {
    expect(readNullableText({ admin_notes: '' }, 'admin_notes', 4000)).toBeNull();
  });

  it('texto -> recortado al máximo', () => {
    expect(readNullableText({ admin_notes: '  hola  ' }, 'admin_notes', 4000)).toBe('hola');
    expect(readNullableText({ admin_notes: 'x'.repeat(50) }, 'admin_notes', 10)).toHaveLength(10);
  });

  it('el bug original: String(null) producía la cadena "null"', () => {
    // Esta es exactamente la aserción que fallaba antes.
    expect(String(null)).toBe('null');
    expect(readNullableText({ admin_notes: null }, 'admin_notes', 4000)).not.toBe('null');
  });
});
