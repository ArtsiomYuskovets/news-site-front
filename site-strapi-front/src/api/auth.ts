import strapiClient from './strapi'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

export type { LoginCredentials, RegisterData }

export interface AuthResponse {
  jwt: string
  user: User
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await strapiClient.post<AuthResponse>('/api/auth/local', credentials)
      console.log('[Auth API] Login response:', data)
      console.log('[Auth API] Login user:', data.user)
      
      if (data.user && !data.user.role) {
        try {
          const jwtPayload = JSON.parse(atob(data.jwt.split('.')[1]))
          console.log('[Auth API] JWT payload:', jwtPayload)
          
          if (jwtPayload.id) {
            try {
              const me = await this.getMe()
              if (me.role) {
                data.user.role = me.role
                console.log('[Auth API] Fetched role from getMe:', me.role)
              }
            } catch (err: any) {
              console.warn('[Auth API] Could not fetch role from getMe, trying to get from user ID...')
              
              try {
                const userResponse = await strapiClient.get(`/api/users/${jwtPayload.id}?populate=role`)
                if (userResponse.data?.role) {
                  data.user.role = userResponse.data.role
                  console.log('[Auth API] Fetched role from user endpoint:', userResponse.data.role)
                }
              } catch (userErr: any) {
                console.warn('[Auth API] Could not fetch role from user endpoint:', userErr.message)
              }
            }
          }
        } catch (jwtErr: any) {
          console.warn('[Auth API] Could not parse JWT:', jwtErr.message)
        }
      }
      return data
    } catch (err: any) {
      console.error('[Auth API] Login error:', err)
      throw err
    }
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await strapiClient.post<AuthResponse>('/api/auth/local/register', registerData)
    if (data.user && !data.user.role) {
      try {
        const me = await this.getMe()
        data.user.role = me.role
      } catch (err: any) {
        console.warn('[Auth API] Could not fetch user role:', err.message)
      }
    }
    return data
  },

  async getMe(): Promise<User> {
    try {
      const { data } = await strapiClient.get<User>('/api/auth/me')
      console.log('[Auth API] User me response:', data)
      console.log('[Auth API] User role:', data.role)
      return data
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn('[Auth API] getMe forbidden - user may not have permissions')
        throw new Error('Forbidden: No permission to access user data')
      }
      throw err
    }
  },
}

