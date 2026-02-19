import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import StatsList from './StatsList';
import AuthGuard from './AuthGuard';

export default function ConvexStatsList() {
  const convex = getConvexClient();

  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <StatsList />
      </AuthGuard>
    </ConvexProvider>
  );
}
