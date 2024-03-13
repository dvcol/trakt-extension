<script setup lang="ts">
import { NEmpty } from 'naive-ui';

defineProps({
  page: {
    type: Number,
    required: false,
    default: 0,
  },
  pageCount: {
    type: Number,
    required: false,
    default: 0,
  },
  pageSize: {
    type: Number,
    required: false,
    default: 0,
  },
});
</script>

<template>
  <NEmpty size="large" :show-description="false">
    <template #extra>
      <span class="empty">No data found.</span>
      <div v-if="page && pageCount">
        <div class="empty">
          Pages searched <span class="page"> {{ page }} </span> out of
          <span class="page"> {{ pageCount }} </span>.
        </div>
        <template v-if="page < pageCount">
          <div class="empty">Increase the page size to search more.</div>
          <div class="empty">
            Current page size is <span class="page"> {{ pageSize }} </span>.
          </div>
        </template>
      </div>
    </template>
  </NEmpty>
</template>

<style scoped lang="scss">
.empty {
  margin-top: 0.5rem;
  color: var(--n-text-color);
  transition: color 0.3s var(--n-bezier);

  .page {
    color: var(--primary-color-disabled);
    font-weight: bold;
  }
}
</style>
