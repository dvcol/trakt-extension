<script setup lang="ts">
import { NFlex, NSkeleton, NTimelineItem } from 'naive-ui';

import type { PropType } from 'vue';
import type { TraktHistory } from '~/models/trakt/trakt-history.model';

defineProps({
  item: {
    type: Object as PropType<TraktHistory>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
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
  <template v-if="item.id >= 0">
    <NTimelineItem
      v-if="item.id >= 0"
      :key="item.id"
      class="timeline-item"
      :data-key="item.id"
      :data-index="index"
      type="success"
      :title="getTitle(item)"
      :content="getContent(item)"
      :time="getDate(item)"
    />
  </template>
  <template v-else>
    <NTimelineItem
      :key="item.id"
      class="timeline-item"
      :data-key="item.id"
      :data-index="index"
      line-type="dashed"
    >
      <template #default>
        <NFlex vertical>
          <NSkeleton text style="width: 70%" />
          <NSkeleton text style="width: 60%" />
          <NSkeleton text style="width: 20%" />
        </NFlex>
      </template>
    </NTimelineItem>
  </template>
</template>

<style lang="scss" scoped>
.timeline-item {
  font-variant-numeric: tabular-nums;
  margin: 0 1rem;
}
</style>
