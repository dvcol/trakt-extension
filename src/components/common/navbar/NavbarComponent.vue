<script lang="ts" setup>
import { NTab, NTabs } from 'naive-ui';
import { computed, ref, toRefs, useSlots } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import NavbarSettingsDropdown from '~/components/common/navbar/NavbarSettingsDopdown.vue';

import { Route } from '~/router';
import { NavbarService } from '~/services/navbar.service';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils';

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { disabled } = toRefs(props);

const i18n = useI18n('route');
const route = useRoute();
const router = useRouter();
const slots = useSlots();

const navigate = (to: Route) => {
  router.push({ name: to });
};

const { enabledRoutes } = useExtensionSettingsStoreRefs();

const activableRoutes = computed(() => [...enabledRoutes.value, Route.Settings]);

const activeRoute = computed(() => {
  const _name = route.name?.toString();
  if (!_name) return;
  return (
    activableRoutes.value.find(r => r === _name) ??
    enabledRoutes.value.find(r => _name.startsWith(r)) ??
    Route.Settings
  );
});

const isHover = ref(false);
const isFocus = ref(false);

const hasDrawer = computed(() => {
  const drawer = !!route.name && !!slots.drawer;
  NavbarService.drawer.value = drawer;
  return drawer;
});

const showDrawer = computed(() => {
  const show = !disabled.value && hasDrawer.value && (isHover.value || isFocus.value);
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
      :key="enabledRoutes.join('-')"
      :value="activeRoute"
      class="tabs"
      type="segment"
      justify-content="space-evenly"
      animated
      :style="{
        '--n-bar-color': 'var(--trakt-red-dark)',
        '--n-tab-text-color-active': 'var(--navbar-text-color-active)',
        '--n-tab-text-color-hover': 'var(--navbar-text-color-hover)',
        '--n-tab-color-segment': 'var(--navbar-tab-color)',
        '--n-color-segment': 'inherit',
      }"
    >
      <template v-for="_route in enabledRoutes" :key="_route">
        <NTab
          :style="
            _route === activeRoute
              ? { '--n-tab-text-color-hover': 'var(--navbar-text-color-hover-active)' }
              : undefined
          "
          :name="_route.toLowerCase()"
          type="segment"
          @click="navigate(_route)"
        >
          <span>
            {{ i18n(_route.toLowerCase()) }}
          </span>
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
  --navbar-tab-color: var(--trakt-red-darker);
  --navbar-text-color-hover: var(--trakt-red);
  --navbar-text-color-hover-active: var(--white);
  --navbar-text-color-active: var(--white);

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
