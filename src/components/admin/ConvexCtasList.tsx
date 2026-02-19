import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import CtasList from './CtasList';
import AuthGuard from './AuthGuard';

export default function ConvexCtasList() {
  const convex = getConvexClient();

  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <CtasList />
      </AuthGuard>
    </ConvexProvider>
  );
}
