import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest', // Use the 'injectManifest' strategy for custom service worker
      injectManifest: {
        swSrc: 'public/sw.js', // Path to your custom service worker file
      },
      manifest: {
        name: 'PDF PWA Signer',
        short_name: 'PDFSigner',
        description: 'A PWA to sign PDFs digitally',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
