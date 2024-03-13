<script lang="ts" setup>
import { NTimeline, NVirtualList } from 'naive-ui';

import { onActivated, onMounted, ref, Transition, watch } from 'vue';

import type { VirtualListInst } from 'naive-ui';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import HistoryEmpty from '~/components/views/history/HistoryEmpty.vue';
import HistoryItem from '~/components/views/history/HistoryItem.vue';

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
        <HistoryItem :item="item" :index="index" />
      </template>
    </NVirtualList>
    <HistoryEmpty
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

.history-list {
  height: calc(100dvh - 8px);
  margin-top: -#{layout.$header-navbar-height};
  margin-bottom: 8px;
}
</style>
