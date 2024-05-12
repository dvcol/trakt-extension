import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, watch } from 'vue';

import type { BaseCacheOption } from '@dvcol/base-http-client';
import type {
  TraktEpisodeExtended,
  TraktEpisodeShort,
  TraktCollectionProgress,
  TraktWatchedProgress,
  TraktSeasonExtended,
  TraktShowExtended,
} from '@dvcol/trakt-http-client/models';

import { type ShowProgress, ShowProgressType } from '~/models/list-scroll.model';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
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

const watchProgressToListProgress = (progress: TraktWatchedProgress | TraktCollectionProgress, id: string | number): ShowProgress => {
  let completed = 0;
  let aired = 0;

  const result = {
    id,
    ...progress,
    type: 'last_watched_at' in progress ? ShowProgressType.Watched : ShowProgressType.Collection,
    date: new Date('last_watched_at' in progress ? progress.last_watched_at : progress.last_collected_at),
    seasons: progress.seasons.map(season => {
      if (season.number > 0) {
        if (season.completed) completed += season.completed;
        if (season.aired) aired += season.aired;
      }
      return {
        ...season,
        percentage: season.aired ? ((season.completed ?? 0) / season.aired) * 100 : 0,
        finished: !!season.aired && season.completed === season.aired,
        episodes: season.episodes.map(episode => ({
          ...episode,
          date: new Date('last_watched_at' in episode ? episode.last_watched_at : episode.collected_at),
        })),
      };
    }),
  };
  return {
    ...result,
    completed,
    aired,
    percentage: aired ? ((completed ?? 0) / aired) * 100 : 0,
    finished: !!aired && completed === aired,
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

  const clearProgressState = () => {
    clearProxy(showsWatchedProgress);
    clearProxy(showsCollectionProgress);

    clearProxy(showWatchedProgressLoading);
    clearProxy(showCollectionProgressLoading);
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
    clearProgressState();
  };

  const fetchShow = async (id: string) => {
    if (showsLoading[id]) {
      logger.warn('Already fetching show', id);
      return;
    }

    logger.debug('Fetching Show', id);

    showsLoading[id] = true;
    try {
      shows[id] = await TraktService.show.summary(id);
    } catch (e) {
      logger.error('Failed to fetch show', id);
      NotificationService.error(`Failed to fetch show '${id}'.`, e);
      throw e;
    } finally {
      showsLoading[id] = false;
    }
  };

  const fetchShowProgress = async (id: string, cacheOption?: BaseCacheOption) => {
    if (showWatchedProgressLoading[id]) {
      logger.warn('Already fetching show progress', id);
      return;
    }

    logger.debug('Fetching Show Progress', id);

    showWatchedProgressLoading[id] = true;
    try {
      showsWatchedProgress[id] = await TraktService.progress.show.watched(id, cacheOption);
    } catch (e) {
      logger.error('Failed to fetch show progress', id);
      throw e;
    } finally {
      showWatchedProgressLoading[id] = false;
    }
  };

  const fetchShowCollectionProgress = async (id: string, cacheOption?: BaseCacheOption) => {
    if (showCollectionProgressLoading[id]) {
      logger.warn('Already fetching show collection progress', id);
      return;
    }

    logger.debug('Fetching Show Collection Progress', id);

    showCollectionProgressLoading[id] = true;
    try {
      showsCollectionProgress[id] = await TraktService.progress.show.collection(id, cacheOption);
    } catch (e) {
      logger.error('Failed to fetch show collection progress', id);
      throw e;
    } finally {
      showCollectionProgressLoading[id] = false;
    }
  };

  const fetchShowSeasons = async (id: string) => {
    if (showsSeasonsLoading[id]) {
      logger.warn('Already fetching show seasons', id);
      return;
    }

    logger.debug('Fetching Show Seasons', id);

    showsSeasonsLoading[id] = true;
    try {
      const seasons = await TraktService.show.seasons(id);
      showsSeasons[id] = seasons.reduce<ShowSeasonDictionary[number]>((acc, season) => {
        acc[season.number] = season;
        return acc;
      }, {});
    } catch (e) {
      logger.error('Failed to fetch show seasons', id);
      NotificationService.error(`Failed to fetch show seasons '${id}'.`, e);
      throw e;
    } finally {
      showsSeasonsLoading[id] = false;
    }
  };

  const fetchShowSeasonEpisodes = async (id: string, season: number) => {
    if (showsSeasonEpisodesLoading[id]?.[season]) {
      logger.warn('Already fetching show season episodes', id, season);
      return;
    }

    logger.debug('Fetching Show Season Episodes', id, season);

    if (!showsSeasonEpisodesLoading[id]) showsSeasonEpisodesLoading[id] = {};
    showsSeasonEpisodesLoading[id][season] = true;
    try {
      const episodes = await TraktService.show.season(id, season);
      if (!showsSeasonEpisodes[id]) showsSeasonEpisodes[id] = {};
      showsSeasonEpisodes[id][season] = episodes;
    } catch (e) {
      logger.error('Failed to fetch show season episodes', id, season);
      NotificationService.error(`Failed to fetch show season episodes '${id}', season '${season}'.`, e);
      throw e;
    } finally {
      showsSeasonEpisodesLoading[id][season] = false;
    }
  };

  const fetchShowEpisode = async (id: string, season: number, episode: number) => {
    if (showsEpisodesLoading[id]?.[season]?.[episode]) {
      logger.warn('Already fetching show episodes', id, season, episode);
      return;
    }

    logger.debug('Fetching Show Episodes', id, season, episode);

    if (!showsEpisodesLoading[id]) showsEpisodesLoading[id] = {};
    if (!showsEpisodesLoading[id][season]) showsEpisodesLoading[id][season] = {};
    showsEpisodesLoading[id][season][episode] = true;
    try {
      if (!showsEpisodes[id]) showsEpisodes[id] = {};
      if (!showsEpisodes[id][season]) showsEpisodes[id][season] = {};
      showsEpisodes[id][season][episode] = await TraktService.show.episode({ id, season, episode });
    } catch (e) {
      logger.error('Failed to fetch show episodes', id, season, episode);
      NotificationService.error(`Failed to fetch show episodes '${id}', season '${season}', episode '${episode}'.`, e);
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
  const getShowWatchedProgress = (id: number | string, cacheOptions?: BaseCacheOption) => {
    if (!showsWatchedProgress[id.toString()] && !showWatchedProgressLoading[id.toString()]) {
      fetchShowProgress(id.toString(), cacheOptions).catch(logger.error);
    }
    return computed(() => {
      const progress = showsWatchedProgress[id.toString()];
      if (!progress) return undefined;
      return watchProgressToListProgress(progress, id);
    });
  };

  const getShowCollectionLoading = (id: number | string) => computed(() => showCollectionProgressLoading[id.toString()]);
  const getShowCollectionProgress = (id: number | string) => {
    if (!showsCollectionProgress[id.toString()] && !showCollectionProgressLoading[id.toString()])
      fetchShowCollectionProgress(id.toString()).catch(logger.error);
    return computed(() => {
      const progress = showsCollectionProgress[id.toString()];
      if (!progress) return undefined;
      return watchProgressToListProgress(progress, id);
    });
  };

  const { user } = useUserSettingsStoreRefs();
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
  };
});

export const useShowStoreRefs = () => storeToRefs(useShowStore());
