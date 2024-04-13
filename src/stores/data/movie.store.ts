import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref } from 'vue';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';

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

  const clearState = () => {
    Object.assign(movies, {});
    Object.assign(moviesWatched, {});
    Object.assign(moviesCollected, {});

    Object.assign(loading, {});
    loadingWatched.value = false;
    loadingCollected.value = false;
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
    } catch (error) {
      logger.error('Failed to fetch movie', id);
      NotificationService.error(`Failed to fetch movie '${id}'.`, error);
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
      const dictionary = response.reduce<MovieWatchedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = !!movie?.plays;
        return acc;
      }, {} as MovieWatchedDictionary);
      Object.assign(moviesWatched, dictionary);
    } catch (error) {
      logger.error('Failed to fetch watched movies');
      NotificationService.error('Failed to fetch watched movies', error);
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
      const dictionary = response.reduce<MovieCollectedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = true;
        return acc;
      }, {} as MovieCollectedDictionary);
      Object.assign(moviesCollected, dictionary);
    } catch (error) {
      logger.error('Failed to fetch collected movies');
      NotificationService.error('Failed to fetch collected movies', error);
      throw error;
    } finally {
      loadingCollected.value = false;
    }
  };

  const getMovieCollected = (id: string | number) => computed(() => moviesCollected[id.toString()]);
  const changeMovieCollected = (id: string | number, remove?: boolean) => {
    moviesCollected[id.toString()] = !remove;
  };

  return {
    clearState,
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
