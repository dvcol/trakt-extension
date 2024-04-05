<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';
import type { TraktSeasonExtended } from '~/models/trakt/trakt-season.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import PanelDetail from '~/components/views/panel/PanelDetail.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { useI18n } from '~/utils';
import { capitalizeEachWord } from '~/utils/string.utils';

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

const i18n = useI18n('panel', 'detail');

const aired = computed(() => {
  if (mode.value === 'episode') {
    if (!episode?.value) return;
    if (!episode.value?.first_aired) return '-';
    return new Date(episode.value?.first_aired).toLocaleDateString();
  }
  if (mode.value === 'season') {
    if (!season?.value) return;
    if (!season.value?.first_aired) return '-';
    return new Date(season.value?.first_aired).toLocaleDateString();
  }
  if (!show?.value) return;
  if (!show.value?.first_aired) return '-';
  return new Date(show.value?.first_aired).toLocaleDateString();
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

const genres = computed(() => {
  if (!show?.value) return;
  return show.value?.genres?.map(g => ({ label: capitalizeEachWord(g) }));
});

const year = computed(() => {
  if (!show?.value) return;
  return show.value?.year ?? '-';
});

const status = computed(() => {
  if (!show?.value) return;
  return capitalizeEachWord(show.value?.status) ?? '-';
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
  return show?.value?.network ?? season?.value?.network ?? '-';
});

const country = computed(() => {
  if (!show?.value) return;
  return show.value?.country ?? '-';
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
  return show.value?.ids;
});
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Show Year  -->
      <PanelDetail :label="i18n('year')" :value="year" :skeleton="{ width: '2.25rem' }" />

      <!--  Show Country  -->
      <PanelDetail
        :label="i18n('country')"
        :value="country"
        :skeleton="{ width: '2ch' }"
      />

      <!--  Show Status  -->
      <PanelDetail
        :label="i18n('status')"
        :value="status"
        :skeleton="{ width: '7.5rem' }"
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Air date  -->
      <PanelDetail
        :label="i18n('aired')"
        :value="aired"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Runtime  -->
      <PanelDetail
        :label="i18n('runtime')"
        :value="runtime"
        :skeleton="{ width: '3.75rem' }"
      />

      <!--  Show Network  -->
      <PanelDetail
        :label="i18n('network')"
        :value="network"
        :grow="true"
        :skeleton="{ width: '5.5rem' }"
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Season aired episodes  -->
      <PanelDetail
        v-if="mode !== 'show'"
        :label="i18n('aired_episodes')"
        :value="airedEpisodes"
        :skeleton="{ width: '3rem' }"
      />

      <!--  Type  -->
      <PanelDetail
        v-if="mode === 'episode'"
        :label="i18n('type')"
        :value="episodeType"
        :skeleton="{ width: '6.25rem' }"
      />
    </NFlex>

    <!--  Genres  -->
    <PanelDetail
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
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.container,
.row {
  flex: 1 1 auto;
  width: 100%;
}
</style>
