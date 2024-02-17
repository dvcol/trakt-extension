<script setup lang="ts">
import { Transition } from 'vue';
import { RouterView } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
</script>

<template>
  <header>
    <NavbarComponent v-if="isAuthenticated" />
  </header>
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="scale" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style lang="scss" scoped>
@use '~/styles/z-index' as layers;

header {
  position: sticky;
  top: 0;
  z-index: layers.$layer-ui;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg-blur-black);
  backdrop-filter: blur(var(--bg-blur));
  transition: background 0.5s;
  will-change: background;

  &:hover {
    background: var(--bg-blur-black-hover);
  }
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.25s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
