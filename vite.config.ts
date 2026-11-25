import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
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
