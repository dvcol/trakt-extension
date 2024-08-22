<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
      <path
        stroke-dasharray="32"
        stroke-dashoffset="32"
        d="M13 4L20 4C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H13"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="32;0"
        />
      </path>
      <path stroke-dasharray="12" stroke-dashoffset="12" d="M3 12h11.5" opacity="0">
        <set attributeName="opacity" begin="0.5s" to="1" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.5s"
          dur="0.2s"
          values="12;0"
        />
      </path>
      <path
        stroke-dasharray="6"
        stroke-dashoffset="6"
        d="M14.5 12l-3.5 -3.5M14.5 12l-3.5 3.5"
        opacity="0"
      >
        <set attributeName="opacity" begin="0.7s" to="1" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.7s"
          dur="0.2s"
          values="6;0"
        />
      </path>
    </g>
  </svg>
</template>
