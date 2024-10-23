<script lang="ts" setup>
import { NFlex, NSelect, NText } from 'naive-ui';

import { computed, ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import {
  type DefaultListIds,
  DefaultLists,
  DefaultListsMap,
  type ListEntity,
} from '~/models/list.model';
import { Route } from '~/models/router.model';
import {
  QuickAction,
  QuickActionDate,
  useExtensionSettingsStore,
  useExtensionSettingsStoreRefs,
} from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'actions');

const { enabledTabs } = useExtensionSettingsStoreRefs();
const {
  getAction,
  setAction,
  getActionDate,
  setActionDate,
  getActionList,
  setActionList,
} = useExtensionSettingsStore();

const getActionArray = (tab: Route) => {
  const action = getAction(tab);
  if (!action) return [];
  return Object.entries(action)
    .filter(([, value]) => value)
    .map(([key]) => key);
};

const actionOptions = computed(() =>
  Object.values(QuickAction).map(value => ({
    label: i18n(value, 'common', 'action'),
    value,
  })),
);

type ListOption = { label: string; value: DefaultListIds; list: ListEntity };
const allowedList = {
  [DefaultLists.Watchlist.id]: DefaultLists.Watchlist,
  [DefaultLists.Favorites.id]: DefaultLists.Favorites,
};
const listOptions = computed<ListOption[]>(() =>
  [DefaultLists.Watchlist, DefaultLists.Favorites].map(list => ({
    label: i18n(list.name, 'list'),
    value: list.id,
    list,
  })),
);

const dateOptions = computed(() =>
  Object.values(QuickActionDate).map(value => ({
    label: i18n(value, 'common', 'action', 'date'),
    value,
  })),
);

const container = ref();
</script>

<template>
  <div ref="container" class="actions-container">
    <!--  Quick Action Date Watched -->
    <SettingsFormItem class="form-item" :label="i18n('label__date_watched')">
      <NSelect
        class="date-select"
        :value="getActionDate(QuickAction.Watch)"
        :to="container"
        :options="dateOptions"
        @update:value="v => setActionDate(QuickAction.Watch, DefaultLists[v])"
      />
    </SettingsFormItem>

    <!--  Quick Action Date Collect -->
    <SettingsFormItem class="form-item" :label="i18n('label__date_collected')">
      <NSelect
        class="date-select"
        :value="getActionDate(QuickAction.Collect)"
        :to="container"
        :options="dateOptions"
        @update:value="v => setActionDate(QuickAction.Collect, v)"
      />
    </SettingsFormItem>

    <NText class="description" tag="p">{{ i18n('description') }}</NText>

    <NFlex
      v-for="[tab] in enabledTabs.filter(([tab]) => tab !== Route.Releases)"
      :key="tab"
      class="form-row"
      align="center"
      justify="space-between"
    >
      <NText class="form-header" tag="h3">{{ i18n(tab, 'route') }}</NText>
      <NFlex class="form-selects" align="center" justify="space-around">
        <!--  Quick Action  -->
        <SettingsFormItem class="form-item action-select">
          <NSelect
            :value="getActionArray(tab)"
            :to="container"
            :options="actionOptions"
            multiple
            @update:value="v => setAction(tab, v)"
          />
        </SettingsFormItem>

        <!--  Quick Action List  -->
        <SettingsFormItem class="form-item list-select">
          <NSelect
            :value="getActionList(tab)?.id"
            :to="container"
            :options="listOptions"
            @update:value="
              (v: ListOption['value']) => setActionList(tab, DefaultListsMap[v])
            "
          />
        </SettingsFormItem>
      </NFlex>
    </NFlex>
  </div>
</template>

<style lang="scss" scoped>
.actions-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-row {
    padding: 0.25rem 1rem;
    background: var(--bg-black-soft);
    border: 1px solid var(--white-10);
    border-radius: 0.5rem;
    transition:
      background 0.3s var(--n-bezier),
      border 0.3s var(--n-bezier);

    &:active,
    &:focus-within,
    &:hover {
      border-color: var(--white-15);
    }
  }

  .form-selects {
    flex: 1 1 70%;
  }

  .form-item {
    padding: 0.25rem;
  }

  .form-header {
    flex: 0 1 20%;
  }

  .action-select {
    display: flex;
    flex: 1 1 23rem;

    :deep(.n-form-item-blank) {
      flex: 1 1 auto;
    }
  }

  .list-select {
    display: flex;
    flex: 1 1 8rem;

    :deep(.n-form-item-blank) {
      flex: 1 1 auto;
    }
  }

  .date-select {
    min-width: 10rem;
  }

  .description {
    margin: 0 0 0 0.25rem;
    color: var(--white-70);
    font-weight: 600;
    font-size: 1rem;
    white-space: pre-line;
  }
}
</style>
