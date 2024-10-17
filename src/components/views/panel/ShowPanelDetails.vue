<script lang="ts" setup>
import { shortTime } from '@dvcol/common-utils/common/date';
import { capitalizeEachWord, deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type {
  TraktEpisodeExtended,
  TraktSeasonExtended,
  TraktShowExtended,
} from '@dvcol/trakt-http-client/models';

import type {
  EpisodeProgress,
  SeasonProgress,
  ShowProgress,
} from '~/models/list-scroll.model';

import TextField from '~/components/common/typography/TextField.vue';
import PanelAlias from '~/components/views/panel/PanelAlias.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { useSimklStore } from '~/stores/data/simkl.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

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
  watchedProgress: {
    type: Object as PropType<ShowProgress | SeasonProgress | EpisodeProgress>,
    required: false,
  },
  collectionProgress: {
    type: Object as PropType<ShowProgress | SeasonProgress | EpisodeProgress>,
    required: false,
  },
});

const { mode, episode, season, show, watchedProgress, collectionProgress } =
  toRefs(props);

const i18n = useI18n('panel', 'detail');

const aired = computed(() => {
  if (mode.value === 'episode') {
    if (!episode?.value) return;
    if (!episode.value?.first_aired) return '-';
    return new Date(episode.value?.first_aired);
  }
  if (mode.value === 'season') {
    if (!season?.value) return;
    if (!season.value?.first_aired) return '-';
    return new Date(season.value?.first_aired);
  }
  if (!show?.value) return;
  if (!show.value?.first_aired) return '-';
  return new Date(show.value?.first_aired);
});

const airedDate = computed(() => {
  if (!aired.value) return;
  if (typeof aired.value === 'string') return aired.value;
  return aired.value.toLocaleDateString();
});

const airedTime = computed(() => {
  if (!aired.value) return;
  if (typeof aired.value === 'string') return '-';
  return shortTime(aired.value);
});

const runtime = computed(() => {
  if (mode.value === 'episode') {
    if (!episode?.value) return;
    if (!episode.value?.runtime) return '-';
    return `${episode.value.runtime} min`;
  }
  if (!show?.value) return;
  if (!show.value?.runtime) return '-';
  return `${show.value.runtime} min`;
});

const watchedDate = computed(() => {
  if (!watchedProgress?.value?.date) return;
  return watchedProgress.value.date.toLocaleDateString();
});

const watchedTime = computed(() => {
  if (!watchedProgress?.value?.date) return;
  return shortTime(watchedProgress.value.date);
});

const collectionDate = computed(() => {
  if (!collectionProgress?.value?.date) return;
  return collectionProgress.value.date.toLocaleDateString();
});

const collectionTime = computed(() => {
  if (!collectionProgress?.value?.date) return;
  return shortTime(collectionProgress.value.date);
});

const { getShowOrAnime } = useSimklStore();

const simklShow = computed(() => {
  if (!show?.value?.ids?.imdb) return;
  return getShowOrAnime(show.value.ids.imdb).value;
});

const genres = computed(() => {
  if (!show?.value) return;
  const _genres = new Set<string>();
  show.value?.genres?.forEach(g => _genres.add(g.trim().toLowerCase()));
  simklShow?.value?.genres?.forEach(g => _genres.add(g.trim().toLowerCase()));
  return [..._genres.values()]?.map(g => ({ label: capitalizeEachWord(g) }));
});

const studio = computed(() => {
  if (!simklShow?.value) return;
  if (!('studios' in simklShow.value)) return;
  return simklShow.value.studios?.map(s => s.name).join(', ') || '-';
});

const year = computed(() => {
  if (!show?.value) return;
  return show.value?.year || '-';
});

const status = computed(() => {
  if (!show?.value) return;
  return capitalizeEachWord(show.value?.status) || '-';
});

const airedEpisodes = computed(() => {
  if (!season?.value) return;
  return `${season.value?.aired_episodes ?? '-'} / ${season.value?.episode_count ?? '-'}`;
});

const episodeType = computed(() => {
  if (!episode?.value) return;
  if (episode.value?.episode_type)
    return i18n(episode.value?.episode_type, 'common', 'tag');
  return '-';
});

const network = computed(() => {
  if (!show?.value && !season?.value) return;
  return (show?.value?.network ?? season?.value?.network) || '-';
});

const country = computed(() => {
  if (!show?.value) return;
  return show.value?.country || '-';
});

const ids = computed(() => {
  if (mode.value === 'episode') {
    if (!episode?.value) return;
    return {
      ...episode.value?.ids,
      tmdb: show?.value?.ids?.tmdb,
    };
  }
  if (mode.value === 'season') {
    if (!season?.value) return;
    return {
      ...season.value?.ids,
      tmdb: show?.value?.ids?.tmdb,
    };
  }
  if (!show?.value) return;
  return { ...simklShow.value?.ids, ...show.value?.ids };
});

const { getAliasRef } = useLinksStore();
const showId = computed(() => show?.value?.ids?.trakt.toString());
const alias = getAliasRef('show', showId);
const showAlias = computed(() => alias.value || show?.value?.title);
const showTitle = computed(() => deCapitalise(show?.value?.title));
const title = computed(() =>
  deCapitalise(episode?.value?.title ?? season?.value?.title ?? show?.value?.title),
);
</script>

<template>
  <NFlex size="large" class="container" vertical wrap>
    <NFlex class="link-row" vertical size="large" wrap>
      <!--  Genres  -->
      <TextField
        :label="i18n('genres')"
        :values="genres"
        :skeleton="{ width: '3rem' }"
        array
      />

      <!--  links  -->
      <PanelLinks
        :ids="ids"
        :mode="mode"
        :season="episode?.season ?? season?.number"
        :episode="episode?.number"
        :alias="showAlias"
        :title="title"
        :genres="genres"
      />
    </NFlex>

    <!--  Show name alias  -->
    <PanelAlias :id="showId" scope="show" :placeholder="showTitle" />

    <NFlex class="row" size="large">
      <!--  Show Year  -->
      <TextField :label="i18n('year')" :value="year" :skeleton="{ width: '2.25rem' }" />

      <!--  Show Country  -->
      <TextField :label="i18n('country')" :value="country" :skeleton="{ width: '2ch' }" />

      <!--  Show Network  -->
      <TextField
        :label="i18n('network')"
        :value="network"
        grow
        :skeleton="{ width: '5.5rem' }"
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Runtime  -->
      <TextField
        :label="i18n('runtime')"
        :value="runtime"
        :skeleton="{ width: '3.75rem' }"
      />

      <!--  Season aired episodes  -->
      <TextField
        v-if="mode !== 'show'"
        :label="i18n('aired_episodes')"
        :value="airedEpisodes"
        :skeleton="{ width: '3rem' }"
      />

      <!--  Show Status  -->
      <TextField
        :label="i18n('status')"
        :value="status"
        :grow="mode !== 'show'"
        :skeleton="{ width: '7.5rem' }"
      />

      <!--  Studio  -->
      <TextField
        v-if="mode === 'show' && studio"
        :label="i18n('studio')"
        :value="studio"
        :skeleton="{ width: '3rem' }"
        grow
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Air date  -->
      <TextField
        :label="i18n('aired')"
        :value="airedDate"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Air Time  -->
      <TextField
        :label="i18n('aired_time')"
        :value="airedTime"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Episode Type  -->
      <TextField
        v-if="mode === 'episode'"
        :label="i18n('type')"
        :value="episodeType"
        grow
        :skeleton="{ width: '6.25rem' }"
      />
    </NFlex>

    <NFlex class="row hidden" :class="{ show: watchedDate }" size="large">
      <!--  Watched Date  -->
      <TextField
        :label="i18n('watched')"
        :value="watchedDate ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  watched time  -->
      <TextField
        :label="i18n('watched_time')"
        :value="watchedTime ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />
    </NFlex>

    <NFlex class="row hidden" :class="{ show: collectionDate }" size="large">
      <!--  Collection Date  -->
      <TextField
        :label="i18n('collected')"
        :value="collectionDate ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Collection time  -->
      <TextField
        :label="i18n('collected_time')"
        :value="collectionTime ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.container,
.row {
  @include mixin.transition-show-hide-height;

  flex: 1 1 auto;
  width: 100%;
}

.link-row {
  overflow-x: auto;
  scrollbar-width: thin;
}

@media (width < 700px) {
  .row {
    gap: 0.75rem 0.5rem !important;
  }
}
</style>
