/**
 * ConvexAuthProvider - React component that bridges @convex-dev/auth to Refine
 *
 * This component:
 * 1. Wraps the app with ConvexAuthProvider from @convex-dev/auth
 * 2. Uses useAuthActions to get signIn/signOut functions
 * 3. Uses useUser to get current authenticated user
 * 4. Updates global auth state so authProvider can access it
 */

import { useEffect } from "react";
import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import { ConvexReactClient, useQuery } from "convex/react";
import { setCurrentUser, onAuthStateChange, type AuthUser } from "./authProvider";
import { api } from "../../../convex/_generated/api";

// Convex deployment URL - use environment variable or fallback
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || 'https://opulent-cod-610.convex.cloud';

// Create Convex client (same as used elsewhere)
const convex = new ConvexReactClient(CONVEX_URL);

/**
 * Inner component that has access to auth hooks
 * This component is rendered inside ConvexAuthProvider
 */
function AuthStateManager({ children }: { children: React.ReactNode }) {
  const { signIn, signOut } = useAuthActions();
  
  // Use the currentUser query to get authenticated user
  const user = useQuery(api.users.currentUser);
  
  // Update global auth state when user changes
  useEffect(() => {
    console.log("[AuthStateManager] user changed:", user);
    
    if (user) {
      // User is authenticated
      const authUser: AuthUser = {
        id: user._id,
        email: user.email ?? "",
        name: user.name ?? undefined,
        role: user.role ?? undefined,
      };
      setCurrentUser(authUser);
    } else {
      // User is not authenticated
      setCurrentUser(null);
    }
  }, [user]);
  
  // Expose auth actions globally for authProvider
  // This allows non-React code (like Refine authProvider) to trigger auth
  useEffect(() => {
    // Make signIn/signOut available globally
    (window as any).__convexSignIn = signIn;
    (window as any).__convexSignOut = signOut;
    
    return () => {
      delete (window as any).__convexSignIn;
      delete (window as any).__convexSignOut;
    };
  }, [signIn, signOut]);
  
  return <>{children}</>;
}

/**
 * Custom signIn function that can be called from authProvider
 * This bridges the async authProvider methods to React hooks
 */
export async function convexSignIn(
  provider: string, 
  params: FormData | Record<string, any>
) {
  const signInFn = (window as any).__convexSignIn;
  if (!signInFn) {
    throw new Error("ConvexAuthProvider not mounted");
  }
  return signInFn(provider, params);
}

/**
 * Custom signOut function that can be called from authProvider
 */
export async function convexSignOut() {
  const signOutFn = (window as any).__convexSignOut;
  if (!signOutFn) {
    throw new Error("ConvexAuthProvider not mounted");
  }
  return signOutFn();
}

/**
 * Main provider component
 * Wrap your app with this to enable Convex Auth integration
 */
export function ConvexAuthProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ConvexAuthProvider client={convex}>
      <AuthStateManager>
        {children}
      </AuthStateManager>
    </ConvexAuthProvider>
  );
}

// Re-export for convenience
export { onAuthStateChange };
export type { AuthUser } from "./authProvider";
