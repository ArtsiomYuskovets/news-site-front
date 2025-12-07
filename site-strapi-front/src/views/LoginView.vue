<template>
  <AppLayout>
    <div class="container">
      <div class="auth-form-container">
        <h2 class="form-title">Вход</h2>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="identifier">Email или имя пользователя</label>
            <input
              id="identifier"
              v-model="form.identifier"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
            />
          </div>

          <div v-if="authStore.error" class="error-message">{{ authStore.error }}</div>

          <button type="submit" :disabled="authStore.isLoading" class="btn-submit">
            {{ authStore.isLoading ? 'Вход...' : 'Войти' }}
          </button>

          <p class="form-footer">
            Нет аккаунта?
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layouts/AppLayout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  identifier: '',
  password: '',
})

const handleSubmit = async () => {
  try {
    await authStore.login(form.value)
    console.log('[LoginView] Login successful, redirecting...')
    const redirect = (route.query.redirect as string) || '/'
    console.log('[LoginView] Redirect to:', redirect)
    await router.push(redirect)
    console.log('[LoginView] Redirected successfully')
  } catch (error) {
    console.error('[LoginView] Login error:', error)
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.auth-form-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.btn-submit {
  background: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0056b3;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.form-footer a {
  color: #007bff;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>






