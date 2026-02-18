import { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

interface Filters {
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface Lead {
  _id: string;
  nombre: string;
  telefono: string;
  email?: string;
  servicio: string;
  ciudad?: string;
  status?: string;
  createdAt: number;
}

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<
  string,
  { label: string; bgClass: string; textClass: string }
> = {
  new: { label: 'Nuevo', bgClass: 'bg-blue-100', textClass: 'text-blue-800' },
  contacted: {
    label: 'Contactado',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
  },
  qualified: {
    label: 'Calificado',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
  },
  converted: {
    label: 'Convertido',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
  },
  lost: { label: 'Perdido', bgClass: 'bg-red-100', textClass: 'text-red-800' },
};

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  converted: 'Convertido',
  lost: 'Perdido',
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeCSVField(field: string | undefined | null): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export default function LeadsList() {
  const leadsResult = useQuery(api.leads.getLeads, { limit: 1000 });
  const allLeads = leadsResult?.page ?? [];

  const [filters, setFilters] = useState<Filters>({
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead: Lead) => {
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (lead.createdAt < fromDate.getTime()) return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (lead.createdAt > toDate.getTime()) return false;
      }
      return true;
    });
  }, [allLeads, filters]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length);
  const pageLeads = filteredLeads.slice(startIndex, endIndex);

  // Reset page when filters change
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ status: '', dateFrom: '', dateTo: '' });
    setCurrentPage(1);
  };

  const removeFilter = (filterType: keyof Filters) => {
    handleFilterChange({ [filterType]: '' });
  };

  // CSV Export
  const generateCSV = (data: Lead[]) => {
    const headers = [
      'Nombre',
      'Teléfono',
      'Email',
      'Servicio',
      'Ciudad',
      'Fecha',
      'Estado',
    ];
    const rows = [headers.join(',')];

    data.forEach((lead) => {
      const row = [
        escapeCSVField(lead.nombre),
        escapeCSVField(lead.telefono),
        escapeCSVField(lead.email || ''),
        escapeCSVField(lead.servicio),
        escapeCSVField(lead.ciudad || ''),
        escapeCSVField(formatDate(lead.createdAt)),
        escapeCSVField(
          statusLabels[lead.status || 'new'] || lead.status || 'new'
        ),
      ];
      rows.push(row.join(','));
    });

    return rows.join('\n');
  };

  const downloadCSV = () => {
    const dataToExport = filteredLeads.length > 0 ? filteredLeads : allLeads;
    const csv = generateCSV(dataToExport);
    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().split('T')[0];
    const filename = `leads-guardman-${today}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (leadsResult === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando leads...</p>
      </div>
    );
  }

  // Active filter tags
  const activeFilterTags = [];
  if (filters.status) {
    activeFilterTags.push({
      type: 'status' as const,
      label: `Estado: ${statusLabels[filters.status]}`,
    });
  }
  if (filters.dateFrom) {
    activeFilterTags.push({
      type: 'dateFrom' as const,
      label: `Desde: ${filters.dateFrom}`,
    });
  }
  if (filters.dateTo) {
    activeFilterTags.push({
      type: 'dateTo' as const,
      label: `Hasta: ${filters.dateTo}`,
    });
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">
            Gestión de contactos y prospectos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exportar CSV
          </button>
          <div className="text-sm text-gray-500">
            Total:{' '}
            <span className="font-semibold text-gray-700">
              {allLeads.length}
            </span>{' '}
            leads
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="new">Nuevo</option>
              <option value="contacted">Contactado</option>
              <option value="qualified">Calificado</option>
              <option value="converted">Convertido</option>
              <option value="lost">Perdido</option>
            </select>
          </div>

          {/* Date From Filter */}
          <div className="flex-1">
            <label
              htmlFor="date-from-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha desde
            </label>
            <input
              type="date"
              id="date-from-filter"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Date To Filter */}
          <div className="flex-1">
            <label
              htmlFor="date-to-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha hasta
            </label>
            <input
              type="date"
              id="date-to-filter"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Reset Button */}
          <div className="flex-shrink-0">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilterTags.map((tag) => (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {tag.label}
                <button
                  onClick={() => removeFilter(tag.type)}
                  className="hover:text-blue-600"
                  aria-label="Eliminar filtro"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filtered Count */}
      <div className="text-sm text-gray-500">
        Mostrando{' '}
        <span className="font-semibold text-gray-700">
          {filteredLeads.length}
        </span>{' '}
        de{' '}
        <span className="font-semibold text-gray-700">{allLeads.length}</span>{' '}
        leads
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay leads que coincidan
          </h3>
          <p className="mt-2 text-gray-500">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <>
          {/* Leads Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Teléfono
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Servicio
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Ciudad
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pageLeads.map((lead: Lead) => {
                    const badge =
                      statusConfig[lead.status || 'new'] || statusConfig.new;
                    return (
                      <tr
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/admin/leads/${lead._id}`)
                        }
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {lead.nombre}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <a
                            href={`tel:${lead.telefono}`}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.telefono}
                          </a>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-gray-700 hover:text-blue-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.email}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                          {lead.servicio}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                          {lead.ciudad || (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bgClass} ${badge.textClass}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">{startIndex + 1}</span> a{' '}
                    <span className="font-medium">{endIndex}</span> de{' '}
                    <span className="font-medium">{filteredLeads.length}</span>{' '}
                    resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Anterior</span>
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Siguiente</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
