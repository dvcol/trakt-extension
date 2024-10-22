<script setup lang="ts">
import { computed } from 'vue';

import type { ListScrollItem } from '~/models/list-scroll.model';

import type { Route } from '~/models/router.model';

import ListButtonCheckin from '~/components/common/list/ListButtonCheckin.vue';
import ListButtonCollected from '~/components/common/list/ListButtonCollected.vue';
import ListButtonWatched from '~/components/common/list/ListButtonWatched.vue';
import {
  QuickAction,
  useExtensionSettingsStore,
} from '~/stores/settings/extension.store';

const { item, disabled, route } = defineProps<{
  item: ListScrollItem;
  route: Route;
  disabled?: boolean;
}>();

const { getAction, getActionDate } = useExtensionSettingsStore();

const actions = computed(() => getAction(route));
const collectionDate = computed(() => getActionDate(QuickAction.Collected));
const watchedDate = computed(() => getActionDate(QuickAction.Watched));
</script>

<template>
  <ListButtonCollected
    v-if="actions?.[QuickAction.Collected]"
    :date-type="collectionDate"
    :disabled="disabled"
    :item="item"
  />
  <ListButtonWatched
    v-if="actions?.[QuickAction.Watched]"
    :date-type="watchedDate"
    :disabled="disabled"
    :item="item"
  />
  <ListButtonCheckin
    v-if="actions?.[QuickAction.Checkin]"
    :disabled="disabled"
    :item="item"
  />
</template>
