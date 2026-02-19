import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import HeroesList from './HeroesList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to HeroesList.
 * Required for Astro integration - use this instead of HeroesList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexHeroesList() {
  return (
    <ConvexProvider client={getConvexClient()}>
      <AuthGuard>
        <HeroesList />
      </AuthGuard>
    </ConvexProvider>
  );
}
