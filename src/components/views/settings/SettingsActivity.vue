<script lang="ts" setup>
import { NSelect } from 'naive-ui';

import { ref } from 'vue';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { PollingIntervals } from '~/models/polling.model';
import { useActivityStoreRefs } from '~/stores/data/activity.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'activity');

const { polling } = useActivityStoreRefs();

const toSnakeCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .slice(1);

const options = Object.entries(PollingIntervals).map(([key, value]) => ({
  label: i18n(toSnakeCase(key), 'common', 'polling', 'interval'),
  value,
}));

const container = ref();
</script>

<template>
  <div ref="container" class="activity-container">
    <!--  Polling  -->
    <SettingsFormItem :label="i18n('label_polling_interval')">
      <NSelect
        v-model:value="polling"
        class="form-select"
        :to="container"
        :options="options"
      />
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.activity-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-select {
  min-width: 10rem;
}
</style>
