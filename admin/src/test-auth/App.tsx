/**
 * Refine + Convex Auth Test Application
 * 
 * This is a minimal test app to validate that Refine can work with @convex-dev/auth.
 * 
 * Architecture:
 * 1. ConvexAuthProvider wraps the app (from @convex-dev/auth/react)
 * 2. AuthBridge component connects Convex Auth hooks to our authProvider
 * 3. Refine's Refine component uses our convexAuthProvider
 */

import { Refine, useGetIdentity, useLogout } from "@refinedev/core";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import { ConvexReactClient, useQuery } from "convex/react";
import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

import { convexAuthProvider, registerAuthActions, updateAuthState, resetAuthState } from "./authProvider";
import { LoginPage } from "./LoginPage";
import { TestPage } from "./TestPage";

// Import the currentUser query from Convex
import { api } from "../../../convex/_generated/api";

// Convex client configuration
const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl);

/**
 * AuthBridge Component
 * 
 * This component bridges Convex Auth hooks to our authProvider.
 * It runs inside ConvexAuthProvider context to access auth hooks.
 */
function AuthBridge({ children }: { children: React.ReactNode }) {
  const authActions = useAuthActions();
  
  // Get current user from Convex query
  // This uses Convex's built-in auth integration
  const currentUser = useQuery(api.users.currentUser);
  
  // Register auth actions with our bridge on mount
  useEffect(() => {
    // Create a wrapper for signIn that matches our expected interface
    const signInWrapper = async (provider: string, formData: FormData) => {
      await authActions.signIn(provider, formData);
    };
    
    registerAuthActions({
      signIn: signInWrapper,
      signOut: authActions.signOut,
      // fetchAccessToken is not available in useAuthActions
      // We'll use the presence of currentUser as our auth check
      fetchAccessToken: async () => {
        // Return a truthy value if we have a user
        return currentUser ? "authenticated" : null;
      },
    });
    console.log("[AuthBridge] Auth actions registered");
  }, [authActions, currentUser]);

  // Update auth state when Convex Auth state changes
  useEffect(() => {
    if (currentUser) {
      updateAuthState({
        isAuthenticated: true,
        userId: currentUser._id,
        email: currentUser.email ?? null,
        name: currentUser.name ?? null,
        role: (currentUser as any).role ?? null,
      });
      console.log("[AuthBridge] Auth state updated:", currentUser);
    } else if (currentUser === null) {
      resetAuthState();
      console.log("[AuthBridge] Auth state reset (user is null)");
    }
    // If currentUser is undefined, we're still loading
  }, [currentUser]);

  return <>{children}</>;
}

/**
 * Protected Route Component
 * 
 * Uses Refine's authProvider to check authentication.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: identity, isLoading } = useGetIdentity();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!identity) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

/**
 * Layout Component with Auth Status
 */
function Layout() {
  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Guardman Admin (Auth Test)</h1>
          {identity && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {identity.email as string} ({identity.role as string})
              </span>
              <button
                onClick={() => logout()}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Main Test App Component
 */
function TestApp() {
  return (
    <BrowserRouter basename="/admin">
      <ConvexAuthProvider client={convex}>
        <AuthBridge>
          <Refine
            authProvider={convexAuthProvider}
            resources={[
              {
                name: "test",
                list: "/test",
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<Layout />}>
                <Route
                  path="/test"
                  element={
                    <ProtectedRoute>
                      <TestPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/test" replace />} />
              </Route>
            </Routes>
          </Refine>
        </AuthBridge>
      </ConvexAuthProvider>
    </BrowserRouter>
  );
}

export default TestApp;
