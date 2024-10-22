<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, toRefs, watch } from 'vue';

import { useRoute } from 'vue-router';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';
import PanelPoster from '~/components/common/panel/PanelPoster.vue';
import PanelShowStatistics from '~/components/common/panel/PanelShowStatistics.vue';
import {
  PanelButtonsOption,
  type PanelButtonsOptions,
  PanelButtonsWatchedOption,
  type PanelButtonsWatchedOptions,
} from '~/components/common/panel/use-panel-buttons';
import ShowPanelButtons from '~/components/views/panel/show/ShowPanelButtons.vue';
import ShowPanelDetails from '~/components/views/panel/show/ShowPanelDetails.vue';
import ShowPanelOverview from '~/components/views/panel/show/ShowPanelOverview.vue';
import ShowPanelPicker from '~/components/views/panel/show/ShowPanelPicker.vue';
import {
  type EpisodeProgress,
  isSeasonProgress,
  type SeasonProgress,
  type ShowProgress,
} from '~/models/list-scroll.model';
import {
  DefaultListId,
  DefaultLists,
  type ListEntity,
  ListType,
} from '~/models/list.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { type AddOrRemoveIds, useListStore } from '~/stores/data/list.store';
import { useListsStoreRefs } from '~/stores/data/lists.store';
import { useShowStore } from '~/stores/data/show.store';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import {
  type CheckinQuery,
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
  resetShowProgress,
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

  try {
    panelDirty.value = true;
    await addToOrRemoveFromList({
      list: _list,
      itemType: panelType.value,
      itemIds: activeItem.value.ids,
      remove,
    });
  } catch (error) {
    Logger.error('Failed to update list', { list: _list, error });
  }
};

const getUnwatchedEpisodes = (
  _progress: SeasonProgress,
  _option: PanelButtonsWatchedOptions,
  _episodes = episodes.value,
) => {
  const _aired = _progress.aired;
  const _completed = _episodes?.filter(
    _e => !_progress.episodes?.some(_p => _p.number === _e.number && _p.completed),
  );
  if (_option === PanelButtonsWatchedOption.Unwatched) return _completed;
  if (!_aired) return [];
  return _completed?.filter(_episode => _episode.number <= _aired);
};

const isSeasonIncomplete = (
  option: PanelButtonsWatchedOptions,
  progressEntity?: ShowProgress | SeasonProgress | EpisodeProgress,
): progressEntity is SeasonProgress => {
  if (panelType.value !== 'season') return false;
  if (!season.value) return false;
  if (option === PanelButtonsWatchedOption.All) return false;
  if (!isSeasonProgress(progressEntity)) return false;
  return progressEntity.completed !== season.value.episode_count;
};

const handleSeason = (
  value: PanelButtonsOptions,
  selected?: string | number | Date,
  progressEntity?: ShowProgress | SeasonProgress | EpisodeProgress,
  options: PanelButtonsWatchedOptions = PanelButtonsWatchedOption.All,
) => {
  if (!panelType.value || !activeItem.value?.ids) throw new Error('No active item');

  const remove = value === PanelButtonsOption.Remove;
  let itemType = panelType.value;
  let itemIds: AddOrRemoveIds = activeItem.value.ids;
  let date = selected;

  if (date === undefined && value === PanelButtonsOption.Release) {
    date = releaseDate.value;
  }

  if (!remove && isSeasonIncomplete(options, progressEntity)) {
    const _ids = getUnwatchedEpisodes(progressEntity, options);
    itemIds = _ids?.map(_episode => _episode.ids) ?? [];
    itemType = 'episode';
  }

  return {
    itemType,
    itemIds,
    date,
    remove,
  };
};

const onCollectionUpdate = async (
  value: PanelButtonsOptions,
  selected?: string | number | Date,
  options: PanelButtonsWatchedOptions = PanelButtonsWatchedOption.All,
) => {
  if (!panelType.value || !activeItem.value?.ids) return;

  const { itemType, itemIds, date, remove } = handleSeason(
    value,
    selected,
    collectionProgressEntity.value,
    options,
  );

  try {
    panelDirty.value = true;
    await addToOrRemoveFromList({
      list: DefaultLists.ShowCollection,
      itemType,
      itemIds,
      date,
      remove,
    });
    if (!showId?.value) return;
    await fetchShowCollectionProgress(showId.value, { force: true });
  } catch (error) {
    Logger.error('Failed to update collection', error);
  }
};

const onWatchedUpdate = async (
  value: PanelButtonsOptions,
  selected?: string | number | Date,
  options: PanelButtonsWatchedOptions = PanelButtonsWatchedOption.All,
) => {
  if (!panelType.value || !activeItem.value?.ids) return;

  const { itemType, itemIds, date, remove } = handleSeason(
    value,
    selected,
    watchedProgressEntity.value,
    options,
  );

  try {
    panelDirty.value = true;
    await addToOrRemoveFromList({
      list: {
        id: DefaultListId.History,
        type: ListType.History,
        name: 'list_type__history',
      },
      itemType,
      itemIds,
      date,
      remove,
    });
    if (!showId?.value) return;
    await resetShowProgress(showId?.value);
  } catch (error) {
    Logger.error('Failed to update watched status', error);
  }
};

const { watching, loading: checkinLoading } = useWatchingStoreRefs();
const { progress } = useWatchingProgress(watching);

const isWatching = computed(() => {
  if (!watching.value) return false;
  if (isWatchingShow(watching.value))
    return watching.value.episode?.ids?.trakt === episode.value?.ids?.trakt;
  return false;
});

const { checkin, cancel } = useCancelWatching();
const onCheckin = async (_cancel: boolean) => {
  if (!episode.value?.ids) {
    Logger.error('Episode has no ids', episode.value);
    return NotificationService.error(
      i18n('checkin_failed', 'watching'),
      new Error(`Missing episode id`),
    );
  }
  const query: CheckinQuery<'episode'> = {
    ids: episode.value.ids,
    type: 'episode',
    showId: showId.value,
  };
  try {
    if (_cancel) await cancel(query);
    else {
      await checkin(query, () => {
        panelDirty.value = true;
      });
    }
  } catch (error) {
    Logger.error('Failed to checkin', error);
    NotificationService.error(i18n('checkin_failed', 'watching'), error);
  }
};

const route = useRoute();
onMounted(() => {
  const force = route.query.force === 'true';
  watch(
    [showId, seasonNb, episodeNb],
    ([_showId, _seasonNb, _episodeNb]) => {
      if (_showId !== undefined) {
        fetchShow(_showId, force);
        fetchShowSeasons(_showId, force);
        fetchShowProgress(_showId, { force });
        fetchShowCollectionProgress(_showId, { force });

        if (_seasonNb !== undefined) {
          fetchShowSeasonEpisodes(_showId, _seasonNb, force);
        }

        if (_seasonNb !== undefined && _episodeNb !== undefined) {
          fetchShowEpisode(_showId, _seasonNb, _episodeNb, force);
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
  <NFlex
    class="panel-container"
    justify="center"
    align="center"
    vertical
    :data-mode="panelType"
    :data-show="showId"
    :data-season="season?.ids?.trakt"
    :data-episode="episode?.ids?.trakt"
  >
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
      style="width: min(var(--half-width), var(--height-70-dvh))"
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
  // everything under the poster
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
