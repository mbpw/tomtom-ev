import App from './App.svelte'

import {registerSW} from 'virtual:pwa-register'

const updateSW = registerSW({
    onOfflineReady() {
    },
})

const app = new App({
    target: document.getElementById('app')
})

export default app
