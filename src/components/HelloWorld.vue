<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  msg: string;
}>();

watch(
  () => props.msg,
  _msg => console.info(_msg),
);
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> + <a target="_blank" href="https://vuejs.org/">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<style scoped>
h1 {
  top: -10px;
  font-weight: 500;
  font-size: 2.6rem;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (width >= 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
