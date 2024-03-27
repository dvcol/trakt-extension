<script setup lang="ts">
import {
  NEllipsis,
  NFlex,
  NProgress,
  NSkeleton,
  NTag,
  NTooltip,
  type PopoverProps,
} from 'naive-ui';

import { computed, defineProps, type PropType, ref, toRefs } from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import { type ListScrollItem } from '~/models/list-scroll.model';

import { useShowStore } from '~/stores/data/show.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils';
import { createTab } from '~/utils/browser/browser.utils';
import { deCapitalise } from '~/utils/string.utils';

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
  return item.value.date?.current?.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const tags = computed(
  () =>
    item.value.tags?.map(tag => {
      if (!tag.i18n) return tag;
      if (typeof tag.i18n === 'boolean') return { ...tag, label: i18n(tag.label) };
      return { ...tag, label: i18n(tag.label, ...tag.i18n) };
    }),
);

const { getShowProgress } = useShowStore();

const progress = computed(() => {
  if (item?.value?.progress) return item.value.progress;
  if (item?.value?.progressRef) return item.value.progressRef.value;
  if (!item?.value?.getProgressQuery) return;
  const id = item.value.getProgressQuery();
  if (!id) return;
  return getShowProgress(id).value;
});

const innerContainer = ref();
const tooltipOptions = computed<PopoverProps>(() => ({
  to: innerContainer.value,
  showArrow: false,
  delay: 500,
}));

const { openLinksInNewTab } = useExtensionSettingsStoreRefs();
const onTagClick = (e: MouseEvent, url?: string) => {
  e.preventDefault();
  if (!url) return;
  createTab({ url, active: openLinksInNewTab.value });
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
        <template v-for="tag of tags" :key="tag.label">
          <NSkeleton v-if="loading" text style="width: 6%" />
          <a v-else :href="tag.url" @click="e => onTagClick(e, tag.url)">
            <NTag
              class="tag"
              :class="{ meta: tag.meta, link: !!tag.url }"
              size="small"
              :bordered="tag.bordered ?? false"
              v-bind="tag"
            >
              {{ tag.label }}
            </NTag>
          </a>
        </template>
        <template v-if="date">
          <NSkeleton v-if="loading" text style="width: 6%" />
          <NTag v-else class="tag" size="small" type="default" :bordered="false">
            {{ date }}
          </NTag>
        </template>
      </NFlex>
      <div v-if="showProgress && !loading" class="panel-progress">
        <NTooltip
          class="panel-progress-tooltip"
          :disabled="!progress"
          placement="top-end"
          :delay="100"
          :to="innerContainer"
        >
          <NFlex v-if="progress" vertical align="flex-end">
            <div>
              <span class="metric">{{ progress?.completed }}</span>
              <span> / </span>
              <span class="metric">{{ progress?.total }}</span>
              <span>&nbsp;</span>
              <span>{{ i18n('tooltip_episodes') }}</span>
            </div>
            <div>
              <span class="metric">{{ Math.round(progress?.percentage) }}</span>
              <span>%</span>
              <span>&nbsp;</span>
              <span>{{ i18n('tooltip_watched') }}</span>
            </div>
            <div>
              <span class="metric">{{ progress?.total - progress?.completed }}</span>
              <span>&nbsp;</span>
              <span>{{ i18n('tooltip_remaining') }}</span>
            </div>
          </NFlex>
          <template #trigger>
            <NProgress
              class="line"
              :data-show-id="progress?.id"
              :data-percentage="progress?.percentage"
              :theme-overrides="{
                railHeight: 'var(--rail-height)',
              }"
              :percentage="progress?.percentage ?? 0"
              :show-indicator="false"
              color="var(--trakt-red-dark)"
            />
          </template>
        </NTooltip>
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

    .tag {
      width: fit-content;
    }

    .link {
      cursor: pointer;

      &:hover {
        background-color: color-mix(
          in srgb,
          var(--n-close-icon-color-hover),
          transparent 90%
        );
      }
    }
  }

  .panel-progress {
    --rail-height: 4px;

    padding-top: 0.75rem;

    &:hover {
      --trakt-red-dark: var(--trakt-red);
    }

    &-tooltip {
      font-size: 0.8rem;

      .metric {
        color: var(--vt-c-white);
        font-weight: bolder;
        font-variant-numeric: tabular-nums;
      }
    }
  }
}
</style>

<style lang="scss">
.panel-progress-tooltip.n-tooltip.n-tooltip {
  background: var(--bg-color-80);
}
</style>
