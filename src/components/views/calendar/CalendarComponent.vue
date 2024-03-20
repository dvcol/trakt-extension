<script lang="ts" setup>
import { computed, watch } from 'vue';

import FloatingButton from '~/components/common/buttons/FloatingButton.vue';
import { useBackToTop } from '~/components/common/buttons/use-back-to-top';
import ListScroll from '~/components/common/list/ListScroll.vue';
import { useListScroll } from '~/components/common/list/use-list-scroll';
import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useI18n } from '~/utils';
import { watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('calendar');

const { calendar, loading } = useCalendarStoreRefs();
const { fetchCalendar, clearState } = useCalendarStore();

const list = useListScroll(calendar, 'date');

const { scrolled, listRef, onClick } = useBackToTop();

const today = computed(() => {
  return list.value.find(
    item => item.date?.current.toLocaleDateString() === new Date().toLocaleDateString(),
  );
});

watchUserChange({
  mounted: () => {
    const unsub = watch(today, async () => {
      if (!today.value) return;

      const _listRef = listRef.value?.list;
      if (!_listRef) return;

      await _listRef.$nextTick();

      _listRef.scrollTo({
        top: today.value.index * 145,
      });

      unsub();
    });
  },
  fetch: () => fetchCalendar(),
  userChange: active => {
    clearState();
    if (active) fetchCalendar();
  },
});
</script>

<template>
  <div class="container">
    <ListScroll
      ref="listRef"
      :items="list"
      :loading="loading"
      :scroll-threshold="300"
      @on-scroll="scrolled = true"
      @on-scroll-top="scrolled = false"
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
