import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive } from 'vue';

import type { TraktWatchedProgress } from '~/models/trakt/trakt-progress.model';
import type { TraktShowExtended } from '~/models/trakt/trakt-show.model';

import { type ListScrollItemProgress, ListScrollItemProgressType } from '~/models/list-scroll.model';
import { TraktService } from '~/services/trakt.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { debounce } from '~/utils/debounce.utils';

type ShowDictionary = Record<string, TraktShowExtended>;
type ShowProgressDictionary = Record<string, TraktWatchedProgress>;
type LoadingDictionary = Record<string, boolean>;

const watchProgressToListProgress = (progress: TraktWatchedProgress, id: string | number): ListScrollItemProgress => {
  let total = 0;
  let completed = 0;
  const item = {
    id,
    ...progress,
    type: ListScrollItemProgressType.watched,
    date: new Date(progress.last_watched_at),
    seasons: progress.seasons.map(season => ({
      ...season,
      episodes: season.episodes.map(episode => {
        total += 1;
        if (episode.completed) completed += 1;
        return {
          ...episode,
          date: new Date(episode.last_watched_at),
        };
      }),
    })),
  };
  return { ...item, percentage: (completed / total) * 100, total, completed };
};

export const useShowStore = defineStore('data.show', () => {
  const shows = reactive<ShowDictionary>({});
  const showsProgress = reactive<ShowProgressDictionary>({});
  const showsLoading = reactive<LoadingDictionary>({});
  const progressLoading = reactive<LoadingDictionary>({});

  const clearState = () => {
    Object.assign(shows, {});
    Object.assign(showsProgress, {});
    Object.assign(showsLoading, {});
    Object.assign(progressLoading, {});
  };

  const saveState = async () =>
    debounce(() => Promise.all([storage.local.set('data.show', shows.value), storage.local.set('data.show.progress', showsProgress.value)]), 1000);

  const restoreState = async () => {
    const [_shows, _showProgress] = await Promise.all([
      storage.local.get<ShowDictionary>('data.show'),
      storage.local.get<ShowProgressDictionary>('data.show.progress'),
    ]);
    if (_shows) Object.assign(shows, _shows);
    if (_showProgress) Object.assign(showsProgress, _showProgress);
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

  const getShow = (id: number | string) => computed(() => shows[id.toString()]);

  const getShowProgress = (id: number | string) => {
    if (!showsProgress[id.toString()] && !progressLoading[id.toString()]) fetchShowProgress(id.toString()).catch(console.error);
    return computed(() => {
      const progress = showsProgress[id.toString()];
      if (!progress) return undefined;
      return watchProgressToListProgress(progress, id);
    });
  };

  const getShowLoading = (id: number | string) => computed(() => showsLoading[id.toString()]);
  const getShowProgressLoading = (id: number | string) => computed(() => progressLoading[id.toString()]);

  const initShowStore = async () => {
    await restoreState();
  };

  return {
    clearState,
    initShowStore,
    getShow,
    getShowLoading,
    getShowProgress,
    getShowProgressLoading,
  };
});

export const useShowStoreRefs = () => storeToRefs(useShowStore());
