import { type JsonWriterOptions, writeJson } from '@dvcol/common-utils/common/save';
import { capitalizeEachWord } from '@dvcol/common-utils/common/string';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref, type Ref } from 'vue';

import type { TagLink } from '~/models/tag.model';

import {
  type AliasScope,
  type CustomLink,
  CustomLinkGenreMode,
  type CustomLinkScopes,
  type CustomLinkSubstitution,
  CustomLinkView,
  type CustomLinkViews,
} from '~/models/link.model';
import { TagType } from '~/models/tag.model';

import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';
import { clearProxy } from '~/utils/vue.utils';

export const resolveLinkUrl = (url: string, substitutions: CustomLinkSubstitution) => {
  let _url = url;
  Object.entries(substitutions).forEach(([key, value]) => {
    if (!value) return;
    const _value = typeof value === 'number' ? value.toString().padStart(2, '0') : value.toString();
    _url = _url.replace(`{{${key}}}`, encodeURIComponent(_value));
  });
  return _url;
};

export type CustomLinkDictionary = Record<CustomLink['id'], CustomLink>;
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

  const exporting = ref(false);

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

    // remove component
    link.icon = undefined;

    // update link
    linkDictionary[link.id] = link;

    // add new scopes
    if (link.scopes) Object.values(link.scopes).forEach(scope => addToScope(scope, link));
    saveLinks().catch(err => Logger.error('Failed to save link', { link, err }));
  };

  const removeLink = (id: CustomLink['id']) => {
    const link = linkDictionary[id];
    if (!link) return;
    if (linkDictionary[link.id]) delete linkDictionary[link.id];
    if (link.scopes) Object.values(link.scopes).forEach(scope => removeFromScope(scope, link.id));
    saveLinks().catch(err => Logger.error('Failed to save link', { id, err }));
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
        .map(l => ({
          view: CustomLinkView.Panel,
          genreMode: CustomLinkGenreMode.Some,
          type: TagType.Default,
          bordered: true,
          ...l,
          scopes: l.scopes ? Object.values(l.scopes) : [],
          genres: l.genres ? Object.values(l.genres) : [],
        }))
        .forEach(addLink);
    }
  };

  const exportLinks = async (
    options: JsonWriterOptions = {
      picker: {
        suggestedName: `${new Date().toISOString().replace('T', '_').replaceAll(':', '-').split('.').at(0)}_links.json`,
      },
    },
  ) => {
    if (exporting.value) {
      Logger.warn('Export already in progress');
      return false;
    }

    exporting.value = true;
    try {
      return await writeJson(Object.values(linkDictionary), options);
    } catch (err) {
      if (err instanceof Error && err?.name === 'AbortError') {
        Logger.warn('Export cancelled', err);
        return;
      }
      Logger.error('Failed to export links', { err });
      NotificationService.error('Failed to export links', err);
    } finally {
      exporting.value = false;
    }
  };

  const initLinksStore = async () => {
    await restoreState();
  };

  const getLinks = ({
    scope,
    genres,
    view = CustomLinkView.Both,
  }: {
    scope: CustomLinkScopes;
    genres?: (string | TagLink)[];
    view?: CustomLinkViews;
  }): CustomLink[] => {
    const _genres = genres?.map(g => capitalizeEachWord(typeof g === 'string' ? g : g.label));
    const _links = linkScopeDictionary[scope] ?? {};
    return Object.values(_links)
      .filter(l => !l.view || [view, l.view].includes(CustomLinkView.Both) || l.view === view)
      .filter(l => {
        if (!l.genres?.length) return true;
        if (!_genres?.length) return l.genreMode === CustomLinkGenreMode.None;
        if (l.genreMode === CustomLinkGenreMode.None) return !l.genres.filter(Boolean).some(g => _genres.includes(g));
        if (l.genreMode === CustomLinkGenreMode.Every) return l.genres.filter(Boolean).every(g => _genres.includes(g));
        return l.genres.filter(Boolean).some(g => _genres.includes(g));
      });
  };

  const getLinksRef = ({
    scope,
    genres,
    view = CustomLinkView.Both,
  }: {
    scope: Ref<CustomLinkScopes>;
    genres?: Ref<(string | TagLink)[] | undefined>;
    view?: CustomLinkViews;
  }) => computed<CustomLink[]>(() => getLinks({ scope: scope.value, genres: genres?.value, view }));

  const getAlias = (type: AliasScope, id?: string): string | undefined => {
    if (!id) return;
    return aliasDictionary[type]?.[id];
  };

  const getAliasRef = (type: AliasScope, id: Ref<string | undefined>) =>
    computed({
      get: () => getAlias(type, id.value) ?? '',
      set: (value: string) => {
        if (!id.value) return;
        if (!aliasDictionary[type]) aliasDictionary[type] = {};
        aliasDictionary[type]![id.value] = value;
        saveAlias().catch(err => Logger.error('Failed to save alias', { id, type, err }));
      },
    });

  const aliasEnabled = computed({
    get: () => enabled.value,
    set: (value: boolean) => {
      enabled.value = value;
      saveState().catch(err => Logger.error('Failed to save link settings', { value, err }));
    },
  });

  const openLinkInBackground = computed({
    get: () => backgroundLink.value,
    set: (value: boolean) => {
      backgroundLink.value = value;
      saveState().catch(err => Logger.error('Failed to save link settings.', { value, err }));
    },
  });

  return {
    initLinksStore,
    clearState,
    linkDictionary,
    addLink,
    removeLink,
    getLinks,
    getLinksRef,
    getAlias,
    getAliasRef,
    aliasEnabled,
    openLinkInBackground,
    exporting,
    exportLinks,
  };
});

export const useLinksStoreRefs = () => storeToRefs(useLinksStore());
