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
      const response = await categoriesApi.getCategories()
      categories.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка загрузки категорий'
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






