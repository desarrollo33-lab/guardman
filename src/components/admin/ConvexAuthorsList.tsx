import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import AuthorsList from './AuthorsList';
import AuthGuard from './AuthGuard';

export default function ConvexAuthorsList() {
  const convex = getConvexClient();

  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <AuthorsList />
      </AuthGuard>
    </ConvexProvider>
  );
}
