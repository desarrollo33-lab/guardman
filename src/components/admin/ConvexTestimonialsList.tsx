import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import TestimonialsList from './TestimonialsList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to TestimonialsList.
 * Required for Astro integration - use this instead of TestimonialsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexTestimonialsList() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <TestimonialsList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
