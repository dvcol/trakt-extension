import type { ListScrollItem, ListScrollSourceItem } from '~/models/list-scroll.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

import { getContent, getTitle } from '~/components/common/list/use-list-scroll';

export type ProgressItem = {
  episodeId: string;
  episodeNumber: string;
  episodeTitle: string;
  fanart: string;
  firstAired: string;
  fullTitle: string;
  logo: string;
  runtime: string;
  safe: string;
  screenshot: string;
  seasonId: string;
  seasonNumber: string;
  showId: string;
  topTitle: string;
  totalRuntime: string;
  type: 'show' | 'season' | 'episode';
  url: string;
};

const titleRegex = /(.*)\s\d+x\d+\s"([^"]+)"/;
export const progressToListItem = (progress: ProgressItem): Omit<ListScrollItem, 'index'> => {
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
    title: getTitle({ show, episode }),
    content: getContent({ show, episode }),
    poster,
    date: {
      current: new Date(progress.firstAired),
    },
    type: progress.type,
    meta: {
      ids: {
        show: progress.showId ? Number(progress.showId) : undefined,
        season: progress.seasonId ? Number(progress.seasonId) : undefined,
        episode: progress.episodeId ? Number(progress.episodeId) : undefined,
      },
      show,
      episode,
      source: progress,
    },
  };
};
