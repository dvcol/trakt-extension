<script lang="ts" setup>
import { NTimeline, NVirtualList } from 'naive-ui';

import { ref, toRefs } from 'vue';

import type { PropType, Ref, Transition } from 'vue';

import type { VirtualListRef } from '~/components/common/list/ListScroll.model';
import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import ListEmpty from '~/components/common/list/ListEmpty.vue';

const virtualList = ref<VirtualListRef>();

const props = defineProps({
  items: {
    type: Array as PropType<Record<string, unknown>[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  pagination: {
    type: Object as PropType<TraktClientPagination>,
    required: false,
  },
  pageSize: {
    type: Number,
    required: false,
  },
});

const emits = defineEmits<{
  (e: 'onScroll', listRef: Ref<VirtualListRef | undefined>): void;
  (e: 'onUpdated', listRef: Ref<VirtualListRef | undefined>): void;
}>();

const { items, loading, pagination } = toRefs(props);

const onScrollHandler = async (e: Event) => {
  if (loading.value) return;
  if (!e?.target) return;
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
  if (!scrollTop || scrollHeight !== scrollTop + clientHeight) return;
  if (pagination?.value?.page === pagination?.value?.pageCount) return;

  return emits('onScroll', virtualList);
};

const onUpdatedHandler = () => {
  return emits('onUpdated', virtualList);
};
</script>

<template>
  <Transition name="fade" mode="out-in">
    <NVirtualList
      v-if="items.length || loading"
      ref="virtualList"
      class="list-scroll"
      :item-size="80"
      :data-length="items.length"
      :data-page-size="pageSize"
      :items="items"
      :visible-items-tag="NTimeline"
      :visible-items-tag-props="{ size: 'large' }"
      :padding-top="56"
      :padding-bottom="16"
      @scroll="onScrollHandler"
      @vue:updated="onUpdatedHandler"
    >
      <template #default="{ item, index }">
        <slot :item="item" :index="index" />
      </template>
    </NVirtualList>
    <ListEmpty
      v-else
      :page="pagination?.page"
      :page-count="pagination?.pageCount"
      :page-size="pageSize"
    />
  </Transition>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;
@use '~/styles/transition' as transition;
@include transition.fade;

.list-scroll {
  height: calc(100dvh - 8px);
  margin-top: -#{layout.$header-navbar-height};
  margin-bottom: 8px;
}
</style>
