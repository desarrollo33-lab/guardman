import { useEffect, useState } from 'react';
import type { Doc } from '@convex/_generated/dataModel';

type Cta = Doc<'ctas'>;

interface Button {
  text: string;
  href: string;
  variant?: string;
}

interface CtaFormProps {
  cta: Cta | null;
  onSubmit: (data: Partial<Cta>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CtaForm({
  cta,
  onSubmit,
  onCancel,
  isSubmitting,
}: CtaFormProps) {
  const [formData, setFormData] = useState({
    page_slug: '',
    headline: '',
    subheadline: '',
    buttons: [] as Button[],
    badges: [] as string[],
    background_type: 'gradient' as 'image' | 'gradient',
    background_value: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cta) {
      setFormData({
        page_slug: cta.page_slug || '',
        headline: cta.headline || '',
        subheadline: cta.subheadline || '',
        buttons: cta.buttons || [],
        badges: cta.badges || [],
        background_type: cta.background_type || 'gradient',
        background_value: cta.background_value || '',
      });
    }
  }, [cta]);

  const addButton = () => {
    setFormData((prev) => ({
      ...prev,
      buttons: [...prev.buttons, { text: '', href: '', variant: 'primary' }],
    }));
  };

  const removeButton = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  const updateButton = (index: number, field: keyof Button, value: string) => {
    setFormData((prev) => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) =>
        i === index ? { ...btn, [field]: value } : btn
      ),
    }));
  };

  const addBadge = () => {
    setFormData((prev) => ({
      ...prev,
      badges: [...prev.badges, ''],
    }));
  };

  const removeBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index),
    }));
  };

  const updateBadge = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.map((badge, i) => (i === index ? value : badge)),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.page_slug.trim())
      newErrors.page_slug = 'La página es requerida';
    if (!formData.headline.trim())
      newErrors.headline = 'El headline es requerido';
    if (formData.buttons.length === 0)
      newErrors.buttons = 'Al menos un botón es requerido';
    if (formData.buttons.some((btn) => !btn.text.trim() || !btn.href.trim())) {
      newErrors.buttons = 'Todos los botones deben tener texto y enlace';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      page_slug: formData.page_slug.trim(),
      headline: formData.headline.trim(),
      subheadline: formData.subheadline.trim() || undefined,
      buttons: formData.buttons.map((btn) => ({
        text: btn.text.trim(),
        href: btn.href.trim(),
        variant: btn.variant,
      })),
      badges: formData.badges.filter((b) => b.trim()).map((b) => b.trim()),
      background_type: formData.background_type,
      background_value: formData.background_value.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {cta ? 'Editar CTA' : 'Nuevo CTA'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Página <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.page_slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    page_slug: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.page_slug ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="home"
              />
              {errors.page_slug && (
                <p className="mt-1 text-sm text-red-600">{errors.page_slug}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de fondo
              </label>
              <select
                value={formData.background_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    background_type: e.target.value as 'image' | 'gradient',
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="gradient">Gradiente</option>
                <option value="image">Imagen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, headline: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.headline ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="¿Listo para proteger tu empresa?"
            />
            {errors.headline && (
              <p className="mt-1 text-sm text-red-600">{errors.headline}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subheadline
            </label>
            <input
              type="text"
              value={formData.subheadline}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subheadline: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contáctanos hoy para una consulta gratuita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Botones <span className="text-red-500">*</span>
            </label>
            {errors.buttons && (
              <p className="mb-2 text-sm text-red-600">{errors.buttons}</p>
            )}
            <div className="space-y-3">
              {formData.buttons.map((btn, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={btn.text}
                    onChange={(e) =>
                      updateButton(index, 'text', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Texto del botón"
                  />
                  <input
                    type="text"
                    value={btn.href}
                    onChange={(e) =>
                      updateButton(index, 'href', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="/contacto"
                  />
                  <select
                    value={btn.variant || 'primary'}
                    onChange={(e) =>
                      updateButton(index, 'variant', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="outline">Outline</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeButton(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addButton}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Botón
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Badges (etiquetas)
            </label>
            <div className="space-y-2">
              {formData.badges.map((badge, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => updateBadge(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Badge text"
                  />
                  <button
                    type="button"
                    onClick={() => removeBadge(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBadge}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Badge
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor del fondo
            </label>
            <input
              type="text"
              value={formData.background_value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  background_value: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                formData.background_type === 'image'
                  ? 'https://...'
                  : 'from-blue-600 to-purple-600'
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.background_type === 'image'
                ? 'URL de la imagen de fondo'
                : 'Clases de gradiente de Tailwind (ej: from-blue-600 to-purple-600)'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {cta ? 'Guardar Cambios' : 'Crear CTA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
