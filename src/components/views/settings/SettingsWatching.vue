<script lang="ts" setup>
import { NSelect, NSwitch } from 'naive-ui';

import { ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { PollingIntervals, useWatchingStoreRefs } from '~/stores/data/watching.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'watching');

const { polling, override } = useWatchingStoreRefs();

const toSnakeCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .slice(1);

const options = Object.entries(PollingIntervals).map(([key, value]) => ({
  label: i18n(`label_interval_${toSnakeCase(key)}`),
  value,
}));

const container = ref();
</script>

<template>
  <div ref="container" class="watching-container">
    <!--  Polling  -->
    <SettingsFormItem :label="i18n('label_polling_interval')">
      <NSelect
        v-model:value="polling"
        class="form-select"
        :to="container"
        :options="options"
      />
    </SettingsFormItem>

    <!--  Override  -->
    <SettingsFormItem :label="i18n('label_override')">
      <NSwitch v-model:value="override" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.watching-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-select {
  min-width: 10rem;
}
</style>
