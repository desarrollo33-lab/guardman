import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://guardman.cl',
  integrations: [react(), tailwind(), sitemap()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  vite: {
    resolve: {
      alias: {
        '@convex': path.resolve(__dirname, '../convex'),
      },
    },
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        external: ['@resvg/resvg-js'],
      },
    },
    ssr: {
      external: ['@resvg/resvg-js'],
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
