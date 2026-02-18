import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import CommunesList from './CommunesList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to CommunesList.
 * Required for Astro integration - use this instead of CommunesList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexCommunesList() {
  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <CommunesList />
      </AuthGuard>
    </ConvexProvider>
  );
}
