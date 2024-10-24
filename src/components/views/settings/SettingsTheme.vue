<script lang="ts" setup>
import { NSwitch } from 'naive-ui';

import ColorPicker from '~/components/common/buttons/ColorPicker.vue';
import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { Brand, useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'theme');

const { brand, themeColorMain, themeColorDark, themeColorDarker, themeColorBackground } =
  useExtensionSettingsStoreRefs();

const toggleBrand = () => {
  brand.value = brand.value === Brand.New ? Brand.Old : Brand.New;
};
</script>

<template>
  <div class="theme-container">
    <!--  Brand  -->
    <SettingsFormItem :label="i18n('label_brand')">
      <NSwitch
        class="form-switch"
        :value="brand === Brand.New"
        @update:value="toggleBrand()"
      >
        <template #checked>{{ i18n('new', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('old', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <!--  Background color  -->
    <SettingsFormItem :label="i18n('label_background_color')">
      <ColorPicker v-model="themeColorBackground" fallback="transparent" />
    </SettingsFormItem>

    <!--  Theme color  -->
    <SettingsFormItem :label="i18n('label_primary_color')">
      <ColorPicker v-model="themeColorMain" border="var(--trakt-color)" />
    </SettingsFormItem>

    <!--  Secondary color   -->
    <SettingsFormItem :label="i18n('label_secondary_color')">
      <ColorPicker v-model="themeColorDark" border="var(--trakt-color-dark)" />
    </SettingsFormItem>

    <!--  Tertiary color  -->
    <SettingsFormItem :label="i18n('label_tertiary_color')">
      <ColorPicker v-model="themeColorDarker" border="var(--trakt-color-darker)" />
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.theme-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-switch {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    min-width: 5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
