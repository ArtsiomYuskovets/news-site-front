export interface User {
  id: number
  username: string
  email: string
  role?: {
    id: number
    name: string
    type: string
  }
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

