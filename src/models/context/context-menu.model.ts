export const ContextMenuId = {
  OpenInSideTrakt: 'open-in-side-trakt',
} as const;

export type ContextMenuIds = (typeof ContextMenuId)[keyof typeof ContextMenuId];

export type ContextMenu = {
  id: ContextMenuIds;
  title: string;
  contexts?: ('selection' | 'link')[];
};

export const ContextMenus: Record<ContextMenuIds, ContextMenu> = {
  [ContextMenuId.OpenInSideTrakt]: {
    id: ContextMenuId.OpenInSideTrakt,
    title: 'Open in side trakt',
    contexts: ['selection'],
  },
} as const;
