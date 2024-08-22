<script lang="ts" setup>
import { NAnchor, NAnchorLink, NCard, NLayout, NLayoutSider } from 'naive-ui';

import { type Component, computed, onDeactivated, type Ref, ref } from 'vue';

import SettingsAccount from '~/components/views/settings/SettingsAccount.vue';
import SettingsActivity from '~/components/views/settings/SettingsActivity.vue';
import SettingsBadge from '~/components/views/settings/SettingsBadge.vue';
import SettingsCache from '~/components/views/settings/SettingsCache.vue';
import SettingsConnect from '~/components/views/settings/SettingsConnect.vue';
import SettingsExport from '~/components/views/settings/SettingsExport.vue';
import SettingsLinks from '~/components/views/settings/SettingsLinks.vue';
import SettingsLogs from '~/components/views/settings/SettingsLogs.vue';
import SettingsMenus from '~/components/views/settings/SettingsMenus.vue';
import SettingsTabs from '~/components/views/settings/SettingsTabs.vue';
import SettingsWatching from '~/components/views/settings/SettingsWatching.vue';

import { useSimklStoreRefs } from '~/stores/data/simkl.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings');

type Section = {
  title: string;
  reference: Ref<[InstanceType<typeof NCard>] | undefined>;
  component?: Component;
  disabled?: boolean;
};

const { simklAllowed } = useSimklStoreRefs();
const sections = computed<Section[]>(() =>
  [
    { title: 'menu__account', reference: ref(), component: SettingsAccount },
    {
      title: 'menu__connect',
      reference: ref(),
      component: SettingsConnect,
      disabled: !simklAllowed.value,
    },
    { title: 'menu__tabs', reference: ref(), component: SettingsTabs },
    { title: 'menu__links', reference: ref(), component: SettingsLinks },
    { title: 'menu__menus', reference: ref(), component: SettingsMenus },
    { title: 'menu__watching', reference: ref(), component: SettingsWatching },
    { title: 'menu__activity', reference: ref(), component: SettingsActivity },
    { title: 'menu__badge', reference: ref(), component: SettingsBadge },
    { title: 'menu__cache', reference: ref(), component: SettingsCache },
    { title: 'menu__export', reference: ref(), component: SettingsExport },
    { title: 'menu__logs', reference: ref(), component: SettingsLogs },
  ].filter(Boolean),
);

const focus = ref();
const target = ref();

const scrollTo = (section: Section) => {
  target.value = section;
  focus.value = section;

  const element: HTMLDivElement = section.reference?.value?.[0]?.$el;
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const onEnter = (section: Section) => {
  target.value = section;
};

const onLeave = (section: Section) => {
  if (focus.value?.title === section?.title) {
    focus.value = undefined;
  }
};

onDeactivated(() => {
  target.value = undefined;
  focus.value = undefined;
});
</script>

<template>
  <NLayout class="container" has-sider>
    <NLayoutSider
      class="menu"
      bordered
      collapse-mode="width"
      width="6rem"
      :collapsed-width="0"
      :native-scrollbar="false"
      show-trigger="bar"
      inverted
    >
      <NAnchor :show-rail="false" type="block">
        <NAnchorLink
          v-for="section in sections"
          :key="section.title"
          :title="i18n(section.title)"
          :class="{ 'n-anchor-link--active': target?.title === section.title }"
          @click="scrollTo(section)"
        />
      </NAnchor>
    </NLayoutSider>
    <NLayout
      class="content"
      :native-scrollbar="false"
      :content-style="{
        padding: '1rem',
      }"
    >
      <template v-for="(section, index) in sections" :key="section.title">
        <NCard
          v-if="!section.disabled"
          :id="section.title"
          :ref="section.reference"
          class="card"
          :class="{ target: focus?.title === section.title }"
          :style="{ '--length': sections.length, '--index': index }"
          :title="i18n(section.title)"
          @mouseenter="onEnter(section)"
          @mouseleave="onLeave(section)"
          @focusin="onEnter(section)"
          @focusout="onLeave(section)"
        >
          <component :is="section.component" />
        </NCard>
      </template>
    </NLayout>
  </NLayout>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;

.container {
  width: 100%;
  height: var(--full-height);
  margin-top: -#{layout.$header-navbar-height};
  background: transparent;

  .card {
    @include mixin.hover-background($from: var(--bg-black-50), $to: var(--bg-color-80));

    z-index: var(--length);
    scroll-margin-top: calc(#{layout.$header-navbar-height} + 1rem);

    &:not(:last-child) {
      z-index: calc(var(--length) - var(--index));
      margin-bottom: 1rem;
    }

    &:active,
    &:focus-within,
    &:hover {
      z-index: var(--length);
    }

    &.target {
      border-color: var(--n-color-target);
    }
  }

  .menu {
    @include mixin.hover-background;

    height: calc(var(--full-height) - #{layout.$header-navbar-height});
    padding: 0.5rem;
  }

  .content {
    height: var(--full-height);
    background: transparent;
  }

  .menu,
  .content .card:first-child {
    margin-top: layout.$header-navbar-height;
  }
}
</style>
