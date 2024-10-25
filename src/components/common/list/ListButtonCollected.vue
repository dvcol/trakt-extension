<script setup lang="ts">
import { computed, type PropType, toRefs, watch } from 'vue';

import type { ButtonProps, IconProps } from 'naive-ui';

import ListButton from '~/components/common/list/ListButton.vue';
import IconGridEmpty from '~/components/icons/IconGridEmpty.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import { type ListScrollItem } from '~/models/list-scroll.model';
import { isListItemType, ListType } from '~/models/list.model';
import { useItemCollected } from '~/stores/composable/use-item-played';
import {
  type AddOrRemoveQuery,
  useWatchedUpdates,
} from '~/stores/composable/use-list-update';
import { useListStore } from '~/stores/data/list.store';
import { useMovieStoreRefs } from '~/stores/data/movie.store';
import { useShowStore } from '~/stores/data/show.store';
import {
  QuickActionDate,
  type QuickActionDates,
} from '~/stores/settings/extension.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('list', 'button', 'collected');

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
  loading: {
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
  (e: 'onClick', payload: { query: AddOrRemoveQuery; request: Promise<unknown> }): void;
}>();

const { disabled, disableFetch, item, dateType, loading } = toRefs(props);

const { collected, date: dateCollected } = useItemCollected(item);

const { isItemListLoading } = useListStore();

const isListLoading = computed(() => {
  if (!isListItemType(item.value.type)) return;
  const itemId = item.value.meta?.ids?.[item.value.type]?.trakt;
  if (!itemId) return false;
  return isItemListLoading({
    listType: ListType.Collection,
    itemType: item.value.type,
    itemId,
  });
});

const { loadingCollected } = useMovieStoreRefs();
const { getShowCollectionLoading } = useShowStore();

const isLoading = computed(() => {
  if (loading?.value) return true;
  if (isListLoading.value) return true;
  if (item.value.type === 'movie') return loadingCollected.value;
  if (!item.value?.meta?.ids?.show?.trakt) return false;
  return getShowCollectionLoading(item.value?.meta?.ids?.show?.trakt);
});

const { addOrRemoveCollected, fetchCollection } = useWatchedUpdates();

const getQuery = (): AddOrRemoveQuery | undefined => {
  if (!isListItemType(item.value.type)) return;
  const trakt = item.value?.meta?.ids?.[item.value.type]?.trakt;
  if (!trakt) return;

  return {
    itemIds: { trakt },
    itemType: item.value.type,
    remove: !!collected.value,
    showId: item.value?.meta?.ids?.show?.trakt,
  };
};

const onClick = () => {
  if (!isListItemType(item.value.type)) return;
  const query = getQuery();
  if (!query) return;

  if (dateType?.value === QuickActionDate.Release) {
    query.date = item.value?.meta?.released?.[item.value.type];
  }

  const request = addOrRemoveCollected(query);
  emit('onClick', { query, request });
};

watch(disabled, () => {
  if (disabled.value || disableFetch.value) return;
  const query = getQuery();
  if (!query) return;
  return fetchCollection(query);
});
</script>

<template>
  <ListButton
    :disabled="disabled"
    :loading="isLoading"
    :colored="!!collected"
    :button-props="{ type: 'info', ...buttonProps }"
    :icon-props="{ component: collected ? IconRestore : IconGridEmpty, ...iconProps }"
    :title="
      i18n(collected ? 'collected' : 'mark_collected', 'common', 'tooltip') +
      (dateCollected ? `: ${ dateCollected }` : '')
    "
    @on-click="onClick"
  >
    <span>{{ i18n(collected ? 'remove' : 'collect', 'common', 'button') }}</span>
  </ListButton>
</template>
