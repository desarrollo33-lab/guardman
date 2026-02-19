import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Doc } from '@convex/_generated/dataModel';
import CompanyValueForm from './CompanyValueForm';

type CompanyValue = Doc<'company_values'>;

export default function CompanyValuesList() {
  const values = useQuery(api.company_values.getAllCompanyValues);
  const createValue = useMutation(api.company_values.createCompanyValue);
  const updateValue = useMutation(api.company_values.updateCompanyValue);
  const deleteValue = useMutation(api.company_values.deleteCompanyValue);
  const reorderValues = useMutation(api.company_values.reorderCompanyValues);

  const [showForm, setShowForm] = useState(false);
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedValues = [...(values ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const handleCreate = () => {
    setEditingValue(null);
    setShowForm(true);
  };

  const handleEdit = (value: CompanyValue) => {
    setEditingValue(value);
    setShowForm(true);
  };

  const handleDelete = async (value: CompanyValue) => {
    if (!confirm(`¿Eliminar el valor "${value.title}"?`)) return;
    try {
      await deleteValue({ id: value._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleMoveUp = async (value: CompanyValue, index: number) => {
    if (index === 0) return;
    const prevValue = sortedValues[index - 1];
    await reorderValues({
      orders: [
        { id: value._id, order: prevValue.order ?? index - 1 },
        { id: prevValue._id, order: value.order ?? index },
      ],
    });
  };

  const handleMoveDown = async (value: CompanyValue, index: number) => {
    if (index === sortedValues.length - 1) return;
    const nextValue = sortedValues[index + 1];
    await reorderValues({
      orders: [
        { id: value._id, order: nextValue.order ?? index + 1 },
        { id: nextValue._id, order: value.order ?? index },
      ],
    });
  };

  const handleFormSubmit = async (data: Partial<CompanyValue>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingValue) {
        const { _id, ...updateData } = data;
        await updateValue({ id: editingValue._id, ...updateData });
      } else {
        const maxOrder =
          values?.reduce((max, v) => Math.max(max, v.order ?? 0), 0) ?? 0;
        await createValue({
          title: data.title!,
          icon: data.icon,
          description: data.description!,
          order: data.order ?? maxOrder + 1,
        });
      }
      setShowForm(false);
      setEditingValue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (values === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando valores...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Valores de Empresa
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de los valores corporativos
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
          Nuevo Valor
        </button>
      </div>

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

      {sortedValues.length === 0 ? (
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay valores creados
          </h3>
          <p className="mt-2 text-gray-500">Crea el primer valor de empresa</p>
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
            Crear Valor
          </button>
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
                  Valor
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Descripción
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
              {sortedValues.map((value, index) => (
                <tr
                  key={value._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(value, index)}
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
                        onClick={() => handleMoveDown(value, index)}
                        disabled={index === sortedValues.length - 1}
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
                      {value.icon && (
                        <span className="text-2xl">{value.icon}</span>
                      )}
                      <p className="font-medium text-gray-900">{value.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {value.description}
                    </p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(value)}
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
                        onClick={() => handleDelete(value)}
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

      {showForm && (
        <CompanyValueForm
          value={editingValue}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingValue(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
