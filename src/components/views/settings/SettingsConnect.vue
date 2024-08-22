<script lang="ts" setup>
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NAvatar, NButton, NCard, NFlex, NIcon } from 'naive-ui';

import { computed, ref, watch } from 'vue';

import TextField from '~/components/common/typography/TextField.vue';
import IconLogIn from '~/components/icons/IconLogIn.vue';
import IconLogOut from '~/components/icons/IconLogOut.vue';
import IconSimkl from '~/components/icons/IconSimkl.vue';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useSimklStore, useSimklStoreRefs } from '~/stores/data/simkl.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { defaultUser } from '~/stores/settings/user.store';
import { useI18n } from '~/utils/i18n.utils';
import { useWatchActivated } from '~/utils/watching.utils';

const i18n = useI18n('settings', 'connect');

const { userSetting, userSettingLoading } = useSimklStoreRefs();

const fallback = ref<boolean>(!chromeRuntimeId);
const avatar = computed(() => {
  if (fallback.value) return '';
  return userSetting.value?.user?.avatar;
});

const joined = computed(() => {
  if (!userSetting.value?.user?.joined_at) return '-';
  const date = new Date(userSetting.value?.user?.joined_at);
  return date.toLocaleDateString();
});

const name = computed(() => userSetting.value?.user?.name ?? '-');
const bio = computed(() => userSetting.value?.user?.bio ?? '-');

const onAvatarError = (event: Event) => {
  Logger.error('Failed to fetch avatar', event);
  fallback.value = true;
};

const { openTab } = useLinksStore();
const onClick = () => openTab(ResolveExternalLinks.simkl.settings);

const { isSimklAuthenticated, user } = useAuthSettingsStoreRefs();
const loginLogout = () => {
  if (isSimklAuthenticated.value) return TraktService.simkl.logout(user.value);
  return TraktService.simkl.authorize();
};

const { fetchUserSettings } = useSimklStore();
useWatchActivated(
  watch(
    user,
    async _user => {
      if (!_user || _user === defaultUser) return;
      if (!isSimklAuthenticated.value) return;
      await fetchUserSettings(_user);
    },
    {
      immediate: true,
    },
  ),
);
</script>

<template>
  <NFlex vertical align="center">
    <NCard
      class="account-card"
      :style="{ '--n-border-color': 'var(--border-color)' }"
      hoverable
    >
      <NFlex align="center" size="large" :wrap="false">
        <NButton text @click="onClick">
          <NAvatar
            v-if="avatar"
            :src="avatar"
            class="avatar"
            round
            size="large"
            color="transparent"
            :on-error="onAvatarError"
          />
          <NIcon v-else class="avatar" size="8rem" round>
            <IconSimkl color="white" />
          </NIcon>
        </NButton>

        <NFlex class="names" size="large" vertical wrap>
          <NFlex class="flex-auto" justify="center">
            <TextField
              :label="i18n('username')"
              :value="name"
              :loading="userSettingLoading"
              label-width="4.5rem"
              grow
            />
            <TextField
              :label="i18n('joined')"
              :value="joined"
              :loading="userSettingLoading"
              label-width="auto"
              grow
            />
          </NFlex>
          <NFlex justify="center">
            <TextField
              :label="i18n('bio')"
              :value="bio"
              :loading="userSettingLoading"
              label-width="4.5rem"
              value-width="auto"
              grow
            />
          </NFlex>
        </NFlex>
      </NFlex>
    </NCard>
  </NFlex>

  <!--   Footer   -->
  <NFlex class="footer" align="center" justify="center">
    <NButton
      secondary
      :type="isSimklAuthenticated ? 'error' : 'success'"
      @click="loginLogout"
    >
      <span>{{
        i18n(isSimklAuthenticated ? 'logout' : 'login', 'common', 'button')
      }}</span>
      <template #icon>
        <NIcon :component="isSimklAuthenticated ? IconLogOut : IconLogIn" />
      </template>
    </NButton>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.account-card {
  --border-color: var(--white-10);

  margin-bottom: 1.5rem;
  background: var(--bg-black-soft);

  &:active,
  &:focus-within,
  &:hover {
    --border-color: var(--white-15);
  }

  .avatar {
    --n-avatar-size-override: 8rem;

    flex: 0 0 auto;
    margin-right: 1rem;
    overflow: hidden;
    background: var(--bg-black-softer);
    border-radius: 50%;
    transition: box-shadow 0.5s var(--n-bezier);

    &:active,
    &:focus-within,
    &:hover {
      box-shadow: var(--image-box-shadow);
    }
  }

  .flex-auto {
    flex: 1 1 auto;
  }
}

.footer {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
</style>
