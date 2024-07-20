import { createTab } from '@dvcol/web-extension-utils/chrome/tabs';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, type Ref } from 'vue';

import type { TagLink } from '~/models/tag.model';

import { logger } from '~/stores/settings/log.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { clearProxy } from '~/utils/vue.utils';

export const CustomLinkScope = {
  Movie: 'movie' as const,
  Show: 'show' as const,
  Season: 'season' as const,
  Episode: 'episode' as const,
  Person: 'person' as const,
} as const;

export const AllCustomLinkScopes = Object.values(CustomLinkScope);

type CustomLinkScopes = (typeof CustomLinkScope)[keyof typeof CustomLinkScope];
type CustomLinkSubstitution<T = string | number> = Partial<{
  slug: T;
  trakt: T;
  imdb: T;
  tmdb: T;
  tvdb: T;
  alias: T;
  episode: T;
  season: T;
  title: T;
}>;

export type CustomLink = TagLink & {
  id: number;
  url: string;
  scopes: CustomLinkScopes[];
  icon?: 'external';
};

export const resolveLinkUrl = (url: string, substitutions: CustomLinkSubstitution) => {
  let _url = url;
  Object.entries(substitutions).forEach(([key, value]) => {
    if (!value) return;
    const _value = typeof value === 'number' ? value.toString().padStart(2, '0') : value.toString();
    _url = _url.replace(`{{${key}}}`, encodeURIComponent(_value));
  });
  return _url;
};

export type AliasScope = 'movie' | 'show';

export type CustomLinkDictionary = Record<number, CustomLink>;
type CustomLinkScopeDictionary = Partial<Record<CustomLinkScopes, CustomLinkDictionary>>;
type AliasDictionary = Partial<Record<AliasScope, Record<string, string>>>;

type LinksStoreState = {
  enabled: boolean;
  backgroundLink: boolean;
};

const LinksStoreConstants = {
  Store: 'settings.links',
  SyncAliases: 'settings.links.aliases',
  SyncLinks: 'settings.links.links',
} as const;

export const useLinksStore = defineStore(LinksStoreConstants.Store, () => {
  const enabled = ref(false);
  const backgroundLink = ref(false);
  const aliasDictionary = reactive<AliasDictionary>({});

  const linkDictionary = reactive<CustomLinkDictionary>({});
  const linkScopeDictionary = reactive<CustomLinkScopeDictionary>({});

  const clearState = () => {
    clearProxy(aliasDictionary);
    clearProxy(linkDictionary);
    clearProxy(linkScopeDictionary);
  };

  const saveState = debounce(
    () => storage.sync.set(LinksStoreConstants.Store, { enabled: enabled.value, backgroundLink: backgroundLink.value }),
    500,
  );
  const saveAlias = debounce(() => storage.sync.set(LinksStoreConstants.SyncAliases, aliasDictionary), 500);
  const saveLinks = debounce(() => storage.sync.set(LinksStoreConstants.SyncLinks, linkDictionary), 500);

  const addToScope = (scope: CustomLinkScopes, link: CustomLink) => {
    if (!linkScopeDictionary[scope]) linkScopeDictionary[scope] = {};
    linkScopeDictionary[scope]![link.id] = link;
  };

  const removeFromScope = (scope: CustomLinkScopes, id: CustomLink['id']) => {
    if (linkScopeDictionary[scope]?.[id]) delete linkScopeDictionary[scope]![id];
  };

  const addLink = (link: CustomLink) => {
    // remove old scopes if exists
    const _was = linkDictionary[link.id];
    if (_was && _was.scopes) Object.values(_was.scopes).forEach(scope => removeFromScope(scope, link.id));

    // update link
    linkDictionary[link.id] = link;

    // add new scopes
    if (link.scopes) Object.values(link.scopes).forEach(scope => addToScope(scope, link));
    saveLinks().catch(err => logger.error('Failed to save link', { link, err }));
  };

  const removeLink = (id: CustomLink['id']) => {
    const link = linkDictionary[id];
    if (!link) return;
    if (linkDictionary[link.id]) delete linkDictionary[link.id];
    if (link.scopes) Object.values(link.scopes).forEach(scope => removeFromScope(scope, link.id));
    saveLinks().catch(err => logger.error('Failed to save link', { id, err }));
  };

  const restoreState = async () => {
    const [restoredState, restoredAliases, restoredLinks]: [LinksStoreState, AliasDictionary, CustomLinkDictionary] = await Promise.all([
      storage.sync.get<LinksStoreState>('settings.links'),
      storage.sync.get<AliasDictionary>('settings.links.aliases'),
      storage.sync.get<CustomLinkDictionary>('settings.links.links'),
    ]);

    if (restoredState?.enabled !== undefined) enabled.value = restoredState.enabled;
    if (restoredState?.backgroundLink !== undefined) backgroundLink.value = restoredState.backgroundLink;
    if (restoredAliases) Object.assign(aliasDictionary, restoredAliases);
    if (restoredLinks) {
      Object.values(restoredLinks)
        .map(l => ({ ...l, scopes: Object.values(l.scopes) }))
        .forEach(addLink);
    }
  };

  const initLinksStore = async () => {
    await restoreState();
  };

  const getLinks = (scope: Ref<CustomLinkScopes>) =>
    computed(() => {
      const _links = linkScopeDictionary[scope.value] ?? {};
      return Object.values(_links);
    });

  const getAlias = (type: AliasScope, id: Ref<string | undefined>) =>
    computed({
      get: () => (id.value ? aliasDictionary[type]?.[id.value] ?? '' : ''),
      set: (value: string) => {
        if (!id.value) return;
        if (!aliasDictionary[type]) aliasDictionary[type] = {};
        aliasDictionary[type]![id.value] = value;
        saveAlias().catch(err => logger.error('Failed to save alias', { id, type, err }));
      },
    });

  const aliasEnabled = computed({
    get: () => enabled.value,
    set: (value: boolean) => {
      enabled.value = value;
      saveState().catch(err => logger.error('Failed to save link settings', { value, err }));
    },
  });

  const openLinkInBackground = computed({
    get: () => backgroundLink.value,
    set: (value: boolean) => {
      backgroundLink.value = value;
      saveState().catch(err => logger.error('Failed to save link settings.', { value, err }));
    },
  });

  const openTab = (url?: string, active?: boolean) => {
    if (!url) return;
    createTab({ url, active: active ?? !openLinkInBackground.value });
  };

  return { initLinksStore, clearState, linkDictionary, addLink, removeLink, getLinks, getAlias, aliasEnabled, openLinkInBackground, openTab };
});

export const useLinksStoreRefs = () => storeToRefs(useLinksStore());
