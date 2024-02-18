<script setup lang="ts">
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
} from 'naive-ui';

import { computed, ref } from 'vue';

import LoadingBarProvider from '~/components/container/LoadingBarProvider.vue';
import MessageProvider from '~/components/container/MessageProvider.vue';
import NotificationProvider from '~/components/container/NotificationProvider.vue';
import { watchPreferDark } from '~/utils';
import { lazyComponent } from '~/utils/lazy.utils';

const AppComponent = lazyComponent(() => import('~/components/AppComponent.vue'));

const isDark = watchPreferDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));

const root = ref<HTMLElement>();
</script>

<template>
  <div id="trakt-extension-root" ref="root">
    <NConfigProvider :theme="theme" abstract>
      <AppComponent />

      <NLoadingBarProvider
        :to="root"
        :loading-bar-style="{ loading: { '--n-color-loading': 'white' } }"
      >
        <LoadingBarProvider />
      </NLoadingBarProvider>

      <NMessageProvider :to="root">
        <MessageProvider />
      </NMessageProvider>

      <NNotificationProvider :to="root">
        <NotificationProvider />
      </NNotificationProvider>
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
