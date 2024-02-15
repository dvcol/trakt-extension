<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
      <path
        stroke-dasharray="46"
        stroke-dashoffset="46"
        d="M16 5V4C16 3.44772 15.5523 3 15 3H6C5.44771 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H15C15.5523 21 16 20.5523 16 20V19"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.5s"
          values="46;0"
        />
      </path>
      <path stroke-dasharray="12" stroke-dashoffset="12" d="M10 12h11" opacity="0">
        <set attributeName="opacity" begin="0.6s" to="1" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.6s"
          dur="0.2s"
          values="12;0"
        />
      </path>
      <path
        stroke-dasharray="6"
        stroke-dashoffset="6"
        d="M21 12l-3.5 -3.5M21 12l-3.5 3.5"
        opacity="0"
      >
        <set attributeName="opacity" begin="0.8s" to="1" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.8s"
          dur="0.2s"
          values="6;0"
        />
      </path>
    </g>
  </svg>
</template>
