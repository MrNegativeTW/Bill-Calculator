import { createRouter, createWebHistory } from 'vue-router'
import BillView from '../views/BillView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BillView,
      meta: {
        title: 'Bill Calculator - Home',
        description: 'Calculate and split your bills easily'
      }
    },
    {
      path: '/home2',
      name: 'home2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'Bill Calculator'
  next()
})

export default router
