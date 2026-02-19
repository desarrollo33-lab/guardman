import { ConvexProvider } from 'convex/react';
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
    <ConvexProvider client={getConvexClient()}>
      <AuthGuard>
        <TeamList />
      </AuthGuard>
    </ConvexProvider>
  );
}
