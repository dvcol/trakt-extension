<script setup lang="ts">
import { NAvatar, NDropdown, NEllipsis, NFlex, NIcon } from 'naive-ui';

import { computed, defineProps, h, ref } from 'vue';

import { useRouter } from 'vue-router';

import type { ArrayElement } from '@dvcol/common-utils/common';
import type { DropdownProps } from 'naive-ui';
import type { Component } from 'vue';

import IconAccount from '~/components/icons/IconAccount.vue';
import IconAccountAdd from '~/components/icons/IconAccountAdd.vue';
import IconCog from '~/components/icons/IconCog.vue';
import IconExternalLink from '~/components/icons/IconExternalLink.vue';
import IconLightBulb from '~/components/icons/IconLightBulb.vue';
import IconLogOut from '~/components/icons/IconLogOut.vue';

import { Route } from '~/models/router.model';
import { TraktService } from '~/services/trakt.service';
import { ExternaLinks } from '~/settings/external.links';
import { logger } from '~/stores/settings/log.store';
import { useLogout } from '~/stores/settings/use-logout';
import { defaultUser, useUserSettingsStoreRefs } from '~/stores/settings/user.store';

import { chromeRuntimeId, createTab } from '~/utils/browser/browser.utils';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('navbar', 'settings');
const router = useRouter();

const { user, userSetting, userSettings } = useUserSettingsStoreRefs();

const avatar = computed(() => userSetting.value?.user?.images?.avatar?.full);
const username = computed(() => userSetting.value?.user?.username);

const fallback = ref<boolean>(!chromeRuntimeId);
const onAvatarError = (event: Event) => {
  logger.error('Failed to fetch avatar', event);
  fallback.value = true;
};

defineProps({
  parentElement: {
    type: HTMLElement,
    required: true,
  },
});

const users = computed(() => {
  return Object.entries(userSettings.value).filter(
    ([key, value]) => value && key !== username.value && key !== defaultUser,
  );
});

const toOption = (
  key: string,
  icon: Component | string,
  label?: string,
): ArrayElement<DropdownProps['options']> => {
  return {
    label: label ?? i18n(key),
    key,
    icon: () => {
      if (typeof icon === 'string') {
        return h(NAvatar, { src: icon, size: 16, round: true });
      }
      return h(NIcon, null, { default: () => h(icon) });
    },
  };
};

const options = computed<DropdownProps['options']>(() => {
  const baseOptions: DropdownProps['options'] = [
    toOption('settings', IconCog),
    toOption('about', IconLightBulb),
    { type: 'divider', key: 'external-links' },
    toOption('trakt', IconExternalLink),
    { type: 'divider', key: 'session-divider' },
    toOption('login', IconAccountAdd),
    toOption('logout', IconLogOut),
  ];

  if (users.value.length) {
    return [
      ...users.value.map(([key, value]) =>
        toOption(
          `user-${key}`,
          (chromeRuntimeId && value?.user?.images?.avatar?.full) || IconAccount,
          key,
        ),
      ),
      { type: 'divider', key: 'users-divider' },
      ...baseOptions,
    ];
  }

  return baseOptions;
});

const { loadUser, logout } = useLogout();

const onSelect: DropdownProps['onSelect'] = async (key: string, { label }) => {
  switch (key) {
    case 'settings':
      return router.push(Route.Settings);
    case 'about':
      return router.push(Route.About);
    case 'trakt':
      return createTab({
        url: ExternaLinks.trakt[TraktService.isStaging ? 'staging' : 'production'],
      });
    case 'login':
      return TraktService.approve({ prompt: true });
    case 'logout':
      return logout();
    default:
      if (typeof label === 'string' && key.startsWith('user-')) {
        return loadUser(label);
      }
      logger.error('Unknown key:', key);
  }
};
</script>

<template>
  <NDropdown
    trigger="hover"
    :options="options"
    :to="parentElement"
    placement="bottom"
    size="small"
    class="settings-dropdown"
    @select="onSelect"
  >
    <NFlex justify="space-around" align="center" :wrap="false">
      <NEllipsis
        style="
          max-width: calc(100vw / 6 - 0.25rem - 3px - 1.75rem);
          margin-right: 1.75rem;
          margin-left: 0.5rem;
        "
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
        round
        size="small"
        color="transparent"
        style="position: absolute; top: 0.125rem; right: 0.5rem; scale: 0.8"
        :on-error="onAvatarError"
      />
      <NIcon v-else style="position: absolute; top: 0.4rem; right: 0.75rem" size="1.5em">
        <IconAccount />
      </NIcon>
    </NFlex>
  </NDropdown>
</template>

<style lang="scss">
.settings-dropdown {
  min-width: max(calc(100vw / 6), 8rem);
  max-width: 20rem;
  margin-top: 0.75rem;
  margin-right: -0.25rem;
  text-align: left;
}
</style>
