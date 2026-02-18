import { useState, useEffect, useCallback } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface Author {
  _id: Id<'authors'>;
  name: string;
  slug: string;
  avatar_url?: string;
  bio?: string;
  role?: string;
}

interface ContentSection {
  type: string;
  content: string;
  alt?: string;
  caption?: string;
  items?: string[];
}

interface BlogPost {
  _id: Id<'blog_posts'>;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  author: string;
  author_id?: string;
  published_at: number;
  read_time: number;
  tags: string[];
  is_featured: boolean;
  is_published?: boolean;
  content: ContentSection[];
}

interface BlogPostFormProps {
  post: BlogPost | null;
  authors: Author[];
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author: string;
  author_id: string;
  read_time: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  content: ContentSection[];
}

const initialFormData: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  cover_image: '',
  author: '',
  author_id: '',
  read_time: 5,
  tags: [],
  is_featured: false,
  is_published: false,
  content: [],
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

// Estimate read time from content (approx 200 words per minute)
function estimateReadTime(content: ContentSection[]): number {
  const textContent = content
    .filter((section) => section.type === 'text' || section.type === 'h2')
    .map((section) => section.content)
    .join(' ');
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function BlogPostForm({
  post,
  authors,
  onSubmit,
  onCancel,
  isSubmitting,
}: BlogPostFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newTag, setNewTag] = useState('');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!post);
  const [contentJson, setContentJson] = useState(
    JSON.stringify(initialFormData.content, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Initialize form with post data if editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        author: post.author || '',
        author_id: post.author_id || '',
        read_time: post.read_time || 5,
        tags: post.tags || [],
        is_featured: post.is_featured || false,
        is_published: post.is_published || false,
        content: post.content || [],
      });
      setContentJson(JSON.stringify(post.content || [], null, 2));
      setAutoGenerateSlug(false);
    } else {
      setFormData(initialFormData);
      setContentJson(JSON.stringify([], null, 2));
      setAutoGenerateSlug(true);
    }
  }, [post]);

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

  const handleAuthorChange = useCallback(
    (authorId: string) => {
      const selectedAuthor = authors.find((a) => a._id === authorId);
      setFormData((prev) => ({
        ...prev,
        author_id: authorId,
        author: selectedAuthor?.name || prev.author,
      }));
    },
    [authors]
  );

  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const removeTag = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const handleContentJsonChange = useCallback((value: string) => {
    setContentJson(value);
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        setFormData((prev) => ({ ...prev, content: parsed }));
        setJsonError(null);
      } else {
        setJsonError('El contenido debe ser un array');
      }
    } catch {
      setJsonError('JSON inválido');
    }
  }, []);

  const autoCalculateReadTime = useCallback(() => {
    const estimated = estimateReadTime(formData.content);
    setFormData((prev) => ({ ...prev, read_time: estimated }));
  }, [formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.excerpt.trim() ||
      !formData.cover_image.trim() ||
      !formData.author.trim()
    ) {
      alert(
        'Por favor completa los campos requeridos: Título, Slug, Extracto, Imagen de portada y Autor'
      );
      return;
    }

    // Validate JSON content
    if (jsonError) {
      alert('Por favor corrige los errores en el contenido JSON');
      return;
    }

    // Build data object
    const data: Partial<BlogPost> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      cover_image: formData.cover_image.trim(),
      author: formData.author.trim(),
      read_time: formData.read_time,
      tags: formData.tags,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      content: formData.content,
    };

    if (formData.author_id) {
      data.author_id = formData.author_id;
    }

    // Include published_at only for new posts or when publishing
    if (!post) {
      data.published_at = Date.now();
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {post ? 'Editar Post' : 'Nuevo Post'}
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
                  placeholder="Ej: 10 Consejos de Seguridad para tu Empresa"
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
                    placeholder="10-consejos-seguridad-empresa"
                    required
                  />
                  {post === null && (
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

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extracto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Breve descripción del artículo (se muestra en listados)..."
                required
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen de Portada <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.cover_image}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cover_image: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/cover-image.jpg"
                required
              />
              {formData.cover_image && (
                <div className="mt-2">
                  <img
                    src={formData.cover_image}
                    alt="Preview"
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Author Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author from dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor (seleccionar)
                </label>
                <select
                  value={formData.author_id}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Seleccionar autor --</option>
                  {authors.map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                      {author.role ? ` (${author.role})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author name (manual override) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Autor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre visible del autor"
                  required
                />
              </div>
            </div>

            {/* Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Lectura (minutos)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.read_time}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        read_time: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={1}
                    max={60}
                  />
                  <button
                    type="button"
                    onClick={autoCalculateReadTime}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    title="Calcular automáticamente basado en el contenido"
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nueva tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Tags Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
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

            {/* Content JSON Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido (JSON)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Array de secciones con tipo: text, h2, image, video, quote, list
              </p>
              <textarea
                value={contentJson}
                onChange={(e) => handleContentJsonChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 ${
                  jsonError
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                rows={10}
                placeholder={`[
  { "type": "h2", "content": "Título de sección" },
  { "type": "text", "content": "Párrafo de texto..." },
  { "type": "image", "content": "https://...", "alt": "Descripción", "caption": "Pie de foto" },
  { "type": "list", "items": ["Item 1", "Item 2"] },
  { "type": "quote", "content": "Cita destacada" }
]`}
              />
              {jsonError && (
                <p className="mt-1 text-sm text-red-600">{jsonError}</p>
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Featured */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_featured: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Artículo destacado
                </span>
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_published: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Publicado
                </span>
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
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
