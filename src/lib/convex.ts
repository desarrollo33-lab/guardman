import { ConvexHttpClient } from 'convex/browser';
import { ConvexReactClient } from 'convex/react';

const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn(
    'PUBLIC_CONVEX_URL is not defined. Convex client will not work properly.'
  );
}

/**
 * Server-side Convex HTTP client for use in .astro pages (SSR).
 * Uses simple HTTP requests — no WebSocket, no subscriptions.
 */
export const convexServer = new ConvexHttpClient(convexUrl ?? '');

/**
 * Client-side Convex React client for use in React components with ConvexProvider.
 * Used by form components (ConvexLeadForm, ConvexContactForm, etc.)
 */
export const convex = new ConvexReactClient(convexUrl ?? '');

export { convexUrl };
