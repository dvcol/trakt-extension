<script setup lang="ts">
import { NButton, NButtonGroup } from 'naive-ui';
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
        <NButtonGroup class="buttons">
          <RouterLink v-slot="{ href, navigate, isActive }" :to="`${ store.baseName }/`" custom>
            <NButton round :class="{ active: isActive }" :href="href" @click="navigate">Home</NButton>
          </RouterLink>
          <RouterLink v-slot="{ href, navigate, isActive }" :to="`${store.baseName}/about`" custom>
            <NButton round :class="{ active: isActive }" :href="href" @click="navigate">About</NButton>
          </RouterLink>
        </NButtonGroup>
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

  nav {
    margin-top: 2rem;
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
}

main {
  padding: 0 2rem;
}

.logo {
  display: block;
  margin: 2rem auto;
}
</style>
