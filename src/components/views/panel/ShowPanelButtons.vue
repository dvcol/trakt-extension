<script lang="ts" setup>
import { NButton, NFlex, NIcon } from 'naive-ui';
import { computed, onMounted, type PropType, ref, toRefs } from 'vue';

import IconCheckedList from '~/components/icons/IconCheckedList.vue';
import IconCloseSmall from '~/components/icons/IconCloseSmall.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconGridEmpty from '~/components/icons/IconGridEmpty.vue';
import IconListEmpty from '~/components/icons/IconListEmpty.vue';
import IconPlay from '~/components/icons/IconPlay.vue';
import IconPlayFilled from '~/components/icons/IconPlayFilled.vue';
import IconTrakt from '~/components/icons/IconTrakt.vue';
import PanelButtonProgress from '~/components/views/panel/PanelButtonProgress.vue';

import { usePanelButtons } from '~/components/views/panel/use-panel-buttons';
import {
  type EpisodeProgress,
  type SeasonProgress,
  type ShowProgress,
} from '~/models/list-scroll.model';
import {
  type ListEntity,
  ListType,
  useListsStore,
  useListsStoreRefs,
} from '~/stores/data/list.store';
import { useI18n } from '~/utils';

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
  checkin: {
    type: Boolean,
    required: false,
  },
  checkinProgress: {
    type: Number,
    required: false,
  },
  checkinLoading: {
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
});

const { mode, watchedProgress, collectionProgress, activeLoading } = toRefs(props);

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

const i18n = useI18n('panel', 'buttons');

const root = ref<HTMLDivElement>();

const { removeOptions, mixedOptions, timeOptions } = usePanelButtons();

const watchedOptions = computed(() => {
  if (watched.value) return removeOptions;
  if (watchedPercentage.value > 0 && watchedPercentage.value < 100) {
    return mixedOptions;
  }
  return timeOptions;
});

const collectionOptions = computed(() => {
  if (collected.value) return removeOptions;
  if (collectionPercentage.value > 0 && collectionPercentage.value < 100) {
    return mixedOptions;
  }
  return timeOptions;
});

const { lists, loading } = useListsStoreRefs();
const { fetchLists, getIcon } = useListsStore();

const listsLoading = computed(() => {
  return loading.value || activeLoading.value;
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
    <!--  Checkin  -->
    <NFlex class="button-container checkin" justify="center" align="center">
      <NButton round :secondary="!checkin" type="error" :disabled="checkinLoading">
        <template #icon>
          <NIcon
            class="button-icon"
            :component="checkin ? IconCloseSmall : IconTrakt"
            :style="{
              '--trakt-icon-path': 'var(--color-error-lighter)',
              '--trakt-icon-circle': 'transparent',
            }"
          />
        </template>
        <span>{{ i18n(`label__${ checkin ? 'cancel_checkin' : 'checkin' }`) }}</span>
      </NButton>
    </NFlex>

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
        :icon="activeLists?.length ? IconCheckedList : IconListEmpty"
        :filled="!!activeLists?.length"
        :disabled="listsLoading"
        type="warning"
      >
        {{ i18n(`label__list__${ activeLists?.length ? 'update' : 'add' }`) }}
      </PanelButtonProgress>
    </NFlex>

    <!--  Collection  -->
    <NFlex class="button-container collection" justify="center" align="center">
      <PanelButtonProgress
        :select="{
          options: collectionOptions,
        }"
        :tooltip="{
          disabled: !['show', 'season'].includes(mode),
          type: 'collection',
        }"
        :icon="collected ? IconGrid : IconGridEmpty"
        :progress="collectionProgress"
        :percentage="collectionPercentage"
        :filled="collected"
        :disabled="collectionLoading"
        type="info"
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
        :tooltip="{
          disabled: !['show', 'season'].includes(mode),
        }"
        :icon="watched ? IconPlayFilled : IconPlay"
        :progress="watchedProgress"
        :percentage="watchedPercentage"
        :filled="watched"
        :disabled="watchedLoading"
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
  gap: 1.25rem 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.75rem 1rem 1.25rem;

  .button-container {
    i {
      margin-left: calc(0% - var(--n-icon-margin));
    }

    &.history,
    &.collection {
      min-width: 12.5rem;
    }

    &.checkin,
    &.list {
      min-width: 10rem;
    }
  }
}

@media (width <= 800px) {
  .panel-buttons {
    width: 80%;

    .button-container {
      flex: 1 1 40%;
    }
  }
}
</style>
