<script setup lang="ts">
import {
  darkTheme,
  type GlobalThemeOverrides,
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
import { lazyComponent } from '~/utils/lazy.utils';

const AppComponent = lazyComponent(() => import('~/components/AppComponent.vue'));

const isLight = ref(false); // watchPreferLight(); TODO implement light theme
const theme = computed(() => (isLight.value ? lightTheme : darkTheme));

const override: GlobalThemeOverrides = {
  // TODO red palette
};

const root = ref<HTMLElement>();
</script>

<template>
  <div id="trakt-extension-root" ref="root">
    <NConfigProvider :theme="theme" :theme-overrides="override" abstract>
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
@use '~/styles/base.scss';
@use '~/styles/mixin' as mixin;

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

.n-dropdown-menu,
.n-date-panel,
.n-virtual-list {
  @include mixin.hover-background(var(--bg-color-80), var(--bg-color-90));

  @media (prefers-color-scheme: dark) {
    @include mixin.hover-background(var(--bg-color-80), var(--bg-color-90));
  }

  @media (prefers-color-scheme: light) {
    @include mixin.hover-background(var(--bg-color-80), var(--bg-color-90));
  }
}

.n-select-menu {
  @include mixin.hover-background(var(--bg-color-20), var(--bg-color-80));

  @media (prefers-color-scheme: dark) {
    @include mixin.hover-background(var(--bg-color-20), var(--bg-color-80));
  }

  @media (prefers-color-scheme: light) {
    @include mixin.hover-background(var(--bg-color-20), var(--bg-color-80));
  }
}

.n-tooltip.n-tooltip {
  background: var(--bg-color-60);
  backdrop-filter: blur(var(--bg-blur));

  &:hover {
    background: var(--bg-black-90);
  }

  @media (prefers-color-scheme: light) {
    color: var(--vt-c-black);
  }
}
</style>
