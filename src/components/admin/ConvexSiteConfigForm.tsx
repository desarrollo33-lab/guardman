import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import SiteConfigForm from './SiteConfigForm';
import AuthGuard from './AuthGuard';

/**
 * Wrapper that provides Convex context and auth guard to SiteConfigForm.
 * Required for Astro integration - use this instead of SiteConfigForm directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexSiteConfigForm() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <SiteConfigForm />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
