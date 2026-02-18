import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import TeamMemberForm from './TeamMemberForm';

interface TeamMember {
  _id: Id<'team_members'>;
  name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  order: number;
  is_active?: boolean;
}

// Default avatar placeholder
const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#E5E7EB"/>
  <circle cx="50" cy="38" r="18" fill="#9CA3AF"/>
  <ellipse cx="50" cy="80" rx="28" ry="20" fill="#9CA3AF"/>
</svg>
`)}`;

export default function TeamList() {
  const teamMembers = useQuery(api.team_members.getAllTeamMembers);
  const createTeamMember = useMutation(api.team_members.createTeamMember);
  const updateTeamMember = useMutation(api.team_members.updateTeamMember);
  const deleteTeamMember = useMutation(api.team_members.deleteTeamMember);
  const reorderTeamMembers = useMutation(api.team_members.reorderTeamMembers);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter members by search
  const filteredMembers =
    teamMembers?.filter((member: TeamMember) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      );
    }) ?? [];

  // Sort by order
  const sortedMembers = [...filteredMembers].sort((a, b) => a.order - b.order);

  const handleCreate = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (member: TeamMember) => {
    if (!confirm(`¿Eliminar al miembro "${member.name}"?`)) return;

    try {
      await deleteTeamMember({ id: member._id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      await updateTeamMember({
        id: member._id,
        is_active: !member.is_active,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const handleMoveUp = async (member: TeamMember, index: number) => {
    if (index === 0) return;
    const prevMember = sortedMembers[index - 1];
    await reorderTeamMembers({
      orders: [
        { id: member._id, order: prevMember.order },
        { id: prevMember._id, order: member.order },
      ],
    });
  };

  const handleMoveDown = async (member: TeamMember, index: number) => {
    if (index === sortedMembers.length - 1) return;
    const nextMember = sortedMembers[index + 1];
    await reorderTeamMembers({
      orders: [
        { id: member._id, order: nextMember.order },
        { id: nextMember._id, order: member.order },
      ],
    });
  };

  const handleFormSubmit = async (data: Partial<TeamMember>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingMember) {
        await updateTeamMember({ id: editingMember._id, ...data });
      } else {
        await createTeamMember({
          name: data.name!,
          role: data.role!,
          order: data.order ?? teamMembers?.length ?? 0,
          avatar_url: data.avatar_url,
          bio: data.bio,
          is_active: data.is_active,
        });
      }
      setShowForm(false);
      setEditingMember(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (teamMembers === undefined) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando equipo...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="text-gray-600 mt-1">Gestión de miembros del equipo</p>
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
          Nuevo Miembro
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
            placeholder="Buscar por nombre o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      {sortedMembers.length === 0 ? (
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
            {searchQuery
              ? 'No se encontraron miembros'
              : 'No hay miembros del equipo'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery
              ? 'Intenta con otra búsqueda'
              : 'Agrega el primer miembro del equipo'}
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
              Agregar Miembro
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedMembers.map((member: TeamMember, index: number) => (
            <div
              key={member._id}
              className={`bg-white shadow-sm rounded-lg overflow-hidden transition-all hover:shadow-md ${
                member.is_active === false ? 'opacity-60' : ''
              }`}
            >
              {/* Avatar and Order Controls */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={member.avatar_url || DEFAULT_AVATAR}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                </div>

                {/* Order Controls */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(member, index)}
                    disabled={index === 0}
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm text-gray-600 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                    onClick={() => handleMoveDown(member, index)}
                    disabled={index === sortedMembers.length - 1}
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm text-gray-600 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

                {/* Order Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                  #{member.order + 1}
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-2 left-2">
                  <button
                    onClick={() => handleToggleActive(member)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      member.is_active !== false
                        ? 'bg-green-500/90 text-white hover:bg-green-600'
                        : 'bg-gray-500/90 text-white hover:bg-gray-600'
                    }`}
                  >
                    {member.is_active !== false ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              </div>

              {/* Member Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">{member.role}</p>
                {member.bio && (
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                    {member.bio}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
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
                    onClick={() => handleDelete(member)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Member Form Modal */}
      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          isSubmitting={isSubmitting}
          nextOrder={teamMembers?.length ?? 0}
        />
      )}
    </>
  );
}
