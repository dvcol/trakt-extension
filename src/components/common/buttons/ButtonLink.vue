<script lang="ts" setup>
import { type ButtonProps, NButton } from 'naive-ui';
import { type PropType } from 'vue';
import { RouterLink, type RouterLinkProps } from 'vue-router';

defineProps({
  link: {
    type: Object as PropType<RouterLinkProps>,
    required: true,
  },
  button: {
    type: Object as PropType<ButtonProps>,
    required: false,
  },
  muted: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <RouterLink
    v-slot="{ isActive, href, navigate, isExactActive, route }"
    v-bind="link"
    custom
  >
    <NButton
      tag="a"
      :secondary="isActive"
      :quaternary="!isActive"
      class="button-link"
      :class="{
        muted,
        'is-active': isActive,
        'is-exact-active': isExactActive,
      }"
      :style="$attrs.style"
      round
      size="small"
      :href="href"
      v-bind="button"
      @click="navigate"
    >
      <slot :is-active="isActive" :is-exact-active="isExactActive" :route="route" />
    </NButton>
  </RouterLink>
</template>

<style lang="scss" scoped>
.button-link {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0;
  padding: 0.125rem;

  &.is-active {
    --n-color: var(--n-color-focus) !important;
  }

  &.muted:not(.is-active) {
    opacity: 0.5;
  }
}
</style>
