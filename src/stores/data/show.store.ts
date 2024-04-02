import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, type Ref, ref } from 'vue';

import type { TraktEpisodeExtended } from '~/models/trakt/trakt-episode.model';
import type { TraktWatchedProgress } from '~/models/trakt/trakt-progress.model';
import type { TraktSeasonExtended } from '~/models/trakt/trakt-season.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import { type ListScrollItemProgress, ListScrollItemProgressType } from '~/models/list-scroll.model';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

export type ShowSeasons = Record<number, TraktSeasonExtended>;

type ShowDictionary = Record<string, TraktShowExtended>;
type ShowSeasonDictionary = Record<string, ShowSeasons>;
type ShowEpisodeDictionary = Record<string, Record<number, Record<number, TraktEpisodeExtended>>>;
type ShowProgressDictionary = Record<string, TraktWatchedProgress>;

type LoadingDictionary = Record<string, boolean>;
type EpisodeLoadingDictionary = Record<string, Record<number, Record<number, boolean>>>;

const watchProgressToListProgress = (progress: TraktWatchedProgress, id: string | number): ListScrollItemProgress => {
  const total: number = progress.aired;
  const { completed } = progress;
  const percentage = (completed / total) * 100;
  return {
    id,
    percentage,
    total,
    ...progress,
    type: ListScrollItemProgressType.watched,
    date: new Date(progress.last_watched_at),
    seasons: progress.seasons.map(season => ({
      ...season,
      episodes: season.episodes.map(episode => ({
        ...episode,
        date: new Date(episode.last_watched_at),
      })),
    })),
  };
};

export const useShowStore = defineStore('data.show', () => {
  const shows = reactive<ShowDictionary>({});
  const showsSeasons = reactive<ShowSeasonDictionary>({});
  const showsEpisodes = reactive<ShowEpisodeDictionary>({});
  const showsProgress = reactive<ShowProgressDictionary>({});
  const showsLoading = reactive<LoadingDictionary>({});
  const showsSeasonsLoading = reactive<LoadingDictionary>({});
  const showsEpisodesLoading = reactive<EpisodeLoadingDictionary>({});
  const progressLoading = reactive<LoadingDictionary>({});

  const clearState = () => {
    Object.assign(shows, {});
    Object.assign(showsSeasons, {});
    Object.assign(showsEpisodes, {});
    Object.assign(showsProgress, {});
    Object.assign(showsLoading, {});
    Object.assign(showsSeasonsLoading, {});
    Object.assign(showsEpisodesLoading, {});
    Object.assign(progressLoading, {});
  };

  const saveState = async () =>
    debounce(
      () =>
        Promise.all([
          storage.local.set('data.show', shows.value),
          storage.local.set('data.show.season', showsSeasons.value),
          storage.local.set('data.show.episode', showsEpisodes.value),
          storage.local.set('data.show.progress', showsProgress.value),
        ]),
      1000,
    );

  const restoreState = async () => {
    const [_shows, _showSeason, _showEpisode, _showProgress] = await Promise.all([
      storage.local.get<ShowDictionary>('data.show'),
      storage.local.get<ShowSeasonDictionary>('data.show.season'),
      storage.local.get<ShowEpisodeDictionary>('data.show.episode'),
      storage.local.get<ShowProgressDictionary>('data.show.progress'),
    ]);
    if (_shows) Object.assign(shows, _shows);
    if (_showSeason) Object.assign(showsSeasons, _showSeason);
    if (_showEpisode) Object.assign(showsEpisodes, _showEpisode);
    if (_showProgress) Object.assign(showsProgress, _showProgress);
  };

  const fetchShow = async (id: string) => {
    if (showsLoading[id]) {
      console.warn('Already fetching show', id);
    }

    console.info('Fetching Show', id);

    showsLoading[id] = true;
    try {
      shows[id] = await TraktService.show.summary(id);
    } catch (e) {
      console.error('Failed to fetch show', id);
      NotificationService.error(`Failed to fetch show '${id}'.`, e);
      throw e;
    } finally {
      showsLoading[id] = false;
      await saveState();
    }
  };

  const fetchShowProgress = async (id: string) => {
    if (progressLoading[id]) {
      console.warn('Already fetching show progress', id);
    }

    console.info('Fetching Show Progress', id);

    progressLoading[id] = true;
    try {
      showsProgress[id] = await TraktService.progress.show(id);
    } catch (e) {
      console.error('Failed to fetch show progress', id);
      throw e;
    } finally {
      showsLoading[id] = false;
      await saveState();
    }
  };

  const fetchShowSeasons = async (id: string) => {
    if (showsSeasonsLoading[id]) {
      console.warn('Already fetching show seasons', id);
    }

    console.info('Fetching Show Seasons', id);

    showsSeasonsLoading[id] = true;
    try {
      const seasons = await TraktService.show.seasons(id);
      showsSeasons[id] = seasons.reduce<ShowSeasonDictionary[number]>((acc, season) => {
        acc[season.number] = season;
        return acc;
      }, {});
    } catch (e) {
      console.error('Failed to fetch show seasons', id);
      NotificationService.error(`Failed to fetch show seasons '${id}'.`, e);
      throw e;
    } finally {
      showsSeasonsLoading[id] = false;
      await saveState();
    }
  };

  const fetchShowEpisodes = async (id: string, season: number, episode: number) => {
    if (showsEpisodesLoading[id]?.[season]?.[episode]) {
      console.warn('Already fetching show episodes', id, season, episode);
    }

    console.info('Fetching Show Episodes', id, season, episode);

    if (!showsEpisodesLoading[id]) showsEpisodesLoading[id] = {};
    if (!showsEpisodesLoading[id][season]) showsEpisodesLoading[id][season] = {};
    showsEpisodesLoading[id][season][episode] = true;
    try {
      if (!showsEpisodes[id]) showsEpisodes[id] = {};
      if (!showsEpisodes[id][season]) showsEpisodes[id][season] = {};
      showsEpisodes[id][season][episode] = await TraktService.show.episode({ id, season, episode });
    } catch (e) {
      console.error('Failed to fetch show episodes', id, season, episode);
      NotificationService.error(`Failed to fetch show episodes '${id}', season '${season}', episode '${episode}'.`, e);
      throw e;
    } finally {
      showsEpisodesLoading[id][season][episode] = false;
      await saveState();
    }
  };

  const getter = <T>(fn: () => Promise<T>, loading: Ref<boolean>, response = ref<T>()) => {
    const unsub = ref(false);
    return {
      response: fn().then(res => {
        if (!unsub.value) response.value = res;
        return res;
      }),
      loading,
      unsub: () => {
        unsub.value = true;
      },
    };
  };

  const getShowLoading = (id: number | string) => computed(() => showsLoading[id.toString()]);
  const getShow = async (id: number | string) => {
    if (!shows[id.toString()] && !showsLoading[id.toString()]) await fetchShow(id.toString());
    return shows[id.toString()];
  };
  const getShowRef = (id: number | string, response = ref<TraktShowExtended>()) => getter(() => getShow(id), getShowLoading(id), response);

  const getSeasonsLoading = (id: number | string) => computed(() => showsSeasonsLoading[id.toString()]);
  const getShowSeasons = async (id: number | string) => {
    if (!showsSeasons[id.toString()] && !showsSeasonsLoading[id.toString()]) await fetchShowSeasons(id.toString());
    return showsSeasons[id.toString()];
  };
  const getShowSeasonsRef = (id: number | string, response = ref<ShowSeasons>()) => getter(() => getShowSeasons(id), getSeasonsLoading(id), response);

  const getEpisodesLoading = (id: number | string, season: number, episode: number) =>
    computed(() => showsEpisodesLoading[id.toString()]?.[season]?.[episode]);
  const getShowEpisode = async ({ id, season, episode }: { id: number | string; season: number; episode: number }) => {
    if (!showsEpisodes[id.toString()]?.[season]?.[episode] && !showsEpisodesLoading[id.toString()]?.[season]?.[episode]) {
      await fetchShowEpisodes(id.toString(), season, episode);
    }
    return showsEpisodes[id.toString()]?.[season]?.[episode];
  };
  const getShowEpisodeRef = (
    { id, season, episode }: { id: number | string; season: number; episode: number },
    response = ref<TraktEpisodeExtended>(),
  ) => getter(() => getShowEpisode({ id, season, episode }), getEpisodesLoading(id, season, episode), response);

  const getShowProgressLoading = (id: number | string) => computed(() => progressLoading[id.toString()]);
  const getShowProgress = (id: number | string) => {
    if (!showsProgress[id.toString()] && !progressLoading[id.toString()]) fetchShowProgress(id.toString()).catch(console.error);
    return computed(() => {
      const progress = showsProgress[id.toString()];
      if (!progress) return undefined;
      return watchProgressToListProgress(progress, id);
    });
  };

  const initShowStore = async () => {
    await restoreState();
  };

  return {
    clearState,
    initShowStore,
    getShow,
    getShowRef,
    getShowLoading,
    getShowSeasons,
    getShowSeasonsRef,
    getSeasonsLoading,
    getShowEpisode,
    getShowEpisodeRef,
    getEpisodesLoading,
    getShowProgress,
    getShowProgressLoading,
  };
});

export const useShowStoreRefs = () => storeToRefs(useShowStore());
