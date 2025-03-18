import { openPopup } from '@dvcol/web-extension-utils/chrome/action';
import { context } from '@dvcol/web-extension-utils/chrome/context';
import { runtime } from '@dvcol/web-extension-utils/chrome/runtime';
import { openPanel } from '@dvcol/web-extension-utils/chrome/side-panel';
import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';

import type { ContextMenuOnClickedData, Tab } from '@dvcol/web-extension-utils/chrome/models';
import type { RouteLocationNormalized } from 'vue-router';

import { ContextMenuConstants, ContextMenuId, type ContextMenuIds, ContextMenus } from '~/models/context/context-menu.model';
import { MessageType } from '~/models/message/message-type.model';
import { Route, RouterStorageKey } from '~/models/router.model';
import { sendMessage } from '~/utils/browser/browser-message.utils';
import { storage } from '~/utils/browser/browser-storage.utils';

const setLastRoute = async (data: ContextMenuOnClickedData, payload?: Partial<RouteLocationNormalized>) => {
  if (!data?.selectionText) return;
  if (!payload) payload = { name: Route.Search, query: { search: data.selectionText } };
  await storage.local.set(RouterStorageKey.LastRoute, payload);
  await sendMessage({ type: MessageType.Routing, payload });
};

const openPopupApp = async () => {
  if (openPopup) return openPopup();
  if (!runtime) return;
  // Fallback to open options page
  await createTab({
    url: runtime.getURL('views/options/index.html'),
  });
};

export const ContextMenusHooks: Record<ContextMenuIds, (data: ContextMenuOnClickedData, tab?: Tab) => void | Promise<void>> = {
  [ContextMenuId.OpenInSideTraktPanel]: async (data, tab) => {
    if (tab?.windowId && openPanel) await openPanel({ windowId: tab.windowId });
    await setLastRoute(data);
    if (tab?.windowId && openPanel) return;
    // Fallback to open popup/options page
    await openPopupApp();
  },
  [ContextMenuId.OpenInSideTrakt]: async data => {
    await setLastRoute(data);
    await openPopupApp();
  },
  [ContextMenuId.AddToSearchHistory]: data => setLastRoute(data),
} as const;

export const installContextMenus = async (enabled?: Record<ContextMenuIds, boolean>) => {
  if (!context) return;
  if (!enabled) enabled = await storage.local.get<Record<ContextMenuIds, boolean>>(ContextMenuConstants.LocalEnabled);
  if (!enabled) return;

  await context.removeAll();

  return (Object.entries(enabled) as [ContextMenuIds, boolean][])
    .filter(([_, isEnabled]) => isEnabled)
    .map(([id]) => context!.create(ContextMenus[id]));
};
