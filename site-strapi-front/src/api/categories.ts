import strapiClient from './strapi'
import type { Category, CategoryListResponse } from '@/types/category'

export const categoriesApi = {
  async getCategories(): Promise<CategoryListResponse> {
    const { data } = await strapiClient.get<CategoryListResponse>('/api/categories?populate=*')
    return data
  },
}






