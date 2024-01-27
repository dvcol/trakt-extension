<script lang="ts" setup>
import { NButton, NButtonGroup } from 'naive-ui';
import { RouterLink } from 'vue-router';

import { Route } from '~/router';
import { useRouterStore } from '~/stores/router.store';
import { useI18n } from '~/utils';

const store = useRouterStore();
const i18n = useI18n('route');

const routes = [Route.Progress, Route.Calendar, Route.History, Route.List, Route.Search, Route.Settings];
</script>

<template>
  <nav>
    <NButtonGroup class="buttons">
      <template v-for="(route, index) in routes" :key="route">
        <RouterLink v-slot="{ href, navigate, isActive }" :to="`${ store.baseName }/${route}`" custom>
          <NButton :round="index === 0 || index === routes.length - 1" :class="{ active: isActive }" :href="href" @click="navigate">
            {{ i18n(route.toLowerCase()) }}
          </NButton>
        </RouterLink>
      </template>
    </NButtonGroup>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  margin: 1rem 0;
  font-size: 12px;
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: center;

  .active {
    color: var(--n-text-color-pressed);
    background-color: var(--n-color-pressed);
  }
}
</style>
