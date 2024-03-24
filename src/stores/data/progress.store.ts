import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import type { ListScrollItem, ListScrollSourceItem } from '~/models/list-scroll.model';

import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

import { getContent, getTags, getTitle } from '~/components/common/list/use-list-scroll';
import { type ProgressItem } from '~/models/progress.model';
import { TraktService } from '~/services/trakt.service';
import { debounceLoading, useLoadingPlaceholder } from '~/utils/store.utils';

type ProgressListItem = Omit<ListScrollItem, 'posterRef'>;

const titleRegex = /(.*)\s\d+x\d+\s"([^"]+)"/;
export const progressToListItem = (progress: ProgressItem, index: number): ProgressListItem => {
  const match = titleRegex.exec(progress.fullTitle);

  const episode: ListScrollSourceItem['episode'] = {
    ids: {
      trakt: Number(progress.episodeId),
    } as TraktEpisode['ids'],
    title: match ? match[2] : progress.fullTitle,
    season: Number(progress.seasonNumber),
    number: Number(progress.episodeNumber),
  };

  const show: ListScrollSourceItem['show'] = {
    ids: {
      trakt: Number(progress.showId),
    } as TraktShow['ids'],
    title: match ? match[1] : progress.fullTitle,
  } as ListScrollSourceItem['show'];

  const poster = progress.fanart ?? progress.screenshot;

  return {
    id: Number(progress.episodeId ?? progress.seasonId ?? progress.showId),
    index,
    title: getTitle({ show, episode }),
    content: getContent({ show, episode }),
    poster,
    date: {
      current: new Date(progress.firstAired),
    },
    type: progress.type,
    tags: getTags({ episode }, progress.type),
    meta: {
      source: progress,
      episode,
      show,
      ids: {
        show: progress.showId ? Number(progress.showId) : undefined,
        season: progress.seasonId ? Number(progress.seasonId) : undefined,
        episode: progress.episodeId ? Number(progress.episodeId) : undefined,
      },
    },
  };
};

export const useProgressStore = defineStore('data.progress', () => {
  const firstLoad = ref(true);
  const loading = ref(true);
  const progress = ref<ProgressListItem[]>([]);
  const loggedOut = ref(false);

  const clearState = () => {
    progress.value = [];
  };

  const loadingPlaceholder = useLoadingPlaceholder<ProgressListItem>(ref(10));

  const fetchProgress = async () => {
    if (!firstLoad.value && loading.value) {
      console.warn('Already fetching list');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    console.info('Fetching progress', progress);
    loading.value = true;
    const timeout = debounceLoading(progress, loadingPlaceholder, true);
    try {
      const items = await TraktService.progress();
      progress.value = items.map(progressToListItem);
    } catch (error) {
      if (error instanceof Response && error.status === 401) {
        console.warn('User is not logged in', error);
        loggedOut.value = true;
        progress.value = [];
        loading.value = false;
        return;
      }
      console.error(error);
      progress.value = [];
      throw error;
    } finally {
      clearTimeout(timeout);
      loading.value = false;
    }
  };

  return { loading, progress, fetchProgress, clearState, loggedOut };
});

export const useProgressStoreRefs = () => storeToRefs(useProgressStore());
