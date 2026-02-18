import {
  ConvexAuthProvider,
  useAuthActions,
  useAuthToken,
} from '@convex-dev/auth/react';
import { convex } from './convex';
import type { ReactNode } from 'react';

/**
 * Auth provider wrapper for React components.
 * Use this to wrap admin components that need authentication.
 *
 * Example usage in an Astro page:
 * ```astro
 * ---
 * import { AuthProvider } from '@/lib/auth';
 * ---
 * <AuthProvider>
 *   <AdminPanel client:load />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}

// Re-export auth hooks for convenience
export { useAuthActions, useAuthToken };
