<script lang="ts" setup>
import { type FormItemGiProps, NFlex, NFormItem } from 'naive-ui';

import type { PropType } from 'vue';

defineProps({
  label: {
    type: String,
    required: false,
  },
  warning: {
    type: String,
    required: false,
  },
  form: {
    type: Object as PropType<FormItemGiProps>,
    required: false,
  },
});
</script>

<template>
  <NFlex class="flex-auto" wrap justify="space-between" align="center">
    <NFormItem
      class="form-row"
      label-placement="left"
      :show-feedback="false"
      v-bind="form"
    >
      <template #label>
        <span class="from-label">{{ label }}</span>
      </template>
      <slot />
    </NFormItem>
    <div class="form-warning" :class="{ show: !!warning }">
      <span v-if="warning">{{ warning }}</span>
    </div>
  </NFlex>
</template>

<style lang="scss" scoped>
.flex-auto {
  flex: 1 1 auto;
}

.from-label {
  color: var(--white-70);
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s var(--n-bezier);
}

.form-warning {
  display: flex;
  flex: 1 0 100%;
  height: 0;
  color: var(--color-warning);
  transition: height 0.3s var(--n-bezier);

  &.show {
    height: 1.5rem;
  }
}

.form-row {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  :deep(label) {
    max-width: 100%;
    text-align: start;
  }

  &:active,
  &:focus-within,
  &:hover {
    .from-label {
      color: var(--white-mute);
    }
  }
}
</style>
