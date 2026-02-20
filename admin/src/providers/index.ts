/**
 * Auth Provider Index
 * 
 * Exports all auth-related components and utilities for easy importing.
 */

export { authProvider, createAuthProvider, setCurrentUser, onAuthStateChange } from "./authProvider";
export type { AuthUser } from "./authProvider";

export { ConvexAuthProviderWrapper, convexSignIn, convexSignOut } from "./ConvexAuthProvider";
