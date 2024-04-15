<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
      <path
        stroke-dasharray="20"
        stroke-dashoffset="20"
        d="M5 21V20C5 17.7909 6.79086 16 9 16H13C15.2091 16 17 17.7909 17 20V21"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.4s"
          values="20;0"
        />
      </path>
      <path
        stroke-dasharray="20"
        stroke-dashoffset="20"
        d="M11 13C9.34315 13 8 11.6569 8 10C8 8.34315 9.34315 7 11 7C12.6569 7 14 8.34315 14 10C14 11.6569 12.6569 13 11 13Z"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.5s"
          dur="0.4s"
          values="20;0"
        />
      </path>
      <path stroke-dasharray="6" stroke-dashoffset="6" d="M20 3V7">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="1s"
          dur="0.2s"
          values="6;0"
        />
        <animate
          attributeName="stroke-width"
          begin="1.5s"
          dur="3s"
          keyTimes="0;0.1;0.2;0.3;1"
          repeatCount="indefinite"
          values="2;3;3;2;2"
        />
      </path>
    </g>
    <circle cx="20" cy="11" r="1" fill="currentColor" fill-opacity="0">
      <animate
        fill="freeze"
        attributeName="fill-opacity"
        begin="1.2s"
        dur="0.4s"
        values="0;1"
      />
      <animate
        attributeName="r"
        begin="1.8s"
        dur="3s"
        keyTimes="0;0.1;0.2;0.3;1"
        repeatCount="indefinite"
        values="1;2;2;1;1"
      />
    </circle>
  </svg>
</template>
