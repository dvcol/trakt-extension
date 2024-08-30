<script setup lang="ts">
import {
  NButton,
  NDialogProvider,
  NDrawer,
  NDrawerContent,
  NFlex,
  NIcon,
} from 'naive-ui';
import { ref, Transition, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import GridBackground from '~/components/common/background/GridBackground.vue';
import DebugProvider from '~/components/common/debug/DebugProvider.vue';
import PageLoading from '~/components/common/loading/PageLoading.vue';
import NavbarComponent from '~/components/common/navbar/NavbarComponent.vue';
import IconChevronLeft from '~/components/icons/IconChevronLeft.vue';
import IconClose from '~/components/icons/IconClose.vue';
import CheckinComponent from '~/components/views/checkin/CheckinComponent.vue';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
const { currentRoute, push, back } = useRouter();

const { footerOpen, panelOpen, panelDirty } = useAppStateStoreRefs();

const base = ref();

const appRef = ref();
const mainRef = ref();
const footerRef = ref();

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
  <div ref="appRef" class="app-container">
    <NDialogProvider :to="appRef">
      <header :class="{ open: panelOpen }">
        <RouterView v-slot="{ Component }" name="navbar">
          <NavbarComponent v-if="isAuthenticated" :disabled="panelOpen">
            <template v-if="Component" #drawer="{ parentElement }">
              <Transition name="scale" mode="out-in">
                <KeepAlive>
                  <component :is="Component" :parent-element="parentElement" />
                </KeepAlive>
              </Transition>
            </template>
          </NavbarComponent>
        </RouterView>
      </header>
      <RouterView v-slot="{ Component }">
        <main
          ref="mainRef"
          :class="{ 'full-height': !isAuthenticated, loading: !Component }"
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
              class="panel"
              close-on-esc
              auto-focus
              :on-after-leave="onAfterLeave"
              :on-after-enter="onAfterEnter"
            >
              <NDrawerContent v-if="isAuthenticated" :native-scrollbar="false">
                <!--  Header  -->
                <NFlex justify="space-between" class="panel-header">
                  <NButton circle quaternary @click="onBack">
                    <template #icon>
                      <NIcon>
                        <IconChevronLeft />
                      </NIcon>
                    </template>
                  </NButton>
                  <NButton circle quaternary @click="onClose">
                    <template #icon>
                      <NIcon>
                        <IconClose />
                      </NIcon>
                    </template>
                  </NButton>
                </NFlex>

                <!--  Content  -->
                <div class="panel-content">
                  <component :is="PanelComponent" />
                </div>
              </NDrawerContent>
            </NDrawer>
          </RouterView>
        </aside>
        <footer
          ref="footerRef"
          @mouseenter="footerOpen = true"
          @mouseleave="footerOpen = false"
        >
          <CheckinComponent v-if="isAuthenticated" :parent-element="footerRef" />
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
  overflow: hidden;

  header {
    position: absolute;
    top: 0;
    z-index: layers.$layer-ui;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: layout.$header-navbar-height;

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
    min-height: layout.$main-content-height;
    margin-top: layout.$safe-navbar-height;

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

  .panel {
    position: relative;
    max-height: calc(100% - #{layout.$safe-navbar-height});
    overflow: auto;

    &-header {
      position: sticky;
      top: 1rem;
    }

    &-content {
      margin-top: -1.125rem;
      padding: 0 3rem 1.25rem;
    }
  }
}
</style>
