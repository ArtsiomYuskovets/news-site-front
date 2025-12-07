import type { User } from '@/types/user'

export const checkRole = (user: User | null, roleType: string): boolean => {
  if (!user || !user.role) return false
  return user.role.type === roleType || user.role.name === roleType
}

export const isEditor = (user: User | null): boolean => {
  return checkRole(user, 'editor') || checkRole(user, 'Editor')
}

export const isAuthenticated = (user: User | null): boolean => {
  return !!user
}






