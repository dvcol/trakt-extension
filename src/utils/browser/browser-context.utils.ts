/**
 * Browser context alias
 */
export const context: typeof chrome.contextMenus | undefined = globalThis?.chrome?.contextMenus;

/**
 * Browser context menu clicked event alias
 */
export type ContextMenuOnClickedData = chrome.contextMenus.OnClickData;
