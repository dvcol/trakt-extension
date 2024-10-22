import { type AddOrRemoveIds, DefaultListId, DefaultLists, type ListItemTypes, ListType } from '~/models/list.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { useHistoryStore } from '~/stores/data/history.store';
import { useListStore } from '~/stores/data/list.store';
import { useMovieStore } from '~/stores/data/movie.store';
import { useShowStore } from '~/stores/data/show.store';
import { useI18n } from '~/utils/i18n.utils';

export type AddOrRemoveQuery = {
  itemIds: AddOrRemoveIds;
  itemType: ListItemTypes;
  remove?: boolean;
  showId?: number | string;
  date?: string | number | Date;
};

export const useWatchedUpdates = () => {
  const i18n = useI18n('common');

  const { addToOrRemoveFromList } = useListStore();
  const { fetchMovieWatched, fetchMovieCollected } = useMovieStore();
  const { fetchShowProgress, fetchShowCollectionProgress } = useShowStore();
  const { fetchHistory } = useHistoryStore();

  const addOrRemovePlayed = async ({ itemIds, itemType, remove, showId, date = new Date() }: AddOrRemoveQuery) => {
    const ids = Array.isArray(itemIds) ? itemIds.map(({ trakt }) => trakt) : itemIds.trakt;
    if (!ids) {
      const error = new Error('Trakt ID is required');
      Logger.error('Failed to update watched status', error);
      NotificationService.error(i18n(`history_${remove ? 'remove' : 'add'}_failed`, 'common', 'error'), error);
    }
    try {
      await addToOrRemoveFromList({
        list: {
          id: DefaultListId.History,
          type: ListType.History,
          name: 'list_type__history',
        },
        itemType,
        itemIds,
        date,
        remove,
      });
      if (itemType === 'movie') await fetchMovieWatched(true);
      if (showId) await fetchShowProgress(showId.toString(), { force: true });
      await fetchHistory();
    } catch (error) {
      Logger.error('Failed to update watched status', error);
      NotificationService.error(i18n(`history_${remove ? 'remove' : 'add'}_failed`, 'common', 'error'), error);
    }
  };

  const addOrRemoveCollected = async ({ itemIds, itemType, remove, showId, date = new Date() }: AddOrRemoveQuery) => {
    const ids = Array.isArray(itemIds) ? itemIds.map(({ trakt }) => trakt) : itemIds.trakt;
    if (!ids) {
      const error = new Error('Trakt ID is required');
      Logger.error('Failed to update collection status', error);
      NotificationService.error(i18n(`collection_${remove ? 'remove' : 'add'}_failed`, 'common', 'error'), error);
    }
    try {
      await addToOrRemoveFromList({
        list: DefaultLists.ShowCollection,
        itemType,
        itemIds,
        date,
        remove,
      });

      if (itemType === 'movie') await fetchMovieCollected(true);
      if (showId) await fetchShowCollectionProgress(showId.toString(), { force: true });
    } catch (error) {
      Logger.error('Failed to update collection', error);
      NotificationService.error(i18n(`collection_${remove ? 'remove' : 'add'}_failed`, 'common', 'error'), error);
    }
  };

  return { addOrRemovePlayed, addOrRemoveCollected };
};
