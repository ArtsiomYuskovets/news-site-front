import strapiClient from './strapi'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

export type { LoginCredentials, RegisterData }

export interface AuthResponse {
  jwt: string
  user: User
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await strapiClient.post<AuthResponse>('/api/auth/local', credentials)
    return data
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await strapiClient.post<AuthResponse>('/api/auth/local/register', registerData)
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await strapiClient.get<User>('/api/users/me')
    return data
  },
}

