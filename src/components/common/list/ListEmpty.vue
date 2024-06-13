<script setup lang="ts">
import { NEmpty } from 'naive-ui';

import ListLoadMore from '~/components/common/list/ListLoadMore.vue';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'empty');

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

const emit = defineEmits<{
  (
    e: 'onLoadMore',
    pagination: { page: number; pageCount: number; pageSize: number },
  ): void;
}>();
</script>

<template>
  <NEmpty size="large" :show-description="false">
    <template #extra>
      <span class="empty">{{ i18n('no_data') }}</span>
      <ListLoadMore
        :page="page"
        :page-count="pageCount"
        :page-size="pageSize"
        @on-load-more="e => emit('onLoadMore', e)"
      />
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
