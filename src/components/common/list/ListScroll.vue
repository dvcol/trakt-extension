<script lang="ts" setup>
import { NFlex, NTimeline, NVirtualList } from 'naive-ui';

import { ref, toRefs } from 'vue';

import type { PropType, Ref, Transition } from 'vue';

import type {
  ListScrollItem,
  VirtualListProps,
  VirtualListRef,
} from '~/components/common/list/ListScroll.model';
import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import ListEmpty from '~/components/common/list/ListEmpty.vue';
import ListItem from '~/components/common/list/ListItem.vue';
import ListLoadMore from '~/components/common/list/ListLoadMore.vue';

const listRef = ref<VirtualListRef>();

const props = defineProps({
  items: {
    type: Array as PropType<ListScrollItem[]>,
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
  listOptions: {
    type: Object as PropType<VirtualListProps>,
    required: false,
  },
  hideDate: {
    type: Boolean,
    required: false,
  },
  scrollThreshold: {
    type: Number,
    required: false,
    default: 0,
  },
});

const emits = defineEmits<{
  (e: 'onScrollBottom', listRef: Ref<VirtualListRef | undefined>): void;
  (e: 'onScrollTop', listRef: Ref<VirtualListRef | undefined>): void;
  (e: 'onScroll', listRef: Ref<VirtualListRef | undefined>): void;
  (e: 'onUpdated', listRef: Ref<VirtualListRef | undefined>): void;
  (
    e: 'onloadMore',
    payload: {
      listRef: Ref<VirtualListRef | undefined>;
      page: number;
      pageCount: number;
      pageSize: number;
    },
  ): void;
}>();

defineExpose({
  list: listRef,
});

const { items, loading, pagination, scrollThreshold } = toRefs(props);

const scrolled = ref(false);

const onScrollHandler = async (e: Event) => {
  if (loading.value) return;
  if (!e?.target) return;
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (scrollHeight === clientHeight) return;
  if (!scrollTop) {
    scrolled.value = false;
    return emits('onScrollTop', listRef);
  }
  if (!scrolled.value && scrollTop > scrollThreshold.value) {
    emits('onScroll', listRef);
    scrolled.value = true;
  }
  if (scrollHeight !== scrollTop + clientHeight) return;
  if (pagination?.value?.page === pagination?.value?.pageCount) return;
  return emits('onScrollBottom', listRef);
};

const onUpdatedHandler = () => {
  return emits('onUpdated', listRef);
};

const hoverDate = ref<string>();
const onHover = ({ item, hover }: { item: ListScrollItem; hover: boolean }) => {
  if (hover) hoverDate.value = item.date?.current?.toDateString();
};

const onLoadMore = (payload: { page: number; pageCount: number; pageSize: number }) => {
  emits('onloadMore', { listRef, ...payload });
};
</script>

<template>
  <Transition name="fade" mode="out-in">
    <NVirtualList
      v-if="items.length || loading"
      ref="listRef"
      class="list-scroll"
      :data-length="items.length"
      :data-page-size="pageSize"
      :item-size="listOptions?.itemSize ?? 145"
      :items="items"
      :item-resizable="false"
      ignore-item-resize
      :visible-items-tag="listOptions?.visibleItemsTag ?? NTimeline"
      :visible-items-props="{
        size: 'large',
        ...listOptions?.visibleItemsProps,
      }"
      :padding-top="listOptions?.paddingTop ?? 60"
      :padding-bottom="listOptions?.paddingBottom ?? 32"
      @scroll="onScrollHandler"
      @vue:updated="onUpdatedHandler"
    >
      <template #default="{ item }">
        <NFlex
          v-if="item.id === 'load-more'"
          class="load-more"
          justify="center"
          align="center"
          vertical
          size="small"
          :theme-overrides="{ gapSmall: '0' }"
          :style="`height: ${listOptions?.itemSize ?? 145}px;`"
        >
          <ListLoadMore
            :page="pagination?.page"
            :page-count="pagination?.pageCount"
            :page-size="pageSize"
            @on-load-more="onLoadMore"
          />
        </NFlex>
        <ListItem
          v-else
          :key="item.id"
          :item="item"
          :index="item.index"
          :size="items.length"
          :hide-date="hideDate"
          :hover="hoverDate === item.date?.current?.toDateString()"
          @on-hover="onHover"
        >
          <slot :item="item" :index="item.index" :loading="item.loading" />
        </ListItem>
      </template>
    </NVirtualList>
    <ListEmpty
      v-else
      :page="pagination?.page"
      :page-count="pagination?.pageCount"
      :page-size="pageSize"
      @on-load-more="onLoadMore"
    />
  </Transition>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;
@use '~/styles/transition' as transition;
@use '~/styles/animation' as animation;
@include transition.fade;
@include animation.fade-in;

.list-scroll {
  height: calc(100dvh - 8px);
  margin-top: -#{layout.$header-navbar-height};
  margin-bottom: 8px;

  .load-more {
    margin-top: 1rem;
    opacity: 0;
    animation: fade-in 0.5s forwards;
    animation-delay: 0.25s;
  }
}
</style>
