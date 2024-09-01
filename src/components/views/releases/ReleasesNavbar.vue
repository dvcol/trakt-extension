<script setup lang="ts">
import { TmdbMovieReleaseType } from '@dvcol/tmdb-http-client/models';
import { NDatePicker, NFlex, NIcon, NSelect, type SelectOption } from 'naive-ui';

import { computed, defineProps, onBeforeMount, ref } from 'vue';

import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconChevron from '~/components/icons/IconChevronDownSmall.vue';
import { useReleasesStore, useReleasesStoreRefs } from '~/stores/data/releases.store';
import { useI18n } from '~/utils/i18n.utils';

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

const i18n = useI18n('navbar', 'releases');

const { center, loading, region, regions, regionLoading, releaseType } =
  useReleasesStoreRefs();
const { clearState, fetchRegions } = useReleasesStore();

const pickerValue = computed({
  get: () => center.value.getTime(),
  set: (value: number) => {
    const newDate = value ? new Date(value) : new Date();
    if (newDate.toLocaleDateString() === center.value.toLocaleDateString()) return;
    clearState(value ? new Date(value) : undefined);
  },
});

const typesOptions = computed<SelectOption[]>(() =>
  Object.entries(TmdbMovieReleaseType).map(([label, value], i) => ({
    label: i18n(label, 'release_type'),
    value,
  })),
);

const regionOptions = computed<SelectOption[]>(() =>
  regions.value.map(_region => ({
    label: _region.native_name || _region.english_name,
    value: _region.iso_3166_1,
  })),
);

const open = ref(false);

onBeforeMount(() => fetchRegions());
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :wrap="false">
    <NSelect
      v-model:value="releaseType"
      class="type-select"
      :options="typesOptions"
      :to="parentElement"
      :disabled="loading"
    />
    <NDatePicker
      v-model:show="open"
      v-model:value="pickerValue"
      class="date-picker"
      type="date"
      :to="parentElement"
      :disabled="loading"
      placement="bottom"
      update-value-on-close
      close-on-select
      clearable
    >
      <template #date-icon>
        <NIcon :component="open ? IconChevron : IconCalendar" />
      </template>
    </NDatePicker>
    <NSelect
      v-model:value="region"
      class="region-select"
      :options="regionOptions"
      :loading="regionLoading"
      :disabled="loading || regionLoading || !regionOptions.length"
      :to="parentElement"
      filterable
      clearable
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.row {
  width: 100%;
  padding: 0 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;

  .type-select {
    flex: 0 0 10rem;
    min-width: fit-content;
  }

  .region-select {
    flex: 1 0 10rem;
    min-width: fit-content;
  }

  .date-picker {
    flex: 2 1 48%;
    min-width: fit-content;
  }
}
</style>

<style lang="scss">
.n-date-panel {
  margin-top: 12px;
  margin-left: -16px;
}
</style>
