import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import PartnerForm from './PartnerForm';

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

const TYPE_OPTIONS = [
  { value: 'certification', label: 'Certificación', color: 'blue' },
  { value: 'client', label: 'Cliente', color: 'green' },
  { value: 'tech_partner', label: 'Partner Tecnológico', color: 'purple' },
];

const TYPE_COLORS: Record<string, string> = {
  certification: 'bg-blue-100 text-blue-700',
  client: 'bg-green-100 text-green-700',
  tech_partner: 'bg-purple-100 text-purple-700',
};

export default function PartnersList() {
  const partners = useQuery(api.partners.getAll);
  const createPartner = useMutation(api.partners.createPartner);
  const updatePartner = useMutation(api.partners.updatePartner);
  const deletePartner = useMutation(api.partners.deletePartner);
  const reorderPartners = useMutation(api.partners.reorderPartners);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter partners by search and type
  const filteredPartners =
    partners?.filter((partner: Partner) => {
      if (typeFilter !== 'all' && partner.type !== typeFilter) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        partner.name.toLowerCase().includes(query) ||
        partner.type.toLowerCase().includes(query) ||
        (partner.industry?.toLowerCase().includes(query) ?? false)
      );
    }) ?? [];

  // Sort by order
  const sortedPartners = [...filteredPartners].sort(
    (a, b) => a.order - b.order
  );

  const handleCreate = () => {
    setEditingPartner(null);
    setShowForm(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleDelete = async (partner: Partner) => {
    if (!confirm(`¿Eliminar el partner "${partner.name}"?`)) return;

    try {
      await deletePartner({ id: partner._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleMoveUp = async (partner: Partner, index: number) => {
    if (index === 0) return;
    const prevPartner = sortedPartners[index - 1];
    await reorderPartners({
      orders: [
        { id: partner._id, order: prevPartner.order },
        { id: prevPartner._id, order: partner.order },
      ],
    });
  };

  const handleMoveDown = async (partner: Partner, index: number) => {
    if (index === sortedPartners.length - 1) return;
    const nextPartner = sortedPartners[index + 1];
    await reorderPartners({
      orders: [
        { id: partner._id, order: nextPartner.order },
        { id: nextPartner._id, order: partner.order },
      ],
    });
  };

  const handleFormSubmit = async (data: Partial<Partner>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingPartner) {
        await updatePartner({ id: editingPartner._id, ...data });
      } else {
        await createPartner({
          name: data.name!,
          logo_url: data.logo_url!,
          type: data.type!,
          order: data.order ?? sortedPartners.length,
          ...data,
        });
      }
      setShowForm(false);
      setEditingPartner(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (partners === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando partners...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-1">
            Gestión de certificaciones, clientes y partners tecnológicos
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
          Nuevo Partner
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
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
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
              placeholder="Buscar por nombre, tipo o industria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">Todos los tipos</option>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      {sortedPartners.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery || typeFilter !== 'all'
              ? 'No se encontraron partners'
              : 'No hay partners creados'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || typeFilter !== 'all'
              ? 'Intenta con otra búsqueda o filtro'
              : 'Crea el primer partner'}
          </p>
          {!searchQuery && typeFilter === 'all' && (
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
              Crear Partner
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
                  Logo
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Industria
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
              {sortedPartners.map((partner: Partner, index: number) => (
                <tr
                  key={partner._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(partner, index)}
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
                        onClick={() => handleMoveDown(partner, index)}
                        disabled={index === sortedPartners.length - 1}
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
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              'none';
                          }}
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {partner.name}
                      </p>
                      {partner.url && (
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate block max-w-xs"
                        >
                          {partner.url}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        TYPE_COLORS[partner.type] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {TYPE_OPTIONS.find((t) => t.value === partner.type)
                        ?.label || partner.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {partner.industry || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(partner)}
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
                        onClick={() => handleDelete(partner)}
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

      {/* Partner Form Modal */}
      {showForm && (
        <PartnerForm
          partner={editingPartner}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPartner(null);
          }}
          isSubmitting={isSubmitting}
          typeOptions={TYPE_OPTIONS}
          nextOrder={sortedPartners.length}
        />
      )}
    </>
  );
}
