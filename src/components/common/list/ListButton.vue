<script setup lang="ts">
import { type ButtonProps, type IconProps, NButton, NIcon } from 'naive-ui';

const { buttonProps } = defineProps<{
  buttonProps?: ButtonProps;
  iconProps?: IconProps;
  disabled?: boolean;
  colored?: boolean;
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
    :class="{ colored }"
    icon-placement="right"
    quaternary
    v-bind="buttonProps"
    @click="onClick"
    @keydown.enter="onClick"
  >
    <slot />
    <template v-if="iconProps && !disabled" #icon>
      <NIcon class="list-button-icon" v-bind="iconProps" />
    </template>
  </NButton>
</template>

<style scoped lang="scss">
.list-button {
  --color: var(--bg-black-60);
  --progress: 100%;

  display: flex;
  flex: 1 1 auto;
  justify-content: flex-end;
  box-sizing: border-box;
  min-width: min(20vw, 10rem);
  padding-right: 1rem;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--color) var(--progress)
  ) !important;
  /* stylelint-disable custom-property-no-missing-var-function -- custom property */
  transition:
    --color 0.25s var(--n-bezier),
    --progress 0.25s var(--n-bezier);

  &-icon {
    margin-left: 0.25rem;
  }

  &.colored {
    --color: var(--n-text-color);
    --progress: 1200%;
  }

  // stylelint-disable-next-line selector-class-pattern -- framework override
  &:not(.n-button--disabled) {
    &:focus-visible,
    &:hover {
      --color: var(--n-text-color);
      --progress: 600%;
    }

    &:active {
      --color: var(--n-text-color);
      --progress: 300%;
    }
  }
}
</style>
