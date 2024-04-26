import type { RouteLocationNormalized } from 'vue-router';

import { ContextMenuConstants, ContextMenuId, type ContextMenuIds, ContextMenus } from '~/models/context/context-menu.model';
import { Route, RouterStorageKey } from '~/models/router.model';
import { action } from '~/utils/browser/borwser-action.utils';
import { context, type ContextMenuOnClickedData } from '~/utils/browser/browser-context.utils';
import { runtime } from '~/utils/browser/browser-runtime.utils';
import { storage } from '~/utils/browser/browser-storage.utils';
import { createTab } from '~/utils/browser/browser.utils';

const setLastRoute = (data: ContextMenuOnClickedData) => {
  if (!data?.selectionText) return;
  return storage.local.set(RouterStorageKey.LastRoute, {
    name: Route.Search,
    query: { search: data.selectionText },
  } satisfies Partial<RouteLocationNormalized>);
};

const openPopup = async () => {
  if (action?.openPopup) return action.openPopup();
  if (!runtime) return;
  await createTab({
    url: runtime.getURL('views/options/index.html'),
  });
};

export const ContextMenusHooks: Record<ContextMenuIds, (data: ContextMenuOnClickedData) => void | Promise<void>> = {
  [ContextMenuId.OpenInSideTrakt]: async data => {
    await setLastRoute(data);
    await openPopup();
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
