export default {
  extends: ["@dvcol/stylelint-plugin-presets/config/vue"],
  rules: {
    "@dvcol/progress": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ['deep'],
      }
    ]
  }
}
