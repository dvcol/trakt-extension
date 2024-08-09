<script lang="ts" setup>
import { CacheRetention } from '@dvcol/common-utils/common/cache';
import { NButton, NIcon, NSelect } from 'naive-ui';

import { reactive, ref } from 'vue';

import IconRestore from '~/components/icons/IconRestore.vue';
import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useImageStore } from '~/stores/data/image.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'cache');

const { traktCacheRetention, tmdbCacheRetention } = useExtensionSettingsStoreRefs();

const cacheOptions = Object.entries(CacheRetention).map(([key, value]) => ({
  label: key,
  value,
}));

const loading = reactive<Record<string | number, boolean>>({});

const onClick = async (fn: () => unknown, index: number) => {
  loading[index] = true;

  try {
    await fn();
    NotificationService.message.success(i18n('evict_success'));
  } catch (error) {
    Logger.error('Failed to evict cache.', error);
    NotificationService.error(i18n('evict_failure'), error);
  } finally {
    loading[index] = false;
  }
};

const { clearState: clearImageStore } = useImageStore();

const evictScopes = [
  {
    label: i18n('evict_images'),
    click: () => Promise.all([clearImageStore(), TraktService.evict.images()]),
  },
  {
    label: i18n('evict_progress'),
    click: () =>
      Promise.all([
        TraktService.evict.progress.movie(),
        TraktService.evict.progress.show(),
        TraktService.evict.collection.movie(),
        TraktService.evict.collection.show(),
      ]),
  },
  { label: i18n('evict_calendar'), click: TraktService.evict.calendar },
  { label: i18n('evict_releases'), click: TraktService.evict.releases },
  { label: i18n('evict_history'), click: TraktService.evict.history },
  {
    label: i18n('evict_lists'),
    click: () =>
      Promise.all([
        TraktService.evict.watchlist(),
        TraktService.evict.favorites(),
        TraktService.evict.list(),
        TraktService.evict.lists(),
        TraktService.evict.collection.movie(),
        TraktService.evict.collection.show(),
      ]),
  },
  { label: i18n('evict_search'), click: TraktService.evict.search },
  { label: i18n('evict_shows'), click: TraktService.evict.shows },
  { label: i18n('evict_seasons'), click: TraktService.evict.seasons },
  { label: i18n('evict_episodes'), click: TraktService.evict.episodes },
  { label: i18n('evict_movies'), click: TraktService.evict.movies },
  { label: i18n('evict_people'), click: TraktService.evict.people },
  { label: i18n('evict_ratings'), click: TraktService.evict.ratings },
  {
    label: i18n('evict_trakt'),
    click: TraktService.evict.trakt,
  },
  {
    label: i18n('evict_tmdb'),
    click: TraktService.evict.tmdb,
  },
  {
    label: i18n('evict_all'),
    click: () =>
      Promise.all([
        clearImageStore(),
        TraktService.evict.trakt(),
        TraktService.evict.tmdb(),
      ]),
  },
].map((item, index) => ({ ...item, click: () => onClick(item.click, index) }));

const container = ref();
</script>

<template>
  <div ref="container" class="cache-container">
    <!--  Retention  -->
    <SettingsFormItem :label="i18n('label_retention_trakt')">
      <NSelect
        v-model:value="traktCacheRetention"
        class="form-select"
        :to="container"
        :options="cacheOptions"
      />
    </SettingsFormItem>

    <SettingsFormItem :label="i18n('label_retention_images')">
      <NSelect
        v-model:value="tmdbCacheRetention"
        class="form-select"
        :to="container"
        :options="cacheOptions"
      />
    </SettingsFormItem>

    <!--  Cache evict  -->
    <SettingsFormItem
      v-for="({ label, click }, index) in evictScopes"
      :key="index"
      :label="label"
    >
      <NButton
        class="evict-button"
        type="warning"
        secondary
        :loading="loading[index]"
        @click="click"
      >
        <span>{{ i18n('evict', 'common', 'button') }}</span>
        <template #icon>
          <NIcon :component="IconRestore" />
        </template>
      </NButton>
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.cache-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.evict-button {
  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }
}

.form-select {
  min-width: 10rem;
}
</style>
