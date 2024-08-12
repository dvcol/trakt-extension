<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';

import {
  TraktRatingType,
  type TraktSyncRatingValue,
} from '@dvcol/trakt-http-client/models';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, toRefs, watch } from 'vue';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import MoviePanelButtons from '~/components/views/panel/MoviePanelButtons.vue';
import MoviePanelDetails from '~/components/views/panel/MoviePanelDetails.vue';
import MoviePanelOverview from '~/components/views/panel/MoviePanelOverview.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import PanelStatistics from '~/components/views/panel/PanelStatistics.vue';
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
import { useMovieStore, useMovieStoreRefs } from '~/stores/data/movie.store';
import { useRatingsStore } from '~/stores/data/ratings.store';
import { useWatchingStore, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';
import {
  isWatchingMovie,
  useCancelWatching,
  useWatchingProgress,
} from '~/utils/watching.utils';

const props = defineProps({
  movieId: {
    type: String,
    required: true,
  },
});

const { movieId } = toRefs(props);

const {
  getMovie,
  getMovieLoading,
  fetchMovie,
  getMovieWatched,
  getMovieCollected,
  fetchMovieWatched,
  fetchMovieCollected,
  changeMovieWatched,
  changeMovieCollected,
} = useMovieStore();

const { loadingCollected, loadingWatched } = useMovieStoreRefs();

const movieLoading = computed(() => {
  if (!movieId?.value) return false;
  return getMovieLoading(movieId.value).value;
});

const movie = computed(() => {
  if (!movieId?.value) return;
  return getMovie(movieId.value).value;
});

const watched = computed(() => {
  if (!movieId?.value) return;
  return getMovieWatched(movieId.value)?.value;
});

const watchedDate = computed(() => {
  if (!watched?.value?.last_watched_at) return;
  return new Date(watched.value.last_watched_at);
});

const collected = computed(() => {
  if (!movieId?.value) return;
  return getMovieCollected(movieId.value)?.value;
});

const collectedDate = computed(() => {
  if (!collected?.value?.collected_at) return;
  return new Date(collected.value.collected_at);
});

const { myLists } = useListsStoreRefs();
const {
  isListTypeLoading,
  isItemInList,
  isItemListLoading,
  addToOrRemoveFromList,
  fetchAll,
} = useListStore();

const { loadLists, loadListsPageSize, enableRatings } = useExtensionSettingsStoreRefs();

const shouldFetchLists = computed(() => {
  if (!myLists.value?.length) return false;
  return loadLists.value;
});

const listLoading = computed(
  () =>
    isListTypeLoading(ListType.Watchlist).value || isListTypeLoading(ListType.List).value,
);

const collectionLoading = computed(() => {
  if (loadingCollected.value) return true;
  if (movieId.value === undefined) return true;
  return isItemListLoading({
    listType: ListType.Collection,
    itemType: 'movie',
    itemId: movieId.value,
  }).value;
});

const watchedLoading = computed(() => {
  if (loadingWatched.value) return true;
  if (movieId.value === undefined) return true;
  return isItemListLoading({
    listType: ListType.History,
    itemType: 'movie',
    itemId: movieId.value,
  }).value;
});

const activeLists = computed(() => {
  if (movieId?.value === undefined) return;
  return myLists.value
    ?.filter(list => isItemInList(list.id, 'movie', movieId.value).value)
    .map(list => list.id);
});

const onListUpdate = async (value: ListEntity['id'], remove: boolean) => {
  if (!movie.value?.ids) return;

  const _list = myLists.value.find(list => list.id === value);
  if (!_list) return;

  await addToOrRemoveFromList({
    list: _list,
    itemType: 'movie',
    itemIds: movie.value?.ids,
    remove,
  });
};

const releaseDate = computed(() => movie.value?.released);

const { panelDirty } = useAppStateStoreRefs();

const onCollectionUpdate = async (
  value: PanelButtonsOptions,
  date?: string | number | Date,
) => {
  if (!movie.value?.ids) return;
  if (date === undefined && value === PanelButtonsOption.Release) {
    date = releaseDate.value;
  }

  panelDirty.value = true;
  await addToOrRemoveFromList({
    list: DefaultLists.ShowCollection,
    itemType: 'movie',
    itemIds: movie.value?.ids,
    date,
    remove: value === PanelButtonsOption.Remove,
  });

  const _id = movie.value?.ids?.trakt;
  if (_id === undefined) return;
  return changeMovieCollected(_id, value === PanelButtonsOption.Remove);
};

const onWatchedUpdate = async (
  value: PanelButtonsOptions,
  date?: string | number | Date,
) => {
  if (!movie.value?.ids) return;
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
    itemType: 'movie',
    itemIds: movie.value?.ids,
    date,
    remove: value === PanelButtonsOption.Remove,
  });

  const _id = movie.value?.ids?.trakt;
  if (_id === undefined) return;
  return changeMovieWatched(_id, value === PanelButtonsOption.Remove);
};

const i18n = useI18n('movie', 'panel');

const title = computed(() => {
  if (!movie.value?.title) return;
  return deCapitalise(movie.value.title);
});

const titleUrl = computed(() => {
  if (!movie.value?.ids?.trakt) return;
  return ResolveExternalLinks.search({
    type: 'movie',
    source: 'trakt',
    id: movie.value.ids.trakt,
  });
});

const { watching, loading: checkinLoading } = useWatchingStoreRefs();
const { progress } = useWatchingProgress(watching);
const isWatching = computed(() => {
  if (!watching.value) return false;
  if (isWatchingMovie(watching.value))
    return watching.value.movie?.ids?.trakt.toString() === movieId.value;
  return false;
});

const { cancel: cancelCheckin, checkin } = useWatchingStore();

const { onCancel } = useCancelWatching(cancelCheckin);
const onCheckin = async (cancel: boolean) => {
  if (cancel) {
    const cancelled = await onCancel();
    if (!cancelled) return;
  } else if (!movie.value?.ids?.trakt) {
    return NotificationService.error(
      i18n('checkin_failed', 'watching'),
      new Error('No movie id'),
    );
  } else {
    panelDirty.value = true;
    await checkin({ movie: { ids: movie.value.ids } });
  }

  await fetchMovieWatched(true);
};

const { openTab } = useLinksStore();

const { loadRatings, getRatings, getLoading, addRating, removeRating } =
  useRatingsStore();

const scoreLoading = computed(() => getLoading(TraktRatingType.Movies));

const score = computed(() => {
  if (!movieId.value) return;
  return getRatings(TraktRatingType.Movies, movieId.value);
});

const ratingUrl = computed(() => {
  if (!movie.value?.ids?.slug) return;
  return ResolveExternalLinks.trakt.item({
    type: 'movies',
    slug: movie.value.ids.slug,
    suffix: '/stats',
  });
});

const onScoreEdit = async (_score: TraktSyncRatingValue) => {
  if (!movie.value?.ids?.trakt) return;
  return (_score ? addRating : removeRating)(TraktRatingType.Movies, {
    movies: [
      {
        ids: movie.value.ids,
        rating: _score,
      },
    ],
  });
};

onMounted(() => {
  watch(
    movieId,
    id => {
      fetchMovie(id);
      if (enableRatings.value) loadRatings(TraktRatingType.Movies, id);
    },
    { immediate: true },
  );
  fetchMovieWatched();
  fetchMovieCollected();

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
});
</script>

<template>
  <NFlex justify="center" align="center" vertical>
    <TitleLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_in_trakt', 'common', 'tooltip')"
      @on-click="openTab"
    >
      {{ title }}
    </TitleLink>
    <NSkeleton
      v-else
      class="show-title-skeleton"
      style="width: var(--half-height)"
      round
    />

    <PanelStatistics
      :rating="movie?.rating"
      :votes="movie?.votes"
      :score="score?.rating"
      :loading-score="scoreLoading"
      :loading-rating="movieLoading"
      :url="ratingUrl"
      @on-score-edit="onScoreEdit"
    >
      <PanelPoster :tmdb="movie?.ids.tmdb" mode="movie" />
    </PanelStatistics>

    <MoviePanelDetails
      :movie="movie"
      :watched-date="watchedDate"
      :collection-date="collectedDate"
    />

    <MoviePanelButtons
      :watched="!!watched"
      :watched-loading="watchedLoading"
      :collected="!!collected"
      :collected-loading="collectionLoading"
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

    <MoviePanelOverview :movie="movie" />
  </NFlex>
</template>

<style lang="scss" scoped>
.show-title-skeleton {
  height: 1.5rem;
  margin-top: 0.625rem;
}
</style>
