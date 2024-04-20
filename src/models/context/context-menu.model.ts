export const ContextMenuId = {
  OpenInSideTrakt: 'open-in-side-trakt',
  AddToSearchHistory: 'add-to-search-history',
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
  [ContextMenuId.AddToSearchHistory]: {
    id: ContextMenuId.AddToSearchHistory,
    title: 'Add to search history',
    contexts: ['selection'],
  },
} as const;
