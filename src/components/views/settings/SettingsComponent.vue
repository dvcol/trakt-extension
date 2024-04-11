<script lang="ts" setup>
import { NAnchor, NAnchorLink, NCard, NLayout, NLayoutSider } from 'naive-ui';

import { onDeactivated, type Ref, ref } from 'vue';

import { useI18n } from '~/utils';

const i18n = useI18n('settings');

type Section = {
  title: string;
  reference: Ref<[InstanceType<typeof NCard>] | undefined>;
};

const sections: Section[] = [
  { title: 'menu__account', reference: ref() },
  { title: 'menu__cache', reference: ref() },
  { title: 'menu__tabs', reference: ref() },
  { title: 'menu__logs', reference: ref() },
  { title: 'menu__links', reference: ref() },
];

const focus = ref(false);
const target = ref();

const scrollTo = (section: Section) => {
  target.value = section;
  focus.value = true;
  section.reference?.value?.[0]?.$el?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

onDeactivated(() => {
  target.value = undefined;
  focus.value = false;
});
</script>

<template>
  <NLayout class="container" has-sider>
    <NLayoutSider
      class="menu"
      bordered
      collapse-mode="width"
      width="5.125rem"
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
        padding: '1rem 1rem',
      }"
    >
      <NCard
        v-for="section in sections"
        :id="section.title"
        :ref="section.reference"
        :key="section.title"
        class="card"
        :class="{ target: focus && target?.title === section.title }"
        :title="i18n(section.title)"
        @mouseenter="target = section"
        @mouseleave="focus = false"
      >
        card Content
      </NCard>
    </NLayout>
  </NLayout>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/layout' as layout;

.container {
  width: 100%;
  height: 100dvh;
  margin-top: -#{layout.$header-navbar-height};
  background: transparent;

  .card {
    @include mixin.hover-background($from: var(--bg-black-50), $to: var(--bg-color-80));

    min-height: 20rem;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    &.target {
      border-color: var(--n-color-target);
    }
  }

  .menu {
    @include mixin.hover-background;

    padding: 0.5rem;
  }

  .content {
    background: transparent;
  }

  .menu,
  .content .card:first-child {
    margin-top: layout.$header-navbar-height;
  }
}
</style>
