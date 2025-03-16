<script lang="ts" setup>
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NSwitch } from 'naive-ui';

import { ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { IconAction } from '~/models/icon-action';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'icon');

const { iconAction } = useExtensionSettingsStoreRefs();

const toggleIconAction = (isPanel = iconAction.value === IconAction.Panel) => {
  iconAction.value = isPanel ? IconAction.Popup : IconAction.Panel;
};

const container = ref();
</script>

<template>
  <div ref="container" class="icon-action-container">
    <!--  Enable  -->
    <SettingsFormItem :label="i18n('label_toggle')">
      <NSwitch
        :value="iconAction === IconAction.Panel"
        class="form-switch"
        :disabled="!chromeRuntimeId"
        @update:value="() => toggleIconAction()"
      >
        <template #checked>{{ i18n('label_toggle_panel') }}</template>
        <template #unchecked>{{ i18n('label_toggle_popup') }}</template>
      </NSwitch>
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.icon-action-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-select {
  min-width: 8rem;
}

.form-switch {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  min-width: 5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
}
</style>
