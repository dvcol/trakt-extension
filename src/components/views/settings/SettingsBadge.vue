<script lang="ts" setup>
import { toSnakeCase } from '@dvcol/common-utils/common/string';
import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { NSelect, NSwitch } from 'naive-ui';

import { computed, ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { BadgeMode, useBadgeStoreRefs } from '~/stores/settings/badge.store';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'badge');

const { enableBadge, badgeMode } = useBadgeStoreRefs();

const { isProgressEnabled } = useExtensionSettingsStoreRefs();

const options = computed(() =>
  Object.entries(BadgeMode).map(([key, value]) => ({
    label: i18n(toSnakeCase(key), 'common', 'badge', 'mode'),
    value,
    disabled: !isProgressEnabled.value && value === BadgeMode.Progress,
  })),
);

const container = ref();
</script>

<template>
  <div ref="container" class="badge-container">
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

    <!--  Badge Mode  -->
    <SettingsFormItem :label="i18n('label_badge_mode')">
      <NSelect
        v-model:value="badgeMode"
        class="form-select"
        :to="container"
        :options="options"
        :disabled="!enableBadge"
      />
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.badge-container {
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
