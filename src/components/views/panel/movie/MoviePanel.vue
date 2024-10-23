<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, toRefs, watch } from 'vue';

import { useRoute } from 'vue-router';

import AnchorLink from '~/components/common/buttons/AnchorLink.vue';
import PanelMovieStatistics from '~/components/common/panel/PanelMovieStatistics.vue';
import PanelPoster from '~/components/common/panel/PanelPoster.vue';
import {
  PanelButtonsOption,
  type PanelButtonsOptions,
} from '~/components/common/panel/use-panel-buttons';
import MoviePanelButtons from '~/components/views/panel/movie/MoviePanelButtons.vue';
import MoviePanelDetails from '~/components/views/panel/movie/MoviePanelDetails.vue';
import MoviePanelOverview from '~/components/views/panel/movie/MoviePanelOverview.vue';
import { type ListEntity, ListType } from '~/models/list.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useWatchedUpdates } from '~/stores/composable/use-list-update';
import {
  type CheckinQuery,
  isWatchingMovie,
  useCancelWatching,
  useWatchingProgress,
} from '~/stores/composable/use-watching';
import { useListStore } from '~/stores/data/list.store';
import { useListsStoreRefs } from '~/stores/data/lists.store';
import { useMovieStore, useMovieStoreRefs } from '~/stores/data/movie.store';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

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
  });
});

const watchedLoading = computed(() => {
  if (loadingWatched.value) return true;
  if (movieId.value === undefined) return true;
  return isItemListLoading({
    listType: ListType.History,
    itemType: 'movie',
    itemId: movieId.value,
  });
});

const activeLists = computed(() => {
  if (movieId?.value === undefined) return;
  return myLists.value
    ?.filter(list => isItemInList(list.id, 'movie', movieId.value))
    .map(list => list.id);
});

const { panelDirty } = useAppStateStoreRefs();

const onListUpdate = async (value: ListEntity['id'], remove: boolean) => {
  if (!movie.value?.ids) return;

  const _list = myLists.value.find(list => list.id === value);
  if (!_list) return;

  try {
    panelDirty.value = true;
    await addToOrRemoveFromList({
      list: _list,
      itemType: 'movie',
      itemIds: movie.value?.ids,
      remove,
    });
  } catch (error) {
    Logger.error('Failed to update list', { list: _list, error });
  }
};

const releaseDate = computed(() => movie.value?.released);

const { addOrRemovePlayed, addOrRemoveCollected } = useWatchedUpdates();

const onCollectionUpdate = async (
  value: PanelButtonsOptions,
  date?: string | number | Date,
) => {
  if (!movie.value?.ids) return;
  if (date === undefined && value === PanelButtonsOption.Release) {
    date = releaseDate.value;
  }
  panelDirty.value = true;
  await addOrRemoveCollected({
    itemType: 'movie',
    itemIds: movie.value?.ids,
    date,
    remove: value === PanelButtonsOption.Remove,
  });
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
  await addOrRemovePlayed({
    itemIds: movie.value.ids,
    itemType: 'movie',
    date,
    remove: value === PanelButtonsOption.Remove,
  });
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

const { cancel, checkin } = useCancelWatching();
const onCheckin = async (_cancel: boolean) => {
  if (!movie.value?.ids) {
    Logger.error('Movie has no ids', movie.value);
    return NotificationService.error(
      i18n('checkin_failed', 'watching'),
      new Error(`Missing movie id`),
    );
  }
  const query: CheckinQuery<'movie'> = { ids: movie.value.ids, type: 'movie' };
  try {
    if (_cancel) await cancel(query);
    else {
      await checkin(query, () => {
        panelDirty.value = true;
      });
    }
  } catch (error) {
    Logger.error('Failed to checkin', { query, error });
    NotificationService.error('Failed to checkin', error);
  }
};

const route = useRoute();
onMounted(() => {
  const force = route.query.force === 'true';
  watch(movieId, id => fetchMovie(id, force), { immediate: true });
  fetchMovieWatched(force);
  fetchMovieCollected(force);

  if (shouldFetchLists.value) {
    fetchAll(
      myLists.value.filter(
        _active => loadLists.value?.find(_list => _list.id === _active.id),
      ),
      {
        limit: loadListsPageSize.value,
      },
      force,
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
