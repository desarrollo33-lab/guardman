import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import CommuneForm from './CommuneForm';

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

const ZONE_LABELS: Record<string, string> = {
  norte: 'Zona Norte',
  sur: 'Zona Sur',
  oriente: 'Zona Oriente',
  occidente: 'Zona Occidente',
  centro: 'Zona Centro',
  sin_zona: 'Sin Zona',
};

// Check SEO completion percentage
function getSEOCompletion(commune: Commune): {
  percentage: number;
  missing: string[];
} {
  const fields = [
    { key: 'meta_title', label: 'Meta Título' },
    { key: 'meta_description', label: 'Meta Descripción' },
    { key: 'hero_title', label: 'Título Hero' },
    { key: 'hero_subtitle', label: 'Subtítulo Hero' },
    { key: 'intro_content', label: 'Contenido Intro' },
  ];

  const missing: string[] = [];
  let filled = 0;

  for (const field of fields) {
    const value = commune[field.key as keyof Commune];
    if (value && typeof value === 'string' && value.trim().length > 0) {
      filled++;
    } else {
      missing.push(field.label);
    }
  }

  return {
    percentage: Math.round((filled / fields.length) * 100),
    missing,
  };
}

export default function CommunesList() {
  const communes = useQuery(api.communes.getAll);
  const updateCommuneSEO = useMutation(api.communes.updateCommuneSEO);
  const deleteCommune = useMutation(api.communes.deleteCommune);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCommune, setEditingCommune] = useState<Commune | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get unique zones from data
  const zones = useMemo(() => {
    if (!communes) return [];
    const uniqueZones = new Set<string>();
    communes.forEach((c: Commune) => {
      if (c.zone) uniqueZones.add(c.zone);
    });
    return Array.from(uniqueZones).sort();
  }, [communes]);

  // Filter and group communes
  const filteredAndGrouped = useMemo(() => {
    if (!communes) return {};

    let filtered = communes.filter((c: Commune) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !c.name.toLowerCase().includes(query) &&
          !c.slug.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Zone filter
      if (selectedZone !== 'all') {
        if (selectedZone === 'sin_zona' && c.zone) return false;
        if (selectedZone !== 'sin_zona' && c.zone !== selectedZone)
          return false;
      }

      return true;
    });

    // Sort by name
    filtered.sort((a: Commune, b: Commune) =>
      a.name.localeCompare(b.name, 'es')
    );

    // Group by zone
    const grouped: Record<string, Commune[]> = {};
    filtered.forEach((c: Commune) => {
      const zone = c.zone || 'sin_zona';
      if (!grouped[zone]) grouped[zone] = [];
      grouped[zone].push(c);
    });

    return grouped;
  }, [communes, searchQuery, selectedZone]);

  // Calculate total counts
  const totalCount = communes?.length ?? 0;
  const seoCompleteCount =
    communes?.filter((c: Commune) => getSEOCompletion(c).percentage === 100)
      .length ?? 0;

  const handleEdit = (commune: Commune) => {
    setEditingCommune(commune);
    setShowForm(true);
  };

  const handleDelete = async (commune: Commune) => {
    if (!confirm(`¿Eliminar la comuna "${commune.name}"?`)) return;

    try {
      await deleteCommune({ id: commune._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleFormSubmit = async (data: Partial<Commune>) => {
    if (!editingCommune) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateCommuneSEO({
        id: editingCommune._id,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        hero_title: data.hero_title,
        hero_subtitle: data.hero_subtitle,
        intro_content: data.intro_content,
      });
      setShowForm(false);
      setEditingCommune(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (communes === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando comunas...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comunas (PSEO)</h1>
          <p className="text-gray-600 mt-1">
            Gestión de SEO programático por comuna
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium">
            {seoCompleteCount}/{totalCount} con SEO completo
          </div>
        </div>
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
          <div className="flex-1 relative">
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
              placeholder="Buscar por nombre o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              Zona:
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">Todas</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {ZONE_LABELS[zone] || zone}
                </option>
              ))}
              <option value="sin_zona">Sin Zona</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communes List */}
      {Object.keys(filteredAndGrouped).length === 0 ? (
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery || selectedZone !== 'all'
              ? 'No se encontraron comunas'
              : 'No hay comunas creadas'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || selectedZone !== 'all'
              ? 'Intenta con otra búsqueda o filtro'
              : 'Las comunas se importan desde la base de datos'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(filteredAndGrouped)
            .sort(([a], [b]) => {
              // Sort zones: known zones first, then sin_zona
              if (a === 'sin_zona') return 1;
              if (b === 'sin_zona') return -1;
              return a.localeCompare(b);
            })
            .map(([zone, zoneCommunes]) => (
              <div
                key={zone}
                className="bg-white shadow-sm rounded-lg overflow-hidden"
              >
                {/* Zone Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      {ZONE_LABELS[zone] || zone}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {zoneCommunes.length} comunas
                    </span>
                  </div>
                </div>

                {/* Communes Table */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Comuna
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Slug
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Estado SEO
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
                    {zoneCommunes.map((commune: Commune) => {
                      const seo = getSEOCompletion(commune);
                      return (
                        <tr
                          key={commune._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
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
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {commune.name}
                                </p>
                                {commune.isOtherCity && (
                                  <span className="text-xs text-gray-500 italic">
                                    Otra ciudad
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                              {commune.slug}
                            </code>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {/* Progress Bar */}
                              <div className="flex-1 max-w-xs">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      seo.percentage === 100
                                        ? 'bg-green-500'
                                        : seo.percentage >= 60
                                          ? 'bg-yellow-500'
                                          : 'bg-red-400'
                                    }`}
                                    style={{ width: `${seo.percentage}%` }}
                                  />
                                </div>
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  seo.percentage === 100
                                    ? 'text-green-600'
                                    : seo.percentage >= 60
                                      ? 'text-yellow-600'
                                      : 'text-red-500'
                                }`}
                              >
                                {seo.percentage}%
                              </span>
                              {seo.missing.length > 0 && (
                                <div className="relative group">
                                  <button className="text-gray-400 hover:text-gray-600">
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
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </button>
                                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="font-medium mb-1">
                                      Falta completar:
                                    </p>
                                    <ul className="space-y-0.5">
                                      {seo.missing.map((m) => (
                                        <li key={m}>• {m}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(commune)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Editar SEO"
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
                                onClick={() => handleDelete(commune)}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}

      {/* Commune Form Modal */}
      {showForm && editingCommune && (
        <CommuneForm
          commune={editingCommune}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCommune(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
