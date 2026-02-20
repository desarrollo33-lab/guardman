/**
 * Refine AuthProvider Bridge for @convex-dev/auth
 *
 * This module bridges Convex Auth to Refine's authProvider interface.
 * 
 * KEY INSIGHT: Convex Auth uses React hooks (signIn/signOut from useAuthActions)
 * while Refine expects async methods in authProvider. We create a hybrid approach:
 * - The authProvider methods call into a shared auth state/actions module
 * - The React components provide the actual signIn/signOut implementations
 */

import type { AuthProvider } from "@refinedev/core";
import type { Id } from "../../../convex/_generated/dataModel";

// Shared auth state - updated by React components using Convex Auth hooks
interface AuthState {
  isAuthenticated: boolean;
  userId: Id<"users"> | null;
  email: string | null;
  name: string | null;
  role: string | null;
}

// Global auth state (simple approach for testing)
let authState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  name: null,
  role: null,
};

// Auth actions that will be set by React components
interface AuthActions {
  signIn: (provider: string, formData: FormData) => Promise<void>;
  signOut: () => Promise<void>;
  fetchAccessToken: (args?: { forceRefreshToken: boolean }) => Promise<string | null>;
}

let authActions: AuthActions | null = null;

/**
 * Called by React components to register their auth actions
 * This allows the authProvider to call signIn/signOut from non-React contexts
 */
export function registerAuthActions(actions: AuthActions) {
  authActions = actions;
}

/**
 * Called by React components to update auth state
 */
export function updateAuthState(newState: Partial<AuthState>) {
  authState = { ...authState, ...authState, ...newState };
}

/**
 * Get current auth state
 */
export function getAuthState(): AuthState {
  return { ...authState };
}

/**
 * Reset auth state (used on logout)
 */
export function resetAuthState() {
  authState = {
    isAuthenticated: false,
    userId: null,
    email: null,
    name: null,
    role: null,
  };
}

/**
 * Refine AuthProvider implementation
 * 
 * This bridges Convex Auth to Refine's expected interface.
 */
export const convexAuthProvider: AuthProvider = {
  login: async ({ email, password }) => {
    console.log("[authProvider] login called with:", { email });
    
    if (!authActions) {
      console.error("[authProvider] Auth actions not registered!");
      return {
        success: false,
        error: {
          message: "Auth system not initialized",
          name: "Initialization Error",
        },
      };
    }

    try {
      // Create FormData for Convex Auth password provider
      const formData = new FormData();
      formData.append("email", email as string);
      formData.append("password", password as string);
      formData.append("flow", "signIn");

      await authActions.signIn("password", formData);
      
      console.log("[authProvider] signIn completed successfully");
      
      // Wait for auth state to be updated (currentUser to be fetched)
      // Poll for up to 5 seconds
      const maxWaitMs = 5000;
      const pollIntervalMs = 100;
      let waited = 0;
      
      while (!authState.isAuthenticated && waited < maxWaitMs) {
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        waited += pollIntervalMs;
        console.log(`[authProvider] waiting for auth state... (${waited}ms)`);
      }
      
      if (!authState.isAuthenticated) {
        console.warn("[authProvider] auth state not updated after login, but signIn succeeded");
      }
      
      return {
        success: true,
        redirectTo: "/test",
      };
    } catch (error) {
      console.error("[authProvider] signIn error:", error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Login failed",
          name: "Login Error",
        },
      };
    }
  },

  logout: async () => {
    console.log("[authProvider] logout called");
    
    if (!authActions) {
      console.error("[authProvider] Auth actions not registered!");
      resetAuthState();
      return { success: true, redirectTo: "/login" };
    }

    try {
      await authActions.signOut();
      resetAuthState();
      console.log("[authProvider] signOut completed successfully");
      return { success: true, redirectTo: "/login" };
    } catch (error) {
      console.error("[authProvider] signOut error:", error);
      resetAuthState();
      return { success: true, redirectTo: "/login" };
    }
  },

  check: async () => {
    console.log("[authProvider] check called, isAuthenticated:", authState.isAuthenticated);
    
    // Check if we have a valid token/session
    if (authActions) {
      try {
        const token = await authActions.fetchAccessToken();
        if (token) {
          return { authenticated: true };
        }
      } catch (error) {
        console.error("[authProvider] check error:", error);
      }
    }
    
    return {
      authenticated: authState.isAuthenticated,
      redirectTo: authState.isAuthenticated ? undefined : "/login",
    };
  },

  onError: async (error) => {
    console.log("[authProvider] onError called:", error);
    
    // Check for authentication errors
    if (error?.status === 401 || error?.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        error: {
          message: "Session expired",
          name: "Authentication Error",
          statusCode: error?.status ?? 401,
        },
      };
    }
    
    return { error };
  },

  getIdentity: async () => {
    console.log("[authProvider] getIdentity called");
    
    if (!authState.isAuthenticated) {
      return null;
    }

    return {
      id: authState.userId,
      email: authState.email,
      name: authState.name,
      role: authState.role,
    };
  },

  // Optional methods
  register: async ({ email, password, name }) => {
    console.log("[authProvider] register called with:", { email, name });
    
    if (!authActions) {
      return {
        success: false,
        error: {
          message: "Auth system not initialized",
          name: "Initialization Error",
        },
      };
    }

    try {
      const formData = new FormData();
      formData.append("email", email as string);
      formData.append("password", password as string);
      formData.append("name", name as string);
      formData.append("flow", "signUp");

      await authActions.signIn("password", formData);
      
      return { success: true, redirectTo: "/" };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Registration failed",
          name: "Registration Error",
        },
      };
    }
  },
};
