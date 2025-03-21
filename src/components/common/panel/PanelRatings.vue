<script setup lang="ts">
import { NDropdown, NFlex, NIcon } from 'naive-ui';

import { computed, h, type PropType, ref, toRefs } from 'vue';

import type { DropdownOption } from 'naive-ui';

import type { RatingItem } from '~/models/rating.model';

import PanelRating from '~/components/common/panel/PanelRating.vue';
import IconStarFilledHalf from '~/components/icons/IconStarFilledHalf.vue';
import { getIconFromSource } from '~/models/source.model';
import { useExtensionSettingsStoreRefs } from '~/stores/settings/extension.store';

const props = defineProps({
  ratings: {
    type: Array as PropType<RatingItem[]>,
    required: false,
  },
});

const { ratings } = toRefs(props);

const { brand } = useExtensionSettingsStoreRefs();
const getIcon = (icon: RatingItem['icon']): DropdownOption['icon'] => {
  if (!icon) return undefined;
  return () =>
    h(NIcon, {
      style: { marginRight: '-0.25rem' },
      component:
        typeof icon === 'string'
          ? getIconFromSource(icon, brand.value, IconStarFilledHalf)
          : icon,
    });
};

const options = computed<DropdownOption[]>(() => {
  if (!ratings?.value) return [];
  return ratings.value.map(rating => ({
    label: rating.name,
    key: rating.name,
    icon: getIcon(rating.icon),
  }));
});

const activeKey = ref();
const onSelect = (key: number, option: DropdownOption) => {
  activeKey.value = key;
};

const activeRating = computed(
  () =>
    ratings?.value?.find(r => r.name === activeKey.value) ??
    ratings?.value?.at(0) ?? { name: undefined, rating: {} },
);

const hasMoreThanOneRating = computed(() => (ratings?.value?.length ?? 0) > 1);

const label = computed(() => {
  if (hasMoreThanOneRating.value) return activeRating.value.name;
  return undefined;
});
</script>

<template>
  <NFlex class="panel-ratings-container" justify="center" vertical>
    <NDropdown
      :options="options"
      placement="bottom"
      :disabled="!hasMoreThanOneRating"
      :style="{
        '--custom-bg-color': 'var(--bg-black-soft-80)',
        '--custom-bg-color-hover': 'var(--bg-black-soft-90)',
      }"
      @select="onSelect"
    >
      <PanelRating v-bind="activeRating.rating" :label="label" />
    </NDropdown>
  </NFlex>
</template>

<style scoped lang="scss">
.panel-ratings-container {
  flex: 1 0 6rem;
  max-width: 24rem;
  padding-bottom: 1.5rem;
}
</style>
