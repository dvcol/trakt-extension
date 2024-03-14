import type { TraktCollection, TraktCollectionAdded, TraktCollectionRemoved, TraktCollectionRequest } from '~/models/trakt/trakt-collection.model';
import type {
  TraktFavoriteAdded,
  TraktFavoriteItem,
  TraktFavoriteList,
  TraktFavoriteRemoved,
  TraktFavoriteRequest,
} from '~/models/trakt/trakt-favorite.model';
import type {
  TraktHistory,
  TraktHistoryAdded,
  TraktHistoryRemoved,
  TraktHistoryRemovedRequest,
  TraktHistoryRequest,
} from '~/models/trakt/trakt-history.model';
import type { TraktListReordered } from '~/models/trakt/trakt-list.model';
import type { TraktRating, TraktRatingAdded, TraktRatingRemoved, TraktRatingRequest } from '~/models/trakt/trakt-rating.model';
import type { TraktSyncActivities, TraktSyncProgress, TraktSyncRequest, TraktSyncUpdateRequest } from '~/models/trakt/trakt-sync.model';
import type { TraktWatched } from '~/models/trakt/trakt-watched.model';
import type { TraktWatchlist, TraktWatchlistAdded, TraktWatchlistList, TraktWatchlistRemoved } from '~/models/trakt/trakt-watchlist.model';

import { TraktApiExtended, type TraktApiParamsExtended, type TraktApiParamsPagination, TraktClientEndpoint } from '~/models/trakt/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Syncing with trakt opens up quite a few cool features.
 * Most importantly, trakt can serve as a cloud based backup for the data in your app.
 * This is especially useful when rebuilding a media center or installing a mobile app on your new phone.
 * It can also be nice to sync up multiple media centers with a central trakt account.
 * If everything is in sync, your media can be managed from trakt and be reflected in your apps.
 *
 * * <b>Media objects for syncing</b>
 *
 * As a baseline, all add and remove sync methods accept arrays of movies, shows, and episodes.
 * Each of these top level array elements should themselves be an array of standard movie, show, or episode objects.
 * Full examples are in the intro section called Standard Media Objects. Keep in mind that episode objects really only need the ids so it can find an exact match.
 * This is useful for absolute ordered shows.
 * Some methods also have optional metadata you can attach, so check the docs for each specific method.
 *
 * Media objects will be matched by ID first, then fall back to title and year. IDs will be matched in this order trakt, imdb, tmdb, tvdb, and slug.
 * If nothing is found, it will match on the title and year.
 * If still nothing, it would use just the title (or name for people) and find the most current object that exists.
 *
 * * <b>Watched History Sync</b>
 *
 * This is a 2 way sync that will get items from trakt to sync locally, plus find anything new and sync back to trakt.
 * Perform this sync on startup or at set intervals (i.e. once every day) to keep everything in sync.
 * This will only send data to trakt and not remove it.
 *
 * * <b>Collection Sync</b>
 *
 * It's very handy to have a snapshot on trakt of everything you have available to watch locally.
 * Syncing your local connection will do just that.
 * This will only send data to trakt and not remove it.
 *
 * * <b>Clean Collection</b>
 *
 * Cleaning a collection involves comparing the trakt collection to what exists locally.
 * This will remove items from the trakt collection if they don't exist locally anymore.
 * You should make this clear to the user that data might be removed from trakt.
 *
 * @see [sync]{@link https://trakt.docs.apiary.io/#reference/sync}
 */
export const sync = {
  /**
   * This method is a useful first step in the syncing process.
   * We recommended caching these dates locally, then you can compare to know exactly what data has changed recently.
   * This can greatly optimize your syncs so you don't pull down a ton of data only to see nothing has actually changed.
   *
   * * <b>Account</b>
   *
   * settings_at is set when the OAuth user updates any of their Trakt settings on the website.
   *
   * followed_at is set when another Trakt user follows or unfollows the OAuth user.
   *
   * following_at is set when the OAuth user follows or unfollows another Trakt user.
   *
   * pending_at is set when the OAuth user follows a private account, which requires their approval.
   *
   * requested_at is set when the OAuth user has a private account and someone requests to follow them.
   *
   * @auth required
   *
   * @see [get-last-activity]{@link https://trakt.docs.apiary.io/#reference/sync/last-activities/get-last-activity}
   */
  lastActivities: new TraktClientEndpoint<Record<string, never>, TraktSyncActivities>({
    method: HttpMethod.GET,
    url: '/sync/last_activities',
    opts: {
      auth: true,
    },
  }),
  playback: {
    /**
     * Whenever a scrobble is paused, the playback progress is saved.
     * Use this progress to sync up playback across different media centers or apps.
     * For example, you can start watching a movie in a media center, stop it, then resume on your tablet from the same spot.
     * Each item will have the progress percentage between 0 and 100.
     *
     * You can optionally specify a type to only get movies or episodes.
     *
     * By default, all results will be returned.
     * Pagination is optional and can be used for something like an "on deck" feature, or if you only need a limited data set.
     *
     * * <b>Note</b>
     *
     * We only save playback progress for the last 6 months.
     *
     * @pagination optional - {@link TraktApiPagination}
     * @auth required
     *
     * @see [get-playback-progress]{@link https://trakt.docs.apiary.io/#reference/sync/playback/get-playback-progress}
     */
    get: new TraktClientEndpoint<
      {
        type?: 'movies' | 'episodes';
        /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
        start_at?: string;
        /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
        end_at?: string;
      } & TraktApiParamsPagination,
      TraktSyncProgress[]
    >({
      method: HttpMethod.GET,
      url: '/sync/playback/:type?start_at=&end_at=',
      opts: {
        auth: 'optional',
        parameters: {
          path: {
            type: false,
          },
          query: {
            start_at: false,
            end_at: false,
          },
        },
      },
    }),
    /**
     * Remove a playback item from a user's playback progress list. A 404 will be returned if the id is invalid.
     *
     * @see [remove-playback-item]{@link https://trakt.docs.apiary.io/#reference/sync/remove-playback/remove-a-playback-item}
     */
    remove: new TraktClientEndpoint<
      {
        /** playback ID */
        id: number;
      },
      unknown,
      false
    >({
      method: HttpMethod.DELETE,
      url: '/sync/playback/:id',
      opts: {
        auth: true,
        cache: false,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
  },
  collection: {
    /**
     * Get all collected items in a user's collection. A collected item indicates availability to watch digitally or on physical media.
     *
     * Each movie object contains collected_at and updated_at timestamps.
     * Since users can set custom dates when they collected movies, it is possible for collected_at to be in the past.
     * We also include updated_at to help sync Trakt data with your app.
     * Cache this timestamp locally and only re-process the movie if you see a newer timestamp.
     *
     * Each show object contains last_collected_at and last_updated_at timestamps.
     * Since users can set custom dates when they collected episodes, it is possible for last_collected_at to be in the past.
     * We also include last_updated_at to help sync Trakt data with your app.
     * Cache this timestamp locally and only re-process the show if you see a newer timestamp.
     *
     * If you add ?extended=metadata to the URL, it will return the additional media_type, resolution, hdr, audio, audio_channels and '3d' metadata. It will use null if the metadata isn't set for an item.
     *
     * @extended true - {@link TraktApiExtended.Full}, {@link TraktApiExtended.Metadata}
     * @auth required
     */
    get: new TraktClientEndpoint<
      {
        type: 'movies' | 'shows';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full | typeof TraktApiExtended.Metadata>,
      TraktCollection[]
    >({
      method: HttpMethod.GET,
      url: '/sync/collection/:type',
      opts: {
        auth: true,
        extended: [TraktApiExtended.Full, TraktApiExtended.Metadata],
      },
    }),
    /**
     * Add items to a user's collection. Accepts shows, seasons, episodes and movies.
     * If only a show is passed, all episodes for the show will be collected.
     * If seasons are specified, all episodes in those seasons will be collected.
     *
     * Send a collected_at UTC datetime to mark items as collected in the past.
     * You can also send additional metadata about the media itself to have a very accurate collection.
     * Showcase what is available to watch from your epic HD DVD collection down to your downloaded iTunes movies.
     *
     * * <b>Note</b>
     *
     * You can resend items already in your collection and they will be updated with any new values. This includes the collected_at and any other metadata.
     *
     * @auth required
     *
     * @see [add-to-collection]{@link https://trakt.docs.apiary.io/#reference/sync/add-to-collection/add-items-to-collection}
     */
    add: new TraktClientEndpoint<TraktCollectionRequest<'metadata'>, TraktCollectionAdded, false>({
      opts: {
        auth: true,
        cache: false,
      },
      method: HttpMethod.POST,
      url: '/sync/collection',
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
      },
    }),
    /**
     * Remove one or more items from a user's collection.
     *
     * @auth required
     *
     * @see [remove-items-from-collection]{@link https://trakt.docs.apiary.io/#reference/sync/remove-from-collection/remove-items-from-collection}
     */
    remove: new TraktClientEndpoint<TraktSyncRequest, TraktCollectionRemoved, false>({
      method: HttpMethod.POST,
      url: '/sync/collection/remove',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
      },
    }),
  },
  /**
   * Returns all movies or shows a user has watched sorted by most plays.
   *
   * If type is set to shows and you add ?extended=noseasons to the URL, it won't return season or episode info.
   *
   * Each movie and show object contains last_watched_at and last_updated_at timestamps.
   * Since users can set custom dates when they watched movies and episodes, it is possible for last_watched_at to be in the past.
   * We also include last_updated_at to help sync Trakt data with your app.
   * Cache this timestamp locally and only re-process the movies and shows if you see a newer timestamp.
   *
   * Each show object contains a reset_at timestamp.
   * If not null, this is when the user started re-watching the show.
   * Your app can adjust the progress by ignoring episodes with a last_watched_at prior to the reset_at.
   *
   * @auth required
   * @extended true - {@link TraktApiExtended.Full}, {@link TraktApiExtended.NoSeasons}
   *
   * @see [get-watched]{@link https://trakt.docs.apiary.io/#reference/sync/get-watched/get-watched}
   */
  watched: new TraktClientEndpoint<
    {
      type: 'movies' | 'shows';
    } & TraktApiParamsExtended<typeof TraktApiExtended.Full | typeof TraktApiExtended.NoSeasons>,
    TraktWatched[]
  >({
    method: HttpMethod.GET,
    url: '/sync/watched/:type',
    opts: {
      auth: true,
      extended: [TraktApiExtended.Full, TraktApiExtended.NoSeasons],
      parameters: {
        path: {
          type: true,
        },
      },
    },
  }),
  /**
   * Returns movies and episodes that a user has watched, sorted by most recent. You can optionally limit the type to movies or episodes.
   *
   * The id (64-bit integer) in each history item uniquely identifies the event and can be used to remove individual events by using the [/sync/history/remove]{@link https://trakt.docs.apiary.io/#reference/sync/remove-from-history/get-watched-history} method.
   * The action will be set to scrobble, checkin, or watch.
   *
   * Specify a type and trakt id to limit the history for just that item. If the id is valid, but there is no history, an empty array will be returned.
   *
   * @pagination true - {@link TraktApiPagination}
   * @extended true - {@link TraktApiExtended.Full}
   * @auth required
   *
   * @see [get-watched-history]{@link https://trakt.docs.apiary.io/#reference/sync/get-history/get-watched-history}
   */
  history: {
    get: new TraktClientEndpoint<
      {
        /** Trakt ID for a specific item. */
        id?: string;
        type?: 'movies' | 'shows' | 'seasons' | 'episodes';
        /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
        start_at?: string;
        /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
        end_at?: string;
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
        TraktApiParamsPagination,
      TraktHistory[]
    >({
      method: HttpMethod.GET,
      url: '/sync/history/:type/:id?start_at=&end_at=',
      opts: {
        auth: true,
        pagination: true,
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            type: false,
            id: false,
          },
          query: {
            start_at: false,
            end_at: false,
          },
        },
      },
    }),
    /**
     * Add items to a user's watch history. Accepts shows, seasons, episodes and movies.
     * If only a show is passed, all episodes for the show will be added.
     * If seasons are specified, only episodes in those seasons will be added.
     *
     * Send a watched_at UTC datetime to mark items as watched in the past.
     * This is useful for syncing past watches from a media center.
     *
     * * <b>Important</b>
     *
     * Please be careful with sending duplicate data.
     * We don't verify the item + watched_at to ensure it's unique, it is up to your app to veify this and not send duplicate plays.
     *
     * @auth required
     *
     * @see [add-items-to-watched-history]{@link https://trakt.docs.apiary.io/#reference/sync/add-to-history/add-items-to-watched-history}
     */
    add: new TraktClientEndpoint<TraktHistoryRequest, TraktHistoryAdded, false>({
      method: HttpMethod.POST,
      url: '/sync/history',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
      },
    }),
    /**
     * Remove items from a user's watch history including all watches, scrobbles, and checkins. Accepts shows, seasons, episodes and movies.
     * If only a show is passed, all episodes for the show will be removed.
     * If seasons are specified, only episodes in those seasons will be removed.
     *
     * You can also send a list of raw history ids (64-bit integers) to delete single plays from the watched history.
     * The [/sync/history]{@link https://trakt.docs.apiary.io/#reference/sync/get-history} method will return an individual id (64-bit integer) for each history item.
     *
     * @auth required
     *
     * @see [remove-items-from-history]{@link https://trakt.docs.apiary.io/#reference/sync/remove-from-history/remove-items-from-history}
     */
    remove: new TraktClientEndpoint<TraktHistoryRemovedRequest, TraktHistoryRemoved, false>({
      method: HttpMethod.POST,
      url: '/sync/history/remove',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
        ids: false,
      },
    }),
  },
  ratings: {
    /**
     * Get a user's ratings filtered by type.
     * You can optionally filter for a specific rating between 1 and 10.
     * Send a comma separated string for rating if you need multiple ratings.
     *
     * @pagination optional - {@link TraktApiPagination}
     * @extended true - {@link TraktApiExtended.Full}
     * @auth required
     *
     * @see [get-ratings]{@link https://trakt.docs.apiary.io/#reference/sync/get-ratings/get-ratings}
     */
    get: new TraktClientEndpoint<
      {
        type?: 'movies' | 'shows' | 'seasons' | 'episodes' | 'all';
        /** Filter for a specific rating. */
        rating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
        TraktApiParamsPagination,
      TraktRating[]
    >({
      method: HttpMethod.GET,
      url: '/sync/ratings/:type/:rating',
      opts: {
        auth: true,
        pagination: 'optional',
        extended: [TraktApiExtended.Full],
        parameters: {
          query: {
            type: false,
            rating: false,
          },
        },
      },
    }),
    /**
     * Rate one or more items. Accepts shows, seasons, episodes and movies.
     * If only a show is passed, only the show itself will be rated.
     * If seasons are specified, all of those seasons will be rated.
     *
     * Send a rated_at UTC datetime to mark items as rated in the past.
     * This is useful for syncing ratings from a media center.
     *
     * @auth required
     *
     * @see [add-new-ratings]{@link https://trakt.docs.apiary.io/#reference/sync/add-ratings/add-new-ratings}
     */
    add: new TraktClientEndpoint<TraktRatingRequest, TraktRatingAdded, false>({
      opts: {
        auth: true,
        cache: false,
      },
      method: HttpMethod.POST,
      url: '/sync/ratings',
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
      },
    }),
    /**
     * Remove ratings for one or more items.
     *
     * @auth required
     *
     * @see [remove-ratings]{@link https://trakt.docs.apiary.io/#reference/sync/remove-ratings/remove-ratings}
     */
    remove: new TraktClientEndpoint<TraktSyncRequest, TraktRatingRemoved, false>({
      method: HttpMethod.POST,
      url: '/sync/ratings/remove',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
      },
    }),
  },
  watchlist: {
    /**
     * Returns all items in a user's watchlist filtered by type.
     *
     * * <b>Note</b>
     *
     * Each watchlist item contains a notes field with text entered by the user.
     *
     * * <b>Sorting Headers</b>
     *
     * By default, all list items are sorted by rank asc. We send X-Applied-Sort-By and X-Applied-Sort-How headers to indicate how the results are actually being sorted.
     *
     * We also send X-Sort-By and X-Sort-How headers which indicate the user's sort preference. Use these to to custom sort the watchlist <b>in your app</b> for more advanced sort abilities we can't do in the API.
     * Values for X-Sort-By include rank, added, title, released, runtime, popularity, percentage, and votes.
     * Values for X-Sort-How include asc and desc.
     *
     * * <b>Auto Removal</b>
     *
     * When an item is watched, it will be automatically removed from the watchlist.
     * For shows and seasons, watching 1 episode will remove the entire show or season.
     *
     * <b>The watchlist should not be used as a list of what the user is actively watching.</b>
     *
     * Use a combination of the [/sync/watched]{@link https://trakt.docs.apiary.io/reference/sync/get-watched} and [/shows/:id/progress]{@link https://trakt.docs.apiary.io/reference/shows/watched-progress} methods to get what the user is actively watching.
     *
     * @pagination optional - {@link TraktApiPagination}
     * @extended true - {@link TraktApiExtended.Full}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth required
     *
     * @see [get-watchlist]{@link https://trakt.docs.apiary.io/#reference/sync/get-watchlist/get-watchlist}
     */
    get: new TraktClientEndpoint<
      {
        /** Filter for a specific item type */
        type?: 'movies' | 'shows' | 'seasons' | 'episodes';
        /** How to sort (only if type is also sent) */
        sort?: 'rank' | 'added' | 'released' | 'title';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
        TraktApiParamsPagination,
      TraktWatchlist[]
    >({
      method: HttpMethod.GET,
      url: '/sync/watchlist/:type/:sort',
      opts: {
        auth: true,
        emoji: true,
        pagination: 'optional',
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            type: false,
            sort: false,
          },
        },
      },
    }),
    /**
     * Update the watchlist by sending 1 or more parameters.
     *
     * @auth required
     *
     * @see [update-watchlist]{@link https://trakt.docs.apiary.io/#reference/sync/update-watchlist/update-watchlist}
     */
    update: new TraktClientEndpoint<TraktSyncUpdateRequest, TraktWatchlistList, false>({
      method: HttpMethod.PUT,
      url: '/sync/watchlist',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        description: false,
        sort_by: false,
        sort_how: false,
      },
    }),
    /**
     * Add one of more items to a user's watchlist.
     * Accepts shows, seasons, episodes and movies.
     * If only a show is passed, only the show itself will be added.
     * If seasons are specified, all of those seasons will be added.
     *
     * * <b>Note</b>
     *
     * Each watchlist item can optionally accept a notes (500 maximum characters) field with custom text.
     * The user must be a [Trakt VIP]{@link https://trakt.tv/vip} to send notes.
     *
     * * <b>Limits</b>
     *
     * If the user's watchlist limit is exceeded, a 420 HTTP error code is returned. Use the [/users/settings]{@link https://trakt.docs.apiary.io/reference/users/settings} method to get all limits for a user account.
     * In most cases, upgrading to [Trakt VIP]{@link https://trakt.tv/vip} will increase the limits.
     *
     * @vip enhanced - [Enhanced by a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth required
     *
     * @see [add-items-to-watchlist]{@link https://trakt.docs.apiary.io/#reference/sync/update-watchlist/add-items-to-watchlist}
     */
    add: new TraktClientEndpoint<TraktSyncRequest, TraktWatchlistAdded, false>({
      method: HttpMethod.POST,
      url: '/sync/watchlist',
      opts: {
        auth: true,
        emoji: true,
        cache: false,
        vip: 'enhanced',
      },
      body: {
        movies: false,
        shows: false,
        seasons: false,
        episodes: false,
      },
    }),
    /**
     * Remove one or more items from a user's watchlist.
     *
     * @auth required
     *
     * @see [remove-items-from-watchlist]{@link https://trakt.docs.apiary.io/#reference/sync/remove-from-watchlist/remove-items-from-watchlist}
     */
    remove: new TraktClientEndpoint<TraktSyncRequest, TraktWatchlistRemoved, false>({
      method: HttpMethod.POST,
      url: '/sync/watchlist/remove',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        episodes: false,
      },
    }),
    /**
     * Reorder all items on a user's watchlist by sending the updated rank of list item ids.
     * Use the [/sync/watchlist]{@link https://trakt.docs.apiary.io/#reference/sync/get-watchlist} method to get all list item ids.
     *
     * @auth required
     *
     * @see [reorder-watchlist-items]{@link https://trakt.docs.apiary.io/#reference/sync/reorder-watchlist/reorder-watchlist-items}
     */
    reorder: new TraktClientEndpoint<
      {
        /** Array of list ids in the new order. */
        rank: number[];
      },
      TraktListReordered,
      false
    >({
      method: HttpMethod.POST,
      url: '/sync/watchlist/reorder',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        rank: true,
      },
    }),
    /**
     * Update the notes on a single watchlist item.
     *
     * @vip required - [Requires a paid VIP subscription]{@link https://trakt.docs.apiary.io/#introduction/vip-methods}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth required
     *
     * @see [update-a-watchlist-item]{@link https://trakt.docs.apiary.io/#reference/sync/update-watchlist-item/update-a-watchlist-item}
     */
    updateItem: new TraktClientEndpoint<
      {
        /** List Item ID */
        list_item_id: number;
        notes: string;
      },
      unknown,
      false
    >({
      method: HttpMethod.PUT,
      url: '/sync/watchlist/:list_item_id',
      opts: {
        auth: true,
        emoji: true,
        vip: true,
        cache: false,
        parameters: {
          path: {
            list_item_id: true,
          },
        },
      },
      body: {
        notes: true,
      },
    }),
  },
  favorites: {
    /**
     * If the user only had 50 TV shows and movies to bring with them on a deserted island, what would they be?
     * These favorites are used to enchance Trakt's social recommendation algorithm.
     * Apps should encourage user's to add favorites so the algorithm keeps getting better.
     *
     * * <b>Notes</b>
     *
     * Each favorite contains a notes field explaining why the user favorited the item.
     *
     * @pagination optional - {@link TraktApiPagination}
     * @extended true - {@link TraktApiExtended.Full}
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth required
     *
     * @see [get-favorites]{@link https://trakt.docs.apiary.io/#reference/sync/get-favorites/get-favorites}
     */
    get: new TraktClientEndpoint<
      {
        /* Filter for a specific item type */
        type?: 'movies' | 'shows';
        /** How to sort (only if type is also sent) */
        sort?: 'rank' | 'added' | 'released' | 'title';
      } & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
        TraktApiParamsPagination,
      TraktFavoriteItem[]
    >({
      method: HttpMethod.GET,
      url: '/sync/favorites/:type/:sort',
      opts: {
        auth: true,
        emoji: true,
        pagination: 'optional',
        extended: [TraktApiExtended.Full],
        parameters: {
          path: {
            type: false,
            sort: false,
          },
        },
      },
    }),
    /**
     * Update the favorites list by sending 1 or more parameters.
     *
     * @auth required
     *
     * @see [update-favorites]{@link https://trakt.docs.apiary.io/#reference/sync/update-favorites/update-favorites}
     */
    update: new TraktClientEndpoint<TraktSyncUpdateRequest, TraktFavoriteList, false>({
      method: HttpMethod.PUT,
      url: '/sync/favorites',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        description: false,
        sort_by: false,
        sort_how: false,
      },
    }),
    /**
     * If the user only had 50 TV shows and movies to bring with them on a deserted island, what would they be?
     * These favorites are used to enchance Trakt's social recommendation algorithm.
     * Apps should encourage user's to add favorites so the algorithm keeps getting better.
     *
     * * <b>Note</b>
     *
     * Each favorite can optionally accept a notes (500 maximum characters) field explaining why the user favorited the item.
     *
     * * <b>Limits</b>
     *
     * If the user has favorited 50 items already, a 420 HTTP error code is returned. This limit applies to all users.
     *
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth required
     *
     * @see [add-items-to-favorites]{@link https://trakt.docs.apiary.io/#reference/sync/update-favorites/add-items-to-favorites}
     */
    add: new TraktClientEndpoint<TraktFavoriteRequest, TraktFavoriteAdded, false>({
      method: HttpMethod.POST,
      url: '/sync/favorites',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
    /**
     * Remove items from a user's favorites.
     * These favorites are used to enchance Trakt's social recommendation algorithm.
     * Apps should encourage user's to add favorites so the algorithm keeps getting better.
     *
     * @auth required
     *
     * @see [remove-items-from-favorites]{@link https://trakt.docs.apiary.io/#reference/sync/remove-from-favorites/remove-items-from-favorites}
     */
    remove: new TraktClientEndpoint<TraktFavoriteRequest, TraktFavoriteRemoved, false>({
      method: HttpMethod.POST,
      url: '/sync/favorites/remove',
      opts: {
        auth: true,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
    /**
     * Reorder all items on a user's favorites by sending the updated rank of list item ids.
     * Use the [/sync/favorites]{@link https://trakt.docs.apiary.io/#reference/sync/get-favorites} method to get all list item ids.
     *
     * @auth required
     *
     * @see [reorder-favorites-items]{@link https://trakt.docs.apiary.io/#reference/sync/reorder-favorites/reorder-favorited-items}
     */
    reorder: new TraktClientEndpoint<
      {
        /** Array of list ids in the new order. */
        rank: number[];
      },
      TraktListReordered,
      false
    >({
      opts: {
        auth: true,
        cache: false,
      },
      method: HttpMethod.POST,
      url: '/sync/favorites/reorder',
      body: {
        rank: true,
      },
    }),
    /**
     * Update the notes on a single favorite item.
     *
     * @emoji true - [documentation]{@link https://trakt.docs.apiary.io/#introduction/emojis}
     * @auth required
     *
     * @see [update-a-favorite-item]{@link https://trakt.docs.apiary.io/#reference/sync/update-favorite-item/update-a-favorite-item}
     */
    updateItem: new TraktClientEndpoint<
      {
        /** List Item ID */
        list_item_id: number;
        notes: string;
      },
      unknown,
      false
    >({
      method: HttpMethod.PUT,
      url: '/sync/favorites/:list_item_id',
      opts: {
        auth: true,
        emoji: true,
        cache: false,
        parameters: {
          path: {
            list_item_id: true,
          },
        },
      },
      body: {
        notes: true,
      },
    }),
  },
};
