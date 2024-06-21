import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref, watch } from 'vue';

import type { TraktMovieExtended } from '@dvcol/trakt-http-client/models';

import { ErrorService } from '~/services/error.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { ErrorCount, type ErrorDictionary } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

type MovieDictionary = Record<string, TraktMovieExtended>;
type MovieWatchedDictionary = Record<string, boolean>;
type MovieCollectedDictionary = Record<string, boolean>;

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

  const clearProgressState = () => {
    clearProxy(moviesWatched);
    clearProxy(moviesCollected);

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
      logger.warn('Already fetching movie', id);
      return;
    }

    logger.debug('Fetching movie', id);

    loading[id] = true;

    try {
      movies[id] = await TraktService.movie(id);
      delete movieErrors[id.toString()];
    } catch (error) {
      logger.error('Failed to fetch movie', id);
      NotificationService.error(`Failed to fetch movie '${id}'.`, error);
      movieErrors[id.toString()] = ErrorCount.fromDictionary(movieErrors, id.toString(), error);
      throw error;
    } finally {
      loading[id] = false;
    }
  };

  const getMovieLoading = (id: string | number) => computed(() => loading[id.toString()]);
  const getMovie = (id: string | number) => computed(() => movies[id.toString()]);

  const fetchMovieWatched = async () => {
    if (loadingWatched.value) {
      logger.warn('Already fetching watched movies');
      return;
    }

    logger.debug('Fetching watched movies');

    loadingWatched.value = true;
    try {
      const response = await TraktService.progress.movie.watched();
      delete movieErrors.watched;
      const dictionary = response.reduce<MovieWatchedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = !!movie?.plays;
        return acc;
      }, {} as MovieWatchedDictionary);
      Object.assign(moviesWatched, dictionary);
    } catch (error) {
      logger.error('Failed to fetch watched movies');
      NotificationService.error('Failed to fetch watched movies', error);
      movieErrors.watched = ErrorCount.fromDictionary(movieErrors, 'watched', error);
      throw error;
    } finally {
      loadingWatched.value = false;
    }
  };

  const getMovieWatched = (id: string | number) => computed(() => moviesWatched[id.toString()]);
  const changeMovieWatched = (id: string | number, remove?: boolean) => {
    moviesWatched[id.toString()] = !remove;
  };

  const fetchMovieCollected = async () => {
    if (loadingCollected.value) {
      logger.warn('Already fetching collected movies');
      return;
    }

    logger.debug('Fetching collected movies');

    loadingCollected.value = true;
    try {
      const response = await TraktService.progress.movie.collection();
      delete movieErrors.collected;
      const dictionary = response.reduce<MovieCollectedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = true;
        return acc;
      }, {} as MovieCollectedDictionary);
      Object.assign(moviesCollected, dictionary);
    } catch (error) {
      logger.error('Failed to fetch collected movies');
      NotificationService.error('Failed to fetch collected movies', error);
      movieErrors.collected = ErrorCount.fromDictionary(movieErrors, 'collected', error);
      throw error;
    } finally {
      loadingCollected.value = false;
    }
  };

  const getMovieCollected = (id: string | number) => computed(() => moviesCollected[id.toString()]);
  const changeMovieCollected = (id: string | number, remove?: boolean) => {
    moviesCollected[id.toString()] = !remove;
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
    loadingWatched,
    fetchMovieCollected,
    getMovieCollected,
    loadingCollected,
    changeMovieWatched,
    changeMovieCollected,
  };
});

export const useMovieStoreRefs = () => storeToRefs(useMovieStore());
