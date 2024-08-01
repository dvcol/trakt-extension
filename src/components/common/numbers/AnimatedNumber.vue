<script lang="ts" setup>
import { NNumberAnimation, NStatistic } from 'naive-ui';

defineProps({
  from: {
    type: Number,
    required: false,
    default: 0,
  },
  to: {
    type: Number,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
    default: 1000,
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
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <NStatistic class="statistics" :class="{ disabled }" tabular-nums>
    <NNumberAnimation :from="from" :to="to" :duration="duration" :precision="precision" />
    <span v-if="unit" class="unit">{{ unit }}</span>
  </NStatistic>
</template>

<style lang="scss" scoped>
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
