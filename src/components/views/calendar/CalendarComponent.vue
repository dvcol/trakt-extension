<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import type {
  VirtualListRef,
  VirtualListScrollToOptions,
} from '~/components/common/list/ListScroll.model';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useListScroll } from '~/components/common/list/use-list-scroll';
import IconChevronDown from '~/components/icons/IconChevronDown.vue';
import IconChevronUp from '~/components/icons/IconChevronUp.vue';

import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useI18n } from '~/utils';
import { watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('calendar');

const { calendar, loading } = useCalendarStoreRefs();
const { fetchCalendar, clearState } = useCalendarStore();

const list = useListScroll(calendar, 'date');

const today = computed(() => {
  return list.value.find(
    item => item.date?.current.toLocaleDateString() === new Date().toLocaleDateString(),
  );
});

const listRef = ref<{ list: VirtualListRef }>();

const scrollToToday = (options?: VirtualListScrollToOptions) => {
  if (!today.value) return;
  if (!listRef.value?.list) return;

  listRef.value?.list.scrollTo({
    top: today.value.index * 145,
    ...options,
  });
};

watchUserChange({
  mounted: () => {
    const unsub = watch(today, async () => {
      await listRef.value?.list.$nextTick();
      scrollToToday();
      unsub();
    });
  },
  fetch: () => fetchCalendar(),
  userChange: active => {
    clearState();
    if (active) fetchCalendar();
  },
});

const scrolledOut = ref(false);
const scrolledDown = ref(true);
const onClick = () => scrollToToday({ behavior: 'smooth' });
const onScrollIntoOutOfView = (_scrolled: boolean, _itemRef?: HTMLDivElement) => {
  scrolledOut.value = _scrolled;
  if (!_scrolled || !_itemRef) return;
  scrolledDown.value = _itemRef.getBoundingClientRect().top > 0;
};
const recenterIcon = computed(() =>
  scrolledDown.value ? IconChevronDown : IconChevronUp,
);
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="list"
      :loading="loading"
      :scroll-threshold="300"
      episode
      :scroll-into-view="today?.id ? [today?.id] : []"
      @on-scroll-into-view="e => onScrollIntoOutOfView(false, e.ref)"
      @on-scroll-out-of-view="e => onScrollIntoOutOfView(true, e.ref)"
    >
      <template #default>
        <!-- TODO buttons here-->
      </template>
    </ListScroll>
    <FloatingButton
      :show="scrolledOut"
      width="2.5rem"
      :icon="recenterIcon"
      @on-click="onClick"
    >
      {{ i18n('recenter', 'common', 'button') }}
    </FloatingButton>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
