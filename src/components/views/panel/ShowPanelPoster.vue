<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { computed, ref, toRefs, Transition } from 'vue';

import type { PosterItem } from '~/models/poster.model';
import type { ImageQuery } from '~/stores/data/image.store';

import PosterComponent from '~/components/common/poster/PosterComponent.vue';

const props = defineProps({
  showId: {
    type: Number,
    required: false,
  },
  seasonNumber: {
    type: Number,
    required: false,
  },
  episodeNumber: {
    type: Number,
    required: false,
  },
});

const { showId, seasonNumber, episodeNumber } = toRefs(props);

const size = computed(() => window?.innerWidth ?? 800 / 2);

const posterItem = computed<PosterItem | undefined>(() => {
  const tmdb = showId?.value;
  if (!tmdb) return;
  const imageQuery: ImageQuery = {
    id: tmdb,
    season: seasonNumber?.value,
    episode: episodeNumber?.value,
    type: 'show',
  };
  if (episodeNumber?.value !== undefined) imageQuery.type = 'episode';
  else if (seasonNumber?.value !== undefined) imageQuery.type = 'season';

  return {
    posterRef: ref(),
    getPosterQuery: () => imageQuery,
  };
});

const key = computed(() => {
  if (episodeNumber?.value !== undefined && seasonNumber?.value !== undefined) {
    return `episode-${episodeNumber.value}-season-${seasonNumber.value}`;
  }
  if (seasonNumber?.value !== undefined) return `season-${seasonNumber.value}`;
  if (showId?.value !== undefined) return `show-${showId?.value}`;
  return `placeholder`;
});
</script>

<template>
  <Transition name="scale" mode="out-in">
    <NFlex
      v-if="posterItem"
      :key="key"
      class="poster-container"
      :class="{ landscape: !!episodeNumber }"
    >
      <PosterComponent :item="posterItem" :episode="!!episodeNumber" :size="size" />
    </NFlex>
  </Transition>
</template>
