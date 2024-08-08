import { onContextMenuClicked } from '@dvcol/web-extension-utils/chrome/context';
import { onInstalledEvent, onVersionUpdate } from '@dvcol/web-extension-utils/chrome/runtime';

import { ContextMenusHooks, installContextMenus } from '~/models/context/context-menu-hooks.model';
import { isContextMenuId } from '~/models/context/context-menu.model';
import { MessageType } from '~/models/message/message-type.model';
import { onMessage } from '~/utils/browser/browser-message.utils';
import { storage } from '~/utils/browser/browser-storage.utils';

console.debug('Background script started');

try {
  onInstalledEvent(async details => {
    await installContextMenus();

    console.debug('Context menu installed', details);
  });
} catch (error) {
  console.error('Failed to install context menus', error);
}

try {
  onVersionUpdate(async details => {
    console.debug(`Extension updated`, details);
    await storage.local.set(MessageType.VersionUpdate, { ...details, date: Date.now() });
  });
} catch (error) {
  console.error('Failed to handle version update', error);
}

try {
  onMessage(MessageType.ContextMenu, async message => {
    await installContextMenus(message.payload);
  });
} catch (error) {
  console.error('Failed to handle context menu message', error);
}

try {
  onContextMenuClicked(async info => {
    if (isContextMenuId(info.menuItemId)) {
      return ContextMenusHooks[info.menuItemId](info);
    }
    console.error('Unknown context menu event', info);
  });
} catch (error) {
  console.error('Failed to handle context menu click event', error);
}
