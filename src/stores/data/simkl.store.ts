import { chromeRuntimeId } from '@dvcol/web-extension-utils/chrome/runtime';
import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive } from 'vue';

import type { SimklAnime, SimklMovie, SimklShow, SimklUserSettings } from '@dvcol/simkl-http-client/models';

import { Logger } from '~/services/logger.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

const SimklStoreConstants = {
  Store: 'data.simkl',
} as const;

type SimklStoreState = {
  simklEnabled: Record<string, boolean>;
};

type UserSettings = Record<string, SimklUserSettings>;
type ShowDictionary = Record<string, SimklShow>;
type MovieDictionary = Record<string, SimklMovie>;
type AnimeDictionary = Record<string, SimklAnime>;

type SimklShowOrAnime = SimklShow | SimklAnime;

type LoadingDictionary = Record<string, boolean>;

export const useSimklStore = defineStore(SimklStoreConstants.Store, () => {
  const { user, isSimklAuthenticated } = useAuthSettingsStoreRefs();
  const simklEnabled = reactive<SimklStoreState['simklEnabled']>({});
  const userSettings = reactive<UserSettings>({});
  const shows = reactive<ShowDictionary>({});
  const movies = reactive<MovieDictionary>({});
  const animes = reactive<AnimeDictionary>({});

  const loading = reactive<LoadingDictionary>({});
  const showLoading = reactive<LoadingDictionary>({});
  const movieLoading = reactive<LoadingDictionary>({});
  const animeLoading = reactive<LoadingDictionary>({});

  const simklAllowed = computed(() => ['dvcol', 'Anshur'].includes(user.value));
  const userSetting = computed(() => userSettings[user.value]);
  const userSettingLoading = computed(() => loading?.[user.value]);
  const userEnabled = computed(() => simklEnabled[user.value]);

  const saveState = debounce(() =>
    storage.local.set<SimklStoreState>(SimklStoreConstants.Store, {
      simklEnabled,
    }),
  );

  const restoreState = async () => {
    const state = await storage.local.get<SimklStoreState>(SimklStoreConstants.Store);
    if (state?.simklEnabled !== undefined) Object.assign(simklEnabled, state.simklEnabled);
  };

  const setUserEnabled = (value: boolean, account = user.value) => {
    if (!account) throw new Error('Account is not set');
    simklEnabled[account] = value;
    saveState().catch(err => Logger.error('Failed to save simkl state', { value, err }));
    return userEnabled.value;
  };

  /**
   * Change the current user settings for a specific account
   * @param _settings
   * @param account
   */
  const setUserSetting = async (_settings?: SimklUserSettings, account = user.value) => {
    if (!account) throw new Error('Account is not set');
    if (!_settings) {
      delete userSettings[account];
      return _settings;
    }

    if (!userSettings[account]) userSettings[account] = _settings;
    else Object.assign(userSettings[account], _settings);

    return userSetting.value;
  };

  const fetchUserSettings = async (account = user.value) => {
    if (!isSimklAuthenticated.value) {
      Logger.error('Cannot fetch user settings, user is not authenticated');
      return;
    }
    if (loading?.[account]) {
      Logger.warn('User settings are already loading', { user: account });
      return;
    }

    Logger.debug('Refreshing user settings', { user: account });

    loading[account] = true;
    try {
      await setUserSetting(await TraktService.simkl.settings());
    } catch (err) {
      Logger.error('Failed to refresh user settings', { user: account, err });
    } finally {
      loading[account] = false;
    }
  };

  const fetchShow = async (id: string, force?: boolean, extended = true) => {
    if (!userEnabled.value) {
      Logger.error('Cannot fetch show, simkl is not enabled');
      return;
    }
    if (showLoading[id]) {
      Logger.warn('Simkl show is already loading', { id });
      return;
    }

    Logger.debug('Fetching simkl show', { id });
    showLoading[id] = true;
    try {
      shows[id] = await TraktService.simkl.show(id, extended, force);
    } catch (err) {
      Logger.error('Failed to fetch simkl show', { id, err });
    } finally {
      showLoading[id] = false;
    }
  };

  const fetchAnime = async (id: string, force?: boolean, extended = true) => {
    if (!userEnabled.value) {
      Logger.error('Cannot fetch anime, simkl is not enabled');
      return;
    }
    if (animeLoading[id]) {
      Logger.warn('Simkl anime is already loading', { id });
      return;
    }

    Logger.debug('Fetching simkl anime', { id });
    animeLoading[id] = true;
    try {
      animes[id] = await TraktService.simkl.anime(id, extended, force);
    } catch (err) {
      Logger.error('Failed to fetch simkl anime', { id, err });
    } finally {
      animeLoading[id] = false;
    }
  };

  const fetchMovie = async (id: string, force?: boolean, extended = true) => {
    if (!userEnabled.value) {
      Logger.error('Cannot fetch movie, simkl is not enabled');
      return;
    }
    if (movieLoading[id]) {
      Logger.warn('Simkl movie is already loading', { id });
      return;
    }

    Logger.debug('Fetching simkl movie', { id });
    movieLoading[id] = true;
    try {
      movies[id] = await TraktService.simkl.movie(id, extended, force);
    } catch (err) {
      Logger.error('Failed to fetch simkl movie', { id, err });
    } finally {
      movieLoading[id] = false;
    }
  };

  const getShow = (id: string | number) => computed(() => shows[id.toString()]);
  const getAnime = (id: string | number) => computed(() => animes[id.toString()]);
  const getShowOrAnime = (id: string | number) => computed<SimklShowOrAnime | undefined>(() => shows[id.toString()] || animes[id.toString()]);
  const getMovie = (id: string | number) => computed(() => movies[id.toString()]);

  const getShowLoading = (id: string | number) => computed(() => showLoading[id.toString()]);
  const getAnimeLoading = (id: string | number) => computed(() => animeLoading[id.toString()]);
  const getMovieLoading = (id: string | number) => computed(() => movieLoading[id.toString()]);
  const getShowOrAnimeLoading = (id: string | number) => computed(() => showLoading[id.toString()] || animeLoading[id.toString()]);

  const initSimklStore = async () => {
    await restoreState();
  };

  return {
    user,
    userSetting,
    userSettingLoading,
    fetchUserSettings,
    setUserSetting,
    simklAllowed,
    simklEnabled: computed({
      get: () => simklAllowed.value && userEnabled.value && !!chromeRuntimeId,
      set: (value: boolean) => setUserEnabled(value),
    }),
    initSimklStore,
    fetchShow,
    fetchAnime,
    fetchMovie,
    getShow,
    getAnime,
    getMovie,
    getShowLoading,
    getAnimeLoading,
    getMovieLoading,
    getShowOrAnime,
    getShowOrAnimeLoading,
  };
});

export const useSimklStoreRefs = () => storeToRefs(useSimklStore());
