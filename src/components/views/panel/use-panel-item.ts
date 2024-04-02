import { useRouter } from 'vue-router';

import type { ListScrollItem } from '~/models/list-scroll.model';

export const usePanelItem = () => {
  const { push, currentRoute } = useRouter();

  const onItemClick = ({ item }: { item: ListScrollItem }) => {
    const type = item?.type;
    if (!type) return;
    const { path } = currentRoute.value;
    if (!path) return;
    const id = item?.meta?.ids?.[type]?.trakt;
    const showId = item?.meta?.ids?.show?.trakt;
    const seasonNumber = item?.meta?.number?.season;
    const episodeNumber = item?.meta?.number?.episode;
    switch (type) {
      case 'person':
      case 'movie':
      case 'show':
        if (!id) return;
        return push(`${path}/${type}/${id}`);
      case 'season':
        if (!showId || !seasonNumber) return;
        return push({ path: `${path}/show/${showId}/${type}/${seasonNumber}` });
      case 'episode':
        if (!showId || !seasonNumber || !episodeNumber) return;
        return push({
          path: `${path}/show/${showId}/season/${seasonNumber}/${type}/${episodeNumber}`,
        });
      default:
        break;
    }
  };

  return { onItemClick, currentRoute, push };
};
