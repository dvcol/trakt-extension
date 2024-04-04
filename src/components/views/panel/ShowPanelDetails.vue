<script lang="ts" setup>
import { NFlex, NSkeleton, NTag } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';
import type { TraktSeasonExtended } from '~/models/trakt/trakt-season.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

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
  return show.value?.genres?.map(capitalizeEachWord) ?? [];
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
  return episode.value?.episode_type ?? '-';
});

const network = computed(() => {
  if (!show?.value && !season?.value) return;
  return show?.value?.network ?? season?.value?.network ?? '-';
});

const country = computed(() => {
  if (!show?.value) return;
  return show.value?.country ?? '-';
});
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Show Year  -->
      <NFlex class="detail" align="center">
        <span class="prefix">Year</span>
        <span v-if="year">{{ year }}</span>
        <NSkeleton v-else style="width: 2.25rem" round />
      </NFlex>

      <!--  Show Country  -->
      <NFlex class="detail" align="center">
        <span class="prefix">Country</span>
        <span v-if="country">{{ country }}</span>
        <NSkeleton v-else style="width: 2ch" round />
      </NFlex>

      <!--  Show Network  -->
      <NFlex class="detail" align="center">
        <span class="prefix">Network</span>
        <span v-if="network">{{ network }}</span>
        <NSkeleton v-else style="width: 5.5rem" round />
      </NFlex>
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Air date  -->
      <NFlex class="detail" align="center">
        <span class="prefix">Aired</span>
        <span v-if="aired">{{ aired }}</span>
        <NSkeleton v-else style="width: 5.125rem" round />
      </NFlex>

      <!--  Show Status  -->
      <NFlex class="detail" align="center">
        <span class="prefix">Status</span>
        <span v-if="status">{{ status }}</span>
        <NSkeleton v-else style="width: 7.5rem" round />
      </NFlex>

      <!--  Runtime  -->
      <NFlex class="detail" align="center">
        <span class="prefix">Runtime</span>
        <span v-if="runtime">{{ runtime }}</span>
        <NSkeleton v-else style="width: 3.75rem" round />
      </NFlex>
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Season aired episodes  -->
      <NFlex v-if="mode !== 'show'" class="detail" align="center">
        <span class="prefix">Aired episodes</span>
        <span v-if="airedEpisodes">{{ airedEpisodes }}</span>
        <NSkeleton v-else style="width: 3rem" round />
      </NFlex>

      <!--  Type  -->
      <NFlex v-if="mode === 'episode'" class="detail" align="center">
        <span class="prefix">Type</span>
        <span v-if="episodeType">{{ episodeType }}</span>
        <NSkeleton v-else style="width: 6.25rem" round />
      </NFlex>
    </NFlex>

    <!--  Genres  -->
    <NFlex class="detail genres" align="center" justify="flex-start">
      <span class="prefix">Genres</span>
      <template v-if="genres">
        <NTag v-for="(genre, i) of genres" :key="i" size="small" round>{{ genre }}</NTag>
      </template>
      <template v-else>
        <NSkeleton style="width: 3rem" round />
        <NSkeleton style="width: 3rem" round />
        <NSkeleton style="width: 3rem" round />
      </template>
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
.container,
.row {
  flex: 1 1 auto;
  width: 100%;
}

.prefix {
  color: var(--white-50);
  font-weight: 600;
  transition: color 0.3s var(--n-bezier);
}

.detail {
  flex: 1 1 30%;

  &:hover .prefix {
    color: var(--white-70);
  }

  &.genres {
    flex: 1 1 auto;
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
