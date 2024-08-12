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

import { computed, defineProps, type PropType, ref, toRefs } from 'vue';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import TagLink from '~/components/common/buttons/TagLink.vue';
import ProgressTooltip from '~/components/common/tooltip/ProgressTooltip.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconPlayFilled from '~/components/icons/IconPlayFilled.vue';
import { type ListScrollItem, type ShowProgress } from '~/models/list-scroll.model';

import { ProgressType } from '~/models/progress-type.model';
import { useHistoryStore } from '~/stores/data/history.store';
import { useMovieStore } from '~/stores/data/movie.store';
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
});

const { item, hideDate, showProgress, showPlayed, showCollected } = toRefs(props);

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

const { getShowWatchedProgress, getShowCollectionProgress } = useShowStore();

const progress = computed<ShowProgress | undefined>(() => {
  if (!showProgress.value && !showPlayed.value && !showCollected.value) return;
  if (item?.value?.progress) return item.value?.progress;
  if (item?.value?.progressRef) return item.value?.progressRef.value;
  if (!item?.value?.getProgressQuery) return;
  const { id, cacheOptions, noFetch } = item.value?.getProgressQuery() ?? {};
  if (!id) return;
  return getShowWatchedProgress(id, cacheOptions, noFetch).value;
});

const collection = computed<ShowProgress | undefined>(() => {
  if (!showCollected.value) return;
  if (!item?.value?.getProgressQuery) return;
  const { id, noFetch } = item.value?.getProgressQuery() ?? {};
  if (!id) return;
  return getShowCollectionProgress(id, noFetch).value;
});

const { getMovieWatched, getMovieCollected } = useMovieStore();
const { getMovieHistory, getEpisodeHistory } = useHistoryStore();

const movieHistory = computed(() => {
  if (!showPlayed.value) return;
  const _item = item?.value;
  if (_item?.type !== 'movie') return;
  if (!_item?.meta?.ids?.movie?.trakt) return;
  return getMovieHistory(_item.meta.ids.movie.trakt)?.value;
});

const episodeHistory = computed(() => {
  if (!showPlayed.value) return;
  const _item = item?.value;
  if (_item?.type !== 'episode') return;
  if (!_item?.meta?.ids?.episode?.trakt) return;
  return getEpisodeHistory(_item.meta.ids.episode.trakt)?.value;
});

const episodeProgress = computed(() => {
  if (!showPlayed.value) return;
  const _item = item?.value;
  if (_item?.type !== 'episode') return;
  const _progress = progress.value;
  if (!_progress) return;
  const _season = _item.meta?.number?.season;
  const _episode = _item.meta?.number?.episode;
  if (!_season || !_episode) return;
  return _progress.seasons
    ?.find(s => s.number === _season)
    ?.episodes?.find(e => e.number === _episode);
});

const movieWatched = computed(() => {
  if (!showPlayed.value) return;
  const _item = item?.value;
  if (_item?.type !== 'movie') return;
  if (!_item?.meta?.ids?.movie?.trakt) return;
  return getMovieWatched(_item.meta.ids.movie.trakt)?.value;
});

const moviePlayed = computed(() => {
  if (!showPlayed.value) return;
  if (movieWatched.value !== undefined) return movieWatched.value?.last_watched_at;
  return movieHistory.value?.watched_at;
});

const episodePlayed = computed(() => {
  if (!showPlayed.value) return;
  if (episodeProgress.value !== undefined) {
    return {
      date: episodeProgress.value?.date,
      completed: episodeProgress.value?.completed,
    };
  }
  return {
    date: episodeHistory.value?.watched_at,
    completed: !!episodeHistory.value,
  };
});

const played = computed(() => {
  if (!showPlayed.value) return false;
  if (item?.value?.type === 'movie') return !!moviePlayed.value;
  if (item?.value?.type !== 'episode') return false;
  return episodePlayed.value?.completed;
});

const playedDate = computed(() => {
  if (!played.value) return;
  if (item?.value?.type === 'movie') {
    if (!moviePlayed.value) return;
    return new Date(moviePlayed.value).toLocaleString();
  }
  if (!episodePlayed.value?.date) return;
  return new Date(episodePlayed.value?.date).toLocaleString();
});

const collected = computed(() => {
  if (!showCollected.value) return false;
  const _item = item?.value;
  if (_item?.type === 'movie' && _item?.meta?.ids?.movie?.trakt) {
    return getMovieCollected(_item.meta.ids.movie.trakt)?.value?.collected_at;
  }
  if (_item?.type !== 'episode') return false;
  const _collection = collection.value;

  if (!_collection) return false;
  const _season = _item.meta?.number?.season;
  const _episode = _item.meta?.number?.episode;
  if (!_season || !_episode) return false;
  return _collection.seasons
    ?.find(s => s.number === _season)
    ?.episodes?.find(e => e.number === _episode)?.date;
});

const collectedDate = computed(() => {
  if (!collected.value) return;
  if (typeof collected.value !== 'string') return;
  return new Date(collected.value).toLocaleString();
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
        <NEllipsis v-else :line-clamp="contentHeight" :tooltip="tooltipOptions">{{
          content
        }}</NEllipsis>
      </div>
      <NFlex
        v-if="(!hideTime && date) || tags?.length || showCollected || showPlayed"
        size="medium"
        class="tags"
      >
        <template v-for="(tag, i) of tags" :key="`${i}-${tag.label}`">
          <NSkeleton v-if="loading" text style="width: 6%" />
          <TagLink :tag="tag" @on-click="onTagClick" />
        </template>
        <template v-if="!hideTime && date">
          <NSkeleton v-if="loading" key="date-loader" text style="width: 8%" />
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
          <NSkeleton v-if="loading" key="collected-loader" text style="width: 3%" />
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
          <NSkeleton v-if="loading" key="played-loader" text style="width: 3%" />
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

// stylelint-disable-next-line selector-class-pattern -- framework overriding
.n-tag.n-tag--icon.tag.badge .n-tag__icon {
  margin: 0;
}
</style>
