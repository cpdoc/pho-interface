import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createMetaManager } from 'vue-meta'
import store from './store/'

// Load naive-ui styles before tailwindcss
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)

app.use(router).use(store).use(createMetaManager()).mount('#app')
