<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g
      fill="none"
      stroke="currentColor"
      stroke-dasharray="18"
      stroke-dashoffset="18"
      stroke-linecap="round"
      stroke-width="2"
    >
      <path d="M12 5V19">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.4s"
          dur="0.3s"
          values="18;0"
        />
      </path>
      <path d="M5 12H19">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.3s"
          values="18;0"
        />
      </path>
    </g>
  </svg>
</template>
