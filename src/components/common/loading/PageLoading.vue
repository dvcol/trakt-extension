<script setup lang="ts">
import { NIcon } from 'naive-ui';

import IconLoadingMatrix from '~/components/icons/IconLoadingMatrix.vue';
</script>

<template>
  <NIcon class="loading-container" size="3rem">
    <IconLoadingMatrix />
  </NIcon>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-bottom: layout.$header-navbar-height;
}
</style>
