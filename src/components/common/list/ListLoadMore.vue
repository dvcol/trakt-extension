<script setup lang="ts">
import { NButton } from 'naive-ui';

import { computed, toRefs } from 'vue';

import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'more');

const props = defineProps({
  search: {
    type: String,
    required: false,
  },
  items: {
    type: Number,
    required: false,
    default: 0,
  },
  itemCount: {
    type: Number,
    required: false,
    default: 0,
  },
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

const { page, pageCount } = toRefs(props);

const showButton = computed(() => page.value < pageCount.value);
</script>

<template>
  <div v-if="items && itemCount" class="row items" :class="{ offset: !showButton }">
    <span class="number"> {{ items }} </span> {{ i18n('out_of') }}
    <span class="number"> {{ itemCount }} </span>
    {{ i18n('items') }}
  </div>
  <div v-if="page && pageCount" class="row">
    <span class="number"> {{ page }} </span> {{ i18n('out_of') }}
    <span class="number"> {{ pageCount }} </span>
    {{ i18n('pages') }}
  </div>
  <div v-if="pageSize" class="row">
    {{ i18n('page_size') }} <span class="number"> {{ pageSize }} </span>
  </div>
  <Transition name="fade">
    <NButton
      v-if="showButton"
      class="button"
      tertiary
      round
      type="primary"
      @click="emit('onLoadMore', { page, pageCount, pageSize })"
    >
      {{ i18n('load_more') }}
    </NButton>
  </Transition>
</template>

<style scoped lang="scss">
@use '~/styles/transition' as transition;
@include transition.fade;

.row {
  margin-top: 0.3rem;
  color: var(--n-text-color);
  transition:
    color 0.3s var(--n-bezier),
    margin 0.3s var(--n-bezier);

  &:first-child {
    margin-top: 1.5rem;

    &.offset {
      margin-top: 2rem;
    }
  }

  .number {
    color: var(--color-primary-disabled);
    font-weight: bold;
  }
}

.button {
  margin: 1.25rem 1.25rem 0.5rem;
}
</style>
