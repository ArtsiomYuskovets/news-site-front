import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articlesApi } from '@/api/articles'
import type { Article, ArticleFilters } from '@/types/article'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  })

  const fetchArticles = async (filters?: ArticleFilters) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('[Articles Store] Fetching articles with filters:', filters)
      const response = await articlesApi.getArticles(filters)
      console.log('[Articles Store] API Response:', response)
      console.log('[Articles Store] Articles count:', response.data?.length || 0)
      console.log('[Articles Store] First article:', response.data?.[0])
      console.log('[Articles Store] First article author:', response.data?.[0]?.author)
      articles.value = response.data || []
      
      const pageSize = filters?.pagination?.pageSize || 10
      const currentPage = filters?.pagination?.page || 1
      
      if (response.meta?.pagination) {
        pagination.value = {
          page: response.meta.pagination.page || currentPage,
          pageSize: response.meta.pagination.pageSize || pageSize,
          pageCount: response.meta.pagination.pageCount || 0,
          total: response.meta.pagination.total || 0,
        }
      } else {
        const articlesCount = response.data?.length || 0
        const hasMore = articlesCount === pageSize && currentPage === 1
        
        pagination.value = {
          page: currentPage,
          pageSize: pageSize,
          pageCount: articlesCount > 0 ? (hasMore ? 2 : currentPage) : 1,
          total: articlesCount,
        }
      }
    } catch (err: any) {
      console.error('[Articles Store] Error fetching articles:', err)
      console.error('[Articles Store] Error response:', err.response?.data)
      error.value = err.response?.data?.error?.message || 'Ошибка загрузки статей'
      
      if (err.response?.status === 401) {
        console.warn('[Articles Store] 401 error - user may not be authenticated or lacks permissions')
      }
      
      if (!pagination.value) {
        pagination.value = {
          page: 1,
          pageSize: 10,
          pageCount: 0,
          total: 0,
        }
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchArticle = async (id: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const article = await articlesApi.getArticle(id)
      currentArticle.value = article
      return article
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка загрузки статьи'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedArticles = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await articlesApi.getFeaturedArticles()
      articles.value = response.data
      if (response.meta?.pagination) {
        pagination.value = {
          page: response.meta.pagination.page || 1,
          pageSize: response.meta.pagination.pageSize || 10,
          pageCount: response.meta.pagination.pageCount || 0,
          total: response.meta.pagination.total || 0,
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка загрузки избранных статей'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createArticle = async (articleData: Partial<Article>) => {
    isLoading.value = true
    error.value = null

    try {
      const article = await articlesApi.createArticle(articleData)
      articles.value.unshift(article)
      return article
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка создания статьи'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateArticle = async (id: string | number, articleData: Partial<Article>) => {
    isLoading.value = true
    error.value = null

    try {
      const article = await articlesApi.updateArticle(id, articleData)
      const index = articles.value.findIndex((a) => a.id === Number(id))
      if (index !== -1) {
        articles.value[index] = article
      }
      if (currentArticle.value?.id === Number(id)) {
        currentArticle.value = article
      }
      return article
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка обновления статьи'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteArticle = async (id: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      await articlesApi.deleteArticle(id)
      articles.value = articles.value.filter((a) => a.id !== Number(id))
      if (currentArticle.value?.id === Number(id)) {
        currentArticle.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка удаления статьи'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const publishArticle = async (id: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const article = await articlesApi.publishArticle(id)
      
      const articleId = Number(id)
      
      const index = articles.value.findIndex((a) => a.id === articleId)
      if (index !== -1) {
        articles.value[index] = { ...articles.value[index], ...article }
      }
      
      if (currentArticle.value?.id === articleId) {
        currentArticle.value = { ...currentArticle.value, ...article }
      }
      
      return article
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Ошибка публикации статьи'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentArticle = () => {
    currentArticle.value = null
  }

  return {
    articles,
    currentArticle,
    isLoading,
    error,
    pagination,
    fetchArticles,
    fetchArticle,
    fetchFeaturedArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    clearCurrentArticle,
  }
})
