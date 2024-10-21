<script setup lang="ts">
import { type ButtonProps, NButton } from 'naive-ui';

const { buttonProps } = defineProps<{
  buttonProps?: ButtonProps;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'onClick', event: MouseEvent): void;
}>();

const onClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emit('onClick', e);
};
</script>

<template>
  <NButton
    class="list-button"
    quaternary
    v-bind="buttonProps"
    @click="onClick"
    @keydown.enter="onClick"
  >
    <slot />
  </NButton>
</template>

<style scoped lang="scss">
.list-button {
  --color: var(--bg-black-80);
  --progress: 100%;

  display: flex;
  flex: 1 1 auto;
  box-sizing: border-box;
  min-width: min(20vw, 10rem);
  padding-left: 20%;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--color) var(--progress)
  ) !important;
  /* stylelint-disable custom-property-no-missing-var-function -- custom property */
  transition:
    --color 0.25s var(--n-bezier),
    --progress 0.25s var(--n-bezier);

  // stylelint-disable-next-line selector-class-pattern -- framework override
  &:not(.n-button--disabled) {
    &:focus-visible,
    &:hover {
      --color: var(--bg-black-90);
      --progress: 70%;
    }

    &:active {
      --color: var(--bg-black);
      --progress: 50%;
    }
  }
}
</style>
