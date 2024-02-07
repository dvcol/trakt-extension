<script lang="ts" setup>
import { NTab, NTabs } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';

import { Route } from '~/router';
import { useI18n } from '~/utils';

const i18n = useI18n('route');
const route = useRoute();
const router = useRouter();

const navigate = (to: Route) => {
  router.push(to);
};

const routes = [Route.Progress, Route.Calendar, Route.History, Route.List, Route.Search, Route.Settings];
</script>

<template>
  <nav>
    <NTabs :value="route.name" class="tabs" type="segment" justify-content="space-evenly" animated>
      <template v-for="_route in routes" :key="_route">
        <NTab class="tab" :name="_route.toLowerCase()" type="segment" @click="navigate(_route)">
          {{ i18n(_route.toLowerCase()) }}
        </NTab>
      </template>
    </NTabs>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  margin: 0 0.25rem;
  font-size: 12px;
  text-align: center;

  a {
    color: inherit; /* blue colors for links too */
    text-decoration: inherit; /* no underline */
  }

  .tabs {
    display: flex;
    justify-content: center;
    min-height: 2.75rem;
  }
}
</style>

<style lang="scss">
nav {
  .tabs {
    --n-bar-color: var(--trakt-red-dark) !important;
    --n-tab-text-color-active: var(--vt-c-white) !important;
    --n-tab-text-color-hover: color-mix(in srgb, var(--trakt-red) 90%, var(--vt-c-white)) !important;
    --n-tab-color-segment: color-mix(in srgb, var(--trakt-red) 50%, transparent) !important;
    --n-color-segment: inherit !important;

    /* stylelint-disable-next-line selector-class-pattern -- overriding theme class  */
    .n-tabs-tab--active {
      --n-tab-text-color-hover: color-mix(in srgb, var(--trakt-white) 99%, var(--vt-c-red)) !important;
    }

    .n-tabs-capsule {
      backdrop-filter: blur(1px);
    }
  }
}
</style>
