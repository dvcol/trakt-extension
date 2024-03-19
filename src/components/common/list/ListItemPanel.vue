<script setup lang="ts">
import { NEllipsis, NFlex, NSkeleton } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import { useI18n } from '~/utils';

const i18n = useI18n('list-item-panel');

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
  hideDate: {
    type: Boolean,
    required: false,
  },
});

const { item } = toRefs(props);

const type = computed(() =>
  item.value.type ? i18n(item.value.type, 'common', 'media', 'type') : item.value.type,
);

const title = computed(() => {
  const media = item.value;
  if (media.person) return media.person.name;
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

const currentDate = computed(() => item.value.date?.current);
const date = computed(() => currentDate.value?.toLocaleTimeString());
</script>

<template>
  <NFlex
    class="panel"
    vertical
    justify="center"
    size="small"
    :theme-overrides="{ gapSmall: '0' }"
  >
    <div class="meta type">
      <NSkeleton v-if="loading" text style="width: 10%" round />
      <NEllipsis v-else :line-clamp="1">{{ type }}</NEllipsis>
    </div>
    <div class="title">
      <NSkeleton v-if="loading" text style="width: 70%" round />
      <NEllipsis v-else :line-clamp="2">{{ title }}</NEllipsis>
    </div>
    <div class="content">
      <NSkeleton v-if="loading" text style="width: 60%" round />
      <NEllipsis v-else :line-clamp="2">{{ content }}</NEllipsis>
    </div>
    <div v-if="!hideDate" class="meta time">
      <NSkeleton v-if="loading" text style="width: 20%" round />
      <NEllipsis v-else :line-clamp="1">{{ date }}</NEllipsis>
    </div>
  </NFlex>
</template>

<style lang="scss" scoped>
.panel {
  flex: 1 1 auto;
  margin: 0.25rem 0;

  .title {
    font-variant-numeric: tabular-nums;
    color: var(--trakt-red);
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
    margin-top: 0.25rem;
  }
}
</style>
