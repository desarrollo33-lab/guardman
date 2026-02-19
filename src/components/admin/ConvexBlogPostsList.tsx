import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import BlogPostsList from './BlogPostsList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to BlogPostsList.
 * Required for Astro integration - use this instead of BlogPostsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexBlogPostsList() {
  return (
    <ConvexAuthProvider client={getConvexClient()}>
      <AuthGuard>
        <BlogPostsList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
