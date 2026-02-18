import { useState, useEffect, useCallback } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface Service {
  _id: Id<'services'>;
  slug: string;
  title: string;
  description: string;
  tagline?: string;
  icon?: string;
  features?: string[];
  benefits?: string[];
  cta?: string;
  solutions?: string[];
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  order?: number;
}

interface ServiceFormProps {
  service: Service | null;
  onSubmit: (data: Partial<Service>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  iconOptions: { value: string; label: string }[];
  solutionOptions: { value: string; label: string }[];
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  tagline: string;
  icon: string;
  features: string[];
  benefits: string[];
  cta: string;
  solutions: string[];
  image: string;
  meta_title: string;
  meta_description: string;
  is_active: boolean;
}

const initialFormData: FormData = {
  title: '',
  slug: '',
  description: '',
  tagline: '',
  icon: 'shield-check',
  features: [],
  benefits: [],
  cta: '',
  solutions: [],
  image: '',
  meta_title: '',
  meta_description: '',
  is_active: true,
};

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
}

export default function ServiceForm({
  service,
  onSubmit,
  onCancel,
  isSubmitting,
  iconOptions,
  solutionOptions,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!service);

  // Initialize form with service data if editing
  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        slug: service.slug || '',
        description: service.description || '',
        tagline: service.tagline || '',
        icon: service.icon || 'shield-check',
        features: service.features || [],
        benefits: service.benefits || [],
        cta: service.cta || '',
        solutions: service.solutions || [],
        image: service.image || '',
        meta_title: service.meta_title || '',
        meta_description: service.meta_description || '',
        is_active: service.is_active !== false,
      });
      setAutoGenerateSlug(false);
    } else {
      setFormData(initialFormData);
      setAutoGenerateSlug(true);
    }
  }, [service]);

  // Auto-generate slug when title changes
  const handleTitleChange = useCallback(
    (title: string) => {
      setFormData((prev) => {
        const updates = { ...prev, title };
        if (autoGenerateSlug) {
          updates.slug = generateSlug(title);
        }
        return updates;
      });
    },
    [autoGenerateSlug]
  );

  const handleSlugChange = useCallback((slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
    setAutoGenerateSlug(false);
  }, []);

  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  }, [newFeature]);

  const removeFeature = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }, []);

  const addBenefit = useCallback(() => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  }, [newBenefit]);

  const removeBenefit = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  }, []);

  const toggleSolution = useCallback((value: string) => {
    setFormData((prev) => {
      const solutions = prev.solutions.includes(value)
        ? prev.solutions.filter((s) => s !== value)
        : [...prev.solutions, value];
      return { ...prev, solutions };
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.description.trim()
    ) {
      alert(
        'Por favor completa los campos requeridos: Título, Slug y Descripción'
      );
      return;
    }

    // Build data object, only including non-empty optional fields
    const data: Partial<Service> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      is_active: formData.is_active,
    };

    if (formData.tagline) data.tagline = formData.tagline;
    if (formData.icon) data.icon = formData.icon;
    if (formData.features.length > 0) data.features = formData.features;
    if (formData.benefits.length > 0) data.benefits = formData.benefits;
    if (formData.cta) data.cta = formData.cta;
    if (formData.solutions.length > 0) data.solutions = formData.solutions;
    if (formData.image) data.image = formData.image;
    if (formData.meta_title) data.meta_title = formData.meta_title;
    if (formData.meta_description)
      data.meta_description = formData.meta_description;

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Guardias de Seguridad"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="guardias-seguridad"
                    required
                  />
                  {service === null && (
                    <button
                      type="button"
                      onClick={() => setAutoGenerateSlug(!autoGenerateSlug)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        autoGenerateSlug
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={
                        autoGenerateSlug
                          ? 'Auto-generar activado'
                          : 'Auto-generar desactivado'
                      }
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eslogan / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tagline: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Protección profesional 24/7"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Descripción detallada del servicio..."
                required
              />
            </div>

            {/* Icon & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CTA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto CTA (Botón)
                </label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cta: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Cotizar Guardias"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addFeature())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nueva característica..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-blue-600 hover:text-blue-800"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beneficios
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addBenefit())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nuevo beneficio..."
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                {formData.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {formData.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="text-green-600 hover:text-green-800"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soluciones Relacionadas
              </label>
              <div className="flex flex-wrap gap-2">
                {solutionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleSolution(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.solutions.includes(opt.value)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* SEO Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Título
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Título para SEO (60 caracteres máximo)"
                    maxLength={60}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.meta_title.length}/60 caracteres
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Descripción
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Descripción para SEO (160 caracteres máximo)"
                    maxLength={160}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.meta_description.length}/160 caracteres
                  </p>
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Servicio activo
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
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
                Guardando...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
