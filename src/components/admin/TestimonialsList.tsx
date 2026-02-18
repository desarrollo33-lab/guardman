import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import TestimonialForm from './TestimonialForm';

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsList() {
  const testimonials = useQuery(api.testimonials.getAll);
  const createTestimonial = useMutation(api.testimonials.createTestimonial);
  const updateTestimonial = useMutation(api.testimonials.updateTestimonial);
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);
  const reorderTestimonials = useMutation(api.testimonials.reorderTestimonials);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter testimonials by search
  const filteredTestimonials =
    testimonials?.filter((testimonial: Testimonial) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        testimonial.author.toLowerCase().includes(query) ||
        testimonial.company?.toLowerCase().includes(query) ||
        testimonial.quote.toLowerCase().includes(query)
      );
    }) ?? [];

  // Sort by order
  const sortedTestimonials = [...filteredTestimonials].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const handleCreate = () => {
    setEditingTestimonial(null);
    setShowForm(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`¿Eliminar el testimonio de "${testimonial.author}"?`)) return;

    try {
      await deleteTestimonial({ id: testimonial._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleToggleVerified = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial({
        id: testimonial._id,
        verified: !testimonial.verified,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const handleMoveUp = async (testimonial: Testimonial, index: number) => {
    if (index === 0) return;
    const prevTestimonial = sortedTestimonials[index - 1];
    await reorderTestimonials({
      orders: [
        { id: testimonial._id, order: prevTestimonial.order ?? index - 1 },
        { id: prevTestimonial._id, order: testimonial.order ?? index },
      ],
    });
  };

  const handleMoveDown = async (testimonial: Testimonial, index: number) => {
    if (index === sortedTestimonials.length - 1) return;
    const nextTestimonial = sortedTestimonials[index + 1];
    await reorderTestimonials({
      orders: [
        { id: testimonial._id, order: nextTestimonial.order ?? index + 1 },
        { id: nextTestimonial._id, order: testimonial.order ?? index },
      ],
    });
  };

  const handleFormSubmit = async (data: Partial<Testimonial>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingTestimonial) {
        await updateTestimonial({ id: editingTestimonial._id, ...data });
      } else {
        await createTestimonial({
          author: data.author!,
          quote: data.quote!,
          rating: data.rating!,
          ...data,
        });
      }
      setShowForm(false);
      setEditingTestimonial(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (testimonials === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando testimonios...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonios</h1>
          <p className="text-gray-600 mt-1">
            Gestión de testimonios de clientes
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Testimonio
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
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
      )}

      {/* Search */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por autor, empresa o cita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Testimonials List */}
      {sortedTestimonials.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery
              ? 'No se encontraron testimonios'
              : 'No hay testimonios creados'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery
              ? 'Intenta con otra búsqueda'
              : 'Crea el primer testimonio de cliente'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Testimonio
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"
                >
                  Ord
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Autor
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Cita
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Verificado
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTestimonials.map(
                (testimonial: Testimonial, index: number) => (
                  <tr
                    key={testimonial._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveUp(testimonial, index)}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Subir"
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
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMoveDown(testimonial, index)}
                          disabled={index === sortedTestimonials.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Bajar"
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {testimonial.image_url ? (
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            {testimonial.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {testimonial.author}
                          </p>
                          {testimonial.role && (
                            <p className="text-sm text-gray-500">
                              {testimonial.role}
                              {testimonial.company &&
                                ` - ${testimonial.company}`}
                            </p>
                          )}
                          {!testimonial.role && testimonial.company && (
                            <p className="text-sm text-gray-500">
                              {testimonial.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                        "{testimonial.quote}"
                      </p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StarRating rating={testimonial.rating} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleVerified(testimonial)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          testimonial.verified
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {testimonial.verified ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 mr-1"
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
                            Verificado
                          </>
                        ) : (
                          'Pendiente'
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTestimonial(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
