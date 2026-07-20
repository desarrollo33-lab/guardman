// GuardMan Astro 6 — Configuración para Cloudflare WORKERS (no Pages).
// El adapter @astrojs/cloudflare v13 siempre opera en advanced mode (Workers).
// Los assets estáticos se sirven vía el binding `ASSETS` (Workers Static Assets).

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://guardman.cl';

export default defineConfig({
  site: SITE_URL,
  output: 'server',
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: { external: ['node:fs', 'node:path'] },
  },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  devToolbar: { enabled: false },
  // Inline Astro-bundled CSS en el HTML — elimina 2 round-trips de la cadena crítica.
  // Trade-off: HTML crece ~20KB; con gzip es ~5KB. En mobile 4G, ahorra ~300-500ms.
  build: { inlineStylesheets: 'always' },
  // prefetch on hover reduces initial page weight and idle network usage.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
