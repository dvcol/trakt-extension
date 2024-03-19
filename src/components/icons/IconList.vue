<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" stroke-linecap="round">
      <g stroke-dasharray="10" stroke-dashoffset="10">
        <circle cx="5" cy="5" r="1.5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.1s"
            values="10;0"
          />
        </circle>
        <circle cx="5" cy="12" r="1.5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.35s"
            dur="0.1s"
            values="10;0"
          />
        </circle>
        <circle cx="5" cy="19" r="1.5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.1s"
            values="10;0"
          />
        </circle>
      </g>
      <g stroke-dasharray="28" stroke-dashoffset="28">
        <rect width="11" height="3" x="9.5" y="3.5" rx="1.5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.05s"
            dur="0.25s"
            values="28;0"
          />
        </rect>
        <rect width="11" height="3" x="9.5" y="10.5" rx="1.5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.4s"
            dur="0.25s"
            values="28;0"
          />
        </rect>
        <rect width="11" height="3" x="9.5" y="17.5" rx="1.5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.75s"
            dur="0.25s"
            values="28;0"
          />
        </rect>
      </g>
    </g>
  </svg>
</template>
