<script setup lang="ts">
import { NDatePicker, NFlex, NIcon, NInput } from 'naive-ui';
import { defineProps } from 'vue';

import IconLoop from '~/components/icons/IconLoop.vue';

defineProps({
  parentElement: HTMLElement,
});
</script>

<template>
  <NFlex class="row" align="center" justify="center" :vertical="false">
    <NDatePicker
      class="picker"
      type="daterange"
      :to="parentElement"
      :default-value="[Date.now(), Date.now()]"
      placement="bottom"
      update-value-on-close
      close-on-select
      clearable
      :on-clear="() => console.log('clear')"
      :on-confirm="value => console.log('confirm', value)"
    />
    <NInput class="input" placeholder="Search" autosize clearable>
      <template #prefix>
        <NIcon :component="IconLoop" />
      </template>
    </NInput>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.row {
  width: 100%;

  .picker {
    flex: 0 1 48%;
  }

  .input {
    flex: 0 1 48%;
  }
}
</style>

<style lang="scss">
@use '~/styles/mixin' as mixin;

.n-date-panel {
  @include mixin.hover-background(rgb(0 0 0 / 80%), rgb(0 0 0 / 90%));

  margin-top: 12px;
  margin-left: -16px;
}
</style>
