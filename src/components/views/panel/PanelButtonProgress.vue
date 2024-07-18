<script lang="ts" setup>
import { type ButtonProps, NButton, NIcon, NTooltip } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import IconConfirmCircle from '~/components/icons/IconConfirmCircle.vue';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('common');

const props = defineProps({
  filled: {
    type: Boolean,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  percentage: {
    type: Number,
    required: false,
  },
  type: {
    type: String as PropType<ButtonProps['type']>,
    required: false,
    default: 'error',
  },
});

const { percentage } = toRefs(props);

const progress = computed(() => {
  if (percentage?.value === undefined) return false;
  return percentage.value > 0 && percentage.value < 100;
});

const percentageLabel = computed(() => {
  if (percentage?.value) return Math.round(percentage.value);
  return 0;
});
</script>

<template>
  <div
    ref="root"
    class="container"
    :data-progress="percentage"
    :style="{
      '--progress': `${percentage}%`,
      '--progress-color': `var(--color-${type}-dark)`,
    }"
  >
    <NTooltip class="progress-tooltip" :disabled="!progress" :delay="100">
      <slot name="tooltip">
        <div>
          <span class="metric">{{ percentageLabel }}</span>
          <span>%</span>
          <span>&nbsp;</span>
          <span>{{ i18n('watched', 'common', 'button') }}</span>
        </div>
      </slot>
      <template #trigger>
        <NButton
          class="button"
          :class="{ filled, progress }"
          round
          :secondary="!filled"
          :disabled="loading"
          :loading="loading"
          :type="type"
        >
          <template #icon>
            <NIcon :component="IconConfirmCircle" />
          </template>
          <span><slot /></span>
        </NButton>
      </template>
    </NTooltip>
  </div>
</template>

<style lang="scss" scoped>
.container {
  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }
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
    background-color: unset;
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

.metric {
  color: var(--white);
  font-weight: bolder;
  font-variant-numeric: tabular-nums;
}
</style>
