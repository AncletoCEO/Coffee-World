import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.js'],
    exclude: ['angular-app/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['js/**/*.js'],
      exclude: ['js/**/*.test.js', 'js/game.js', 'angular-app/**'],
    },
  },
});
