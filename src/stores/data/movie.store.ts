import { wait } from '@dvcol/common-utils/common/promise';
import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktCollection, TraktMovieExtended, TraktWatched } from '@dvcol/trakt-http-client/models';

import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useSimklStore, useSimklStoreRefs } from '~/stores/data/simkl.store';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

type MovieDictionary = Record<string, TraktMovieExtended>;
type MovieWatchedDictionary = Record<string, TraktWatched<'movie'>>;
type MovieCollectedDictionary = Record<string, TraktCollection<'movie'>>;

type LoadingDictionary = Record<string, boolean>;

export const useMovieStore = defineStore('data.movie', () => {
  const movies = reactive<MovieDictionary>({});
  const moviesWatched = reactive<MovieWatchedDictionary>({});
  const moviesCollected = reactive<MovieCollectedDictionary>({});

  const loading = reactive<LoadingDictionary>({});
  const loadingWatched = ref(false);
  const loadingCollected = ref(false);

  const movieErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('movie', movieErrors);

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
      if (simklEnabled.value && movies[id]?.ids?.imdb) await fetchSimklMovie(movies[id].ids.imdb);
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

  const getMovieWatched = (id: string | number) => computed(() => moviesWatched[id.toString()]);
  const changeMovieWatched = async (id: string | number, remove?: boolean) => {
    if (remove) delete moviesWatched[id.toString()];
    else {
      moviesWatched[id.toString()] = {
        plays: 1,
        last_watched_at: new Date().toISOString(),
        last_updated_at: movies[id.toString()]?.updated_at,
        movie: movies[id.toString()],
      };
    }
    await wait(500);
    return fetchMovieWatched();
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
      const response = await TraktService.progress.movie.collection();
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
  const changeMovieCollected = async (id: string | number, remove?: boolean) => {
    if (remove) delete moviesCollected[id.toString()];
    else {
      moviesCollected[id.toString()] = {
        collected_at: new Date().toISOString(),
        updated_at: movies[id.toString()]?.updated_at,
        movie: movies[id.toString()],
      };
    }
    await wait(500);
    return fetchMovieCollected();
  };

  const resetMovieWatched = async (id?: string | number) => {
    if (id) delete moviesWatched[id.toString()];
    await fetchMovieWatched(true);
  };

  const initMovieStore = () => {
    watch(user, () => {
      clearProgressState();
    });
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
    changeMovieWatched,
    changeMovieCollected,
    clearMovieWatchedProgress,
    resetMovieWatched,
  };
});

export const useMovieStoreRefs = () => storeToRefs(useMovieStore());
