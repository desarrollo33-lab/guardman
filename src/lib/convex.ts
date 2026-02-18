import { ConvexHttpClient } from 'convex/browser';
import { ConvexReactClient } from 'convex/react';

/**
 * Robustly get the Convex URL from environment variables.
 */
const getConvexUrl = () => {
  // In Astro, import.meta.env is the way to access env vars
  const url = import.meta.env.PUBLIC_CONVEX_URL || import.meta.env.CONVEX_URL;
  return url || "";
};

export const convexUrl = getConvexUrl();

/**
 * Server-side Convex HTTP client.
 */
export const convexServer = convexUrl
  ? new ConvexHttpClient(convexUrl)
  : null;

/**
 * Lazy-initialized Client-side Convex React client.
 * This prevents the constructor from running during SSR module imports.
 */
let _convex: ConvexReactClient | null = null;

export const getConvexClient = () => {
  if (typeof window === 'undefined') {
    // Return a dummy client or handle SSR case if needed
    // ConvexReactClient can technically run on server, but we want to be safe
    if (!_convex) {
      _convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");
    }
  } else {
    if (!_convex) {
      _convex = new ConvexReactClient(convexUrl || window.location.origin);
    }
  }
  return _convex;
};

// For backward compatibility if needed, but discouraged for SSR safety
export const convex = typeof window !== 'undefined'
  ? new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud")
  : null as unknown as ConvexReactClient;
