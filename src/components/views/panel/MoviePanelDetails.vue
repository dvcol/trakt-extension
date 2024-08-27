<script lang="ts" setup>
import { shortTime } from '@dvcol/common-utils/common/date';
import { capitalizeEachWord, deCapitalise } from '@dvcol/common-utils/common/string';
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktMovieExtended } from '@dvcol/trakt-http-client/models';

import TextField from '~/components/common/typography/TextField.vue';
import PanelAlias from '~/components/views/panel/PanelAlias.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { useSimklStore } from '~/stores/data/simkl.store';
import { useLinksStore } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  movie: {
    type: Object as PropType<TraktMovieExtended>,
    required: false,
  },
  watchedDate: {
    type: Date,
    required: false,
  },
  collectionDate: {
    type: Date,
    required: false,
  },
});

const { movie, watchedDate, collectionDate } = toRefs(props);

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
  return shortTime(released.value);
});

const watchedTime = computed(() => {
  if (!watchedDate?.value) return;
  return shortTime(watchedDate.value);
});

const collectionTime = computed(() => {
  if (!collectionDate?.value) return;
  return shortTime(collectionDate.value);
});

const runtime = computed(() => {
  if (!movie?.value) return;
  if (!movie.value?.runtime) return '-';
  return `${movie.value.runtime} min`;
});

const { getMovie } = useSimklStore();

const simklMovie = computed(() => {
  if (!movie?.value?.ids?.imdb) return;
  return getMovie(movie.value.ids.imdb).value;
});

const genres = computed(() => {
  if (!movie?.value) return;
  const _genres = new Set<string>();
  movie.value?.genres?.forEach(g => _genres.add(g.trim().toLowerCase()));
  simklMovie.value?.genres?.forEach(g => _genres.add(g.trim().toLowerCase()));
  return [..._genres.values()]?.map(g => ({ label: capitalizeEachWord(g) }));
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
  <NFlex size="large" class="container" vertical wrap>
    <NFlex class="link-row" vertical size="large" wrap>
      <!--  Genres  -->
      <TextField
        :label="i18n('genres')"
        :values="genres"
        :skeleton="{ width: '3rem' }"
        array
        wrap
      />

      <!--  links  -->
      <PanelLinks
        :ids="movie?.ids"
        mode="movie"
        :title="movieTitle"
        :alias="movieAlias"
      />
    </NFlex>

    <!--  Movie name alias  -->
    <PanelAlias
      :id="movie?.ids?.trakt.toString()"
      scope="movie"
      :placeholder="movieTitle"
    />
    <NFlex class="row" size="large">
      <!--  Year  -->
      <TextField :label="i18n('year')" :value="year" :skeleton="{ width: '2.25rem' }" />

      <!--  Country  -->
      <TextField :label="i18n('country')" :value="country" :skeleton="{ width: '2ch' }" />

      <!--  Status  -->
      <TextField
        :label="i18n('status')"
        :value="status"
        :skeleton="{ width: '7.5rem' }"
        grow
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Release date  -->
      <TextField
        :label="i18n('released')"
        :value="releasedDate"
        :skeleton="{ width: '5.125rem' }"
      />

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
    </NFlex>

    <NFlex class="row hidden" :class="{ show: watchedDate }" size="large">
      <!--  Watched Date  -->
      <TextField
        :label="i18n('watched')"
        :value="watchedDate?.toLocaleDateString() ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  watched time  -->
      <TextField
        :label="i18n('watched_time')"
        :value="watchedTime ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />
    </NFlex>

    <NFlex class="row hidden" :class="{ show: collectionDate }" size="large">
      <!--  Collection Date  -->
      <TextField
        :label="i18n('collected')"
        :value="collectionDate?.toLocaleDateString() ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Collection time  -->
      <TextField
        :label="i18n('collected_time')"
        :value="collectionTime ?? '-'"
        :skeleton="{ width: '5.125rem' }"
      />
    </NFlex>
  </NFlex>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;

.container,
.row {
  @include mixin.transition-show-hide-height;

  flex: 1 1 auto;
  width: 100%;
}

.link-row {
  overflow-x: auto;
  scrollbar-width: thin;
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
