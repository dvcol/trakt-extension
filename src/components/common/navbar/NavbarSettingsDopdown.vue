<script setup lang="ts">
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';

import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';

import { NAvatar, NDropdown, NEllipsis, NFlex, NIcon } from 'naive-ui';

import { computed, defineProps, h, ref } from 'vue';

import { useRouter } from 'vue-router';

import type { ArrayElement } from '@dvcol/common-utils/common';
import type { DropdownOption, DropdownProps } from 'naive-ui';
import type { Component, PropType } from 'vue';

import IconAccount from '~/components/icons/IconAccount.vue';
import IconAccountAdd from '~/components/icons/IconAccountAdd.vue';
import IconExternalLink from '~/components/icons/IconExternalLink.vue';
import IconLogOut from '~/components/icons/IconLogOut.vue';

import { getRouteIcon, Route } from '~/models/router.model';
import { Logger } from '~/services/logger.service';
import { NavbarService } from '~/services/navbar.service';
import { TraktService } from '~/services/trakt.service';
import { ExternaLinks } from '~/settings/external.links';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useLogout } from '~/stores/settings/use-logout';
import { defaultUser, useUserSettingsStoreRefs } from '~/stores/settings/user.store';

import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('navbar', 'settings');
const router = useRouter();

const { auths } = useAuthSettingsStoreRefs();
const { userSetting, userSettings, userSettingLoading } = useUserSettingsStoreRefs();
const { enabledRoutes } = useExtensionSettingsStoreRefs();

const avatar = computed(() => userSetting.value?.user?.images?.avatar?.full);
const username = computed(() => userSetting.value?.user?.username);

const fallback = ref<boolean>(!chromeRuntimeId);
const onAvatarError = (event: Event) => {
  Logger.error('Failed to fetch avatar', event);
  fallback.value = true;
};

const { routes } = defineProps({
  parentElement: {
    type: HTMLElement,
    required: true,
  },
  routes: {
    type: Array as PropType<Route[]>,
    required: false,
    default: () => [],
  },
  compact: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const users = computed(() => {
  return Object.entries(userSettings.value).filter(
    ([key, value]) =>
      value && auths.value?.[key] && key !== username.value && key !== defaultUser,
  );
});

const toOption = (
  key: string,
  icon: Component | string,
  label?: string,
  disabled?: boolean,
): ArrayElement<DropdownProps['options']> => {
  return {
    label: label ?? i18n(key),
    key,
    disabled,
    icon: () => {
      if (typeof icon === 'string') {
        return h(NAvatar, { src: icon, size: 16, round: true });
      }
      return h(NIcon, null, { default: () => h(icon) });
    },
  };
};

const { floating, reverse } = useAppStateStoreRefs();
const options = computed<DropdownOption[]>(() => {
  const baseOptions: DropdownOption[] = [
    toOption(Route.Settings, getRouteIcon(Route.Settings)),
    toOption(Route.About, getRouteIcon(Route.About)),
    { type: 'divider', key: 'external-links' },
    toOption('trakt', IconExternalLink),
    { type: 'divider', key: 'session-divider' },
    toOption('login', IconAccountAdd),
    toOption('logout', IconLogOut),
  ];

  const _routes = [];
  if (routes?.length) {
    _routes.push(
      ...routes.map(route =>
        toOption(route, getRouteIcon(route), i18n(route.toLowerCase(), 'route')),
      ),
    );
    _routes.push({ type: 'divider', key: 'routes-divider' });
  }

  if (!users.value.length) return [..._routes, ...baseOptions];
  return [
    ..._routes,
    ...users.value.map(([key, value]) =>
      toOption(
        `user-${key}`,
        (chromeRuntimeId && value?.user?.images?.avatar?.full) || IconAccount,
        key,
        userSettingLoading.value,
      ),
    ),
    { type: 'divider', key: 'users-divider' },
    ...baseOptions,
  ];
});

const optionsReversed = computed(() =>
  reverse.value ? [...options.value].reverse() : options.value,
);

const { loadUser, logout } = useLogout();

const onSelect: DropdownProps['onSelect'] = async (key: string, { label }) => {
  switch (key) {
    case 'trakt':
      return createTab({
        url: ExternaLinks.trakt[TraktService.isStaging ? 'staging' : 'production'],
      });
    case 'login':
      return TraktService.approve({ prompt: true });
    case 'logout':
      return logout();
    default:
      if (Object.values(Route).includes(key as Route)) return router.push(key);
      if (typeof label === 'string' && key.startsWith('user-')) {
        return loadUser(label);
      }
      Logger.error('Unknown key:', key);
  }
};

const { dropdown } = NavbarService;
const placement = computed(() => {
  if (reverse.value) return 'top';
  if (floating.value) return 'bottom';
  return 'bottom-start';
});
</script>

<template>
  <NDropdown
    trigger="hover"
    :options="optionsReversed"
    :to="parentElement"
    :placement="placement"
    size="small"
    class="settings-dropdown"
    :class="{ floating, reverse }"
    :style="{ '--tab-count': enabledRoutes.length + 1 }"
    :on-update:show="(visible: boolean) => (dropdown = visible)"
    @select="onSelect"
  >
    <NFlex justify="space-around" align="center" :wrap="false">
      <NEllipsis
        v-if="!compact"
        style="max-width: calc(100vw / 6 - 0.25rem - 3px - 1.75rem); margin-left: 0.25rem"
        :tooltip="{
          to: parentElement,
          placement: 'left',
          delay: 1000,
        }"
      >
        {{ username ?? i18n(Route.Settings.toLowerCase()) }}
      </NEllipsis>

      <NAvatar
        v-if="!fallback && avatar"
        :src="avatar"
        class="avatar"
        round
        size="small"
        color="transparent"
        :style="{ '--n-avatar-size-override': '1.3125rem' }"
        :on-error="onAvatarError"
      />
      <NIcon v-else style="margin-left: -0.25rem" size="1.25em">
        <IconAccount />
      </NIcon>
    </NFlex>
  </NDropdown>
</template>

<style lang="scss">
@use '~/styles/layout' as layout;

.settings-dropdown {
  min-width: max(calc(100vw / var(--tab-count)), 8rem);
  max-width: 20rem;
  margin-top: 0.75rem;
  margin-right: -0.25rem;
  text-align: left;

  &.floating {
    min-width: max(calc(#{layout.$floating-navbar-width} / var(--tab-count)), 8rem);
    margin-right: 0;
  }

  &.reverse {
    margin-right: -0.5rem;
  }
}
</style>
