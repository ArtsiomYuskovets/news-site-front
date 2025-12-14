import strapiClient from './strapi'
import axios from 'axios'
import type { Article, ArticleListResponse, ArticleFilters } from '@/types/article'

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

export const articlesApi = {
  async getArticles(params?: ArticleFilters): Promise<ArticleListResponse> {
    const queryParams = new URLSearchParams()

    if (params?.populate) {
      queryParams.append('populate', params.populate.join(','))
    }

    if (params?.filters) {
      if (params.filters.category?.slug?.$eq) {
        queryParams.append('filters[category][slug][$eq]', params.filters.category.slug.$eq)
      }
      if (params.filters.isFeatured?.$eq !== undefined) {
        queryParams.append('filters[isFeatured][$eq]', String(params.filters.isFeatured.$eq))
      }
      if (params.filters.tags?.$contains) {
        queryParams.append('filters[tags][$contains]', params.filters.tags.$contains)
      }
    }

    if (params?.sort) {
      queryParams.append('sort', params.sort)
    }

    if (params?.pagination) {
      if (params.pagination.page) {
        queryParams.append('pagination[page]', String(params.pagination.page))
      }
      if (params.pagination.pageSize) {
        queryParams.append('pagination[pageSize]', String(params.pagination.pageSize))
      }
    }

    const { data } = await strapiClient.get<ArticleListResponse>(
      `/api/articles?${queryParams.toString()}`
    )
    console.log('[Articles API] Raw response:', data)
    console.log('[Articles API] Response data:', data.data)
    console.log('[Articles API] First article:', data.data?.[0])
    console.log('[Articles API] First article author:', data.data?.[0]?.author)
    return data
  },

  async getArticle(id: string | number): Promise<Article> {
    const { data } = await strapiClient.get<{ data: Article }>(
      `/api/articles/${id}?populate=category,author,coverImage`
    )
    return data.data
  },

  async getFeaturedArticles(): Promise<ArticleListResponse> {
    const { data } = await strapiClient.get<ArticleListResponse>(
      '/api/articles/featured?populate=category,author,coverImage'
    )
    return data
  },

  async createArticle(articleData: Partial<Article>): Promise<Article> {
    const { data } = await strapiClient.post<{ data: Article }>('/api/articles', {
      data: articleData,
    })
    return data.data
  },

  async updateArticle(id: string | number, articleData: Partial<Article>): Promise<Article> {
    const { data } = await strapiClient.put<{ data: Article }>(`/api/articles/${id}`, {
      data: articleData,
    })
    return data.data
  },

  async deleteArticle(id: string | number): Promise<void> {
    await strapiClient.delete(`/api/articles/${id}`)
  },

  async publishArticle(id: string | number): Promise<Article> {
    const { data } = await strapiClient.post<{ data: Article }>(`/api/articles/${id}/publish`)
    return data.data
  },

  async incrementViews(id: string | number): Promise<{ views: number }> {
    const { data } = await axios.post<{ views: number }>(
      `${API_URL}/api/articles/${id}/view`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return data
  },
}

