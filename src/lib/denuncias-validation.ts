// ════════════════════════════════════════════════════════════════
// GuardMan — Validación del formulario de Canal de Denuncias.
// Pensado para ejecutarse client-side ANTES del POST y como helper
// de sanitización en el endpoint del Worker.
// ════════════════════════════════════════════════════════════════

import { DENUNCIA_CATEGORIES, DENUNCIA_RELACIONES } from './constants';

export interface DenunciaPayload {
  categoria: string;
  categoria_otro?: string;
  relacion?: string;
  fecha_incidente?: string;
  lugar?: string;
  personas_involucradas?: string;
  descripcion: string;
  tiene_evidencia?: 'si' | 'no' | 'desconocido' | '';
  nombre?: string;
  email?: string;
  telefono?: string;
}

export interface DenunciaValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  sanitized?: DenunciaPayload;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?56\s?9\s?[\d\s]{8,}$|^9[\d\s]{8,}$|^[\d\s+\-()]{8,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const VALID_CATEGORIAS: readonly string[] = DENUNCIA_CATEGORIES.map((c) => c.slug);
const VALID_RELACIONES: readonly string[] = DENUNCIA_RELACIONES.map((r) => r.slug);

const stripControl = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, '').trim();
const trimTo = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

/**
 * Valida y sanitiza el payload del formulario de denuncia.
 * Importante: por diseño, el denunciante PUEDE ser anónimo.
 * nombre/email/telefono son opcionales. Si vienen vacíos o no vienen → se eliminan.
 */
export function validateDenuncia(raw: Record<string, unknown>): DenunciaValidationResult {
  const errors: Record<string, string> = {};

  const categoria = stripControl(String(raw.categoria ?? ''));
  if (!categoria) {
    errors.categoria = 'Selecciona una categoría.';
  } else if (!VALID_CATEGORIAS.includes(categoria)) {
    errors.categoria = 'Categoría inválida.';
  }

  const categoria_otro = raw.categoria_otro ? stripControl(String(raw.categoria_otro)) : undefined;
  if (categoria === 'otro') {
    if (!categoria_otro || categoria_otro.length < 3) {
      errors.categoria_otro = 'Especifica brevemente la categoría.';
    } else if (categoria_otro.length > 200) {
      errors.categoria_otro = 'Máximo 200 caracteres.';
    }
  }

  const relacionRaw = stripControl(String(raw.relacion ?? ''));
  if (relacionRaw && !VALID_RELACIONES.includes(relacionRaw)) {
    errors.relacion = 'Relación inválida.';
  }
  const relacion = relacionRaw || undefined;

  const fecha_incidente = raw.fecha_incidente ? stripControl(String(raw.fecha_incidente)) : undefined;
  if (fecha_incidente && !DATE_RE.test(fecha_incidente)) {
    errors.fecha_incidente = 'Fecha inválida (formato YYYY-MM-DD).';
  }

  const lugar = raw.lugar ? trimTo(stripControl(String(raw.lugar)), 200) : undefined;
  const personas_involucradas = raw.personas_involucradas
    ? trimTo(stripControl(String(raw.personas_involucradas)), 500)
    : undefined;

  const descripcion = stripControl(String(raw.descripcion ?? ''));
  if (descripcion.length < 30) {
    errors.descripcion = 'Describe el hecho con al menos 30 caracteres.';
  } else if (descripcion.length > 5000) {
    errors.descripcion = 'La descripción no puede superar 5000 caracteres.';
  }

  const tiene_evidenciaRaw = raw.tiene_evidencia ? stripControl(String(raw.tiene_evidencia)) : undefined;
  const tiene_evidencia: DenunciaPayload['tiene_evidencia'] =
    tiene_evidenciaRaw === 'si' || tiene_evidenciaRaw === 'no' || tiene_evidenciaRaw === 'desconocido'
      ? tiene_evidenciaRaw
      : undefined;

  // Campos de contacto: TODOS opcionales (anonimato es la base del canal).
  const nombreRaw = raw.nombre ? stripControl(String(raw.nombre)) : '';
  const emailRaw = raw.email ? stripControl(String(raw.email)).toLowerCase() : '';
  const telefonoRaw = raw.telefono ? stripControl(String(raw.telefono)) : '';

  if (nombreRaw && (nombreRaw.length < 2 || nombreRaw.length > 120)) {
    errors.nombre = 'Nombre inválido (2 a 120 caracteres).';
  }
  if (emailRaw && !EMAIL_RE.test(emailRaw)) {
    errors.email = 'Correo electrónico inválido.';
  }
  if (telefonoRaw && !PHONE_RE.test(telefonoRaw)) {
    errors.telefono = 'Teléfono inválido. Usa formato +56 9 XXXX XXXX.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    sanitized: {
      categoria,
      categoria_otro: categoria_otro ? trimTo(categoria_otro, 200) : undefined,
      relacion,
      fecha_incidente,
      lugar,
      personas_involucradas,
      descripcion: trimTo(descripcion, 5000),
      tiene_evidencia,
      nombre: nombreRaw ? trimTo(nombreRaw, 120) : undefined,
      email: emailRaw || undefined,
      telefono: telefonoRaw ? trimTo(telefonoRaw, 30) : undefined,
    },
  };
}

/**
 * Genera un ID de seguimiento público: D-YYYYMMDD-XXXX
 * (4 chars random del set sin ambiguos). Suficiente para una URL
 * tipo /canal-de-denuncias/estado/D-20260715-A7K2. Se imprime en pantalla
 * y se guarda en localStorage del denunciante para que pueda consultar.
 */
export function generateTrackingId(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += charset[Math.floor(Math.random() * charset.length)];
  }
  return `D-${y}${m}${d}-${rand}`;
}
