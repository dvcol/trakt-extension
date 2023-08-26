<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

import HelloWorld from '~/components/HelloWorld.vue';
import { useRouterStore } from '~/stores/router.store';
import { useI18n } from '~/utils';

const i18n = useI18n('global');
const store = useRouterStore();
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="i18n('app_name')" />

      <nav>
        <RouterLink :to="`${store.baseName}/`">Home</RouterLink>
        <RouterLink :to="`${store.baseName}/about`">About</RouterLink>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

main {
  padding: 0 2rem;
}

.logo {
  display: block;
  margin: 2rem auto;
}

nav {
  margin-top: 2rem;
  font-size: 12px;
  text-align: center;

  & a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);

    &.router-link-exact-active {
      color: var(--color-text);

      &:hover,
      &:focus {
        background-color: transparent;
      }
    }

    &:first-of-type {
      border: 0;
    }
  }
}
</style>
