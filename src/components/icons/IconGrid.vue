<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g
      fill="currentColor"
      fill-opacity="0"
      stroke="currentColor"
      stroke-dasharray="10"
      stroke-dashoffset="10"
      stroke-linecap="round"
    >
      <g>
        <circle cx="5" cy="5" r="1.5" />
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="19" cy="5" r="1.5" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.15s"
          values="10;0"
        />
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="0.6s"
          dur="0.375s"
          values="0;1"
        />
      </g>
      <g>
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.3s"
          dur="0.15s"
          values="10;0"
        />
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="0.75s"
          dur="0.375s"
          values="0;1"
        />
      </g>
      <g>
        <circle cx="5" cy="19" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
        <circle cx="19" cy="19" r="1.5" />
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.45s"
          dur="0.15s"
          values="10;0"
        />
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="0.9s"
          dur="0.375s"
          values="0;1"
        />
      </g>
    </g>
  </svg>
</template>
