import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import IndustriesList from './IndustriesList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to IndustriesList.
 * Required for Astro integration - use this instead of IndustriesList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexIndustriesList() {
  const convex = getConvexClient();

  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <IndustriesList />
      </AuthGuard>
    </ConvexProvider>
  );
}
