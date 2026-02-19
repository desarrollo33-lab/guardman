import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import TeamList from './TeamList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to TeamList.
 * Required for Astro integration - use this instead of TeamList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexTeamList() {
  return (
    <ConvexAuthProvider client={getConvexClient()}>
      <AuthGuard>
        <TeamList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
