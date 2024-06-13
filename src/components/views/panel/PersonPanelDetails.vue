<script lang="ts" setup>
import { capitalizeEachWord } from '@dvcol/common-utils/common/string';
import { NFlex } from 'naive-ui';
import { computed, type PropType, toRefs } from 'vue';

import type { TraktPersonExtended } from '@dvcol/trakt-http-client/models';
import type { TagLink } from '~/models/tag.model';

import TextField from '~/components/common/typography/TextField.vue';
import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';
import IconFacebook from '~/components/icons/IconFacebook.vue';
import IconInstagram from '~/components/icons/IconInstagram.vue';
import IconTwitter from '~/components/icons/IconTwitter.vue';
import IconWikipedia from '~/components/icons/IconWikipedia.vue';

import PanelLinks from '~/components/views/panel/PanelLinks.vue';
import { ResolveExternalLinks } from '~/settings/external.links';
import { useI18n } from '~/utils/i18n.utils';

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
  return person.value?.birthplace || '-';
});

const socials = computed(() => {
  if (!person?.value) return;
  const _socials: TagLink[] = [];
  if (person.value?.homepage) {
    _socials.push({
      label: 'Homepage',
      title: i18n({ key: 'open', substitutions: ['home page'] }, 'common', 'tooltip'),
      url: person.value?.homepage,
      icon: IconExternalLinkRounded,
    });
  }
  if (person.value?.social_ids?.facebook) {
    _socials.push({
      label: 'Facebook',
      title: i18n({ key: 'open_in', substitutions: ['Facebook'] }, 'common', 'tooltip'),
      url: ResolveExternalLinks.facebook(person.value?.social_ids.facebook),
      icon: IconFacebook,
    });
  }
  if (person.value?.social_ids?.instagram) {
    _socials.push({
      label: 'Instagram',
      title: i18n({ key: 'open_in', substitutions: ['Instagram'] }, 'common', 'tooltip'),
      url: ResolveExternalLinks.instagram(person.value?.social_ids.instagram),
      icon: IconInstagram,
    });
  }
  if (person.value?.social_ids?.twitter) {
    _socials.push({
      label: 'Twitter',
      title: i18n({ key: 'open_in', substitutions: ['Twitter'] }, 'common', 'tooltip'),
      url: ResolveExternalLinks.twitter(person.value?.social_ids.twitter),
      icon: IconTwitter,
    });
  }
  if (person.value?.social_ids?.wikipedia) {
    _socials.push({
      label: 'Wikipedia',
      title: i18n({ key: 'open_in', substitutions: ['Wikipedia'] }, 'common', 'tooltip'),
      url: ResolveExternalLinks.wikipedia(person.value?.social_ids.wikipedia),
      icon: IconWikipedia,
    });
  }
  return _socials;
});
</script>

<template>
  <NFlex size="large" class="container" vertical>
    <NFlex class="row" size="large">
      <!--  Known For  -->
      <TextField
        :label="i18n('known_for')"
        :value="knownFor"
        :skeleton="{ width: '5rem' }"
      />

      <!--  Birthday  -->
      <TextField
        :label="i18n('birthday')"
        :value="birthday"
        :skeleton="{ width: '5.125rem' }"
      />

      <!--  Death  -->
      <TextField
        :label="i18n('death')"
        :value="death"
        :skeleton="{ width: '5.125rem' }"
        grow
      />
    </NFlex>

    <NFlex class="row" size="large">
      <!--  Age  -->
      <TextField :label="i18n('age')" :value="age" :skeleton="{ width: '3ch' }" />

      <!--  Birth place  -->
      <TextField
        :label="i18n('birthplace')"
        :value="birthplace"
        :skeleton="{ width: '12rem' }"
        grow
      />
    </NFlex>

    <NFlex class="lists" vertical size="large">
      <!--  socials  -->
      <TextField
        :label="i18n('socials')"
        :values="socials"
        :skeleton="{ width: '3rem' }"
        array
      />

      <!--  links  -->
      <PanelLinks :ids="person?.ids" mode="person" />
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
  margin: 1.5rem 0 0.5rem;
}

@media (width < 700px) {
  .row {
    gap: 0.75rem 0.5rem !important;
  }
}
</style>
