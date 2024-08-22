<script setup lang="ts">
import {
  type TraktMovieExtended,
  TraktRatingType,
  type TraktSyncRatingValue,
} from '@dvcol/trakt-http-client/models';

import { computed, onMounted, type PropType, toRefs, watch } from 'vue';

import type { RatingItem } from '~/models/rating.model';

import IconTrakt from '~/components/icons/IconTrakt.vue';
import PanelStatistics from '~/components/views/panel/PanelStatistics.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useRatingsStore } from '~/stores/data/ratings.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

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
const { loadRatings, getRatings, getLoading, addRating, removeRating } =
  useRatingsStore();

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

const ratings = computed<RatingItem[]>(
  () =>
    [
      {
        name: i18n('trakt', 'common', 'source', 'name'),
        icon: IconTrakt,
        rating: {
          votes: movie?.value?.votes,
          rating: movie?.value?.rating,
          url: ratingUrl.value,
          loading: movieLoading.value,
        },
      },
    ] satisfies RatingItem[],
);

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
    <slot />
  </PanelStatistics>
</template>
