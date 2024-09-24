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
import PanelSelectProgress from '~/components/views/panel/PanelSelectProgress.vue';

import {
  PanelButtonsOption,
  type PanelButtonsOptions,
  usePanelButtons,
} from '~/components/views/panel/use-panel-buttons';
import {
  type EpisodeProgress,
  type SeasonProgress,
  type ShowProgress,
} from '~/models/list-scroll.model';
import { type ListEntity, ListType } from '~/models/list.model';
import { useListsStore, useListsStoreRefs } from '~/stores/data/lists.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  mode: {
    type: String as PropType<'movie' | 'show' | 'season' | 'episode' | 'person'>,
    required: false,
    default: 'show',
  },
  watchedProgress: {
    type: Object as PropType<ShowProgress | SeasonProgress | EpisodeProgress>,
    required: false,
  },
  watchedLoading: {
    type: Boolean,
    required: false,
  },
  collectionProgress: {
    type: Object as PropType<ShowProgress | SeasonProgress | EpisodeProgress>,
    required: false,
  },
  collectionLoading: {
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
  watching: {
    type: Boolean,
    required: false,
  },
  watchProgress: {
    type: Number,
    required: false,
  },
  watchLoading: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onListUpdate', value: ListEntity['id'], remove: boolean): void;
  (e: 'onCollectionUpdate', value: PanelButtonsOptions, date?: number): void;
  (e: 'onWatchedUpdate', value: PanelButtonsOptions, date?: number): void;
  (e: 'onCheckin', cancel: boolean): void;
}>();

const {
  mode,
  watchedProgress,
  collectionProgress,
  activeLoading,
  activeLists,
  hasRelease,
  watching,
} = toRefs(props);

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

const watched = computed(() => {
  const _progress = watchedProgress?.value;
  if (_progress === undefined) return;
  return 'finished' in _progress ? _progress?.finished : _progress?.completed;
});

const watchedPercentage = computed(() => {
  const _progress = watchedProgress?.value;
  if (!_progress) return 0;
  if ('percentage' in _progress) return _progress.percentage;
  return watched.value ? 100 : 0;
});

const hadAiredWatched = computed(() => {
  const _progress = watchedProgress?.value;
  if (!_progress) return false;
  return 'aired' in _progress && _progress.aired > 0;
});

const disableWatchedTooltip = computed(() => {
  return !['show', 'season'].includes(mode.value) || !hadAiredWatched.value;
});

const collected = computed(() => {
  const _progress = collectionProgress?.value;
  if (_progress === undefined) return;
  return 'finished' in _progress ? _progress?.finished : _progress?.completed;
});

const collectionPercentage = computed(() => {
  const _progress = collectionProgress?.value;
  if (!_progress) return 0;
  if ('percentage' in _progress) return _progress.percentage;
  return collected.value ? 100 : 0;
});

const hadAiredCollection = computed(() => {
  const _progress = collectionProgress?.value;
  if (!_progress) return false;
  return 'aired' in _progress && _progress.aired > 0;
});

const disableCollectionTooltip = computed(() => {
  return !['show', 'season'].includes(mode.value) || !hadAiredCollection.value;
});

const i18n = useI18n('panel', 'buttons');

const root = ref<HTMLDivElement>();

const { removeOptions, mixedOptions, timeOptions } = usePanelButtons();

const watchedOptions = computed(() => {
  const _options = [];
  if (watched.value) _options.push(...removeOptions);
  else if (watchedPercentage.value > 0 && watchedPercentage.value < 100) {
    _options.push(...mixedOptions);
  } else {
    _options.push(...timeOptions);
  }
  if (!hasRelease.value) {
    return _options.filter(option => option.value !== PanelButtonsOption.Release);
  }
  return _options;
});

const collectionOptions = computed(() => {
  const _options = [];
  if (collected.value) _options.push(...removeOptions);
  else if (collectionPercentage.value > 0 && collectionPercentage.value < 100) {
    _options.push(...mixedOptions);
  } else {
    _options.push(...timeOptions);
  }
  if (!hasRelease.value) {
    return _options.filter(option => option.value !== PanelButtonsOption.Release);
  }
  return _options;
});

const { myLists, listsLoading } = useListsStoreRefs();
const { fetchLists, getIcon } = useListsStore();

const listLoading = computed(() => {
  return listsLoading.value || activeLoading.value;
});

const listOptions = computed(
  () =>
    myLists.value?.map(list => ({
      label: list.type === ListType.Watchlist ? i18n(list.name) : list.name,
      value: list.id,
      icon: getIcon(list),
    })),
);

const onCheckin = () => emit('onCheckin', watching.value);

onMounted(() => fetchLists());
</script>

<template>
  <div ref="root" class="panel-buttons">
    <!--  List  -->
    <NFlex class="button-container list" justify="center" align="center">
      <PanelSelectProgress
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
        :loading="listLoading"
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
      </PanelSelectProgress>
    </NFlex>

    <!--  Collection  -->
    <NFlex class="button-container collection" justify="center" align="center">
      <PanelSelectProgress
        :select="{
          options: collectionOptions,
        }"
        :tooltip="{
          disabled: disableCollectionTooltip,
          type: 'collection',
        }"
        :icon="collected ? IconGrid : IconGridEmpty"
        :progress="collectionProgress"
        :percentage="collectionPercentage"
        :filled="collected"
        :loading="collectionLoading"
        type="info"
        @on-select="onCollectionUpdate"
      >
        {{ i18n(`label__collection__${ collected ? 'remove' : 'add' }`) }}
      </PanelSelectProgress>
    </NFlex>

    <!--  History  -->
    <NFlex class="button-container history" justify="center" align="center">
      <PanelSelectProgress
        :select="{
          options: watchedOptions,
        }"
        :tooltip="{
          disabled: disableWatchedTooltip,
        }"
        :icon="watched ? IconPlayFilled : IconPlay"
        :progress="watchedProgress"
        :percentage="watchedPercentage"
        :filled="watched"
        :loading="watchedLoading"
        @on-select="onWatchedUpdate"
      >
        {{ i18n(`label__history__${ watched ? 'remove' : 'add' }`) }}
      </PanelSelectProgress>
    </NFlex>

    <!--  Check-in  -->
    <NFlex
      class="button-container checkin"
      :class="{ visible: mode === 'episode' }"
      justify="center"
      align="center"
    >
      <PanelButtonProgress
        :percentage="watching ? watchProgress : 0"
        :loading="watchLoading"
        @click="onCheckin"
      >
        {{ i18n(watching ? 'cancel' : 'checkin', 'common', 'button') }}
      </PanelButtonProgress>
    </NFlex>
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/transition' as transition;
@include transition.scale;

.panel-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 1rem 1rem 1.25rem;

  .button-container {
    i {
      margin-left: calc(0% - var(--n-icon-margin));
    }

    &.checkin {
      width: 0;
      opacity: 0;
      scale: 0.9;
      // stylelint-disable-next-line property-no-unknown
      tansition-delay: width 0.25s;
      transition:
        width 0.5s var(--n-bezier),
        opacity 0.5s var(--n-bezier),
        scale 0.5s var(--n-bezier);

      &.visible {
        width: 7rem;
        opacity: 1;
        scale: 1;
        // stylelint-disable-next-line property-no-unknown
        tansition-delay: 0;
      }
    }
  }
}

@media (width < 660px) {
  .button-container {
    min-width: 45%;
  }
}
</style>
