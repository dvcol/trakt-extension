<script lang="ts" setup>
import { NProgress, NSkeleton, NSpin } from 'naive-ui';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import AnimatedNumber from './AnimatedNumber.vue';

import { Rating } from '~/models/rating.model';
import { debounce } from '~/utils/debounce.utils';
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
  editable: {
    type: Boolean,
    required: false,
    default: false,
  },
  container: {
    type: Object as PropType<HTMLElement>,
    required: false,
  },
  transform: {
    type: Function as PropType<(progress: number) => number>,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'onEditing', editing: boolean): void;
  (e: 'onEdit', progress: number): void;
  (e: 'onEditProgress', progress: number): void;
}>();

const { progress, delay, container, duration, editable, transform } = toRefs(props);

const _progress = ref(0);

const progressRef = ref<InstanceType<typeof NProgress>>();
const containerRef = computed(() => container?.value ?? progressRef.value?.$el);

const editing = ref(false);
const angleProgress = ref(0);

const debounceEmitProgress = debounce(
  () => emit('onEditProgress', angleProgress.value),
  500,
);

const editProgress = computed(() => {
  if (!editing.value) return _progress.value;
  debounceEmitProgress();
  return angleProgress.value;
});

const progressDuration = computed(() =>
  editing.value ? 100 : duration.value - delay.value,
);

const color = computed(() => {
  if (editProgress.value <= Rating.Bad * 10) return 'color-error';
  if (editProgress.value <= Rating.Mediocre * 10) return 'color-warning';
  if (editProgress.value <= Rating.Good * 10) return 'color-info';
  return 'color-primary';
});

const emitProgress = computed(() => {
  if (!transform?.value || typeof transform.value !== 'function') {
    return angleProgress.value;
  }
  return transform.value(angleProgress.value);
});

const onClick = () => {
  if (!editable.value) return;
  editing.value = !editing.value;
  emit('onEditing', editing.value);
  if (!editing.value) emit('onEdit', emitProgress.value);
  if (editing.value) progressRef.value?.$el?.focus();
};

const listener = (event: MouseEvent) => {
  if (!progressRef.value?.$el) return;
  // Get the bounding rectangle of the tracking box
  const rect = progressRef.value?.$el.getBoundingClientRect();

  // Calculate the mouse position relative to the tracking box
  const mouseX = event.clientX - (rect.left + rect.width / 2);
  const mouseY = rect.top + rect.height / 2 - event.clientY;

  // Convert (x, y) to angle in radians then in degrees
  let degrees = Math.atan2(mouseX, mouseY) * (180 / Math.PI) - 180;

  // Adjust angle to 0-360° range
  if (degrees < 0) degrees += 360;
  angleProgress.value = Math.round(degrees / 3.6);
};

onMounted(async () => {
  watch(
    progress,
    async val => {
      await wait(delay.value);
      _progress.value = val;
    },
    { immediate: true },
  );
  watch(
    containerRef,
    (_new, _old) => {
      _old?.removeEventListener('mousemove', listener);
      if (editable.value) _new?.addEventListener('mousemove', listener);
    },

    { immediate: true },
  );
});

onBeforeUnmount(() => {
  _progress.value = 0;
  containerRef.value?.removeEventListener('mousemove', listener);
});
</script>

<template>
  <NSpin v-show="loading" class="spin" size="large">
    <NProgress class="progress" type="circle">
      <NSkeleton class="skeleton" text round />
    </NProgress>
  </NSpin>
  <NProgress
    v-show="!loading"
    ref="progressRef"
    class="progress custom-color"
    :class="{ editing, editable }"
    type="circle"
    :percentage="editProgress"
    :style="{
      '--duration': `${ progressDuration }ms`,
      '--custom-progress-color': `var(--${ color })`,
    }"
    :tabindex="editable ? 0 : undefined"
    @click="onClick"
    @keydown.enter="onClick"
    @blur="editing = false"
  >
    <span v-if="editing">{{ emitProgress }}</span>
    <AnimatedNumber
      v-else
      :from="from"
      :to="editProgress"
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

  &.editable {
    cursor: grab;
  }

  &.editing {
    cursor: grabbing;
  }
}

.custom-color {
  --n-fill-color: var(--custom-progress-color, var(--color-info)) !important;

  &:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
  }
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
