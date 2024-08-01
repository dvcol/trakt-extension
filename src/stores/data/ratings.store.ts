import {
  type TraktApiIds,
  type TraktClientPagination,
  type TraktRating,
  type TraktRatingRequest,
  TraktRatingType,
  type TraktRatingTypes,
  type TraktSyncRatingValue,
} from '@dvcol/trakt-http-client/models';
import { defineStore, storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';

import { ErrorService } from '~/services/error.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { useI18n } from '~/utils/i18n.utils';
import { ErrorCount, type ErrorDictionary, shouldRetry } from '~/utils/retry.utils';

import { clearProxy } from '~/utils/vue.utils';

type TraktRatingsReturn<T extends TraktRatingTypes> = T extends 'movies'
  ? TraktRating<'movie'>
  : T extends 'shows'
    ? TraktRating<'show'>
    : T extends 'seasons'
      ? TraktRating<'season'>
      : T extends 'episodes'
        ? TraktRating<'episode'>
        : TraktRating;

type RatingsLoadingDictionary = Partial<Record<TraktRatingTypes, boolean>>;
type RatingsDictionary<T extends TraktRatingTypes = TraktRatingTypes> = Partial<Record<T, Record<string, TraktRatingsReturn<T>>>>;
type RatingsPaginationDictionary = Partial<Record<TraktRatingTypes, TraktClientPagination>>;

const isMovieRating = (rating: TraktRating): rating is TraktRating<'movie'> => rating.type === 'movie';
const isShowRating = (rating: TraktRating): rating is TraktRating<'show'> => rating.type === 'show';
const isSeasonRating = (rating: TraktRating): rating is TraktRating<'season'> => rating.type === 'season';
const isEpisodeRating = (rating: TraktRating): rating is TraktRating<'episode'> => rating.type === 'episode';

const pageLoaded = (pagination?: TraktClientPagination) => pagination && pagination.page >= pagination.pageCount;

const updateRatings = (rating: TraktRating, score: TraktSyncRatingValue) => {
  rating.rating = score;
  rating.rated_at = new Date().toISOString();
};

const createRatings = <T extends 'movie' | 'show' | 'season' | 'episode'>(
  dictionary: RatingsDictionary,
  ratingTypes: TraktRatingTypes,
  ids: Pick<TraktApiIds, 'trakt'>,
  rating: TraktSyncRatingValue,
  ratingType: T,
  prefix?: string | number,
) => {
  if (!dictionary[ratingTypes]) dictionary[ratingTypes] = {};
  dictionary[ratingTypes]![prefix ? `${prefix}-${ids.trakt}` : ids.trakt] = {
    rated_at: new Date().toISOString(),
    rating,
    [ratingTypes]: { ids },
    type: ratingType,
  } as never;
};

const RatingsStoreConstants = {
  Store: 'data.ratings',
} as const;

export const useRatingsStore = defineStore(RatingsStoreConstants.Store, () => {
  const ratings = reactive<RatingsDictionary>({});
  const loading = reactive<RatingsLoadingDictionary>({});
  const errors = reactive<ErrorDictionary>({});

  const pageSize = ref(500);
  const paginations = reactive<RatingsPaginationDictionary>({});

  ErrorService.registerDictionary('ratings', errors);

  const i18n = useI18n('rating');

  const clearState = () => {
    clearProxy(ratings);
    clearProxy(loading);
    clearProxy(errors);
    clearProxy(paginations);
  };

  const getQuery = (type: TraktRatingTypes) => ({ type, pagination: { page: (paginations[type]?.page ?? 0) + 1, limit: pageSize.value } });

  const fetchRatings = async (type: TraktRatingTypes) => {
    if (loading[type]) {
      logger.warn('Already fetching ratings', type);
      return;
    }

    if (pageLoaded(paginations[type])) {
      logger.warn('Already fetched all ratings', type);
      return;
    }

    logger.debug('Fetching ratings', type);

    loading[type] = true;

    const query = getQuery(type);

    try {
      const { data, pagination } = await TraktService.ratings.get(query);

      data.forEach(rating => {
        if (!ratings[type]) ratings[type] = {};
        if (isMovieRating(rating)) {
          ratings[type]![rating.movie.ids.trakt] = rating;
        } else if (isShowRating(rating)) {
          ratings[type]![rating.show.ids.trakt] = rating;
        } else if (isSeasonRating(rating)) {
          ratings[type]![`${rating.show.ids.trakt}-${rating.season.ids.trakt}`] = rating;
        } else if (isEpisodeRating(rating)) {
          ratings[type]![`${rating.show.ids.trakt}-${rating.episode.ids.trakt}`] = rating;
        }
      });
      paginations[type] = pagination;
      delete errors[JSON.stringify(query)];
    } catch (error) {
      logger.error('Failed to fetch ratings', type);
      NotificationService.error(`Failed to fetch ratings '${type}'.`, error);
      errors[JSON.stringify(query)] = ErrorCount.fromDictionary(errors, JSON.stringify(query), error);
      throw error;
    } finally {
      loading[type] = false;
    }
  };

  const updateDictionary = (query: TraktRatingRequest, showId?: number) => {
    if (query.movies) {
      query.movies.forEach(movie => {
        const _rating = ratings[TraktRatingType.Movies]?.[movie.ids.trakt];
        if (_rating) return updateRatings(_rating, movie.rating);
        return createRatings(ratings, TraktRatingType.Movies, movie.ids, movie.rating, 'movie');
      });
    }
    if (query.shows) {
      query.shows.forEach(show => {
        const _rating = ratings[TraktRatingType.Shows]?.[show.ids.trakt];
        if (_rating) return updateRatings(_rating, show.rating);
        return createRatings(ratings, TraktRatingType.Shows, show.ids, show.rating, 'show');
      });
    }
    if (query.seasons) {
      query.seasons.forEach(season => {
        if (!showId) return;
        const _rating = ratings[TraktRatingType.Seasons]?.[`${showId}-${season.ids.trakt}`];
        if (_rating) return updateRatings(_rating, season.rating);
        return createRatings(ratings, TraktRatingType.Seasons, season.ids, season.rating, 'season', showId);
      });
    }
    if (query.episodes) {
      query.episodes.forEach(episode => {
        if (!showId) return;
        const _rating = ratings[TraktRatingType.Episodes]?.[`${showId}-${episode.ids.trakt}`];
        if (_rating) return updateRatings(_rating, episode.rating);
        return createRatings(ratings, TraktRatingType.Episodes, episode.ids, episode.rating, 'episode', showId);
      });
    }
  };

  const addRating = async (type: TraktRatingTypes, query: TraktRatingRequest, showId?: number) => {
    if (loading[type]) {
      logger.warn('Already fetching or adding ratings', type);
      return;
    }

    logger.debug('Adding ratings', query);

    loading[type] = true;

    try {
      await TraktService.ratings.add(query);
      updateDictionary(query, showId);
      NotificationService.message.success(i18n('rating_added_success', 'common', 'rating'));
    } catch (error) {
      logger.error('Failed to add ratings');
      NotificationService.error(i18n('rating_added_error', 'common', 'rating'), error);
      throw error;
    } finally {
      loading[type] = false;
    }
  };

  const removeRating = async (type: TraktRatingTypes, query: TraktRatingRequest, showId?: number) => {
    if (loading[type]) {
      logger.warn('Already fetching or removing ratings', type);
      return;
    }

    logger.debug('Removing ratings', query);

    loading[type] = true;

    try {
      await TraktService.ratings.remove(query);
      updateDictionary(query, showId);
      NotificationService.message.success(i18n('rating_remove_success', 'common', 'rating'));
    } catch (error) {
      logger.error('Failed to remove ratings');
      NotificationService.error(i18n('rating_remove_error', 'common', 'rating'), error);
      throw error;
    } finally {
      loading[type] = false;
    }
  };

  const getLoading = (type: TraktRatingTypes) => !!loading[type];
  const getRatings = <T extends TraktRatingTypes, R = TraktRatingsReturn<T> | undefined>(type: T, id: string): R => ratings[type]?.[id] as R;

  const loadRatings = async <T extends TraktRatingTypes>(type: T, id: string): Promise<TraktRatingsReturn<T> | undefined> => {
    while (
      !pageLoaded(paginations[type]) &&
      !getLoading(type) &&
      !getRatings(type, id) &&
      shouldRetry(errors[JSON.stringify(getQuery(type))], { error: `Ratings for ${type} - ${id.toString()}` })
    ) {
      // eslint-disable-next-line no-await-in-loop
      await fetchRatings(type);
    }

    return getRatings(type, id);
  };

  return {
    clearState,
    fetchRatings,
    getLoading,
    getRatings,
    loadRatings,
    addRating,
    removeRating,
  };
});

export const useRatingsStoreRefs = () => storeToRefs(useRatingsStore());
