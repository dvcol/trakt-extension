<script setup lang="ts">
import { lazyComponent } from '~/utils/lazy.utils';

const AppView = lazyComponent(() => import('~/components/AppView.vue'));
</script>

<template>
  <div id="app">
    <AppView />
  </div>
</template>

<style lang="scss">
@import '~/styles/base.css';

#app {
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
  background: var(--color-background);
  transition:
    color 0.5s,
    background-color 0.5s;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
