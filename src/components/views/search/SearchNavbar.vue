<script setup lang="ts">
import {
  NFlex,
  NIcon,
  NInput,
  NSelect,
  NSwitch,
  NTooltip,
  type SelectOption,
} from 'naive-ui';

import { type Component, computed, defineProps, h, ref } from 'vue';

import type { TraktSearchType } from '~/models/trakt/trakt-search.model';

import IconAccount from '~/components/icons/IconAccount.vue';
import IconChevronDown from '~/components/icons/IconChevronDownSmall.vue';
import IconChevronUp from '~/components/icons/IconChevronUpSmall.vue';
import IconList from '~/components/icons/IconList.vue';
import IconLoop from '~/components/icons/IconLoop.vue';
import IconMovie from '~/components/icons/IconMovie.vue';
import IconScreen from '~/components/icons/IconScreen.vue';
import IconYoutube from '~/components/icons/IconYoutube.vue';

import { useI18n } from '~/utils';
import { debounce } from '~/utils/debounce.utils';
import { useDebouncedSearch } from '~/utils/store.utils';

const i18n = useI18n('navbar', 'search');

const DefaultSearchType: TraktSearchType[] = ['episode', 'show', 'movie', 'person'];

const search = ref('');
const escape = ref(false);
const types = ref<TraktSearchType[]>(DefaultSearchType);
const typeOptions = ref<TraktSearchType[]>(DefaultSearchType);

const debouncedSearch = useDebouncedSearch(search);

defineProps({
  parentElement: {
    type: HTMLElement,
    required: false,
  },
});

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

type SearchOption = SelectOption & { value: TraktSearchType; icon: Component };
const searchOptions = computed<SearchOption[]>(() =>
  typeOptions.value.map(type => ({
    label: i18n(type, 'navbar', 'search', 'type'),
    value: type,
    icon: getIcon(type),
    disabled: selectedValues.value.length <= 1 && selectedValues.value.includes(type),
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
</script>

<template>
  <NFlex class="row" align="center" justify="center" :vertical="false">
    <NSelect
      v-model:value="selectedValues"
      v-model:show="open"
      class="types-select"
      :options="searchOptions"
      :to="parentElement"
      :render-label="renderLabel"
      :max-tag-count="1"
      :clearable="false"
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
      placement="bottom"
      trigger="focus"
      :show-arrow="false"
      ò
      :disabled="!escape"
      :delay="100"
      :to="parentElement"
      @mouseenter="showTooltip()"
      @mouseleave="hideTooltip()"
    >
      <div class="header">{{ i18n('tooltip_header') }}</div>
      <NFlex class="list" vertical>
        <NFlex v-for="{ key, value } in specials" :key="key" :cols="2" :wrap="false">
          <span class="value">{{ value }}</span>
          <span>{{ i18n(`tooltip_${ key }`) }}</span>
        </NFlex>
      </NFlex>
      <template #trigger>
        <NInput
          v-model:value="debouncedSearch"
          class="search-input"
          :placeholder="i18n('search', 'navbar')"
          autosize
          clearable
        >
          <template #prefix>
            <NIcon :component="IconLoop" />
          </template>
        </NInput>
      </template>
    </NTooltip>

    <NSwitch
      v-model:value="escape"
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
  --search-switch-button-color: var(--vt-c-white-soft);
  --search-switch-active-rail-color: var(--primary-color-dark);

  .label {
    min-width: 2rem;
    transition: color 0.3s;
    will-change: color;
  }

  // stylelint-disable-next-line selector-class-pattern -- overriding theme class
  &.n-switch--active .label {
    color: var(--vt-c-white-soft);
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

  .types-select {
    flex: 0 1 12rem;
  }

  .search-input {
    flex: 1 1 30%;
  }
}
</style>

<style lang="scss">
.search-tooltip.search-tooltip {
  margin-top: 12px;
}
</style>
