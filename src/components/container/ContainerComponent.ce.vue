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

import { computed, onBeforeMount, ref } from 'vue';

import LoadingBarProvider from '~/components/container/LoadingBarProvider.vue';
import MessageProvider from '~/components/container/MessageProvider.vue';
import NotificationProvider from '~/components/container/NotificationProvider.vue';
import { NavbarService } from '~/services/navbar.service';
import { lazyComponent } from '~/utils/lazy.utils';
import { addCustomProgressProperty } from '~/utils/style.utils';

const AppComponent = lazyComponent(() => import('~/components/AppComponent.vue'));

const isLight = ref(false); // watchPreferLight(); TODO implement light theme
const theme = computed(() => (isLight.value ? lightTheme : darkTheme));

const override: GlobalThemeOverrides = {
  // TODO red palette
};

const { drawer } = NavbarService;
const drawerOpen = NavbarService.open;

const root = ref<HTMLElement>();

onBeforeMount(() => addCustomProgressProperty());
</script>

<template>
  <div id="trakt-extension-root" ref="root">
    <NConfigProvider :theme="theme" :theme-overrides="override" abstract>
      <AppComponent />

      <NLoadingBarProvider
        :to="root"
        :loading-bar-style="{ loading: { '--n-color-loading': 'var(--white)' } }"
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
/* stylelint-disable selector-class-pattern -- library class name */

@use '~/styles/base.scss';
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;

:host {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  height: var(--full-height);
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
  scrollbar-width: thin;
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

.n-popover.n-popconfirm {
  @include mixin.hover-background-only(
    $from: var(--bg-color-80),
    $to: var(--bg-color-90)
  );
}

.n-popconfirm .n-popconfirm__action {
  justify-content: space-around;
}

.n-notification-container .n-notification,
.n-message-wrapper .n-message,
.n-dropdown-menu,
.n-date-panel,
.n-virtual-list {
  @include mixin.hover-background(
    $from: var(--custom-bg-color, var(--bg-color-80)),
    $to: var(--custom-bg-color-hover, var(--bg-color-90))
  );
}

.n-notification-container .n-notification,
.n-message-wrapper .n-message.n-message--error-type {
  --custom-bg-color: var(--bg-color-error-80);
  --custom-bg-color-hover: var(--bg-color-error);
}

.n-message-wrapper .n-message.n-message--success-type {
  --custom-bg-color: var(--bg-color-success-80);
  --custom-bg-color-hover: var(--bg-color-success);
}

.n-message-wrapper .n-message.n-message--info-type {
  --custom-bg-color: var(--bg-color-info-80);
  --custom-bg-color-hover: var(--bg-color-info);
}

.n-message-wrapper .n-message.n-message--warning-type {
  --custom-bg-color: var(--bg-color-warning-80);
  --custom-bg-color-hover: var(--bg-color-warning);
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
  // stylelint-disable-next-line property-no-vendor-prefix -- necessary for safari
  -webkit-backdrop-filter: blur(var(--bg-blur-20));
  backdrop-filter: blur(var(--bg-blur-20));
}

.n-drawer {
  background: transparent;
}

.n-tooltip.n-tooltip,
.n-popover-arrow.n-popover-arrow.n-popover-arrow {
  background: var(--custom-bg-color, var(--bg-color-60));
  // stylelint-disable-next-line property-no-vendor-prefix -- necessary for safari
  -webkit-backdrop-filter: blur(var(--bg-blur));
  backdrop-filter: blur(var(--bg-blur));

  &:hover {
    background: var(--custom-bg-color-hover, var(--bg-black-90));
    // stylelint-disable-next-line property-no-vendor-prefix -- necessary for safari
    -webkit-backdrop-filter: var(--custom-bg-blur-hover, var(--bg-blur-hover));
    backdrop-filter: var(--custom-bg-blur-hover, var(--bg-blur-hover));
  }

  @media (prefers-color-scheme: light) {
    color: var(--black);
  }
}

.n-layout-sider {
  .n-layout-toggle-bar {
    right: -15px;
  }

  .n-anchor .n-anchor-link .n-anchor-link__title {
    padding-right: 0;
  }
}
</style>
