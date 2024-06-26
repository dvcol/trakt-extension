<script lang="ts" setup>
import { NSelect, NSwitch } from 'naive-ui';

import { computed, ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { pageSizeOptions } from '~/models/page-size.model';
import { Route } from '~/models/router.model';
import { useHistoryStoreRefs } from '~/stores/data/history.store';
import { useListStoreRefs } from '~/stores/data/list.store';
import { useSearchStoreRefs } from '~/stores/data/search.store';
import {
  useExtensionSettingsStore,
  useExtensionSettingsStoreRefs,
} from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'tabs');

const { enabledTabs, restoreRoute, routeDictionary, restorePanel, defaultTab } =
  useExtensionSettingsStoreRefs();
const { toggleTab } = useExtensionSettingsStore();

const { pageSize: historyPageSize } = useHistoryStoreRefs();
const { pageSize: listPageSize } = useListStoreRefs();
const { pageSize: searchPageSize } = useSearchStoreRefs();

const tabsOptions = computed(() =>
  enabledTabs.value.map(([route, state]) => ({
    label: i18n(route, 'route'),
    value: route,
    disabled: !state,
  })),
);

const disabled = computed(
  () => enabledTabs.value.filter(([_, state]) => state).length <= 1,
);

const container = ref();
</script>

<template>
  <div ref="container" class="tabs-container">
    <!--  Default tab  -->
    <SettingsFormItem :label="i18n('label_default_tab')">
      <NSelect
        v-model:value="defaultTab"
        class="default-tab"
        :to="container"
        :options="tabsOptions"
      />
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

    <!--  Enable tabs  -->
    <SettingsFormItem
      v-for="[route, state] of enabledTabs"
      :key="route"
      :label="i18n(`label_route_${ route }`)"
      :warning="
        state && route === Route.Progress
          ? i18n(`label_route_${ route }_warning`)
          : undefined
      "
    >
      <NSwitch
        :value="state"
        class="form-switch"
        :disabled="state && disabled"
        @update:value="toggleTab(route)"
      >
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Page Size  -->
    <SettingsFormItem :label="i18n('label_history_page_size')">
      <NSelect
        v-model:value="historyPageSize"
        :disabled="!routeDictionary.history"
        class="form-select"
        :to="container"
        :options="pageSizeOptions"
      />
    </SettingsFormItem>

    <SettingsFormItem :label="i18n('label_list_page_size')">
      <NSelect
        v-model:value="listPageSize"
        :disabled="!routeDictionary.watchlist"
        class="form-select"
        :to="container"
        :options="pageSizeOptions"
      />
    </SettingsFormItem>

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

  .form-switch {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    min-width: 5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }
}

.form-select {
  min-width: 5.5rem;
}

.default-tab {
  min-width: 7rem;
}
</style>
