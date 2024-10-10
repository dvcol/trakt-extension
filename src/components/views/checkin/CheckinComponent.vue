<script lang="ts" setup>
import { formatTime } from '@dvcol/common-utils/common/format';
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { computed } from 'vue';

import IconCancel from '~/components/icons/IconCancel.vue';
import IconMovie from '~/components/icons/IconMovie.vue';
import IconScreen from '~/components/icons/IconScreen.vue';
import { usePanelItem } from '~/components/views/panel/use-panel-item';
import { useMovieStore } from '~/stores/data/movie.store';
import { useShowStore } from '~/stores/data/show.store';
import { useWatchingStore, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useI18n } from '~/utils/i18n.utils';
import {
  isWatchingMovie,
  isWatchingShow,
  useCancelWatching,
  useWatchingProgress,
} from '~/utils/watching.utils';
import { watchMedia } from '~/utils/window.utils';

const props = defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
  reverse: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const i18n = useI18n('watching');

const { isWatching, watching, cancelling } = useWatchingStoreRefs();
const { cancel } = useWatchingStore();

const isTiny = watchMedia('(max-width: 600px)');

const offset = computed(() => {
  if (!props.parentElement) return;
  return (
    Number.parseInt(
      getComputedStyle(props.parentElement).getPropertyValue('--safe-area-inset-bottom'),
      10,
    ) ||
    Number.parseInt(
      getComputedStyle(props.parentElement).getPropertyValue('--safe-area-inset-left'),
      10,
    ) ||
    Number.parseInt(
      getComputedStyle(props.parentElement).getPropertyValue('--safe-area-inset-right'),
      10,
    )
  );
});

const icon = computed(() => (watching.value?.type === 'movie' ? IconMovie : IconScreen));
const title = computed(() => {
  if (!watching.value) return '';
  if (isWatchingMovie(watching.value)) return watching.value.movie.title;
  if (isWatchingShow(watching.value)) {
    if (isTiny.value) return watching.value.show.title;
    return watching.value.episode.title;
  }
  return '';
});

const subtitle = computed(() => {
  if (!watching.value) return '';
  if (isWatchingMovie(watching.value)) return watching.value.movie.year;
  if (isWatchingShow(watching.value)) return watching.value.show.title;
  return '';
});

const episode = computed(() => {
  if (!watching.value) return '';
  if (!isWatchingShow(watching.value)) return '';
  const { season, number } = watching.value.episode;
  if (!season || !number) return '';
  return `${i18n('season', 'common', 'tag')} ${season} ${i18n(
    'episode',
    'common',
    'tag',
  )} ${number}`;
});

const {
  elapsed: elapsedSeconds,
  duration: durationSeconds,
  progress,
} = useWatchingProgress(watching);

const elapsed = computed(() => {
  if (!elapsedSeconds.value) return '';
  return formatTime(elapsedSeconds.value);
});

const duration = computed(() => {
  if (!durationSeconds.value) return '';
  return formatTime(durationSeconds.value);
});

const type = computed(() => {
  if (!watching.value) return '';
  return i18n(watching.value.type);
});

const action = computed(() => {
  if (!watching.value) return '';
  return i18n(watching.value.action);
});

const started = computed(() => {
  if (!watching.value) return '';
  if (!watching.value.started_at) return '';
  return new Date(watching.value.started_at).toLocaleString();
});

const { onCancel: onCancelWatching } = useCancelWatching(cancel, watching.value?.action);
const { clearShowWatchedProgress } = useShowStore();
const { clearMovieWatchedProgress } = useMovieStore();

const onCancel = async (event: MouseEvent) => {
  event.stopPropagation();
  const cancelled = await onCancelWatching();
  if (!cancelled) return;
  clearShowWatchedProgress();
  clearMovieWatchedProgress();
};

const { onItemClick } = usePanelItem();
const onClick = () => {
  if (!watching.value) return;
  if (isWatchingMovie(watching.value))
    onItemClick({
      type: 'movie',
      id: watching.value.movie.ids.trakt,
    });
  if (isWatchingShow(watching.value))
    onItemClick({
      type: 'episode',
      id: watching.value.episode.ids.trakt,
      showId: watching.value.show.ids.trakt,
      seasonNumber: watching.value.episode.season,
      episodeNumber: watching.value.episode.number,
    });
};
</script>

<template>
  <div class="wrapper">
    <div
      class="container"
      :class="{ watching: isWatching, offset, reverse }"
      @click="onClick"
    >
      <span class="left">
        <NIcon class="icon" :component="icon" />
        <div class="column">
          <div class="top">
            <span class="text primary ellipsis">{{ title }}</span>
            <span class="text tertiary compact">—</span>
            <span class="text secondary compact ellipsis">{{ subtitle }}</span>
            <template v-if="episode">
              <span class="text tertiary">—</span>
              <span class="text secondary ellipsis">{{ episode }}</span>
            </template>
          </div>
          <div v-if="!isTiny" class="bottom">
            <span class="tertiary ellipsis">
              {{ type }} {{ action }} {{ i18n('at') }} {{ started }}
            </span>
          </div>
        </div>
      </span>
      <span class="right">
        <span class="text secondary time">{{ elapsed }}</span>
        <span class="text tertiary compact">/</span>
        <span class="text secondary time compact">{{ duration }}</span>
        <NTooltip :show-arrow="false" :delay="260" :to="parentElement">
          <span> {{ i18n('cancel', 'common', 'button') }} </span>
          <template #trigger>
            <NButton
              class="button"
              quaternary
              type="tertiary"
              :disabled="cancelling"
              @click="onCancel"
            >
              <template #icon>
                <NIcon class="icon" :component="IconCancel" />
              </template>
            </NButton>
          </template>
        </NTooltip>
      </span>
    </div>
    <div class="background" :style="{ '--progress': `${progress}%` }" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/z-index' as layers;
@use '~/styles/layout' as layout;

.wrapper {
  position: relative;
  backdrop-filter: blur(var(--bg-blur-4));
  transition: backdrop-filter 0.5s var(--n-bezier);

  &:active,
  &:hover {
    backdrop-filter: blur(var(--bg-blur-10));
  }

  .background {
    @include mixin.hover-background($from: var(--bg-trakt-50), $to: var(--bg-trakt-60));

    position: absolute;
    top: 0;
    left: 0;
    width: var(--progress);
    height: 100%;
    transition: width 0.5s linear;
  }

  .container {
    @include mixin.hover-background(
      $from: var(--bg-trakt-dark-50),
      $to: var(--bg-trakt-dark-60)
    );

    position: relative;
    z-index: layers.$layer-ui;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: space-between;
    height: 0;
    overflow: hidden;
    color: var(--white-70);
    text-wrap: balance;
    cursor: pointer;

    .left,
    .right {
      height: 100%;
    }

    .left,
    .column {
      overflow: hidden;
    }

    .left,
    .right,
    .top,
    .bottom {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      white-space: nowrap;
      transition: gap 0.5s var(--n-bezier);
    }

    .top,
    .bottom {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .left {
      flex: 1 1 auto;
    }

    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .column {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: 0.125rem;
      padding-right: 0.5rem;
    }

    .bottom {
      height: 0;
      overflow: hidden;
      font-size: var(--font-size-xs);
      opacity: 0;
      transition:
        height 0.5s var(--n-bezier),
        opacity 0.5s var(--n-bezier);
    }

    .icon {
      padding: 0 0.25rem 0 0.5rem;
      transition:
        scale 0.5s var(--n-bezier),
        padding 0.5s var(--n-bezier);
      scale: 1;
    }

    .button {
      height: 100%;
      margin-left: -0.25rem;
      padding: 0 0.5rem;
      transition: padding 0.5s var(--n-bezier);

      .icon {
        padding: 0;
        color: var(--white-80);
        scale: 0.8;
      }
    }

    .primary {
      font-weight: bold;
    }

    .text {
      font-size: var(--font-size-xs);
    }

    .secondary {
      color: var(--white-80);
    }

    .tertiary {
      overflow: hidden;
      color: var(--white-70);
    }

    .text,
    .secondary,
    .tertiary {
      transition:
        font-size 0.5s var(--n-bezier),
        color 0.25s;
    }

    .time {
      font-variant-numeric: tabular-nums;
    }

    &.watching {
      height: layout.$safe-watching-height;

      &.offset {
        padding: 0
          max(
            calc(#{layout.$safe-area-inset-left} / 2),
            calc(#{layout.$safe-area-inset-right} / 2),
            calc(#{layout.$safe-area-inset-bottom} / 1.5)
          );
      }

      &:active,
      &:focus-within,
      &:hover {
        height: layout.$safe-watching-open-height;
        color: var(--white);

        .icon {
          color: var(--white);
        }

        .bottom {
          height: 1.125rem;
          opacity: 1;
        }

        .left,
        .right,
        .top,
        .bottom {
          gap: 0.5rem;
        }

        .left .icon {
          padding: 0 0.5rem 0 0.75rem;
          scale: 1.5;
        }

        .right .icon {
          scale: 1.2;
        }

        .button {
          padding: 0 0.875rem;
        }

        .text {
          font-size: var(--font-size-sm);
        }

        .text,
        .secondary {
          color: var(--white);
        }

        .tertiary {
          color: var(--white-80);
        }
      }
    }

    &.reverse {
      height: layout.$top-safe-watching-height;
      padding-top: calc(#{layout.$safe-area-inset-top} / 1.5);

      &:active,
      &:focus-within,
      &:hover {
        height: layout.$watching-open-height;
      }
    }
  }

  @media (width <= 600px) {
    .compact {
      display: none;
    }
  }
}
</style>
