import { useState, useEffect, useCallback } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface Hero {
  _id: Id<'heroes'>;
  page_slug: string;
  title: string;
  subtitle?: string;
  background_type: 'youtube' | 'image';
  youtube_id?: string;
  image_url?: string;
  mobile_image_url?: string;
  ctas?: Array<{
    text: string;
    href: string;
    variant?: string;
  }>;
  badges?: Array<{
    text: string;
    icon?: string;
  }>;
  is_active?: boolean;
}

interface HeroFormProps {
  hero: Hero | null;
  onSubmit: (data: Partial<Hero>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  pageOptions: { value: string; label: string }[];
}

interface CTA {
  text: string;
  href: string;
  variant: string;
}

interface Badge {
  text: string;
  icon: string;
}

interface FormData {
  page_slug: string;
  title: string;
  subtitle: string;
  background_type: 'youtube' | 'image';
  youtube_id: string;
  image_url: string;
  mobile_image_url: string;
  ctas: CTA[];
  badges: Badge[];
  is_active: boolean;
}

const initialFormData: FormData = {
  page_slug: 'home',
  title: '',
  subtitle: '',
  background_type: 'youtube',
  youtube_id: '',
  image_url: '',
  mobile_image_url: '',
  ctas: [],
  badges: [],
  is_active: true,
};

const CTA_VARIANT_OPTIONS = [
  { value: 'primary', label: 'Primario (Azul)' },
  { value: 'secondary', label: 'Secundario (Blanco)' },
  { value: 'outline', label: 'Outline (Borde)' },
];

const BADGE_ICON_OPTIONS = [
  { value: '', label: 'Sin icono' },
  { value: 'shield-check', label: 'Escudo' },
  { value: 'check-circle', label: 'Check' },
  { value: 'star', label: 'Estrella' },
  { value: 'award', label: 'Premio' },
  { value: 'clock', label: 'Reloj' },
  { value: 'users', label: 'Usuarios' },
  { value: 'building', label: 'Edificio' },
];

export default function HeroForm({
  hero,
  onSubmit,
  onCancel,
  isSubmitting,
  pageOptions,
}: HeroFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newCTA, setNewCTA] = useState<CTA>({
    text: '',
    href: '',
    variant: 'primary',
  });
  const [newBadge, setNewBadge] = useState<Badge>({ text: '', icon: '' });

  // Initialize form with hero data if editing
  useEffect(() => {
    if (hero) {
      setFormData({
        page_slug: hero.page_slug || 'home',
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        background_type: hero.background_type || 'youtube',
        youtube_id: hero.youtube_id || '',
        image_url: hero.image_url || '',
        mobile_image_url: hero.mobile_image_url || '',
        ctas:
          hero.ctas?.map((cta) => ({
            text: cta.text,
            href: cta.href,
            variant: cta.variant || 'primary',
          })) || [],
        badges:
          hero.badges?.map((badge) => ({
            text: badge.text,
            icon: badge.icon || '',
          })) || [],
        is_active: hero.is_active !== false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [hero]);

  // Add CTA
  const addCTA = useCallback(() => {
    if (newCTA.text.trim() && newCTA.href.trim()) {
      setFormData((prev) => ({
        ...prev,
        ctas: [...prev.ctas, { ...newCTA }],
      }));
      setNewCTA({ text: '', href: '', variant: 'primary' });
    }
  }, [newCTA]);

  // Remove CTA
  const removeCTA = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      ctas: prev.ctas.filter((_, i) => i !== index),
    }));
  }, []);

  // Update CTA
  const updateCTA = useCallback(
    (index: number, field: keyof CTA, value: string) => {
      setFormData((prev) => ({
        ...prev,
        ctas: prev.ctas.map((cta, i) =>
          i === index ? { ...cta, [field]: value } : cta
        ),
      }));
    },
    []
  );

  // Add Badge
  const addBadge = useCallback(() => {
    if (newBadge.text.trim()) {
      setFormData((prev) => ({
        ...prev,
        badges: [...prev.badges, { ...newBadge }],
      }));
      setNewBadge({ text: '', icon: '' });
    }
  }, [newBadge]);

  // Remove Badge
  const removeBadge = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index),
    }));
  }, []);

  // Update Badge
  const updateBadge = useCallback(
    (index: number, field: keyof Badge, value: string) => {
      setFormData((prev) => ({
        ...prev,
        badges: prev.badges.map((badge, i) =>
          i === index ? { ...badge, [field]: value } : badge
        ),
      }));
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.page_slug.trim() || !formData.title.trim()) {
      alert('Por favor completa los campos requeridos: Página y Título');
      return;
    }

    // Validate background type fields
    if (formData.background_type === 'youtube' && !formData.youtube_id.trim()) {
      alert('El ID de YouTube es requerido para fondo tipo YouTube');
      return;
    }

    if (formData.background_type === 'image' && !formData.image_url.trim()) {
      alert('La URL de imagen es requerida para fondo tipo imagen');
      return;
    }

    // Build data object
    const data: Partial<Hero> = {
      page_slug: formData.page_slug.trim(),
      title: formData.title.trim(),
      background_type: formData.background_type,
      is_active: formData.is_active,
    };

    // Optional fields
    if (formData.subtitle) data.subtitle = formData.subtitle;
    if (formData.background_type === 'youtube' && formData.youtube_id) {
      data.youtube_id = formData.youtube_id.trim();
    }
    if (formData.background_type === 'image' && formData.image_url) {
      data.image_url = formData.image_url.trim();
    }
    if (formData.mobile_image_url) {
      data.mobile_image_url = formData.mobile_image_url.trim();
    }
    if (formData.ctas.length > 0) {
      data.ctas = formData.ctas.map((cta) => ({
        text: cta.text,
        href: cta.href,
        ...(cta.variant && { variant: cta.variant }),
      }));
    }
    if (formData.badges.length > 0) {
      data.badges = formData.badges.map((badge) => ({
        text: badge.text,
        ...(badge.icon && { icon: badge.icon }),
      }));
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {hero ? 'Editar Hero' : 'Nuevo Hero'}
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
              {/* Page Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Página <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.page_slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      page_slug: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {pageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Seguridad Profesional 24/7"
                  required
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Protección integral para tu empresa o comunidad"
              />
            </div>

            {/* Background Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Fondo
              </label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      background_type: 'youtube',
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    formData.background_type === 'youtube'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Video YouTube
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      background_type: 'image',
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-l border-gray-300 ${
                    formData.background_type === 'image'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Imagen
                </button>
              </div>
            </div>

            {/* YouTube Fields */}
            {formData.background_type === 'youtube' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Video YouTube <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.youtube_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        youtube_id: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Ej: dQw4w9WgXcQ"
                    required={formData.background_type === 'youtube'}
                  />
                  {formData.youtube_id && (
                    <a
                      href={`https://www.youtube.com/watch?v=${formData.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Ver
                    </a>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Solo el ID del video, no la URL completa. Ejemplo: de
                  https://youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong> solo
                  usar <strong>dQw4w9WgXcQ</strong>
                </p>
              </div>
            )}

            {/* Image Fields */}
            {formData.background_type === 'image' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Imagen (Desktop){' '}
                    <span className="text-red-500">*</span>
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
                    placeholder="https://example.com/hero-bg.jpg"
                    required={formData.background_type === 'image'}
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Preview desktop"
                        className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Imagen (Mobile) - Opcional
                  </label>
                  <input
                    type="url"
                    value={formData.mobile_image_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobile_image_url: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/hero-bg-mobile.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Imagen alternativa para dispositivos móviles
                  </p>
                </div>
              </div>
            )}

            {/* CTAs Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Botones CTA
              </h3>

              {/* Existing CTAs */}
              {formData.ctas.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.ctas.map((cta, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={cta.text}
                          onChange={(e) =>
                            updateCTA(index, 'text', e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Texto del botón"
                        />
                        <input
                          type="text"
                          value={cta.href}
                          onChange={(e) =>
                            updateCTA(index, 'href', e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="/contacto"
                        />
                        <select
                          value={cta.variant}
                          onChange={(e) =>
                            updateCTA(index, 'variant', e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          {CTA_VARIANT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCTA(index)}
                        className="text-red-500 hover:text-red-700"
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
                </div>
              )}

              {/* Add CTA */}
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={newCTA.text}
                  onChange={(e) =>
                    setNewCTA((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Texto del botón"
                />
                <input
                  type="text"
                  value={newCTA.href}
                  onChange={(e) =>
                    setNewCTA((prev) => ({ ...prev, href: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="/contacto"
                />
                <select
                  value={newCTA.variant}
                  onChange={(e) =>
                    setNewCTA((prev) => ({ ...prev, variant: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {CTA_VARIANT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCTA}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
                >
                  + Agregar
                </button>
              </div>
            </div>

            {/* Badges Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Badges de Confianza
              </h3>

              {/* Existing Badges */}
              {formData.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  {formData.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {badge.icon && (
                        <span className="text-xs opacity-75">{badge.icon}</span>
                      )}
                      <input
                        type="text"
                        value={badge.text}
                        onChange={(e) =>
                          updateBadge(index, 'text', e.target.value)
                        }
                        className="bg-transparent border-none focus:ring-0 p-0 text-sm w-24"
                      />
                      <select
                        value={badge.icon}
                        onChange={(e) =>
                          updateBadge(index, 'icon', e.target.value)
                        }
                        className="bg-transparent border-none focus:ring-0 p-0 text-xs"
                      >
                        {BADGE_ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeBadge(index)}
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

              {/* Add Badge */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBadge.text}
                  onChange={(e) =>
                    setNewBadge((prev) => ({ ...prev, text: e.target.value }))
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addBadge())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Ej: +15 años de experiencia"
                />
                <select
                  value={newBadge.icon}
                  onChange={(e) =>
                    setNewBadge((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {BADGE_ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addBadge}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  + Agregar
                </button>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
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
                Hero activo
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
