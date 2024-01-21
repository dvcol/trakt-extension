<script setup lang="ts">
import { darkTheme, lightTheme, NConfigProvider } from 'naive-ui';

import { computed } from 'vue';

import { watchPreferDark } from '~/utils';
import { lazyComponent } from '~/utils/lazy.utils';

const AppComponent = lazyComponent(() => import('~/components/AppComponent.vue'));

const isDark = watchPreferDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));
</script>

<template>
  <div id="trakt-extension-root">
    <NConfigProvider :theme="theme" abstract>
      <AppComponent />
    </NConfigProvider>
  </div>
</template>

<style lang="scss">
@import '~/styles/base.css';

:host {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  color: var(--color-text);
  font-weight: normal;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  transition:
    color 0.5s,
    background-color 0.5s;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#trakt-extension-root {
  height: 100%;
}
</style>
