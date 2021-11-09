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
          includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
          manifest: {
              name: 'Name of your app',
              short_name: 'Short name of your app',
              description: 'Description of your app',
              theme_color: '#ffffff',
              icons: [
                  {
                      src: 'pwa-192x192.png',
                      sizes: '192x192',
                      type: 'image/png',
                  },
                  {
                      src: 'pwa-512x512.png',
                      sizes: '512x512',
                      type: 'image/png',
                  },
                  {
                      src: 'pwa-512x512.png',
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: 'any maskable',
                  }
              ]
          }
      })
  ],
    publicDir: 'public',
    base: '/',
    build: {
        outDir: 'dist',
        // minify: production,
    }
})
