import { computed, ref, type Ref } from 'vue';

import type { ListScrollItem, ShowProgress } from '~/models/list-scroll.model';

import { useHistoryStore } from '~/stores/data/history.store';
import { useMovieStore } from '~/stores/data/movie.store';
import { useShowStore } from '~/stores/data/show.store';

export const useItemPlayed = (
  item?: Ref<ListScrollItem>,
  {
    showPlayed = ref(true),
    showProgress = ref(true),
  }: {
    showPlayed?: Ref<boolean>;
    showProgress?: Ref<boolean>;
  } = {},
) => {
  const { getMovieWatched } = useMovieStore();
  const { getMovieHistory, getEpisodeHistory } = useHistoryStore();
  const { getShowWatchedProgress } = useShowStore();

  const progress = computed<ShowProgress | undefined>(() => {
    if (!showProgress.value && !showPlayed.value) return;
    if (item?.value?.progress) return item.value?.progress;
    if (item?.value?.progressRef) return item.value?.progressRef.value;
    if (!item?.value?.getProgressQuery) return;
    const { id } = item.value?.getProgressQuery() ?? {};
    if (!id) return;
    return getShowWatchedProgress(id).value;
  });

  const movieHistory = computed(() => {
    if (!showPlayed.value) return;
    const _item = item?.value;
    if (_item?.type !== 'movie') return;
    if (!_item?.meta?.ids?.movie?.trakt) return;
    return getMovieHistory(_item.meta.ids.movie.trakt)?.value;
  });

  const movieWatched = computed(() => {
    if (!showPlayed.value) return;
    const _item = item?.value;
    if (_item?.type !== 'movie') return;
    if (!_item?.meta?.ids?.movie?.trakt) return;
    return getMovieWatched(_item.meta.ids.movie.trakt)?.value;
  });

  const moviePlayed = computed(() => {
    if (!showPlayed.value) return;
    if (movieWatched.value !== undefined) return movieWatched.value?.last_watched_at;
    return movieHistory.value?.watched_at;
  });

  const episodeProgress = computed(() => {
    if (!showPlayed.value) return;
    const _item = item?.value;
    if (_item?.type !== 'episode') return;
    const _progress = progress.value;
    if (!_progress) return;
    const _season = _item.meta?.number?.season;
    const _episode = _item.meta?.number?.episode;
    if (!_season || !_episode) return;
    return _progress.seasons?.find(s => s.number === _season)?.episodes?.find(e => e.number === _episode);
  });

  const episodeHistory = computed(() => {
    if (!showPlayed.value) return;
    const _item = item?.value;
    if (_item?.type !== 'episode') return;
    if (!_item?.meta?.ids?.episode?.trakt) return;
    return getEpisodeHistory(_item.meta.ids.episode.trakt)?.value;
  });

  const episodePlayed = computed(() => {
    if (!showPlayed.value) return;
    if (episodeProgress.value !== undefined) {
      return {
        date: episodeProgress.value?.date,
        completed: episodeProgress.value?.completed,
      };
    }
    return {
      date: episodeHistory.value?.watched_at,
      completed: !!episodeHistory.value,
    };
  });

  const played = computed(() => {
    if (!showPlayed.value) return false;
    if (item?.value?.type === 'movie') return !!moviePlayed.value;
    if (item?.value?.type !== 'episode') return false;
    return episodePlayed.value?.completed;
  });

  const date = computed(() => {
    if (!played.value) return;
    if (item?.value?.type === 'movie') {
      if (!moviePlayed.value) return;
      return new Date(moviePlayed.value).toLocaleString();
    }
    if (!episodePlayed.value?.date) return;
    return new Date(episodePlayed.value?.date).toLocaleString();
  });

  return { progress, played, date };
};

export const useItemCollected = (item?: Ref<ListScrollItem>, showCollected: Ref<boolean> = ref(true)) => {
  const { getMovieCollected } = useMovieStore();
  const { getShowCollectionProgress } = useShowStore();

  const collection = computed<ShowProgress | undefined>(() => {
    if (!showCollected.value) return;
    if (!item?.value?.getProgressQuery) return;
    const { id } = item.value?.getProgressQuery() ?? {};
    if (!id) return;
    return getShowCollectionProgress(id).value;
  });

  const collected = computed(() => {
    if (!showCollected.value) return false;
    const _item = item?.value;
    if (_item?.type === 'movie' && _item?.meta?.ids?.movie?.trakt) {
      return getMovieCollected(_item.meta.ids.movie.trakt)?.value?.collected_at;
    }
    if (_item?.type !== 'episode') return false;
    const _collection = collection.value;

    if (!_collection) return false;
    const _season = _item.meta?.number?.season;
    const _episode = _item.meta?.number?.episode;
    if (!_season || !_episode) return false;
    return _collection.seasons?.find(s => s.number === _season)?.episodes?.find(e => e.number === _episode)?.date;
  });

  const date = computed(() => {
    if (!collected.value) return;
    if (typeof collected.value !== 'string') return;
    return new Date(collected.value).toLocaleString();
  });

  return { collected, date };
};
