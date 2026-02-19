import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import CtasList from './CtasList';
import AuthGuard from './AuthGuard';

export default function ConvexCtasList() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <CtasList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
