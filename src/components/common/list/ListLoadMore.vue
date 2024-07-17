<script setup lang="ts">
import { NButton } from 'naive-ui';

import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'more');

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
  <template v-if="page && pageCount">
    <div class="row">
      {{ i18n('pages_line_1') }} <span class="page"> {{ page }} </span>
      {{ i18n('pages_line_2') }} <span class="page"> {{ pageCount }} </span>
      {{ i18n('pages_line_3') }}
    </div>
    <div class="row">
      {{ i18n('current_page_size') }} <span class="page"> {{ pageSize }} </span>.
    </div>
    <template v-if="page < pageCount">
      <NButton
        class="button"
        tertiary
        round
        type="primary"
        @click="emit('onLoadMore', { page, pageCount, pageSize })"
      >
        Load more Pages
      </NButton>
    </template>
  </template>
</template>

<style scoped lang="scss">
.row {
  margin-top: 0.5rem;
  color: var(--n-text-color);
  transition: color 0.3s var(--n-bezier);

  .page {
    color: var(--color-primary-disabled);
    font-weight: bold;
  }
}

.button {
  margin: 1.25rem 1.25rem 0.5rem;
}
</style>
