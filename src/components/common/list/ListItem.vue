<script setup lang="ts">
import { NFlex, NImage, NSkeleton, NTime, NTimelineItem } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import ListItemPanel from '~/components/common/list/ListItemPanel.vue';
import { useImageStore, useImageStoreRefs } from '~/stores/data/image.store';
import { Colors } from '~/styles/colors.style';
import { findClosestMatch } from '~/utils/math.utils';

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: false,
    default: PosterPlaceholder,
  },
  episode: {
    type: Boolean,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: Colors.traktRedDark,
  },
  lineType: {
    type: String as PropType<'dashed' | 'default'>,
    required: false,
    default: 'default',
  },
  noHeader: {
    type: Boolean,
    required: false,
  },
  nextHasHeader: {
    type: Boolean,
    required: false,
  },
  hideDate: {
    type: Boolean,
    required: false,
  },
  hover: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onHover', event: { index: number; item: ListScrollItem; hover: boolean }): void;
}>();

const { item, index, noHeader, nextHasHeader, poster, episode, hideDate } = toRefs(props);

const onHover = (_hover: boolean) => {
  emit('onHover', { index: index?.value, item: item?.value, hover: _hover });
};

const noHead = computed(
  () => !hideDate.value && (noHeader.value || item?.value?.date?.sameDayAsPrevious),
);
const nextHasHead = computed(
  () => hideDate.value || nextHasHeader.value || !item?.value?.date?.sameDayAsNext,
);
const date = computed(() => item?.value?.date?.current);

const year = new Date().getFullYear();
const sameYear = computed(() => date.value?.getFullYear() === year);
const loading = computed(() => item?.value?.loading);

const { getImageUrl } = useImageStore();
const { imageSizes } = useImageStoreRefs();

const imageSize = computed(() =>
  imageSizes.value?.poster?.length
    ? findClosestMatch(200, imageSizes.value.poster)
    : 'original',
);

const itemPoster = computed(() => {
  const media = item.value;
  if (media.poster) return media.poster;
  const query = media.getPosterQuery?.();
  if (query)
    return getImageUrl(
      episode.value ? query : { ...query, episode: undefined },
      imageSize.value,
    ).value;
  return null;
});

const resolvedPoster = computed(() => itemPoster.value || poster.value);
</script>

<template>
  <NTimelineItem
    :key="item.id"
    class="timeline-item"
    :class="{
      'no-header': noHead,
      'next-has-header': nextHasHead,
      'show-date': !hideDate,
    }"
    :data-key="item.id"
    :data-index="index"
    :line-type="loading ? 'dashed' : lineType"
    :color="loading ? 'grey' : color"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <template #icon>
      <slot name="tag" />
    </template>
    <template #header>
      <slot name="before" />
    </template>
    <template #default>
      <NFlex
        class="content"
        :class="{ 'no-border': noHead }"
        size="small"
        :theme-overrides="{ gapSmall: '0' }"
        :wrap="false"
      >
        <NFlex
          v-if="!hideDate"
          class="header"
          :class="{ hover }"
          vertical
          justify="flex-start"
          align="center"
          size="small"
          :theme-overrides="{ gapSmall: '0.25rem' }"
        >
          <template v-if="date && !noHead && !loading">
            <NTime class="month" :time="date" format="MMM" />
            <NTime class="day" :time="date" format="dd" />
            <NTime class="week" :time="date" format="eee" />
            <NTime v-if="!sameYear" class="year" :time="date" format="yyyy" />
          </template>
          <template v-else-if="loading">
            <NSkeleton class="loading month" text round />
            <NSkeleton class="loading day" text round />
            <NSkeleton class="loading week" text round />
          </template>
        </NFlex>
        <NFlex class="tile" :wrap="false">
          <NImage
            alt="poster-image"
            class="poster"
            lazy
            preview-disabled
            :src="resolvedPoster"
            :fallback-src="PosterPlaceholder"
          />
          <NImage
            alt="poster-image-fallback"
            class="poster placeholder"
            lazy
            preview-disabled
            :src="PosterPlaceholder"
            :fallback-src="PosterPlaceholder"
          />
          <ListItemPanel :item="item" :loading="loading" :hide-date="hideDate">
            <slot :item="item" :index="index" :loading="loading" />
          </ListItemPanel>
        </NFlex>
      </NFlex>
    </template>
    <template #footer>
      <slot name="after" />
    </template>
  </NTimelineItem>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/z-index' as layers;

.timeline-item {
  margin: 0 1rem;

  &.show-date {
    margin-left: 4rem;
  }

  .content {
    .tile {
      @include mixin.hover-background(
        $from: transparent,
        $to: var(--bg-color-20),
        $transition: 0.2s var(--n-bezier)
      );

      flex: 1 1 auto;
      padding: 0.5rem;
    }
  }

  .header {
    position: absolute;
    top: 0;
    left: -3.75rem;
    width: 3.5rem;
    color: var(--n-text-color);
    font-size: 14px;
    border-top: 1px solid var(--border-grey);

    &.hover {
      color: var(--trakt-red);
      transition: color 0.2s var(--n-bezier);
      will-change: color;
    }

    .month {
      margin-top: 0.75rem;
      font-weight: bold;
    }

    .day {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .year {
      margin-top: 0.25rem;
      opacity: 0.5;
    }

    .loading {
      margin-bottom: 0.25rem;

      &.month {
        width: 1.5rem;
        height: 0.8rem;
      }

      &.day {
        width: 2rem;
        height: 1rem;
      }

      &.week {
        width: 1.6rem;
        height: 0.75rem;
      }
    }
  }

  &.no-header {
    .header {
      border-top: 1px solid transparent;
    }
  }

  .poster {
    flex: 0 1 var(--poster-width, 5.3125rem);
    justify-content: center;
    width: var(--poster-width, 5.3125rem);
    height: var(--poster-height, 8rem);

    &.placeholder {
      position: absolute;
      background-color: #111;
    }

    &:not(.placeholder) {
      z-index: layers.$in-front;
    }
  }
}
</style>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- library class name */

.n-timeline.n-timeline--left-placement .timeline-item.n-timeline-item {
  .n-timeline-item-timeline {
    --n-icon-size: 12px;

    top: calc(0% - var(--n-icon-size) / 2);
  }

  &.no-header .n-timeline-item-timeline {
    &__line {
      top: 0;
    }

    &__circle {
      display: none;
    }
  }

  &:last-child .n-timeline-item-timeline {
    &__line {
      display: block;
    }
  }

  .n-timeline-item-content {
    margin-left: calc(var(--n-icon-size) + 0.125rem);
    border-top: 1px solid transparent;

    &__meta {
      margin: 0;
    }

    &__title {
      margin: 0;
    }
  }

  &:not(.no-header) .n-timeline-item-content {
    border-top: 1px solid var(--border-grey);
  }
}
</style>
