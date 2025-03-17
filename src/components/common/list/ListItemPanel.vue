<script setup lang="ts">
import { shortTime } from '@dvcol/common-utils/common/date';
import { deCapitalise } from '@dvcol/common-utils/common/string';
import {
  NEllipsis,
  NFlex,
  NIcon,
  NProgress,
  NSkeleton,
  NTag,
  type PopoverProps,
} from 'naive-ui';

import { computed, defineProps, type PropType, ref, toRefs, watch } from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import AnchorLink from '~/components/common/buttons/AnchorLink.vue';
import TagLink from '~/components/common/buttons/TagLink.vue';
import ProgressTooltip from '~/components/common/tooltip/ProgressTooltip.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconLoading from '~/components/icons/IconLoading.vue';
import IconPlayFilled from '~/components/icons/IconPlayFilled.vue';
import { getCustomLinkIcon } from '~/models/link.model';
import { type ListScrollItem } from '~/models/list-scroll.model';

import { ProgressType } from '~/models/progress-type.model';
import { useItemCollected, useItemPlayed } from '~/stores/composable/use-item-played';
import { openLink } from '~/stores/composable/use-links';
import { useShowStore } from '~/stores/data/show.store';
import { useWatchingStore } from '~/stores/data/watching.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
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
  hideTime: {
    type: Boolean,
    required: false,
  },
  contentHeight: {
    type: Number,
    required: false,
    default: 1,
  },
  showProgress: {
    type: Boolean,
    required: false,
    default: false,
  },
  showPlayed: {
    type: Boolean,
    required: false,
    default: false,
  },
  showCollected: {
    type: Boolean,
    required: false,
    default: false,
  },
  showWatching: {
    type: Boolean,
    required: false,
    default: false,
  },
  showTagLoader: {
    type: Boolean,
    required: false,
  },
});

const { item, hideDate, showProgress, showPlayed, showCollected, showWatching } =
  toRefs(props);

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
      const _tag = { ...tag };

      if (tag.i18n && typeof tag.i18n === 'boolean') _tag.label = i18n(tag.label);
      else if (tag.i18n) _tag.label = i18n(tag.label, ...tag.i18n);

      if (!tag.icon && tag.iconType) {
        const { icon, iconProps } = getCustomLinkIcon(tag.iconType);
        _tag.icon = icon;
        _tag.iconProps = iconProps;
      }
      return _tag;
    }),
);

const {
  progress,
  played,
  date: playedDate,
} = useItemPlayed(item, { showPlayed, showProgress });
const { collected, date: collectedDate } = useItemCollected(item, showCollected);

const { fetchShowProgress } = useShowStore();

if (showProgress.value) {
  watch(
    item,
    () => {
      if (!showProgress.value) return;
      if (!item?.value?.getProgressQuery) return;
      const { id, cacheOptions } = item.value?.getProgressQuery() ?? {};
      if (!id) return;
      return fetchShowProgress(id.toString(), cacheOptions);
    },
    {
      immediate: true,
    },
  );
}

const { isWatchingListItem } = useWatchingStore();
const watching = computed(() => {
  if (!showWatching.value) return false;
  if (!item.value) return false;
  return isWatchingListItem(item.value);
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

const onTagClick = (url?: string) => {
  if (!url) return;
  openLink(url);
};
</script>

<template>
  <NFlex
    class="panel"
    :class="{ played: showPlayed && played, collected: showCollected && collected }"
    vertical
    justify="center"
    size="small"
    :theme-overrides="{ gapSmall: '0' }"
  >
    <div ref="innerContainer">
      <div class="meta type">
        <NSkeleton
          v-if="loading"
          style="width: 45px; height: 14px; margin-bottom: 0.25rem"
          round
        />
        <AnchorLink v-else text v-bind="item?.typeLink">
          <NEllipsis :line-clamp="1" :tooltip="tooltipOptions">{{ type }}</NEllipsis>
        </AnchorLink>
      </div>
      <div class="title">
        <NSkeleton v-if="loading" text style="width: 70%; height: 16px" round />
        <AnchorLink v-else text v-bind="item?.titleLink">
          <NEllipsis :line-clamp="2" :tooltip="tooltipOptions">
            {{ title }}
          </NEllipsis>
        </AnchorLink>
      </div>
      <div class="content">
        <NSkeleton
          v-if="loading"
          text
          style="width: 60%; height: 14px; margin: 0.25rem 0"
          round
        />
        <AnchorLink v-else text v-bind="item?.contentLink">
          <NEllipsis :line-clamp="contentHeight" :tooltip="tooltipOptions">
            {{ content }}
          </NEllipsis>
        </AnchorLink>
      </div>
      <NFlex
        v-if="
          (!hideTime && date) ||
          (loading && showTagLoader) ||
          tags?.length ||
          showCollected ||
          showPlayed
        "
        size="medium"
        class="tags"
        :class="{ 'show-progress': showProgress }"
      >
        <template v-if="loading && showTagLoader">
          <NSkeleton text style="width: 120px; height: 18px; border-radius: 2px" />
        </template>
        <template v-else>
          <template v-for="(tag, i) of tags" :key="`${i}-${tag.label}`">
            <NSkeleton
              v-if="loading"
              text
              style="width: 120px; height: 18px; border-radius: 2px"
            />
            <TagLink :tag="tag" short @on-click="onTagClick" />
          </template>
        </template>

        <template v-if="!hideTime && date">
          <NSkeleton
            v-if="loading"
            key="date-loader"
            text
            style="width: 42px; height: 18px; border-radius: 2px"
          />
          <NTag
            v-else
            key="date"
            class="tag"
            size="small"
            type="default"
            :bordered="false"
          >
            {{ date }}
          </NTag>
        </template>
        <template v-if="showCollected && collected">
          <NSkeleton
            v-if="loading"
            key="collected-loader"
            text
            style="width: 22px; height: 18px; border-radius: 2px"
          />
          <NTag
            v-else
            key="collected"
            class="tag badge"
            size="small"
            type="info"
            :bordered="false"
            :title="
              i18n('collected', 'common', 'tooltip') +
              (collectedDate ? `: ${ collectedDate }` : '')
            "
          >
            <template #icon>
              <NIcon :component="IconGrid" />
            </template>
          </NTag>
        </template>
        <template v-if="showPlayed && played">
          <NSkeleton
            v-if="loading"
            key="played-loader"
            text
            style="width: 22px; height: 18px; border-radius: 2px"
          />
          <NTag
            v-else
            key="played"
            class="tag badge"
            size="small"
            type="primary"
            :bordered="false"
            :title="
              i18n('watched', 'common', 'tooltip') + (playedDate ? `: ${ playedDate }` : '')
            "
          >
            <template #icon>
              <NIcon :component="IconPlayFilled" />
            </template>
          </NTag>
        </template>
        <template v-if="showWatching && watching">
          <NSkeleton
            v-if="loading"
            key="watching-loader"
            text
            style="width: 22px; height: 18px; border-radius: 2px"
          />
          <NTag
            v-else
            key="watching"
            class="tag badge"
            size="small"
            type="error"
            :bordered="false"
          >
            <template #icon>
              <NIcon :component="IconLoading" />
            </template>
          </NTag>
        </template>
      </NFlex>
      <div v-if="showProgress" class="panel-progress">
        <NSkeleton
          v-if="loading"
          key="progress-loader"
          text
          style="display: flex; width: 100%; height: 4px"
          round
        />
        <ProgressTooltip
          v-else
          :progress="progress"
          :to="innerContainer"
          placement="top-end"
        >
          <NProgress
            class="line"
            :data-show-id="progress?.id"
            :data-percentage="percentage"
            :theme-overrides="{
              railHeight: 'var(--rail-height)',
            }"
            :percentage="percentage ?? 0"
            :show-indicator="false"
            color="var(--trakt-color-dark)"
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

  &.played {
    --trakt-color: var(--color-primary-darker);
  }

  &.collected:not(.played) {
    --trakt-color: var(--color-info-darker);
  }

  .title {
    margin-top: 0.1rem;
    color: var(--trakt-color);
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
    max-height: 3.325rem;
    margin-top: 0.3rem;

    &.show-progress {
      max-height: 1.5rem;
    }
  }

  .panel-progress {
    --rail-height: 4px;

    padding-top: 0.75rem;

    &:hover {
      --trakt-color-dark: var(--trakt-color);
    }
  }
}
</style>

<style lang="scss">
.panel-progress-tooltip.n-tooltip.n-tooltip {
  background: var(--bg-color-80);
}

// stylelint-disable-next-line selector-class-pattern -- framework override
.n-tag.n-tag--icon.tag.badge .n-tag__icon {
  margin: 0;
}
</style>
