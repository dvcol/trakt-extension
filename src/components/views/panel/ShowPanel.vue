<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';

import { computed, onMounted, toRefs, watch } from 'vue';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import PanelShowStatistics from '~/components/views/panel/PanelShowStatistics.vue';
import ShowPanelButtons from '~/components/views/panel/ShowPanelButtons.vue';
import ShowPanelDetails from '~/components/views/panel/ShowPanelDetails.vue';
import ShowPanelOverview from '~/components/views/panel/ShowPanelOverview.vue';
import ShowPanelPicker from '~/components/views/panel/ShowPanelPicker.vue';
import {
  PanelButtonsOption,
  type PanelButtonsOptions,
} from '~/components/views/panel/use-panel-buttons';
import { NotificationService } from '~/services/notification.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import {
  DefaultListId,
  DefaultLists,
  type ListEntity,
  ListType,
  useListsStoreRefs,
  useListStore,
} from '~/stores/data/list.store';
import { useShowStore } from '~/stores/data/show.store';
import { useWatchingStore, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import {
  isWatchingShow,
  useCancelWatching,
  useWatchingProgress,
} from '~/utils/watching.utils';

const props = defineProps({
  showId: {
    type: String,
    required: true,
  },
  seasonNumber: {
    type: String,
    required: false,
  },
  episodeNumber: {
    type: String,
    required: false,
  },
});

const { showId, seasonNumber, episodeNumber } = toRefs(props);

const {
  getShow,
  fetchShow,
  fetchShowProgress,
  fetchShowCollectionProgress,
  getShowSeasons,
  fetchShowSeasons,
  getShowSeasonEpisodes,
  fetchShowSeasonEpisodes,
  getShowEpisode,
  fetchShowEpisode,
  getShowWatchedProgress,
  getShowCollectionProgress,
  getShowProgressLoading,
  getShowCollectionLoading,
} = useShowStore();

const i18n = useI18n('panel', 'show');

const watchedProgress = computed(() => {
  if (!showId?.value) return;
  return getShowWatchedProgress(showId.value).value;
});
const collectionProgress = computed(() => {
  if (!showId?.value) return;
  return getShowCollectionProgress(showId.value).value;
});

const seasonNb = computed(() => {
  if (seasonNumber?.value === undefined) return;
  const _seasonNumber = Number(seasonNumber.value);
  if (Number.isNaN(_seasonNumber)) return;
  return _seasonNumber;
});

const episodeNb = computed(() => {
  if (episodeNumber?.value === undefined) return;
  const _episodeNumber = Number(episodeNumber.value);
  if (Number.isNaN(_episodeNumber)) return;
  return _episodeNumber;
});

const show = computed(() => {
  if (!showId?.value) return;
  return getShow(showId.value).value;
});

const seasons = computed(() => {
  if (!showId?.value) return;
  return getShowSeasons(showId.value).value;
});

const episodes = computed(() => {
  if (!showId?.value || seasonNb?.value === undefined) return;
  return getShowSeasonEpisodes(showId.value, seasonNb.value).value;
});

const episode = computed(() => {
  if (!showId?.value || seasonNb?.value === undefined || episodeNb?.value === undefined)
    return;
  return getShowEpisode({
    id: showId.value,
    season: seasonNb.value,
    episode: episodeNb.value,
  }).value;
});

const season = computed(() => {
  if (seasonNb?.value === undefined) return;
  return seasons.value?.[seasonNb.value];
});

const panelType = computed<'show' | 'season' | 'episode'>(() => {
  if (episodeNb?.value !== undefined && seasonNb?.value !== undefined) return 'episode';
  if (seasonNb?.value !== undefined) return 'season';
  return 'show';
});

const activeItem = computed(() => {
  if (panelType.value === 'episode') return episode.value;
  if (panelType.value === 'season') return season.value;
  return show.value;
});

const watchedProgressEntity = computed(() => {
  if (!watchedProgress?.value) return;

  if (panelType.value === 'season') {
    if (seasonNb.value === undefined) return;
    return watchedProgress.value?.seasons?.find(
      _season => _season.number === seasonNb.value,
    );
  }
  if (panelType.value === 'episode') {
    if (seasonNb.value === undefined || episodeNb.value === undefined) return;
    return watchedProgress.value?.seasons
      ?.find(_season => _season.number === seasonNb.value)
      ?.episodes?.find(_episode => _episode.number === episodeNb.value);
  }
  return watchedProgress.value;
});

const collectionProgressEntity = computed(() => {
  if (!collectionProgress?.value) return;

  if (panelType.value === 'season') {
    if (seasonNb.value === undefined) return;
    return collectionProgress.value?.seasons?.find(
      _season => _season.number === seasonNb.value,
    );
  }
  if (panelType.value === 'episode') {
    if (seasonNb.value === undefined || episodeNb.value === undefined) return;
    return collectionProgress.value?.seasons
      ?.find(_season => _season.number === seasonNb.value)
      ?.episodes?.find(_episode => _episode.number === episodeNb.value);
  }
  return collectionProgress.value;
});

const { myLists } = useListsStoreRefs();
const {
  isListTypeLoading,
  isItemInList,
  addToOrRemoveFromList,
  isItemListLoading,
  fetchAll,
} = useListStore();
const { loadLists, loadListsPageSize } = useExtensionSettingsStoreRefs();

const shouldFetchLists = computed(() => {
  if (!myLists.value?.length) return false;
  return loadLists.value;
});

const listLoading = computed(
  () =>
    isListTypeLoading(ListType.Watchlist).value || isListTypeLoading(ListType.List).value,
);

const activeItemCollectionLoading = computed(() => {
  const _id = activeItem.value?.ids?.trakt;
  if (_id === undefined) return;
  return isItemListLoading({
    listType: ListType.Collection,
    itemType: panelType.value,
    itemId: _id,
  }).value;
});

const collectionLoading = computed(() => {
  if (activeItemCollectionLoading.value) return true;
  if (!showId?.value) return true;
  return getShowCollectionLoading(showId.value).value;
});

const activeItemWatchedLoading = computed(() => {
  const _id = activeItem.value?.ids?.trakt;
  if (_id === undefined) return;
  return isItemListLoading({
    listType: ListType.History,
    itemType: panelType.value,
    itemId: _id,
  }).value;
});

const watchedLoading = computed(() => {
  if (activeItemWatchedLoading.value) return true;
  if (!showId?.value) return true;
  return getShowProgressLoading(showId.value).value;
});

const activeLists = computed(() => {
  const _id = activeItem?.value?.ids?.trakt;
  const _type = panelType.value;
  if (_id === undefined || !_type) return;
  return myLists.value
    ?.filter(list => isItemInList(list.id, _type, _id).value)
    .map(list => list.id);
});

const title = computed(() => {
  if (!show.value?.title) return;
  return deCapitalise(show.value.title);
});

const titleUrl = computed(() => {
  if (!show.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'show',
    source: 'trakt',
    id: show.value.ids.trakt,
  });
});

const detailUrl = computed(() => {
  if (panelType.value === 'show') {
    if (!show?.value?.ids?.trakt) return;
    return ResolveExternalLinks.search({
      type: 'show',
      source: 'trakt',
      id: show.value.ids.trakt,
    });
  }
  if (panelType.value === 'season') {
    if (!season?.value?.ids?.trakt) return;
    return ResolveExternalLinks.search({
      type: 'season',
      source: 'trakt',
      id: season.value.ids.trakt,
    });
  }
  if (!episode?.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'episode',
    source: 'trakt',
    id: episode.value.ids.trakt,
  });
});

const releaseDate = computed(() => activeItem.value?.first_aired);

const { panelDirty } = useAppStateStoreRefs();

const onListUpdate = async (value: ListEntity['id'], remove: boolean) => {
  if (!panelType.value || !activeItem.value?.ids) return;
  const _list = myLists.value.find(list => list.id === value);
  if (!_list) return;

  panelDirty.value = true;
  await addToOrRemoveFromList({
    list: _list,
    itemType: panelType.value,
    itemIds: activeItem.value.ids,
    remove,
  });
};

const onCollectionUpdate = async (
  value: PanelButtonsOptions,
  date?: string | number | Date,
) => {
  if (!panelType.value || !activeItem.value?.ids) return;
  if (date === undefined && value === PanelButtonsOption.Release) {
    date = releaseDate.value;
  }

  try {
    await addToOrRemoveFromList({
      list: DefaultLists.ShowCollection,
      itemType: panelType.value,
      itemIds: activeItem.value.ids,
      date,
      remove: value === PanelButtonsOption.Remove,
    });
    if (!showId?.value) return;
    await fetchShowCollectionProgress(showId.value, { force: true });
  } finally {
    panelDirty.value = true;
  }
};

const onWatchedUpdate = async (
  value: PanelButtonsOptions,
  date?: string | number | Date,
) => {
  if (!panelType.value || !activeItem.value?.ids) return;
  if (date === undefined && value === PanelButtonsOption.Release) {
    date = releaseDate.value;
  }

  panelDirty.value = true;
  await addToOrRemoveFromList({
    list: {
      id: DefaultListId.History,
      type: ListType.History,
      name: 'list_type__history',
    },
    itemType: panelType.value,
    itemIds: activeItem.value.ids,
    date,
    remove: value === PanelButtonsOption.Remove,
  });
  if (!showId?.value) return;
  await fetchShowProgress(showId.value, { force: true });
};

const { watching, loading: checkinLoading } = useWatchingStoreRefs();
const { progress } = useWatchingProgress(watching);

const isWatching = computed(() => {
  if (!watching.value) return false;
  if (isWatchingShow(watching.value))
    return watching.value.episode?.ids?.trakt === episode.value?.ids?.trakt;
  return false;
});

const { cancel: cancelCheckin, checkin } = useWatchingStore();

const { onCancel } = useCancelWatching(cancelCheckin);
const onCheckin = async (cancel: boolean) => {
  if (cancel) {
    const cancelled = await onCancel();
    if (!cancelled) return;
  } else if (!episode.value?.ids?.trakt) {
    return NotificationService.error(
      i18n('checkin_failed', 'watching'),
      new Error('No episode id'),
    );
  } else {
    panelDirty.value = true;
    await checkin({ episode: { ids: episode.value.ids } });
  }

  if (!showId?.value) return;
  await fetchShowProgress(showId.value, { force: true });
};

onMounted(() => {
  watch(
    [showId, seasonNb, episodeNb],
    ([_showId, _seasonNb, _episodeNb]) => {
      if (_showId !== undefined) {
        fetchShow(_showId);
        fetchShowSeasons(_showId);

        if (_seasonNb !== undefined) {
          fetchShowSeasonEpisodes(_showId, _seasonNb);
        }

        if (_seasonNb !== undefined && _episodeNb !== undefined) {
          fetchShowEpisode(_showId, _seasonNb, _episodeNb);
        }
      }

      if (shouldFetchLists.value) {
        fetchAll(
          myLists.value.filter(
            _active => loadLists.value?.find(_list => _list.id === _active.id),
          ),
          {
            limit: loadListsPageSize.value,
          },
        );
      }
    },
    { immediate: true },
  );
});
</script>

<template>
  <NFlex class="panel-container" justify="center" align="center" vertical>
    <AnchorLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_show_in_trakt', 'common', 'tooltip')"
    >
      {{ title }}
    </AnchorLink>
    <NSkeleton
      v-else
      class="show-title-skeleton"
      style="width: var(--half-height)"
      round
    />

    <PanelShowStatistics
      :mode="panelType"
      :show="show"
      :season="season"
      :episode="episode"
    >
      <PanelPoster
        :tmdb="show?.ids.tmdb"
        :mode="panelType"
        :portait="panelType === 'season'"
        :season-number="seasonNb"
        :episode-number="episodeNb"
        :link="detailUrl"
      />
    </PanelShowStatistics>

    <ShowPanelDetails
      :show="show"
      :season="season"
      :episode="episode"
      :mode="panelType"
      :watched-progress="watchedProgressEntity"
      :collection-progress="collectionProgressEntity"
    />

    <ShowPanelButtons
      :mode="panelType"
      :watched-progress="watchedProgressEntity"
      :watched-loading="watchedLoading"
      :collection-progress="collectionProgressEntity"
      :collection-loading="collectionLoading"
      :active-loading="listLoading"
      :active-lists="activeLists"
      :has-release="!!releaseDate"
      :watching="isWatching"
      :watch-progress="progress"
      :watch-loading="checkinLoading"
      @on-list-update="onListUpdate"
      @on-collection-update="onCollectionUpdate"
      @on-watched-update="onWatchedUpdate"
      @on-checkin="onCheckin"
    />

    <ShowPanelPicker
      :mode="panelType"
      :seasons="seasons"
      :episodes="episodes"
      :progress="watchedProgress"
      :collection="collectionProgress"
    />

    <ShowPanelOverview
      :episode="episode"
      :season="season"
      :show="show"
      :mode="panelType"
      :url="detailUrl"
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.panel-container {
  & > div:nth-child(n + 3) {
    @media (width > 1200px) {
      max-width: min(var(--half-width), var(--height-70-dvh));
    }
  }

  .show-title-skeleton {
    height: 1.5rem;
    margin-top: 0.625rem;
  }
}
</style>
