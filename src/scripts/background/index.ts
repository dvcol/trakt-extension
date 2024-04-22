import type { RouteLocationNormalized } from 'vue-router';

import { ContextMenuId, ContextMenus } from '~/models/context/context-menu.model';
import { Route, RouterStorageKey } from '~/models/router.model';
import { action } from '~/utils/browser/borwser-action.utils';
import { context } from '~/utils/browser/browser-context.utils';
import { runtime } from '~/utils/browser/browser-runtime.utils';
import { storage } from '~/utils/browser/browser-storage.utils';
import { createTab } from '~/utils/browser/browser.utils';

export {};

console.debug('Background script started');

runtime?.onInstalled.addListener(async () => {
  console.debug('Extension installed');
  if (!context) return;
  await Promise.all(Object.values(ContextMenus).map(m => context!.create(m)));

  console.debug('Context menus created');

  context.onClicked.addListener(async info => {
    console.debug('Context menu event', info);
    if (!context || !runtime) return;
    if (!info?.selectionText) return;
    await storage.local.set(RouterStorageKey.LastRoute, {
      name: Route.Search,
      query: { search: info.selectionText },
    } satisfies Partial<RouteLocationNormalized>);

    if (info.menuItemId !== ContextMenuId.OpenInSideTrakt) return;

    if (action?.openPopup) {
      await action.openPopup();
    } else {
      await createTab({
        url: runtime.getURL('views/options/index.html'),
      });
    }
  });
});
