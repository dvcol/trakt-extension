import { ContextMenusHooks, installContextMenus } from '~/models/context/context-menu-hooks.model';
import { isContextMenuId } from '~/models/context/context-menu.model';
import { MessageType } from '~/models/message/message-type.model';
import { context } from '~/utils/browser/browser-context.utils';
import { runtime } from '~/utils/browser/browser-runtime.utils';

console.debug('Background script started');

runtime?.onInstalled.addListener(async () => {
  await installContextMenus();

  console.debug('Extension installed');
});

runtime?.onMessage.addListener(async message => {
  if (message.type === MessageType.ContextMenu) {
    await installContextMenus(message.enabled);
  }
});

context?.onClicked.addListener(async info => {
  if (isContextMenuId(info.menuItemId)) {
    return ContextMenusHooks[info.menuItemId](info);
  }
  console.error('Unknown context menu event', info);
});
