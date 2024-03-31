<script setup lang="ts">
import { NButton } from 'naive-ui';
import { onActivated } from 'vue';

const props = defineProps({
  movieId: {
    type: String,
    required: false,
  },
  personId: {
    type: String,
    required: false,
  },
  showId: {
    type: String,
    required: false,
  },
  seasonId: {
    type: String,
    required: false,
  },
  episodeId: {
    type: String,
    required: false,
  },
});

const emit = defineEmits<{
  (event: 'close'): void;
}>();

onActivated(() => {
  console.info('MovieDrawer activated', JSON.stringify(props, null, 2));
});
</script>

<template>
  <NButton quaternary @click="emit('close')"> Default </NButton>
  <div>Movie Drawer</div>
  <div>movie {{ movieId }}</div>
  <div>person {{ personId }}</div>
  <div>show {{ showId }}</div>
  <div>season {{ seasonId }}</div>
  <div>episode {{ episodeId }}</div>
</template>
