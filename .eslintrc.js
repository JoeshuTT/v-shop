module.exports = {
  root: true,
  extends: ['alloy', 'alloy/vue', 'alloy/typescript'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    },
  },
  env: {
    browser: true,
  },
  globals: {
    wx: true,
  },
  rules: {
    // eslint
    'no-console': 'off',
    // @typescript-eslint
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    // vue
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true,
      },
    ],
  },
};
