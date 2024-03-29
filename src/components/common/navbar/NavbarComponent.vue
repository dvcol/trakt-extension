<script lang="ts" setup>
import { NTab, NTabs } from 'naive-ui';
import { computed, ref, useSlots } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import NavbarSettingsDropdown from '~/components/common/navbar/NavbarSettingsDopdown.vue';

import { Route } from '~/router';
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

const isHover = ref(false);
const isFocus = ref(false);
const showDrawer = computed(
  () => route.name && !!slots.drawer && (isHover.value || isFocus.value),
);

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
      :value="route.name?.toString()"
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
    <div class="drawer" :class="{ visible: showDrawer }">
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0;
    overflow: hidden;
    transition: height 0.5s var(--n-bezier);
    transition-delay: 0.2s;

    &.visible {
      height: layout.$header-drawer-height;
      transition: height 0.25s var(--n-bezier);
      transition-delay: 0s;
    }
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
