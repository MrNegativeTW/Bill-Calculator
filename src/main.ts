import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import { setupRouter } from './router'

import { setupI18n, SUPPORT_LOCALES } from './i18n'
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

const getUserLanguage = () => {
  // Get browser language (e.g., 'en-US', 'zh-TW')
  const browserLang = navigator.language
  
  // Get the base language code (e.g., 'en', 'zh')
  const baseLanguage = browserLang.split('-')[0]
  
  // Check if we directly support this language
  if (SUPPORT_LOCALES.includes(baseLanguage)) {
    return baseLanguage
  }
  
  // For Chinese, check if we should use Traditional Chinese
  if (baseLanguage === 'zh') {
    // If browser specifies TW, HK or MO, use Traditional Chinese
    if (['zh-TW', 'zh-HK', 'zh-MO'].includes(browserLang)) {
      return 'zhHant'
    } else {
      // If browser specifies CN, SG or any other Chinese variant, use Simplified Chinese
      return 'zhHans'
    }
  }
  
  // Default to English if no match
  return 'en'
}

const i18n = setupI18n({
  // locale: navigator.language.split('-')[0],
  locale: getUserLanguage(),
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
