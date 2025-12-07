import type { Category } from './category'
import type { User } from './user'

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  publishedAt: string | null
  views: number
  isFeatured: boolean
  readingTime: number
  tags: string[]
  coverImage?: {
    id: number
    url: string
    alternativeText?: string
  }
  category?: Category
  author?: User
  createdAt: string
  updatedAt: string
}

export interface ArticleListResponse {
  data: Article[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface ArticleFilters {
  populate?: string[]
  filters?: {
    category?: {
      slug?: {
        $eq?: string
      }
    }
    isFeatured?: {
      $eq?: boolean
    }
    tags?: {
      $contains?: string
    }
  }
  sort?: string
  pagination?: {
    page?: number
    pageSize?: number
  }
}






