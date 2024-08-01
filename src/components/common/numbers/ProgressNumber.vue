<script lang="ts" setup>
import { NProgress, NSkeleton, NSpin } from 'naive-ui';

import { onDeactivated, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';

import AnimatedNumber from './AnimatedNumber.vue';

import { wait } from '~/utils/promise.utils';

const props = defineProps({
  from: {
    type: Number,
    required: false,
    default: 0,
  },
  progress: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
    default: 1000,
  },
  delay: {
    type: Number,
    required: false,
    default: 50,
  },
  precision: {
    type: Number,
    required: false,
    default: 0,
  },
  unit: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { progress, delay } = toRefs(props);

const _progress = ref(0);

onMounted(async () => {
  watch(
    progress,
    async val => {
      await wait(delay.value);
      _progress.value = val;
    },
    { immediate: true },
  );
});

onUnmounted(() => {
  _progress.value = 0;
});
</script>

<template>
  <NSpin v-if="loading" class="spin" size="large">
    <NProgress class="progress" type="circle">
      <NSkeleton class="skeleton" text round />
    </NProgress>
  </NSpin>
  <NProgress
    v-else
    class="progress custom-color"
    type="circle"
    :percentage="_progress"
    :style="{ '--duration': `${duration - delay}ms` }"
  >
    <AnimatedNumber
      :from="from"
      :to="_progress"
      :duration="duration"
      :precision="precision"
      :disabled="!_progress"
      :unit="unit"
    />
  </NProgress>
</template>

<style lang="scss" scoped>
.spin,
.progress {
  --progress-size: 3.7rem !important;
}

.custom-color {
  --custom-color: var(--info-color) --n-fill-color: var(--custom-color) !important;
}

.spin {
  --n-opacity-spinning: 1 !important;
  --n-size: var(--progress-size) !important;
  --n-color: var(--text-color-disabled) !important;

  .skeleton {
    width: 2ch;
  }
}

.progress {
  width: var(--progress-size);

  :deep(path.n-progress-graph-circle-fill) {
    transition:
      opacity var(--duration) var(--n-bezier),
      stroke var(--duration) var(--n-bezier),
      stroke-dasharray var(--duration) var(--n-bezier) !important;
  }

  :deep(.n-statistic .n-statistic-value) {
    margin: 0;
  }
}

.statistics {
  --n-value-font-size: 1rem !important;

  font-variant-numeric: tabular-nums;
  align-self: center;

  .unit {
    padding-left: 0.125rem;
    color: var(--white-50);
  }

  &.disabled {
    --n-value-text-color: var(--text-color-disabled) !important;
  }
}
</style>
