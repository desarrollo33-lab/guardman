import { useEffect } from 'react';
import {
  useConvexAuth,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from 'convex/react';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Loading spinner component for auth state
 */
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Verificando autenticación...</p>
      </div>
    </div>
  );
}

/**
 * Redirect component that navigates to login page
 */
function RedirectToLogin({ to }: { to: string }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return <LoadingSpinner />;
}

/**
 * AuthGuard component that protects admin routes.
 *
 * - Shows loading state while checking authentication
 * - Redirects to login page if not authenticated
 * - Renders children if authenticated
 *
 * Usage:
 * ```tsx
 * <AuthGuard>
 *   <AdminDashboard />
 * </AuthGuard>
 * ```
 */
export default function AuthGuard({
  children,
  redirectTo = '/admin/login',
}: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <RedirectToLogin to={redirectTo} />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

/**
 * Alternative AuthGuard using Convex Auth components.
 * This version uses the declarative Authenticated/Unauthenticated/AuthLoading components.
 */
export function AuthGuardDeclarative({
  children,
  redirectTo = '/admin/login',
}: AuthGuardProps) {
  return (
    <>
      <AuthLoading>
        <LoadingSpinner />
      </AuthLoading>
      <Unauthenticated>
        <RedirectToLogin to={redirectTo} />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}
