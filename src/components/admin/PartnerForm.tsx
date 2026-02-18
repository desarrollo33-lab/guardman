import { useState, useEffect } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface Partner {
  _id: Id<'partners'>;
  name: string;
  logo_url: string;
  type: string;
  url?: string;
  order: number;
  quote?: string;
  industry?: string;
  icon?: string;
}

interface PartnerFormProps {
  partner: Partner | null;
  onSubmit: (data: Partial<Partner>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  typeOptions: { value: string; label: string; color: string }[];
  nextOrder: number;
}

interface FormData {
  name: string;
  logo_url: string;
  type: string;
  url: string;
  order: number;
  quote: string;
  industry: string;
  icon: string;
}

export default function PartnerForm({
  partner,
  onSubmit,
  onCancel,
  isSubmitting,
  typeOptions,
  nextOrder,
}: PartnerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    logo_url: '',
    type: 'client',
    url: '',
    order: 0,
    quote: '',
    industry: '',
    icon: '',
  });

  const [logoError, setLogoError] = useState(false);

  // Initialize form with partner data
  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || '',
        logo_url: partner.logo_url || '',
        type: partner.type || 'client',
        url: partner.url || '',
        order: partner.order ?? 0,
        quote: partner.quote || '',
        industry: partner.industry || '',
        icon: partner.icon || '',
      });
    } else {
      setFormData({
        name: '',
        logo_url: '',
        type: 'client',
        url: '',
        order: nextOrder,
        quote: '',
        industry: '',
        icon: '',
      });
    }
  }, [partner, nextOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLogoChange = (url: string) => {
    setFormData((prev) => ({ ...prev, logo_url: url }));
    setLogoError(false);
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  const isFormValid =
    formData.name.trim() && formData.logo_url.trim() && formData.type;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {partner ? 'Editar Partner' : 'Nuevo Partner'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {partner
                ? `Modificando ${partner.name}`
                : 'Agregar nuevo partner o cliente'}
            </p>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la empresa"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del Logo <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleLogoChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://ejemplo.com/logo.png"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    URL directa a la imagen del logo (PNG, JPG, SVG)
                  </p>
                </div>
                {/* Logo Preview */}
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                  {formData.logo_url && !logoError ? (
                    <img
                      src={formData.logo_url}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      onError={handleLogoError}
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {logoError && formData.logo_url && (
                <p className="mt-1 text-xs text-red-500">
                  No se pudo cargar la imagen. Verifica la URL.
                </p>
              )}
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://ejemplo.com"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industria
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, industry: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Retail, Minería, Finanzas, etc."
              />
            </div>

            {/* Icon (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ícono (opcional)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del ícono (opcional)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Identificador de ícono para uso interno
              </p>
            </div>

            {/* Quote */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cita / Testimonio
              </label>
              <textarea
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Testimonio del cliente o descripción de la certificación..."
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                Los partners se ordenan de menor a mayor
              </p>
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
            disabled={isSubmitting || !isFormValid}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                {partner ? 'Guardar Cambios' : 'Crear Partner'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
