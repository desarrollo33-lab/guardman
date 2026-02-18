import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import PartnersList from './PartnersList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to PartnersList.
 * Required for Astro integration - use this instead of PartnersList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexPartnersList() {
  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <PartnersList />
      </AuthGuard>
    </ConvexProvider>
  );
}
