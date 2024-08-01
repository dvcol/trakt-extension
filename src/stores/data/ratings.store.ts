import { defineStore, storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';

import type { TraktClientPagination, TraktRating, TraktRatingTypes } from '@dvcol/trakt-http-client/models';

import { ErrorService } from '~/services/error.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
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
  };
});

export const useRatingsStoreRefs = () => storeToRefs(useRatingsStore());
