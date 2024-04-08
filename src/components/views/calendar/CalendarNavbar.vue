<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput, NTooltip } from 'naive-ui';

import { computed, defineProps, ref } from 'vue';

import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconChevron from '~/components/icons/IconChevronDownSmall.vue';

import IconLoop from '~/components/icons/IconLoop.vue';

import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useI18n } from '~/utils';
import { useDebouncedSearch } from '~/utils/store.utils';

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

const i18n = useI18n('navbar', 'calendar');

const { filter, center } = useCalendarStoreRefs();
const { clearState } = useCalendarStore();

const debouncedSearch = useDebouncedSearch(filter);

const pickerValue = computed({
  get: () => center.value.getTime(),
  set: (value: number) => {
    const newDate = value ? new Date(value) : new Date();
    if (newDate.toLocaleDateString() === center.value.toLocaleDateString()) return;
    console.info('pickerValue', new Date(value));
    clearState(value ? new Date(value) : undefined);
  },
});

const open = ref(false);
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :vertical="false">
    <NDatePicker
      v-model:show="open"
      v-model:value="pickerValue"
      class="date-picker"
      type="date"
      :to="parentElement"
      placement="bottom"
      update-value-on-close
      close-on-select
      clearable
    >
      <template #date-icon>
        <NIcon :component="open ? IconChevron : IconCalendar" />
      </template>
    </NDatePicker>
    <NTooltip
      class="calendar-tooltip"
      :show-arrow="false"
      placement="bottom"
      :delay="100"
      trigger="focus"
      :to="parentElement"
    >
      <span> {{ i18n('fetch_disable') }} </span>
      <template #trigger>
        <NInput
          v-model:value="debouncedSearch"
          class="search-input"
          :placeholder="i18n('filter', 'navbar')"
          autosize
          clearable
        >
          <template #prefix>
            <NIcon :component="IconLoop" />
          </template>
        </NInput>
      </template>
    </NTooltip>
  </NFlex>
</template>

<style lang="scss" scoped>
.row {
  width: 100%;
  padding: 0 0.5rem;

  .date-picker {
    flex: 0 1 48%;
  }

  .search-input {
    flex: 1 1 50%;
  }
}
</style>

<style lang="scss">
.calendar-tooltip.calendar-tooltip {
  margin-top: 12px;
}

.n-date-panel {
  margin-top: 12px;
  margin-left: -16px;
}
</style>
