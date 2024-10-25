<script setup lang="ts">
import { computed } from 'vue';

import type { AddOrRemoveQuery } from '~/stores/composable/use-list-update';
import type { CheckinQuery } from '~/stores/composable/use-watching';

import ListButtonCheckin from '~/components/common/list/ListButtonCheckin.vue';
import ListButtonCollected from '~/components/common/list/ListButtonCollected.vue';
import ListButtonList from '~/components/common/list/ListButtonList.vue';
import ListButtonWatched from '~/components/common/list/ListButtonWatched.vue';
import { isEpisodeOrMovie, type ListScrollItem } from '~/models/list-scroll.model';
import { type AddOrRemoveListQuery, canFavorite, ListType } from '~/models/list.model';
import { Route } from '~/models/router.model';
import { useListsStoreRefs } from '~/stores/data/lists.store';
import {
  QuickAction,
  type QuickActions,
  useExtensionSettingsStore,
} from '~/stores/settings/extension.store';

const { item, disabled, route } = defineProps<{
  item: ListScrollItem;
  route: Route;
  disabled?: boolean;
  loading?: boolean;
}>();

type Query<T extends QuickActions> = T extends typeof QuickAction.Checkin
  ? CheckinQuery
  : T extends typeof QuickAction.List
    ? AddOrRemoveListQuery
    : T extends typeof QuickAction.Collect | typeof QuickAction.Watch
      ? AddOrRemoveQuery
      : CheckinQuery | AddOrRemoveListQuery | AddOrRemoveQuery;
type Payload<T extends QuickActions = QuickActions> = {
  button: T;
  query: Query<T>;
  request: Promise<unknown>;
};

const emit = defineEmits<{
  (e: 'onClick', payload: Payload): void;
}>();

const { getAction, getActionDate, getActionList } = useExtensionSettingsStore();

const actions = computed(() => getAction(route));
const collectionDate = computed(() => getActionDate(QuickAction.Collect));
const watchedDate = computed(() => getActionDate(QuickAction.Watch));

const { activeList } = useListsStoreRefs();
const list = computed(() => {
  if (route === Route.Watchlist) return activeList.value;
  const _list = getActionList(route);
  if (_list?.type === ListType.Favorites && !canFavorite(item.type)) return;
  return _list;
});

const onClick = <T extends QuickActions>(
  button: T,
  payload: { query: Query<T>; request: Promise<unknown> },
) => {
  emit('onClick', { button, ...payload });
};
</script>

<template>
  <ListButtonList
    v-if="actions?.[QuickAction.List] && list"
    :list="list"
    :disabled="disabled"
    :loading="loading"
    :disable-fetch="route === Route.Watchlist"
    :item="item"
    @on-click="e => onClick(QuickAction.List, e)"
  />
  <ListButtonCollected
    v-if="actions?.[QuickAction.Collect]"
    :date-type="collectionDate"
    :disabled="disabled"
    :loading="loading"
    :item="item"
    @on-click="e => onClick(QuickAction.Collect, e)"
  />
  <ListButtonWatched
    v-if="actions?.[QuickAction.Watch]"
    :date-type="watchedDate"
    :disabled="disabled"
    :loading="loading"
    :item="item"
    @on-click="e => onClick(QuickAction.Watch, e)"
  />
  <ListButtonCheckin
    v-if="actions?.[QuickAction.Checkin] && isEpisodeOrMovie(item.type)"
    :disabled="disabled"
    :loading="loading"
    :item="item"
    @on-click="e => onClick(QuickAction.Checkin, e)"
  />
</template>
