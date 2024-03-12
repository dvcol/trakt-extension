<script lang="ts" setup>
import {
  NEmpty,
  NFlex,
  NSkeleton,
  NTimeline,
  NTimelineItem,
  NVirtualList,
} from 'naive-ui';

import { onActivated, onMounted, ref, Transition, watch } from 'vue';

import type { VirtualListInst } from 'naive-ui';

import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';

const {
  filteredHistory: history,
  pagination,
  loading,
  pageSize,
  belowThreshold,
} = useHistoryStoreRefs();
const { fetchHistory } = useHistoryStore();

const { user } = useUserSettingsStoreRefs();

const virtualList = ref<VirtualListInst & typeof NVirtualList>();

const onScroll = async (e: Event) => {
  if (loading.value) return;
  if (!e?.target) return;
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
  if (!scrollTop || scrollHeight !== scrollTop + clientHeight) return;
  if (pagination.value?.page === pagination.value?.pageCount) return;

  const key = history.value[history.value.length - 1].id;
  await fetchHistory({
    page: pagination.value?.page ? pagination.value.page + 1 : 0,
  });
  virtualList.value?.scrollTo({ key, debounce: true });
};

onMounted(() => {
  console.info('History mounted');
  fetchHistory();

  watch(user, () => {
    console.info('User Change - re fetching');
    fetchHistory();
  });
});

onActivated(() => {
  console.info('History activated');
});

/**
 * This is a workaround for the onUpdated lifecycle hook not triggering when wrapped in transition.
 */
const onUpdated = () => {
  const { scrollHeight, clientHeight } = virtualList.value?.$el?.firstElementChild ?? {};
  if (scrollHeight !== clientHeight || !belowThreshold.value || loading.value) return;

  return fetchHistory({
    page: pagination.value?.page ? pagination.value.page + 1 : 0,
  });
};

const getTitle = (media: TraktHistory) => {
  if ('movie' in media) return media.movie.title;
  const number = media.episode?.number?.toString().padStart(2, '0');
  return `${media.episode?.season}x${number} - ${media?.episode?.title}`;
};
</script>

<template>
  <Transition name="fade" mode="out-in">
    <NVirtualList
      v-if="history.length || loading"
      ref="virtualList"
      class="history-list"
      :item-size="80"
      :data-length="history.length"
      :data-page-size="pageSize"
      :items="history"
      :visible-items-tag="NTimeline"
      :visible-items-tag-props="{ size: 'large' }"
      :padding-top="56"
      :padding-bottom="16"
      @scroll="onScroll"
      @vue:updated="onUpdated"
    >
      <template #default="{ item, index }">
        <template v-if="item.id >= 0">
          <NTimelineItem
            :key="item.id"
            class="timeline-item"
            :data-key="item.id"
            :data-index="index"
            type="success"
            :title="getTitle(item)"
            :content="item.show?.title"
            :time="new Date(item.watched_at).toLocaleString()"
          />
        </template>
        <template v-else>
          <NTimelineItem
            :key="item.id"
            class="timeline-item"
            :data-key="item.id"
            :data-index="index"
            line-type="dashed"
          >
            <template #default>
              <NFlex vertical>
                <NSkeleton text style="width: 70%" />
                <NSkeleton text style="width: 60%" />
                <NSkeleton text style="width: 20%" />
              </NFlex>
            </template>
          </NTimelineItem>
        </template>
      </template>
    </NVirtualList>
    <NEmpty v-else size="large" :show-description="false">
      <template #extra>
        <span class="empty">No data found.</span>
        <div v-if="pagination?.page && pagination?.pageCount">
          <div class="empty">
            Pages searched <span class="page"> {{ pagination?.page }} </span> out of
            <span class="page"> {{ pagination?.pageCount }} </span>.
          </div>
          <template v-if="pagination.page < pagination.pageCount">
            <div class="empty">Increase the page size to search more.</div>
            <div class="empty">
              Current page size is <span class="page"> {{ pageSize }} </span>.
            </div>
          </template>
        </div>
      </template>
    </NEmpty>
  </Transition>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;
@use '~/styles/transition' as transition;
@include transition.fade;

.history-list {
  height: calc(100dvh - 8px);
  margin-top: -#{layout.$header-navbar-height};
  margin-bottom: 8px;

  .timeline-item {
    font-variant-numeric: tabular-nums;
    margin: 0 1rem;
  }
}

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
