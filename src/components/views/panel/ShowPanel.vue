<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, toRefs, watch } from 'vue';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import ShowPanelButtons from '~/components/views/panel/ShowPanelButtons.vue';
import ShowPanelDetails from '~/components/views/panel/ShowPanelDetails.vue';
import ShowPanelOverview from '~/components/views/panel/ShowPanelOverview.vue';
import ShowPanelPicker from '~/components/views/panel/ShowPanelPicker.vue';
import {
  PanelButtonsOption,
  type PanelButtonsOptions,
} from '~/components/views/panel/use-panel-buttons';
import { ResolveExternalLinks } from '~/settings/external.links';
import {
  DefaultLists,
  type ListEntity,
  ListType,
  useListsStoreRefs,
  useListStore,
} from '~/stores/data/list.store';
import { useShowStore } from '~/stores/data/show.store';
import { useExtensionSettingsStore } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils';
import { deCapitalise } from '~/utils/string.utils';

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

const watchedLoading = computed(() => {
  if (!showId?.value) return;
  return getShowProgressLoading(showId.value).value;
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

const { lists } = useListsStoreRefs();
const { isListTypeLoading, isItemInList, addToOrRemoveFromList, isItemListLoading } =
  useListStore();

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
  if (!showId?.value) return;
  if (activeItemCollectionLoading.value) return true;
  return getShowCollectionLoading(showId.value).value;
});

const activeLists = computed(() => {
  const _id = activeItem?.value?.ids?.trakt;
  const _type = panelType.value;
  if (_id === undefined || !_type) return;
  return lists.value
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

const onListUpdate = async (value: ListEntity['id'], remove: boolean) => {
  if (!panelType.value || !activeItem.value?.ids) return;
  const _list = lists.value.find(list => list.id === value);
  if (!_list) return;

  await addToOrRemoveFromList({
    list: _list,
    itemType: panelType.value,
    itemIds: activeItem.value.ids,
    remove,
  });
};

const onCollectionUpdate = async (value: PanelButtonsOptions, date?: number) => {
  if (!panelType.value || !activeItem.value?.ids) return;

  await addToOrRemoveFromList({
    list: DefaultLists.ShowCollection,
    itemType: panelType.value,
    itemIds: activeItem.value.ids,
    date,
    remove: value === PanelButtonsOption.Remove,
  });
  if (!showId.value) return;
  await fetchShowCollectionProgress(showId.value, { force: true });
};

const onWatchedUpdate = async (value: PanelButtonsOptions, date?: number) => {
  if (!panelType.value || !activeItem.value?.ids) return;

  // TODO : implement add/remove from history
  // addToOrRemoveFromList(DefaultLists.Watchlist, `${panelType.value}s`, activeItem.value.ids);
  if (!showId.value) return;
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
    },
    { immediate: true },
  );
});

const { openTab } = useExtensionSettingsStore();
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <TitleLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_show_in_trakt', 'common', 'tooltip')"
      @on-click="openTab"
    >
      {{ title }}
    </TitleLink>
    <NSkeleton v-else class="show-title-skeleton" style="width: 50dvh" round />

    <PanelPoster
      :tmdb="show?.ids.tmdb"
      :mode="panelType"
      :portait="panelType === 'season'"
      :season-number="seasonNb"
      :episode-number="episodeNb"
    />

    <ShowPanelDetails
      :show="show"
      :season="season"
      :episode="episode"
      :mode="panelType"
    />

    <ShowPanelButtons
      :mode="panelType"
      :watched-progress="watchedProgressEntity"
      :watched-loading="watchedLoading"
      :collection-progress="collectionProgressEntity"
      :collection-loading="collectionLoading"
      :active-loading="listLoading"
      :active-lists="activeLists"
      @on-list-update="onListUpdate"
      @on-collection-update="onCollectionUpdate"
      @on-watched-update="onWatchedUpdate"
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
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.show-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>
