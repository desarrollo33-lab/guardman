import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import FAQsList from './FAQsList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to FAQsList.
 * Required for Astro integration - use this instead of FAQsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexFAQsList() {
  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <FAQsList />
      </AuthGuard>
    </ConvexProvider>
  );
}
