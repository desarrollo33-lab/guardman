import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import SolutionForm from './SolutionForm';

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

type FormMode = 'create' | 'edit' | null;

export default function SolutionsList() {
  const solutions = useQuery(api.solutions.getAllSolutions);
  const services = useQuery(api.services.getAllServices);
  const updateSolution = useMutation(api.solutions.updateSolution);
  const deleteSolution = useMutation(api.solutions.deleteSolution);
  const reorderSolutions = useMutation(api.solutions.reorderSolutions);

  const [filterActive, setFilterActive] = useState<string>('');
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter solutions
  const filteredSolutions = useMemo(() => {
    if (!solutions) return [];
    return solutions.filter((solution: Solution) => {
      if (filterActive === 'active') return solution.is_active !== false;
      if (filterActive === 'inactive') return solution.is_active === false;
      return true;
    });
  }, [solutions, filterActive]);

  // Sort by order
  const sortedSolutions = useMemo(() => {
    return [...filteredSolutions].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [filteredSolutions]);

  // Active/Inactive counts
  const activeCount =
    solutions?.filter((s: Solution) => s.is_active !== false).length ?? 0;
  const inactiveCount =
    solutions?.filter((s: Solution) => s.is_active === false).length ?? 0;

  // Handlers
  const handleCreate = () => {
    setFormMode('create');
    setEditingSolution(null);
  };

  const handleEdit = (solution: Solution) => {
    setFormMode('edit');
    setEditingSolution(solution);
  };

  const handleDelete = async (solution: Solution) => {
    if (!confirm(`¿Eliminar la solución "${solution.title}"?`)) return;
    await deleteSolution({ id: solution._id });
  };

  const handleToggleActive = async (solution: Solution) => {
    await updateSolution({
      id: solution._id,
      is_active: solution.is_active === false ? true : false,
    });
  };

  const handleMoveUp = async (solution: Solution) => {
    const index = sortedSolutions.findIndex((s) => s._id === solution._id);
    if (index <= 0) return;

    const current = sortedSolutions[index];
    const previous = sortedSolutions[index - 1];

    await reorderSolutions({
      orders: [
        { id: current._id, order: previous.order ?? 0 },
        { id: previous._id, order: current.order ?? 0 },
      ],
    });
  };

  const handleMoveDown = async (solution: Solution) => {
    const index = sortedSolutions.findIndex((s) => s._id === solution._id);
    if (index >= sortedSolutions.length - 1) return;

    const current = sortedSolutions[index];
    const next = sortedSolutions[index + 1];

    await reorderSolutions({
      orders: [
        { id: current._id, order: next.order ?? 0 },
        { id: next._id, order: current.order ?? 0 },
      ],
    });
  };

  const handleFormSuccess = () => {
    setFormMode(null);
    setEditingSolution(null);
    setIsSubmitting(false);
  };

  const handleFormCancel = () => {
    setFormMode(null);
    setEditingSolution(null);
  };

  // Loading state
  if (solutions === undefined || services === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando soluciones...</p>
      </div>
    );
  }

  // Form modal
  if (formMode) {
    return (
      <SolutionForm
        mode={formMode}
        solution={editingSolution}
        services={services}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Soluciones</h1>
          <p className="text-gray-600 mt-1">
            Gestión de soluciones por industria
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Solución
          </button>
          <div className="text-sm text-gray-500">
            Total:{' '}
            <span className="font-semibold text-gray-700">
              {solutions.length}
            </span>{' '}
            soluciones
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <select
              id="status-filter"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="active">Activos ({activeCount})</option>
              <option value="inactive">Inactivos ({inactiveCount})</option>
            </select>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setFilterActive('')}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Filtered Count */}
      <div className="text-sm text-gray-500">
        Mostrando{' '}
        <span className="font-semibold text-gray-700">
          {sortedSolutions.length}
        </span>{' '}
        de{' '}
        <span className="font-semibold text-gray-700">{solutions.length}</span>{' '}
        soluciones
      </div>

      {/* Empty State */}
      {sortedSolutions.length === 0 ? (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay soluciones
          </h3>
          <p className="mt-2 text-gray-500">
            Comienza creando una nueva solución.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Solución
          </button>
        </div>
      ) : (
        /* Solutions Table */
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16"
                  >
                    Orden
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Título
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Slug
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell"
                  >
                    Servicios Relacionados
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Estado
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
                {sortedSolutions.map((solution: Solution) => (
                  <tr
                    key={solution._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveUp(solution)}
                          disabled={sortedSolutions.indexOf(solution) === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
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
                          onClick={() => handleMoveDown(solution)}
                          disabled={
                            sortedSolutions.indexOf(solution) ===
                            sortedSolutions.length - 1
                          }
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
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
                        {solution.icon && (
                          <span className="text-gray-400 text-lg">
                            {getIcon(solution.icon)}
                          </span>
                        )}
                        <div>
                          <span className="font-medium text-gray-900">
                            {solution.title}
                          </span>
                          <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {solution.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {solution.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(solution.relatedServices || [])
                          .slice(0, 3)
                          .map((slug) => (
                            <span
                              key={slug}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {slug}
                            </span>
                          ))}
                        {(solution.relatedServices?.length ?? 0) > 3 && (
                          <span className="text-xs text-gray-500">
                            +{(solution.relatedServices?.length ?? 0) - 3} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(solution)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          solution.is_active !== false
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {solution.is_active !== false ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(solution)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(solution)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar"
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
        </div>
      )}
    </>
  );
}

// Icon helper
function getIcon(iconName: string): string {
  const icons: Record<string, string> = {
    home: '🏠',
    mountain: '⛰️',
    'shopping-bag': '🛍️',
    'hard-hat': '👷',
    bed: '🛏️',
    building: '🏢',
    shield: '🛡️',
    car: '🚗',
    bell: '🔔',
    cube: '📦',
    airplane: '✈️',
    key: '🔑',
  };
  return icons[iconName] || '📄';
}
