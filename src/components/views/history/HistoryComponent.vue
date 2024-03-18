<script lang="ts" setup>
import { ref } from 'vue';

import type {
  OnScroll,
  OnUpdated,
  VirtualListRef,
} from '~/components/common/list/ListScroll.model';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { addLoadMore, useListScroll } from '~/components/common/list/useListScroll';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useI18n } from '~/utils';
import { watchUserChange } from '~/utils/store.utils';

const { filteredHistory, pagination, loading, pageSize, belowThreshold, searchHistory } =
  useHistoryStoreRefs();
const { fetchHistory, clearState } = useHistoryStore();

const i18n = useI18n('history');

watchUserChange(fetchHistory, clearState);

const list = useListScroll(filteredHistory, 'watched_at');

const history = addLoadMore(list, pagination, searchHistory);

const onScroll: OnScroll = async listRef => {
  const key = history.value[history.value.length - 1].id;
  await fetchHistory({
    page: pagination.value?.page ? pagination.value.page + 1 : 0,
  });
  listRef.value?.scrollTo({ key, debounce: true });
};

const onLoadMore = async () =>
  fetchHistory({
    page: pagination.value?.page ? pagination.value.page + 1 : 0,
  });

/**
 * This is a workaround for the onUpdated lifecycle hook not triggering when wrapped in transition.
 */
const onUpdated: OnUpdated = listRef => {
  const { scrollHeight, clientHeight } = listRef.value?.$el?.firstElementChild ?? {};
  if (scrollHeight !== clientHeight || !belowThreshold.value || loading.value) return;

  return onLoadMore();
};

const listRef = ref<{ list: VirtualListRef }>();

const scrolled = ref(false);

const onClick = () => {
  listRef.value?.list?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  scrolled.value = false;
};
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="history"
      :loading="loading"
      :pagination="pagination"
      :page-size="pageSize"
      :scroll-threshold="300"
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
      @on-scroll-bottom="onScroll"
      @on-updated="onUpdated"
      @onload-more="onLoadMore"
    >
      <template #default>
        <!-- TODO buttons here-->
      </template>
    </ListScroll>
    <FloatingButton :show="scrolled" @on-click="onClick">
      {{ i18n('button_top') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
