<template>
  <AppLayout>
    <div class="container">
      <div class="edit-form-container">
        <h2 class="form-title">{{ isEdit ? 'Редактировать статью' : 'Создать статью' }}</h2>

        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="form-group">
            <label for="title">Заголовок *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="form-input"
              placeholder="Введите заголовок статьи"
            />
          </div>

          <div class="form-group">
            <label for="excerpt">Краткое описание *</label>
            <textarea
              id="excerpt"
              v-model="form.excerpt"
              required
              rows="3"
              class="form-textarea"
              placeholder="Краткое описание статьи"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="content">Содержание *</label>
            <textarea
              id="content"
              v-model="form.content"
              required
              rows="10"
              class="form-textarea"
              placeholder="Содержание статьи"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Категория</label>
              <select id="category" v-model="form.category" class="form-select">
                <option value="">Выберите категорию</option>
                <option
                  v-for="category in categoriesStore.categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  v-model="form.isFeatured"
                  class="form-checkbox"
                />
                Избранная статья
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="tags">Теги (через запятую)</label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              class="form-input"
              placeholder="технологии, новости, обзор"
            />
          </div>

          <div v-if="articlesStore.error" class="error-message">
            {{ articlesStore.error }}
          </div>

          <div class="form-actions">
            <RouterLink to="/" class="btn-cancel">Отмена</RouterLink>
            <button type="submit" :disabled="articlesStore.isLoading" class="btn-submit">
              {{ articlesStore.isLoading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useArticlesStore } from '@/stores/articles'
import { useCategoriesStore } from '@/stores/categories'
import AppLayout from '@/components/layouts/AppLayout.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const categoriesStore = useCategoriesStore()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  category: '',
  isFeatured: false,
  tags: [] as string[],
})

const tagsInput = ref('')

const handleSubmit = async () => {
  try {
    const articleData: any = {
      title: form.value.title,
      excerpt: form.value.excerpt,
      content: form.value.content,
      isFeatured: form.value.isFeatured,
      tags: form.value.tags,
    }

    if (form.value.category) {
      articleData.category = Number(form.value.category)
    }

    if (isEdit.value) {
      await articlesStore.updateArticle(route.params.id as string, articleData)
    } else {
      await articlesStore.createArticle(articleData)
    }

    router.push('/')
  } catch (error) {
    // Ошибка уже обработана в store
  }
}

onMounted(async () => {
  await categoriesStore.fetchCategories()

  if (isEdit.value) {
    await articlesStore.fetchArticle(route.params.id as string)
    const article = articlesStore.currentArticle

    if (article) {
      form.value.title = article.title
      form.value.excerpt = article.excerpt
      form.value.content = article.content
      form.value.isFeatured = article.isFeatured
      form.value.tags = article.tags || []
      tagsInput.value = article.tags?.join(', ') || ''
      form.value.category = article.category?.id.toString() || ''
    }
  }
})

// Синхронизация tagsInput с form.tags
watch(tagsInput, (value) => {
  form.value.tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.edit-form-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
}

.edit-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-textarea {
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
}

.form-checkbox {
  margin-right: 0.5rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0056b3;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

