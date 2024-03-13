<script setup lang="ts">
import { Transition } from 'vue';
import { RouterView } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import GridBackground from '~/components/common/background/GridBackground.vue';
import PageLoading from '~/components/common/loading/PageLoading.vue';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
</script>

<template>
  <header>
    <RouterView v-slot="{ Component, route }" name="navbar">
      <NavbarComponent v-if="isAuthenticated">
        <template v-if="Component" #drawer="{ parentElement }">
          <Transition name="scale" mode="out-in">
            <KeepAlive>
              <component
                :is="Component"
                :key="route.path"
                :parent-element="parentElement"
              />
            </KeepAlive>
          </Transition>
        </template>
      </NavbarComponent>
    </RouterView>
  </header>
  <main>
    <RouterView v-slot="{ Component, route }">
      <GridBackground v-if="!Component" :size="20" />
      <Transition name="scale" mode="out-in">
        <KeepAlive>
          <component :is="Component ?? PageLoading" :key="route.path" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </main>
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
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100% - #{layout.$header-navbar-height});
  margin-top: layout.$header-navbar-height;
}
</style>
