<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktMovieExtended } from '~/models/trakt/trakt-movie.model';

import PanelDetail from '~/components/views/panel/PanelDetail.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { useI18n } from '~/utils';
import { capitalizeEachWord } from '~/utils/string.utils';

const props = defineProps({
  movie: {
    type: Object as PropType<TraktMovieExtended>,
    required: false,
  },
});

const { movie } = toRefs(props);

const i18n = useI18n('panel', 'detail');

const released = computed(() => {
  if (!movie?.value) return;
  if (!movie.value?.released) return '-';
  return new Date(movie.value?.released);
});

const releasedDate = computed(() => {
  if (!released.value) return;
  if (typeof released.value === 'string') return released.value;
  return released.value.toLocaleDateString();
});

const releasedTime = computed(() => {
  if (!released.value) return;
  if (typeof released.value === 'string') return released.value;
  return released.value.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const runtime = computed(() => {
  if (!movie?.value) return;
  if (!movie.value?.runtime) return '-';
  return `${movie.value.runtime} min`;
});

const genres = computed(() => {
  if (!movie?.value) return;
  return movie.value?.genres?.map(g => ({ label: capitalizeEachWord(g) })) ?? [];
});

const year = computed(() => {
  if (!movie?.value) return;
  return movie.value?.year || '-';
});

const status = computed(() => {
  if (!movie?.value) return;
  return capitalizeEachWord(movie.value?.status) || '-';
});

const country = computed(() => {
  if (!movie?.value) return;
  return movie.value?.country || '-';
});
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Release date  -->
      <PanelDetail
        :label="i18n('released')"
        :value="releasedDate"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Year  -->
      <PanelDetail :label="i18n('year')" :value="year" :skeleton="{ width: '2.25rem' }" />

      <!--  Country  -->
      <PanelDetail
        :label="i18n('country')"
        :value="country"
        :skeleton="{ width: '2ch' }"
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Release Time  -->
      <PanelDetail
        :label="i18n('released_time')"
        :value="releasedTime"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Runtime  -->
      <PanelDetail
        :label="i18n('runtime')"
        :value="runtime"
        :skeleton="{ width: '3.75rem' }"
      />

      <!--  Status  -->
      <PanelDetail
        :label="i18n('status')"
        :value="status"
        :skeleton="{ width: '7.5rem' }"
      />
    </NFlex>

    <NFlex class="lists" vertical size="large">
      <!--  Genres  -->
      <PanelDetail
        :label="i18n('genres')"
        :values="genres"
        :skeleton="{ width: '3rem' }"
        array
      />

      <!--  links  -->
      <PanelLinks :ids="movie?.ids" mode="movie" />
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
.container,
.row {
  flex: 1 1 auto;
  width: 100%;
}

.lists {
  margin: 1.25rem 0 1rem;
}
</style>