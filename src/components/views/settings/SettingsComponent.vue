<script lang="ts" setup>
import { NAnchor, NAnchorLink, NCard, NLayout, NLayoutSider } from 'naive-ui';

import { computed, onDeactivated, ref } from 'vue';

import type { Component, Ref } from 'vue';

import PageLoading from '~/components/common/loading/PageLoading.vue';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useSimklStoreRefs } from '~/stores/data/simkl.store';
import { useI18n } from '~/utils/i18n.utils';
import lazyComponent from '~/utils/lazy.utils';
import { watchMedia } from '~/utils/window.utils';

const SettingsAccount = lazyComponent(
  () => import('~/components/views/settings/SettingsAccount.vue'),
);
const SettingsActivity = lazyComponent(
  () => import('~/components/views/settings/SettingsActivity.vue'),
);
const SettingsBadge = lazyComponent(
  () => import('~/components/views/settings/SettingsBadge.vue'),
);
const SettingsCache = lazyComponent(
  () => import('~/components/views/settings/SettingsCache.vue'),
);
const SettingsConnect = lazyComponent(
  () => import('~/components/views/settings/SettingsConnect.vue'),
);
const SettingsExport = lazyComponent(
  () => import('~/components/views/settings/SettingsExport.vue'),
);
const SettingsLinks = lazyComponent(
  () => import('~/components/views/settings/SettingsLinks.vue'),
);
const SettingsLogs = lazyComponent(
  () => import('~/components/views/settings/SettingsLogs.vue'),
);
const SettingsMenus = lazyComponent(
  () => import('~/components/views/settings/SettingsMenus.vue'),
);
const SettingsTabs = lazyComponent(
  () => import('~/components/views/settings/SettingsTabs.vue'),
);
const SettingsWatching = lazyComponent(
  () => import('~/components/views/settings/SettingsWatching.vue'),
);

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

const isCompact = watchMedia('(max-width: 600px)');

const { floating } = useAppStateStoreRefs();

onDeactivated(() => {
  target.value = undefined;
  focus.value = undefined;
});
</script>

<template>
  <NLayout class="container" :class="{ floating }" has-sider>
    <NLayoutSider
      class="menu"
      bordered
      collapse-mode="width"
      width="6rem"
      :collapsed-width="0"
      :native-scrollbar="false"
      show-trigger="bar"
      inverted
      :default-collapsed="isCompact"
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
          :style="{
            '--length': sections.length,
            '--index': index,
          }"
          :title="i18n(section.title)"
          @mouseenter="onEnter(section)"
          @mouseleave="onLeave(section)"
          @focusin="onEnter(section)"
          @focusout="onLeave(section)"
        >
          <Suspense>
            <component :is="section.component" />
            <template #fallback>
              <PageLoading min-height="var(--height-40-dvh)" />
            </template>
          </Suspense>
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
  height: layout.$safe-full-height;
  margin-top: calc(0% - #{layout.$safe-navbar-height});
  background: transparent;
  transition:
    height 0.5s var(--n-bezier),
    margin-top 0.5s var(--n-bezier);

  .card {
    @include mixin.hover-background($from: var(--bg-black-50), $to: var(--bg-color-80));

    z-index: var(--length);
    scroll-margin-top: calc(#{layout.$safe-navbar-height} + 1rem);

    &:not(:last-child) {
      z-index: calc(var(--length) - var(--index));
      margin-bottom: 1rem;
    }

    &:active,
    &:focus-within,
    &:hover {
      z-index: var(--length);
    }

    &:active,
    &:hover {
      border-color: var(--border-white);
    }

    &.target {
      border-color: var(--n-color-target);
    }
  }

  .menu {
    @include mixin.hover-background;

    height: layout.$safe-content-height;
    padding: 0.5rem;
  }

  .content {
    height: layout.$safe-full-height;
    background: transparent;
    transition:
      height 0.5s var(--n-bezier),
      margin-top 0.5s var(--n-bezier);
  }

  .menu,
  .content .card:first-child {
    margin-top: layout.$safe-navbar-height;
  }

  &.floating {
    height: layout.$floating-content-height;
    margin-top: calc(0% - #{layout.$safe-area-inset-top});

    .content {
      height: calc(#{layout.$floating-content-height} - 0.75rem);
      margin-top: calc(0.75rem + #{layout.$safe-area-inset-top});
    }

    .menu {
      height: layout.$floating-content-height;
      margin-top: layout.$safe-area-inset-top;
      padding-top: 1.5rem;
    }
  }
}
</style>
