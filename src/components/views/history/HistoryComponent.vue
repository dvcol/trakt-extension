<script lang="ts" setup>
import { onActivated, onDeactivated, onMounted, ref, watch } from 'vue';

import type { OnScroll, OnUpdated } from '~/components/common/list/ListScroll.model';

import ListScroll from '~/components/common/list/ListScroll.vue';
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
const { fetchHistory, clearState } = useHistoryStore();

const { user } = useUserSettingsStoreRefs();

const active = ref(false);

onActivated(() => {
  active.value = true;
  fetchHistory();
});

onDeactivated(() => {
  active.value = false;
});

onMounted(() => {
  watch(user, () => {
    if (active.value) {
      fetchHistory();
    } else {
      clearState();
    }
  });
});

const onScroll: OnScroll = async listRef => {
  const key = history.value[history.value.length - 1].id;
  await fetchHistory({
    page: pagination.value?.page ? pagination.value.page + 1 : 0,
  });
  listRef.value?.scrollTo({ key, debounce: true });
};

/**
 * This is a workaround for the onUpdated lifecycle hook not triggering when wrapped in transition.
 */
const onUpdated: OnUpdated = listRef => {
  const { scrollHeight, clientHeight } = listRef.value?.$el?.firstElementChild ?? {};
  if (scrollHeight !== clientHeight || !belowThreshold.value || loading.value) return;

  return fetchHistory({
    page: pagination.value?.page ? pagination.value.page + 1 : 0,
  });
};
</script>

<template>
  <ListScroll
    :items="history"
    :loading="loading"
    :pagination="pagination"
    :page-size="pageSize"
    @on-scroll-bottom="onScroll"
    @on-scroll-top="() => console.info('Scrolled to top')"
    @on-updated="onUpdated"
  >
    <template #default="{ item, loading: itemLoading }">
      <HistoryItem :item="item" :loading="itemLoading" />
    </template>
  </ListScroll>
</template>
