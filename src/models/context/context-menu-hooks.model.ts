import { openPopup } from '@dvcol/web-extension-utils/chrome/action';
import { context } from '@dvcol/web-extension-utils/chrome/context';
import { runtime } from '@dvcol/web-extension-utils/chrome/runtime';
import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';

import type { ContextMenuOnClickedData } from '@dvcol/web-extension-utils/chrome/models';
import type { RouteLocationNormalized } from 'vue-router';

import { ContextMenuConstants, ContextMenuId, type ContextMenuIds, ContextMenus } from '~/models/context/context-menu.model';
import { Route, RouterStorageKey } from '~/models/router.model';
import { storage } from '~/utils/browser/browser-storage.utils';

const setLastRoute = (data: ContextMenuOnClickedData) => {
  if (!data?.selectionText) return;
  return storage.local.set(RouterStorageKey.LastRoute, {
    name: Route.Search,
    query: { search: data.selectionText },
  } satisfies Partial<RouteLocationNormalized>);
};

const openPopupApp = async () => {
  if (openPopup) return openPopup();
  if (!runtime) return;
  await createTab({
    url: runtime.getURL('views/options/index.html'),
  });
};

export const ContextMenusHooks: Record<ContextMenuIds, (data: ContextMenuOnClickedData) => void | Promise<void>> = {
  [ContextMenuId.OpenInSideTrakt]: async data => {
    await setLastRoute(data);
    await openPopupApp();
  },
  [ContextMenuId.AddToSearchHistory]: setLastRoute,
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
