<script setup lang="ts">
import { computed, type PropType, toRefs } from 'vue';

import type { ButtonProps, IconProps } from 'naive-ui';

import ListButton from '~/components/common/list/ListButton.vue';
import IconPlay from '~/components/icons/IconPlay.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import { type ListScrollItem } from '~/models/list-scroll.model';
import { isListItemType, ListType } from '~/models/list.model';
import { useItemPlayed } from '~/stores/composable/use-item-played';
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
  buttonProps: {
    type: Object as PropType<ButtonProps>,
    required: false,
  },
  iconProps: {
    type: Object as PropType<IconProps>,
    required: false,
  },
});

const { disabled, item, dateType } = toRefs(props);

const { played, date: datePlayed } = useItemPlayed(item);

const { isItemListLoading } = useListStore();

const isLoading = computed(() => {
  if (!item.value?.id) return;
  if (!isListItemType(item.value.type)) return;
  return isItemListLoading({
    listType: ListType.History,
    itemType: item.value.type,
    itemId: item.value?.id,
  }).value;
});

const { addOrRemovePlayed } = useWatchedUpdates();

const onClick = () => {
  if (!isListItemType(item.value.type)) return;
  const trakt = item.value?.meta?.ids?.[item.value.type]?.trakt;
  if (!trakt) return;

  let date: Date | string | undefined;
  if (dateType?.value === QuickActionDate.Release) {
    date = item.value?.meta?.released[item.value.type];
  }

  return addOrRemovePlayed({
    itemIds: { trakt },
    itemType: item.value.type,
    remove: played.value,
    showId: item.value?.meta?.ids?.show?.trakt,
    date,
  });
};
</script>

<template>
  <ListButton
    :disabled="isLoading || disabled"
    :loading="isLoading"
    :colored="played"
    :button-props="{ type: 'success', ...buttonProps }"
    :icon-props="{ component: played ? IconRestore : IconPlay, ...iconProps }"
    :title="
      i18n(played ? 'watch' : 'mark_watched', 'common', 'tooltip') +
      (datePlayed ? `: ${ datePlayed }` : '')
    "
    @on-click="onClick"
  >
    <span>{{ i18n(played ? 'watched' : 'watch', 'common', 'button') }}</span>
  </ListButton>
</template>
