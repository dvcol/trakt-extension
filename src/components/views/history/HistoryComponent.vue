<script lang="ts" setup>
import { computed, onActivated, onDeactivated, onMounted, ref, watch } from 'vue';

import type {
  ListScrollItem,
  OnScroll,
  OnUpdated,
  VirtualListRef,
} from '~/components/common/list/ListScroll.model';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { useI18n } from '~/utils';

const { filteredHistory, pagination, loading, pageSize, belowThreshold } =
  useHistoryStoreRefs();
const { fetchHistory, clearState } = useHistoryStore();

const { user } = useUserSettingsStoreRefs();

const i18n = useI18n('history');

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
    date.sameDayAsPrevious =
      date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
    date.sameDayAsNext =
      date.next?.toLocaleDateString() === date.current?.toLocaleDateString();
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
