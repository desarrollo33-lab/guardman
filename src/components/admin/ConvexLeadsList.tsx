import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import LeadsList from './LeadsList';

/**
 * Wrapper that provides Convex context to LeadsList.
 * Required for Astro integration - use this instead of LeadsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexLeadsList() {
  return (
    <ConvexProvider client={convex}>
      <LeadsList />
    </ConvexProvider>
  );
}
