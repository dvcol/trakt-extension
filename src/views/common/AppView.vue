<script setup lang="ts">
import { useI18n } from '@dvcol/web-extension-utils/lib/chrome/utils/i18n.utils';
import { RouterLink, RouterView } from 'vue-router';

import HelloWorld from '~/components/HelloWorld.vue';

const i18n = useI18n('global');
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">{{ i18n('app_name') }}</v-app-bar>

    <header>
      <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </v-app>
</template>

<style lang="scss">
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

header {
  max-height: 100vh;
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
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

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);

    & .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    margin-top: 1rem;
    margin-left: -1rem;
    padding: 1rem 0;
    font-size: 1rem;
    text-align: left;
  }
}
</style>
