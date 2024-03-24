<script setup lang="ts">
import { NButton, NCard, NFlex, NH4 } from 'naive-ui';

import type { ButtonProps } from 'naive-ui';

import type { PropType } from 'vue';

import Logo from '~/assets/logo.svg';

import { useI18n } from '~/utils';

const i18n = useI18n('login');

defineProps({
  logo: {
    type: String,
    required: false,
  },
  hideLogo: {
    type: Boolean,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  buttonText: {
    type: String,
    required: false,
  },
  buttonProps: {
    type: Object as PropType<ButtonProps & Pick<HTMLAnchorElement, 'href'>>,
    required: false,
  },
});

const emits = defineEmits<{
  (name: 'onSignIn', e: MouseEvent): void;
}>();
</script>

<template>
  <NCard class="card" :title="title ?? i18n('title')" hoverable>
    <template v-if="!hideLogo" #cover>
      <div class="spacer" />
      <img alt="Vue logo" class="logo" :src="logo ?? Logo" width="125" height="125" />
    </template>

    <NFlex class="content" vertical justify="space-evenly">
      <slot name="message">
        <NH4 class="title" prefix="bar">{{ message ?? i18n('sub_title') }}</NH4>
      </slot>

      <slot name="button">
        <NButton
          class="button"
          secondary
          type="primary"
          round
          v-bind="buttonProps"
          @click="e => emits('onSignIn', e)"
        >
          {{ buttonText ?? i18n('sign_in') }}
        </NButton>
      </slot>

      <slot />
    </NFlex>
  </NCard>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.card {
  @include mixin.hover-background;

  height: 100%;
  padding: 0 1.75rem;

  .spacer {
    height: 60px;
  }

  .logo {
    position: absolute;
    top: -50px;
    left: 0;
  }

  :deep(.n-card-header) {
    font-size: 3em;
    text-align: center;
  }

  .content {
    height: 100%;

    .title {
      margin: 0;
      padding: 1rem;
      white-space: pre-line;
      background: rgb(99 226 184 / 5%);
      transition: background 0.5s;
      will-change: background;
    }

    .button {
      align-self: center;
      width: fit-content;
      margin: 2rem;
      padding: 1.25rem 1.5rem;
    }
  }

  &:hover {
    .title {
      background: rgb(99 226 184 / 9%);
    }
  }
}
</style>
