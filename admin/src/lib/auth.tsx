import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { convexClient } from './convex';
import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>
  );
}
