import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';

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
  simklEnabled: boolean;
};

type UserSettings = Record<string, SimklUserSettings>;
type ShowDictionary = Record<string, SimklShow>;
type MovieDictionary = Record<string, SimklMovie>;
type AnimeDictionary = Record<string, SimklAnime>;

type LoadingDictionary = Record<string, boolean>;

export const useSimklStore = defineStore(SimklStoreConstants.Store, () => {
  const { user, isSimklAuthenticated } = useAuthSettingsStoreRefs();
  const simklEnabled = ref(false);
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

  const saveState = debounce(() =>
    storage.local.set<SimklStoreState>(SimklStoreConstants.Store, {
      simklEnabled: simklEnabled.value,
    }),
  );

  const restoreState = async () => {
    const state = await storage.local.get<SimklStoreState>(SimklStoreConstants.Store);
    if (state?.simklEnabled !== undefined) simklEnabled.value = state.simklEnabled;
  };

  /**
   * Change the current user settings for a specific account
   * @param _settings
   * @param account
   */
  const setUserSetting = async (_settings?: SimklUserSettings, account = _settings?.user?.name) => {
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

  const fetchShow = async (id: string) => {
    if (!simklEnabled.value) {
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
      shows[id] = await TraktService.simkl.show(id);
    } catch (err) {
      Logger.error('Failed to fetch simkl show', { id, err });
    } finally {
      showLoading[id] = false;
    }
  };

  const fetchAnime = async (id: string) => {
    if (!simklEnabled.value) {
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
      animes[id] = await TraktService.simkl.anime(id);
    } catch (err) {
      Logger.error('Failed to fetch simkl anime', { id, err });
    } finally {
      animeLoading[id] = false;
    }
  };

  const fetchMovie = async (id: string) => {
    if (!simklEnabled.value) {
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
      movies[id] = await TraktService.simkl.movie(id);
    } catch (err) {
      Logger.error('Failed to fetch simkl movie', { id, err });
    } finally {
      movieLoading[id] = false;
    }
  };

  const getShow = (id: string | number) => computed(() => shows[id.toString()]);
  const getAnime = (id: string | number) => computed(() => animes[id.toString()]);
  const getShowOrAnime = (id: string | number) => computed(() => shows[id.toString()] || animes[id.toString()]);
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
      get: () => simklAllowed.value && simklEnabled.value,
      set: (value: boolean) => {
        simklEnabled.value = value;
        saveState().catch(err => Logger.error('Failed to save simkl state', { value, err }));
      },
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
