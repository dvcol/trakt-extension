<script setup lang="ts">
import { sentenceCase } from '@dvcol/common-utils/common/string';
import {
  type TraktMovieExtended,
  TraktRatingType,
  type TraktSyncRatingValue,
} from '@dvcol/trakt-http-client/models';

import { computed, onMounted, type PropType, toRefs, watch } from 'vue';

import type { RatingItem } from '~/models/rating.model';

import PanelStatistics from '~/components/common/panel/PanelStatistics.vue';
import PanelTrailers from '~/components/common/panel/PanelTrailers.vue';
import {
  DataSource,
  getUrlFromSource,
  isKnownSource,
  normalizeSource,
  sortSources,
} from '~/models/source.model';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useRatingsStore } from '~/stores/data/ratings.store';
import { useSimklStore } from '~/stores/data/simkl.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import { isTrailer } from '~/utils/string.utils';

const i18n = useI18n('panel', 'statistics');

const props = defineProps({
  movie: {
    type: Object as PropType<TraktMovieExtended>,
    required: false,
  },
  movieLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { movie, movieLoading } = toRefs(props);

const { enableRatings } = useExtensionSettingsStoreRefs();
const {
  loadRatings,
  getRatings,
  fetchRating,
  getRating,
  getLoading,
  addRating,
  removeRating,
} = useRatingsStore();

const movieId = computed(() => movie?.value?.ids.trakt);
const scoreLoading = computed(() => getLoading(TraktRatingType.Movies));

const score = computed(() => {
  if (!movieId.value) return;
  return getRatings(TraktRatingType.Movies, movieId.value.toString());
});

const ratingUrl = computed(() => {
  if (!movie?.value?.ids?.slug) return;
  return ResolveExternalLinks.trakt.item({
    type: 'movies',
    slug: movie?.value.ids.slug,
    suffix: '/stats',
  });
});

const { getMovie, getMovieLoading } = useSimklStore();
const simklMovie = computed(() => {
  if (!movie?.value?.ids?.imdb) return;
  return getMovie(movie.value.ids.imdb).value;
});

const simklMovieLoading = computed(() => {
  if (!movie?.value?.ids?.imdb) return;
  return getMovieLoading(movie.value.ids.imdb).value;
});

const trailers = computed(() => {
  if (!simklMovie.value?.trailers?.length) return;
  return simklMovie.value.trailers
    .filter((t, index) => !!t.youtube && (index < 2 || isTrailer(t.name)))
    .map(trailer => ({
      id: trailer.youtube,
      title: trailer.name ?? simklMovie.value?.title,
    }));
});

const extended = computed<[string, RatingItem][]>(() => {
  if (!movieId.value) return [];
  if (!enableRatings.value) return [];
  const _query = { id: movieId.value };
  const _ratings = getRating(TraktRatingType.Movies, _query);
  if (!_ratings) return [];
  return Object.entries(_ratings).map(([key, value]) => [
    key,
    {
      name: isKnownSource(key)
        ? i18n(key, 'common', 'source', 'name')
        : sentenceCase(key.replaceAll('_', ' ')),
      icon: key,
      rating: {
        votes: value.votes,
        rating: normalizeSource(key, value.rating),
        loading: getLoading(TraktRatingType.Movies, _query),
        url: key === 'trakt' ? ratingUrl.value : undefined,
      },
    },
  ]);
});

const ratings = computed<RatingItem[]>(() => {
  const _ratings: Map<string, RatingItem> = new Map(extended.value);
  if (!_ratings.has(DataSource.Trakt)) {
    _ratings.set(DataSource.Trakt, {
      name: i18n('trakt', 'common', 'source', 'name'),
      icon: DataSource.Trakt,
      rating: {
        votes: movie?.value?.votes,
        rating: movie?.value?.rating,
        url: ratingUrl.value,
        loading: movieLoading.value,
      },
    });
  }
  if (simklMovie.value?.ratings) {
    Object.entries(simklMovie.value.ratings).forEach(([key, value]) => {
      _ratings.set(key, {
        name: isKnownSource(key)
          ? i18n(key, 'common', 'source', 'name')
          : sentenceCase(key.replaceAll('_', ' ')),
        icon: key,
        rating: {
          votes: value.votes,
          rating: normalizeSource(key, value.rating),
          loading: simklMovieLoading.value,
          url: getUrlFromSource(key, simklMovie?.value?.ids, { type: 'movie' }),
        },
      });
    });
  }

  return Array.from(_ratings.values())
    .filter(r => r.name === DataSource.Trakt || r.rating.rating)
    .sort((a, b) => sortSources(a.name, b.name));
});

const onScoreEdit = async (_score: TraktSyncRatingValue) => {
  if (!movie?.value?.ids?.trakt) return;
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
  watch(movieId, () => {
    if (!movieId.value) return;
    if (!enableRatings.value) return;
    loadRatings(TraktRatingType.Movies, movieId.value.toString());
    fetchRating(TraktRatingType.Movies, { id: movieId.value });
  });
});
</script>

<template>
  <PanelStatistics
    :ratings="ratings"
    :score="score?.rating"
    :loading-score="scoreLoading"
    @on-score-edit="onScoreEdit"
  >
    <PanelTrailers :trailers="trailers">
      <slot />
    </PanelTrailers>
  </PanelStatistics>
</template>
