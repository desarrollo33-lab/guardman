import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import Dashboard from './Dashboard';

/**
 * Wrapper that provides Convex context to Dashboard.
 * Required for Astro integration - use this instead of Dashboard directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexDashboard() {
  return (
    <ConvexProvider client={convex}>
      <Dashboard />
    </ConvexProvider>
  );
}
