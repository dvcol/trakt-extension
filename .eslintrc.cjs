module.exports = {
  root: true,
  plugins: ['@dvcol/presets'],
  extends: ['plugin:@dvcol/presets/vue', 'plugin:@dvcol/presets/jest', 'plugin:@dvcol/presets/vitest'],
  // to apply jest linting even-though we use vitest
  settings: { jest: { version: 27 } },
};
