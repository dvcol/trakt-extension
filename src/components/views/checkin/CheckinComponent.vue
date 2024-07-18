<script lang="ts" setup>
import { formatTime } from '@dvcol/common-utils/common/format';
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { computed, defineProps } from 'vue';

import IconCancel from '~/components/icons/IconCancel.vue';
import IconMovie from '~/components/icons/IconMovie.vue';
import IconScreen from '~/components/icons/IconScreen.vue';
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

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

const i18n = useI18n('watching');

const { isWatching, watching, cancelling } = useWatchingStoreRefs();
const { cancel } = useWatchingStore();

const icon = computed(() => (watching.value?.type === 'movie' ? IconMovie : IconScreen));
const title = computed(() => {
  if (!watching.value) return '';
  if (isWatchingMovie(watching.value)) return watching.value.movie.title;
  if (isWatchingShow(watching.value)) return watching.value.episode.title;
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
  return `${i18n('season', 'common', 'tag')} ${watching.value.episode.season} ${i18n(
    'episode',
    'common',
    'tag',
  )} ${watching.value.episode.number}`;
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

const onCancel = async () => {
  const cancelled = await onCancelWatching();
  if (!cancelled) return;
  clearShowWatchedProgress();
  clearMovieWatchedProgress();
};
</script>

<template>
  <div class="wrapper">
    <div class="container" :class="{ watching: isWatching }">
      <span class="left">
        <NIcon class="icon" :component="icon" />
        <div class="column">
          <div class="top">
            <span class="text primary">{{ title }}</span>
            <span class="text tertiary">—</span>
            <span class="text secondary">{{ subtitle }}</span>
            <template v-if="episode">
              <span class="text tertiary">—</span>
              <span class="text secondary">{{ episode }}</span>
            </template>
          </div>
          <div class="bottom">
            <span class="tertiary">
              {{ type }} {{ action }} {{ i18n('at') }} {{ started }}
            </span>
          </div>
        </div>
      </span>
      <span class="right">
        <span class="text secondary time">{{ elapsed }}</span>
        <span class="text tertiary">/</span>
        <span class="text secondary time">{{ duration }}</span>
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

.wrapper {
  position: relative;

  .background {
    @include mixin.hover-background(
      $from: var(--bg-trakt-50),
      $to: var(--bg-trakt-60),
      $blur-hover: var(--bg-blur-10)
    );

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
      $to: var(--bg-trakt-dark-60),
      $blur-hover: var(--bg-blur-10)
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
    cursor: pointer;

    .left,
    .right {
      height: 100%;
    }

    .left,
    .right,
    .top,
    .bottom {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      transition: gap 0.5s var(--n-bezier);
    }

    .left {
      flex: 1 1 auto;
    }

    .column {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: 0.125rem;
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
      height: 1.75rem;

      &:hover {
        height: 3rem;
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
  }
}
</style>
