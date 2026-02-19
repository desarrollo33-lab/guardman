import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test file patterns
    include: ['**/*.test.ts', '**/*.spec.ts'],

    // Exclude patterns
    exclude: ['node_modules', 'dist', '.astro', 'convex/_generated'],

    // TypeScript support
    globals: true,

    // Environment setup for Convex tests
    environment: 'node',

    // Pass even when no tests are found (useful for initial setup)
    passWithNoTests: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '.astro/**',
        'convex/_generated/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },

    // Timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,
  },

  // TypeScript configuration
  resolve: {
    alias: {
      // Allow imports like 'convex:' for internal Convex modules
    },
  },
});
