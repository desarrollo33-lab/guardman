import { ConvexReactClient } from 'convex/react';

/**
 * Robustly get the Convex URL from environment variables.
 */
const getConvexUrl = (): string => {
  // In Astro, import.meta.env is the way to access env vars
  const url = import.meta.env.PUBLIC_CONVEX_URL || import.meta.env.CONVEX_URL;
  return url || 'https://guardman-100dd.oficina-desarrollo-33.convex.cloud';
};

export const convexUrl = getConvexUrl();

/**
 * Server-side Convex HTTP client factory.
 * Uses dynamic import to avoid SSR issues with static imports.
 * This function should be called in Astro frontmatter.
 */
export async function getConvexServer() {
  try {
    const { ConvexHttpClient } = await import('convex/browser');
    return new ConvexHttpClient(convexUrl);
  } catch (e) {
    console.error('Failed to load Convex client:', e);
    return null;
  }
}

/**
 * Synchronous Convex HTTP client for cases where async is not needed.
 * Prefer getConvexServer() for safer SSR handling.
 * @deprecated Use getConvexServer() for better SSR compatibility
 */
export async function getConvexServerSync() {
  const { ConvexHttpClient } = await import('convex/browser');
  return new ConvexHttpClient(convexUrl);
}

/**
 * Global singleton for the Convex React client.
 * We attach it to window to ensure it's shared across all Astro islands.
 */
declare global {
  interface Window {
    __GUARDMAN_CONVEX_CLIENT__?: ConvexReactClient;
  }
}

/**
 * Get or create the shared Convex React client.
 * Uses window to persist the client across Astro islands.
 */
export const getConvexClient = (): ConvexReactClient => {
  // On server, create a new client (SSR)
  if (typeof window === 'undefined') {
    return new ConvexReactClient(
      convexUrl || 'https://placeholder.convex.cloud'
    );
  }

  // On client, use the shared instance from window
  if (!window.__GUARDMAN_CONVEX_CLIENT__) {
    if (!convexUrl) {
      console.error('PUBLIC_CONVEX_URL is not set!');
    }
    window.__GUARDMAN_CONVEX_CLIENT__ = new ConvexReactClient(
      convexUrl || 'https://placeholder.convex.cloud'
    );
  }

  return window.__GUARDMAN_CONVEX_CLIENT__;
};

// For backward compatibility if needed, but discouraged for SSR safety
export const convex =
  typeof window !== 'undefined'
    ? getConvexClient()
    : (null as unknown as ConvexReactClient);
