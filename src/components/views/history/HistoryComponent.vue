<script lang="ts" setup>
import { onMounted, toRefs, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';
import {
  addLoadMore,
  useListScroll,
  useListScrollEvents,
} from '~/components/common/list/use-list-scroll';
import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useI18n } from '~/utils/i18n.utils';
import { watchUserChange } from '~/utils/store.utils';

const props = defineProps({
  panel: {
    type: Boolean,
    required: false,
  },
  footer: {
    type: Boolean,
    required: false,
  },
});

const { panel } = toRefs(props);

const { filteredHistory, pagination, loading, pageSize, belowThreshold, searchHistory } =
  useHistoryStoreRefs();
const { fetchHistory, clearState } = useHistoryStore();

const i18n = useI18n('history');

watchUserChange({
  fetch: fetchHistory,
  clear: clearState,
});

onMounted(() => {
  watch(panel, async value => {
    if (!value) await fetchHistory();
  });
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
const { onItemClick } = usePanelItem();
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
    <FloatingButton :show="!footer && scrolled" @on-click="onClick">
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
