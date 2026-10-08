import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['angular-app/src/app/game-engine/*.spec.ts'],
    exclude: ['angular-app/node_modules/**', 'node_modules/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      all: true,
      include: [
        'angular-app/src/app/game-engine/game-engine.ts',
        'angular-app/src/app/game-engine/content.ts',
        'angular-app/src/app/game-engine/commands.ts'
      ],
      exclude: ['**/*.spec.ts'],
    },
  },
});
