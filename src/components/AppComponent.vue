<script setup lang="ts">
import { NButton, NDrawer, NDrawerContent, NFlex, NIcon } from 'naive-ui';
import { ref, Transition, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import { NavbarComponent } from '~/components/common';
import GridBackground from '~/components/common/background/GridBackground.vue';
import PageLoading from '~/components/common/loading/PageLoading.vue';
import IconChevronLeft from '~/components/icons/IconChevronLeft.vue';
import IconClose from '~/components/icons/IconClose.vue';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';

const { isAuthenticated } = useAuthSettingsStoreRefs();
const { currentRoute, push, back } = useRouter();

const panel = ref(false);
const base = ref();

watch(
  currentRoute,
  (_next, _prev) => {
    panel.value = !!_next.meta?.panel;
    base.value = _next.meta?.base;
  },
  {
    immediate: true,
  },
);

const asideRef = ref();

const onAfterLeave = () => {
  if (!base.value) return;
  push({ name: base.value });
};

const onClose = () => {
  panel.value = false;
};

const onBack = () => {
  if (window.history.state.back) return back();
  return onClose();
};
</script>

<template>
  <header :class="{ open: panel }">
    <RouterView v-slot="{ Component }" name="navbar">
      <NavbarComponent v-if="isAuthenticated" :disabled="panel">
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
          <component :is="Component ?? PageLoading" :panel="panel" />
        </KeepAlive>
      </Transition>
    </main>
    <aside>
      <RouterView v-slot="{ Component: PanelComponent }">
        <NDrawer
          v-model:show="panel"
          :to="asideRef"
          width="100%"
          class="panel"
          close-on-esc
          :on-after-leave="onAfterLeave"
          auto-focus
        >
          <NDrawerContent :native-scrollbar="false">
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
    background: var(--bg-gradient-60-90);
    backdrop-filter: blur(var(--bg-blur-20));
  }
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100% - #{layout.$header-navbar-height});
  margin-top: layout.$header-navbar-height;
}

.panel {
  position: relative;
  max-height: calc(100% - #{layout.$header-navbar-height});
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
</style>
