<script lang="ts" setup>
import { NSwitch } from 'naive-ui';

import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import {
  useContextMenuStore,
  useContextMenuStoreRefs,
} from '~/stores/settings/context-menu.store';
import { useI18n } from '~/utils';

const i18n = useI18n('settings', 'menus');

const { enabledContextMenus } = useContextMenuStoreRefs();
const { toggleContextMenu } = useContextMenuStore();
</script>

<template>
  <div class="menus-container">
    <!--  Enable tabs  -->
    <SettingsFormItem
      v-for="[id, state] of enabledContextMenus"
      :key="id"
      :label="i18n(`label_menu__${ id }`)"
    >
      <NSwitch :value="state" class="form-switch" @update:value="toggleContextMenu(id)">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.menus-container {
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
