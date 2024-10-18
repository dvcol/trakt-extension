<script lang="ts" setup>
import { onActivated } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';

import {
  useListScroll,
  useListScrollEvents,
} from '~/components/common/list/use-list-scroll';
import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { Route } from '~/models/router.model';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import {
  type SearchResult,
  useSearchStore,
  useSearchStoreRefs,
} from '~/stores/data/search.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import { useActiveAndDocumentVisible } from '~/utils/store.utils';

const i18n = useI18n('search');

const { footerOpen } = useAppStateStoreRefs();

const { searchResults, loading, pagination } = useSearchStoreRefs();
const { fetchSearchResults } = useSearchStore();

const { getImageSettings } = useExtensionSettingsStore();
const imageSettings = getImageSettings(Route.Search);

onActivated(async () => {
  await fetchSearchResults();
});

useActiveAndDocumentVisible({
  onVisible: fetchSearchResults,
});

const list = useListScroll<SearchResult>(searchResults);

const { onScroll } = useListScrollEvents(fetchSearchResults, {
  data: list,
  pagination,
  loading,
});

const { scrolled, listRef, onClick } = useBackToTop();
const { onItemClick } = usePanelItem();
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      hide-date
      :items="list"
      :loading="loading"
      :backdrop="imageSettings.backdrop"
      :poster-type="imageSettings.type"
      show-played
      show-collected
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
      @on-scroll-bottom="onScroll"
      @on-item-click="onItemClick"
    />

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
