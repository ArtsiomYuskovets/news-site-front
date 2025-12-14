<template>
  <AppLayout>
    <div class="container">
      <LoadingSpinner v-if="articlesStore.isLoading" message="Загрузка статьи..." />

      <article v-else-if="articlesStore.currentArticle" class="article-detail">
        <div v-if="articlesStore.currentArticle.coverImage" class="article-cover">
          <img
            :src="getImageUrl(articlesStore.currentArticle.coverImage.url)"
            :alt="articlesStore.currentArticle.coverImage.alternativeText"
          />
        </div>

        <div class="article-header">
          <div class="article-meta">
            <span v-if="articlesStore.currentArticle.category" class="category">
              {{ articlesStore.currentArticle.category.name }}
            </span>
            <span v-if="articlesStore.currentArticle.publishedAt" class="date">
              {{ formatDate(articlesStore.currentArticle.publishedAt) }}
            </span>
            <span v-if="articlesStore.currentArticle.readingTime" class="reading-time">
              {{ articlesStore.currentArticle.readingTime }} мин чтения
            </span>
            <span v-if="articlesStore.currentArticle.views" class="views">
              Просмотров: {{ articlesStore.currentArticle.views }}
            </span>
          </div>

          <h1 class="article-title">{{ articlesStore.currentArticle.title }}</h1>

          <div v-if="articlesStore.currentArticle.author" class="article-author">
            Автор: {{ articlesStore.currentArticle.author.username }}
          </div>

          <div v-if="articlesStore.currentArticle.tags?.length" class="tags">
            <span v-for="tag in articlesStore.currentArticle.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="article-content" v-html="articlesStore.currentArticle.content"></div>

        <div class="article-actions">
          <RouterLink to="/" class="btn-back">← Назад к списку</RouterLink>

          <div v-if="canEdit || authStore.isEditor" class="editor-actions">
            <div v-if="authStore.isEditor" class="publish-status">
              <span v-if="isPublished" class="status-badge published">Опубликована</span>
              <span v-else class="status-badge draft">Черновик</span>
              <button
                v-if="!isPublished"
                @click="handlePublish"
                :disabled="articlesStore.isLoading"
                class="btn-publish"
              >
                {{ articlesStore.isLoading ? 'Публикация...' : 'Опубликовать' }}
              </button>
            </div>
            <div v-if="canEdit" class="edit-actions">
              <RouterLink
                :to="`/article/${articlesStore.currentArticle.id}/edit`"
                class="btn-edit"
              >
                Редактировать
              </RouterLink>
              <button @click="showDeleteDialog = true" class="btn-delete">Удалить</button>
            </div>
          </div>
        </div>
      </article>

      <div v-else class="error-state">
        <p>Статья не найдена</p>
        <RouterLink to="/" class="btn-back">Вернуться на главную</RouterLink>
      </div>

      <ConfirmDialog
        :show="showDeleteDialog"
        title="Удаление статьи"
        message="Вы уверены, что хотите удалить эту статью? Это действие нельзя отменить."
        confirm-text="Удалить"
        @confirm="handleDelete"
        @cancel="showDeleteDialog = false"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useArticlesStore } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layouts/AppLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

const showDeleteDialog = ref(false)

const canEdit = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user || !articlesStore.currentArticle) return false
  
  if (authStore.isEditor) return true
  
  if (!articlesStore.currentArticle.author) return false
  
  let authorId: number
  if (articlesStore.currentArticle.author.id && typeof articlesStore.currentArticle.author.id === 'object') {
    authorId = Number((articlesStore.currentArticle.author.id as any).id || Object.values(articlesStore.currentArticle.author.id)[0])
  } else {
    authorId = Number(articlesStore.currentArticle.author.id)
  }
  
  const userId = Number(authStore.user.id)
  
  return authorId === userId
})

const isPublished = computed(() => {
  const publishedAt = articlesStore.currentArticle?.publishedAt
  return publishedAt !== null && publishedAt !== undefined && publishedAt !== ''
})

const handlePublish = async () => {
  if (!articlesStore.currentArticle) return
  
  try {
    const publishedArticle = await articlesStore.publishArticle(articlesStore.currentArticle.id)
    if (publishedArticle) {
      articlesStore.currentArticle = publishedArticle
    }
  } catch (error) {
    console.error('Ошибка публикации статьи:', error)
  }
}

const getImageUrl = (url: string): string => {
  if (url.startsWith('http')) return url
  return `http://localhost:1337${url}`
}

const handleDelete = async () => {
  try {
    await articlesStore.deleteArticle(route.params.id as string)
    showDeleteDialog.value = false
    router.push('/')
  } catch (error) {
    console.error('Ошибка удаления статьи:', error)
  }
}

onMounted(async () => {
  await articlesStore.fetchArticle(route.params.id as string)
  // Увеличиваем просмотры при открытии статьи
  if (articlesStore.currentArticle) {
    await articlesStore.incrementViews(route.params.id as string)
  }
})

onUnmounted(() => {
  articlesStore.clearCurrentArticle()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.article-detail {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: #f0f0f0;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-header {
  padding: 2rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
  flex-wrap: wrap;
}

.category {
  color: #007bff;
  font-weight: 500;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.2;
}

.article-author {
  color: #666;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #666;
}

.article-content {
  padding: 0 2rem 2rem;
  line-height: 1.8;
  color: #333;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
}

.article-content :deep(h2) {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
}

.article-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1rem 0;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
}

.btn-back {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #0056b3;
}

.editor-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.publish-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.published {
  background: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.btn-publish {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background: #28a745;
  color: white;
  transition: background 0.2s;
}

.btn-publish:hover:not(:disabled) {
  background: #218838;
}

.btn-publish:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

.error-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>





