import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

export const strapiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

strapiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwt')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

strapiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      const isAuthEndpoint = url.includes('/api/auth/') || url.includes('/api/users/me')
      const isPublicEndpoint = url.includes('/api/articles') || url.includes('/api/categories')
      
      if (!isAuthEndpoint) {
        const jwt = localStorage.getItem('jwt')
        const currentPath = window.location.pathname
        
        console.log('[Strapi Client] 401 error details:', {
          url,
          isAuthEndpoint,
          hasJwt: !!jwt,
          currentPath,
        })
        
        if (jwt && currentPath !== '/login' && currentPath !== '/register') {
          console.warn('[Strapi Client] 401 on protected endpoint, will redirect after delay')
          
          setTimeout(() => {
            const stillOnPage = window.location.pathname !== '/login' && window.location.pathname !== '/register'
            if (stillOnPage) {
              console.warn('[Strapi Client] Redirecting to login...')
              localStorage.removeItem('jwt')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }
          }, 500)
        } else {
          console.log('[Strapi Client] 401 error ignored - no jwt or already on login/register')
        }
      } else {
        console.log('[Strapi Client] 401 error on auth endpoint - ignoring')
      }
    }
    return Promise.reject(error)
  }
)

export default strapiClient

