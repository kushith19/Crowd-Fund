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
          target: 'https://funddaddy-backend.onrender.com',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
