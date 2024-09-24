import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';

import type { ListEntity } from '~/models/list.model';

import type { ErrorDictionary } from '~/utils/retry.utils';

import IconCheckedList from '~/components/icons/IconCheckedList.vue';
import IconGrid from '~/components/icons/IconGrid.vue';
import IconHeart from '~/components/icons/IconHeart.vue';
import IconList from '~/components/icons/IconList.vue';
import { DefaultLists, ListType } from '~/models/list.model';
import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { ErrorCount } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

const DefaultList: ListEntity[] = Object.values(DefaultLists);

const ListsStoreConstants = {
  Store: 'data.lists',
} as const;

export const useListsStore = defineStore(ListsStoreConstants.Store, () => {
  const firstLoad = ref(true);
  const loading = ref(true);

  const lists = ref<ListEntity[]>(DefaultList);
  const activeList = ref<ListEntity>(DefaultLists.Watchlist);

  const listsErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('lists', listsErrors);

  const saveState = async () =>
    storage.local.set(ListsStoreConstants.Store, {
      lists: [...lists.value],
      activeList: activeList.value,
    });

  const restoreState = async () => {
    const restored = await storage.local.get<{
      lists: ListEntity[];
      activeList: ListEntity;
    }>(ListsStoreConstants.Store);
    if (restored?.lists) lists.value = restored.lists;
    if (restored?.activeList === activeList.value) return;
    if (restored?.activeList) activeList.value = restored.activeList;
  };

  const clearState = () => {
    lists.value = DefaultList;
    activeList.value = DefaultLists.Watchlist;
    clearProxy(listsErrors);
  };

  const { user, isAuthenticated } = useAuthSettingsStoreRefs();

  const fetchLists = async () => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch lists, user is not authenticated');
      return;
    }
    if (!firstLoad.value && loading.value) {
      Logger.warn('Already fetching lists');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    Logger.debug('Fetching Lists');
    loading.value = true;
    try {
      const [personals, collaborations] = await Promise.all([TraktService.lists(user.value), TraktService.lists(user.value, true)]);
      delete listsErrors[user.value];
      lists.value = [
        ...DefaultList,
        ...personals.map(
          l =>
            ({
              type: ListType.List,
              name: l.name,
              id: l.ids.trakt,
              owner: l.user,
            }) satisfies ListEntity,
        ),
        ...collaborations.map(
          l =>
            ({
              type: ListType.Collaboration,
              name: l.name,
              id: l.ids.trakt,
              owner: l.user,
            }) satisfies ListEntity,
        ),
      ];
      if (activeList.value?.id && !lists.value.some(l => activeList.value.id === l?.id)) {
        Logger.warn('Active List not found, falling back to default', activeList.value);
        activeList.value = DefaultLists.Watchlist;
      }
    } catch (e) {
      Logger.error('Failed to fetch lists');
      NotificationService.error('Failed to fetch lists', e);
      listsErrors[user.value] = ErrorCount.fromDictionary(listsErrors, user.value, e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getIcon = (list: ListEntity) => {
    switch (list.type) {
      case ListType.Collection:
        return IconGrid;
      case ListType.Watchlist:
        return IconCheckedList;
      case ListType.Favorites:
        return IconHeart;
      case ListType.Collaboration:
        return IconList;
      default:
        return IconList;
    }
  };

  /** Filter favorites and collections out  */
  const myLists = computed(() => {
    return lists.value?.filter(list => {
      return [ListType.List, ListType.Watchlist].map(String).includes(list.type);
    });
  });

  const initListsStore = async () => {
    await restoreState();

    watch(activeList, async _value => {
      await saveState();
    });
  };

  return { listsLoading: loading, lists, myLists, activeList, fetchLists, clearState, initListsStore, getIcon };
});

export const useListsStoreRefs = () => storeToRefs(useListsStore());
