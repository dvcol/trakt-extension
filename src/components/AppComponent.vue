<script setup lang="ts">
import { Transition } from 'vue';
import { RouterView } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import GridBackground from '~/components/common/background/GridBackground.vue';
import PageLoading from '~/components/common/loading/PageLoading.vue';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
</script>

<template>
  <header>
    <NavbarComponent v-if="isAuthenticated" />
  </header>
  <main>
    <RouterView v-slot="{ Component, route }">
      <GridBackground v-if="!Component" :size="20" />
      <Transition name="scale" mode="out-in">
        <component :is="Component ?? PageLoading" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/z-index' as layers;
@use '~/styles/transition' as transition;
@include transition.scale;

$header-height: 2.75rem;

header {
  position: sticky;
  top: 0;
  z-index: layers.$layer-ui;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: $header-height;

  > :first-child {
    @include mixin.hover-background;
  }
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100% - #{$header-height});
  padding: 0 2rem;
}
</style>
