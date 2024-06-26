<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { computed, onMounted, type PropType, ref, toRefs } from 'vue';

import IconCheckedList from '~/components/icons/IconCheckedList.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconGridEmpty from '~/components/icons/IconGridEmpty.vue';
import IconListEmpty from '~/components/icons/IconListEmpty.vue';
import IconPlay from '~/components/icons/IconPlay.vue';
import IconPlayFilled from '~/components/icons/IconPlayFilled.vue';
import PanelButtonProgress from '~/components/views/panel/PanelButtonProgress.vue';
import {
  PanelButtonsOption,
  type PanelButtonsOptions,
  usePanelButtons,
} from '~/components/views/panel/use-panel-buttons';
import {
  type ListEntity,
  ListType,
  useListsStore,
  useListsStoreRefs,
} from '~/stores/data/list.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  watched: {
    type: Boolean,
    required: false,
  },
  watchedLoading: {
    type: Boolean,
    required: false,
  },
  collected: {
    type: Boolean,
    required: false,
  },
  collectedLoading: {
    type: Boolean,
    required: false,
  },
  activeLists: {
    type: Array as PropType<ListEntity['id'][]>,
    required: false,
  },
  activeLoading: {
    type: Boolean,
    required: false,
  },
  hasRelease: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onListUpdate', value: ListEntity['id'], remove: boolean): void;
  (e: 'onCollectionUpdate', value: PanelButtonsOptions, date?: number): void;
  (e: 'onWatchedUpdate', value: PanelButtonsOptions, date?: number): void;
}>();

const { watched, collected, activeLoading, activeLists, hasRelease } = toRefs(props);

const onListUpdate = (value: ListEntity['id'] | ListEntity['id'][]) => {
  const newList = Array.isArray(value) ? value : [value];
  const removed = activeLists?.value?.find(id => !newList.includes(id));
  if (removed) emit('onListUpdate', removed, true);
  const added = newList.find(id => !activeLists?.value?.includes(id));
  if (added) emit('onListUpdate', added, false);
};

const onCollectionUpdate = (value: unknown, date?: number) => {
  if (value === PanelButtonsOption.Cancel) return;
  if (value === PanelButtonsOption.Now && date === undefined) date = Date.now();
  emit('onCollectionUpdate', value as PanelButtonsOptions, date);
};

const onWatchedUpdate = (value: unknown, date?: number) => {
  if (value === PanelButtonsOption.Cancel) return;
  if (value === PanelButtonsOption.Now && date === undefined) date = Date.now();
  emit('onWatchedUpdate', value as PanelButtonsOptions, date);
};

const i18n = useI18n('panel', 'buttons');

const root = ref<HTMLDivElement>();

const { removeOptions, timeOptions } = usePanelButtons();

const watchedOptions = computed(() => {
  const _options = watched.value ? removeOptions : timeOptions;
  if (!hasRelease.value) {
    return _options.filter(option => option.value !== PanelButtonsOption.Release);
  }
  return _options;
});

const collectionOptions = computed(() => {
  const _options = collected.value ? removeOptions : timeOptions;
  if (!hasRelease.value) {
    return _options.filter(option => option.value !== PanelButtonsOption.Release);
  }
  return _options;
});

const { lists, listsLoading } = useListsStoreRefs();
const { fetchLists, getIcon } = useListsStore();

const listLoading = computed(() => {
  return listsLoading.value || activeLoading.value;
});

const listOptions = computed(() => {
  return lists.value
    ?.filter(list => [ListType.List, ListType.Watchlist].map(String).includes(list.type))
    .map(list => {
      return {
        label: list.type === ListType.Watchlist ? i18n(list.name) : list.name,
        value: list.id,
        icon: getIcon(list),
      };
    });
});

onMounted(() => {
  fetchLists();
});
</script>

<template>
  <div ref="root" class="panel-buttons">
    <!--  List  -->
    <NFlex class="button-container list" justify="center" align="center">
      <PanelButtonProgress
        :options="listOptions"
        :value="activeLists"
        :select="{
          options: listOptions,
          value: activeLists,
          multiple: true,
          scrollable: true,
        }"
        :tooltip="{
          delay: 500,
        }"
        :icon="activeLists?.length ? IconCheckedList : IconListEmpty"
        :filled="!!activeLists?.length"
        :disabled="listLoading"
        type="warning"
        @on-select="onListUpdate"
      >
        <template #tooltip>
          <NFlex vertical size="small" align="center" justify="center">
            <div>{{ i18n('list_de_sync', 'common', 'tooltip') }}</div>
            <div>{{ i18n('list_click_to_refresh', 'common', 'tooltip') }}</div>
          </NFlex>
        </template>
        {{ i18n(`label__list__${ activeLists?.length ? 'update' : 'add' }`) }}
      </PanelButtonProgress>
    </NFlex>

    <!--  Collection  -->
    <NFlex class="button-container collection" justify="center" align="center">
      <PanelButtonProgress
        :select="{
          options: collectionOptions,
        }"
        :icon="collected ? IconGrid : IconGridEmpty"
        :filled="collected"
        :disabled="collectedLoading"
        type="info"
        @on-select="onCollectionUpdate"
      >
        {{ i18n(`label__collection__${ collected ? 'remove' : 'add' }`) }}
      </PanelButtonProgress>
    </NFlex>

    <!--  History  -->
    <NFlex class="button-container history" justify="center" align="center">
      <PanelButtonProgress
        :select="{
          options: watchedOptions,
        }"
        :icon="watched ? IconPlayFilled : IconPlay"
        :filled="watched"
        :disabled="watchedLoading"
        @on-select="onWatchedUpdate"
      >
        {{ i18n(`label__history__${ watched ? 'remove' : 'add' }`) }}
      </PanelButtonProgress>
    </NFlex>
  </div>
</template>

<style lang="scss" scoped>
.panel-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 1.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.75rem 1rem 1.25rem;

  .button-container {
    i {
      margin-left: calc(0% - var(--n-icon-margin));
    }

    &.history {
      min-width: 10.125rem;
    }

    &.collection {
      min-width: 11.375rem;
    }

    &.list {
      min-width: 8.875rem;
    }
  }
}

@media (width > 800px) {
  .panel-buttons {
    gap: 1.25rem 3rem;
  }
}
</style>
