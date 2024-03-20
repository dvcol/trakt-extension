<script setup lang="ts">
import { NEllipsis, NFlex, NSkeleton, NTag } from 'naive-ui';

import { computed, type PropType, toRefs } from 'vue';

import type { ListScrollItem } from '~/components/common/list/ListScroll.model';

import PosterPlaceholder from '~/assets/images/poster-placholder.webp';
import { useI18n } from '~/utils';

const i18n = useI18n('list-item-panel');

const props = defineProps({
  item: {
    type: Object as PropType<ListScrollItem>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  poster: {
    type: String,
    required: false,
    default: PosterPlaceholder,
  },
  hideDate: {
    type: Boolean,
    required: false,
  },
});

const { item, hideDate } = toRefs(props);

const type = computed(() =>
  item.value.type ? i18n(item.value.type, 'common', 'media', 'type') : item.value.type,
);

const title = computed(() => item.value.title);

const content = computed(() => item.value.content);

const date = computed(() => {
  if (hideDate.value) return;
  return item.value.date?.current?.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const tags = computed(
  () =>
    item.value.tags?.map(tag => {
      if (!tag.i18n) return tag;
      if (typeof tag.i18n === 'boolean') return { ...tag, label: i18n(tag.label) };
      return { ...tag, label: i18n(tag.label, ...tag.i18n) };
    }),
);
</script>

<template>
  <NFlex
    class="panel"
    vertical
    justify="center"
    size="small"
    :theme-overrides="{ gapSmall: '0' }"
  >
    <div class="meta type">
      <NSkeleton v-if="loading" text style="width: 10%" round />
      <NEllipsis v-else :line-clamp="1">{{ type }}</NEllipsis>
    </div>
    <div class="title">
      <NSkeleton v-if="loading" text style="width: 70%" round />
      <NEllipsis v-else :line-clamp="2">{{ title }}</NEllipsis>
    </div>
    <div class="content">
      <NSkeleton v-if="loading" text style="width: 60%" round />
      <NEllipsis v-else :line-clamp="2">{{ content }}</NEllipsis>
    </div>
    <NFlex v-if="date || tags?.length" size="medium" class="tags">
      <NTag v-if="date" class="tag meta" size="small">
        <NSkeleton v-if="loading" text style="width: 20%" round />
        <span>{{ date }} </span>
      </NTag>
      <NTag
        v-for="tag of tags"
        :key="tag.label"
        class="tag"
        :class="{
          meta: tag.meta,
        }"
        size="small"
        :type="tag.type"
        :bordered="tag.bordered ?? true"
      >
        {{ tag.label }}
      </NTag>
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
.panel {
  flex: 1 1 auto;
  margin: 0.25rem 0;

  .title {
    margin-top: 0.1rem;
    color: var(--trakt-red);
    font-weight: var(--n-title-font-weight);
    font-size: var(--n-title-font-size);
    transition: color 0.3s var(--n-bezier);
    font-variant-numeric: tabular-nums;
  }

  .content {
    color: var(--n-content-text-color);
    font-size: var(--n-content-font-size);
    transition: color 0.3s var(--n-bezier);
  }

  .meta {
    color: var(--n-meta-text-color);
    font-size: 12px;
    transition: color 0.3s var(--n-bezier);
  }

  .tags {
    gap: 0.5rem !important;
    margin-top: 0.3rem;

    .tag {
      width: fit-content;
    }
  }
}
</style>
