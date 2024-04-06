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
import { NavbarService } from '~/services/navbar.service';
import { lazyComponent } from '~/utils/lazy.utils';

const AppComponent = lazyComponent(() => import('~/components/AppComponent.vue'));

const isLight = ref(false); // watchPreferLight(); TODO implement light theme
const theme = computed(() => (isLight.value ? lightTheme : darkTheme));

const override: GlobalThemeOverrides = {
  // TODO red palette
};

const { drawer } = NavbarService;
const drawerOpen = NavbarService.open;

const root = ref<HTMLElement>();
</script>

<template>
  <div id="trakt-extension-root" ref="root">
    <NConfigProvider :theme="theme" :theme-overrides="override" abstract>
      <AppComponent />

      <NLoadingBarProvider
        :to="root"
        :loading-bar-style="{ loading: { '--n-color-loading': 'var(--vt-c-white)' } }"
      >
        <LoadingBarProvider />
      </NLoadingBarProvider>

      <NMessageProvider
        :to="root"
        :max="2"
        :container-class="
          [
            'message-container',
            drawer ? 'has-drawer' : '',
            drawerOpen ? 'drawer-visible' : '',
          ]
            .filter(Boolean)
            .join(' ')
        "
      >
        <MessageProvider />
      </NMessageProvider>

      <NNotificationProvider
        :to="root"
        :max="2"
        :container-class="
          [
            'notification-container',
            drawer ? 'has-drawer' : '',
            drawerOpen ? 'drawer-visible' : '',
          ]
            .filter(Boolean)
            .join(' ')
        "
      >
        <NotificationProvider />
      </NNotificationProvider>
    </NConfigProvider>
  </div>
</template>

<style lang="scss">
@use '~/styles/base.scss';
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;

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

.notification-container.n-notification-container.n-notification-container {
  @include layout.navbar-transition($transition: top);

  top: layout.$header-navbar-height;

  &.drawer-visible {
    top: layout.$header-open-drawer-height;
  }
}

.message-container.n-message-container.n-message-container {
  @include layout.navbar-transition($transition: top);

  top: calc(#{layout.$header-navbar-height} + 12px);

  &.drawer-visible {
    top: calc(#{layout.$header-open-drawer-height} + 12px);
  }
}

.n-dropdown-menu,
.n-date-panel,
.n-virtual-list {
  @include mixin.hover-background(
    $from: var(--custom-bg-color, var(--bg-color-80)),
    $to: var(--custom-bg-color-hover, var(--bg-color-90))
  );
}

.n-popselect-menu,
.n-select-menu {
  @include mixin.hover-background(
    $from: var(--custom-bg-color, var(--bg-color-20)),
    $to: var(--custom-bg-color-hover, var(--bg-color-80))
  );
}

.n-drawer-mask {
  background: var(--bg-gradient-60-90);
  backdrop-filter: blur(var(--bg-blur-20));
}

.n-drawer {
  background: transparent;
}

.n-message-wrapper .n-message,
.n-notification-container .n-notification,
.n-tooltip.n-tooltip,
.n-popover-arrow.n-popover-arrow.n-popover-arrow {
  background: var(--custom-bg-color, var(--bg-color-60));
  backdrop-filter: blur(var(--bg-blur));

  &:hover {
    background: var(--custom-bg-color-hover, var(--bg-black-90));
    backdrop-filter: var(--custom-bg-blur-hover, var(--bg-blur-hover));
  }

  @media (prefers-color-scheme: light) {
    color: var(--vt-c-black);
  }
}
</style>
