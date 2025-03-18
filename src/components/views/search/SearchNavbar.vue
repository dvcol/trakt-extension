<script setup lang="ts">
import UFuzzy from '@leeoniya/ufuzzy';
import {
  NAutoComplete,
  NFlex,
  NIcon,
  NSelect,
  NSwitch,
  NTooltip,
  type SelectOption,
} from 'naive-ui';

import {
  type Component,
  computed,
  defineProps,
  h,
  onActivated,
  onDeactivated,
  ref,
  watch,
} from 'vue';

import { useRoute } from 'vue-router';

import type { TraktSearchType } from '@dvcol/trakt-http-client/models';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import NavbarPageSizeSelect from '~/components/common/navbar/NavbarPageSizeSelect.vue';
import TextHtml from '~/components/common/typography/TextHtml.vue';
import IconAccount from '~/components/icons/IconAccount.vue';
import IconChevronDown from '~/components/icons/IconChevronDownSmall.vue';
import IconChevronUp from '~/components/icons/IconChevronUpSmall.vue';
import IconList from '~/components/icons/IconList.vue';
import IconLoop from '~/components/icons/IconLoop.vue';
import IconMovie from '~/components/icons/IconMovie.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import IconScreen from '~/components/icons/IconScreen.vue';
import IconYoutube from '~/components/icons/IconYoutube.vue';
import { Logger } from '~/services/logger.service';
import { ResolveExternalLinks } from '~/settings/external.links';
import {
  SupportedSearchType,
  useSearchStore,
  useSearchStoreRefs,
} from '~/stores/data/search.store';
import { debounce } from '~/utils/debounce.utils';
import { useI18n } from '~/utils/i18n.utils';
import { useDebouncedSearch } from '~/utils/store.utils';
import { fuzzyMatch } from '~/utils/string.utils';

const i18n = useI18n('navbar', 'search');

const { reverse } = defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
  reverse: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const { fetchSearchResults, addToHistory } = useSearchStore();
const { search, types, query, pageSize, loading, history } = useSearchStoreRefs();

const typeOptions = ref<TraktSearchType[]>(SupportedSearchType);

const debouncedSearch = useDebouncedSearch(search, 1000);
const external = computed(() => ResolveExternalLinks.trakt.query(debouncedSearch.value));

const fuzzy = new UFuzzy();

const filteredHistory = computed(() => {
  const _search = debouncedSearch.value?.toLowerCase().trim();
  const _values = Array.from(history.value);

  const result = { match: [], highlight: [], recent: _values };

  if (!_search || !_values.length) return result;

  const { match, highlight } = fuzzyMatch(_values, _search);
  const recent: string[] = [];

  history.value.forEach(value => {
    const _val = value.toLowerCase().trim();
    if (_val === _search) return;
    if (match.includes(value)) return;
    if (recent.length >= 5) return;
    recent.push(value);
  });

  let i = 0;
  let value: string;
  while (recent.length < 5) {
    value = _values[i];
    if (value !== _search && !match.includes(value)) recent.push(value);
    i += 1;
  }

  return { match, highlight, recent };
});

const historyOptions = computed(() => {
  const results = [];
  const match = {
    type: 'group',
    label: i18n('option_group_match'),
    key: 'match',
    children: filteredHistory.value.match.map((value, i) => ({
      value,
      label: value,
      highlight: filteredHistory.value.highlight[i],
      key: `match-${value}`,
    })),
  };
  if (match.children.length) results.push(match);
  const recent = {
    type: 'group',
    label: i18n('option_group_recent'),
    key: 'recent',
    children: filteredHistory.value.recent.map(value => ({
      value,
      label: value,
      key: `recent-${value}`,
      icon: IconRestore,
    })),
  };
  if (recent.children.length) results.push(recent);
  return results;
});

const renderMatch = ({ highlight, label }: SelectOption & { highlight?: string }) =>
  highlight ? h(TextHtml, { html: highlight }) : label?.toString();

const selectedValues = computed({
  get: () => types.value,
  set: selected => {
    types.value = selected;
  },
});

const getIcon = (type: TraktSearchType) => {
  switch (type) {
    case 'movie':
      return IconMovie;
    case 'show':
      return IconScreen;
    case 'episode':
      return IconYoutube;
    case 'person':
      return IconAccount;
    default:
      return IconList;
  }
};

const open = ref(false);

type SearchOption<T extends string = string> = SelectOption & {
  value: T;
  icon: Component;
};
const searchOptions = computed<SearchOption<TraktSearchType>[]>(() =>
  typeOptions.value.map(type => ({
    label: i18n(type, 'navbar', 'search', 'type'),
    value: type,
    icon: getIcon(type),
    disabled:
      loading.value ||
      (selectedValues.value.length <= 1 && selectedValues.value.includes(type)),
  })),
);

const selectedIcon = computed(() => {
  if (selectedValues.value.length > 1) return IconChevronUp;
  const _icon = searchOptions.value.find(o => o.value && types.value.includes(o.value))
    ?.icon;
  return _icon ?? IconChevronUp;
});

const renderLabel = (option: SearchOption) => [
  h(NIcon, {
    style: {
      verticalAlign: '-0.2em',
      marginRight: '0.7em',
    },
    component: option.icon,
  }),
  option.label?.toString(),
];

const specials = [
  { key: 'including', value: '+' },
  { key: 'excluding', value: '-' },
  { key: 'combining_and', value: '&&' },
  { key: 'combining_or', value: '||' },
  { key: 'negating', value: '!' },
  { key: 'grouping', value: '()' },
  { key: 'ranges', value: '[] {}' },
  { key: 'boosting', value: '^' },
  { key: 'escaping', value: '"' },
  { key: 'fuzzy', value: '~' },
  { key: 'wildcard', value: '*' },
  { key: 'wildcard_single', value: '?' },
  { key: 'field', value: ':' },
  { key: 'regex', value: '/' },
];

const tooltipHover = ref(false);
const timeout = ref();

const showTooltip = debounce(
  () => {
    tooltipHover.value = true;
  },
  200,
  timeout,
);

const hideTooltip = () => {
  tooltipHover.value = false;
  clearTimeout(timeout.value);
};

const inputRef = ref();

const placement = computed(() => (reverse ? 'top' : 'bottom'));

const saveHistory = async () => {
  try {
    await addToHistory();
  } catch (e) {
    Logger.error('Failed to save search history', e);
  }
};

const searchNow = () => {
  fetchSearchResults(undefined, debouncedSearch.value);
};

const route = useRoute();
const watching = watch(
  () => route.query,
  () => {
    const _search = route?.query?.search;
    if (typeof _search !== 'string') return;
    search.value = _search.trim();
    saveHistory();
  },
);
onActivated(watching.resume);
onDeactivated(watching.pause);
</script>

<template>
  <NFlex class="row" align="center" justify="space-evenly" :wrap="false">
    <NSelect
      v-model:value="selectedValues"
      v-model:show="open"
      class="types-select"
      :options="searchOptions"
      :to="parentElement"
      :render-label="renderLabel"
      :max-tag-count="1"
      :clearable="false"
      :placement="placement"
      :ellipsis-tag-popover-props="{ disabled: true }"
      multiple
    >
      <template #arrow>
        <NIcon :component="open ? IconChevronDown : selectedIcon" />
      </template>
    </NSelect>

    <NTooltip
      class="search-tooltip"
      :class="{ active: tooltipHover }"
      :placement="placement"
      trigger="focus"
      :show-arrow="false"
      :disabled="!query"
      :delay="100"
      :to="parentElement"
      @mouseenter="showTooltip()"
      @mouseleave="hideTooltip()"
    >
      <div class="header">{{ i18n('tooltip_header') }}</div>
      <NFlex class="list" vertical>
        <NFlex v-for="{ key, value } in specials" :key="key" :cols="2" :wrap="false">
          <span class="value">{{ value }}</span>
          <span>{{ i18n('tooltip_' + key) }}</span>
        </NFlex>
      </NFlex>
      <template #trigger>
        <NAutoComplete
          ref="inputRef"
          v-model:value="debouncedSearch"
          class="search-input"
          :loading="loading"
          :placeholder="i18n('search', 'navbar')"
          :render-label="renderMatch"
          autosize
          clearable
          :options="historyOptions"
          :to="parentElement"
          @blur="saveHistory"
          @keydown.enter="searchNow"
        >
          <template #prefix>
            <NIcon :component="IconLoop" />
          </template>
        </NAutoComplete>
      </template>
    </NTooltip>

    <NavbarPageSizeSelect
      v-model:page-size="pageSize"
      :parent-element="parentElement"
      :disabled="loading"
      :placement="placement"
    />
    <ButtonLinkExternal
      :href="external"
      :label="i18n('search', 'common', 'link')"
      :placement="placement"
    />

    <NSwitch
      v-if="false"
      v-model:value="query"
      class="search-switch"
      :theme-overrides="{
        buttonColor: 'var(--search-switch-button-color)',
        railColorActive: 'var(--search-switch-active-rail-color)',
      }"
    >
      <template #checked>
        <span class="label">{{ i18n('query') }}</span>
      </template>
      <template #unchecked>
        <span class="label">{{ i18n('text') }}</span>
      </template>
    </NSwitch>
  </NFlex>
</template>

<style lang="scss" scoped>
.search-switch {
  --search-switch-button-color: var(--white-soft);
  --search-switch-active-rail-color: var(--color-primary-dark);

  .label {
    min-width: 2rem;
    transition: color 0.3s;
    will-change: color;
  }

  // stylelint-disable-next-line selector-class-pattern -- overriding theme class
  &.n-switch--active .label {
    color: var(--white-soft);
  }
}

.search-tooltip {
  .header {
    margin-top: -0.25rem;
    transition: margin 0.3s;
    will-change: margin;
  }

  .list {
    width: 24rem;
    height: 0;
    overflow: hidden;
    text-wrap: nowrap;
    transition:
      height 0.3s,
      width 0.3s,
      margin 0.3s;
    will-change: height, width, margin;

    .value {
      min-width: 3rem;
    }
  }

  &.active {
    .header {
      margin: 0.5rem;
    }

    .list {
      width: 31.25rem;
      height: 21.375rem;
      margin: 1rem 0.25rem;
    }
  }
}

.row {
  width: 100%;
  padding: 0 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;

  .types-select {
    flex: 0 1 12rem;
    min-width: fit-content;

    @media (width < 600px) {
      flex: 0 2 8rem;
      min-width: auto;
    }
  }

  .search-input {
    flex: 2 1 30%;
    min-width: 12rem;

    @media (width < 600px) {
      min-width: auto;
    }
  }
}
</style>

<style lang="scss">
.search-tooltip.search-tooltip {
  margin-top: 12px;
}

@media (width < 500px) {
  .n-auto-complete.search-input .n-input-wrapper .n-base-loading.n-base-suffix {
    display: none;
    background-color: red;
  }
}

@media (width < 600px) {
  .n-select.types-select
    .n-base-selection-tags
    .n-base-selection-tag-wrapper:nth-child(2) {
    display: none;
  }
}
</style>
