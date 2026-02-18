import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';

interface Service {
  _id: Id<'services'>;
  slug: string;
  title: string;
}

interface Solution {
  _id: Id<'solutions'>;
  _creationTime: number;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  benefits?: string[];
  cta?: string;
  industries?: string[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  solutions?: string[];
  image?: string;
  challenges?: string[];
  relatedServices?: string[];
  is_active?: boolean;
  order?: number;
}

interface SolutionFormProps {
  mode: 'create' | 'edit';
  solution: Solution | null;
  services: Service[];
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
}

const ICON_OPTIONS = [
  { value: 'home', label: 'Casa' },
  { value: 'mountain', label: 'Montaña' },
  { value: 'shopping-bag', label: 'Bolsa de compras' },
  { value: 'hard-hat', label: 'Casco de construcción' },
  { value: 'bed', label: 'Cama' },
  { value: 'building', label: 'Edificio' },
  { value: 'shield', label: 'Escudo' },
  { value: 'car', label: 'Auto' },
  { value: 'bell', label: 'Campana' },
  { value: 'cube', label: 'Cubo' },
  { value: 'airplane', label: 'Avión' },
  { value: 'key', label: 'Llave' },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function SolutionForm({
  mode,
  solution,
  services,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}: SolutionFormProps) {
  const createSolution = useMutation(api.solutions.createSolution);
  const updateSolution = useMutation(api.solutions.updateSolution);

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    icon: '',
    features: '',
    benefits: '',
    cta: '',
    industries: '',
    meta_title: '',
    meta_description: '',
    og_image: '',
    solutions: '',
    image: '',
    challenges: '',
    relatedServices: [] as string[],
    is_active: true,
    order: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSlug, setAutoSlug] = useState(true);

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && solution) {
      setFormData({
        slug: solution.slug,
        title: solution.title,
        description: solution.description,
        icon: solution.icon || '',
        features: (solution.features || []).join('\n'),
        benefits: (solution.benefits || []).join('\n'),
        cta: solution.cta || '',
        industries: (solution.industries || []).join('\n'),
        meta_title: solution.meta_title || '',
        meta_description: solution.meta_description || '',
        og_image: solution.og_image || '',
        solutions: (solution.solutions || []).join('\n'),
        image: solution.image || '',
        challenges: (solution.challenges || []).join('\n'),
        relatedServices: solution.relatedServices || [],
        is_active: solution.is_active !== false,
        order: solution.order?.toString() || '',
      });
      setAutoSlug(false);
    }
  }, [mode, solution]);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }));
    }
  }, [formData.title, autoSlug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRelatedServicesChange = (slug: string) => {
    setFormData((prev) => {
      const current = prev.relatedServices;
      const isSelected = current.includes(slug);
      return {
        ...prev,
        relatedServices: isSelected
          ? current.filter((s) => s !== slug)
          : [...current, slug],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon || undefined,
        features: formData.features
          ? formData.features
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        benefits: formData.benefits
          ? formData.benefits
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        cta: formData.cta || undefined,
        industries: formData.industries
          ? formData.industries
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        og_image: formData.og_image || undefined,
        solutions: formData.solutions
          ? formData.solutions
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        image: formData.image || undefined,
        challenges: formData.challenges
          ? formData.challenges
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        relatedServices:
          formData.relatedServices.length > 0
            ? formData.relatedServices
            : undefined,
        is_active: formData.is_active,
        order: formData.order ? parseInt(formData.order, 10) : undefined,
      };

      if (mode === 'create') {
        await createSolution(data);
      } else if (solution) {
        await updateSolution({
          id: solution._id,
          ...data,
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving solution:', error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Error al guardar la solución',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Nueva Solución' : 'Editar Solución'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Condominios Residenciales"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    handleChange(e);
                    setAutoSlug(false);
                  }}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="condominios-residenciales"
                />
                {mode === 'create' && (
                  <label className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={autoSlug}
                      onChange={(e) => setAutoSlug(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Auto
                  </label>
                )}
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción breve de la solución..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icono
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Seleccionar icono...</option>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* CTA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto CTA
              </label>
              <input
                type="text"
                name="cta"
                value={formData.cta}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cotizar Solución"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL OG Image
              </label>
              <input
                type="url"
                name="og_image"
                value={formData.og_image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Título (SEO)
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Título para SEO..."
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Descripción (SEO)
              </label>
              <input
                type="text"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Descripción para SEO..."
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0"
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Activo
                </span>
              </label>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características (una por línea)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="Guardias OS10 certificados&#10;Supervisión 24/7&#10;Equipamiento completo"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beneficios (una por línea)
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="Reduce incidentes&#10;Personal auditado&#10;Respuesta inmediata"
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desafíos (una por línea)
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="Robos frecuentes&#10;Acceso no autorizado&#10;Vandalismo"
              />
            </div>

            {/* Industries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industrias (una por línea)
              </label>
              <textarea
                name="industries"
                value={formData.industries}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="Retail&#10;Condominios&#10;Industria"
              />
            </div>

            {/* Solutions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soluciones Internas (slugs, uno por línea)
              </label>
              <textarea
                name="solutions"
                value={formData.solutions}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="guardias-seguridad&#10;alarmas-ajax"
              />
            </div>

            {/* Related Services - Multi-select */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios Relacionados
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                {services.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No hay servicios disponibles
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {services.map((service) => (
                      <label
                        key={service._id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          formData.relatedServices.includes(service.slug)
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-white hover:bg-gray-100'
                        } border`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.relatedServices.includes(
                            service.slug
                          )}
                          onChange={() =>
                            handleRelatedServicesChange(service.slug)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 truncate">
                          {service.title}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {formData.relatedServices.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {formData.relatedServices.length} servicio(s) seleccionado(s)
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Guardando...
                </span>
              ) : mode === 'create' ? (
                'Crear Solución'
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
