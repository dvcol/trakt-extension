<script setup lang="ts">
import { NFlex, NIcon, NInput, NSelect } from 'naive-ui';

import { defineProps, ref } from 'vue';

import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import IconLoop from '~/components/icons/IconLoop.vue';
import { useI18n } from '~/utils';

const i18n = useI18n('navbar');

const activeList = ref('list-watchlist');
const listOptions = [
  { label: 'Movie collection', value: 'collection-movie' },
  { label: 'TV collection', value: 'collection-tv' },
  { label: 'Watchlist', value: 'list-watchlist' },
  { label: 'Personal', value: 'list-personal' },
  { label: 'Collaboration', value: 'list-collaboration' },
];

const pageSize = ref(100);

const debouncedSearch = ref('');

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});
</script>

<template>
  <NFlex class="row" align="center" justify="center" :vertical="false">
    <NSelect
      v-model:value="activeList"
      class="list-select"
      :options="listOptions"
      :to="parentElement"
    />
    <NInput
      v-model:value="debouncedSearch"
      class="search-input"
      :placeholder="i18n('search')"
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
