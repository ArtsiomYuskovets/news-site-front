export interface Category {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CategoryListResponse {
  data: Category[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}






