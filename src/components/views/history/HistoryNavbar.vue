<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput } from 'naive-ui';

import { computed, defineProps, ref } from 'vue';

import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconChevron from '~/components/icons/IconChevronDownSmall.vue';
import IconLoop from '~/components/icons/IconLoop.vue';

import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useI18n } from '~/utils';
import { debounce } from '~/utils/debounce.utils';
import { useDebouncedSearch } from '~/utils/store.utils';

const i18n = useI18n('navbar');

const { searchHistory, historyEnd, historyStart, pageSize } = useHistoryStoreRefs();
const { setHistoryRange } = useHistoryStore();

const debouncedSearch = useDebouncedSearch(searchHistory);

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

const pickerValues = computed<[number, number] | null>(() => {
  if (!historyStart.value || !historyEnd.value) return null;
  return [historyStart.value.getTime(), historyEnd.value.getTime()];
});

const onDateChange = debounce((values?: [number, number]) => {
  if (!values?.length) return setHistoryRange();
  const [start, end] = values;
  setHistoryRange({ start: new Date(start), end: new Date(end) });
}, 350);

const open = ref(false);
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :vertical="false">
    <NDatePicker
      v-model:show="open"
      class="date-picker"
      type="daterange"
      :to="parentElement"
      :default-value="[Date.now(), Date.now()]"
      placement="bottom"
      update-value-on-close
      close-on-select
      clearable
      :value="pickerValues"
      :on-clear="onDateChange"
      :on-confirm="onDateChange"
    >
      <template #date-icon>
        <NIcon :component="open ? IconChevron : IconCalendar" />
      </template>
    </NDatePicker>
    <NInput
      v-model:value="debouncedSearch"
      class="search-input"
      :placeholder="i18n('filter')"
      autosize
      clearable
    >
      <template #prefix>
        <NIcon :component="IconLoop" />
      </template>
    </NInput>
    <NavbarPageSizeSelect v-model:page-size="pageSize" :parent-element="parentElement" />
  </NFlex>
</template>

<style lang="scss" scoped>
.row {
  width: 100%;
  padding: 0 0.5rem;

  .date-picker {
    flex: 0 1 50%;
  }

  .search-input {
    flex: 1 1 calc(46% - 5rem);
  }
}
</style>

<style lang="scss">
.n-date-panel {
  margin-top: 12px;
  margin-left: -16px;
}
</style>
