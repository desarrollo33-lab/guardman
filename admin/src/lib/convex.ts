import { ConvexReactClient } from 'convex/react';

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.warn('VITE_CONVEX_URL is not set. Using placeholder.');
}

export const convexClient = new ConvexReactClient(
  convexUrl || 'https://placeholder.convex.cloud'
);
