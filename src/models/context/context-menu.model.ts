export const ContextMenuId = {
  OpenInSideTrakt: 'open_in_side_trakt',
  AddToSearchHistory: 'add_to_search_history',
  OpenInSideTraktPanel: 'open_in_side_trakt_panel',
} as const;

export type ContextMenuIds = (typeof ContextMenuId)[keyof typeof ContextMenuId];

const contextMenuIdValues = new Set<string>(Object.values(ContextMenuId));
export const isContextMenuId = (id: unknown): id is ContextMenuIds => typeof id === 'string' && contextMenuIdValues.has(id);

export type ContextMenu = {
  id: ContextMenuIds;
  title: string;
  contexts?: ('selection' | 'link')[];
};

export const ContextMenus: Record<ContextMenuIds, ContextMenu> = {
  [ContextMenuId.OpenInSideTrakt]: {
    id: ContextMenuId.OpenInSideTrakt,
    title: 'Open Side Trakt window',
    contexts: ['selection'],
  },
  [ContextMenuId.OpenInSideTraktPanel]: {
    id: ContextMenuId.OpenInSideTraktPanel,
    title: 'Open Side Trakt panel',
    contexts: ['selection'],
  },
  [ContextMenuId.AddToSearchHistory]: {
    id: ContextMenuId.AddToSearchHistory,
    title: 'Add to search history',
    contexts: ['selection'],
  },
} as const;

export const ContextMenuConstants = {
  Store: 'settings.context-menu',
  LocalEnabled: 'settings.context-menu.enabled',
};
