<script lang="ts" setup>
import { useI18n } from '~/utils';

const i18n = useI18n('global');
</script>

<template>
  <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="125" height="125" />
  <span>This is a login component</span>
</template>

<style lang="scss" scoped>
.logo {
  display: block;
  margin: 2rem auto;
}
</style>
