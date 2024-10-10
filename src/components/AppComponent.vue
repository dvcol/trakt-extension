<script setup lang="ts">
import { NDialogProvider, NDrawer } from 'naive-ui';
import { ref, Transition, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import GridBackground from '~/components/common/background/GridBackground.vue';
import DebugProvider from '~/components/common/debug/DebugProvider.vue';
import PageLoading from '~/components/common/loading/PageLoading.vue';
import NavbarComponent from '~/components/common/navbar/NavbarComponent.vue';
import CheckinComponent from '~/components/views/checkin/CheckinComponent.vue';
import PanelContent from '~/components/views/panel/PanelContent.vue';
import { NavbarService } from '~/services/navbar.service';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
const { currentRoute, push, back } = useRouter();

const {
  appRef,
  mainRef,
  footerRef,
  footerOpen,
  panelOpen,
  panelDirty,
  floating,
  reverse,
} = useAppStateStoreRefs();
const { isWatching } = useWatchingStoreRefs();

const base = ref();

watch(
  currentRoute,
  (_next, _prev) => {
    panelOpen.value = !!_next.meta?.panel;
    base.value = _next.meta?.base;
  },
  {
    immediate: true,
  },
);

const onAfterLeave = () => {
  if (!base.value) return;
  push({ name: base.value });
};

const onAfterEnter = () => {
  panelDirty.value = false;
};

const onClose = () => {
  panelOpen.value = false;
};

const onBack = () => {
  if (window.history.state.back) return back();
  return onClose();
};
</script>

<template>
  <div
    ref="appRef"
    class="app-container"
    :class="{ reverse, floating, watching: isWatching }"
  >
    <NDialogProvider :to="appRef">
      <header :class="{ open: panelOpen }">
        <RouterView v-slot="{ Component }" name="navbar">
          <NavbarComponent
            v-if="isAuthenticated"
            :disabled="panelOpen"
            :reverse="reverse"
            :floating="floating"
          >
            <template v-if="Component" #drawer="{ parentElement }">
              <Transition name="scale" mode="out-in">
                <KeepAlive>
                  <component
                    :is="Component"
                    :parent-element="parentElement"
                    :reverse="reverse"
                  />
                </KeepAlive>
              </Transition>
            </template>
          </NavbarComponent>
        </RouterView>
      </header>
      <RouterView v-slot="{ Component }">
        <main
          ref="mainRef"
          :class="{ 'full-height': !isAuthenticated, 'loading': !Component }"
          @touchstart.passive="NavbarService.hideDrawer"
        >
          <GridBackground v-if="!Component" :size="20" />
          <Transition name="scale" mode="out-in">
            <KeepAlive>
              <component
                :is="Component ?? PageLoading"
                :panel="panelOpen"
                :footer="footerOpen"
              />
            </KeepAlive>
          </Transition>
        </main>
        <aside>
          <RouterView v-slot="{ Component: PanelComponent }">
            <NDrawer
              v-model:show="panelOpen"
              :to="mainRef"
              width="100%"
              class="root-panel-wrapper"
              close-on-esc
              auto-focus
              :on-after-leave="onAfterLeave"
              :on-after-enter="onAfterEnter"
            >
              <PanelContent
                v-if="isAuthenticated"
                :native-scrollbar="false"
                @on-back="onBack"
                @on-close="onClose"
              >
                <component :is="PanelComponent ?? PageLoading" />
              </PanelContent>
            </NDrawer>
          </RouterView>
        </aside>
        <footer
          ref="footerRef"
          @mouseenter="footerOpen = true"
          @mouseleave="footerOpen = false"
        >
          <CheckinComponent
            v-if="isAuthenticated"
            :parent-element="footerRef"
            :reverse="reverse"
          />
        </footer>
        <DebugProvider />
      </RouterView>
    </NDialogProvider>
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;
@use '~/styles/z-index' as layers;
@use '~/styles/transition' as transition;
@include transition.scale;

.app-container {
  --max-header-width: 800px;

  overflow: hidden;

  header {
    position: absolute;
    top: 0;
    bottom: auto;
    left: 0;
    z-index: layers.$layer-ui;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: layout.$header-navbar-height;
    transition:
      bottom 0.4s var(--n-bezier),
      top 0.5s var(--n-bezier),
      left 0.5s var(--n-bezier),
      width 0.5s var(--n-bezier);

    > :first-child {
      @include mixin.hover-background;
    }

    &.open > :first-child {
      background: var(--bg-gradient-60-90);
      // stylelint-disable-next-line property-no-vendor-prefix -- necessary for safari
      -webkit-backdrop-filter: blur(var(--bg-blur-20));
      backdrop-filter: blur(var(--bg-blur-20));
    }
  }

  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: layout.$safe-content-height;
    margin-top: layout.$safe-navbar-height;
    padding-right: calc(#{layout.$safe-area-inset-right} / 1.5);
    padding-left: calc(#{layout.$safe-area-inset-left} / 1.5);
    transition:
      min-height 0.5s var(--n-bezier),
      margin-top 0.5s var(--n-bezier);

    &.full-height {
      min-height: var(--full-height);
      margin-top: 0;

      :deep(.loading-container) {
        padding-top: layout.$safe-navbar-height;
      }
    }
  }

  footer {
    position: fixed;
    bottom: 0;
    z-index: layers.$layer-ui;
    width: 100%;
  }

  :deep(.root-panel-wrapper.n-drawer) {
    transition: all 0.3s var(--n-bezier);
  }

  &.watching {
    :deep(.root-panel-wrapper.n-drawer) {
      padding-bottom: layout.$safe-watching-height;
    }
  }

  &.reverse {
    header {
      top: auto;
      bottom: calc(0% - #{layout.$safe-area-inset-bottom});
      flex-direction: column-reverse;
    }

    main {
      min-height: layout.$bottom-content-height;
      margin-top: 0;
      margin-bottom: layout.$safe-navbar-height;
    }

    footer {
      top: 0;
      bottom: auto;
    }

    &.watching {
      :deep(.root-panel-wrapper.n-drawer) {
        padding-top: layout.$top-safe-watching-height;
      }
    }
  }

  &.floating {
    header {
      top: layout.$floating-navbar-offset;
      left: calc(50% - var(--max-header-width) / 2);
      width: var(--max-header-width);
    }

    main {
      min-height: layout.$floating-content-height;
      margin-top: layout.$safe-area-inset-top;
    }

    :deep(.root-panel-wrapper.n-drawer) {
      margin-top: layout.$floating-navbar-height;
    }
  }
}
</style>
