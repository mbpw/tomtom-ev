import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        // TODO: Configure PWA with these documentation https://vite-plugin-pwa.netlify.app/guide/generate.html
        VitePWA({})
    ],
    publicDir: 'public',
    base: '',
    build: {
        outDir: 'dist',
        // minify: production,
    }
})
