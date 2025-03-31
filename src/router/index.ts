// import { createRouter, createWebHistory } from 'vue-router'
// import {
//   getLocale,
//   setI18nLanguage,
//   loadLocaleMessages,
//   SUPPORT_LOCALES
// } from '../i18n'
// import BillView from '../views/BillView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: BillView,
//       meta: {
//         title: 'Bill Calculator - Home',
//         description: 'Calculate and split your bills easily'
//       }
//     },
//     {
//       path: '/home2',
//       name: 'home2',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/HomeView.vue'),
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// // Update document title on route change
// router.beforeEach((to, from, next) => {
//   const paramsLocale = to.params.locale

//   console.log('paramsLocale', paramsLocale)

//   // Use default locale if paramsLocale is not in SUPPORT_LOCALES
//   // if (!SUPPORT_LOCALES.includes(paramsLocale)) {
//   //   return next(`/${i18n.global.locale.value}`)  // Use current locale value
//   // }

//   // load locale messages
//   // if (!i18n.global.availableLocales.includes(paramsLocale)) {
//   //   await loadLocaleMessages(i18n, paramsLocale)
//   // }

//   // set i18n language
//   // setI18nLanguage(i18n, paramsLocale)

//   document.title = to.meta.title as string || 'Bill Calculator'
//   next()
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router'
import {
  getLocale,
  setI18nLanguage,
  loadLocaleMessages,
  SUPPORT_LOCALES
} from '../i18n'
import type { RouteRecordRaw } from 'vue-router'
import { updateSeoMetadata } from '../utils/seoHelpers'
import type { I18n } from 'vue-i18n'

import BillView from '../views/BillView.vue'

export function setupRouter(i18n: I18n) {
  const locale = getLocale(i18n)

  const routes: RouteRecordRaw[] = [
    {
      path: '/:locale/',
      name: 'home',
      component: BillView,
      // meta: {
      //   title: 'Bill Calculator - Home',
      //   description: 'Calculate and split your bills easily'
      // }
    },
    {
      path: '/:locale/home2',
      name: 'home2',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/:locale/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => `/${locale}`
    }
  ]

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })

  // Navigation guards
  router.beforeEach(async (to) => {
    const paramsLocale = to.params.locale as string

    // Redirect to default locale if paramsLocale is not in SUPPORT_LOCALES
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return `/${locale}`
    }

    // Load locale messages if not already loaded
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale)
    }

    // Set i18n language
    setI18nLanguage(i18n, paramsLocale)
  })

  // Update document title on route change
  router.afterEach((to) => {
    const paramsLocale = to.params.locale as string
  
    // Use route meta data if provided, otherwise use defaults
    const customMetadata = to.meta.title || to.meta.description ? {
      title: to.meta.title as string,
      description: to.meta.description as string
    } : undefined
    
    updateSeoMetadata(i18n, paramsLocale, customMetadata)
  
  })

  return router
}