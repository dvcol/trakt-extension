<script lang="ts" setup>
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NIcon, NSelect, NSwitch, type SelectOption } from 'naive-ui';

import { type Component, computed, h, onBeforeMount, ref, watch } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { type ListEntity, ListType } from '~/models/list.model';
import { loadingHysteresisOptions } from '~/models/loading-hysteresis.model';
import { NavbarPosition } from '~/models/navbar-position.model';
import { pageSizeOptions, pageSizeOptionsWithZero } from '~/models/page-size.model';
import { ProgressType } from '~/models/progress-type.model';
import { Route } from '~/models/router.model';
import { useCalendarStoreRefs } from '~/stores/data/calendar.store';
import { useHistoryStoreRefs } from '~/stores/data/history.store';
import { useListStoreRefs } from '~/stores/data/list.store';
import { useListsStore, useListsStoreRefs } from '~/stores/data/lists.store';
import { useMovieStoreRefs } from '~/stores/data/movie.store';
import { useRatingsStoreRefs } from '~/stores/data/ratings.store';
import { useSearchStoreRefs } from '~/stores/data/search.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import {
  useExtensionSettingsStore,
  useExtensionSettingsStoreRefs,
} from '~/stores/settings/extension.store';
import { defaultUser } from '~/stores/settings/user.store';
import { useI18n } from '~/utils/i18n.utils';
import { useWatchActivated } from '~/utils/vue.utils';

const i18n = useI18n('settings', 'tabs');

const { toggleTab } = useExtensionSettingsStore();

const {
  enabledTabs,
  restoreRoute,
  routeDictionary,
  restorePanel,
  defaultTab,
  loadLists,
  loadListsPageSize,
  progressType,
  enableRatings,
  loadingHysteresis,
  navbarPosition,
  iconOnly,
} = useExtensionSettingsStoreRefs();

const { getIcon, fetchLists } = useListsStore();
const { myLists, listsLoading } = useListsStoreRefs();

const selectedLists = computed({
  get: () => loadLists.value.map(({ id }) => id),
  set: selected => {
    loadLists.value = myLists.value.filter(({ id }) => selected.includes(id));
  },
});

type ListOption = SelectOption & { source: ListEntity; icon: Component };
const listOptions = computed<ListOption[]>(() =>
  myLists.value.map((list, i) => ({
    label: list.type === ListType.List ? list.name : i18n(list.name, 'list'),
    value: list.id,
    source: list,
    icon: getIcon(list),
  })),
);

const navbarOptions = computed<SelectOption[]>(() =>
  Object.values(NavbarPosition).map(value => ({
    label: i18n(value, 'common', 'navbar_position'),
    value,
  })),
);

const loadingOption = computed(() =>
  loadingHysteresisOptions.map(({ label, value }) => ({
    label:
      typeof label === 'string' ? i18n(label, 'common', 'loading', 'hysteresis') : label,
    value,
  })),
);

const renderLabel = (option: ListOption) => [
  h(NIcon, {
    style: {
      verticalAlign: '-0.2em',
      marginRight: '0.7em',
    },
    component: option.icon,
  }),
  option.label?.toString(),
];

onBeforeMount(() => {
  fetchLists();
});

const { user } = useAuthSettingsStoreRefs();
useWatchActivated(
  watch(user, async _user => {
    if (!_user || _user === defaultUser) return;
    await fetchLists();
  }),
);

const { init: initMovie } = useMovieStoreRefs();
const { pageSize: historyPageSize, init: initHistory } = useHistoryStoreRefs();
const { pageSize: listPageSize } = useListStoreRefs();
const { pageSize: searchPageSize } = useSearchStoreRefs();
const { pageSize: ratingPageSize } = useRatingsStoreRefs();

const pageSizeLoadListWarning = computed(() => {
  if (!loadLists.value.length) return i18n('label_load_lists_warning');
  if (!loadListsPageSize.value) return i18n('label_page_size_warning');
  return undefined;
});

const tabsOptions = computed(() =>
  enabledTabs.value.map(([route, state]) => ({
    label: i18n(route, 'route'),
    value: route,
    disabled: !state,
  })),
);

const progressTypeOptions = Object.values(ProgressType).map(pt => ({
  label: i18n(`type__${pt}`, 'progress'),
  value: pt,
}));

const disabled = computed(
  () => enabledTabs.value.filter(([_, state]) => state).length <= 1,
);

const { extended: calendarExtended } = useCalendarStoreRefs();
const { extended: historyExtended } = useHistoryStoreRefs();

const container = ref();
</script>

<template>
  <div ref="container" class="tabs-container">
    <!--  Navbar Positon  -->
    <SettingsFormItem :label="i18n('label_navbar_position')">
      <NSelect
        v-model:value="navbarPosition"
        class="navbar-position"
        :to="container"
        :options="navbarOptions"
      />
    </SettingsFormItem>

    <!--  Default tab  -->
    <SettingsFormItem :label="i18n('label_default_tab')">
      <NSelect
        v-model:value="defaultTab"
        class="default-tab"
        :to="container"
        :options="tabsOptions"
      />
    </SettingsFormItem>

    <!--  Load lists in panel  -->
    <SettingsFormItem :label="i18n('label_load_lists')">
      <NSelect
        v-model:value="selectedLists"
        class="list-select"
        :to="container"
        :options="listOptions"
        :loading="listsLoading"
        :disabled="listsLoading"
        :render-label="renderLabel"
        :max-tag-count="1"
        :ellipsis-tag-popover-props="{ disabled: true }"
        multiple
      />
    </SettingsFormItem>
    <!--  Loading bar  -->
    <SettingsFormItem :label="i18n('label_loading_bar')">
      <NSelect
        v-model:value="loadingHysteresis"
        class="loading-bar"
        :to="container"
        :options="loadingOption"
      />
    </SettingsFormItem>

    <!--  Icon Only  -->
    <SettingsFormItem :label="i18n('label_icon_only')">
      <NSwitch v-model:value="iconOnly" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Restore tab  -->
    <SettingsFormItem :label="i18n('label_restore_tab')">
      <NSwitch v-model:value="restoreRoute" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Restore panel  -->
    <SettingsFormItem :label="i18n('label_restore_panel')">
      <NSwitch v-model:value="restorePanel" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Movie init  -->
    <SettingsFormItem
      :label="i18n('label_movie_init')"
      :warning="i18n('label_init_warning')"
      :show-warning="initMovie"
    >
      <NSwitch v-model:value="initMovie" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Enable tabs  -->
    <div
      v-for="[route, state] of enabledTabs"
      :key="route"
      class="tab-group"
      :class="{ collapsed: !state }"
    >
      <SettingsFormItem
        :label="i18n(`label_route_${route}`)"
        :warning="i18n(`label_route_${ route }_warning`)"
        :show-warning="state && [Route.Progress, Route.Releases].includes(route)"
      >
        <NSwitch
          :value="state"
          class="form-switch"
          :disabled="
            (state && disabled) || (Route.Progress === route && !chromeRuntimeId)
          "
          @update:value="toggleTab(route)"
        >
          <template #checked>{{ i18n('on', 'common', 'button') }}</template>
          <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
        </NSwitch>
      </SettingsFormItem>

      <!--  Progress Type  -->
      <SettingsFormItem
        v-if="route === Route.Progress"
        :class="{ show: state }"
        class="hidden-form-item"
        :label="i18n('label_progress_type')"
      >
        <NSelect
          v-model:value="progressType"
          class="progress-type"
          :to="container"
          :options="progressTypeOptions"
        />
      </SettingsFormItem>

      <!--  Calendar Extended  -->
      <SettingsFormItem
        v-if="route === Route.Calendar"
        :class="{ show: state }"
        class="hidden-form-item"
        :label="i18n('label_calendar_extended')"
        :warning="i18n('label_extended_warning')"
        :show-warning="calendarExtended"
      >
        <NSwitch v-model:value="calendarExtended" class="form-switch">
          <template #checked>{{ i18n('on', 'common', 'button') }}</template>
          <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
        </NSwitch>
      </SettingsFormItem>

      <!--  History Extended  -->
      <SettingsFormItem
        v-if="route === Route.History"
        :label="i18n('label_history_extended')"
        :class="{ show: state }"
        class="hidden-form-item"
        :warning="i18n('label_extended_warning')"
        :show-warning="historyExtended"
      >
        <NSwitch v-model:value="historyExtended" class="form-switch">
          <template #checked>{{ i18n('on', 'common', 'button') }}</template>
          <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
        </NSwitch>
      </SettingsFormItem>

      <!--  History init  -->
      <SettingsFormItem
        v-if="route === Route.History"
        :label="i18n('label_history_init')"
        :class="{ show: state }"
        class="hidden-form-item"
        :warning="i18n('label_init_warning')"
        :show-warning="initHistory"
      >
        <NSwitch v-model:value="initHistory" class="form-switch">
          <template #checked>{{ i18n('on', 'common', 'button') }}</template>
          <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
        </NSwitch>
      </SettingsFormItem>
    </div>

    <!--  Enable Ratings  -->
    <SettingsFormItem
      :label="i18n('label_enable_ratings')"
      :warning="i18n('label_enable_ratings_warning')"
      :show-warning="enableRatings"
    >
      <NSwitch v-model:value="enableRatings" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Rating Page Sizes  -->
    <SettingsFormItem
      :label="i18n('label_ratings_page_size')"
      :warning="i18n('label_page_size_warning')"
      :show-warning="!ratingPageSize"
    >
      <NSelect
        v-model:value="ratingPageSize"
        :disabled="!enableRatings"
        class="form-select"
        :to="container"
        :options="pageSizeOptionsWithZero"
      />
    </SettingsFormItem>

    <!--  History Page Sizes  -->
    <SettingsFormItem :label="i18n('label_history_page_size')">
      <NSelect
        v-model:value="historyPageSize"
        :disabled="!routeDictionary.history"
        class="form-select"
        :to="container"
        :options="pageSizeOptions"
      />
    </SettingsFormItem>

    <!--  List Page Sizes  -->
    <SettingsFormItem :label="i18n('label_list_page_size')">
      <NSelect
        v-model:value="listPageSize"
        :disabled="!routeDictionary.watchlist"
        class="form-select"
        :to="container"
        :options="pageSizeOptions"
      />
    </SettingsFormItem>

    <!--  Load List Page Sizes  -->
    <SettingsFormItem
      :label="i18n('label_load_lists_page_size')"
      :warning="pageSizeLoadListWarning"
    >
      <NSelect
        v-model:value="loadListsPageSize"
        :disabled="!loadLists.length"
        class="form-select"
        :to="container"
        :options="pageSizeOptionsWithZero"
      />
    </SettingsFormItem>

    <!--  Search page size  -->
    <SettingsFormItem :label="i18n('label_search_page_size')">
      <NSelect
        v-model:value="searchPageSize"
        :disabled="!routeDictionary.search"
        class="form-select"
        :to="container"
        :options="pageSizeOptions"
      />
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-button,
  .form-switch {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    min-width: 5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }

  .tab-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: gap 0.3s var(--n-bezier);

    &.collapsed {
      gap: 0;
    }
  }
}

.form-select {
  min-width: 5.5rem;
}

.loading-bar {
  width: 10rem;
}

.hidden-form-item {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s var(--n-bezier),
    opacity 0.3s var(--n-bezier);

  &.show {
    max-height: 6rem;
    opacity: 1;
  }
}

.navbar-position,
.default-tab,
.list-select {
  width: 12.5rem;
}

.progress-type {
  width: 6rem;
}
</style>
