<script setup lang="ts">
import { computed, defineProps, onBeforeUnmount, onMounted, ref, Transition } from 'vue';

const props = withDefaults(defineProps<{ size: number }>(), { size: 16 });

const container = ref<Element>();

const viewportWidth = ref(container.value?.clientWidth ?? window.innerWidth);
const viewportHeight = ref(container.value?.clientHeight ?? window.innerHeight);
const numberOfSquares = computed(() =>
  Math.ceil((viewportWidth.value * viewportHeight.value) / (props.size * props.size)),
);

const handleResize = () => {
  if (!container.value) return;
  viewportWidth.value = container.value?.clientWidth;
  viewportHeight.value = container.value?.clientHeight;
};

onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => window.removeEventListener('resize', handleResize));
</script>

<template>
  <div
    ref="container"
    class="background-container"
    :style="`--grid-size: ${ props.size }px`"
  >
    <Transition name="fade" mode="in-out">
      <div v-if="container" class="grid-container">
        <div
          v-for="(_, i) in Array(numberOfSquares).fill(1)"
          :key="`row-${ i }`"
          class="grid-item"
        ></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/transition' as transition;
@include transition.fade;

.background-container {
  --grid-size: 16px;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .grid-container {
    display: grid;
    grid-template-rows: repeat(auto-fill, minmax(var(--grid-size), 1fr));
    grid-template-columns: repeat(auto-fill, minmax(var(--grid-size), 1fr));
    transform: skewX(-20deg) skewY(10deg) scale(2);
  }

  .grid-item {
    width: var(--grid-size);
    height: var(--grid-size);
    border-top: 0.1px solid var(--bg-blur-bg);
    border-left: 0.1px solid var(--bg-blur-bg);
    transition: background-color 0.25s var(--n-bezier);
    will-change: background-color;

    &:hover {
      background-color: var(--bg-blur-bg-hover);
      transition: none;
    }
  }
}
</style>
