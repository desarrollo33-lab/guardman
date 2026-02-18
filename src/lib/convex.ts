import { ConvexHttpClient } from 'convex/browser';
import { ConvexReactClient } from 'convex/react';

/**
 * Robustly get the Convex URL from environment variables.
 * Prioritizes PUBLIC_ prefix for client safety but allows server-only fallback.
 */
const getConvexUrl = () => {
  const url = import.meta.env.PUBLIC_CONVEX_URL || import.meta.env.CONVEX_URL;
  if (!url) {
    console.error('CRITICAL: CONVEX_URL is not defined in any environment variable.');
  }
  return url || "";
};

const convexUrl = getConvexUrl();

/**
 * Server-side Convex HTTP client for use in .astro pages (SSR).
 * Safe against missing URLs to prevent 500 crashes on import.
 */
export const convexServer = convexUrl
  ? new ConvexHttpClient(convexUrl)
  : null;

/**
 * Client-side Convex React client for use in React components.
 * Uses a placeholder if the URL is missing to avoid constructor crash, 
 * but will fail with a clear message if used.
 */
export const convex = new ConvexReactClient(convexUrl || "https://placeholder-if-missing.convex.cloud");

export { convexUrl };
