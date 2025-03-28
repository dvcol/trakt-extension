<script lang="ts" setup>
import { NFlex, NTimeline, NVirtualList } from 'naive-ui';

import { computed, ref, toRefs } from 'vue';

import type { PropType, Ref, Transition } from 'vue';

import type { StorePagination } from '~/models/pagination.model';

import type { PosterItem } from '~/models/poster.model';

import ListEmpty from '~/components/common/list/ListEmpty.vue';
import ListItem from '~/components/common/list/ListItem.vue';
import ListLoadMore from '~/components/common/list/ListLoadMore.vue';
import {
  type ListScrollItem,
  ListScrollItemType,
  type VirtualListProps,
  type VirtualListRef,
} from '~/models/list-scroll.model';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';
import { Header, Watching } from '~/styles/layout.style';
import { watchMedia } from '~/utils/window.utils';

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
    type: Object as PropType<StorePagination>,
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
  backdrop: {
    type: Boolean,
    required: false,
  },
  posterType: {
    type: String as PropType<PosterItem['type']>,
    required: false,
  },
  hidePoster: {
    type: Boolean,
    required: false,
  },
  hideDate: {
    type: Boolean,
    required: false,
  },
  hideTime: {
    type: Boolean,
    required: false,
  },
  overscroll: {
    type: String as PropType<
      'auto' | 'contain' | 'none' | 'initial' | 'unset' | 'inherit'
    >,
    required: false,
    default: 'auto',
  },
  contentHeight: {
    type: Number,
    required: false,
    default: 1,
  },
  scrollIntoView: {
    type: Array as PropType<ListScrollItem['id'][]>,
    required: false,
  },
  scrollThreshold: {
    type: Number,
    required: false,
    default: 300,
  },
  scrollBoundary: {
    type: Number,
    required: false,
    default: 0,
  },
  showProgress: {
    type: Boolean,
    required: false,
    default: false,
  },
  showPlayed: {
    type: Boolean,
    required: false,
    default: false,
  },
  showCollected: {
    type: Boolean,
    required: false,
    default: false,
  },
  showWatching: {
    type: Boolean,
    required: false,
    default: false,
  },
  showTagLoader: {
    type: Boolean,
    required: false,
    default: false,
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
  (e: 'onItemClick', event: { item: ListScrollItem; force?: boolean }): void;
  (e: 'onScrollIntoView', event: { item: ListScrollItem; ref?: HTMLDivElement }): void;
  (e: 'onScrollOutOfView', event: { item: ListScrollItem; ref?: HTMLDivElement }): void;
}>();

defineExpose({
  list: listRef,
});

const {
  items,
  loading,
  pagination,
  scrollThreshold,
  listOptions,
  backdrop,
  hidePoster,
  scrollBoundary,
  posterType,
} = toRefs(props);

const { floating, reverse } = useAppStateStoreRefs();
const { isWatching } = useWatchingStoreRefs();

const scrolled = ref(false);

const isCompact = watchMedia('(max-width: 600px)');
const showBackdrop = computed(() => backdrop?.value && !isCompact.value);
const overridePanelType = computed(() => (isCompact.value ? 'show' : posterType?.value));

const isTiny = watchMedia('(max-width: 350px)');
const showPoster = computed(() => !hidePoster?.value && !isTiny.value);

const defaultSize = computed(() => (showPoster.value ? 145 : 130));
const listItemSize = computed(() => listOptions?.value?.itemSize ?? defaultSize.value);
const scrollBoundarySize = computed(
  () => (scrollBoundary?.value ?? 0) * listItemSize.value,
);

const onScrollHandler = async (e: Event) => {
  if (loading.value) return;
  if (!e?.target) return;
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (scrollHeight === clientHeight) return;
  if (!scrollTop || scrollTop < scrollBoundarySize.value) {
    scrolled.value = false;
    return emits('onScrollTop', listRef);
  }
  if (!scrolled.value && scrollTop > scrollThreshold.value) {
    emits('onScroll', listRef);
    scrolled.value = true;
  }
  const scrollBottom = scrollTop + clientHeight + scrollBoundarySize.value;
  if (scrollHeight > scrollBottom) return;
  if (pagination?.value && pagination?.value?.page === pagination?.value?.pageCount) {
    return;
  }
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

const isEmpty = computed(() => !items.value.length && !loading.value);

const topInset = computed(() => {
  const listElementRef = listRef.value?.$el;
  if (!listElementRef) return 0;
  const inset = getComputedStyle(listElementRef).getPropertyValue(
    '--safe-area-inset-top',
  );
  if (!inset) return 0;
  return parseInt(inset, 10);
});
const listPaddingTop = computed(() => {
  const offset = topInset.value / 2;
  if (listOptions?.value?.paddingTop) return offset + listOptions.value.paddingTop;
  if (floating.value) return offset + Header.navbarHeight + Header.floatingOffset + 14;
  if (reverse.value && isWatching.value) return offset + 16 + Watching.Height;
  if (reverse.value) return offset + 16;
  return offset + 60;
});
const listPaddingBottom = computed(() => {
  if (listOptions?.value?.paddingBottom) return listOptions.value.paddingBottom;
  if (reverse.value) return 8 + Header.navbarHeight;
  if (isWatching.value) return 8 + Watching.Height;
  return 8;
});
</script>

<template>
  <Transition name="fade" mode="out-in">
    <NVirtualList
      v-if="!isEmpty"
      ref="listRef"
      class="list-scroll"
      :class="{ floating, reverse }"
      :style="{
        '--overscroll-behavior': overscroll,
      }"
      :data-length="items.length"
      :data-page-size="pageSize"
      :item-size="listItemSize"
      :items="items"
      :item-resizable="false"
      ignore-item-resize
      :visible-items-tag="listOptions?.visibleItemsTag ?? NTimeline"
      :visible-items-props="{
        size: 'large',
        ...listOptions?.visibleItemsProps,
      }"
      :padding-top="listPaddingTop"
      :padding-bottom="listPaddingBottom"
      :key-field="'key'"
      :on-scroll="onScrollHandler"
      @vue:updated="onUpdatedHandler"
    >
      <template #default="{ item }: { item: ListScrollItem }">
        <slot v-if="item.type === ListScrollItemType.LoadMore" name="load-more">
          <NFlex
            :key="item.key"
            :data-key="item.key"
            class="load-more"
            justify="flex-start"
            align="center"
            vertical
            size="small"
            :theme-overrides="{ gapSmall: '0' }"
            :style="`height: ${listOptions?.itemSize ?? defaultSize}px;`"
          >
            <ListLoadMore
              :page="pagination?.page"
              :page-count="pagination?.pageCount"
              :items="items.length > 1 ? items.length - 1 : 0"
              :item-count="pagination?.itemCount"
              :page-size="pageSize"
              @on-load-more="onLoadMore"
            />
          </NFlex>
        </slot>
        <slot v-else-if="item.type === ListScrollItemType.AllLoaded" name="empty">
          <NFlex
            :key="item.key"
            :data-key="item.key"
            class="all-loaded"
            justify="flex-start"
            align="center"
            vertical
            size="small"
            :theme-overrides="{ gapSmall: '0' }"
            :style="`height: ${listOptions?.itemSize ?? defaultSize}px;`"
          >
            <ListLoadMore
              :page="pagination?.page"
              :page-count="pagination?.pageCount"
              :items="items.length > 1 ? items.length - 1 : 0"
              :item-count="pagination?.itemCount"
              :page-size="pageSize"
            />
          </NFlex>
        </slot>
        <ListItem
          v-else
          :key="item.id"
          :item="item"
          :height="listOptions?.itemSize ?? defaultSize"
          :size="items.length"
          :hide-date="hideDate"
          :hide-time="hideTime"
          :hide-poster="!showPoster"
          :backdrop="showBackdrop"
          :poster-type="overridePanelType"
          :content-height="contentHeight"
          :hover="hoverDate === item.date?.current?.toDateString()"
          :scroll-into-view="scrollIntoView?.includes(item.id)"
          :show-progress="showProgress"
          :show-played="showPlayed"
          :show-collected="showCollected"
          :show-watching="showWatching"
          :show-tag-loader="showTagLoader"
          @on-hover="onHover"
          @on-item-click="(...args) => $emit('onItemClick', ...args)"
          @on-scroll-into-view="(...args) => $emit('onScrollIntoView', ...args)"
          @on-scroll-out-of-view="(...args) => $emit('onScrollOutOfView', ...args)"
        >
          <slot :item="item" :loading="item.loading" />
          <template v-if="$slots.buttons" #buttons="{ open, dragged, focusin }">
            <slot
              name="buttons"
              :item="item"
              :loading="item.loading"
              :open="open || dragged || focusin"
            />
          </template>
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
  height: layout.$content-height;
  transition: margin-top 0.5s var(--n-bezier);

  &.reverse {
    margin-top: calc(0% - #{layout.$safe-area-inset-top});
  }

  .all-loaded,
  .load-more {
    opacity: 0;
    animation: fade-in 0.5s forwards;
    animation-delay: 0.25s;
  }

  :deep(.v-vl) {
    overscroll-behavior: var(--overscroll-behavior, auto);
  }

  :deep(.v-vl-items) {
    transition: padding 0.5s var(--n-bezier);
  }
}
</style>
