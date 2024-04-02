<script lang="ts" setup>
import { NTab, NTabs } from 'naive-ui';
import { computed, ref, useSlots } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import NavbarSettingsDropdown from '~/components/common/navbar/NavbarSettingsDopdown.vue';

import { Route } from '~/router';
import { NavbarService } from '~/services/navbar.service';
import { useI18n } from '~/utils';

const i18n = useI18n('route');
const route = useRoute();
const router = useRouter();
const slots = useSlots();

const navigate = (to: Route) => {
  router.push({ name: to });
};

const routes = [
  Route.Progress,
  Route.Calendar,
  Route.History,
  Route.Watchlist,
  Route.Search,
];

const activeRoute = computed(() => {
  const _name = route.name?.toString();
  if (!_name) return;
  return routes.find(r => r === _name) ?? routes.find(r => _name.startsWith(r));
});

const isHover = ref(false);
const isFocus = ref(false);

const hasDrawer = computed(() => {
  const drawer = !!route.name && !!slots.drawer;
  NavbarService.drawer.value = drawer;
  return drawer;
});

const showDrawer = computed(() => {
  const show = hasDrawer.value && (isHover.value || isFocus.value);
  NavbarService.open.value = show;
  return show;
});

const navElement = ref<HTMLElement>();
</script>

<template>
  <nav
    ref="navElement"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @focusin="isFocus = true"
    @focusout="isFocus = false"
  >
    <NTabs
      :value="activeRoute"
      class="tabs"
      type="segment"
      justify-content="space-evenly"
      animated
    >
      <template v-for="_route in routes" :key="_route">
        <NTab
          class="tab"
          :name="_route.toLowerCase()"
          type="segment"
          @click="navigate(_route)"
        >
          <span> {{ i18n(_route.toLowerCase()) }}</span>
        </NTab>
      </template>
      <NTab
        class="tab"
        style="position: relative"
        :name="Route.Settings.toLowerCase()"
        type="segment"
        @click="navigate(Route.Settings)"
      >
        <NavbarSettingsDropdown v-if="navElement" :parent-element="navElement" />
      </NTab>
    </NTabs>
    <div
      class="drawer"
      :class="{
        'has-drawer': hasDrawer,
        'drawer-visible': showDrawer,
      }"
    >
      <slot name="drawer" :parent-element="navElement"></slot>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '~/styles/layout' as layout;

nav {
  padding: 0 0.25rem;
  font-size: 12px;
  text-align: center;

  .drawer {
    @include layout.navbar-transition;

    display: flex;
    align-items: center;
    justify-content: center;
    height: 0;
    overflow: hidden;
  }

  a {
    color: inherit; /* blue colors for links too */
    text-decoration: inherit; /* no underline */
  }

  .tabs {
    display: flex;
    justify-content: center;
    min-height: 2.75rem;
  }
}
</style>

<style lang="scss" scoped>
nav {
  .tabs {
    --n-bar-color: var(--trakt-red-dark) !important;
    --n-tab-text-color-active: var(--vt-c-white) !important;
    --n-tab-text-color-hover: color-mix(
      in srgb,
      var(--trakt-red) 90%,
      var(--vt-c-white)
    ) !important;
    --n-tab-color-segment: color-mix(
      in srgb,
      var(--trakt-red) 50%,
      transparent
    ) !important;
    --n-color-segment: inherit !important;

    .tab {
      min-height: 1.25rem;
    }

    /* stylelint-disable-next-line selector-class-pattern -- overriding theme class  */
    .n-tabs-tab--active {
      --n-tab-text-color-hover: color-mix(
        in srgb,
        var(--trakt-white) 99%,
        var(--vt-c-red)
      ) !important;
    }

    .n-tabs-capsule {
      backdrop-filter: blur(1px);
    }
  }
}
</style>
