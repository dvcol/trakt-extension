import { CacheRetention } from '@dvcol/common-utils/common/cache';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import type { TraktEpisode, TraktShow } from '@dvcol/trakt-http-client/models';

import type { ListScrollItem, ListScrollItemMeta, ListScrollSourceItem } from '~/models/list-scroll.model';

import { getContent, getTags, getTitle } from '~/components/common/list/use-list-scroll';
import { type ProgressItem } from '~/models/progress.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { useActivityStore } from '~/stores/data/activity.store';
import { debounceLoading, useLoadingPlaceholder } from '~/utils/store.utils';

export type ProgressListItem = Omit<
  ListScrollItem<
    ListScrollItemMeta<{
      episode: ListScrollSourceItem['episode'];
      show: ListScrollSourceItem['show'];
    }>
  >,
  'posterRef' | 'progressRef'
>;

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
    episode_type: progress.episodeTypeLabel,
    first_aired: progress.firstAired,
    runtime: Number(progress.runtime),
  };

  const show: ListScrollSourceItem['show'] = {
    ids: {
      trakt: Number(progress.showId),
    } as TraktShow['ids'],
    title: match ? match[1] : progress.fullTitle,
  } as ListScrollSourceItem['show'];

  const poster = progress.fanart ?? progress.screenshot;

  const id = Number(progress.episodeId ?? progress.seasonId ?? progress.showId);
  const title = getTitle({ show, episode });
  const meta = {
    source: progress,
    episode,
    show,
    ids: {
      show: { trakt: progress.showId ? Number(progress.showId) : undefined },
      season: { trakt: progress.seasonId ? Number(progress.seasonId) : undefined },
      episode: { trakt: progress.episodeId ? Number(progress.episodeId) : undefined },
    },
    number: {
      season: Number(progress.seasonNumber),
      episode: Number(progress.episodeNumber),
    },
  };

  return {
    id,
    index,
    key: `${index}-${id}`,
    title,
    content: getContent({ show, episode }),
    poster,
    getProgressQuery: () => ({
      id: show?.ids?.trakt,
      cacheOptions: {
        retention: CacheRetention.Day,
      },
    }),
    date: {
      current: new Date(progress.firstAired),
    },
    type: progress.type,
    meta,
    tags: getTags({ episode }, { id, type: progress.type, title, meta }),
  };
};

export const fetchProgressData = async (): Promise<ProgressListItem[]> => {
  const items = await TraktService.progress.onDeck();
  return items.map<ProgressListItem>(progressToListItem);
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

  const { evicted } = useActivityStore();
  const fetchProgress = async () => {
    if (!firstLoad.value && loading.value) {
      Logger.warn('Already fetching list');
      return;
    }
    if (firstLoad.value) firstLoad.value = false;

    Logger.debug('Fetching progress');
    loading.value = true;
    const { clearLoading } = debounceLoading(progress, loadingPlaceholder, { clear: true });
    try {
      progress.value = await fetchProgressData();
      evicted.progress = false;
    } catch (error) {
      progress.value = [];
      loading.value = false;

      if (error instanceof Response && error.status === 401) {
        Logger.warn('User is not logged in', error);
        loggedOut.value = true;
        return;
      }

      Logger.error(error);
      NotificationService.error('Failed to fetch progress', error);
      throw error;
    } finally {
      clearLoading();
      loading.value = false;
    }
  };

  return { loading, progress, fetchProgress, clearState, loggedOut };
});

export const useProgressStoreRefs = () => storeToRefs(useProgressStore());
