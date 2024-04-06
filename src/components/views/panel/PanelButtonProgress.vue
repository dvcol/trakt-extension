<script setup lang="ts">
import {
  type ButtonProps,
  NButton,
  NIcon,
  NPopselect,
  type PopselectProps,
  type SelectOption,
  type TooltipProps,
} from 'naive-ui';

import { type Component, h, type PropType, ref } from 'vue';

import type {
  EpisodeProgress,
  SeasonProgress,
  ShowProgress,
  ShowProgressTypes,
} from '~/models/list-scroll.model';

import ProgressTooltip from '~/components/common/tooltip/ProgressTooltip.vue';
import { useI18n } from '~/utils';

defineProps({
  select: {
    type: Object as PropType<PopselectProps>,
    required: true,
  },
  progress: {
    type: Object as PropType<ShowProgress | SeasonProgress | EpisodeProgress>,
    required: false,
  },
  percentage: {
    type: Number,
    required: false,
  },
  filled: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },

  icon: {
    type: Object as PropType<Component>,
    required: false,
  },
  tooltip: {
    type: Object as PropType<TooltipProps & { type?: ShowProgressTypes }>,
    required: false,
  },
  type: {
    type: String as PropType<ButtonProps['type']>,
    required: false,
    default: 'primary',
  },
});

const renderLabel = (option: SelectOption & { icon: Component }) => [
  h(NIcon, {
    style: {
      verticalAlign: '-0.2em',
      marginRight: '0.7em',
    },
    component: option.icon,
  }),
  option.label?.toString(),
];

const i18n = useI18n('panel', 'buttons');

const root = ref();
</script>

<template>
  <div
    ref="root"
    class="button-progress-container"
    :data-progress="percentage"
    :style="{
      '--progress': `${ percentage }%`,
      '--progress-color': `var(--${type}-color-dark)`,
    }"
  >
    <ProgressTooltip
      :progress="progress"
      :to="root"
      :style="{
        '--custom-bg-color': `var(--bg-color-${type}-80)`,
        '--custom-bg-color-hover': `var(--bg-color-${type})`,
      }"
      v-bind="tooltip"
    >
      <NPopselect
        :style="{
          '--custom-bg-color': `var(--bg-color-${ type }-80)`,
          '--custom-bg-color-hover': `var(--bg-color-${type})`,
        }"
        :to="root"
        :render-label="renderLabel"
        trigger="focus"
        :disabled="disabled"
        v-bind="select"
      >
        <NButton
          :class="{ filled, progress }"
          round
          :secondary="!filled"
          :disabled="disabled"
          :type="type"
        >
          <template #icon>
            <NIcon class="button-icon" :component="icon" />
          </template>
          <span><slot /></span>
        </NButton>
      </NPopselect>
    </ProgressTooltip>
  </div>
</template>

<style scoped lang="scss">
.button-progress-container {
  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }

  .progress:not(.filled) {
    background: linear-gradient(
      to right,
      var(--progress-color) 0%,
      var(--progress-color) var(--progress, 0%),
      var(--n-color) var(--progress, 0%),
      var(--n-color) 100%
    );
    transition:
      color 0.3s var(--n-bezier),
      background-color 0.3s var(--n-bezier),
      opacity 0.3s var(--n-bezier),
      border-color 0.3s var(--n-bezier),
      filter 0.3s var(--n-bezier);

    &:hover {
      filter: brightness(1.2);
    }
  }
}
</style>
