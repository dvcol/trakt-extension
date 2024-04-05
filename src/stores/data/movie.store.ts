import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref } from 'vue';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { asyncRefGetter } from '~/utils/vue.utils';

type MovieDictionary = Record<string, TraktMovieExtended>;
type LoadingDictionary = Record<string, boolean>;

export const useMovieStore = defineStore('data.movie', () => {
  const movies = reactive<MovieDictionary>({});
  const loading = reactive<LoadingDictionary>({});

  const clearState = () => {
    Object.assign(movies, {});
    Object.assign(loading, {});
  };

  const fetchMovie = async (id: string | number) => {
    if (loading[id]) {
      console.warn('Already fetching movie', id);
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

  return {
    clearState,
    fetchMovie,
    getMovie,
    getMovieRef,
    getMovieLoading,
  };
});

export const useMovieStoreRefs = () => storeToRefs(useMovieStore());
