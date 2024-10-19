<script setup lang="ts">
import { wait } from '@dvcol/common-utils/common/promise';
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

import { type Component, computed, h, type PropType, reactive, ref, toRefs } from 'vue';

import type {
  EpisodeProgress,
  SeasonProgress,
  ShowProgress,
  ShowProgressTypes,
} from '~/models/list-scroll.model';

import ProgressTooltip from '~/components/common/tooltip/ProgressTooltip.vue';
import {
  PanelButtonsOption,
  type SelectProgressResponse,
  type SelectProgressValue,
} from '~/components/views/panel/use-panel-buttons';
import { clearProxy } from '~/utils/vue.utils';

const props = defineProps({
  select: {
    type: Object as PropType<PopselectProps>,
    required: true,
  },
  confirm: {
    type: Object as PropType<PopselectProps>,
    required: false,
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
  loading: {
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
  (o: 'onSelect', selected: SelectProgressResponse): void;
}>();

const { percentage, confirm, type } = toRefs(props);

const root = ref<HTMLDivElement>();
const trigger = ref();

const progressBackground = computed(() => {
  if (percentage?.value === undefined) return false;
  return percentage.value > 0 && percentage.value < 100;
});

const showPicker = ref(false);
const showConfirm = ref(false);

const selected = reactive<Partial<SelectProgressResponse>>({});
const clear = () => {
  showConfirm.value = false;
  showPicker.value = false;
  clearProxy(selected);
};

const onCancel = () => clear();

const onConfirm = (value?: SelectProgressValue) => {
  selected.confirm = value;
  if (!selected.option) return clear();
  if (selected.option === PanelButtonsOption.Custom) {
    showPicker.value = true;
    return;
  }
  emit('onSelect', selected as SelectProgressResponse);
  clear();
};

const displayConfirm = async () => {
  showConfirm.value = true;
  await wait(500);
  const popSelect = root.value?.querySelector<HTMLDivElement>('div[tabindex]');
  if (!popSelect || !showConfirm.value) return;
  popSelect.focus();
  if (popSelect.onblur) return;
  popSelect.onblur = clear;
};

const onSelect = (value: SelectProgressValue) => {
  selected.option = value;
  if (confirm?.value && value !== PanelButtonsOption.Remove) {
    return displayConfirm();
  }
  return onConfirm();
};

const onPickerConfirm = (value: number) => {
  selected.date = value;
  if (selected.option) emit('onSelect', selected as SelectProgressResponse);
  clear();
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

const selectStyle = computed(() => ({
  '--custom-bg-color': `var(--bg-color-${type.value}-80)`,
  '--custom-bg-color-hover': `var(--bg-color-${type.value})`,
}));
</script>

<template>
  <div
    ref="root"
    class="button-progress-container"
    :data-progress="percentage"
    :style="{
      '--progress': `${ percentage }%`,
      '--progress-color': `var(--color-${ type }-dark)`,
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
        :style="selectStyle"
        :to="root"
        :render-label="renderLabel"
        :show="showConfirm"
        v-bind="confirm"
        :on-update-value="onConfirm"
      >
        <NPopselect
          :style="selectStyle"
          :to="root"
          :render-label="renderLabel"
          trigger="focus"
          :disabled="disabled || loading || showConfirm"
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
            :loading="loading"
            :type="type"
          >
            <template #icon>
              <NIcon class="button-icon" :component="icon" />
            </template>
            <span><slot /></span>
          </NButton>
        </NPopselect>
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
      :on-mask-click="onCancel"
    >
      <NDatePicker
        panel
        type="datetime"
        clearable
        :on-clear="onCancel"
        :on-confirm="onPickerConfirm"
      />
    </NModal>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/mixin' as mixin;

.button-progress-container {
  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }

  .button {
    transition:
      color 0.3s var(--n-bezier),
      background 0.3s var(--n-bezier),
      background-color 0.3s var(--n-bezier),
      opacity 0.3s var(--n-bezier),
      border-color 0.3s var(--n-bezier),
      filter 0.3s var(--n-bezier),
      --progress 0.3s var(--n-bezier);

    &:active,
    &:focus-within,
    &:hover {
      filter: brightness(1.2);
    }
  }

  .filled:not(.progress) {
    background: linear-gradient(to right, var(--n-color) 0%, var(--n-color) 100%);
  }

  .progress:not(.filled) {
    @include mixin.progress-background($rail: var(--n-color));
  }
}

.picker-modal {
  margin: auto;
}
</style>
