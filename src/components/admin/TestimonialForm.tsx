import { useState, useEffect } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface Testimonial {
  _id: Id<'testimonials'>;
  author: string;
  role?: string;
  company?: string;
  quote: string;
  rating: number;
  image_url?: string;
  verified: boolean;
  order?: number;
}

interface TestimonialFormProps {
  testimonial: Testimonial | null;
  onSubmit: (data: Partial<Testimonial>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface FormData {
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image_url: string;
  verified: boolean;
  order: number;
}

const initialFormData: FormData = {
  author: '',
  role: '',
  company: '',
  quote: '',
  rating: 5,
  image_url: '',
  verified: false,
  order: 0,
};

function StarSelector({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
    </div>
  );
}

export default function TestimonialForm({
  testimonial,
  onSubmit,
  onCancel,
  isSubmitting,
}: TestimonialFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Initialize form with testimonial data if editing
  useEffect(() => {
    if (testimonial) {
      setFormData({
        author: testimonial.author || '',
        role: testimonial.role || '',
        company: testimonial.company || '',
        quote: testimonial.quote || '',
        rating: testimonial.rating || 5,
        image_url: testimonial.image_url || '',
        verified: testimonial.verified ?? false,
        order: testimonial.order ?? 0,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [testimonial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.author.trim() || !formData.quote.trim()) {
      alert('Por favor completa los campos requeridos: Autor y Cita');
      return;
    }

    // Validate rating range
    if (formData.rating < 1 || formData.rating > 5) {
      alert('El rating debe estar entre 1 y 5');
      return;
    }

    // Build data object
    const data: Partial<Testimonial> = {
      author: formData.author.trim(),
      quote: formData.quote.trim(),
      rating: formData.rating,
      verified: formData.verified,
    };

    if (formData.role) data.role = formData.role.trim();
    if (formData.company) data.company = formData.company.trim();
    if (formData.image_url) data.image_url = formData.image_url.trim();
    if (formData.order !== undefined) data.order = formData.order;

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {testimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
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
            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            {/* Role & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo / Rol
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Gerente de Operaciones"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Empresa ABC"
                />
              </div>
            </div>

            {/* Quote */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cita / Testimonio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Escribe el testimonio del cliente..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.quote.length} caracteres
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <StarSelector
                rating={formData.rating}
                onChange={(rating) =>
                  setFormData((prev) => ({ ...prev, rating }))
                }
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen (Avatar)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image_url: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
              {formData.image_url && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-sm text-gray-500">Vista previa</span>
                </div>
              )}
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                Los testimonios se ordenan de menor a mayor
              </p>
            </div>

            {/* Verified Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      verified: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Testimonio verificado
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
