<script setup lang="ts">
import { NFlex, NIcon, NInput, NSelect, type SelectOption } from 'naive-ui';

import { type Component, computed, defineProps, h, ref } from 'vue';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import IconLoop from '~/components/icons/IconLoop.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import {
  type ListEntity,
  ListType,
  useListsStore,
  useListsStoreRefs,
  useListStoreRefs,
} from '~/stores/data/list.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { useI18n } from '~/utils';
import { useDebouncedSearch, watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('navbar', 'list');

const { pageSize, searchList } = useListStoreRefs();

const { listsLoading, lists, activeList } = useListsStoreRefs();
const { fetchLists, clearState, getIcon } = useListsStore();

const { user } = useUserSettingsStoreRefs();

const external = computed(() => {
  switch (activeList.value.type) {
    case ListType.Watchlist:
      return ResolveExternalLinks.trakt.watchlist(user.value);
    case ListType.Favorites:
      return ResolveExternalLinks.trakt.favorites(user.value);
    case ListType.Collection:
      return ResolveExternalLinks.trakt.collection(user.value, activeList.value.scope);
    case ListType.List:
      return ResolveExternalLinks.trakt.list(user.value, activeList.value.name);
    default:
      return '';
  }
});

type ListOption = SelectOption & { source: ListEntity; icon: Component };
const listOptions = computed<ListOption[]>(() =>
  lists.value.map((list, i) => ({
    label: [ListType.Collection, ListType.Watchlist, ListType.Favorites]
      .map(String)
      .includes(list.type)
      ? i18n(list.name)
      : list.name,
    value: list.id,
    source: list,
    icon: getIcon(list),
  })),
);

const selectedIcon = computed(
  () => listOptions.value.find(o => o.value === activeList.value.id)?.icon,
);

const selectValue = computed({
  get: () => activeList.value.id,
  set: selected => {
    activeList.value = lists.value.find(l => l.id === selected)!;
  },
});

const debouncedSearch = useDebouncedSearch(searchList);

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

watchUserChange({
  fetch: fetchLists,
  userChange: active => {
    clearState();
    if (active) fetchLists();
  },
});

const open = ref(false);

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
const renderTag = ({ option }: { option: SelectOption }) => option.label?.toString();
</script>

<template>
  <NFlex class="row" align="center" justify="center" :vertical="false">
    <NSelect
      v-model:value="selectValue"
      v-model:show="open"
      class="list-select"
      :options="listOptions"
      :to="parentElement"
      :loading="listsLoading"
      :render-label="renderLabel"
      :render-tag="renderTag"
      filterable
    >
      <template #arrow>
        <NIcon :component="open ? IconLoop : selectedIcon" />
      </template>
    </NSelect>
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
    <NavbarPageSizeSelect v-model:page-size="pageSize" :parent-element="parentElement" />
    <ButtonLinkExternal :href="external" :label="i18n('list', 'common', 'link')" />
  </NFlex>
</template>

<style lang="scss" scoped>
.row {
  width: 100%;
  padding: 0 0.5rem;

  .list-select {
    flex: 0 1 33%;
  }

  .search-input {
    flex: 1 1 calc(56% - 5rem);
  }
}
</style>
