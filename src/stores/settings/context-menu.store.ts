import { defineStore } from 'pinia';

import { computed, reactive, toRefs } from 'vue';

import { ContextMenuConstants, ContextMenuId, type ContextMenuIds } from '~/models/context/context-menu.model';
import { MessageType } from '~/models/message/message-type.model';
import { Logger } from '~/services/logger.service';
import { sendMessage } from '~/utils/browser/browser-message.utils';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

type ContextMenuState = Record<ContextMenuIds, boolean>;

const defaultState = {
  [ContextMenuId.OpenInSideTrakt]: false,
  [ContextMenuId.AddToSearchHistory]: false,
  [ContextMenuId.OpenInSideTraktPanel]: false,
} as const;

export const useContextMenuStore = defineStore(ContextMenuConstants.Store, () => {
  const enabled = reactive<ContextMenuState>(defaultState);

  const clearState = () => {
    Object.assign(enabled, defaultState);
  };

  const saveState = debounce(async () => {
    await storage.local.set(ContextMenuConstants.LocalEnabled, enabled);
    await sendMessage({ type: MessageType.ContextMenu, payload: enabled });
  }, 500);

  const restoreState = async () => {
    const state = await storage.local.get<ContextMenuState>(ContextMenuConstants.LocalEnabled);
    if (state) Object.assign(enabled, state);
    return state;
  };

  const toggleContextMenu = (id: ContextMenuIds) => {
    enabled[id] = !enabled[id];
    saveState().catch(err => Logger.error('Failed to save context menu state', { id, err }));
  };

  const initContextMenuStore = async () => {
    await restoreState();
  };

  return {
    clearState,
    initContextMenuStore,
    toggleContextMenu,
    enabledContextMenus: computed(() => Object.entries(enabled) as [ContextMenuIds, boolean][]),
  };
});

export const useContextMenuStoreRefs = () => toRefs(useContextMenuStore());
