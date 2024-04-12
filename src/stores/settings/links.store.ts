import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, type Ref } from 'vue';

import type { TagLink } from '~/models/tag.model';

import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

type CustomLinkScope = 'movie' | 'show' | 'season' | 'episode' | 'person' | 'all';
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
type CustomLink = TagLink & {
  url: string;
  scope: CustomLinkScope;
  icon?: 'external';
};

export const resolveLinkUrl = (url: string, substitutions: CustomLinkSubstitution) => {
  console.info('resolveUrl', { url, substitutions });
  return url;
};

export type AliasScope = 'movie' | 'show';

type CustomLinkDictionary = Record<string, CustomLink>;
type CustomLinkScopeDictionary = Partial<Record<CustomLinkScope, CustomLinkDictionary>>;
type AliasDictionary = Partial<Record<AliasScope, Record<string, string>>>;

export const useLinksStore = defineStore('settings.links', () => {
  const enabled = ref(false);
  const aliasDictionary = reactive<AliasDictionary>({});

  const linkDictionary = reactive<CustomLinkDictionary>({});
  const linkScopeDictionary = reactive<CustomLinkScopeDictionary>({});

  const clearState = () => {
    Object.assign(aliasDictionary, {});
    Object.assign(linkDictionary, {});
    Object.assign(linkScopeDictionary, {});
  };

  const saveState = debounce(() => storage.sync.set('settings.links', { enabled: enabled.value }), 1000);
  const saveAlias = debounce(() => storage.sync.set('settings.links.aliases', aliasDictionary), 1000);
  const saveLinks = debounce(() => storage.sync.set('settings.links.links', linkDictionary), 1000);

  const links = computed(() => Object.values(linkDictionary));

  const addLink = (link: CustomLink) => {
    linkDictionary[link.label] = link;
    if (!linkScopeDictionary[link.scope]) linkScopeDictionary[link.scope] = {};
    linkScopeDictionary[link.scope]![link.label] = link;
    saveLinks().catch(console.error);
  };

  const removeLink = (link: CustomLink) => {
    if (linkDictionary[link.label]) delete linkDictionary[link.label];
    if (linkScopeDictionary[link.scope]?.[link.label]) delete linkScopeDictionary[link.scope]![link.label];
    saveLinks().catch(console.error);
  };

  const restoreState = async () => {
    const [restoredState, restoredAliases, restoredLinks] = await Promise.all([
      storage.sync.get<{ enabled: boolean }>('settings.links'),
      storage.sync.get<AliasDictionary>('settings.links.aliases'),
      storage.sync.get<CustomLinkDictionary>('settings.links.links'),
    ]);

    console.info('restoredState', restoredState);
    if (restoredState.enabled !== undefined) enabled.value = restoredState.enabled;
    if (restoredAliases) Object.assign(aliasDictionary, restoredAliases);
    if (restoredLinks) Object.values(restoredLinks).forEach(addLink);
  };

  const initLinksStore = async () => {
    await restoreState();
  };

  const getLinks = (scope: Ref<CustomLinkScope>) =>
    computed(() => {
      const _links = linkScopeDictionary[scope.value] ?? {};
      const _allLinks = linkScopeDictionary.all ?? {};
      return Object.values({ ..._links, ..._allLinks });
    });

  const getAlias = (type: AliasScope, id: Ref<string | undefined>) =>
    computed({
      get: () => (id.value ? aliasDictionary[type]?.[id.value] ?? '' : ''),
      set: (value: string) => {
        if (!id.value) return;
        if (!aliasDictionary[type]) aliasDictionary[type] = {};
        aliasDictionary[type]![id.value] = value;
        saveAlias().catch(console.error);
      },
    });

  const aliasEnabled = computed({
    get: () => enabled.value,
    set: (value: boolean) => {
      enabled.value = value;
      saveState().catch(console.error);
    },
  });

  return { initLinksStore, clearState, linkDictionary, links, addLink, removeLink, getLinks, getAlias, aliasEnabled };
});

export const useLinksStoreRefs = () => storeToRefs(useLinksStore());
