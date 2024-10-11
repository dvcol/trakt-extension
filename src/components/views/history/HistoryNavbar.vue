<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput } from 'naive-ui';

import { computed, defineProps, ref } from 'vue';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconChevron from '~/components/icons/IconChevronDownSmall.vue';
import IconLoop from '~/components/icons/IconLoop.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { useHistoryStore, useHistoryStoreRefs } from '~/stores/data/history.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { debounce } from '~/utils/debounce.utils';
import { useI18n } from '~/utils/i18n.utils';
import { useDebouncedSearch } from '~/utils/store.utils';

const i18n = useI18n('navbar');

const { searchHistory, historyEnd, historyStart, pageSize, loading } =
  useHistoryStoreRefs();
const { setHistoryRange } = useHistoryStore();

const debouncedSearch = useDebouncedSearch(searchHistory);

const { user } = useAuthSettingsStoreRefs();
const external = computed(() =>
  ResolveExternalLinks.trakt.history({
    user: user.value,
    start: historyStart.value?.toISOString(),
    end: historyEnd.value?.toISOString(),
  }),
);

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

const pickerValues = computed<[number, number] | null>(() => {
  if (!historyStart.value || !historyEnd.value) return null;
  return [historyStart.value.getTime(), historyEnd.value.getTime()];
});

const onDateChange = debounce((values?: [number, number]) => {
  if (!values?.length) return setHistoryRange();
  const [start, end] = values;
  setHistoryRange({ start: new Date(start), end: new Date(end) });
}, 350);

const placement = computed(() => (reverse ? 'top' : 'bottom'));
const open = ref(false);
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :wrap="false">
    <NDatePicker
      v-model:show="open"
      class="date-picker date-range"
      type="daterange"
      :to="parentElement"
      :default-value="[Date.now(), Date.now()]"
      :placement="placement"
      update-value-on-close
      close-on-select
      clearable
      :value="pickerValues"
      :disabled="loading"
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
    <NavbarPageSizeSelect
      v-model:page-size="pageSize"
      :parent-element="parentElement"
      :disabled="loading"
      :placement="placement"
    />
    <ButtonLinkExternal
      :href="external"
      :label="i18n('history', 'common', 'link')"
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
    min-width: 14rem;

    @media (width < 600px) {
      flex: 1 0 7rem;
      min-width: auto;
    }
  }

  .search-input {
    flex: 2 1 calc(46% - 5rem);
    min-width: 12rem;

    @media (width < 600px) {
      min-width: auto;
    }
  }
}
</style>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- library class name */

@use '~/styles/layout' as layout;

.n-date-panel {
  margin-top: 12px;
  margin-left: -16px;

  &.n-date-panel--daterange {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: min(36.5rem, 100dvw);
    max-height: calc(var(--full-height) - #{layout.$safe-header-open-drawer-height});
    overflow: auto;
    scrollbar-width: thin;

    @media (width < 600px) {
      .n-date-panel-calendar--start {
        margin-right: 5.0625rem;
      }

      .n-date-panel-actions {
        flex: 0 1 auto;

        .n-date-panel-actions__suffix {
          flex-direction: column;
        }
      }
    }
  }
}
</style>
