import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./app.html', import.meta.url)),
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
      output: {
        manualChunks(id: string): string | undefined {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/three/')) return 'three';
          if (id.includes('/postprocessing/')) return 'postprocessing';
          if (id.includes('/katex/')) return 'katex';
          return undefined;
        },
      },
    },
  },
});
