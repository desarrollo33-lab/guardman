import { useAuthActions } from '@convex-dev/auth/react';

/**
 * Logout button component using Convex Auth.
 * Handles sign out and redirects to login page.
 */
export default function LogoutButton() {
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
