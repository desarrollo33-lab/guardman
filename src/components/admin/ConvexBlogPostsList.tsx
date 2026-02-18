import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import BlogPostsList from './BlogPostsList';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to BlogPostsList.
 * Required for Astro integration - use this instead of BlogPostsList directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexBlogPostsList() {
  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <BlogPostsList />
      </AuthGuard>
    </ConvexProvider>
  );
}
