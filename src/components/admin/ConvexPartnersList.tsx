import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import PartnersList from './PartnersList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to PartnersList.
 * Required for Astro integration - use this instead of PartnersList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexPartnersList() {
  return (
    <ConvexAuthProvider client={getConvexClient()}>
      <AuthGuard>
        <PartnersList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
