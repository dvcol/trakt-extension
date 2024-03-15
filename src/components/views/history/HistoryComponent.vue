<script lang="ts" setup>
import { computed, onActivated, onDeactivated, onMounted, ref, watch } from 'vue';

import type {
  ListScrollItem,
  OnScroll,
  OnUpdated,
} from '~/components/common/list/ListScroll.model';

import ListScroll from '~/components/common/list/ListScroll.vue';

import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';

const { filteredHistory, pagination, loading, pageSize, belowThreshold } =
  useHistoryStoreRefs();
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

const history = computed<ListScrollItem[]>(() => {
  const array = filteredHistory.value;
  if (!array.length) return [];
  return array.map((item, index) => {
    const _item: ListScrollItem = { ...item, index, loading: item.id < 0 };
    if (!item.watched_at) return _item;

    const date: ListScrollItem['date'] = { current: new Date(item.watched_at) };
    if (index > 1 && array[index - 1]?.watched_at) {
      date.previous = new Date(array[index - 1]?.watched_at);
    }
    if (array[index + 1]?.watched_at) {
      date.next = new Date(array[index + 1]?.watched_at);
    }
    date.sameDay =
      date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
    return { ..._item, date };
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
    <template #default>
      <!-- TODO buttons here-->
    </template>
  </ListScroll>
</template>
