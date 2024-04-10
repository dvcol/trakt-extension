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

import {
  type AnyList,
  anyListDateGetter,
  type AnyListDateTypes,
  useListStore,
  useListStoreRefs,
} from '~/stores/data/list.store';
import { useI18n } from '~/utils';
import { watchUserChange } from '~/utils/store.utils';

const props = defineProps({
  panel: {
    type: Boolean,
    required: false,
  },
});

const { panel } = toRefs(props);

const i18n = useI18n('list');

const {
  filteredListItems,
  pagination,
  listLoading,
  pageSize,
  belowThreshold,
  searchList,
} = useListStoreRefs();
const { fetchListItems, clearState } = useListStore();

watchUserChange({
  fetch: fetchListItems,
  clear: clearState,
});

onMounted(() => {
  watch(panel, async value => {
    if (!value) await fetchListItems();
  });
});

const list = useListScroll<AnyList, AnyListDateTypes>(
  filteredListItems,
  anyListDateGetter,
);

const listItems = addLoadMore(list, pagination, searchList);

const { onScroll, onUpdated, onLoadMore } = useListScrollEvents(fetchListItems, {
  data: listItems,
  pagination,
  loading: listLoading,
  belowThreshold,
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
      :loading="listLoading"
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
