<script lang="ts" setup>
import { NFlex, NSkeleton } from 'naive-ui';
import { computed, type PropType, ref, toRefs, Transition } from 'vue';

import type { PosterItem } from '~/models/poster.model';
import type { ImageQuery, ImageStoreTypes } from '~/stores/data/image.store';

import PosterComponent from '~/components/common/poster/PosterComponent.vue';

const props = defineProps({
  tmdb: {
    type: Number,
    required: false,
  },
  mode: {
    type: String as PropType<ImageStoreTypes>,
    required: true,
  },
  portait: {
    type: Boolean,
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

const { tmdb, mode, seasonNumber, episodeNumber } = toRefs(props);

const size = computed(() => window?.innerWidth ?? 800 / 2);

const posterItem = computed<PosterItem | undefined>(() => {
  const id = tmdb?.value;
  const type = mode?.value;

  if (!id || !type) return;

  const imageQuery: ImageQuery = {
    id,
    type,
    season: seasonNumber?.value,
    episode: episodeNumber?.value,
  };

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
  if (tmdb?.value !== undefined) return `tmdb-${tmdb?.value}`;
  return `placeholder`;
});
</script>

<template>
  <Transition v-if="posterItem" name="scale" mode="out-in">
    <NFlex :key="key" class="poster-container" :class="{ landscape: !portait }">
      <PosterComponent :item="posterItem" :size="size" :backdrop="!portait" />
    </NFlex>
  </Transition>
  <NSkeleton
    v-else
    class="poster-container skeleton"
    :class="{ landscape: mode !== 'season' }"
  />
</template>

<style lang="scss" scoped>
@use '~/styles/transition' as transition;
@include transition.scale;

.poster-container {
  --poster-height: calc(50dvw * (9 / 16));
  --poster-width: calc(var(--poster-height) * (2 / 3));

  &.landscape {
    --poster-width: 50dvw;
    --poster-height: calc(var(--poster-width) * (9 / 16));
  }

  &.skeleton {
    width: var(--poster-width);
    height: var(--poster-height);
  }

  position: relative;
  margin: 1.75rem 0;
  border: 1px solid var(--border-white);
  border-radius: var(--poster-radius, 8px);
  box-shadow: var(--image-box-shadow);
}
</style>
