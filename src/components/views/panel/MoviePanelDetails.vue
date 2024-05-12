<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktMovieExtended } from '@dvcol/trakt-http-client/models';

import TextField from '~/components/common/typography/TextField.vue';
import PanelAlias from '~/components/views/panel/PanelAlias.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils';
import { capitalizeEachWord, deCapitalise } from '~/utils/string.utils';

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
  return released.value.toLocaleTimeString(undefined, {
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

const { getAlias } = useLinksStore();
const movieId = computed(() => movie?.value?.ids?.trakt.toString());
const alias = getAlias('show', movieId);
const movieAlias = computed(() => alias.value || movie?.value?.title);
const movieTitle = computed(() => deCapitalise(movie?.value?.title));
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Release date  -->
      <TextField
        :label="i18n('released')"
        :value="releasedDate"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Year  -->
      <TextField :label="i18n('year')" :value="year" :skeleton="{ width: '2.25rem' }" />

      <!--  Country  -->
      <TextField :label="i18n('country')" :value="country" :skeleton="{ width: '2ch' }" />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Release Time  -->
      <TextField
        :label="i18n('released_time')"
        :value="releasedTime"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Runtime  -->
      <TextField
        :label="i18n('runtime')"
        :value="runtime"
        :skeleton="{ width: '3.75rem' }"
      />

      <!--  Status  -->
      <TextField
        :label="i18n('status')"
        :value="status"
        :skeleton="{ width: '7.5rem' }"
        grow
      />
    </NFlex>

    <!--  Movie name alias  -->
    <PanelAlias
      :id="movie?.ids?.trakt.toString()"
      scope="movie"
      :placeholder="movieTitle"
    />

    <NFlex class="lists" vertical size="large">
      <!--  Genres  -->
      <TextField
        :label="i18n('genres')"
        :values="genres"
        :skeleton="{ width: '3rem' }"
        array
      />

      <!--  links  -->
      <PanelLinks
        :ids="movie?.ids"
        mode="movie"
        :title="movieTitle"
        :alias="movieAlias"
      />
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
  margin: 0.25rem 0 1.25rem;
}

@media (width < 700px) {
  .row {
    gap: 0.75rem 0.5rem !important;
  }
}
</style>
