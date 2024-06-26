<script setup lang="ts">
import { deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, onMounted, toRefs, watch } from 'vue';

import TitleLink from '~/components/common/buttons/TitleLink.vue';
import MoviePanelButtons from '~/components/views/panel/MoviePanelButtons.vue';
import MoviePanelDetails from '~/components/views/panel/MoviePanelDetails.vue';
import MoviePanelOverview from '~/components/views/panel/MoviePanelOverview.vue';
import PanelPoster from '~/components/views/panel/PanelPoster.vue';

import {
  PanelButtonsOption,
  type PanelButtonsOptions,
} from '~/components/views/panel/use-panel-buttons';
import { ResolveExternalLinks } from '~/settings/external.links';
import {
  DefaultListId,
  DefaultLists,
  type ListEntity,
  ListType,
  useListsStoreRefs,
  useListStore,
} from '~/stores/data/list.store';
import { useMovieStore, useMovieStoreRefs } from '~/stores/data/movie.store';
import { useLinksStore } from '~/stores/settings/links.store';
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
  fetchMovie,
  getMovieWatched,
  getMovieWatchedDate,
  getMovieCollected,
  getMovieCollectedDate,
  fetchMovieWatched,
  fetchMovieCollected,
  changeMovieWatched,
  changeMovieCollected,
} = useMovieStore();

const { loadingCollected, loadingWatched } = useMovieStoreRefs();

const movie = computed(() => {
  if (!movieId?.value) return;
  return getMovie(movieId.value).value;
});

const watched = computed(() => {
  if (!movieId?.value) return;
  return !!getMovieWatched(movieId.value)?.value;
});

const watchedDate = computed(() => {
  if (!watched?.value) return;
  return getMovieWatchedDate(movieId.value)?.value;
});

const collected = computed(() => {
  if (!movieId?.value) return;
  return !!getMovieCollected(movieId.value)?.value;
});

const collectedDate = computed(() => {
  if (!collected?.value) return;
  return getMovieCollectedDate(movieId.value)?.value;
});

onMounted(() => {
  watch(
    movieId,
    id => {
      fetchMovie(id);
    },
    { immediate: true },
  );
  fetchMovieWatched();
  fetchMovieCollected();
});

const { lists } = useListsStoreRefs();
const { isListTypeLoading, isItemInList, isItemListLoading, addToOrRemoveFromList } =
  useListStore();

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
  return lists.value
    ?.filter(list => isItemInList(list.id, 'movie', movieId.value).value)
    .map(list => list.id);
});

const onListUpdate = async (value: ListEntity['id'], remove: boolean) => {
  if (!movie.value?.ids) return;

  const _list = lists.value.find(list => list.id === value);
  if (!_list) return;

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

  await addToOrRemoveFromList({
    list: DefaultLists.ShowCollection,
    itemType: 'movie',
    itemIds: movie.value?.ids,
    date,
    remove: value === PanelButtonsOption.Remove,
  });

  const _id = movie.value?.ids?.trakt;
  if (_id === undefined) return;
  changeMovieCollected(_id, value === PanelButtonsOption.Remove);
};

const onWatchedUpdate = async (
  value: PanelButtonsOptions,
  date?: string | number | Date,
) => {
  if (!movie.value?.ids) return;
  if (date === undefined && value === PanelButtonsOption.Release) {
    date = releaseDate.value;
  }

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
  changeMovieWatched(_id, value === PanelButtonsOption.Remove);
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

const { openTab } = useLinksStore();
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
    <NSkeleton v-else class="show-title-skeleton" style="width: 50dvh" round />

    <PanelPoster :tmdb="movie?.ids.tmdb" mode="movie" />

    <MoviePanelDetails
      :movie="movie"
      :watched-date="watchedDate"
      :collection-date="collectedDate"
    />

    <MoviePanelButtons
      :watched="watched"
      :watched-loading="watchedLoading"
      :collected="collected"
      :collected-loading="collectionLoading"
      :active-loading="listLoading"
      :active-lists="activeLists"
      :has-release="!!releaseDate"
      @on-list-update="onListUpdate"
      @on-collection-update="onCollectionUpdate"
      @on-watched-update="onWatchedUpdate"
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
