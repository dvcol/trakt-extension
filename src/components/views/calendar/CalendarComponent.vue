<script lang="ts" setup>
import { watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useListScroll } from '~/components/common/list/use-list-scroll';

import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useCalendar, useCenterButton } from '~/utils/calendar.utils';
import { useI18n } from '~/utils/i18n.utils';
import { watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('calendar');

const { loading, center, filteredCalendar } = useCalendarStoreRefs();
const { fetchCalendar, clearState } = useCalendarStore();

const list = useListScroll(filteredCalendar, 'date');

const { centerItem, centerIsToday, scrolledOut, recenterIcon, onScrollIntoOutOfView } =
  useCenterButton({ list, center });

const { listRef, onClick, onScrollTop, onScrollBottom, reload } = useCalendar({
  list,
  centerItem,
  fetchData: fetchCalendar,
});

watch(center, () => reload());

watchUserChange({
  mounted: reload,
  activated: async changed => {
    if (changed) await reload();
  },
  userChange: async active => {
    clearState();
    if (active) await reload();
  },
});

const { onItemClick } = usePanelItem();
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="list"
      :loading="loading"
      backdrop
      :scroll-into-view="centerItem?.id ? [centerItem?.id] : []"
      @on-item-click="onItemClick"
      @on-scroll-into-view="e => onScrollIntoOutOfView(false, e.ref)"
      @on-scroll-out-of-view="e => onScrollIntoOutOfView(true, e.ref)"
      @on-scroll-top="onScrollTop"
      @on-scroll-bottom="onScrollBottom"
    >
      <template #default>
        <!-- TODO buttons here-->
      </template>
    </ListScroll>
    <FloatingButton
      :show="scrolledOut"
      :width="centerIsToday ? '2.5rem' : '3.5rem'"
      :icon="recenterIcon"
      @on-click="onClick"
    >
      {{ i18n(centerIsToday ? 'today' : 'recenter', 'common', 'button') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
