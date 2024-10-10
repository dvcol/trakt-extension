<script setup lang="ts">
import { NIcon, NSelect, NTooltip } from 'naive-ui';

import { computed, defineProps, onMounted, type PropType, ref, toRefs, watch } from 'vue';

import type { TooltipProps } from 'naive-ui';

import IconChevron from '~/components/icons/IconChevronDownSmall.vue';
import IconPage from '~/components/icons/IconPage.vue';
import IconPageDouble from '~/components/icons/IconPageDouble.vue';

import { pageSizeOptions } from '~/models/page-size.model';
import { useI18n } from '~/utils/i18n.utils';

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
  disabled: {
    type: Boolean,
    required: false,
  },
  placement: {
    type: String as PropType<TooltipProps['placement']>,
    required: false,
    default: 'bottom',
  },
});

const emit = defineEmits<{
  (e: 'update:pageSize', value: number): void;
}>();

const { pageSize } = toRefs(props);
const innerValue = ref(pageSize.value);

onMounted(() => {
  watch(innerValue, () => emit('update:pageSize', innerValue.value));
});

const open = ref(false);

const pageIcon = computed(() => (pageSize.value > 200 ? IconPageDouble : IconPage));
</script>

<template>
  <NTooltip
    class="page-size-tooltip"
    :disabled="open"
    :show-arrow="false"
    :placement="placement"
    :delay="300"
    trigger="hover"
    :to="parentElement"
  >
    <span> {{ i18n('page_size') }} </span>
    <template #trigger>
      <NSelect
        v-model:value="innerValue"
        v-model:show="open"
        class="page-select"
        :options="pageSizeOptions"
        :to="parentElement"
        :disabled="disabled"
      >
        <template #arrow>
          <NIcon :component="open ? IconChevron : pageIcon" />
        </template>
      </NSelect>
    </template>
  </NTooltip>
</template>

<style scoped lang="scss">
.page-select {
  flex: 0 0 5rem;
}
</style>

<style lang="scss">
.page-size-tooltip.page-size-tooltip {
  margin-top: 12px;
}
</style>
