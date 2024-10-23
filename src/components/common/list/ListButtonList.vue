<script setup lang="ts">
import { computed, type PropType, toRefs, watch } from 'vue';

import type { ButtonProps, IconProps } from 'naive-ui';

import ListButton from '~/components/common/list/ListButton.vue';
import IconList from '~/components/icons/IconList.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import { type ListScrollItem } from '~/models/list-scroll.model';
import {
  type AddOrRemoveListQuery,
  isListItemType,
  type ListEntity,
  ListType,
} from '~/models/list.model';
import { useListStore } from '~/stores/data/list.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'button', 'list');

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
    required: true,
  },
  list: {
    type: Object as PropType<ListEntity>,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  disableFetch: {
    type: Boolean,
    required: false,
  },
  buttonProps: {
    type: Object as PropType<ButtonProps>,
    required: false,
  },
  iconProps: {
    type: Object as PropType<IconProps>,
    required: false,
  },
});

const emit = defineEmits<{
  (
    e: 'onClick',
    payload: { query: AddOrRemoveListQuery; request: Promise<unknown> },
  ): void;
}>();

const { disabled, disableFetch, item, list } = toRefs(props);

const { isItemListLoading, addToOrRemoveFromList, isItemInList, fetchListItems } =
  useListStore();

const isLoading = computed(() => {
  if (!item.value?.id) return;
  if (!isListItemType(item.value.type)) return;
  return isItemListLoading({
    listType: list.value.type,
    itemType: item.value.type,
    itemId: item.value?.id,
  });
});

const checked = computed(() => {
  if (!isListItemType(item.value.type)) return false;
  const id = item.value.meta?.ids?.[item.value.type]?.trakt;
  if (!id) return false;
  return isItemInList(list.value.id, item.value.type, id);
});

const label = computed(() => {
  if (checked.value) return i18n('remove', 'common', 'button');
  if (list.value.type === ListType.List) return list.value.name;
  return i18n(list.value.name, 'list');
});

const onClick = () => {
  if (!isListItemType(item.value.type)) return;
  const trakt = item.value?.meta?.ids?.[item.value.type]?.trakt;
  if (!trakt) return;

  const query = {
    list: list.value,
    itemIds: { trakt },
    itemType: item.value.type,
    remove: checked.value,
  };
  const request = addToOrRemoveFromList(query);
  emit('onClick', { query, request });
};

watch(disabled, () => {
  if (disabled.value || disableFetch.value) return;
  if (!list.value) return;
  return fetchListItems({ list: list.value }, { parallel: false, updateState: false });
});
</script>

<template>
  <ListButton
    :disabled="disabled"
    :loading="isLoading"
    :colored="checked"
    :button-props="{ type: 'warning', ...buttonProps }"
    :icon-props="{ component: checked ? IconRestore : IconList, ...iconProps }"
    @on-click="onClick"
  >
    <span>{{ label }}</span>
  </ListButton>
</template>
