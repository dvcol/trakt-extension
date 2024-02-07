<script setup lang="ts">
import { RouterView } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import { useSettingsStoreRefs } from '~/stores/settings.store';
import { useI18n } from '~/utils';

const i18n = useI18n('global');
const { isAuthenticated } = useSettingsStoreRefs();
</script>

<template>
  <header v-if="isAuthenticated">
    <NavbarComponent />
  </header>
  <main>
    <RouterView />
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
  background: rgb(0 0 0 / 30%);
  backdrop-filter: blur(2px);
  transition: background 0.5s;
  will-change: background;

  &:hover {
    background: rgb(0 0 0 / 60%);
  }
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
}
</style>
