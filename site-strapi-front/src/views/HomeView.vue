<template>
  <AppLayout>
    <div class="container">
      <div class="filters-section">
        <CategoryFilter
          :categories="categoriesStore.categories"
          :selected-category="selectedCategory"
          @category-change="handleCategoryChange"
        />

        <div class="sort-section">
          <label>
            <input
              type="checkbox"
              :checked="showFeaturedOnly"
              @change="handleFeaturedToggle"
            />
            Только избранные
          </label>

          <select :value="sortBy" @change="handleSortChange" class="sort-select">
            <option value="publishedAt:desc">Сначала новые</option>
            <option value="publishedAt:asc">Сначала старые</option>
            <option value="views:desc">По популярности</option>
          </select>
        </div>
      </div>

      <LoadingSpinner v-if="articlesStore.isLoading" message="Загрузка статей..." />

      <div v-else-if="articlesStore.articles.length" class="articles-grid">
        <ArticleCard
          v-for="article in articlesStore.articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <div v-else class="empty-state">
        <p>Статей не найдено</p>
      </div>

      <Pagination
        v-if="articlesStore.articles.length && articlesStore.pagination"
        :current-page="articlesStore.pagination.page || 1"
        :total-pages="articlesStore.pagination.pageCount || 0"
        :total="articlesStore.pagination.total || 0"
        @page-change="handlePageChange"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useArticlesStore } from '@/stores/articles'
import { useCategoriesStore } from '@/stores/categories'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ArticleCard from '@/components/articles/ArticleCard.vue'
import CategoryFilter from '@/components/articles/CategoryFilter.vue'
import Pagination from '@/components/articles/Pagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const articlesStore = useArticlesStore()
const categoriesStore = useCategoriesStore()

const selectedCategory = ref('')
const showFeaturedOnly = ref(false)
const sortBy = ref('publishedAt:desc')

const loadArticles = async () => {
  const filters: any = {
    populate: ['category', 'author', 'coverImage'],
    sort: sortBy.value,
    pagination: {
      page: articlesStore.pagination.value?.page || 1,
      pageSize: 10,
    },
  }

  if (selectedCategory.value) {
    filters.filters = {
      category: {
        slug: {
          $eq: selectedCategory.value,
        },
      },
    }
  }

  if (showFeaturedOnly.value) {
    if (!filters.filters) filters.filters = {}
    filters.filters.isFeatured = { $eq: true }
  }

  await articlesStore.fetchArticles(filters)
}

const handleCategoryChange = (slug: string) => {
  selectedCategory.value = slug
  if (articlesStore.pagination.value) {
    articlesStore.pagination.value.page = 1
  }
  loadArticles()
}

const handleFeaturedToggle = (event: Event) => {
  showFeaturedOnly.value = (event.target as HTMLInputElement).checked
  if (articlesStore.pagination.value) {
    articlesStore.pagination.value.page = 1
  }
  loadArticles()
}

const handleSortChange = (event: Event) => {
  sortBy.value = (event.target as HTMLSelectElement).value
  loadArticles()
}

const handlePageChange = (page: number) => {
  if (articlesStore.pagination.value) {
    articlesStore.pagination.value.page = page
  }
  loadArticles()
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
  await loadArticles()
})

watch([selectedCategory, showFeaturedOnly, sortBy], () => {
  if (articlesStore.pagination.value) {
    articlesStore.pagination.value.page = 1
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>




