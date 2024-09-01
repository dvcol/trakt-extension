<script lang="ts" setup>
import { formatTime } from '@dvcol/common-utils/common/format';
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NAvatar, NButton, NCard, NFlex, NIcon } from 'naive-ui';

import { computed, ref, watch } from 'vue';

import type { UserSetting } from '~/models/trakt-service.model';

import TextField from '~/components/common/typography/TextField.vue';
import IconAccount from '~/components/icons/IconAccount.vue';

import IconLogOut from '~/components/icons/IconLogOut.vue';
import { Logger } from '~/services/logger.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useLogout } from '~/stores/settings/use-logout';
import {
  defaultUser,
  useUserSettingsStore,
  useUserSettingsStoreRefs,
} from '~/stores/settings/user.store';

import { useI18n } from '~/utils/i18n.utils';
import { useWatchActivated } from '~/utils/watching.utils';

const i18n = useI18n('settings', 'account');

const { fetchUserStats } = useUserSettingsStore();
const { userSetting, userStat, userSettingLoading, userStatLoading } =
  useUserSettingsStoreRefs();
const { logout } = useLogout();

const fallback = ref<boolean>(!chromeRuntimeId);
const avatar = computed(() => {
  if (fallback.value) return '';
  return userSetting.value?.user?.images?.avatar?.full;
});

const userData = computed<UserSetting['user'] | undefined>(() => {
  const _user = userSetting.value?.user;
  if (!_user) return undefined;
  return {
    ..._user,
    username: _user.username || '-',
    name: _user.name || '-',
  };
});

const limits = computed<UserSetting['limits']>(() => userSetting.value?.limits);
const episodeMinutes = computed(() => userStat.value?.episodes?.minutes);
const episodeWatchTime = computed(() => {
  if (!episodeMinutes.value) return '-';
  return formatTime(episodeMinutes.value * 60, 'ymd').toString();
});
const movieMinutes = computed(() => userStat.value?.movies?.minutes);
const movieWatchTime = computed(() => {
  if (!movieMinutes.value) return '-';
  return formatTime(movieMinutes.value * 60, 'ymd').toString();
});
const totalWatchTime = computed(() => {
  const _episode = userStat.value?.episodes?.minutes;
  const _movie = userStat.value?.movies?.minutes;
  if (!_episode && !_movie) return '-';
  const total = (_episode ?? 0) + (_movie ?? 0);
  return formatTime(total * 60, 'ymd').toString();
});

const joinDate = computed(() => {
  const _date = userSetting.value?.user?.joined_at;
  if (!_date) return '';
  return new Date(_date).toLocaleDateString();
});

const onAvatarError = (event: Event) => {
  Logger.error('Failed to fetch avatar', event);
  fallback.value = true;
};

const { openTab } = useLinksStore();
const onClick = () => {
  if (!userData.value?.username) return;
  openTab(ResolveExternalLinks.trakt.account(userData.value.username));
};

const { user } = useAuthSettingsStoreRefs();
useWatchActivated(
  watch(
    user,
    async _user => {
      if (!_user || _user === defaultUser) return;
      await fetchUserStats(_user);
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
      <NFlex align="center" size="large">
        <NButton text :disabled="!userData?.username" @click="onClick">
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

        <NFlex class="names" size="large" wrap>
          <NFlex vertical class="flex-column" justify="center">
            <TextField
              :label="i18n('username')"
              :value="userData?.username"
              :loading="userSettingLoading"
              grow
              label-width="4.5rem"
            />
            <TextField
              :label="i18n('display')"
              :value="userData?.name"
              :loading="userSettingLoading"
              grow
              label-width="4.5rem"
            />
            <TextField
              :label="i18n('joined')"
              :value="joinDate"
              :loading="userSettingLoading"
              label-width="4.5rem"
            />
          </NFlex>
          <NFlex vertical class="flex-column" justify="center">
            <TextField
              :label="i18n('private')"
              :value="userData?.private"
              :loading="userSettingLoading"
              label-width="3.25rem"
            />
            <TextField
              :label="i18n('vip')"
              :value="userData?.vip"
              :loading="userSettingLoading"
              label-width="3.25rem"
            />
          </NFlex>
        </NFlex>
      </NFlex>
    </NCard>

    <NCard
      v-if="userData?.location || userData?.about"
      class="account-card"
      :style="{ '--n-border-color': 'var(--border-color)' }"
    >
      <NFlex vertical class="bio">
        <TextField
          :label="i18n('location')"
          :value="userData?.location"
          :loading="userSettingLoading"
          label-width="3.25rem"
        />
        <TextField
          :label="i18n('about')"
          :value="userData?.about"
          :loading="userSettingLoading"
          label-width="3.25rem"
          pre
        />
      </NFlex>
    </NCard>

    <NCard class="account-card" :style="{ '--n-border-color': 'var(--border-color)' }">
      <NFlex class="limit-card" size="large" wrap>
        <NFlex vertical class="flex-column" style="flex-basis: 16rem">
          <TextField
            :label="i18n('user_lists_maximum')"
            :value="limits?.list?.count"
            :loading="userSettingLoading"
            label-width="9.75rem"
          />
          <TextField
            :label="i18n('user_lists_max_items')"
            :value="limits?.list?.item_count"
            :loading="userSettingLoading"
            label-width="9.75rem"
          />
        </NFlex>
        <NFlex vertical class="flex-column" style="flex-basis: 12rem">
          <TextField
            :label="i18n('watchlist_max')"
            :value="limits?.watchlist?.item_count"
            :loading="userSettingLoading"
          />
          <TextField
            :label="i18n('favorites_max')"
            :value="limits?.favorites?.item_count"
            :loading="userSettingLoading"
          />
        </NFlex>
        <NFlex vertical class="flex-column">
          <TextField
            :label="i18n('recommendations_max')"
            :value="limits?.recommendations?.item_count"
            :loading="userSettingLoading"
            label-width="9.75rem"
            grow
          />
        </NFlex>
      </NFlex>
    </NCard>
  </NFlex>

  <NCard class="account-card" :style="{ '--n-border-color': 'var(--border-color)' }">
    <NFlex class="stats-card" size="large" vertical wrap>
      <NFlex class="flex-auto" wrap>
        <TextField
          :label="i18n('user_stats_movies_watched')"
          :value="userStat?.movies?.watched ?? '-'"
          :loading="userStatLoading"
          label-width="8rem"
        />

        <TextField
          :label="i18n('user_stats_movies_time')"
          :title="
            movieMinutes ? `${ movieMinutes } ${ i18n('user_stats_minutes') }` : undefined
          "
          :value="movieWatchTime"
          :loading="userStatLoading"
          label-width="8rem"
        />
      </NFlex>
      <NFlex class="flex-auto" wrap>
        <TextField
          :label="i18n('user_stats_episodes_watched')"
          :value="userStat?.episodes?.watched ?? '-'"
          :loading="userStatLoading"
          label-width="8rem"
        />
        <TextField
          :label="i18n('user_stats_episodes_time')"
          :title="
            episodeMinutes ? `${ episodeMinutes } ${ i18n('user_stats_minutes') }` : undefined
          "
          :value="episodeWatchTime"
          :loading="userStatLoading"
          label-width="8rem"
        />
      </NFlex>

      <NFlex class="flex-auto" wrap>
        <TextField
          :label="i18n('user_stats_shows_watched')"
          :value="userStat?.shows?.watched ?? '-'"
          :loading="userStatLoading"
          label-width="8rem"
        />
        <TextField
          :label="i18n('user_stats_total_time')"
          :value="totalWatchTime"
          :loading="userStatLoading"
          label-width="8rem"
        />
      </NFlex>
    </NFlex>
  </NCard>

  <NCard class="account-card" :style="{ '--n-border-color': 'var(--border-color)' }">
    <NFlex class="stats-card" size="large" vertical wrap>
      <NFlex class="flex-auto" wrap>
        <TextField
          :label="i18n('user_stats_episodes_collected')"
          :value="userStat?.episodes?.collected ?? '-'"
          :loading="userStatLoading"
          label-width="8rem"
        />
        <TextField
          :label="i18n('user_stats_movies_collected')"
          :value="userStat?.movies?.collected ?? '-'"
          :loading="userStatLoading"
          label-width="8rem"
        />
      </NFlex>
    </NFlex>
  </NCard>

  <NCard class="account-card" :style="{ '--n-border-color': 'var(--border-color)' }">
    <NFlex class="stats-card" size="large" vertical wrap>
      <NFlex class="flex-auto" wrap>
        <TextField
          :label="i18n('user_stats_show_ratings')"
          :value="userStat?.shows?.ratings"
          :loading="userStatLoading"
          label-width="8rem"
        />
        <TextField
          :label="i18n('user_stats_episodes_ratings')"
          :value="userStat?.episodes?.ratings"
          :loading="userStatLoading"
          label-width="8rem"
        />
      </NFlex>

      <NFlex class="flex-auto" wrap>
        <TextField
          :label="i18n('user_stats_movie_ratings')"
          :value="userStat?.movies?.ratings"
          :loading="userStatLoading"
          label-width="8rem"
        />
        <TextField
          :label="i18n('user_stats_ratings')"
          :value="userStat?.ratings?.total"
          :loading="userStatLoading"
          label-width="8rem"
        />
      </NFlex>
    </NFlex>
  </NCard>

  <!--   Footer   -->
  <NFlex class="footer" align="center" justify="center">
    <NButton secondary type="error" @click="logout()">
      <span>{{ i18n('logout', 'common', 'button') }}</span>
      <template #icon>
        <NIcon :component="IconLogOut" />
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
    @include mixin.hover-box-shadow;

    --n-avatar-size-override: 8rem;

    flex: 0 0 auto;
    margin-right: 1rem;
    overflow: hidden;
    background: var(--bg-black-softer);
    border-radius: 50%;
  }

  .names {
    flex: 1 1 auto;
    min-width: fit-content;
    max-width: calc(100% - 128px - 2rem); // 100% - image - (margin + gap)
  }

  %flex-auto {
    flex: 1 1 auto;
  }

  .flex-auto {
    @extend %flex-auto;
  }

  .flex-column {
    @extend %flex-auto;

    min-width: max-content;
    height: 100%;
  }
}

.limit-card,
.stats-card {
  overflow: auto;

  :deep(.detail) {
    min-width: max-content;
  }
}

.limit-card {
  :deep(.detail) {
    flex-basis: 31%;
  }
}

.stats-card {
  :deep(.detail) {
    min-width: max-content;
  }
}

.footer {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
</style>
