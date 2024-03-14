<script setup lang="ts">
import { NSelect, NTooltip, type SelectOption } from 'naive-ui';

import { onMounted, ref, toRefs, watch } from 'vue';

import { useI18n } from '~/utils';

const i18n = useI18n('navbar');

const props = defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:pageSize', value: number): void;
}>();

const pageSizeOptions: SelectOption[] = [
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
  { label: '1000', value: 1000 },
];

const { pageSize } = toRefs(props);
const innerValue = ref(pageSize.value);

onMounted(() => {
  watch(innerValue, () => emit('update:pageSize', innerValue.value));
});
</script>

<template>
  <NTooltip
    :show-arrow="false"
    placement="bottom"
    :delay="1000"
    trigger="hover"
    :to="parentElement"
  >
    <span> {{ i18n('page_size') }} </span>
    <template #trigger>
      <NSelect
        v-model:value="innerValue"
        class="page-select"
        :options="pageSizeOptions"
        :to="parentElement"
      />
    </template>
  </NTooltip>
</template>

<style scoped lang="scss">
.page-select {
  flex: 0 0 5rem;
}
</style>
