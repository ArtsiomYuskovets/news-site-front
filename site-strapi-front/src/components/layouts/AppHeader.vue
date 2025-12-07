<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <RouterLink to="/" class="logo">
          <h1>Новостной сайт</h1>
        </RouterLink>

        <nav class="nav">
          <RouterLink to="/" class="nav-link">Главная</RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/article/create" class="nav-link">
              Создать статью
            </RouterLink>
            <span class="user-info">{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="btn-logout">Выйти</button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="nav-link">Вход</RouterLink>
            <RouterLink to="/register" class="nav-link">Регистрация</RouterLink>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #007bff;
}

.nav-link.router-link-active {
  color: #007bff;
}

.user-info {
  color: #666;
  font-size: 0.9rem;
}

.btn-logout {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #c82333;
}
</style>





