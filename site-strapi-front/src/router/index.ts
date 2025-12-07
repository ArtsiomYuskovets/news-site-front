import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: () => import('@/views/ArticleDetailView.vue'),
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/article/create',
      name: 'article-create',
      component: () => import('@/views/ArticleEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/article/:id/edit',
      name: 'article-edit',
      component: () => import('@/views/ArticleEditView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.initAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
