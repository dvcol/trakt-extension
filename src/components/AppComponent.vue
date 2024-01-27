<script setup lang="ts">
import { RouterView } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import { useSettingsStore } from '~/stores/settings.store';
import { useI18n } from '~/utils';

const i18n = useI18n('global');
const { isAuthenticated } = useSettingsStore();
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
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 2rem;
}
</style>
