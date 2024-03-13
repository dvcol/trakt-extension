<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput, NSelect, NTooltip } from 'naive-ui';
import { computed, defineProps, ref, watch } from 'vue';

import type { SelectOption } from 'naive-ui';

import IconLoop from '~/components/icons/IconLoop.vue';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { debounce } from '~/utils/debounce.utils';

const { searchHistory, historyEnd, historyStart, pageSize } = useHistoryStoreRefs();
const { setHistoryRange } = useHistoryStore();

const debouncedSearch = ref(searchHistory.value);

const pageSizeOptions: SelectOption[] = [
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
  { label: '1000', value: 1000 },
];

defineProps({
  parentElement: HTMLElement,
});

watch(searchHistory, () => {
  if (searchHistory.value !== debouncedSearch.value) {
    debouncedSearch.value = searchHistory.value;
  }
});

watch(
  debouncedSearch,
  debounce(() => {
    searchHistory.value = debouncedSearch.value;
  }, 350),
);

const pickerValues = computed<[number, number] | null>(() => {
  if (!historyStart.value || !historyEnd.value) return null;
  return [historyStart.value.getTime(), historyEnd.value.getTime()];
});

const onDateChange = debounce((values?: [number, number]) => {
  if (!values?.length) return setHistoryRange();
  const [start, end] = values;
  setHistoryRange({ start: new Date(start), end: new Date(end) });
}, 350);
</script>

<template>
  <NFlex class="row" align="center" justify="center" :vertical="false">
    <NDatePicker
      class="picker"
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
    />
    <NInput
      v-model:value="debouncedSearch"
      class="input"
      placeholder="Search"
      autosize
      clearable
    >
      <template #prefix>
        <NIcon :component="IconLoop" />
      </template>
    </NInput>
    <NTooltip
      :show-arrow="false"
      placement="bottom"
      :delay="500"
      trigger="hover"
      :to="parentElement"
    >
      <span> Page size </span>
      <template #trigger>
        <NSelect
          v-model:value="pageSize"
          class="empty select"
          :options="pageSizeOptions"
          :to="parentElement"
        />
      </template>
    </NTooltip>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.row {
  width: 100%;

  .picker {
    flex: 0 1 47%;
  }

  .input {
    flex: 0 1 calc(47% - 5rem);
  }

  .select {
    flex: 0 1 5rem;
  }
}
</style>

<style lang="scss">
.n-date-panel {
  margin-top: 12px;
  margin-left: -16px;
}
</style>
