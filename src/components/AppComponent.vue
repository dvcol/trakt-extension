<script setup lang="ts">
import { NDrawer, NDrawerContent } from 'naive-ui';
import { ref, Transition, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import GridBackground from '~/components/common/background/GridBackground.vue';
import PageLoading from '~/components/common/loading/PageLoading.vue';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
const { currentRoute, push, getRoutes } = useRouter();

const origin = ref();
const drawer = ref(false);

watch(
  currentRoute,
  (_next, _prev) => {
    const isDrawer = !!_next.meta?.drawer;
    drawer.value = isDrawer;
    if (origin.value && isDrawer) return;
    origin.value = isDrawer ? _prev : undefined;
  },
  {
    immediate: true,
  },
);

const asideRef = ref();

const onAfterLeave = () => {
  if (!origin.value) return;
  push(origin.value);
  origin.value = undefined;
};

const onClose = () => {
  drawer.value = false;
};
</script>

<template>
  <header :class="{ open: drawer }">
    <RouterView v-slot="{ Component }" name="navbar">
      <NavbarComponent v-if="isAuthenticated">
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
    <main ref="asideRef" style="position: relative">
      <GridBackground v-if="!Component" :size="20" />
      <Transition name="scale" mode="out-in">
        <KeepAlive>
          <component :is="Component ?? PageLoading" />
        </KeepAlive>
      </Transition>
    </main>
    <aside>
      <RouterView v-slot="{ Component: DrawerComponent }">
        <NDrawer
          v-model:show="drawer"
          :to="asideRef"
          width="100%"
          close-on-esc
          :on-after-leave="onAfterLeave"
          auto-focus
        >
          <NDrawerContent>
            <KeepAlive>
              <component :is="DrawerComponent" @close="onClose" />
            </KeepAlive>
          </NDrawerContent>
        </NDrawer>
      </RouterView>
    </aside>
  </RouterView>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;
@use '~/styles/z-index' as layers;
@use '~/styles/transition' as transition;
@include transition.scale;

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
    background: var(--bg-color-hover);
  }
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100% - #{layout.$header-navbar-height});
  margin-top: layout.$header-navbar-height;
}
</style>
