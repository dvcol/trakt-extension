<script lang="ts" setup>
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NSwitch } from 'naive-ui';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { useBadgeStoreRefs } from '~/stores/settings/badge.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'badge');

const { enableBadge } = useBadgeStoreRefs();
</script>

<template>
  <div class="badge-container">
    <!--  Enable  -->
    <SettingsFormItem :label="i18n('label_enable_badge')">
      <NSwitch
        v-model:value="enableBadge"
        class="form-switch"
        :disabled="!chromeRuntimeId"
      >
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.badge-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
