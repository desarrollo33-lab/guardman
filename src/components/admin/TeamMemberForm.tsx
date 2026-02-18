import { useState, useEffect } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface TeamMember {
  _id: Id<'team_members'>;
  name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  order: number;
  is_active?: boolean;
}

interface TeamMemberFormProps {
  member: TeamMember | null;
  onSubmit: (data: Partial<TeamMember>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  nextOrder: number;
}

interface FormData {
  name: string;
  role: string;
  avatar_url: string;
  bio: string;
  order: number;
  is_active: boolean;
}

// Default avatar placeholder
const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#E5E7EB"/>
  <circle cx="50" cy="38" r="18" fill="#9CA3AF"/>
  <ellipse cx="50" cy="80" rx="28" ry="20" fill="#9CA3AF"/>
</svg>
`)}`;

export default function TeamMemberForm({
  member,
  onSubmit,
  onCancel,
  isSubmitting,
  nextOrder,
}: TeamMemberFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    avatar_url: '',
    bio: '',
    order: nextOrder,
    is_active: true,
  });
  const [avatarError, setAvatarError] = useState(false);

  // Initialize form with member data if editing
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        avatar_url: member.avatar_url || '',
        bio: member.bio || '',
        order: member.order,
        is_active: member.is_active !== false,
      });
    } else {
      setFormData({
        name: '',
        role: '',
        avatar_url: '',
        bio: '',
        order: nextOrder,
        is_active: true,
      });
    }
    setAvatarError(false);
  }, [member, nextOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Por favor completa los campos requeridos: Nombre y Rol');
      return;
    }

    // Build data object
    const data: Partial<TeamMember> = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      order: formData.order,
      is_active: formData.is_active,
    };

    // Only include optional fields if they have values
    if (formData.avatar_url.trim()) {
      data.avatar_url = formData.avatar_url.trim();
    }
    if (formData.bio.trim()) {
      data.bio = formData.bio.trim();
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {member ? 'Editar Miembro' : 'Nuevo Miembro'}
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
          <div className="space-y-5">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img
                    src={
                      avatarError || !formData.avatar_url
                        ? DEFAULT_AVATAR
                        : formData.avatar_url
                    }
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Avatar
                </label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar_url: e.target.value,
                    }));
                    setAvatarError(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ingresa una URL de imagen para el avatar
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo / Rol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Gerente General"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Breve descripción del miembro..."
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                Los miembros se ordenan de menor a mayor
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Miembro activo (visible en el sitio)
              </span>
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
