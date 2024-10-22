<script lang="ts" setup>
import { NFlex, type PopselectProps } from 'naive-ui';
import { computed, onMounted, type PropType, ref, toRefs } from 'vue';

import PanelButtonProgress from '~/components/common/panel/PanelButtonProgress.vue';
import PanelSelectProgress from '~/components/common/panel/PanelSelectProgress.vue';
import {
  AllPanelButtonsWatchedOptions,
  getWatchedIcon,
  type PanelButtonsEmit,
  PanelButtonsOption,
  usePanelButtons,
  usePanelButtonsEmit,
} from '~/components/common/panel/use-panel-buttons';
import IconCancel from '~/components/icons/IconCancel.vue';
import IconCheckedList from '~/components/icons/IconCheckedList.vue';
import IconConfirmCircle from '~/components/icons/IconConfirmCircle.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconGridEmpty from '~/components/icons/IconGridEmpty.vue';
import IconListEmpty from '~/components/icons/IconListEmpty.vue';
import IconPlay from '~/components/icons/IconPlay.vue';
import IconPlayFilled from '~/components/icons/IconPlayFilled.vue';

import {
  type EpisodeProgress,
  isSeasonProgress,
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

const emit = defineEmits<
  {
    (e: 'onCheckin', cancel: boolean): void;
  } & PanelButtonsEmit
>();

const {
  mode,
  watchedProgress,
  collectionProgress,
  activeLoading,
  activeLists,
  hasRelease,
  watching,
} = toRefs(props);

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

const hasAiredWatched = computed(() => {
  const _progress = watchedProgress?.value;
  if (!_progress) return false;
  return 'aired' in _progress && _progress.aired > 0;
});

const disableWatchedTooltip = computed(() => {
  return !['show', 'season'].includes(mode.value) || !hasAiredWatched.value;
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
const { onListUpdate, onCollectionUpdate, onWatchedUpdate } = usePanelButtonsEmit(
  emit,
  activeLists,
);

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
      label: list.type === ListType.List ? list.name : i18n(list.name),
      value: list.id,
      icon: getIcon(list),
    })),
);

const watchedConfirmOptions = computed<PopselectProps | undefined>(() => {
  if (mode.value !== 'season') return;
  if (!isSeasonProgress(watchedProgress?.value)) return;
  if (watchedProgress.value.finished) return;
  return {
    options: AllPanelButtonsWatchedOptions.map(option => ({
      label: i18n(option, 'common', 'button', 'panel', 'watched'),
      value: option,
      icon: getWatchedIcon(option),
    })),
  };
});

const collectConfirmOptions = computed<PopselectProps | undefined>(() => {
  if (mode.value !== 'season') return;
  if (!isSeasonProgress(collectionProgress?.value)) return;
  if (collectionProgress.value.completed) return;
  return {
    options: AllPanelButtonsWatchedOptions.map(option => ({
      label: i18n(option, 'common', 'button', 'panel', 'collection'),
      value: option,
      icon: getWatchedIcon(option),
    })),
  };
});

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
        :confirm="collectConfirmOptions"
        type="info"
        @on-select="onCollectionUpdate"
      >
        {{ i18n(`label__collection__${collected ? 'remove' : 'add' }`) }}
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
        :confirm="watchedConfirmOptions"
        @on-select="onWatchedUpdate"
      >
        {{ i18n(`label__history__${watched ? 'remove' : 'add' }`) }}
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
        :icon="watching ? IconCancel : IconConfirmCircle"
        :type="watching ? 'warning' : 'error'"
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
  gap: 1.25rem 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 1rem 1.25rem;

  .button-container {
    margin: auto;
    padding: 0 0.5rem;

    i {
      margin-left: calc(0% - var(--n-icon-margin));
    }

    &.checkin {
      width: 0;
      margin: 0;
      opacity: 0;
      transition:
        width 0.5s var(--n-bezier),
        opacity 0.5s var(--n-bezier),
        scale 0.5s var(--n-bezier),
        margin 0.5s var(--n-bezier);
      scale: 0.9;
      // stylelint-disable-next-line property-no-unknown
      tansition-delay: width 0.25s;

      &.visible {
        width: 7rem;
        margin: auto;
        opacity: 1;
        scale: 1;
        // stylelint-disable-next-line property-no-unknown
        tansition-delay: 0;
      }

      &:not(.visible) {
        padding: 0;
        cursor: default;
        pointer-events: none;
      }
    }
  }
}

@media (width < 660px) {
  .button-container:not(.checkin:not(.visible)) {
    min-width: 45%;
  }
}
</style>
