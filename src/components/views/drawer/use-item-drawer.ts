import { useRouter } from 'vue-router';

import type { ListScrollItem } from '~/models/list-scroll.model';

export const useItemDrawer = () => {
  const { push, currentRoute } = useRouter();

  const onItemClick = ({ item }: { item: ListScrollItem }) => {
    const type = item?.type;
    if (!type) return;
    const { path } = currentRoute.value;
    if (!path) return;
    const id = item?.meta?.ids?.[type]?.trakt;
    const showId = item?.meta?.ids?.show?.trakt;
    const seasonId = item?.meta?.ids?.season?.trakt;
    const episodeId = item?.meta?.ids?.episode?.trakt;
    switch (type) {
      case 'person':
      case 'movie':
      case 'show':
        if (!id) return;
        return push(`${path}/${type}/${id}`);
      case 'season':
        if (!showId || !seasonId) return;
        return push({ path: `${path}/show/${showId}/${type}/${seasonId}` });
      case 'episode':
        if (!showId || !episodeId) return;
        return push({
          path: `${path}/show/${showId}/${type}/${episodeId}`,
        });
      default:
        break;
    }
  };

  return { onItemClick, currentRoute, push };
};
