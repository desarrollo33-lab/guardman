import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import ServicesList from './ServicesList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to ServicesList.
 * Required for Astro integration - use this instead of ServicesList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexServicesList() {
  return (
    <ConvexAuthProvider client={getConvexClient()}>
      <AuthGuard>
        <ServicesList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
