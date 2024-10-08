<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, toRefs, watch } from 'vue';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';
import MoviePanelButtons from '~/components/views/panel/MoviePanelButtons.vue';
import MoviePanelDetails from '~/components/views/panel/MoviePanelDetails.vue';
import MoviePanelOverview from '~/components/views/panel/MoviePanelOverview.vue';
import PanelMovieStatistics from '~/components/views/panel/PanelMovieStatistics.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';
import {
  PanelButtonsOption,
  type PanelButtonsOptions,
} from '~/components/views/panel/use-panel-buttons';
import {
  DefaultListId,
  DefaultLists,
  type ListEntity,
  ListType,
} from '~/models/list.model';
import { NotificationService } from '~/services/notification.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useListStore } from '~/stores/data/list.store';
import { useListsStoreRefs } from '~/stores/data/lists.store';
import { useMovieStore, useMovieStoreRefs } from '~/stores/data/movie.store';
import { useWatchingStore, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
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

const { loadLists, loadListsPageSize } = useExtensionSettingsStoreRefs();

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

const { panelDirty } = useAppStateStoreRefs();

const onListUpdate = async (value: ListEntity['id'], remove: boolean) => {
  if (!movie.value?.ids) return;

  const _list = myLists.value.find(list => list.id === value);
  if (!_list) return;

  panelDirty.value = true;
  await addToOrRemoveFromList({
    list: _list,
    itemType: 'movie',
    itemIds: movie.value?.ids,
    remove,
  });
};

const releaseDate = computed(() => movie.value?.released);

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

onMounted(() => {
  watch(movieId, id => fetchMovie(id), { immediate: true });
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
  <NFlex
    class="panel-container"
    justify="center"
    align="center"
    vertical
    :data-movie="movieId"
  >
    <AnchorLink
      v-if="title"
      class="show-title"
      :href="titleUrl"
      :title="i18n('open_in_trakt', 'common', 'tooltip')"
    >
      {{ title }}
    </AnchorLink>
    <NSkeleton
      v-else
      class="show-title-skeleton"
      style="width: min(var(--half-width), var(--height-70-dvh))"
      round
    />

    <PanelMovieStatistics :movie="movie" :movie-loading="movieLoading">
      <PanelPoster :tmdb="movie?.ids.tmdb" mode="movie" :link="titleUrl" />
    </PanelMovieStatistics>

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
