import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref } from 'vue';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { asyncRefGetter } from '~/utils/vue.utils';

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
      console.warn('Already fetching movie', id);
      return;
    }

    console.info('Fetching movie', id);

    loading[id] = true;

    try {
      movies[id] = await TraktService.movie(id);
    } catch (error) {
      console.error('Failed to fetch movie', id);
      NotificationService.error(`Failed to fetch movie '${id}'.`, error);
      throw error;
    } finally {
      loading[id] = false;
    }
  };

  const getMovieLoading = (id: string | number) => computed(() => loading[id.toString()]);
  const getMovie = async (id: string | number) => {
    if (!movies[id.toString()] && !loading[id.toString()]) await fetchMovie(id);
    return movies[id.toString()];
  };
  const getMovieRef = (id: string | number, response = ref<TraktMovieExtended>()) =>
    asyncRefGetter(() => getMovie(id), getMovieLoading(id), response);

  const fetchMovieWatched = async () => {
    if (loadingWatched.value) {
      console.warn('Already fetching watched movies');
      return;
    }

    console.info('Fetching watched movies');

    loadingWatched.value = true;
    try {
      const response = await TraktService.progress.movie.watched();
      const dictionary = response.reduce<MovieWatchedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = !!movie?.plays;
        return acc;
      }, {} as MovieWatchedDictionary);
      Object.assign(moviesWatched, dictionary);
    } catch (error) {
      console.error('Failed to fetch watched movies');
      NotificationService.error('Failed to fetch watched movies', error);
      throw error;
    } finally {
      loadingWatched.value = false;
    }
  };

  const getMovieWatched = (id: string | number) => computed(() => moviesWatched[id.toString()]);

  const fetchMovieCollected = async () => {
    if (loadingCollected.value) {
      console.warn('Already fetching collected movies');
      return;
    }

    console.info('Fetching collected movies');

    loadingCollected.value = true;
    try {
      const response = await TraktService.progress.movie.collection();
      const dictionary = response.reduce<MovieCollectedDictionary>((acc, movie) => {
        acc[movie.movie.ids.trakt.toString()] = true;
        return acc;
      }, {} as MovieCollectedDictionary);
      Object.assign(moviesCollected, dictionary);
    } catch (error) {
      console.error('Failed to fetch collected movies');
      NotificationService.error('Failed to fetch collected movies', error);
      throw error;
    } finally {
      loadingCollected.value = false;
    }
  };

  const getMovieCollected = (id: string | number) => computed(() => moviesCollected[id.toString()]);

  return {
    clearState,
    fetchMovie,
    getMovie,
    getMovieRef,
    getMovieLoading,
    fetchMovieWatched,
    getMovieWatched,
    loadingWatched,
    fetchMovieCollected,
    getMovieCollected,
    loadingCollected,
  };
});

export const useMovieStoreRefs = () => storeToRefs(useMovieStore());
