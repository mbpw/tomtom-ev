import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from 'vite-plugin-pwa'
import sveltePreprocess from 'svelte-preprocess';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      svelte({
          preprocess: sveltePreprocess({
              scss: {
                  prependData: `@import './src/styles.scss';`
              }
          }),
      }),
      VitePWA({
          mode: 'development',
          base: '/',
          includeAssets: ['favicon.svg'],
          manifest: {
              name: 'PWA Basic',
              short_name: 'PWA Basic',
              theme_color: '#ffffff',
              icons: [
                  {
                      src: 'pwa-192x192.png', // <== don't add slash, for testing
                      sizes: '192x192',
                      type: 'image/png',
                  },
                  {
                      src: '/pwa-512x512.png', // <== don't remove slash, for testing
                      sizes: '512x512',
                      type: 'image/png',
                  },
                  {
                      src: 'pwa-512x512.png', // <== don't add slash, for testing
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: 'any maskable',
                  },
              ],
          },
      }),
  ],
    publicDir: 'public',
    base: '/',
    build: {
        outDir: 'dist',
        // minify: production,
    }
})
