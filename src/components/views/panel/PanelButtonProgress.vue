<script lang="ts" setup>
import { type ButtonProps, NButton, NIcon } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import IconConfirmCircle from '~/components/icons/IconConfirmCircle.vue';

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
</style>
