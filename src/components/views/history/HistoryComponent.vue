<script lang="ts" setup>
import { onMounted, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListButtonWatched from '~/components/common/list/ListButtonWatched.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import {
  addLoadMore,
  useListScroll,
  useListScrollEvents,
} from '~/components/common/list/use-list-scroll';
import { usePanelItem } from '~/components/common/panel/use-panel-item';
import { isListItemType } from '~/models/list.model';
import { Route } from '~/models/router.model';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useActivityStore } from '~/stores/data/activity.store';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import { useActiveAndDocumentVisible, watchUserChange } from '~/utils/store.utils';
import { useWatchActivated } from '~/utils/vue.utils';

const { footerOpen, panelOpen, panelDirty } = useAppStateStoreRefs();

const { filteredHistory, pagination, loading, pageSize, belowThreshold, searchHistory } =
  useHistoryStoreRefs();
const { fetchHistory, clearState } = useHistoryStore();
const { isWatching } = useWatchingStoreRefs();

const i18n = useI18n('history');

const { active } = watchUserChange({
  fetch: fetchHistory,
  clear: clearState,
});

const list = useListScroll(filteredHistory, 'watched_at');

const history = addLoadMore(list, pagination, searchHistory);

const { scrolled, listRef, onClick } = useBackToTop();
const { onItemClick } = usePanelItem();

const { onScroll, onUpdated, onLoadMore } = useListScrollEvents(fetchHistory, {
  data: history,
  pagination,
  loading,
  belowThreshold,
  active,
});

const { getImageSettings } = useExtensionSettingsStore();
const imageSettings = getImageSettings(Route.History);

const { getEvicted } = useActivityStore();
useWatchActivated(
  watch(getEvicted(Route.History), async _evicted => {
    if (!_evicted) return;
    if (scrolled.value) return;
    await fetchHistory();
  }),
);

onMounted(() => {
  watch(panelOpen, async value => {
    if (!value && panelDirty.value) await fetchHistory();
  });
  watch(isWatching, async () => {
    if (panelOpen.value) return;
    await fetchHistory();
  });
});

useActiveAndDocumentVisible({
  onVisible: fetchHistory,
});
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="history"
      :loading="loading"
      :pagination="pagination"
      :page-size="pageSize"
      :backdrop="imageSettings.backdrop"
      :poster-type="imageSettings.type"
      show-collected
      show-tag-loader
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
      @on-scroll-bottom="onScroll"
      @on-updated="onUpdated"
      @onload-more="onLoadMore"
      @on-item-click="onItemClick"
    >
      <template #buttons="{ open, item }">
        <template v-if="isListItemType(item?.type)">
          <ListButtonWatched :disabled="!open" :item="item" watched />
        </template>
      </template>
    </ListScroll>
    <FloatingButton :show="!footerOpen && scrolled" @on-click="onClick">
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
