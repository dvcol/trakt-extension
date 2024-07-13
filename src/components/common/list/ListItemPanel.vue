<script setup lang="ts">
import { shortTime } from '@dvcol/common-utils/common/date';
import { deCapitalise } from '@dvcol/common-utils/common/string';
import {
  NEllipsis,
  NFlex,
  NProgress,
  NSkeleton,
  NTag,
  type PopoverProps,
} from 'naive-ui';

import { computed, defineProps, type PropType, ref, toRefs } from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import TagLink from '~/components/common/buttons/TagLink.vue';
import ProgressTooltip from '~/components/common/tooltip/ProgressTooltip.vue';
import { type ListScrollItem, type ShowProgress } from '~/models/list-scroll.model';

import { ProgressType } from '~/models/progress-type.model';
import { useShowStore } from '~/stores/data/show.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'item', 'panel');

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
  showProgress: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { item, hideDate } = toRefs(props);

const type = computed(() =>
  item.value.type ? i18n(item.value.type, 'common', 'media', 'type') : item.value.type,
);

const title = computed(() => deCapitalise(item.value.title));

const content = computed(() => deCapitalise(item.value.content));

const date = computed(() => {
  if (hideDate.value) return;
  if (!item.value?.date?.current) return;
  return shortTime(item.value.date.current);
});

const tags = computed(
  () =>
    item.value.tags?.map(tag => {
      if (!tag.i18n) return tag;
      if (typeof tag.i18n === 'boolean') return { ...tag, label: i18n(tag.label) };
      return { ...tag, label: i18n(tag.label, ...tag.i18n) };
    }),
);

const { getShowWatchedProgress } = useShowStore();

const progress = computed<ShowProgress | undefined>(() => {
  if (item?.value?.progress) return item.value?.progress;
  if (item?.value?.progressRef) return item.value?.progressRef.value;
  if (!item?.value?.getProgressQuery) return;
  const { id, cacheOptions } = item.value?.getProgressQuery() ?? {};
  if (!id) return;
  return getShowWatchedProgress(id, cacheOptions).value;
});

const { progressType } = useExtensionSettingsStoreRefs();

const percentage = computed(() => {
  if (!progress.value) return;
  if (progressType.value === ProgressType.Season) {
    if (progress.value?.lastAired) return progress.value?.lastAired?.percentage;
  }
  return progress.value?.percentage;
});

const innerContainer = ref();
const tooltipOptions = computed<PopoverProps>(() => ({
  to: innerContainer.value,
  showArrow: false,
  delay: 500,
}));

const { openTab } = useLinksStore();
const onTagClick = (url?: string) => {
  if (!url) return;
  openTab(url);
};
</script>

<template>
  <NFlex
    class="panel"
    vertical
    justify="center"
    size="small"
    :theme-overrides="{ gapSmall: '0' }"
  >
    <div ref="innerContainer">
      <div class="meta type">
        <NSkeleton v-if="loading" text style="width: 10%" round />
        <NEllipsis v-else :line-clamp="1" :tooltip="tooltipOptions">{{ type }}</NEllipsis>
      </div>
      <div class="title">
        <NSkeleton v-if="loading" text style="width: 70%" round />
        <NEllipsis v-else :line-clamp="2" :tooltip="tooltipOptions">{{
          title
        }}</NEllipsis>
      </div>
      <div class="content">
        <NSkeleton v-if="loading" text style="width: 60%" round />
        <NEllipsis v-else :line-clamp="1" :tooltip="tooltipOptions">{{
          content
        }}</NEllipsis>
      </div>
      <NFlex v-if="date || tags?.length" size="medium" class="tags">
        <template v-for="(tag, i) of tags" :key="`${i}-${tag.label}`">
          <NSkeleton v-if="loading" text style="width: 6%" />
          <TagLink :tag="tag" @on-click="onTagClick" />
        </template>
        <template v-if="date">
          <NSkeleton v-if="loading" text style="width: 6%" />
          <NTag v-else class="tag" size="small" type="default" :bordered="false">
            {{ date }}
          </NTag>
        </template>
      </NFlex>
      <div v-if="showProgress && !loading" class="panel-progress">
        <ProgressTooltip :progress="progress" :to="innerContainer" placement="top-end">
          <NProgress
            class="line"
            :data-show-id="progress?.id"
            :data-percentage="percentage"
            :theme-overrides="{
              railHeight: 'var(--rail-height)',
            }"
            :percentage="percentage ?? 0"
            :show-indicator="false"
            color="var(--trakt-red-dark)"
          />
        </ProgressTooltip>
      </div>
    </div>
  </NFlex>
</template>

<style lang="scss" scoped>
.panel {
  flex: 1 1 auto;
  margin: 0 0 0.25rem;

  .title {
    margin-top: 0.1rem;
    color: var(--trakt-red);
    font-weight: var(--n-title-font-weight);
    font-size: var(--n-title-font-size);
    transition: color 0.3s var(--n-bezier);
    font-variant-numeric: tabular-nums;
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

  .tags {
    gap: 0.5rem !important;
    margin-top: 0.3rem;
  }

  .panel-progress {
    --rail-height: 4px;

    padding-top: 0.75rem;

    &:hover {
      --trakt-red-dark: var(--trakt-red);
    }
  }
}
</style>

<style lang="scss">
.panel-progress-tooltip.n-tooltip.n-tooltip {
  background: var(--bg-color-80);
}
</style>
