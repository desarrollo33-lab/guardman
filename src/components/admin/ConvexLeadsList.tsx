import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import LeadsList from './LeadsList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to LeadsList.
 * Required for Astro integration - use this instead of LeadsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexLeadsList() {
  return (
    <ConvexAuthProvider client={getConvexClient()}>
      <AuthGuard>
        <LeadsList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
