<script setup>
import { ref } from 'vue';

const show = ref(false);
</script>

<template>
  <div class="about">
    <h1>This is an about page !</h1>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  color: green;
}
</style>
