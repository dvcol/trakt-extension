<script lang="ts" setup>
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NAvatar, NButton, NCard, NFlex, NIcon, NSwitch } from 'naive-ui';

import { computed, ref, Transition, watch } from 'vue';

import TextField from '~/components/common/typography/TextField.vue';
import IconLogIn from '~/components/icons/IconLogIn.vue';
import IconLogOut from '~/components/icons/IconLogOut.vue';
import IconSimkl from '~/components/icons/IconSimkl.vue';
import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { openLink } from '~/stores/composable/use-links';
import { useSimklStore, useSimklStoreRefs } from '~/stores/data/simkl.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { defaultUser } from '~/stores/settings/user.store';
import { useI18n } from '~/utils/i18n.utils';
import { useWatchActivated } from '~/utils/vue.utils';

const i18n = useI18n('settings', 'connect');

const { userSetting, userSettingLoading, simklEnabled } = useSimklStoreRefs();

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

const onClick = () => openLink(ResolveExternalLinks.simkl.settings);

const { isSimklAuthenticated, user } = useAuthSettingsStoreRefs();
const loginLogout = () => {
  if (isSimklAuthenticated.value) return TraktService.simkl.logout(user.value);
  return TraktService.simkl.authorize();
};

const { fetchUserSettings } = useSimklStore();
useWatchActivated(
  watch(
    [user, isSimklAuthenticated],
    async ([_user, _authenticated]) => {
      if (!_user || _user === defaultUser) return;
      if (!_authenticated) return;
      await fetchUserSettings(_user);
    },
    {
      immediate: true,
    },
  ),
);
</script>

<template>
  <NFlex align="center">
    <SettingsFormItem :label="i18n('label_enable')" class="flex-auto">
      <NSwitch
        v-model:value="simklEnabled"
        :disabled="!chromeRuntimeId"
        class="form-switch"
      >
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>
    <NCard
      class="account-card"
      :style="{ '--n-border-color': 'var(--border-color)' }"
      hoverable
    >
      <NFlex align="center" size="large" wrap>
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

        <Transition name="scale" mode="out-in">
          <NFlex
            v-if="isSimklAuthenticated"
            class="flex-auto names"
            size="large"
            vertical
            wrap
          >
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
          <NFlex v-else class="flex-auto names" size="large" vertical wrap>
            <NFlex class="logged-out flex-auto" justify="center">
              <NButton
                secondary
                type="success"
                :disabled="!simklEnabled"
                @click="loginLogout"
              >
                <span>{{ i18n('login', 'common', 'button') }}</span>
                <template #icon>
                  <NIcon :component="IconLogIn" />
                </template>
              </NButton>
            </NFlex>
          </NFlex>
        </Transition>
      </NFlex>
    </NCard>
  </NFlex>

  <!--   Footer   -->
  <NFlex
    class="footer"
    :class="{ show: isSimklAuthenticated }"
    align="center"
    justify="center"
  >
    <NButton secondary :type="'error'" @click="loginLogout">
      <span>{{ i18n('logout', 'common', 'button') }}</span>
      <template #icon>
        <NIcon :component="IconLogOut" />
      </template>
    </NButton>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/transition' as transition;
@include transition.scale($transition: 0.375s var(--n-bezier));

.account-card {
  --border-color: var(--white-10);

  flex: 1 0 100%;
  margin-bottom: 1.5rem;
  background: var(--bg-black-soft);

  &:active,
  &:focus-within,
  &:hover {
    --border-color: var(--white-15);
  }

  .avatar {
    @include mixin.hover-box-shadow;

    --n-avatar-size-override: 8rem;

    flex: 0 0 auto;
    margin-right: 1rem;
    overflow: hidden;
    background: var(--bg-black-softer);
    border-radius: 50%;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .logged-out {
    margin-right: 10rem;
  }
}

.form-switch {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  min-width: 5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
}

.footer {
  max-height: 0;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.75s var(--n-bezier),
    opacity 0.75s var(--n-bezier);

  &.show {
    max-height: 6rem;
    opacity: 1;
  }
}
</style>
