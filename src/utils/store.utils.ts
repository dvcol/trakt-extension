import { computed, onActivated, onDeactivated, onMounted, ref, type Ref, watch } from 'vue';

import type { TraktClientPagination } from '@dvcol/trakt-http-client/models';
import type { ListScrollSourceItemWithDate } from '~/components/common/list/use-list-scroll';

import { ListScrollItemType } from '~/models/list-scroll.model';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { debounce } from '~/utils/debounce.utils';

const codesRegex = /[sS]?\d+([eExX])\d+/g;
const getCodeRegex = (season: number, episode: number) => new RegExp(`^[sS]?0*${season}([eExX])0*${episode}$`);

export const useSearchFilter = <D extends string, T extends ListScrollSourceItemWithDate<D>>(
  data: Ref<T[]>,
  search: Ref<string>,
  date?: D | ((item: T) => ListScrollSourceItemWithDate<D>[D]),
) =>
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
      if (item.person?.name?.toLowerCase().includes(_search)) return true;
      if (!date) return false;
      const _date = typeof date === 'function' ? date(item) : item[date];
      if (!_date) return false;
      return new Date(_date).toLocaleString().toLowerCase().includes(_search);
    });
  });

export const useBelowThreshold = (threshold: Ref<number>, pagination: Ref<TraktClientPagination | undefined>) =>
  computed(
    () =>
      !!(
        pagination.value?.page &&
        pagination.value?.pageCount &&
        pagination.value.page !== pagination.value.pageCount &&
        pagination.value.page < threshold.value
      ),
  );

export const useLoadingPlaceholder = <T>(pageSize: Ref<number> = ref(50)) =>
  computed<T[]>(() =>
    Array(pageSize.value)
      .fill({ id: -1, type: ListScrollItemType.loading, loading: true })
      .map((_, i) => ({ ..._, id: -1 * (i + 1) }) as T),
  );

export const watchUserChange = ({
  fetch,
  clear,
  mounted,
  activated,
  deactivated,
  userChange,
}: {
  fetch?: () => Promise<void>;
  clear?: () => void | Promise<void>;
  mounted?: () => void | Promise<void>;
  activated?: (changed?: boolean) => void | Promise<void>;
  deactivated?: () => void | Promise<void>;
  userChange?: (active: boolean) => void | Promise<void>;
}) => {
  const { user } = useUserSettingsStoreRefs();

  const active = ref(false);
  const changed = ref(false);

  onActivated(async () => {
    active.value = true;
    if (activated) return activated(changed.value);
    await fetch?.();
  });

  onDeactivated(() => {
    active.value = false;
    changed.value = false;
    deactivated?.();
  });

  onMounted(() => {
    mounted?.();
    watch(
      user,

      async () => {
        if (!active.value) changed.value = true;

        if (userChange) return userChange(active.value);
        if (active.value) await fetch?.();
        else clear?.();
      },
    );
  });

  return { active, user };
};

export const useDebouncedSearch = (search: Ref<string>, delay = 350, disabled?: Ref<boolean>) => {
  const debouncedSearch = ref(search.value);

  watch(search, () => {
    if (search.value !== debouncedSearch.value) {
      debouncedSearch.value = search.value;
    }
  });

  watch(
    debouncedSearch,
    debounce(() => {
      if (disabled?.value) return;
      search.value = debouncedSearch.value;
    }, delay),
  );

  return debouncedSearch;
};

export const debounceLoading = <T>(data: Ref<T[]>, placeholder: Ref<T[]>, clear?: boolean) =>
  setTimeout(() => {
    data.value = clear ? placeholder.value : [...data.value, ...placeholder.value];
  }, 100);
