// ════════════════════════════════════════════════════════════════
// GuardMan — Validación reutilizable de forms de contacto y
// cotización. Pensado para ejecutarse client-side ANTES del POST
// y como helper de sanitización que también se puede invocar desde
// el Worker API (mismas reglas).
// ════════════════════════════════════════════════════════════════

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  location?: string;
  message?: string;
  company?: string;
  property_type?: string;
  guards_count?: string;
  source?: 'contacto' | 'cotizacion';
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  sanitized?: LeadPayload;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Chilean mobile: +56 9 XXXXXXXX (8-9 dígitos después del 9)
const PHONE_RE = /^\+?56\s?9\s?[\d\s]{8,}$|^9[\d\s]{8,}$|^[\d\s+\-()]{8,}$/;

const stripControl = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, '').trim();

const trimTo = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

export function validateLead(raw: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  const name = stripControl(String(raw.name ?? ''));
  if (name.length < 2) errors.name = 'Ingresa tu nombre completo.';
  if (name.length > 120) errors.name = 'El nombre es demasiado largo.';

  const email = stripControl(String(raw.email ?? '')).toLowerCase();
  if (!EMAIL_RE.test(email)) errors.email = 'Correo electrónico inválido.';

  const phone = stripControl(String(raw.phone ?? ''));
  if (!PHONE_RE.test(phone)) errors.phone = 'Teléfono inválido. Usa formato +56 9 XXXX XXXX.';

  const service = stripControl(String(raw.service ?? ''));
  if (!service) errors.service = 'Selecciona un servicio.';

  const location = raw.location ? stripControl(String(raw.location)) : undefined;
  const message = raw.message ? trimTo(stripControl(String(raw.message)), 2000) : undefined;
  const company = raw.company ? trimTo(stripControl(String(raw.company)), 120) : undefined;
  const property_type = raw.property_type ? stripControl(String(raw.property_type)) : undefined;
  const guards_count = raw.guards_count ? stripControl(String(raw.guards_count)) : undefined;
  const source = raw.source === 'cotizacion' ? 'cotizacion' : 'contacto';

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    sanitized: {
      name: trimTo(name, 120),
      email,
      phone: trimTo(phone, 30),
      service: trimTo(service, 80),
      location: location ? trimTo(location, 80) : undefined,
      message,
      company,
      property_type,
      guards_count,
      source,
    },
  };
}

export const PHONE_REGEX = PHONE_RE;
export const EMAIL_REGEX = EMAIL_RE;
