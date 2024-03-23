<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      stroke-dasharray="60"
      stroke-dashoffset="60"
      stroke-linecap="round"
      stroke-width="2.5"
      d="M12 5C21 5 21 5 21 12C21 19 21 19 12 19C3 19 3 19 3 12C3 5 3 5 12 5z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0" />
    </path>
    <path fill="currentColor" fill-opacity="0" d="M10 8.5L16 12L10 15.5z">
      <set attributeName="fill-opacity" begin="0.7s" to="1" />
      <animate
        fill="freeze"
        attributeName="d"
        begin="0.7s"
        dur="0.2s"
        values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z"
      />
    </path>
  </svg>
</template>
