<script lang="ts" setup>
const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      :stroke-dasharray="disabled ? 0 : 28"
      :stroke-dashoffset="disabled ? 0 : 28"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"
    >
      <animate
        v-if="!disabled"
        fill="freeze"
        attributeName="stroke-dashoffset"
        dur="0.6s"
        values="28;0"
      />
    </path>
  </svg>
</template>
