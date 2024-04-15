<script lang="ts" setup>
import { NAvatar, NButton, NCard, NFlex, NIcon } from 'naive-ui';

import { computed, ref } from 'vue';

import type { UserSetting } from '~/models/trakt-service.model';

import TextField from '~/components/common/typography/TextField.vue';
import IconAccount from '~/components/icons/IconAccount.vue';

import { ResolveExternalLinks } from '~/settings/external.links';
import { useLinksStore } from '~/stores/settings/links.store';
import { logger } from '~/stores/settings/log.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { useI18n } from '~/utils';
import { chromeRuntimeId } from '~/utils/browser/browser.utils';

const i18n = useI18n('settings', 'account');

const { userSetting } = useUserSettingsStoreRefs();

const fallback = ref<boolean>(!chromeRuntimeId);
const avatar = computed(() => {
  if (fallback.value) return '';
  return userSetting.value?.user?.images?.avatar?.full;
});

const user = computed<UserSetting['user'] | undefined>(() => {
  const _user = userSetting.value?.user;
  if (!_user) return undefined;
  return {
    ..._user,
    username: _user.username || '-',
    name: _user.name || '-',
  };
});

const limits = computed<UserSetting['limits']>(() => userSetting.value?.limits);

const joinDate = computed(() => {
  const _date = userSetting.value?.user?.joined_at;
  if (!_date) return '';
  return new Date(_date).toLocaleDateString();
});

const onAvatarError = (event: Event) => {
  logger.error('Failed to fetch avatar', event);
  fallback.value = true;
};

const { openTab } = useLinksStore();
const onClick = () => {
  if (!user.value?.username) return;
  openTab(ResolveExternalLinks.trakt.account(user.value.username));
};
</script>

<template>
  <NFlex vertical align="center">
    <NCard
      class="account-card"
      :style="{ '--n-border-color': 'var(--border-color)' }"
      hoverable
    >
      <NFlex align="center" size="large">
        <NButton text :disabled="!user?.username" @click="onClick">
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
            <IconAccount />
          </NIcon>
        </NButton>

        <NFlex class="names" size="large" :wrap="false">
          <NFlex vertical class="column-1" justify="center">
            <TextField
              :label="i18n('username')"
              :value="user?.username"
              grow
              label-width="4.5rem"
            />
            <TextField
              :label="i18n('display')"
              :value="user?.name"
              grow
              label-width="4.5rem"
            />
            <TextField :label="i18n('joined')" :value="joinDate" label-width="4.5rem" />
          </NFlex>
          <NFlex vertical class="column-2" justify="center">
            <TextField
              :label="i18n('private')"
              :value="user?.private"
              label-width="3.25rem"
            />
            <TextField :label="i18n('vip')" :value="user?.vip" label-width="3.25rem" />
          </NFlex>
        </NFlex>
      </NFlex>
    </NCard>

    <NCard
      v-if="user?.location || user?.about"
      class="account-card"
      :style="{ '--n-border-color': 'var(--border-color)' }"
    >
      <NFlex vertical class="bio">
        <TextField
          :label="i18n('location')"
          :value="user?.location"
          label-width="3.25rem"
        />
        <TextField
          :label="i18n('about')"
          :value="user?.about"
          label-width="3.25rem"
          pre
        />
      </NFlex>
    </NCard>

    <NCard class="account-card" :style="{ '--n-border-color': 'var(--border-color)' }">
      <NFlex class="limits" size="large">
        <TextField
          :label="i18n('watchlist_max')"
          :value="limits?.watchlist?.item_count"
        />
        <TextField
          :label="i18n('recommendations_max')"
          :value="limits?.recommendations?.item_count"
          grow
        />
        <TextField
          :label="i18n('favorites_max')"
          :value="limits?.favorites?.item_count"
        />
        <TextField :label="i18n('user_lists_maximum')" :value="limits?.list?.count" />
        <TextField
          :label="i18n('user_lists_max_items')"
          :value="limits?.list?.item_count"
        />
      </NFlex>
    </NCard>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.account-card {
  --border-color: var(--white-10);

  background: var(--bg-black-soft);

  &:hover {
    --border-color: var(--white-15);
  }

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .avatar {
    --n-avatar-size-override: 8rem;

    flex: 0 0 auto;
    overflow: hidden;
    background: var(--bg-black-softer);
    border-radius: 50%;
    transition: box-shadow 0.5s var(--n-bezier);

    &:hover {
      box-shadow: var(--image-box-shadow);
    }
  }

  .names {
    flex: 1 1 auto;
    max-width: calc(100% - 128px - 2rem); // 100% - image - (margin + gap)
    margin-left: 1rem;

    .column-1 {
      flex: 1 1 auto;
    }

    .column-2 {
      flex: 1 0 auto;
      margin-left: 1rem;
    }
  }
}

.limits {
  :deep(.detail) {
    min-width: 31%;
  }
}
</style>
