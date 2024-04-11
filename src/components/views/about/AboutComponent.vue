<script lang="ts" setup>
import { NCard, NLayout } from 'naive-ui';

import { useI18n } from '~/utils';

const i18n = useI18n('about');
</script>

<template>
  <NLayout
    class="container"
    :content-style="{
      padding: '0.75rem 1rem',
    }"
    :native-scrollbar="false"
  >
    <NCard class="card" :title="i18n('title')">
      {{ i18n('content') }}
    </NCard>
  </NLayout>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;

.container {
  width: 100%;
  height: calc(100dvh - #{layout.$header-navbar-height});
  background: transparent;

  .card {
    @include mixin.hover-background($from: var(--bg-black-50), $to: var(--bg-color-80));

    min-height: 50rem;
  }
}
</style>
