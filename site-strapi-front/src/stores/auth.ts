import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User } from '@/types/user'
import type { LoginCredentials, RegisterData } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const jwt = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!jwt.value && !!user.value)

  const isEditor = computed(() => {
    return user.value?.role?.type === 'editor' || user.value?.role?.name === 'Editor'
  })

  const initAuth = () => {
    const storedJwt = localStorage.getItem('jwt')
    const storedUser = localStorage.getItem('user')

    if (storedJwt && storedUser) {
      jwt.value = storedJwt
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)
      jwt.value = response.jwt
      user.value = response.user

      localStorage.setItem('jwt', response.jwt)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка входа'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (registerData: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.register(registerData)
      jwt.value = response.jwt
      user.value = response.user

      localStorage.setItem('jwt', response.jwt)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    jwt.value = null
    user.value = null
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
  }

  const fetchMe = async () => {
    try {
      const me = await authApi.getMe()
      user.value = me
      localStorage.setItem('user', JSON.stringify(me))
    } catch (err) {
      logout()
      throw err
    }
  }

  return {
    user,
    jwt,
    isLoading,
    error,
    isAuthenticated,
    isEditor,
    initAuth,
    login,
    register,
    logout,
    fetchMe,
  }
})

