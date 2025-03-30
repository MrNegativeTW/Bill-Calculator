import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import { setupRouter } from './router'

import { setupI18n } from './i18n'
import en from './locales/en.json'
import zhHant from './locales/zhHant.json'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

const i18n = setupI18n({
  locale: navigator.language.split('-')[0],
  fallbackLocale: 'en',
  messages: {
    en, // English
    zhHant // Traditional Chinese
  },
})

const router = setupRouter(i18n)

const app = createApp(App)

app.use(i18n)

app.use(router)

app.use(vuetify)

app.mount('#app')
