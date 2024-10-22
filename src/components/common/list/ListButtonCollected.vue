<script setup lang="ts">
import { computed, type PropType, toRefs } from 'vue';

import ListButton from '~/components/common/list/ListButton.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import { type ListScrollItem } from '~/models/list-scroll.model';
import { isListItemType, ListType } from '~/models/list.model';
import { useItemCollected } from '~/stores/composable/use-item-played';
import { useWatchedUpdates } from '~/stores/composable/use-list-update';
import { useListStore } from '~/stores/data/list.store';
import {
  QuickActionDate,
  type QuickActionDates,
} from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'watched');

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
    required: true,
  },
  dateType: {
    type: String as PropType<QuickActionDates>,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});

const { disabled, item, dateType } = toRefs(props);

const { collected, date: dateCollected } = useItemCollected(item);

const { isItemListLoading } = useListStore();

const isLoading = computed(() => {
  if (!item.value?.id) return;
  if (!isListItemType(item.value.type)) return;
  return isItemListLoading({
    listType: ListType.Collection,
    itemType: item.value.type,
    itemId: item.value?.id,
  }).value;
});

const { addOrRemoveCollected } = useWatchedUpdates();

const onClick = () => {
  if (!isListItemType(item.value.type)) return;
  const trakt = item.value?.meta?.ids?.[item.value.type]?.trakt;
  if (!trakt) return;

  let date: Date | string | undefined;
  if (dateType?.value === QuickActionDate.Release) {
    date = item.value?.meta?.released[item.value.type];
  }

  return addOrRemoveCollected({
    itemIds: { trakt },
    itemType: item.value.type,
    remove: !!collected.value,
    showId: item.value?.meta?.ids?.show?.trakt,
    date,
  });
};
</script>

<template>
  <ListButton
    :disabled="isLoading || disabled"
    :loading="isLoading"
    :button-props="{ type: collected ? 'error' : 'info' }"
    :icon-props="{ component: collected ? IconRestore : IconGrid }"
    :title="
      i18n(collected ? 'collected' : 'mark_collected', 'common', 'tooltip') +
      (dateCollected ? `: ${ dateCollected }` : '')
    "
    @on-click="onClick"
  >
    <span>{{ i18n(collected ? 'remove' : 'collected', 'common', 'button') }}</span>
  </ListButton>
</template>
