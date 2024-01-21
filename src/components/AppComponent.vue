<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import { LoginComponent } from '~/components/views/login';
import { useI18n } from '~/utils';

const i18n = useI18n('global');
const isAuthenticated = ref(false);
</script>

<template>
  <LoginComponent v-if="!isAuthenticated" />
  <template v-else>
    <header>
      <NavbarComponent />
    </header>
    <main>
      <RouterView />
    </main>
  </template>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

main {
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0 2rem;
}
</style>
