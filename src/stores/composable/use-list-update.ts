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

  const fetchWatched = async ({ itemType, showId }: Pick<AddOrRemoveQuery, 'itemType' | 'showId'>, force?: boolean) => {
    if (itemType === 'movie') await fetchMovieWatched(force);
    if (showId) await fetchShowProgress(showId.toString(), { force });
  };

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
      await fetchWatched({ itemType, showId }, true);
      await fetchHistory();
    } catch (error) {
      Logger.error('Failed to update watched status', error);
      NotificationService.error(i18n(`history_${remove ? 'remove' : 'add'}_failed`, 'common', 'error'), error);
    }
  };

  const fetchCollection = async ({ itemType, showId }: Pick<AddOrRemoveQuery, 'itemType' | 'showId'>, force?: boolean) => {
    if (itemType === 'movie') await fetchMovieCollected(force);
    if (showId) await fetchShowCollectionProgress(showId.toString(), { force });
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
      await fetchCollection({ itemType, showId }, true);
    } catch (error) {
      Logger.error('Failed to update collection', error);
      NotificationService.error(i18n(`collection_${remove ? 'remove' : 'add'}_failed`, 'common', 'error'), error);
    }
  };

  return { addOrRemovePlayed, addOrRemoveCollected, fetchWatched, fetchCollection };
};
