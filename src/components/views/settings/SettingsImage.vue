<script lang="ts" setup>
import { NFlex, NSelect, NText } from 'naive-ui';

import { computed, ref } from 'vue';

import type { Route } from '~/models/router.model';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import {
  type ImageFormat,
  type ImageType,
  useExtensionSettingsStore,
  useExtensionSettingsStoreRefs,
} from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'images');

const { enabledTabs, imageType, imageFormat } = useExtensionSettingsStoreRefs();
const { setImageType, setImageFormat } = useExtensionSettingsStore();

const typeOptions = computed<{ label: string; value: ImageType }[]>(() => [
  { label: i18n('default', 'common', 'image', 'type'), value: 'default' },
  { label: i18n('show', 'common', 'image', 'type'), value: 'show' },
]);

const formatOptions = computed<{ label: string; value: ImageFormat }[]>(() => [
  { label: i18n('poster', 'common', 'image', 'format'), value: 'poster' },
  { label: i18n('backdrop', 'common', 'image', 'format'), value: 'backdrop' },
]);

const toggleImageType = (tab: Route, current?: ImageType) => {
  setImageType(tab, current === 'default' ? 'show' : 'default');
};

const toggleImageFormat = (tab: Route, current?: ImageFormat) => {
  setImageFormat(tab, current === 'poster' ? 'backdrop' : 'poster');
};

const container = ref();
</script>

<template>
  <div ref="container" class="image-container">
    <NText class="description" tag="p">{{ i18n('image_format_type') }}</NText>
    <NFlex
      v-for="[tab] in enabledTabs"
      :key="tab"
      class="form-row"
      align="center"
      justify="space-between"
    >
      <NText class="form-header" tag="h3">{{ i18n(tab, 'route') }}</NText>
      <NFlex class="form-selects" align="center" justify="flex-end">
        <!--  Image type  -->
        <SettingsFormItem class="form-item" vertical>
          <NSelect
            class="form-select"
            :value="imageType[tab]"
            :to="container"
            :options="typeOptions"
            @update:value="toggleImageType(tab, imageType[tab])"
          />
        </SettingsFormItem>

        <!--  Image format  -->
        <SettingsFormItem class="form-item" vertical>
          <NSelect
            class="form-select"
            :value="imageFormat[tab]"
            :to="container"
            :options="formatOptions"
            @update:value="toggleImageFormat(tab, imageFormat[tab])"
          />
        </SettingsFormItem>
      </NFlex>
    </NFlex>
  </div>
</template>

<style lang="scss" scoped>
.image-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-row {
    padding: 0.25rem 1rem;
    background: var(--bg-black-soft);
    border: 1px solid var(--white-10);
    border-radius: 0.5rem;
    transition:
      background 0.3s var(--n-bezier),
      border 0.3s var(--n-bezier);

    &:active,
    &:focus-within,
    &:hover {
      border-color: var(--white-15);
    }
  }

  .form-selects {
    flex: 1 1 70%;
  }

  .form-select,
  .form-item {
    flex: 0 0 7rem;
    padding: 0 0.25rem;
  }

  .form-header {
    flex: 0 1 20%;
  }

  .description {
    margin: 0 0 0 0.25rem;
    color: var(--white-70);
    font-weight: 600;
    font-size: 1rem;
    white-space: pre-line;
  }
}
</style>
