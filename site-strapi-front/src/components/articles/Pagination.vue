<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="$emit('page-change', currentPage - 1)"
      class="pagination-btn"
    >
      Назад
    </button>

    <div class="pagination-info">
      <span v-if="totalPages > 0">
        Страница {{ currentPage }} из {{ totalPages }}
        <span class="total" v-if="total > 0">(Всего: {{ total }})</span>
      </span>
      <span v-else-if="total > 0">
        Страница {{ currentPage }}
        <span class="total">(Всего: {{ total }})</span>
      </span>
      <span v-else>Нет данных</span>
    </div>

    <button
      :disabled="currentPage === totalPages"
      @click="$emit('page-change', currentPage + 1)"
      class="pagination-btn"
    >
      Вперед
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  total: number
}

defineProps<Props>()
defineEmits<{
  'page-change': [page: number]
}>()
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #0056b3;
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

.total {
  margin-left: 0.5rem;
  color: #999;
}
</style>




