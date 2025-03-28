<script lang="ts" setup>
import { onMounted, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListButtons from '~/components/common/list/ListButtons.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';

import {
  addLoadMore,
  useBufferedListScroll,
  useListScrollEvents,
} from '~/components/common/list/use-list-scroll';
import { usePanelItem } from '~/components/common/panel/use-panel-item';
import { type AnyList, type AnyListDateTypes, isListItemType } from '~/models/list.model';

import { Route } from '~/models/router.model';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useActivityStore } from '~/stores/data/activity.store';
import {
  anyListDateGetter,
  useListStore,
  useListStoreRefs,
} from '~/stores/data/list.store';
import { useListsStoreRefs } from '~/stores/data/lists.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import { useActiveAndDocumentVisible, watchUserChange } from '~/utils/store.utils';
import { useWatchActivated } from '~/utils/vue.utils';

const i18n = useI18n('list');

const { footerOpen, panelOpen, panelDirty } = useAppStateStoreRefs();

const {
  filteredListItems,
  pagination,
  listLoading,
  pageSize,
  belowThreshold,
  searchList,
} = useListStoreRefs();
const { fetchListItems, clearState } = useListStore();
const { activeList } = useListsStoreRefs();

const { scrolled, listRef, onClick } = useBackToTop();
const { onItemClick } = usePanelItem();

const { active } = watchUserChange({
  fetch: fetchListItems,
  clear: clearState,
});

const { list } = useBufferedListScroll<AnyList, AnyListDateTypes>(
  filteredListItems,
  anyListDateGetter,
  panelOpen,
);

const listItems = addLoadMore(list, pagination, searchList);

const { onScroll, onUpdated, onLoadMore } = useListScrollEvents(fetchListItems, {
  data: listItems,
  pagination,
  loading: listLoading,
  belowThreshold,
  active,
});

const { getImageSettings } = useExtensionSettingsStore();
const imageSettings = getImageSettings(Route.Watchlist);

const onButtonClick = async ({ request }: { request: Promise<unknown> }) => {
  await request;
  await fetchListItems(undefined, { force: true });
};

const { getEvicted } = useActivityStore();
useWatchActivated(
  watch(getEvicted(Route.Watchlist), async _evicted => {
    if (!_evicted) return;
    if (scrolled.value) return;
    await fetchListItems();
  }),
);

onMounted(() => {
  watch(panelOpen, async value => {
    if (!value && panelDirty.value) await fetchListItems();
  });
  watch(activeList, () => onClick());
});

useActiveAndDocumentVisible({
  onVisible: fetchListItems,
});
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      hide-date
      :items="listItems"
      :loading="listLoading"
      :pagination="pagination"
      :page-size="pageSize"
      :backdrop="imageSettings.backdrop"
      :poster-type="imageSettings.type"
      show-played
      show-watching
      show-collected
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
      @on-scroll-bottom="onScroll"
      @on-updated="onUpdated"
      @onload-more="onLoadMore"
      @on-item-click="onItemClick"
    >
      <template #buttons="{ open, item, loading: itemLoading }">
        <ListButtons
          v-if="isListItemType(item?.type)"
          :disabled="!open"
          :loading="itemLoading"
          :item="item"
          :route="Route.Watchlist"
          @on-click="onButtonClick"
        />
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
