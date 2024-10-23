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
  showWarning: {
    type: Boolean,
    required: false,
    default: false,
  },
  form: {
    type: Object as PropType<FormItemGiProps>,
    required: false,
  },
  vertical: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <NFlex class="flex-auto" justify="space-between" align="center" wrap>
    <NFormItem
      class="form-row"
      :class="{ vertical }"
      label-placement="left"
      :show-feedback="false"
      v-bind="form"
    >
      <template v-if="label" #label>
        <span class="from-label">{{ label }}</span>
      </template>
      <slot />
    </NFormItem>
    <div v-if="warning" class="form-warning" :class="{ show: showWarning }">
      <span>{{ warning }}</span>
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
  overflow: hidden;
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

  &.vertical {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 8px;
  }
}
</style>
