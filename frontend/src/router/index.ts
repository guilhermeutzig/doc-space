import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('@/views/SignIn.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.accessToken

  if (to.path === '/') return next({ name: 'dashboard' })

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      name: 'signin',
      query: { redirect: to.fullPath },
    })
  }

  next()
})

export default router
