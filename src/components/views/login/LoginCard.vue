<script setup lang="ts">
import { NButton, NCard, NFlex, NH4 } from 'naive-ui';

import { computed, onMounted, type PropType, ref, toRefs, watch } from 'vue';

import type { ButtonProps } from 'naive-ui';

import Logo from '~/assets/logo.svg';

import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('login');

const props = defineProps({
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
    default: '',
  },
  buttonDisabled: {
    type: Boolean,
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
  minWidth: {
    type: String,
    required: false,
  },
  progress: {
    type: Number,
    required: false,
  },
  interval: {
    type: Number,
    required: false,
    default: 0,
  },
});

const emits = defineEmits<{
  (name: 'onSignIn', e: MouseEvent): void;
}>();

const { message, interval, progress } = toRefs(props);

const debounceMessage = ref<string>(message.value);
const _message = computed(() => debounceMessage.value || i18n('sub_title'));

const changed = ref(false);
const timeout = ref<ReturnType<typeof setTimeout>>();

const reverse = ref(false);
const _interval = ref<ReturnType<typeof setInterval>>();

const _progress = computed(() => {
  if (interval.value) return reverse.value ? 0 : 100;
  return progress?.value;
});

onMounted(() => {
  watch(message, (_new, _old) => {
    changed.value = _old !== _new;
    if (!changed.value) return;
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      changed.value = false;
      debounceMessage.value = _new;
    }, 250);
  });
  watch(interval, _new => {
    if (_interval.value) clearInterval(_interval.value);
    if (!_new) return;
    _interval.value = setInterval(() => {
      reverse.value = !reverse.value;
    }, _new);
  });
});
</script>

<template>
  <NCard class="card" :title="title ?? i18n('title')" hoverable>
    <template v-if="!hideLogo" #cover>
      <div class="spacer" />
      <img alt="Vue logo" class="logo" :src="logo ?? Logo" width="125" height="125" />
    </template>

    <NFlex class="content" vertical justify="space-evenly">
      <slot name="message">
        <NH4
          class="title"
          :class="{ progress, interval }"
          prefix="bar"
          :style="{
            minWidth,
            '--progress': `${ _progress }%`,
            '--interval': `${interval}ms`,
          }"
        >
          <span class="title-content" :class="{ changed }">
            {{ _message }}
          </span>
        </NH4>
      </slot>

      <slot name="main" />

      <slot name="button">
        <NButton
          class="button"
          secondary
          type="primary"
          round
          :disabled="buttonDisabled"
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
      --progress-color: rgb(99 226 184 / 10%);
      --color: rgb(99 226 184 / 5%);

      min-width: 0;
      margin: 0;
      padding: 1rem;
      white-space: pre-line;
      background: var(--color);
      transition:
        min-width 0.5s var(--n-bezier),
        background 0.5s var(--n-bezier),
        --progress 0.5s var(--n-bezier);

      &.progress {
        @include mixin.progress-background($rail: var(--color));
      }

      &.interval {
        @include mixin.progress-background(
          $rail: var(--color),
          $color: var(--progress-color)
        );

        transition:
          min-width 0.5s var(--n-bezier),
          background var(--interval) linear,
          --progress var(--interval) linear;
      }

      &-content {
        display: flex;
        opacity: 1;
        transition: opacity 0.25s var(--n-bezier);

        &.changed {
          opacity: 0.25;
        }
      }
    }

    .button {
      align-self: center;
      width: fit-content;
      margin: 2rem;
      padding: 1.25rem 1.5rem;
    }
  }

  &:active,
  &:focus-within,
  &:hover {
    .title:not(&.progress) {
      --color: rgb(99 226 184 / 9%);
      --progress-color: rgb(99 226 184 / 14%);
    }
  }
}
</style>
