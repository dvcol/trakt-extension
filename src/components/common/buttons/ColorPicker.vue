<script setup lang="ts">
import { NButton, NButtonGroup, NIcon } from 'naive-ui';

import { useTemplateRef } from 'vue';

import IconClose from '~/components/icons/IconCloseSmall.vue';
import IconPencil from '~/components/icons/IconPencil.vue';
import { useI18n } from '~/utils/i18n.utils';

const { fallback } = defineProps({
  label: {
    type: String,
    required: false,
    default: 'picker',
  },
  border: {
    type: String,
    required: false,
  },
  fallback: {
    type: String,
    required: false,
  },
});

const color = defineModel<string>();

const i18n = useI18n('common', 'button');

const picker = useTemplateRef<HTMLInputElement>('picker');
const onColor = () => {
  picker.value?.focus();
  picker.value?.click();
};
</script>

<template>
  <div class="form-button">
    <input ref="picker" v-model="color" type="color" class="color-picker" />
    <NButtonGroup
      class="color-picker-button-group"
      :style="{ '--color-picker': color ?? border }"
    >
      <NButton round tertiary @click="onColor()">
        {{ i18n(label) }}
        <template #icon>
          <NIcon><IconPencil /></NIcon>
        </template>
      </NButton>
      <NButton circle tertiary type="error" @click="color = fallback">
        <template #icon>
          <NIcon><IconClose /></NIcon>
        </template>
      </NButton>
    </NButtonGroup>
  </div>
</template>

<style scoped lang="scss">
.form-switch {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  min-width: 5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
}

.color-picker {
  width: 0;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0;

  &-button-group {
    button {
      border: 2px solid var(--color-picker, transparent);
      transition: border-color 0.3s var(--n-bezier);

      i {
        margin-left: -2px;
      }
    }

    :first-child {
      border-right: none;
    }

    :last-child {
      border-left: none;
    }
  }
}
</style>
