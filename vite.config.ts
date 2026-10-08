import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
        '@designcodeio/threeui/style.css': path.resolve(import.meta.dirname, 'src/shaders/threeui.css'),
        '@designcodeio/threeui': path.resolve(import.meta.dirname, 'src/shaders/landing-pages/LandingPages.tsx'),
      },
    },
    optimizeDeps: {
      entries: ['index.html'],
    },
    build: {
      chunkSizeWarningLimit: 1200,
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('leaflet')) {
                return 'vendor-leaflet';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              return 'vendor-misc';
            }
            if (id.includes('/src/data/')) {
              return 'heritage-dataset';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
