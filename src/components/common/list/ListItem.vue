<script setup lang="ts">
import { NFlex, NImage, NSkeleton, NTime, NTimelineItem } from 'naive-ui';

import { computed, type PropType } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import ListItemPanel from '~/components/common/list/ListItemPanel.vue';
import { Colors } from '~/styles/colors.style';

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

const onHover = (hover: boolean) => {
  emit('onHover', { index: props.index, item: props.item, hover });
};

const noHeader = computed(() => props.noHeader || props.item.date?.sameDayAsPrevious);
const nextHasHead = computed(
  () => props.nextHasHeader || !props.item.date?.sameDayAsNext,
);
const date = computed(() => props.item.date?.current);
const year = new Date().getFullYear();
const sameYear = computed(() => date.value?.getFullYear() === year);
const loading = computed(() => props.item.loading);
</script>

<template>
  <NTimelineItem
    :key="item.id"
    class="timeline-item"
    :class="{ 'no-header': noHeader, 'next-has-header': nextHasHead }"
    :data-key="item.id"
    :data-index="index"
    :line-type="item.loading ? 'dashed' : lineType"
    :color="item.loading ? 'grey' : color"
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
      <NFlex class="content" :class="{ 'no-border': noHeader }" :wrap="false">
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
          <template v-if="date && !noHeader">
            <NTime class="month" :time="date" format="MMM" />
            <NTime class="day" :time="date" format="dd" />
            <NTime :time="date" format="eee" />
            <NTime v-if="!sameYear" class="year" :time="date" format="yyyy" />
          </template>
          <template v-else-if="loading">
            <NSkeleton text style="width: 1rem" />
            <NSkeleton text style="width: 2rem" />
            <NSkeleton text style="width: 1rem" />
          </template>
        </NFlex>
        <NFlex class="tile" :wrap="false">
          <NImage
            alt="poster-image"
            class="poster"
            lazy
            preview-disabled
            :src="poster"
            :preview-src="poster"
            :fallback-src="PosterPlaceholder"
          />
          <ListItemPanel :item="item" :loading="item.loading">
            <slot :item="item" :index="index" :loading="item.loading" />
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

  .content {
    padding: 0.5rem;

    .tile {
      @include mixin.hover-background(
        $from: transparent,
        $to: var(--bg-color-20),
        $transition: 0.2s var(--n-bezier)
      );

      flex: 1 1 auto;
    }
  }

  .header {
    width: 2.5rem;
    margin: 0.25rem 0.5rem 0 -0.25rem;
    color: var(--n-text-color);
    font-size: 14px;

    &.hover {
      color: var(--trakt-red);
      transition: color 0.2s var(--n-bezier);
      will-change: color;
    }

    .month {
      font-weight: bold;
    }

    .day {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .year {
      color: var(--n-meta-text-color);
    }
  }

  .poster {
    justify-content: center;
    width: 5.5rem;
    height: 8rem;
    background-color: #111;
  }
}
</style>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- library class name */

.timeline-item.n-timeline-item .n-timeline-item-content .n-timeline-item-content__meta {
  margin: 0;
}

.n-timeline.n-timeline--left-placement {
  .timeline-item.n-timeline-item .n-timeline-item-timeline {
    top: calc(0% - var(--n-icon-size) / 2);
  }

  .timeline-item.no-header.n-timeline-item .n-timeline-item-timeline {
    .n-timeline-item-timeline__line {
      top: 0;
    }

    .n-timeline-item-timeline__circle {
      display: none;
    }
  }

  .timeline-item.n-timeline-item .n-timeline-item-content {
    border-top: 1px solid transparent;

    .n-timeline-item-content__title {
      margin: 0;
    }
  }

  .timeline-item.n-timeline-item:not(.no-header) .n-timeline-item-content {
    border-top: 1px solid rgba(255 255 255 / 10%);
  }
}
</style>
