import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, watch } from 'vue';

import type { BaseCacheOption } from '@dvcol/base-http-client';
import type {
  TraktCollectionProgress,
  TraktCollectionProgressEpisode,
  TraktEpisodeExtended,
  TraktEpisodeShort,
  TraktSeasonExtended,
  TraktShowExtended,
  TraktWatchedProgress,
  TraktWatchedProgressEpisode,
} from '@dvcol/trakt-http-client/models';

import { type SeasonProgress, type ShowProgress, ShowProgressType } from '~/models/list-scroll.model';
import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { ErrorCount, type ErrorDictionary, shouldRetry } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

export type ShowSeasons = Record<number, TraktSeasonExtended>;

type ShowDictionary = Record<string, TraktShowExtended>;
type ShowSeasonDictionary = Record<string, ShowSeasons>;
type ShowSeasonEpisodesDictionary = Record<string, Record<number, TraktEpisodeShort[]>>;
type ShowEpisodeDictionary = Record<string, Record<number, Record<number, TraktEpisodeExtended>>>;
type ShowWatchedProgressDictionary = Record<string, TraktWatchedProgress>;
type ShowCollectionProgressDictionary = Record<string, TraktCollectionProgress>;

type LoadingDictionary = Record<string, boolean>;
type SeasonEpisodesLoadingDictionary = Record<string, Record<number, boolean>>;
type EpisodeLoadingDictionary = Record<string, Record<number, Record<number, boolean>>>;

type SeasonEpisodesErrorDictionary = Record<string, Record<number, ErrorCount>>;
type EpisodeErrorDictionary = Record<string, Record<number, Record<number, ErrorCount>>>;

const parseProgressDate = (
  progress: TraktWatchedProgress | TraktCollectionProgress | TraktWatchedProgressEpisode | TraktCollectionProgressEpisode,
): Date | undefined => {
  if ('last_watched_at' in progress && progress?.last_watched_at) return new Date(progress.last_watched_at);
  if ('last_collected_at' in progress && progress?.last_collected_at) return new Date(progress.last_collected_at);
  if ('collected_at' in progress && progress?.collected_at) return new Date(progress.collected_at);
  return undefined;
};

const watchProgressToListProgress = (progress: TraktWatchedProgress | TraktCollectionProgress, id: string | number): ShowProgress => {
  let completed: ShowProgress['completed'] = 0;
  let aired: ShowProgress['aired'] = 0;
  let lastAired: ShowProgress['lastAired'];

  const result = {
    id,
    ...progress,
    type: 'last_watched_at' in progress ? ShowProgressType.Watched : ShowProgressType.Collection,
    date: parseProgressDate(progress),
    seasons: progress.seasons.map(season => {
      if (season.number > 0) {
        if (season.completed) completed += season.completed;
        if (season.aired) aired += season.aired;
      }

      const _season: SeasonProgress = {
        ...season,
        percentage: season.aired ? ((season.completed ?? 0) / season.aired) * 100 : 0,
        finished: !!season.aired && season.completed === season.aired,
      };

      _season.episodes = season.episodes.map(episode => {
        const date = parseProgressDate(episode);
        if (date && date.getTime() > (_season.date?.getTime() ?? 0)) _season.date = date;
        return { ...episode, date };
      });

      if (_season.aired && (!lastAired || _season.number > lastAired.number)) lastAired = _season;

      return _season;
    }),
  };
  return {
    ...result,
    completed,
    aired,
    percentage: aired ? ((completed ?? 0) / aired) * 100 : 0,
    finished: !!aired && completed === aired,
    lastAired,
  };
};

export const useShowStore = defineStore('data.show', () => {
  const shows = reactive<ShowDictionary>({});
  const showsSeasons = reactive<ShowSeasonDictionary>({});
  const showsSeasonEpisodes = reactive<ShowSeasonEpisodesDictionary>({});
  const showsEpisodes = reactive<ShowEpisodeDictionary>({});
  const showsWatchedProgress = reactive<ShowWatchedProgressDictionary>({});
  const showsCollectionProgress = reactive<ShowCollectionProgressDictionary>({});

  const showsLoading = reactive<LoadingDictionary>({});
  const showsSeasonsLoading = reactive<LoadingDictionary>({});
  const showsSeasonEpisodesLoading = reactive<SeasonEpisodesLoadingDictionary>({});
  const showsEpisodesLoading = reactive<EpisodeLoadingDictionary>({});
  const showWatchedProgressLoading = reactive<LoadingDictionary>({});
  const showCollectionProgressLoading = reactive<LoadingDictionary>({});

  const showsError = reactive<ErrorDictionary>({});
  const showsSeasonsError = reactive<ErrorDictionary>({});
  const showsSeasonEpisodesError = reactive<SeasonEpisodesErrorDictionary>({});
  const showsEpisodesError = reactive<EpisodeErrorDictionary>({});
  const showWatchedProgressError = reactive<ErrorDictionary>({});
  const showCollectionProgressError = reactive<ErrorDictionary>({});

  ErrorService.registerDictionary('show', {
    shows: showsError,
    seasons: showsSeasonsError,
    seasonEpisodes: showsSeasonEpisodesError,
    episodes: showsEpisodesError,
    watched: showWatchedProgressError,
    collected: showCollectionProgressError,
  });

  const clearShowWatchedProgress = () => clearProxy(showsWatchedProgress);

  const clearProgressState = () => {
    clearShowWatchedProgress();
    clearProxy(showsCollectionProgress);

    clearProxy(showWatchedProgressLoading);
    clearProxy(showCollectionProgressLoading);

    clearProxy(showWatchedProgressError);
    clearProxy(showCollectionProgressError);
  };

  const clearState = () => {
    clearProxy(shows);
    clearProxy(showsSeasons);
    clearProxy(showsSeasonEpisodes);
    clearProxy(showsEpisodes);

    clearProxy(showsLoading);
    clearProxy(showsSeasonsLoading);
    clearProxy(showsSeasonEpisodesLoading);
    clearProxy(showsEpisodesLoading);

    clearProxy(showsError);
    clearProxy(showsSeasonsError);
    clearProxy(showsSeasonEpisodesError);
    clearProxy(showsEpisodesError);

    clearProgressState();
  };

  const { user, isAuthenticated } = useAuthSettingsStoreRefs();
  const fetchShow = async (id: string) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch show, user is not authenticated');
      return;
    }
    if (showsLoading[id]) {
      Logger.warn('Already fetching show', id);
      return;
    }

    Logger.debug('Fetching Show', id);

    showsLoading[id] = true;
    try {
      shows[id] = await TraktService.show.summary(id);
      delete showsError[id];
    } catch (e) {
      Logger.error('Failed to fetch show', id);
      NotificationService.error(`Failed to fetch show '${id}'.`, e);
      showsError[id] = ErrorCount.fromDictionary(showsError, id, e);
      throw e;
    } finally {
      showsLoading[id] = false;
    }
  };

  const fetchShowProgress = async (id: string, cacheOption?: BaseCacheOption) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch show progress, user is not authenticated');
      return;
    }
    if (showWatchedProgressLoading[id]) {
      Logger.warn('Already fetching show progress', id);
      return;
    }

    Logger.debug('Fetching Show Progress', id);

    showWatchedProgressLoading[id] = true;
    try {
      showsWatchedProgress[id] = await TraktService.progress.show.watched(id, cacheOption);
      delete showWatchedProgressError[id];
    } catch (e) {
      Logger.error('Failed to fetch show progress', id);
      showWatchedProgressError[id] = ErrorCount.fromDictionary(showWatchedProgressError, id, e);
      throw e;
    } finally {
      showWatchedProgressLoading[id] = false;
    }
  };

  const fetchShowCollectionProgress = async (id: string, cacheOption?: BaseCacheOption) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch show collection progress, user is not authenticated');
      return;
    }
    if (showCollectionProgressLoading[id]) {
      Logger.warn('Already fetching show collection progress', id);
      return;
    }

    Logger.debug('Fetching Show Collection Progress', id);

    showCollectionProgressLoading[id] = true;
    try {
      showsCollectionProgress[id] = await TraktService.progress.show.collection(id, cacheOption);
      delete showCollectionProgressError[id];
    } catch (e) {
      Logger.error('Failed to fetch show collection progress', id);
      showCollectionProgressError[id] = ErrorCount.fromDictionary(showCollectionProgressError, id, e);
      throw e;
    } finally {
      showCollectionProgressLoading[id] = false;
    }
  };

  const fetchShowSeasons = async (id: string) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch show seasons, user is not authenticated');
      return;
    }
    if (showsSeasonsLoading[id]) {
      Logger.warn('Already fetching show seasons', id);
      return;
    }

    Logger.debug('Fetching Show Seasons', id);

    showsSeasonsLoading[id] = true;
    try {
      const seasons = await TraktService.show.seasons(id);
      showsSeasons[id] = seasons.reduce<ShowSeasonDictionary[number]>((acc, season) => {
        acc[season.number] = season;
        return acc;
      }, {});
      delete showsSeasonsError[id];
    } catch (e) {
      Logger.error('Failed to fetch show seasons', id);
      NotificationService.error(`Failed to fetch show seasons '${id}'.`, e);
      showsSeasonsError[id] = ErrorCount.fromDictionary(showsSeasonsError, id, e);
      throw e;
    } finally {
      showsSeasonsLoading[id] = false;
    }
  };

  const fetchShowSeasonEpisodes = async (id: string, season: number) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch show season episodes, user is not authenticated');
      return;
    }
    if (showsSeasonEpisodesLoading[id]?.[season]) {
      Logger.warn('Already fetching show season episodes', id, season);
      return;
    }

    Logger.debug('Fetching Show Season Episodes', id, season);

    if (!showsSeasonEpisodesLoading[id]) showsSeasonEpisodesLoading[id] = {};
    showsSeasonEpisodesLoading[id][season] = true;
    try {
      const episodes = await TraktService.show.season(id, season);
      if (!showsSeasonEpisodes[id]) showsSeasonEpisodes[id] = {};
      showsSeasonEpisodes[id][season] = episodes;
      delete showsSeasonEpisodesError[id]?.[season];
    } catch (e) {
      Logger.error('Failed to fetch show season episodes', id, season);
      NotificationService.error(`Failed to fetch show season episodes '${id}', season '${season}'.`, e);
      showsSeasonEpisodesError[id] = {
        ...showsSeasonEpisodesError[id],
        [season]: ErrorCount.fromDictionary(showsSeasonEpisodesError[id], season, e),
      };
      throw e;
    } finally {
      showsSeasonEpisodesLoading[id][season] = false;
    }
  };

  const fetchShowEpisode = async (id: string, season: number, episode: number) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch show episodes, user is not authenticated');
      return;
    }
    if (showsEpisodesLoading[id]?.[season]?.[episode]) {
      Logger.warn('Already fetching show episodes', id, season, episode);
      return;
    }

    Logger.debug('Fetching Show Episodes', id, season, episode);

    if (!showsEpisodesLoading[id]) showsEpisodesLoading[id] = {};
    if (!showsEpisodesLoading[id][season]) showsEpisodesLoading[id][season] = {};
    showsEpisodesLoading[id][season][episode] = true;
    try {
      if (!showsEpisodes[id]) showsEpisodes[id] = {};
      if (!showsEpisodes[id][season]) showsEpisodes[id][season] = {};
      showsEpisodes[id][season][episode] = await TraktService.show.episode({ id, season, episode });
      delete showsEpisodesError[id]?.[season]?.[episode];
    } catch (e) {
      Logger.error('Failed to fetch show episodes', id, season, episode);
      NotificationService.error(`Failed to fetch show episodes '${id}', season '${season}', episode '${episode}'.`, e);
      showsEpisodesError[id] = {
        ...showsEpisodesError[id],
        [season]: {
          ...showsEpisodesError[id]?.[season],
          [episode]: ErrorCount.fromDictionary(showsEpisodesError[id]?.[season], episode, e),
        },
      };
      throw e;
    } finally {
      showsEpisodesLoading[id][season][episode] = false;
    }
  };

  const getShowLoading = (id: number | string) => computed(() => showsLoading[id.toString()]);
  const getShow = (id: number | string) =>
    computed(() => {
      if (showsLoading[id.toString()]) return undefined;
      return shows[id.toString()];
    });

  const getSeasonsLoading = (id: number | string) => computed(() => showsSeasonsLoading[id.toString()]);
  const getShowSeasons = (id: number | string) =>
    computed(() => {
      if (showsSeasonsLoading[id.toString()]) return undefined;
      return showsSeasons[id.toString()];
    });

  const getSeasonEpisodesLoading = (id: number | string, season: number) => computed(() => showsSeasonEpisodesLoading[id.toString()]?.[season]);
  const getShowSeasonEpisodes = (id: number | string, season: number) =>
    computed(() => {
      if (showsSeasonEpisodesLoading[id.toString()]?.[season]) return undefined;
      return showsSeasonEpisodes[id.toString()]?.[season];
    });

  const getEpisodesLoading = (id: number | string, season: number, episode: number) =>
    computed(() => showsEpisodesLoading[id.toString()]?.[season]?.[episode]);
  const getShowEpisode = ({ id, season, episode }: { id: number | string; season: number; episode: number }) =>
    computed(() => {
      if (showsEpisodesLoading[id.toString()]?.[season]?.[episode]) return undefined;
      return showsEpisodes[id.toString()]?.[season]?.[episode];
    });

  const getShowProgressLoading = (id: number | string) => computed(() => showWatchedProgressLoading[id.toString()]);
  const getShowWatchedProgress = (id: number | string, cacheOptions?: BaseCacheOption, noFetch = false) => {
    if (
      !noFetch &&
      !showsWatchedProgress[id.toString()] &&
      !showWatchedProgressLoading[id.toString()] &&
      shouldRetry(showWatchedProgressError[id.toString()], { error: `Watched Progress for ${id.toString()}` })
    ) {
      fetchShowProgress(id.toString(), cacheOptions).catch(Logger.error);
    }
    return computed(() => {
      const progress = showsWatchedProgress[id.toString()];
      if (!progress) return undefined;
      return watchProgressToListProgress(progress, id);
    });
  };

  const getShowCollectionLoading = (id: number | string) => computed(() => showCollectionProgressLoading[id.toString()]);
  const getShowCollectionProgress = (id: number | string, noFetch = false) => {
    if (
      !noFetch &&
      !showsCollectionProgress[id.toString()] &&
      !showCollectionProgressLoading[id.toString()] &&
      shouldRetry(showCollectionProgressError[id.toString()], { error: `Collection Progress for ${id.toString()}` })
    ) {
      fetchShowCollectionProgress(id.toString()).catch(Logger.error);
    }
    return computed(() => {
      const progress = showsCollectionProgress[id.toString()];
      if (!progress) return undefined;
      return watchProgressToListProgress(progress, id);
    });
  };

  const initShowStore = () => {
    watch(user, () => {
      clearProgressState();
    });
  };

  return {
    initShowStore,
    clearState,
    clearProgressState,
    getShow,
    fetchShow,
    fetchShowProgress,
    fetchShowCollectionProgress,
    getShowLoading,
    getShowSeasons,
    fetchShowSeasons,
    getSeasonsLoading,
    getShowSeasonEpisodes,
    fetchShowSeasonEpisodes,
    getSeasonEpisodesLoading,
    getShowEpisode,
    fetchShowEpisode,
    getEpisodesLoading,
    getShowWatchedProgress,
    getShowProgressLoading,
    getShowCollectionProgress,
    getShowCollectionLoading,
    clearShowWatchedProgress,
  };
});

export const useShowStoreRefs = () => storeToRefs(useShowStore());
