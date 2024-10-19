import type { VersionUpdateDetails } from '@dvcol/web-extension-utils/chrome/models';
import type { ContextMenuIds } from '~/models/context/context-menu.model';

export const MessageType = {
  ContextMenu: 'context-menu',
  VersionUpdate: 'version-update',
  AppReady: 'app-ready',
  BadgeUpdate: 'badge-update',
  IconUpdate: 'icon-update',
} as const;

export type MessageTypes = (typeof MessageType)[keyof typeof MessageType];

export type BadgeUpdatePayload = {
  title?: string;
  text?: string;
  color?: string;
  backgroundColor?: string;
};

/**
 * Type union of possible message payloads
 */
export type MessagePayload<T extends MessageTypes = MessageTypes> = T extends typeof MessageType.ContextMenu
  ? Record<ContextMenuIds, boolean>
  : T extends typeof MessageType.VersionUpdate
    ? VersionUpdateDetails & { date: number }
    : T extends typeof MessageType.AppReady
      ? boolean
      : T extends typeof MessageType.BadgeUpdate
        ? BadgeUpdatePayload
        : T extends typeof MessageType.IconUpdate
          ? string
          : never;
