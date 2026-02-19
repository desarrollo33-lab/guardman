import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import CompanyValuesList from './CompanyValuesList';
import AuthGuard from './AuthGuard';

export default function ConvexCompanyValuesList() {
  const convex = getConvexClient();

  return (
    <ConvexAuthProvider client={convex}>
      <AuthGuard>
        <CompanyValuesList />
      </AuthGuard>
    </ConvexAuthProvider>
  );
}
