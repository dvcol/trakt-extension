<script setup lang="ts">
import { onActivated } from 'vue';

const props = defineProps({
  personId: {
    type: String,
    required: false,
  },
});

onActivated(() => {
  console.info('PersonPanel activated', props.personId);
});
</script>

<template>
  <div>person {{ personId }}</div>
</template>
