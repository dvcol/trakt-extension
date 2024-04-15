<script lang="ts" setup>
import { NSelect } from 'naive-ui';

import { ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { LogLevel, useLogStoreRefs } from '~/stores/settings/log.store';
import { useI18n } from '~/utils';

const i18n = useI18n('settings', 'logs');

const { logLevel } = useLogStoreRefs();

const options = Object.entries(LogLevel)
  .filter(([_, v]) => typeof v === 'number')
  .map(([key, value]) => ({
    label: key,
    value,
  }));

const container = ref();
</script>

<template>
  <div ref="container" class="logs-container">
    <SettingsFormItem :label="i18n('label_log_level')">
      <NSelect
        v-model:value="logLevel"
        class="form-select"
        :to="container"
        :options="options"
      />
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.logs-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-select {
  min-width: 10rem;
}
</style>
