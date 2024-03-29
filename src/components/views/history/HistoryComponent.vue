<script lang="ts" setup>
import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';
import {
  addLoadMore,
  useListScroll,
  useListScrollEvents,
} from '~/components/common/list/use-list-scroll';
import { useItemDrawer } from '~/components/views/drawer/use-item-drawer';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useI18n } from '~/utils';
import { watchUserChange } from '~/utils/store.utils';

const { filteredHistory, pagination, loading, pageSize, belowThreshold, searchHistory } =
  useHistoryStoreRefs();
const { fetchHistory, clearState } = useHistoryStore();

const i18n = useI18n('history');

watchUserChange({
  fetch: fetchHistory,
  clear: clearState,
});

const list = useListScroll(filteredHistory, 'watched_at');

const history = addLoadMore(list, pagination, searchHistory);

const { onScroll, onUpdated, onLoadMore } = useListScrollEvents(fetchHistory, {
  data: history,
  pagination,
  loading,
  belowThreshold,
});

const { scrolled, listRef, onClick } = useBackToTop();
const { onItemClick } = useItemDrawer();
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="history"
      :loading="loading"
      :pagination="pagination"
      :page-size="pageSize"
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
      @on-scroll-bottom="onScroll"
      @on-updated="onUpdated"
      @onload-more="onLoadMore"
      @on-item-click="onItemClick"
    >
      <template #default>
        <!-- TODO buttons here-->
      </template>
    </ListScroll>
    <FloatingButton :show="scrolled" @on-click="onClick">
      {{ i18n('back_to_top', 'common', 'button') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
