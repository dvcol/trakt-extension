import { computed } from 'vue';

import type { Ref } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';
import type { TraktEpisode } from '~/models/trakt/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt/trakt-season.model';
import type { TraktShow } from '~/models/trakt/trakt-show.model';

export type ListScrollSourceItems<T extends string> = {
  id: number;

  movie?: TraktMovie<'short'>;
  show?: TraktShow<'short'>;
  season?: TraktSeason<'short'>;
  episode?: TraktEpisode<'short'>;
} & Record<T, string | number | Date>;

export const useListScroll = <T extends string>(items: Ref<ListScrollSourceItems<T>[]>, dateProp?: T) =>
  computed<ListScrollItem[]>(() => {
    const array = items.value;
    if (!array.length) return [];
    return array.map((item, index) => {
      const _item: ListScrollItem = { ...item, index, loading: item.id < 0 };

      if ('movie' in _item) _item.type = 'movie';
      else if ('episode' in _item) _item.type = 'episode';
      else if ('season' in _item) _item.type = 'season';
      else if ('show' in _item) _item.type = 'show';

      if (!dateProp || !item?.[dateProp]) return _item;

      const date: ListScrollItem['date'] = { current: new Date(item[dateProp]) };
      if (index > 1 && array[index - 1]?.[dateProp]) {
        date.previous = new Date(array[index - 1]?.[dateProp]);
      }
      if (array[index + 1]?.[dateProp]) {
        date.next = new Date(array[index + 1]?.[dateProp]);
      }
      date.sameDayAsPrevious = date.previous?.toLocaleDateString() === date.current?.toLocaleDateString();
      date.sameDayAsNext = date.next?.toLocaleDateString() === date.current?.toLocaleDateString();

      return { ..._item, date };
    });
  });
