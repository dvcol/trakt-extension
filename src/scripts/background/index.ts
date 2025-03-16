import { setBadgeBackgroundColor, setBadgeText, setBadgeTextColor, setIcon, setTitle } from '@dvcol/web-extension-utils/chrome/action';
import { onContextMenuClicked } from '@dvcol/web-extension-utils/chrome/context';
import { onInstalledEvent, onVersionUpdate } from '@dvcol/web-extension-utils/chrome/runtime';
import { getPanelBehavior, setPanelBehavior } from '@dvcol/web-extension-utils/chrome/side-panel';

import { ContextMenusHooks, installContextMenus } from '~/models/context/context-menu-hooks.model';
import { isContextMenuId } from '~/models/context/context-menu.model';
import { IconAction } from '~/models/icon-action';
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
    const { previousVersion, nextVersion } = details;
    if (previousVersion?.split('.').slice(0, 2).join('.') === nextVersion?.split('.').slice(0, 2).join('.')) return;
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
  onContextMenuClicked(async (info, tab) => {
    if (isContextMenuId(info.menuItemId)) {
      return ContextMenusHooks[info.menuItemId](info, tab);
    }
    console.error('Unknown context menu event', info);
  });
} catch (error) {
  console.error('Failed to handle context menu click event', error);
}

try {
  onMessage(MessageType.BadgeUpdate, async message => {
    if (!message.payload) return;
    const { title, text, color, backgroundColor } = message.payload;
    if (title !== undefined) setTitle?.({ title });
    if (text !== undefined) setBadgeText?.({ text });
    if (color !== undefined) setBadgeTextColor?.({ color });
    if (backgroundColor !== undefined) setBadgeBackgroundColor?.({ color: backgroundColor });
  });
} catch (error) {
  console.error('Failed to handle badge update message', error);
}

try {
  onMessage(MessageType.IconUpdate, async message => {
    if (!message.payload) return;
    const { icon, color } = message.payload;
    if (icon !== undefined) setIcon?.(icon);
    if (color !== undefined) setBadgeBackgroundColor?.(color);
  });
} catch (error) {
  console.error('Failed to handle badge update message', error);
}

try {
  onMessage(MessageType.IconOptions, async message => {
    if (!message.payload) return;
    if (!setPanelBehavior || !getPanelBehavior) return;
    const options = await getPanelBehavior();
    const openPanel = message.payload.open === IconAction.Panel;
    if (options.openPanelOnActionClick === openPanel) return;
    setPanelBehavior({ openPanelOnActionClick: openPanel });
    console.debug('App ready', { open: message.payload.open, options, openPanel });
  });
} catch (error) {
  console.error('Failed to handle side panel options message', error);
}
