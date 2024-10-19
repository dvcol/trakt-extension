<script setup lang="ts">
import { TmdbMovieReleaseType } from '@dvcol/tmdb-http-client/models';
import { NDatePicker, NFlex, NIcon, NSelect, type SelectOption } from 'naive-ui';

import { computed, defineProps, onActivated, ref } from 'vue';

import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconChevron from '~/components/icons/IconChevronDownSmall.vue';
import { useReleasesStore, useReleasesStoreRefs } from '~/stores/data/releases.store';
import { useI18n } from '~/utils/i18n.utils';
import { useActiveAndDocumentVisible } from '~/utils/store.utils';

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

const i18n = useI18n('navbar', 'releases');

const { center, loading, region, regions, regionLoading, releaseType } =
  useReleasesStoreRefs();
const { clearState, fetchRegions } = useReleasesStore();

const pickerValue = computed({
  get: () => center.value.getTime(),
  set: (value: number) => {
    if (!value) return clearState();
    const newDate = value ? new Date(value) : new Date();
    if (newDate.toLocaleDateString() === center.value.toLocaleDateString()) return;
    clearState(newDate);
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

const placement = computed(() => (reverse ? 'top' : 'bottom'));
const open = ref(false);

onActivated(() => fetchRegions());

useActiveAndDocumentVisible({
  onVisible: fetchRegions,
});
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :wrap="false">
    <NSelect
      v-model:value="releaseType"
      class="type-select"
      :options="typesOptions"
      :to="parentElement"
      :disabled="loading"
      :placement="placement"
    />
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
    <NSelect
      v-model:value="region"
      class="region-select"
      :options="regionOptions"
      :loading="regionLoading"
      :disabled="loading || regionLoading || !regionOptions.length"
      :consistent-menu-width="false"
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

    @media (width < 600px) {
      flex: 0 0 7rem;
      min-width: auto;
    }
  }

  .region-select {
    flex: 1 0 10rem;
    min-width: fit-content;

    @media (width < 600px) {
      flex: 2 0 6rem;
      min-width: auto;
    }
  }

  .date-picker {
    flex: 2 1 48%;
    min-width: fit-content;

    @media (width < 600px) {
      flex: 1 0 8rem;
      min-width: auto;
    }
  }
}
</style>

<style lang="scss">
.n-date-panel {
  margin-top: 12px;
  margin-left: -16px;
}
</style>
