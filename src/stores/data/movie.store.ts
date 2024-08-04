import { wait } from '@dvcol/common-utils/common/promise';
import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktMovieExtended } from '@dvcol/trakt-http-client/models';

import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

type MovieDictionary = Record<string, TraktMovieExtended>;
type MovieWatchedDictionary = Record<string, boolean>;
type MovieCollectedDictionary = Record<string, boolean>;
type MovieDateDictionary = Record<string, Date>;

type LoadingDictionary = Record<string, boolean>;

export const useMovieStore = defineStore('data.movie', () => {
  const movies = reactive<MovieDictionary>({});
  const moviesWatched = reactive<MovieWatchedDictionary>({});
  const moviesCollected = reactive<MovieCollectedDictionary>({});

  const moviesWatchedDates = reactive<MovieDateDictionary>({});
  const moviesCollectedDates = reactive<MovieDateDictionary>({});

  const loading = reactive<LoadingDictionary>({});
  const loadingWatched = ref(false);
  const loadingCollected = ref(false);

  const movieErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('movie', movieErrors);

  const clearMovieWatchedProgress = () => clearProxy(moviesWatched);

  const clearProgressState = () => {
    clearMovieWatchedProgress();
    clearProxy(moviesCollected);
    clearProxy(moviesWatchedDates);
    clearProxy(moviesCollectedDates);

    loadingWatched.value = false;
    loadingCollected.value = false;
  };

  const clearState = () => {
    clearProxy(movies);
    clearProxy(loading);
    clearProgressState();
    clearProxy(movieErrors);
  };

  const fetchMovie = async (id: string | number) => {
    if (loading[id]) {
      Logger.warn('Already fetching movie', id);
      return;
    }

    Logger.debug('Fetching movie', id);

    loading[id] = true;

    try {
      movies[id] = await TraktService.movie(id);
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
    if (loadingWatched.value) {
      Logger.warn('Already fetching watched movies');
      return;
    }

    Logger.debug('Fetching watched movies');

    if (force) clearMovieWatchedProgress();

    loadingWatched.value = true;
    try {
      const response = await TraktService.progress.movie.watched(force);
      delete movieErrors.watched;
      const dictionary = response.reduce<MovieWatchedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = !!movie?.plays;
        if (movie?.last_watched_at) {
          moviesWatchedDates[movie.movie.ids.trakt.toString()] = new Date(movie.last_watched_at);
        }
        return acc;
      }, {} as MovieWatchedDictionary);
      Object.assign(moviesWatched, dictionary);
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
  const getMovieWatchedDate = (id: string | number) => computed(() => moviesWatchedDates[id.toString()]);
  const changeMovieWatched = async (id: string | number, remove?: boolean) => {
    moviesWatched[id.toString()] = !remove;
    await wait(500);
    return fetchMovieWatched();
  };

  const fetchMovieCollected = async () => {
    if (loadingCollected.value) {
      Logger.warn('Already fetching collected movies');
      return;
    }

    Logger.debug('Fetching collected movies');

    loadingCollected.value = true;
    try {
      const response = await TraktService.progress.movie.collection();
      delete movieErrors.collected;
      const dictionary = response.reduce<MovieCollectedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = true;
        if (movie?.collected_at) {
          moviesCollectedDates[movie.movie.ids.trakt.toString()] = new Date(movie.collected_at);
        }
        return acc;
      }, {} as MovieCollectedDictionary);
      Object.assign(moviesCollected, dictionary);
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
  const getMovieCollectedDate = (id: string | number) => computed(() => moviesCollectedDates[id.toString()]);
  const changeMovieCollected = async (id: string | number, remove?: boolean) => {
    moviesCollected[id.toString()] = !remove;
    await wait(500);
    return fetchMovieCollected();
  };

  const { user } = useUserSettingsStoreRefs();
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
    getMovieWatchedDate,
    loadingWatched,
    fetchMovieCollected,
    getMovieCollected,
    getMovieCollectedDate,
    loadingCollected,
    changeMovieWatched,
    changeMovieCollected,
    clearMovieWatchedProgress,
  };
});

export const useMovieStoreRefs = () => storeToRefs(useMovieStore());
