/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/backoffice',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@org/yellow-card-shared': resolve(import.meta.dirname, '../../packages/yellow-card-shared/src/index.ts'),
      '@org/design-system': resolve(import.meta.dirname, '../../packages/design-system/src/index.tsx'),
    },
  },
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
