<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      fill-opacity="0"
      d="M17 14V17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V14z"
    >
      <animate
        fill="freeze"
        attributeName="fill-opacity"
        begin="0.8s"
        dur="0.15s"
        values="0;0.3"
      />
    </path>
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path
        stroke-dasharray="48"
        stroke-dashoffset="48"
        d="M17 9v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9z"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="48;0"
        />
      </path>
      <path
        stroke-dasharray="14"
        stroke-dashoffset="14"
        d="M17 14H20C20.55 14 21 13.55 21 13V10C21 9.45 20.55 9 20 9H17"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.6s"
          dur="0.2s"
          values="14;28"
        />
      </path>
    </g>
    <mask id="lineMdCoffeeHalfEmptyTwotoneLoop0">
      <path
        fill="none"
        stroke="#fff"
        stroke-width="2"
        d="M8 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M16 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4"
      >
        <animateMotion
          calcMode="linear"
          dur="3s"
          path="M0 0v-8"
          repeatCount="indefinite"
        />
      </path>
    </mask>
    <rect
      width="24"
      height="0"
      y="7"
      fill="currentColor"
      mask="url(#lineMdCoffeeHalfEmptyTwotoneLoop0)"
    >
      <animate fill="freeze" attributeName="y" begin="0.8s" dur="0.6s" values="7;2" />
      <animate
        fill="freeze"
        attributeName="height"
        begin="0.8s"
        dur="0.6s"
        values="0;5"
      />
    </rect>
  </svg>
</template>
