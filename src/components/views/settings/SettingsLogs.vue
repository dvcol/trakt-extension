<script lang="ts" setup>
import { NFormItem, NSelect } from 'naive-ui';

import { ref } from 'vue';

import { LogLevel, useLogStore } from '~/stores/settings/log.store';
import { useI18n } from '~/utils';

const i18n = useI18n('settings', 'logs');

const { logLevel } = useLogStore();

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
    <NFormItem class="form-row" :show-feedback="false" label-placement="left">
      <template #label>
        <span class="from-label">{{ i18n('label_log_level') }}</span>
      </template>
      <NSelect
        v-model:value="logLevel"
        class="form-select"
        :to="container"
        :options="options"
      />
    </NFormItem>
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

.from-label {
  color: var(--white-70);
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s var(--n-bezier);
}

.form-row {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  justify-content: space-between;

  &:hover {
    .from-label {
      color: var(--white-mute);
    }
  }
}
</style>
