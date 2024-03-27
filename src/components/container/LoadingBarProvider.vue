<script setup lang="ts">
import { useLoadingBar } from 'naive-ui';

import { LoadingBarService } from '~/services/loading-bar.service';

LoadingBarService.init(useLoadingBar());
</script>

<template>
  <div id="loading-bar-provider" hidden style="display: none" />
</template>
