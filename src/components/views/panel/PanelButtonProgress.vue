<script setup lang="ts">
import {
  type ButtonProps,
  NButton,
  NDatePicker,
  NIcon,
  NModal,
  NPopselect,
  type PopselectProps,
  type SelectOption,
  type TooltipProps,
} from 'naive-ui';

import { type Component, computed, h, type PropType, ref, toRefs } from 'vue';

import type {
  EpisodeProgress,
  SeasonProgress,
  ShowProgress,
  ShowProgressTypes,
} from '~/models/list-scroll.model';

import ProgressTooltip from '~/components/common/tooltip/ProgressTooltip.vue';

const props = defineProps({
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

const emit = defineEmits<{
  (o: 'onSelect', value: string | number | (string | number)[], date?: number): void;
}>();

const { percentage } = toRefs(props);

const root = ref();
const trigger = ref();

const progressBackground = computed(() => {
  if (percentage?.value === undefined) return false;
  return percentage.value > 0 && percentage.value < 100;
});

const showPicker = ref(false);

const onSelect = (value: string | number | (string | number)[]) => {
  if (value === 'custom') {
    showPicker.value = true;
    return;
  }
  emit('onSelect', value);
};

const onClear = () => {
  showPicker.value = false;
};

const onConfirm = (value: number) => {
  showPicker.value = false;
  emit('onSelect', 'custom', value);
};

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
</script>

<template>
  <div
    ref="root"
    class="button-progress-container"
    :data-progress="percentage"
    :style="{
      '--progress': `${ percentage }%`,
      '--progress-color': `var(--${ type }-color-dark)`,
    }"
  >
    <ProgressTooltip
      :progress="progress"
      :to="root"
      :style="{
        '--custom-bg-color': `var(--bg-color-${ type }-80)`,
        '--custom-bg-color-hover': `var(--bg-color-${ type })`,
      }"
      v-bind="tooltip"
    >
      <template v-if="$slots.tooltip" #label>
        <slot name="tooltip" />
      </template>
      <NPopselect
        :style="{
          '--custom-bg-color': `var(--bg-color-${ type }-80)`,
          '--custom-bg-color-hover': `var(--bg-color-${ type })`,
        }"
        :to="root"
        :render-label="renderLabel"
        trigger="focus"
        :disabled="disabled"
        v-bind="select"
        :on-update:show="_show => !_show && trigger?.$el?.blur()"
        :on-update-value="onSelect"
      >
        <NButton
          ref="trigger"
          class="button"
          :class="{ filled, progress: progressBackground }"
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

    <NModal
      v-model:show="showPicker"
      :to="root"
      :style="{
        '--custom-bg-color': `var(--bg-color-${ type }-80)`,
        '--custom-bg-color-hover': `var(--bg-color-${ type })`,
      }"
      class="picker-modal"
    >
      <NDatePicker
        panel
        type="datetime"
        clearable
        :on-clear="onClear"
        :on-confirm="onConfirm"
      />
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.button-progress-container {
  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }

  .button {
    background: linear-gradient(to right, var(--n-color) 0%, var(--n-color) 100%);
    transition:
      color 0.3s var(--n-bezier),
      background 0.3s var(--n-bezier),
      background-color 0.3s var(--n-bezier),
      opacity 0.3s var(--n-bezier),
      border-color 0.3s var(--n-bezier),
      filter 0.3s var(--n-bezier);
    will-change: color, background, background-color, opacity, border-color, filter;

    &:hover {
      filter: brightness(1.2);
    }
  }

  .progress:not(.filled) {
    background: linear-gradient(
      to right,
      var(--progress-color) 0%,
      var(--progress-color) var(--progress, 0%),
      var(--n-color) var(--progress, 0%),
      var(--n-color) 100%
    );
  }
}

.picker-modal {
  margin: auto;
}
</style>
