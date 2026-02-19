import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '../../lib/convex';
import CompanyValuesList from './CompanyValuesList';
import AuthGuard from './AuthGuard';

export default function ConvexCompanyValuesList() {
  const convex = getConvexClient();

  return (
    <ConvexProvider client={convex}>
      <AuthGuard>
        <CompanyValuesList />
      </AuthGuard>
    </ConvexProvider>
  );
}
