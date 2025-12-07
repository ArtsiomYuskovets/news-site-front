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

  const initAuth = async () => {
    const storedJwt = localStorage.getItem('jwt')
    const storedUser = localStorage.getItem('user')

    if (storedJwt && storedUser) {
      jwt.value = storedJwt
      try {
        user.value = JSON.parse(storedUser)
        if (!user.value?.role) {
          try {
            await fetchMe()
          } catch (err: any) {
            console.warn('[Auth Store] Could not fetch user role in initAuth:', err.message)
          }
        }
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
      console.log('[Auth Store] Starting login...')
      const response = await authApi.login(credentials)
      console.log('[Auth Store] Login API response received')
      
      jwt.value = response.jwt
      user.value = response.user

      localStorage.setItem('jwt', response.jwt)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      console.log('[Auth Store] JWT and user saved to localStorage')
      console.log('[Auth Store] Login - User:', user.value)
      console.log('[Auth Store] Login - User role:', user.value?.role)
      console.log('[Auth Store] Login - Is Editor:', isEditor.value)

      if (!user.value?.role) {
        console.warn('[Auth Store] User role not found, attempting to fetch...')
        try {
          await fetchMe()
          console.log('[Auth Store] Successfully fetched user role after login')
        } catch (err: any) {
          console.warn('[Auth Store] Could not fetch user role after login:', err.message)
          console.warn('[Auth Store] User will continue without role - check Strapi Admin permissions')
        }
      }

      console.log('[Auth Store] Login completed successfully')
      return response
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка входа'
      console.error('[Auth Store] Login error:', err)
      console.error('[Auth Store] Login error response:', err.response?.data)
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
      console.log('[Auth Store] FetchMe - User:', user.value)
      console.log('[Auth Store] FetchMe - User role:', user.value?.role)
      console.log('[Auth Store] FetchMe - Is Editor:', isEditor.value)
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

