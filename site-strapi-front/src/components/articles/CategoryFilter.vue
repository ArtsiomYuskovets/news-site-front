<template>
  <div class="category-filter">
    <label for="category-select" class="filter-label">Категория:</label>
    <select
      id="category-select"
      :value="selectedCategory"
      @change="$emit('category-change', ($event.target as HTMLSelectElement).value)"
      class="filter-select"
    >
      <option value="">Все категории</option>
      <option v-for="category in categories" :key="category.id" :value="category.slug">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/category'

interface Props {
  categories: Category[]
  selectedCategory?: string
}

defineProps<Props>()
defineEmits<{
  'category-change': [slug: string]
}>()
</script>

<style scoped>
.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  color: #333;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
}
</style>






