<script setup lang="ts">
import { NFlex, NSkeleton } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  poster: {
    type: String,
    required: false,
    default: PosterPlaceholder,
  },
});

const { item } = toRefs(props);

const title = computed(() => {
  const media = item.value;
  if (media.movie) return media.movie.title;
  if (!media.episode) return media.show?.title;
  const number = media.episode.number?.toString().padStart(2, '0');
  return `${media.episode.season}x${number} - ${media.episode.title}`;
});

const content = computed(() => {
  const media = item.value;
  if (media.movie) return media.movie.year;
  if (!media.episode) return media.show?.year;
  return media.show?.title;
});

const date = computed(() => {
  const media = item.value;
  return media.date?.current?.toLocaleString();
});

const type = computed(() => {
  const media = item.value;
  if ('movie' in media) return 'Movie';
  if (!media.episode) return 'Show';
  return 'Episode';
});
</script>

<template>
  <NFlex
    class="panel"
    vertical
    size="small"
    justify="center"
    :theme-overrides="{ gapSmall: '0' }"
  >
    <div class="title">
      <NSkeleton v-if="loading" text style="width: 70%" />
      <template v-else>{{ title }}</template>
    </div>
    <div class="content">
      <NSkeleton v-if="loading" text style="width: 60%" />
      <template v-else>{{ content }}</template>
    </div>
    <div class="meta type">
      <NSkeleton v-if="loading" text style="width: 10%" />
      <template v-else>{{ type }}</template>
    </div>
    <div class="meta time">
      <NSkeleton v-if="loading" text style="width: 20%" />
      <template v-else>{{ date }}</template>
    </div>
  </NFlex>
</template>

<style lang="scss" scoped>
.panel {
  flex: 1 1 auto;
  margin: 0.25rem 0;

  .title {
    font-variant-numeric: tabular-nums;
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

  .meta {
    color: var(--n-meta-text-color);
    font-size: 12px;
    transition: color 0.3s var(--n-bezier);
  }

  .time {
    margin-top: 0.5rem;
  }

  .type {
    margin-top: 0.5rem;
  }
}
</style>
