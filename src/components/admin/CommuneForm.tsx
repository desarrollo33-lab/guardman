import { useState, useEffect } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface Commune {
  _id: Id<'communes'>;
  name: string;
  slug: string;
  zone?: string;
  isOtherCity?: boolean;
  meta_title?: string;
  meta_description?: string;
  hero_title?: string;
  hero_subtitle?: string;
  intro_content?: string;
}

interface CommuneFormProps {
  commune: Commune;
  onSubmit: (data: Partial<Commune>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface FormData {
  meta_title: string;
  meta_description: string;
  hero_title: string;
  hero_subtitle: string;
  intro_content: string;
}

const ZONE_LABELS: Record<string, string> = {
  norte: 'Zona Norte',
  sur: 'Zona Sur',
  oriente: 'Zona Oriente',
  occidente: 'Zona Occidente',
  centro: 'Zona Centro',
};

export default function CommuneForm({
  commune,
  onSubmit,
  onCancel,
  isSubmitting,
}: CommuneFormProps) {
  const [formData, setFormData] = useState<FormData>({
    meta_title: '',
    meta_description: '',
    hero_title: '',
    hero_subtitle: '',
    intro_content: '',
  });

  // Initialize form with commune data
  useEffect(() => {
    setFormData({
      meta_title: commune.meta_title || '',
      meta_description: commune.meta_description || '',
      hero_title: commune.hero_title || '',
      hero_subtitle: commune.hero_subtitle || '',
      intro_content: commune.intro_content || '',
    });
  }, [commune]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate SEO completion
  const getSEOCompletion = () => {
    const fields = [
      formData.meta_title,
      formData.meta_description,
      formData.hero_title,
      formData.hero_subtitle,
      formData.intro_content,
    ];
    const filled = fields.filter((f) => f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = getSEOCompletion();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar SEO - {commune.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <code className="text-sm bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                /{commune.slug}
              </code>
              {commune.zone && (
                <span className="text-sm text-gray-500">
                  {ZONE_LABELS[commune.zone] || commune.zone}
                </span>
              )}
            </div>
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
            {/* SEO Completion Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Completitud SEO
                </span>
                <span
                  className={`text-sm font-bold ${
                    completion === 100
                      ? 'text-green-600'
                      : completion >= 60
                        ? 'text-yellow-600'
                        : 'text-red-500'
                  }`}
                >
                  {completion}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    completion === 100
                      ? 'bg-green-500'
                      : completion >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-400'
                  }`}
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            {/* Meta Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Meta Tags
              </h3>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Título
                    <span className="text-gray-400 font-normal ml-2">
                      (para Google)
                    </span>
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
                    placeholder={`Servicios de Seguridad en ${commune.name} | Guardman`}
                    maxLength={60}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      Incluir nombre de comuna + servicio principal
                    </p>
                    <p
                      className={`text-xs ${
                        formData.meta_title.length > 60
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {formData.meta_title.length}/60
                    </p>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Descripción
                    <span className="text-gray-400 font-normal ml-2">
                      (para Google)
                    </span>
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
                    placeholder={`Guardman ofrece servicios de seguridad privada en ${commune.name}: guardias, monitoreo y más. Más de 15 años protegiendo empresas y familias.`}
                    maxLength={160}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      Descripción atractiva con palabras clave
                    </p>
                    <p
                      className={`text-xs ${
                        formData.meta_description.length > 160
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {formData.meta_description.length}/160
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sección Hero
              </h3>

              <div className="space-y-4">
                {/* Hero Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título Hero
                    <span className="text-gray-400 font-normal ml-2">
                      (título principal de la página)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.hero_title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hero_title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Seguridad Privada en ${commune.name}`}
                  />
                </div>

                {/* Hero Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtítulo Hero
                  </label>
                  <input
                    type="text"
                    value={formData.hero_subtitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hero_subtitle: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Protección profesional para empresas y residencias en ${commune.name} y alrededores`}
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contenido de Introducción
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto Introductorio
                  <span className="text-gray-400 font-normal ml-2">
                    (para SEO y usuario)
                  </span>
                </label>
                <textarea
                  value={formData.intro_content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      intro_content: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={5}
                  placeholder={`En Guardman ofrecemos servicios de seguridad privada en ${commune.name}, con más de 15 años de experiencia protegiendo empresas, industrias y residencias en la zona. Nuestro equipo de guardias certificados y sistemas de monitoreo 24/7 garantizan la protección que necesitas.`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Incluir información sobre cobertura en {commune.name},
                  servicios disponibles, y beneficios locales. 150-300 palabras
                  recomendadas.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formData.intro_content.split(/\s+/).filter(Boolean).length}{' '}
                  palabras
                </p>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Tips para SEO local:</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-700">
                    <li>Incluye "{commune.name}" naturalmente en el texto</li>
                    <li>Menciona zonas/calles cercanas si aplica</li>
                    <li>Habla de beneficios específicos para la zona</li>
                  </ul>
                </div>
              </div>
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
                Guardar SEO
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
