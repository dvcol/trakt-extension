import { useRouter } from 'vue-router';

import type { ListScrollItem } from '~/models/list-scroll.model';

export const usePanelItem = ({ push, currentRoute } = useRouter()) => {
  const onItemClick = ({
    type,
    id,
    showId,
    seasonNumber,
    episodeNumber,
    item,
  }: {
    type?: 'person' | 'movie' | 'show' | 'season' | 'episode';
    id?: number;
    showId?: number;
    seasonNumber?: number;
    episodeNumber?: number;

    item?: ListScrollItem;
  }) => {
    const _type = type ?? item?.type;
    if (!_type) return;
    const base = currentRoute.value.name?.toString();
    if (!base) return;
    const _id = id ?? item?.meta?.ids?.[_type]?.trakt;
    const _showId = showId ?? item?.meta?.ids?.show?.trakt;
    const _seasonNumber = seasonNumber ?? item?.meta?.number?.season;
    const _episodeNumber = episodeNumber ?? item?.meta?.number?.episode;
    switch (_type) {
      case 'person':
      case 'movie':
      case 'show':
        if (!_id) return;
        return push({
          name: `${base}-${_type}`,
          params: { [`${_type}Id`]: _id },
        });
      case 'season':
        if (_showId === undefined || _seasonNumber === undefined) return;
        return push({
          name: `${base}-${_type}`,
          params: {
            showId: _showId,
            seasonNumber: _seasonNumber,
          },
        });
      case 'episode':
        if (_showId === undefined || _seasonNumber === undefined || _episodeNumber === undefined) return;
        return push({
          name: `${base}-${_type}`,
          params: {
            showId: _showId,
            seasonNumber: _seasonNumber,
            episodeNumber: _episodeNumber,
          },
        });
      default:
        break;
    }
  };

  return { onItemClick, currentRoute, push };
};
