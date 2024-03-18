<script setup lang="ts">
import { NFlex, NIcon, NInput, NSelect } from 'naive-ui';

import { computed, defineProps } from 'vue';

import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import IconLoop from '~/components/icons/IconLoop.vue';
import {
  useListsStore,
  useListsStoreRefs,
  useListStoreRefs,
} from '~/stores/data/list.store';
import { useI18n } from '~/utils';
import { useDebouncedSearch, watchUserChange } from '~/utils/store.utils';

const i18n = useI18n('navbar_list');

const { pageSize, searchList } = useListStoreRefs();

const { loading, lists, activeList } = useListsStoreRefs();
const { fetchLists, clearState } = useListsStore();

const listOptions = computed(() =>
  lists.value.map((list, i) => ({
    label: ['collection', 'watchlist'].includes(list.type) ? i18n(list.name) : list.name,
    value: JSON.stringify(list),
  })),
);

const selectValue = computed({
  get: () => JSON.stringify(activeList.value),
  set: selected => {
    activeList.value = JSON.parse(selected);
  },
});

const debouncedSearch = useDebouncedSearch(searchList);

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

watchUserChange(fetchLists, clearState);
</script>

<template>
  <NFlex class="row" align="center" justify="center" :vertical="false">
    <NSelect
      v-model:value="selectValue"
      class="list-select"
      :options="listOptions"
      :to="parentElement"
      :loading="loading"
      filterable
    />
    <NInput
      v-model:value="debouncedSearch"
      class="search-input"
      :placeholder="i18n('search', 'navbar')"
      autosize
      clearable
    >
      <template #prefix>
        <NIcon :component="IconLoop" />
      </template>
    </NInput>
    <NavbarPageSizeSelect v-model:page-size="pageSize" :parent-element="parentElement" />
  </NFlex>
</template>

<style lang="scss" scoped>
.row {
  width: 100%;
  padding: 0 0.5rem;

  .list-select {
    flex: 0 1 50%;
  }

  .search-input {
    flex: 1 1 calc(46% - 5rem);
  }
}
</style>
