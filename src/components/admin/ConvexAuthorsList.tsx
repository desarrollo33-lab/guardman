import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import AuthorsList from './AuthorsList';
import AuthGuard from './AuthGuard';

export default function ConvexAuthorsList() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <AuthorsList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
