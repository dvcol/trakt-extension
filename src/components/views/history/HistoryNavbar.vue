<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput } from 'naive-ui';
import { computed, defineProps, ref, watch } from 'vue';

import IconLoop from '~/components/icons/IconLoop.vue';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { debounce } from '~/utils/debounce.utils';

const { searchHistory, historyEnd, historyStart } = useHistoryStoreRefs();
const { setHistoryRange } = useHistoryStore();

const debouncedSearch = ref(searchHistory.value);

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
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.row {
  width: 100%;

  .picker {
    flex: 0 1 48%;
  }

  .input {
    flex: 0 1 48%;
  }
}
</style>

<style lang="scss">
@use '~/styles/mixin' as mixin;

.n-date-panel {
  @include mixin.hover-background(rgb(0 0 0 / 80%), rgb(0 0 0 / 90%));

  margin-top: 12px;
  margin-left: -16px;
}
</style>
