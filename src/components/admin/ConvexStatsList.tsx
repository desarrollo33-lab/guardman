import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import StatsList from './StatsList';
import AuthGuard from './AuthGuard';

export default function ConvexStatsList() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <StatsList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
