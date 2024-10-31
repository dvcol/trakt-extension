import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktCollection, TraktMovieExtended, TraktWatched } from '@dvcol/trakt-http-client/models';

import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useSimklStore, useSimklStoreRefs } from '~/stores/data/simkl.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { storage } from '~/utils/browser/browser-storage.utils';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

type MovieDictionary = Record<string, TraktMovieExtended>;
type MovieWatchedDictionary = Record<string, TraktWatched<'movie'>>;
type MovieCollectedDictionary = Record<string, TraktCollection<'movie'>>;

type LoadingDictionary = Record<string, boolean>;

type MovieState = {
  init: boolean;
};

const MovieStoreConstants = {
  Store: 'data.movie',
};

export const useMovieStore = defineStore(MovieStoreConstants.Store, () => {
  const movies = reactive<MovieDictionary>({});
  const moviesWatched = reactive<MovieWatchedDictionary>({});
  const moviesCollected = reactive<MovieCollectedDictionary>({});
  const init = ref(false);

  const loading = reactive<LoadingDictionary>({});
  const loadingWatched = ref(false);
  const loadingCollected = ref(false);

  const movieErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('movie', movieErrors);

  const saveState = async () =>
    storage.local.set<MovieState>(MovieStoreConstants.Store, {
      init: init.value,
    });

  const restoreState = async () => {
    const restored = await storage.local.get<MovieState>(MovieStoreConstants.Store);

    if (restored?.init !== undefined) init.value = restored.init;
  };

  const clearMovieWatchedProgress = () => clearProxy(moviesWatched);
  const clearMovieCollectedProgress = () => clearProxy(moviesCollected);

  const clearProgressState = () => {
    clearMovieWatchedProgress();
    clearMovieCollectedProgress();

    loadingWatched.value = false;
    loadingCollected.value = false;
  };

  const clearState = () => {
    clearProxy(movies);
    clearProxy(loading);
    clearProgressState();
    clearProxy(movieErrors);
  };

  const { simklEnabled } = useSimklStoreRefs();
  const { fetchMovie: fetchSimklMovie } = useSimklStore();
  const { user, isAuthenticated } = useAuthSettingsStoreRefs();
  const fetchMovie = async (id: string | number, force?: boolean) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch movie, user is not authenticated');
      return;
    }
    if (loading[id]) {
      Logger.warn('Already fetching movie', id);
      return;
    }

    Logger.debug('Fetching movie', id);

    loading[id] = true;

    try {
      movies[id] = await TraktService.movie(id, force);
      if (simklEnabled.value && movies[id]?.ids?.imdb) await fetchSimklMovie(movies[id].ids.imdb, force);
      delete movieErrors[id.toString()];
    } catch (error) {
      Logger.error('Failed to fetch movie', id);
      NotificationService.error(`Failed to fetch movie '${id}'.`, error);
      movieErrors[id.toString()] = ErrorCount.fromDictionary(movieErrors, id.toString(), error);
      throw error;
    } finally {
      loading[id] = false;
    }
  };

  const getMovieLoading = (id: string | number) => computed(() => loading[id.toString()]);
  const getMovie = (id: string | number) => computed(() => movies[id.toString()]);

  const fetchMovieWatched = async (force?: boolean) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch watched movies, user is not authenticated');
      return;
    }
    if (loadingWatched.value) {
      Logger.warn('Already fetching watched movies');
      return;
    }

    Logger.debug('Fetching watched movies', { force });

    if (force) clearMovieWatchedProgress();

    loadingWatched.value = true;
    try {
      const response = await TraktService.progress.movie.watched(force);
      delete movieErrors.watched;
      response.forEach(m => {
        moviesWatched[m.movie.ids.trakt.toString()] = m;
      });
    } catch (error) {
      Logger.error('Failed to fetch watched movies');
      NotificationService.error('Failed to fetch watched movies', error);
      movieErrors.watched = ErrorCount.fromDictionary(movieErrors, 'watched', error);
      throw error;
    } finally {
      loadingWatched.value = false;
    }
  };

  const fetchMovieCollected = async (force?: boolean) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch collected movies, user is not authenticated');
      return;
    }
    if (loadingCollected.value) {
      Logger.warn('Already fetching collected movies');
      return;
    }

    Logger.debug('Fetching collected movies', { force });

    if (force) clearMovieCollectedProgress();

    loadingCollected.value = true;
    try {
      const response = await TraktService.progress.movie.collection(force);
      delete movieErrors.collected;
      response.forEach(m => {
        moviesCollected[m.movie.ids.trakt.toString()] = m;
      });
    } catch (error) {
      Logger.error('Failed to fetch collected movies');
      NotificationService.error('Failed to fetch collected movies', error);
      movieErrors.collected = ErrorCount.fromDictionary(movieErrors, 'collected', error);
      throw error;
    } finally {
      loadingCollected.value = false;
    }
  };

  const getMovieCollected = (id: string | number) => computed(() => moviesCollected[id.toString()]);
  const getMovieWatched = (id: string | number) => computed(() => moviesWatched[id.toString()]);

  const initMovieStore = async () => {
    await restoreState();

    watch(user, () => clearProgressState());

    if (!init.value) return;
    if (!isAuthenticated.value) return;
    await Promise.all([fetchMovieWatched(), fetchMovieCollected()]);
  };

  return {
    initMovieStore,
    clearState,
    clearProgressState,
    fetchMovie,
    getMovie,
    getMovieLoading,
    fetchMovieWatched,
    getMovieWatched,
    loadingWatched,
    fetchMovieCollected,
    getMovieCollected,
    loadingCollected,
    clearMovieWatchedProgress,
    init: computed({
      get: () => init.value,
      set: (value: boolean) => {
        init.value = value;
        saveState().catch(e => Logger.error('Failed to save movie init state', e));
        if (value) return Promise.all([fetchMovieWatched(), fetchMovieCollected()]);
      },
    }),
  };
});

export const useMovieStoreRefs = () => storeToRefs(useMovieStore());
