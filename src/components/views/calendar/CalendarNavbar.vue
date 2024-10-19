<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput, NTooltip } from 'naive-ui';

import { computed, defineProps, ref } from 'vue';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconChevron from '~/components/icons/IconChevronDownSmall.vue';

import IconLoop from '~/components/icons/IconLoop.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { useCalendarStore, useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useI18n } from '~/utils/i18n.utils';
import { useDebouncedSearch } from '~/utils/store.utils';

const { reverse } = defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
  reverse: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const i18n = useI18n('navbar', 'calendar');

const { filter, center, loading } = useCalendarStoreRefs();
const { clearState } = useCalendarStore();

const debouncedSearch = useDebouncedSearch(filter);

const pickerValue = computed({
  get: () => center.value.getTime(),
  set: (value: number) => {
    if (!value) return clearState();
    const newDate = value ? new Date(value) : new Date();
    if (newDate.toLocaleDateString() === center.value.toLocaleDateString()) return;
    return clearState(newDate);
  },
});

const external = computed(() => {
  if (pickerValue.value) {
    return ResolveExternalLinks.trakt.calendar(
      new Date(pickerValue.value).toISOString().split('T')[0],
    );
  }
  return ResolveExternalLinks.trakt.calendar();
});

const placement = computed(() => (reverse ? 'top' : 'bottom'));

const open = ref(false);
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :wrap="false">
    <NDatePicker
      v-model:show="open"
      v-model:value="pickerValue"
      class="date-picker"
      type="date"
      :to="parentElement"
      :disabled="loading"
      :placement="placement"
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
      :placement="placement"
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
    <ButtonLinkExternal
      :href="external"
      :label="i18n('calendar', 'common', 'link')"
      :placement="placement"
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.row {
  width: 100%;
  padding: 0 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;

  .date-picker {
    flex: 0 1 33%;
    min-width: fit-content;

    @media (width < 600px) {
      flex: 0 0 8rem;
      min-width: auto;
    }
  }

  .search-input {
    flex: 1 1 33%;
    min-width: 12rem;

    @media (width < 600px) {
      min-width: auto;
    }
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
