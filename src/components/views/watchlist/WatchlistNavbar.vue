<script setup lang="ts">
import { NFlex, NIcon, NInput, NSelect, type SelectOption } from 'naive-ui';

import { type Component, computed, defineProps, h, ref } from 'vue';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import IconLoop from '~/components/icons/IconLoop.vue';

import { type ListEntity, ListType } from '~/models/list.model';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useListStoreRefs } from '~/stores/data/list.store';
import { useListsStore, useListsStoreRefs } from '~/stores/data/lists.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useI18n } from '~/utils/i18n.utils';
import {
  useActiveAndDocumentVisible,
  useDebouncedSearch,
  watchUserChange,
} from '~/utils/store.utils';

const i18n = useI18n('navbar', 'list');

const { pageSize, searchList, listLoading } = useListStoreRefs();

const { listsLoading, lists, activeList } = useListsStoreRefs();
const { fetchLists, clearState, getIcon } = useListsStore();

const { user } = useAuthSettingsStoreRefs();

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
      ? i18n(list.name, 'list')
      : list.name,
    value: list.id,
    source: list,
    icon: getIcon(list),
    disabled: listLoading.value,
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

const placement = computed(() => (reverse ? 'top' : 'bottom'));

watchUserChange({
  fetch: fetchLists,
  userChange: ({ active, authenticated }) => {
    clearState();
    if (active && authenticated) fetchLists();
  },
});

useActiveAndDocumentVisible({
  onVisible: fetchLists,
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
  <NFlex class="row" align="center" justify="space-evenly" :wrap="false">
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
      :placement="placement"
      :consistent-menu-width="false"
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
    <NavbarPageSizeSelect
      v-model:page-size="pageSize"
      :parent-element="parentElement"
      :disabled="listLoading"
      :placement="placement"
    />
    <ButtonLinkExternal
      :href="external"
      :label="i18n('list', 'common', 'link')"
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

  .list-select {
    flex: 0 1 33%;
    min-width: fit-content;

    @media (width < 600px) {
      flex: 0 0 8rem;
      min-width: auto;
    }
  }

  .search-input {
    flex: 1 1 auto;
    min-width: 12rem;

    @media (width < 600px) {
      min-width: auto;
    }
  }
}
</style>
