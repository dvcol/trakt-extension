module.exports = {
  root: true,
  plugins: ['@dvcol/presets'],
  extends: ['plugin:@dvcol/presets/vue', 'plugin:@dvcol/presets/vitest'],
  // to apply jest linting even-though we use vitest
  settings: { jest: { version: 27 } },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['/!(src)/**', '**/*.test.*', '**/*.spec.*', '**/*.config.*'] }],
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: ['^v-.*'],
      },
    ],
    'vitest/no-hooks': 'off',
    'vitest/max-expects': ['warn', { max: 10 }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'prettier/prettier': [
          'warn',
          {
            printWidth: 90,
            singleQuote: true,
            trailingComma: 'all',
            arrowParens: 'avoid',
            bracketSpacing: true,
          },
        ],
      },
    },
  ],
};
