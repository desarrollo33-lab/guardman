import { describe, it, expect } from 'vitest';
import { validateLead, EMAIL_REGEX, PHONE_REGEX } from '../src/lib/validation';

describe('validation', () => {
  it('accepts a valid contact payload', () => {
    const r = validateLead({
      name: 'María González',
      email: 'maria@example.cl',
      phone: '+56 9 3000 0010',
      service: 'Guardias de Seguridad',
      message: 'Necesito un guardia nocturno',
    });
    expect(r.ok).toBe(true);
    expect(r.sanitized?.source).toBe('contacto');
    expect(r.sanitized?.email).toBe('maria@example.cl');
  });

  it('rejects invalid email', () => {
    const r = validateLead({ name: 'Foo Bar', email: 'not-an-email', phone: '+56 9 3000 0010', service: 'X' });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });

  it('rejects too-short name', () => {
    const r = validateLead({ name: 'A', email: 'a@b.cl', phone: '+56 9 3000 0010', service: 'X' });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
  });

  it('rejects invalid phone', () => {
    const r = validateLead({ name: 'Foo Bar', email: 'a@b.cl', phone: '123', service: 'X' });
    expect(r.ok).toBe(false);
    expect(r.errors.phone).toBeTruthy();
  });

  it('strips control chars and lowercases email', () => {
    const r = validateLead({ name: 'Foo Bar', email: '  FOO@BAR.cl\u0007 ', phone: '+56 9 3000 0010', service: 'X' });
    expect(r.ok).toBe(true);
    expect(r.sanitized?.email).toBe('foo@bar.cl');
  });

  it('truncates oversized message', () => {
    const long = 'x'.repeat(3000);
    const r = validateLead({ name: 'Foo Bar', email: 'a@b.cl', phone: '+56 9 3000 0010', service: 'X', message: long });
    expect(r.ok).toBe(true);
    expect(r.sanitized?.message?.length).toBe(2000);
  });

  it('tags source as cotizacion when provided', () => {
    const r = validateLead({
      name: 'Foo Bar', email: 'a@b.cl', phone: '+56 9 3000 0010', service: 'X', source: 'cotizacion',
    });
    expect(r.ok).toBe(true);
    expect(r.sanitized?.source).toBe('cotizacion');
  });

  it('exposes regex constants', () => {
    expect(EMAIL_REGEX.test('a@b.cl')).toBe(true);
    expect(EMAIL_REGEX.test('not-an-email')).toBe(false);
    expect(PHONE_REGEX.test('+56 9 3000 0010')).toBe(true);
  });
});
