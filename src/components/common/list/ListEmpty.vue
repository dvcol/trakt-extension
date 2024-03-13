<script setup lang="ts">
import { NEmpty } from 'naive-ui';

import { useI18n } from '~/utils';

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
</script>

<template>
  <NEmpty size="large" :show-description="false">
    <template #extra>
      <span class="empty">{{ i18n('no_data') }}</span>
      <div v-if="page && pageCount">
        <div class="empty">
          {{ i18n('pages_line_1') }} <span class="page"> {{ page }} </span>
          {{ i18n('pages_line_2') }} <span class="page"> {{ pageCount }} </span>.
        </div>
        <template v-if="page < pageCount">
          <div class="empty">{{ i18n('page_size') }}</div>
          <div class="empty">
            {{ i18n('current_page_size') }} <span class="page"> {{ pageSize }} </span>.
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
