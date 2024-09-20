<script lang="ts" setup>
import {
  handleSwipe,
  SwipeDirection,
  type SwipeDirections,
} from '@dvcol/common-utils/common/touch';
import { NTab, NTabs } from 'naive-ui';
import { computed, ref, toRefs, useSlots } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import NavbarSettingsDropdown from '~/components/common/navbar/NavbarSettingsDopdown.vue';

import { Route } from '~/models/router.model';
import { Logger } from '~/services/logger.service';
import { NavbarService } from '~/services/navbar.service';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { Header } from '~/styles/layout.style';
import { useI18n } from '~/utils/i18n.utils';

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

const nextRoute = computed(() => {
  if (!activeRoute.value) return;
  const index = activableRoutes.value.indexOf(activeRoute.value);
  return activableRoutes.value[index + 1] ?? activableRoutes.value[0];
});

const prevRoute = computed(() => {
  if (!activeRoute.value) return;
  const index = activableRoutes.value.indexOf(activeRoute.value);
  return (
    activableRoutes.value[index - 1] ??
    activableRoutes.value[activableRoutes.value.length - 1]
  );
});

const { isHover, isFocus, ref: navElement } = NavbarService;

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

const touchStart = ref<TouchEvent>();
const drawerStart = ref<{
  scroll: number;
  width: number;
}>();

const drawerRef = ref<HTMLElement>();
const onTouchStart = (e: TouchEvent) => {
  touchStart.value = e;

  const drawer = drawerRef.value?.firstElementChild;
  // if there is no drawer we can always navigate
  if (!drawer) return;
  drawerStart.value = {
    scroll: drawer.scrollLeft,
    width: drawer.scrollWidth - drawer.clientWidth,
  };
};

const isDrawerNotScrollable = (
  direction: typeof SwipeDirection.Right | typeof SwipeDirection.Left,
  start: Touch | undefined = touchStart.value?.targetTouches?.[0],
) => {
  // if we start the swipe outside the drawer we can always navigate
  if (start && start?.clientY < Header.navbarHeight) return true;
  // if there is no drawer we can always navigate
  if (!drawerStart.value) return true;
  const { scroll, width } = drawerStart.value;
  // if the drawer is already at the end we can navigate right (swipe to the left)
  if (direction === SwipeDirection.Left) return width === scroll;
  // if the drawer is already at the start we can navigate left (swipe to the right)
  return scroll === 0;
};

const handleSwipeDirection = (swipe: SwipeDirections) => {
  switch (swipe) {
    case SwipeDirection.Down:
      isHover.value = true;
      break;
    case SwipeDirection.Up:
      isHover.value = false;
      break;
    case SwipeDirection.Left:
      if (nextRoute.value && isDrawerNotScrollable(swipe)) navigate(nextRoute.value);
      break;
    case SwipeDirection.Right:
      if (prevRoute.value && isDrawerNotScrollable(swipe)) navigate(prevRoute.value);
      break;
    default:
      Logger.warn('Unknown swipe direction:', swipe);
  }
};

const onTouchEnd = (e: TouchEvent) => {
  const _start = touchStart.value?.targetTouches?.[0];
  const _end = e.changedTouches?.[0];

  if (!_start || !_end) return;

  const { clientWidth } = navElement.value || {};
  const swipe = handleSwipe(_start, _end, {
    vertical: Header.totalHeight,
    up: Header.navbarHeight,
    left: clientWidth ? Math.min(clientWidth / 2, 200) : 200,
    right: clientWidth ? Math.min(clientWidth / 2, 200) : 200,
  });

  if (swipe) handleSwipeDirection(swipe);

  touchStart.value = undefined;
  drawerStart.value = undefined;
  return swipe;
};
</script>

<template>
  <nav
    ref="navElement"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @focusin="isFocus = true"
    @focusout="isFocus = false"
    @touchend="onTouchEnd"
    @touchstart="onTouchStart"
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
          class="tab"
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
      ref="drawerRef"
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
  --navbar-tab-color: hsl(from var(--trakt-red-darker) h s l / 80%);
  --navbar-text-color-hover: var(--trakt-red);
  --navbar-text-color-hover-active: var(--white);
  --navbar-text-color-active: var(--white);

  padding: env(safe-area-inset-top) 0.25rem 0;
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
    min-height: layout.$header-navbar-height;

    :deep(.n-tabs-capsule) {
      height: calc(#{layout.$header-navbar-height} - 0.75rem) !important;
      border-radius: 0.5rem !important;
    }

    :deep(.tab) {
      --n-font-weight-strong: normal;

      padding: 0 0.25rem;
    }
  }
}
</style>
