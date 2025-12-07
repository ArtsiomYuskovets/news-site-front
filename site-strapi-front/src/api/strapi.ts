import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

export const strapiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor для добавления JWT токена
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

// Response interceptor для обработки ошибок
strapiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default strapiClient

