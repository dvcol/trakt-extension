<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';

import { type PropType } from 'vue';

import type { TraktHistory } from '~/models/trakt/trakt-history.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';

defineProps({
  item: {
    type: Object as PropType<TraktHistory>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  poster: {
    type: String,
    required: false,
    default: PosterPlaceholder,
  },
});

const getTitle = (media: TraktHistory) => {
  if ('movie' in media) return media.movie.title;
  if (!media.episode) return media.show?.title;
  const number = media.episode?.number?.toString().padStart(2, '0');
  return `${media.episode?.season}x${number} - ${media?.episode?.title}`;
};

const getContent = (media: TraktHistory) => {
  if ('movie' in media) return media.movie.title;
  return media.show?.title;
};

const getDate = (media: TraktHistory) =>
  media.watched_at ? new Date(media.watched_at).toLocaleString() : media.watched_at;
</script>

<template>
  <NFlex class="panel" vertical size="small" :theme-overrides="{ gapSmall: '0' }">
    <div class="title">
      <NSkeleton v-if="loading" text style="width: 70%" />
      <template v-else>{{ getTitle(item) }}</template>
    </div>
    <div class="content">
      <NSkeleton v-if="loading" text style="width: 60%" />
      <template v-else>{{ getContent(item) }}</template>
    </div>
    <div class="time">
      <NSkeleton v-if="loading" text style="width: 20%" />
      <template v-else>{{ getDate(item) }}</template>
    </div>
  </NFlex>
</template>

<style lang="scss" scoped>
.panel {
  flex: 1 1 auto;
  margin: 0.25rem 0;

  .title {
    margin: var(--n-title-margin);
    color: var(--n-title-text-color);
    font-weight: var(--n-title-font-weight);
    font-size: var(--n-title-font-size);
    transition: color 0.3s var(--n-bezier);
  }

  .content {
    color: var(--n-content-text-color);
    font-size: var(--n-content-font-size);
    transition: color 0.3s var(--n-bezier);
  }

  .time {
    margin-top: 6px;
    color: var(--n-meta-text-color);
    font-size: 12px;
    transition: color 0.3s var(--n-bezier);
  }
}
</style>
