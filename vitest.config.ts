// @ts-check
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const fromHere = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    // node env is enough; tests provide their own localStorage shim.
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/icons.ts', 'src/lib/mocks.ts', 'src/lib/content.ts'],
    },
  },
  resolve: {
    alias: {
      '@': fromHere('./src'),
      // Módulos virtuales que solo existen dentro del runtime de Astro/Workers.
      // Sin estos alias, `src/middleware.ts` no se puede importar desde vitest
      // y el guard de host canónico queda sin cobertura real.
      'astro:middleware': fromHere('./tests/stubs/astro-middleware.ts'),
      'cloudflare:workers': fromHere('./tests/stubs/cloudflare-workers.ts'),
    },
  },
});
