<template>
  <article class="article-card">
    <RouterLink 
      :to="`/article/${article.id}`" 
      class="article-link"
      @click="handleArticleClick"
    >
      <div v-if="article.coverImage" class="article-image">
        <img :src="getImageUrl(article.coverImage.url)" :alt="article.coverImage.alternativeText" />
      </div>

      <div class="article-content">
        <div class="article-meta">
          <span v-if="article.category" class="category">{{ article.category.name }}</span>
          <span v-if="article.publishedAt" class="date">{{ formatDate(article.publishedAt) }}</span>
          <span v-if="article.readingTime" class="reading-time">{{ article.readingTime }} мин</span>
        </div>

        <h2 class="article-title">{{ article.title }}</h2>
        <p class="article-excerpt">{{ article.excerpt }}</p>

        <div class="article-footer">
          <span v-if="article.author" class="author">Автор: {{ article.author.username }}</span>
          <span v-if="article.views" class="views">Просмотров: {{ article.views }}</span>
        </div>

        <div v-if="article.tags && article.tags.length" class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div v-if="canEdit" class="article-actions">
          <RouterLink
            :to="`/article/${article.id}/edit`"
            class="btn-edit"
            @click.stop
          >
            Редактировать
          </RouterLink>
          <button
            @click.stop="handleDelete"
            class="btn-delete"
          >
            Удалить
          </button>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'

interface Props {
  article: Article
}

const props = defineProps<Props>()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const canEdit = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) {
    return false
  }
  
  if (authStore.isEditor) {
    return true
  }
  
  if (!props.article.author) {
    return false
  }
  
  let authorId: number
  if (props.article.author.id && typeof props.article.author.id === 'object') {
    authorId = Number((props.article.author.id as any).id || Object.values(props.article.author.id)[0])
  } else {
    authorId = Number(props.article.author.id)
  }
  
  const userId = Number(authStore.user.id)
  
  return authorId === userId
})

const getImageUrl = (url: string): string => {
  if (url.startsWith('http')) return url
  return `http://localhost:1337${url}`
}

const handleArticleClick = () => {
  console.log('=== Article Click Debug ===')
  console.log('Article:', props.article)
  console.log('Article ID:', props.article.id)
  console.log('Article documentId:', (props.article as any).documentId)
  console.log('Article publicationState:', (props.article as any).publicationState)
  console.log('Article publishedAt:', props.article.publishedAt)
  console.log('Article title:', props.article.title)
  console.log('Article Author:', props.article.author)
  console.log('Article Author ID:', props.article.author?.id)
  console.log('Article Author Username:', props.article.author?.username)
  console.log('Current User:', authStore.user)
  console.log('Current User ID:', authStore.user?.id)
  console.log('Is Editor:', authStore.isEditor)
  console.log('Can Edit:', canEdit.value)
  console.log('All article fields:', Object.keys(props.article))
  console.log('Full article object:', JSON.stringify(props.article, null, 2))
  console.log('==========================')
}

const handleDelete = async () => {
  if (confirm('Вы уверены, что хотите удалить эту статью? Это действие нельзя отменить.')) {
    try {
      await articlesStore.deleteArticle(props.article.id)
    } catch (error) {
      console.error('Ошибка удаления статьи:', error)
      alert('Не удалось удалить статью. Возможно, у вас нет прав на это действие.')
    }
  }
}
</script>

<style scoped>
.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #666;
}

.category {
  color: #007bff;
  font-weight: 500;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.75rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #666;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
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
</style>





