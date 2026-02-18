import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import HeroForm from './HeroForm';

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

const PAGE_OPTIONS = [
  { value: 'home', label: 'Home (Inicio)' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'nosotros', label: 'Nosotros' },
  { value: 'contacto', label: 'Contacto' },
  { value: 'blog', label: 'Blog' },
  { value: 'cotizar', label: 'Cotizar' },
];

const BACKGROUND_TYPE_ICONS = {
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  image: (
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
  ),
};

function getPageLabel(pageSlug: string): string {
  return PAGE_OPTIONS.find((p) => p.value === pageSlug)?.label || pageSlug;
}

export default function HeroesList() {
  const heroes = useQuery(api.heroes.getAllHeroes);
  const createHero = useMutation(api.heroes.createHero);
  const updateHero = useMutation(api.heroes.updateHero);
  const deleteHero = useMutation(api.heroes.deleteHero);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter heroes
  const filteredHeroes =
    heroes?.filter((hero: Hero) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          hero.title.toLowerCase().includes(query) ||
          hero.page_slug.toLowerCase().includes(query) ||
          (hero.subtitle?.toLowerCase().includes(query) ?? false);
        if (!matchesSearch) return false;
      }

      // Active filter
      if (filterActive !== null) {
        if (filterActive && hero.is_active !== true) return false;
        if (!filterActive && hero.is_active !== false) return false;
      }

      return true;
    }) ?? [];

  // Sort by page_slug
  const sortedHeroes = [...filteredHeroes].sort((a, b) =>
    a.page_slug.localeCompare(b.page_slug)
  );

  const handleCreate = () => {
    setEditingHero(null);
    setShowForm(true);
  };

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero);
    setShowForm(true);
  };

  const handleDelete = async (hero: Hero) => {
    if (
      !confirm(
        `¿Eliminar el hero "${hero.title}" de ${getPageLabel(hero.page_slug)}?`
      )
    )
      return;

    try {
      await deleteHero({ id: hero._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleToggleActive = async (hero: Hero) => {
    try {
      await updateHero({
        id: hero._id,
        is_active: !hero.is_active,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const handleFormSubmit = async (data: Partial<Hero>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingHero) {
        await updateHero({ id: editingHero._id, ...data });
      } else {
        await createHero({
          page_slug: data.page_slug!,
          title: data.title!,
          background_type: data.background_type!,
          ...data,
        });
      }
      setShowForm(false);
      setEditingHero(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (heroes === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando heroes...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Heroes</h1>
          <p className="text-gray-600 mt-1">
            Gestión de secciones hero por página
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
          Nuevo Hero
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
              placeholder="Buscar por título o página..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Active Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtrar:</span>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setFilterActive(null)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterActive === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterActive(true)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  filterActive === true
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilterActive(false)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  filterActive === false
                    ? 'bg-gray-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Heroes List */}
      {sortedHeroes.length === 0 ? (
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery || filterActive !== null
              ? 'No se encontraron heroes'
              : 'No hay heroes creados'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || filterActive !== null
              ? 'Intenta con otros filtros'
              : 'Crea el primer hero para una página'}
          </p>
          {!searchQuery && filterActive === null && (
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
              Crear Hero
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
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Página
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Hero
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Tipo Fondo
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  CTAs / Badges
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
              {sortedHeroes.map((hero: Hero) => (
                <tr
                  key={hero._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getPageLabel(hero.page_slug)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{hero.title}</p>
                      {hero.subtitle && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {hero.subtitle}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                          hero.background_type === 'youtube'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {BACKGROUND_TYPE_ICONS[hero.background_type]}
                      </span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 capitalize">
                          {hero.background_type}
                        </p>
                        {hero.background_type === 'youtube' &&
                          hero.youtube_id && (
                            <p className="text-gray-500 font-mono text-xs">
                              {hero.youtube_id}
                            </p>
                          )}
                        {hero.background_type === 'image' && hero.image_url && (
                          <p className="text-gray-500 text-xs truncate max-w-[120px]">
                            URL configurada
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">
                          {hero.ctas?.length ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">CTAs</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">
                          {hero.badges?.length ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">Badges</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(hero)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        hero.is_active !== false
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {hero.is_active !== false ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(hero)}
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
                        onClick={() => handleDelete(hero)}
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

      {/* Hero Form Modal */}
      {showForm && (
        <HeroForm
          hero={editingHero}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingHero(null);
          }}
          isSubmitting={isSubmitting}
          pageOptions={PAGE_OPTIONS}
        />
      )}
    </>
  );
}
