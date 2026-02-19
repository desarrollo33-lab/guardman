import { useEffect, useState } from 'react';
import type { Doc } from '@convex/_generated/dataModel';

type Stat = Doc<'stats'>;

interface StatFormProps {
  stat: Stat | null;
  onSubmit: (data: Partial<Stat>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  pageSlugOptions: { value: string; label: string }[];
}

export default function StatForm({
  stat,
  onSubmit,
  onCancel,
  isSubmitting,
  pageSlugOptions,
}: StatFormProps) {
  const [formData, setFormData] = useState({
    page_slug: '',
    value: '',
    label: '',
    icon: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stat) {
      setFormData({
        page_slug: stat.page_slug || '',
        value: stat.value || '',
        label: stat.label || '',
        icon: stat.icon || '',
      });
    }
  }, [stat]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.page_slug.trim())
      newErrors.page_slug = 'La página es requerida';
    if (!formData.value.trim()) newErrors.value = 'El valor es requerido';
    if (!formData.label.trim()) newErrors.label = 'La etiqueta es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      page_slug: formData.page_slug.trim(),
      value: formData.value.trim(),
      label: formData.label.trim(),
      icon: formData.icon.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {stat ? 'Editar Estadística' : 'Nueva Estadística'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Página <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.page_slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, page_slug: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.page_slug ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar página...</option>
              {pageSlugOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.page_slug && (
              <p className="mt-1 text-sm text-red-600">{errors.page_slug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, value: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.value ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="500+"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiqueta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.label ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Clientes satisfechos"
            />
            {errors.label && (
              <p className="mt-1 text-sm text-red-600">{errors.label}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icono (emoji)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl"
              placeholder="👥"
            />
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
              {stat ? 'Guardar Cambios' : 'Crear Estadística'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
