<script setup lang="ts">
import { onActivated } from 'vue';

const props = defineProps({
  movieId: {
    type: String,
    required: false,
  },
});

onActivated(() => {
  console.info('MovieDrawer activated', props.movieId);
});
</script>

<template>
  <div>movie {{ movieId }}</div>
</template>
