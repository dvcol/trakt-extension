<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 21H17M12 21H7">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.3s"
          values="6;0"
        />
      </path>
      <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 21V17">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.2s"
          values="6;0"
        />
      </path>
      <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 17H3V5H21V17Z">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.3s"
          dur="0.6s"
          values="64;0"
        />
      </path>
    </g>
  </svg>
</template>
