import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import ProcessStepsList from './ProcessStepsList';
import AuthGuard from './AuthGuard';

export default function ConvexProcessStepsList() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <ProcessStepsList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
