import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import FAQForm from './FAQForm';

interface FAQ {
  _id: Id<'faqs'>;
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'general', label: 'General' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'precios', label: 'Precios' },
  { value: 'contratos', label: 'Contratos' },
  { value: 'guardias', label: 'Guardias' },
  { value: 'alarmas', label: 'Alarmas' },
  { value: 'guardpod', label: 'GuardPod' },
];

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-100 text-gray-700',
  servicios: 'bg-blue-100 text-blue-700',
  precios: 'bg-green-100 text-green-700',
  contratos: 'bg-yellow-100 text-yellow-700',
  guardias: 'bg-purple-100 text-purple-700',
  alarmas: 'bg-red-100 text-red-700',
  guardpod: 'bg-indigo-100 text-indigo-700',
};

export default function FAQsList() {
  const faqs = useQuery(api.faqs.getAllFaqs);
  const createFaq = useMutation(api.faqs.createFaq);
  const updateFaq = useMutation(api.faqs.updateFaq);
  const deleteFaq = useMutation(api.faqs.deleteFaq);
  const reorderFaqs = useMutation(api.faqs.reorderFaqs);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter FAQs by category
  const filteredFaqs =
    faqs?.filter((faq: FAQ) => {
      if (!categoryFilter) return true;
      return faq.category === categoryFilter;
    }) ?? [];

  // Sort by order
  const sortedFaqs = [...filteredFaqs].sort((a, b) => a.order - b.order);

  const handleCreate = () => {
    setEditingFaq(null);
    setShowForm(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  const handleDelete = async (faq: FAQ) => {
    if (!confirm(`¿Eliminar la pregunta "${faq.question}"?`)) return;

    try {
      await deleteFaq({ id: faq._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleMoveUp = async (faq: FAQ, index: number) => {
    if (index === 0) return;
    const prevFaq = sortedFaqs[index - 1];
    await reorderFaqs({
      orders: [
        { id: faq._id, order: prevFaq.order },
        { id: prevFaq._id, order: faq.order },
      ],
    });
  };

  const handleMoveDown = async (faq: FAQ, index: number) => {
    if (index === sortedFaqs.length - 1) return;
    const nextFaq = sortedFaqs[index + 1];
    await reorderFaqs({
      orders: [
        { id: faq._id, order: nextFaq.order },
        { id: nextFaq._id, order: faq.order },
      ],
    });
  };

  const getNextOrder = (): number => {
    const allFaqs = faqs ?? [];
    if (allFaqs.length === 0) return 1;
    return Math.max(...allFaqs.map((f: FAQ) => f.order)) + 1;
  };

  const handleFormSubmit = async (data: Partial<FAQ>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingFaq) {
        const { id: _, ...updateData } = data;
        await updateFaq({ id: editingFaq._id, ...updateData });
      } else {
        // Calculate next order
        const maxOrder =
          faqs?.reduce((max: number, f: FAQ) => Math.max(max, f.order), 0) ?? 0;
        await createFaq({
          question: data.question!,
          answer: data.answer!,
          category: data.category!,
          order: data.order ?? maxOrder + 1,
        });
      }
      setShowForm(false);
      setEditingFaq(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (faqs === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando FAQs...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de preguntas frecuentes del sitio
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
          Nueva FAQ
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

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-500">
            {sortedFaqs.length}{' '}
            {sortedFaqs.length === 1 ? 'pregunta' : 'preguntas'}
          </span>
        </div>
      </div>

      {/* FAQs List */}
      {sortedFaqs.length === 0 ? (
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {categoryFilter
              ? 'No hay FAQs en esta categoría'
              : 'No hay FAQs creadas'}
          </h3>
          <p className="mt-2 text-gray-500">
            {categoryFilter
              ? 'Selecciona otra categoría o crea una nueva FAQ'
              : 'Crea la primera pregunta frecuente'}
          </p>
          {!categoryFilter && (
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
              Crear FAQ
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
                  Pregunta
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32"
                >
                  Categoría
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFaqs.map((faq: FAQ, index: number) => (
                <tr
                  key={faq._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(faq, index)}
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
                        onClick={() => handleMoveDown(faq, index)}
                        disabled={index === sortedFaqs.length - 1}
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
                    <div className="max-w-xl">
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {faq.question}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        CATEGORY_COLORS[faq.category] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {CATEGORY_OPTIONS.find((c) => c.value === faq.category)
                        ?.label || faq.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(faq)}
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
                        onClick={() => handleDelete(faq)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FAQ Form Modal */}
      {showForm && (
        <FAQForm
          faq={editingFaq}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingFaq(null);
          }}
          isSubmitting={isSubmitting}
          categoryOptions={CATEGORY_OPTIONS.filter((c) => c.value !== '')}
        />
      )}
    </>
  );
}
