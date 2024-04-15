<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <defs>
      <clipPath id="lineMdWatchLoop0">
        <rect width="24" height="12" />
      </clipPath>
      <symbol id="lineMdWatchLoop1">
        <path
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z"
          clip-path="url(#lineMdWatchLoop0)"
        >
          <animate
            attributeName="d"
            dur="6s"
            keyTimes="0;0.07;0.93;1"
            repeatCount="indefinite"
            values="M23 16.5C23 11.5 18.0751 12 12 12C5.92487 12 1 11.5 1 16.5z;M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z;M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z;M23 16.5C23 11.5 18.0751 12 12 12C5.92487 12 1 11.5 1 16.5z"
          />
        </path>
      </symbol>
      <mask id="lineMdWatchLoop2">
        <use href="#lineMdWatchLoop1" />
        <use href="#lineMdWatchLoop1" transform="rotate(180 12 12)" />
        <circle cx="12" cy="12" r="0" fill="#fff">
          <animate
            attributeName="r"
            dur="6s"
            keyTimes="0;0.03;0.97;1"
            repeatCount="indefinite"
            values="0;3;3;0"
          />
        </circle>
      </mask>
    </defs>
    <rect width="24" height="24" fill="currentColor" mask="url(#lineMdWatchLoop2)" />
  </svg>
</template>
