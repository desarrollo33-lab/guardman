import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import SolutionsList from './SolutionsList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to SolutionsList.
 * Required for Astro integration - use this instead of SolutionsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexSolutionsList() {
  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <SolutionsList />
      </AuthGuard>
    </ConvexProvider>
  );
}
