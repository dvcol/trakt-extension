<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import type {
  VirtualListRef,
  VirtualListScrollToOptions,
} from '~/models/list-scroll.model';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useListScroll } from '~/components/common/list/use-list-scroll';
import IconChevronDown from '~/components/icons/IconChevronDown.vue';
import IconChevronUp from '~/components/icons/IconChevronUp.vue';

import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useI18n } from '~/utils';
import { watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('calendar');

const { calendar, loading, center, filteredCalendar } = useCalendarStoreRefs();
const { fetchCalendar, clearState } = useCalendarStore();

const list = useListScroll(filteredCalendar, 'date');

const centerItem = computed(() => {
  return list.value.find(
    item => item.date?.current.toLocaleDateString() === center.value.toLocaleDateString(),
  );
});

const centerIsToday = computed(() => {
  return (
    centerItem.value?.date?.current.toLocaleDateString() ===
    new Date().toLocaleDateString()
  );
});

const listRef = ref<{ list: VirtualListRef }>();

const scrollTo = (
  options?: VirtualListScrollToOptions,
  index = centerItem.value?.index,
) => {
  if (index === undefined) return;
  if (!listRef.value?.list) return;

  listRef.value?.list.scrollTo({
    top: index * 145,
    ...options,
  });
};

const reload = async () => {
  console.info('reload', center.value);
  const promise = fetchCalendar();
  // watch for loading changes and recenter
  const unsub = watch(list, async () => scrollTo());
  await promise;
  scrollTo();
  unsub();
};

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

const scrolledOut = ref(false);
const scrolledDown = ref(true);
const onClick = () => scrollTo({ behavior: 'smooth' });
const onScrollIntoOutOfView = (_scrolled: boolean, _itemRef?: HTMLDivElement) => {
  scrolledOut.value = _scrolled;
  if (!_scrolled || !_itemRef) return;
  scrolledDown.value = _itemRef.getBoundingClientRect().top > 0;
};
const recenterIcon = computed(() =>
  scrolledDown.value ? IconChevronDown : IconChevronUp,
);

const onScrollTop = async () => {
  const first = list.value[0];
  await fetchCalendar('start');

  listRef.value?.list.scrollTo({
    top: (list.value.findIndex(item => item.id === first.id) - 1) * 145,
  });
};

const onScrollBottom = async () => {
  await fetchCalendar('end');
};

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
