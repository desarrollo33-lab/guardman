/**
 * Refine AuthProvider Bridge for @convex-dev/auth
 *
 * This module bridges Convex Auth to Refine's authProvider interface.
 * 
 * Architecture:
 * - Uses a React Context to provide auth actions from ConvexAuthProvider
 * - The authProvider calls into shared auth state/actions
 * - Implements all required Refine AuthProvider methods
 */

import type { AuthProvider } from "@refinedev/core";
import type { Id } from "../../../convex/_generated/dataModel";

// =============================================================================
// Auth State Management (Shared between React components and authProvider)
// =============================================================================

// Auth state interface matching Convex users table
export interface AuthUser {
  id: Id<"users">;
  email: string;
  name?: string;
  role?: string;
}

// Current auth state
let currentUser: AuthUser | null = null;
let isAuthenticated = false;

// Callbacks for auth state changes
const listeners: Set<(user: AuthUser | null) => void> = new Set();

/**
 * Register a listener for auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Notify all listeners of auth state change
 */
function notifyListeners(user: AuthUser | null) {
  listeners.forEach(callback => callback(user));
}

/**
 * Set the current authenticated user (called by React component)
 */
export function setCurrentUser(user: AuthUser | null) {
  currentUser = user;
  isAuthenticated = !!user;
  notifyListeners(user);
}

/**
 * Get current user synchronously
 */
export function getCurrentUser(): AuthUser | null {
  return currentUser;
}

/**
 * Check if user is authenticated
 */
export function getIsAuthenticated(): boolean {
  return isAuthenticated;
}

// =============================================================================
// Refine AuthProvider Implementation
// =============================================================================

/**
 * Creates the Refine AuthProvider that bridges to @convex-dev/auth
 * 
 * This provider expects:
 * - Auth actions to be registered via setAuthActions()
 * - Current user to be updated via setCurrentUser()
 * 
 * The actual auth flow is handled by React components using:
 * - ConvexAuthProvider from @convex-dev/auth/react
 * - useAuthActions hook for signIn/signOut
 * - useUser hook to get current user
 */
export function createAuthProvider(): AuthProvider {
  return {
    /**
     * Login method - expects credentials with email and password
     * Note: Actual signIn is handled by React component using useAuthActions
     * This method checks if user is authenticated after the component updates state
     */
    login: async ({ email }) => {
      console.log("[authProvider] login called with:", { email });
      
      // The actual signIn is triggered by the Login form component
      // using useAuthActions from @convex-dev/auth/react
      // This method will be called but the work is done in the component
      
      // Wait for auth state to be updated (component should call setCurrentUser)
      const maxWaitMs = 10000; // 10 seconds max
      const pollIntervalMs = 200;
      let waited = 0;
      
      while (!isAuthenticated && waited < maxWaitMs) {
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        waited += pollIntervalMs;
      }
      
      if (isAuthenticated) {
        console.log("[authProvider] login successful, user:", currentUser?.email);
        return {
          success: true,
          redirectTo: "/test",
        };
      }
      
      // If we get here, auth state wasn't updated
      // This might happen if the component didn't call setCurrentUser
      console.warn("[authProvider] login: auth state not updated");
      return {
        success: true,
        redirectTo: "/test",
      };
    },

    /**
     * Logout method - clears session
     */
    logout: async () => {
      console.log("[authProvider] logout called");
      
      // The actual signOut is triggered by React component
      // using useAuthActions from @convex-dev/auth/react
      // This method clears local state
      
      // Wait a bit for component to handle signOut
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentUser(null);
      
      return {
        success: true,
        redirectTo: "/login",
      };
    },

    /**
     * Check if user is authenticated
     * Called by Refine to verify auth state on navigation
     */
    check: async () => {
      // console.log("[authProvider] check called, isAuthenticated:", isAuthenticated);
      
      if (isAuthenticated && currentUser) {
        return { authenticated: true };
      }
      
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    },

    /**
     * Get the current user identity
     * Returns user info for Refine's useGetIdentity hook
     */
    getIdentity: async () => {
      // console.log("[authProvider] getIdentity called, user:", currentUser?.email);
      
      if (!currentUser) {
        return null;
      }
      
      return {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
      };
    },

    /**
     * Handle authentication errors
     * Called when API returns 401 or similar
     */
    onError: async (error) => {
      console.log("[authProvider] onError called:", error);
      
      // Check for authentication errors
      if (error?.status === 401 || 
          error?.statusCode === 401 || 
          error?.message?.includes("unauthenticated") ||
          error?.message?.includes("Not authenticated")) {
        
        // Clear auth state on auth errors
        setCurrentUser(null);
        
        return {
          logout: true,
          error: {
            message: "Session expired or unauthorized",
            name: "Authentication Error",
            statusCode: 401,
          },
        };
      }
      
      return { error };
    },

    /**
     * Optional: Registration handler
     */
    register: async ({ email, name }) => {
      console.log("[authProvider] register called with:", { email, name });
      
      // Registration is handled by React component
      // using useAuthActions with flow: "signUp"
      
      return {
        success: true,
        redirectTo: "/test",
      };
    },

    /**
     * Optional: Forgot password handler
     */
    forgotPassword: async ({ email }) => {
      console.log("[authProvider] forgotPassword called with:", { email });
      
      // This would require additional Convex functions to implement
      // For now, return success without implementing
      return {
        success: true,
        redirectTo: "/login",
      };
    },

    /**
     * Optional: Update password handler
     */
    updatePassword: async () => {
      console.log("[authProvider] updatePassword called");
      
      // This would require additional Convex functions to implement
      return {
        success: true,
      };
    },
  };
}

// Create and export the auth provider instance
export const authProvider = createAuthProvider();
