<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { PanelTag } from '~/models/tag.model';
import type { TraktPersonExtended } from '~/models/trakt/trakt-people.model';

import IconExternalLink from '~/components/icons/IconExternalLink.vue';
import PanelDetail from '~/components/views/panel/PanelDetail.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useI18n } from '~/utils';
import { capitalizeEachWord } from '~/utils/string.utils';

const props = defineProps({
  person: {
    type: Object as PropType<TraktPersonExtended>,
    required: false,
  },
});

const { person } = toRefs(props);

const i18n = useI18n('panel', 'detail');

const birthday = computed(() => {
  if (!person?.value) return;
  if (!person.value?.birthday) return '-';
  return new Date(person.value?.birthday).toLocaleDateString();
});

const age = computed(() => {
  if (!person?.value) return;
  if (!person.value?.birthday) return '-';
  const birthDate = new Date(person.value?.birthday);
  const diff = Date.now() - birthDate.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
});

const death = computed(() => {
  if (!person?.value) return;
  if (!person.value?.death) return '-';
  return new Date(person.value?.death).toLocaleDateString();
});

const knownFor = computed(() => {
  if (!person?.value) return;
  if (!person.value?.known_for_department) return '-';
  return capitalizeEachWord(person.value?.known_for_department);
});

const birthplace = computed(() => {
  if (!person?.value) return;
  return person.value?.birthplace ?? '-';
});

const socials = computed(() => {
  if (!person?.value) return;
  const _socials: PanelTag[] = [];
  if (person.value?.homepage) {
    _socials.push({
      label: 'Homepage',
      url: person.value?.homepage,
      icon: IconExternalLink,
    });
  }
  if (person.value?.social_ids?.facebook) {
    _socials.push({
      label: 'Facebook',
      url: ResolveExternalLinks.facebook(person.value?.social_ids.facebook),
      icon: IconExternalLink,
    });
  }
  if (person.value?.social_ids?.instagram) {
    _socials.push({
      label: 'Instagram',
      url: ResolveExternalLinks.instagram(person.value?.social_ids.instagram),
      icon: IconExternalLink,
    });
  }
  if (person.value?.social_ids?.twitter) {
    _socials.push({
      label: 'Twitter',
      url: ResolveExternalLinks.twitter(person.value?.social_ids.twitter),
      icon: IconExternalLink,
    });
  }
  if (person.value?.social_ids?.wikipedia) {
    _socials.push({
      label: 'Wikipedia',
      url: ResolveExternalLinks.wikipedia(person.value?.social_ids.wikipedia),
      icon: IconExternalLink,
    });
  }
  return _socials;
});
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Known For  -->
      <PanelDetail
        :label="i18n('known_for')"
        :value="knownFor"
        :skeleton="{ width: '5rem' }"
      />

      <!--  Birthday  -->
      <PanelDetail
        :label="i18n('birthday')"
        :value="birthday"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Death  -->
      <PanelDetail
        :label="i18n('death')"
        :value="death"
        :skeleton="{ width: '5.125rem' }"
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Age  -->
      <PanelDetail :label="i18n('age')" :value="age" :skeleton="{ width: '3ch' }" />

      <!--  Birth place  -->
      <PanelDetail
        :label="i18n('birthplace')"
        :value="birthplace"
        :skeleton="{ width: '12rem' }"
        grow
      />
    </NFlex>

    <!--  socials  -->
    <PanelDetail
      :label="i18n('socials')"
      :values="socials"
      :skeleton="{ width: '3rem' }"
      array
    />

    <!--  links  -->
    <PanelLinks :ids="person?.ids" mode="person" />
  </NFlex>
</template>

<style lang="scss" scoped>
.container,
.row {
  flex: 1 1 auto;
  width: 100%;
}
</style>
