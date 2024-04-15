<script lang="ts" setup>
import { NCard, NFlex, NH2, NLayout, NP } from 'naive-ui';

import ButtonLinkExternal from '~/components/common/buttons/ButtonLinkExternal.vue';
import TagLink from '~/components/common/buttons/TagLink.vue';
import IconAccountAlert from '~/components/icons/IconAccountAlert.vue';
import IconCoffe from '~/components/icons/IconCoffe.vue';
import IconEye from '~/components/icons/IconEye.vue';
import IconGithub from '~/components/icons/IconGithub.vue';
import IconStar from '~/components/icons/IconStar.vue';
import { ExternaLinks, ResolveExternalLinks } from '~/settings/external.links';
import { useI18n } from '~/utils';

const i18n = useI18n('about');

const version = import.meta.env.PKG_VERSION;
const language = navigator?.language;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<template>
  <NLayout
    class="container"
    :content-style="{
      padding: '0.75rem 1rem',
    }"
    :native-scrollbar="false"
  >
    <NCard class="card" :title="i18n('title')" header-style="font-size: 32px;">
      <NFlex>
        <TagLink
          class="link"
          :tag="{
            bordered: false,
            round: true,
            type: 'success',
            url: ResolveExternalLinks.release(version),
            title: 'See release on Github.',
            label: `${ i18n('version').toLowerCase() } - v${ version }`,
          }"
        />
        <TagLink
          class="link"
          :tag="{
            bordered: false,
            round: true,
            type: 'info',
            label: `${ i18n('language').toLowerCase() } - ${ language }`,
          }"
        />
        <TagLink
          class="link"
          :tag="{
            bordered: false,
            round: true,
            type: 'warning',
            label: `${ i18n('timezone').toLowerCase() } - ${ timezone }`,
          }"
        />
      </NFlex>
      <NH2>{{ i18n('description') }}</NH2>
      <NP>{{ i18n('description_line_1') }}</NP>
      <NP>{{ i18n('description_line_2') }}</NP>

      <NH2>{{ i18n('contribute') }}</NH2>
      <NP>{{ i18n('contribute__description_line_1') }}</NP>
      <NP>{{ i18n('contribute__description_line_2') }}</NP>
      <NP>{{ i18n('contribute__description_line_3') }}</NP>

      <NFlex justify="space-around">
        <ButtonLinkExternal
          :url="ExternaLinks.store"
          :title="i18n('button__store_label')"
          :icon="IconStar"
          type="success"
        >
          {{ i18n('button__store') }}
        </ButtonLinkExternal>
        <ButtonLinkExternal
          :url="ExternaLinks.privacy"
          :title="i18n('button__privacy_label')"
          :icon="IconEye"
          type="warning"
        >
          {{ i18n('button__privacy') }}
        </ButtonLinkExternal>
        <ButtonLinkExternal
          :url="ExternaLinks.support"
          :title="i18n('button__support_label')"
          :icon="IconAccountAlert"
          type="error"
        >
          {{ i18n('button__support') }}
        </ButtonLinkExternal>
        <ButtonLinkExternal
          :url="ExternaLinks.github"
          :title="i18n('button__contribute_label')"
          :icon="IconGithub"
        >
          {{ i18n('button__contribute') }}
        </ButtonLinkExternal>
        <ButtonLinkExternal
          :url="ExternaLinks.donate"
          :title="i18n('button__donate_label')"
          :icon="IconCoffe"
          type="info"
        >
          {{ i18n('button__donate') }}
        </ButtonLinkExternal>
      </NFlex>
    </NCard>
  </NLayout>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;

.container {
  width: 100%;
  height: calc(100dvh - #{layout.$header-navbar-height});
  background: transparent;

  .card {
    @include mixin.hover-background($from: var(--bg-black-50), $to: var(--bg-color-80));
  }

  .link {
    :deep(.label) {
      padding: 0.15rem;
    }
  }
}
</style>
