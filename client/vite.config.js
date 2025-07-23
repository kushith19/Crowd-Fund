import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  const { viteStaticCopy } = await import('vite-plugin-static-copy');

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'public/_redirects',
            dest: '.', // copies to dist/ root
          }
        ]
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
