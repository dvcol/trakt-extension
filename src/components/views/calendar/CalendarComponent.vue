<script lang="ts" setup>
import { watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useListScroll } from '~/components/common/list/use-list-scroll';
import { usePanelItem } from '~/components/common/panel/use-panel-item';
import { Route } from '~/models/router.model';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useActivityStore } from '~/stores/data/activity.store';
import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useCalendar, useCenterButton } from '~/utils/calendar.utils';
import { useI18n } from '~/utils/i18n.utils';
import { useActiveAndDocumentVisible, watchUserChange } from '~/utils/store.utils';
import { useWatchActivated } from '~/utils/vue.utils';

const i18n = useI18n('calendar');

const { footerOpen } = useAppStateStoreRefs();

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

const { getImageSettings } = useExtensionSettingsStore();
const imageSettings = getImageSettings(Route.Calendar);

watch(center, (_is, _was) => {
  if (new Date(_is).toLocaleDateString() === new Date(_was).toLocaleDateString()) return;
  reload();
});

const { getEvicted } = useActivityStore();
useWatchActivated(
  watch(getEvicted(Route.Calendar), async _evicted => {
    if (!_evicted) return;
    if (scrolledOut.value) return;
    await reload();
  }),
);

watchUserChange({
  mounted: reload,
  activated: async changed => {
    if (changed) await reload();
  },
  userChange: async ({ active, authenticated }) => {
    clearState();
    if (!active || !authenticated) return;
    await reload();
  },
});

useActiveAndDocumentVisible({
  onVisible: fetchCalendar,
});

const { onItemClick } = usePanelItem();
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="list"
      :loading="loading"
      :backdrop="imageSettings.backdrop"
      :poster-type="imageSettings.type"
      show-played
      show-collected
      show-tag-loader
      overscroll="none"
      :scroll-into-view="centerItem?.id ? [centerItem?.id] : []"
      @on-item-click="onItemClick"
      @on-scroll-into-view="e => onScrollIntoOutOfView(false, e.ref)"
      @on-scroll-out-of-view="e => onScrollIntoOutOfView(true, e.ref)"
      @on-scroll-top="onScrollTop"
      @on-scroll-bottom="onScrollBottom"
    />
    <FloatingButton
      :show="!footerOpen && scrolledOut"
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
