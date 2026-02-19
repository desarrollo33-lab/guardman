import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import Dashboard from './Dashboard';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to Dashboard.
 * Required for Astro integration - use this instead of Dashboard directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexDashboard() {
  return (
    <ConvexAuthProvider client={getConvexClient()}>
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
