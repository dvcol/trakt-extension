<script setup lang="ts">
import {
  type TraktEpisodeExtended,
  TraktRatingType,
  type TraktRatingTypes,
  type TraktSeasonExtended,
  type TraktShowExtended,
  type TraktSyncRatingValue,
} from '@dvcol/trakt-http-client/models';
import { computed, onMounted, type PropType, toRefs, watch } from 'vue';

import type { RatingItem } from '~/models/rating.model';

import PanelStatistics from '~/components/views/panel/PanelStatistics.vue';
import PanelTrailers from '~/components/views/panel/PanelTrailers.vue';
import { DataSource } from '~/models/source.model';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useRatingsStore } from '~/stores/data/ratings.store';

import { useShowStore } from '~/stores/data/show.store';
import { useSimklStore } from '~/stores/data/simkl.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';
import { isTrailer } from '~/utils/string.utils';

const i18n = useI18n('panel', 'statistics');

const props = defineProps({
  episode: {
    type: Object as PropType<TraktEpisodeExtended>,
    required: false,
  },
  season: {
    type: Object as PropType<TraktSeasonExtended>,
    required: false,
  },
  show: {
    type: Object as PropType<TraktShowExtended>,
    required: false,
  },
  mode: {
    type: String as PropType<'show' | 'season' | 'episode'>,
    required: false,
    default: 'episode',
  },
});

const { mode, episode, season, show } = toRefs(props);

const { getShowLoading, getSeasonsLoading, getEpisodesLoading } = useShowStore();

const { loadRatings, getRatings, getLoading, addRating, removeRating } =
  useRatingsStore();

const { enableRatings } = useExtensionSettingsStoreRefs();

const showId = computed(() => show?.value?.ids.trakt);
const seasonId = computed(() => season?.value?.ids.trakt);
const episodeId = computed(() => episode?.value?.ids.trakt);

const seasonNb = computed(() => season?.value?.number);
const episodeNb = computed(() => episode?.value?.number);

const ratingLoading = computed(() => {
  if (mode.value === 'episode') {
    if (!showId?.value || seasonNb.value === undefined || episodeNb.value === undefined)
      return false;
    return getEpisodesLoading(showId.value, seasonNb.value, episodeNb.value).value;
  }
  if (mode.value === 'season') {
    if (!showId?.value) return false;
    return getSeasonsLoading(showId.value).value;
  }
  if (!showId?.value) return false;
  return getShowLoading(showId.value).value;
});

const scoreLoading = computed(() => {
  if (!showId?.value) return false;
  if (mode.value === 'season') return getLoading(TraktRatingType.Seasons);
  if (mode.value === 'episode') return getLoading(TraktRatingType.Episodes);
  return getLoading(TraktRatingType.Shows);
});

const scoreIds = computed(() => {
  if (!enableRatings.value) return {};

  let id: string | undefined;
  let type: TraktRatingTypes | undefined;

  if (!showId.value) return { id, type };
  if (mode.value === 'show') {
    id = showId.value.toString();
    type = TraktRatingType.Shows;
    return { id, type };
  }
  if (mode.value === 'season') {
    type = TraktRatingType.Seasons;
    if (seasonId.value) id = `${showId.value}-${seasonId.value}`;
    return { id, type };
  }
  if (mode.value === 'episode') {
    type = TraktRatingType.Episodes;
    if (episodeId.value) id = `${showId.value}-${episodeId.value}`;
    return { id, type };
  }
  return { id, type };
});

const score = computed(() => {
  const { id, type } = scoreIds.value;
  if (!id || !type) return null;
  return getRatings(type, id);
});

const ratingUrl = computed(() => {
  if (!show?.value?.ids?.slug) return;
  if (mode.value === 'episode') {
    if (!episodeNb.value || !seasonNb.value) return;
    return ResolveExternalLinks.trakt.item({
      type: 'episode',
      slug: show.value.ids.slug,
      episode: episodeNb.value,
      season: seasonNb.value,
      suffix: '/stats',
    });
  }
  if (mode.value === 'season') {
    if (!seasonNb.value) return;
    return ResolveExternalLinks.trakt.item({
      type: 'season',
      slug: show.value.ids.slug,
      season: seasonNb.value,
      suffix: '/stats',
    });
  }
  return ResolveExternalLinks.trakt.item({
    type: 'shows',
    slug: show.value.ids.slug,
    suffix: '/stats',
  });
});

const votes = computed(() => {
  if (mode.value === 'episode') return episode?.value?.votes;
  if (mode.value === 'season') return season?.value?.votes;
  return show?.value?.votes;
});

const rating = computed(() => {
  if (mode.value === 'episode') return episode?.value?.rating;
  if (mode.value === 'season') return season?.value?.rating;
  return show?.value?.rating;
});

const { getShowOrAnime, getShowOrAnimeLoading } = useSimklStore();

const simklShow = computed(() => {
  if (!show?.value?.ids?.imdb) return;
  return getShowOrAnime(show.value.ids.imdb).value;
});

const simklShowLoading = computed(() => {
  if (!show?.value?.ids?.imdb) return;
  return getShowOrAnimeLoading(show.value.ids.imdb).value;
});

const trailers = computed(() => {
  if (mode.value !== 'show') return;
  if (!simklShow.value?.trailers?.length) return;
  return simklShow.value.trailers
    .filter((t, index) => !!t.youtube && (index < 2 || isTrailer(t.name)))
    .map(trailer => ({
      id: trailer.youtube,
      title: trailer.name ?? simklShow.value?.title,
    }));
});

const ratings = computed<RatingItem[]>(() => {
  const _ratings: RatingItem[] = [];
  _ratings.push({
    name: i18n('trakt', 'common', 'source', 'name'),
    icon: DataSource.Trakt,
    rating: {
      votes: votes.value,
      rating: rating.value,
      url: ratingUrl.value,
      loading: ratingLoading.value,
    },
  });
  if (!simklShow.value?.ratings) return _ratings;
  if (mode.value !== 'show') return _ratings;
  Object.entries(simklShow.value.ratings).forEach(([key, value]) => {
    _ratings.push({
      name: i18n(key, 'common', 'source', 'name'),
      icon: key,
      rating: {
        votes: value.votes,
        rating: value.rating,
        loading: simklShowLoading.value,
        url:
          key === 'mal' ? `https://myanimelist.net/anime/${simklShow.value}` : undefined,
      },
    });
  });

  return _ratings;
});

const onScoreEdit = async (_score: TraktSyncRatingValue) => {
  if (!show?.value?.ids?.trakt) return;
  const addOrRemove = _score ? addRating : removeRating;
  if (mode.value === 'episode') {
    if (!episode?.value?.ids?.trakt) return;
    return addOrRemove(
      TraktRatingType.Episodes,
      {
        episodes: [
          {
            ids: episode.value.ids,
            rating: _score,
          },
        ],
      },
      show.value.ids.trakt,
    );
  }
  if (mode.value === 'season') {
    if (!season?.value?.ids?.trakt) return;
    return addOrRemove(
      TraktRatingType.Seasons,
      {
        seasons: [
          {
            ids: season.value.ids,
            rating: _score,
          },
        ],
      },
      show.value.ids.trakt,
    );
  }
  return addOrRemove(TraktRatingType.Shows, {
    shows: [
      {
        ids: show.value.ids,
        rating: _score,
      },
    ],
  });
};

onMounted(() => {
  watch(scoreIds, ({ id, type }) => {
    if (!id || !type) return;
    loadRatings(type, id);
  });
});
</script>

<template>
  <PanelStatistics
    :ratings="ratings"
    :votes="votes"
    :score="score?.rating"
    :loading-score="scoreLoading"
    @on-score-edit="onScoreEdit"
  >
    <PanelTrailers :trailers="trailers">
      <slot />
    </PanelTrailers>
  </PanelStatistics>
</template>
