import { computed, onActivated, onDeactivated, onMounted, ref, type Ref, watch } from 'vue';

import type { ListScrollSourceItemWithDate } from '~/components/common/list/useListScroll';
import type { TraktClientPagination } from '~/models/trakt/trakt-client.model';

import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { debounce } from '~/utils/debounce.utils';

const codesRegex = /[sS]?\d+([eExX])\d+/g;
const getCodeRegex = (season: number, episode: number) => new RegExp(`^[sS]?0*${season}([eExX])0*${episode}$`);

export const useSearchFilter = <D extends string, T extends ListScrollSourceItemWithDate<D>>(data: Ref<T[]>, search: Ref<string>, date: D) =>
  computed(() => {
    if (!search.value) return data.value;
    const _searchRaw = search.value.toLowerCase().trim();
    const _searchCode = _searchRaw.match(codesRegex);
    const _search = _searchRaw.replace(codesRegex, '').trim();
    return data.value.filter((item: T) => {
      if (item.episode) {
        const codeRegex = getCodeRegex(item.episode.season, item.episode.number);
        const matchCode = _searchCode?.some(_code => codeRegex.test(_code));
        if (_search && item.episode?.title?.toLowerCase().includes(_search)) return _searchCode ? matchCode : true;
        if (_search && item.show?.title?.toLowerCase().includes(_search)) return _searchCode ? matchCode : true;
        if (codeRegex.test(_searchRaw)) return true;
      }
      if (!_search) return false;
      if (item.show?.title?.toLowerCase().includes(_search)) return true;
      if (item.movie?.title?.toLowerCase().includes(_search)) return true;
      return !!(item?.[date] && new Date(item[date]).toLocaleString().toLowerCase().includes(_search));
    });
  });

export const useBelowThreshold = (threshold: Ref<number>, pagination: Ref<TraktClientPagination | undefined>) =>
  computed(
    () =>
      pagination.value?.page &&
      pagination.value?.pageCount &&
      pagination.value.page !== pagination.value.pageCount &&
      pagination.value.page < threshold.value,
  );

export const useLoadingPlaceholder = <T>(pageSize: Ref<number>) =>
  computed<T[]>(() =>
    Array(pageSize.value)
      .fill({ id: -1 })
      .map((_, i) => ({ id: -1 * (i + 1) }) as T),
  );

export const watchUserChange = (fetch: () => Promise<void>, clear: () => void) => {
  const { user } = useUserSettingsStoreRefs();

  const active = ref(false);

  onActivated(async () => {
    active.value = true;
    await fetch();
  });

  onDeactivated(() => {
    active.value = false;
  });

  onMounted(() => {
    watch(user, async () => {
      if (active.value) await fetch();
      else clear();
    });
  });

  return { active, user };
};

export const useDebouncedSearch = (search: Ref<string>) => {
  const debouncedSearch = ref(search.value);

  watch(search, () => {
    if (search.value !== debouncedSearch.value) {
      debouncedSearch.value = search.value;
    }
  });

  watch(
    debouncedSearch,
    debounce(() => {
      search.value = debouncedSearch.value;
    }, 350),
  );

  return debouncedSearch;
};
