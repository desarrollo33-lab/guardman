import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import ProcessStepsList from './ProcessStepsList';
import AuthGuard from './AuthGuard';

export default function ConvexProcessStepsList() {
  const convex = getConvexClient();

  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <ProcessStepsList />
      </AuthGuard>
    </ConvexProvider>
  );
}
