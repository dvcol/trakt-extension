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
  return new Date(movie.value?.released).toLocaleDateString();
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
  return movie.value?.year ?? '-';
});

const status = computed(() => {
  if (!movie?.value) return;
  return capitalizeEachWord(movie.value?.status) ?? '-';
});

const country = computed(() => {
  if (!movie?.value) return;
  return movie.value?.country ?? '-';
});
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Year  -->
      <PanelDetail :label="i18n('year')" :value="year" :skeleton="{ width: '2.25rem' }" />

      <!--  Country  -->
      <PanelDetail
        :label="i18n('country')"
        :value="country"
        :skeleton="{ width: '2ch' }"
      />

      <!--  Status  -->
      <PanelDetail
        :label="i18n('status')"
        :value="status"
        :skeleton="{ width: '7.5rem' }"
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Release date  -->
      <PanelDetail
        :label="i18n('released')"
        :value="released"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Runtime  -->
      <PanelDetail
        :label="i18n('runtime')"
        :value="runtime"
        :skeleton="{ width: '3.75rem' }"
      />
    </NFlex>

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
</template>

<style lang="scss" scoped>
.container,
.row {
  flex: 1 1 auto;
  width: 100%;
}
</style>
