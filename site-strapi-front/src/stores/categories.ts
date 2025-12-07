import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesApi } from '@/api/categories'
import type { Category } from '@/types/category'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log('[Categories Store] Fetching categories...')
      const response = await categoriesApi.getCategories()
      console.log('[Categories Store] Categories fetched:', response.data?.length || 0)
      categories.value = response.data
    } catch (err: any) {
      console.error('[Categories Store] Error fetching categories:', err)
      console.error('[Categories Store] Error response:', err.response?.data)
      error.value = err.response?.data?.error?.message || 'Ошибка загрузки категорий'
      
      if (err.response?.status === 401) {
        console.warn('[Categories Store] 401 error - user may not be authenticated or lacks permissions')
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  }
})






