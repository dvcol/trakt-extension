<script lang="ts" setup>
import { handleSwipeLeftRight, SwipeDirection } from '@dvcol/common-utils/common/touch';
import { NButton, NDrawerContent, NFlex, NIcon } from 'naive-ui';

import { ref } from 'vue';

import IconChevronLeft from '~/components/icons/IconChevronLeft.vue';
import IconClose from '~/components/icons/IconClose.vue';

const emits = defineEmits<{
  (name: 'onBack', e: MouseEvent | TouchEvent): void;
  (name: 'onClose', e: MouseEvent | TouchEvent): void;
}>();

const contentRef = ref<HTMLDivElement>();
const touchStart = ref<TouchEvent>();

const onTouchStart = (e: TouchEvent) => {
  touchStart.value = e;
};

const onTouchEnd = (e: TouchEvent) => {
  const _touchStart = touchStart.value?.targetTouches?.[0];
  const _touchEnd = e.changedTouches?.[0];
  if (!_touchStart) return;
  touchStart.value = undefined;
  const { clientWidth, clientHeight } = contentRef.value || {};
  const swipe = handleSwipeLeftRight(_touchStart, _touchEnd, {
    vertical: clientHeight ? Math.min(clientHeight / 2, 300) : 300,
    left: clientWidth ? Math.min(clientWidth / 2, 400) : 400,
    right: clientWidth ? Math.min(clientWidth / 2, 400) : 400,
  });
  if (swipe === SwipeDirection.Right) emits('onClose', e);
};
</script>

<template>
  <NDrawerContent
    :native-scrollbar="false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!--  Header  -->
    <NFlex justify="space-between" class="panel-header">
      <NButton circle quaternary @click="e => emits('onBack', e)">
        <template #icon>
          <NIcon>
            <IconChevronLeft />
          </NIcon>
        </template>
      </NButton>
      <NButton circle quaternary @click="e => emits('onClose', e)">
        <template #icon>
          <NIcon>
            <IconClose />
          </NIcon>
        </template>
      </NButton>
    </NFlex>

    <!--  Content  -->
    <div ref="contentRef" class="panel-content">
      <slot />
    </div>
  </NDrawerContent>
</template>

<style lang="scss" scoped>
.panel {
  &-header {
    position: sticky;
    top: 1rem;

    @media (width < 725px) {
      position: inherit;
    }
  }

  &-content {
    margin-top: -1.125rem;
    padding: 0 3rem 1.25rem;

    :deep(.n-skeleton) {
      opacity: 1;
      transition: opacity 0.1s ease-in 0.1s;

      /* Adds 0.2s delay and 1s transition to loading indicator to prevent flashing */
      @starting-style {
        opacity: 0;
      }
    }

    @media (width < 725px) {
      padding: 0 0.75rem 1rem;
    }
  }
}
</style>
